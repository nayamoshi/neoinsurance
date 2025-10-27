'use client';

import { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/hooks/use-auth';
import type { Wallet, User } from '@/lib/types';
import { ConnectView } from '@/components/views/ConnectView';
import { LockView } from '@/components/views/LockView';
import { getStoredWallet, clearStoredWallet, unlockWallet } from '@/lib/wallet';
import { useInactivityTimeout } from '@/hooks/useInactivityTimeout';

export default function AuthPage() {
  const router = useRouter();
  const { user, login, logout } = useAuth();
  const [isLocked, setIsLocked] = useState(false);
  const [storedWalletInfo, setStoredWalletInfo] = useState<any | null>(null);

  const handleLock = useCallback(() => {
    if (user) {
      logout();
      setIsLocked(true);
    }
  }, [user, logout]);

  useInactivityTimeout(handleLock);

  useEffect(() => {
    const checkStoredWallet = async () => {
      const stored = await getStoredWallet();
      if (stored) {
        setStoredWalletInfo(stored);
        if (!user) {
          setIsLocked(true);
        }
      }
    };
    checkStoredWallet();
  }, [user]);

  const handleLoginComplete = (wallet: Wallet, user: User, isNewUser: boolean) => {
    login(wallet.address, wallet.privateKey);
    router.push('/dashboard');
  };

  const handleUnlock = async (password: string) => {
    if (!storedWalletInfo) return false;
    try {
      const wallet = await unlockWallet(password);
      login(wallet.address, wallet.privateKey);
      setIsLocked(false);
      setStoredWalletInfo(null); 
      router.push('/dashboard');
      return true;
    } catch (error) {
      console.error("Failed to unlock wallet:", error);
      return false;
    }
  };

  const handleDisconnect = () => {
    clearStoredWallet();
    logout();
    setIsLocked(false);
    setStoredWalletInfo(null);
  };
  
  if (isLocked && storedWalletInfo) {
    return (
       <main className="flex min-h-screen flex-col items-center justify-center bg-background p-4">
        <div className="w-full max-w-md">
          <LockView 
            onUnlock={handleUnlock}
            onDisconnect={handleDisconnect} 
            walletInfo={storedWalletInfo}
          />
        </div>
      </main>
    );
  }

  return (
    <main className="flex min-h-screen flex-col items-center justify-center bg-background p-4">
      <div className="w-full max-w-md">
        <ConnectView onLoginComplete={handleLoginComplete} />
      </div>
    </main>
  );
}
