'use client';

import { useState, useEffect, useCallback } from 'react';
import { ethers } from 'ethers';

const PYUSD_ABI = [
  "function name() view returns (string)",
  "function symbol() view returns (string)",
  "function balanceOf(address) view returns (uint256)",
  "function transfer(address to, uint amount) returns (bool)",
  "function approve(address spender, uint256 amount) returns (bool)",
];

const PYUSD_CONTRACT_ADDRESS = process.env.NEXT_PUBLIC_PYUSD_CONTRACT_ADDRESS!;
const RPC_URL = process.env.NEXT_PUBLIC_ARBITRUM_SEPOLIA_RPC_URL!;

export const usePyusd = () => {
  const [signer, setSigner] = useState<ethers.Wallet | null>(null);
  const [contract, setContract] = useState<ethers.Contract | null>(null);
  const [balance, setBalance] = useState<string | null>(null);

  const setWallet = useCallback((privateKey: string) => {
    const provider = new ethers.JsonRpcProvider(RPC_URL);
    const wallet = new ethers.Wallet(privateKey, provider);
    const pyusdContract = new ethers.Contract(PYUSD_CONTRACT_ADDRESS, PYUSD_ABI, wallet);
    setSigner(wallet);
    setContract(pyusdContract);
  }, []);

  const getBalance = useCallback(async () => {
    if (contract && signer) {
      try {
        const bal = await contract.balanceOf(signer.address);
        const formattedBalance = ethers.formatUnits(bal, 6);
        setBalance(formattedBalance);
        return formattedBalance;
      } catch (error) {
        console.error("Error fetching balance:", error);
        setBalance(null);
        return null;
      }
    }
    return null;
  }, [contract, signer]);

  useEffect(() => {
    if (contract && signer) {
      getBalance();
    }
  }, [contract, signer, getBalance]);

  const approve = async (spender: string, amount: number) => {
    if (!contract || !signer) throw new Error("Wallet not connected");
    const amountToApprove = ethers.parseUnits(amount.toString(), 6);
    try {
      const tx = await contract.approve(spender, amountToApprove);
      await tx.wait();
      return tx;
    } catch (error) {
      console.error("Approval failed", error);
      throw error;
    }
  };

  const transfer = async (to: string, amount: number) => {
    if (!contract || !signer) throw new Error("Wallet not connected");
    const amountToTransfer = ethers.parseUnits(amount.toString(), 6);
    try {
      const tx = await contract.transfer(to, amountToTransfer);
      await tx.wait();
      await getBalance(); // Refresh balance after transfer
      return tx;
    } catch (error) {
      console.error("Transfer failed", error);
      throw error;
    }
  };

  return { balance, setWallet, getBalance, approve, transfer };
};
