// src/app/api/wallet/create/route.ts
import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import { z } from 'zod';
import { ethers } from 'ethers';

const CreateWalletRequestSchema = z.object({
  walletAddress: z.string().regex(/^0x[a-fA-F0-9]{40}$/, "Invalid wallet address."),
});

// Supabase Admin Client for server-side operations
const supabaseAdmin = createClient(
  'https://nawslaucfeqcqlnynsks.supabase.co',
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im5hd3NsYXVjZmVxY3Fsbnluc2tzIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjA2NDczNDMsImV4cCI6MjA3NjIyMzM0M30.eGXIAavDS6D4LZH46Az1AEXMnQNiPEmuWYaNU9rP1tw'
);

const PYUSD_ABI = [
  "function balanceOf(address) view returns (uint256)",
];

const provider = new ethers.JsonRpcProvider(process.env.NEXT_PUBLIC_ARBITRUM_SEPOLIA_RPC_URL!);
const pyusdContract = new ethers.Contract(process.env.NEXT_PUBLIC_PYUSD_CONTRACT_ADDRESS!, PYUSD_ABI, provider);


async function findUserByWallet(walletAddress: string) {
    const { data: user, error } = await supabaseAdmin
        .from('users')
        .select('*')
        .eq('wallet_address', walletAddress)
        .single();
    
    // error.code 'PGRST116' means no rows found, which is not a fatal error here.
    if (error && error.code !== 'PGRST116') {
        console.error('Error finding user by wallet:', error);
        throw new Error('Database error while searching for user.');
    }
    return user;
}

async function findOrCreateUser(walletAddress: string) {
    let user = await findUserByWallet(walletAddress);
    if (!user) {
        const { data: newUser, error: insertError } = await supabaseAdmin
            .from('users')
            .insert({ wallet_address: walletAddress, reputation_score: 87 })
            .select()
            .single();

        if (insertError) {
            console.error('Error creating user record:', insertError);
            throw new Error('Could not create user record.');
        }
        user = newUser;
    }
    return user;
}


async function findOrCreateWallet(userId: string, walletAddress: string, walletType: string) {
    let { data: wallet, error } = await supabaseAdmin
        .from('wallets')
        .select('*')
        .eq('address', walletAddress)
        .single();

    if (error && error.code !== 'PGRST116') {
        console.error('Error finding wallet:', error);
        throw new Error('Database error while searching for wallet.');
    }

    if (!wallet) {
        const { data: newWallet, error: insertError } = await supabaseAdmin
            .from('wallets')
            .insert({ user_id: userId, address: walletAddress, wallet_type: walletType })
            .select()
            .single();

        if (insertError) {
            console.error('Error creating wallet record:', insertError);
            throw new Error('Could not create wallet record.');
        }
        wallet = newWallet;
    }
    return wallet;
}

export async function POST(request: Request) {
    try {
        const body = await request.json();
        const validation = CreateWalletRequestSchema.safeParse(body);

        if (!validation.success) {
            return NextResponse.json({ error: { code: 'BAD_REQUEST', details: validation.error.flatten() } }, { status: 400 });
        }
        
        const { walletAddress } = validation.data;

        // Find or create the user record to link the wallet.
        const user = await findOrCreateUser(walletAddress);
        
        // Now that we have a valid user, find or create the wallet entry.
        const wallet = await findOrCreateWallet(user.id, walletAddress, 'zerodev');
        
        // Fetch the real-time balance from the blockchain.
        const balanceWei = await pyusdContract.balanceOf(walletAddress);
        const balance = ethers.formatUnits(balanceWei, 6);

        return NextResponse.json({
            user,
            wallet: {
                ...wallet,
                balance: Number(balance), // Ensure balance is a number
            },
            message: `✅ Smart account created/retrieved for wallet: ${wallet.address}`,
        });

    } catch (error) {
        const message = error instanceof Error ? error.message : 'An unexpected error occurred.';
        console.error('Error in /api/wallet/create:', error);
        return NextResponse.json({ error: { code: 'INTERNAL_SERVER_ERROR', message } }, { status: 500 });
    }
}
