'use client';

import React, { createContext, useState, useEffect, useCallback, useMemo } from 'react';
import type { User, Coverage, Wallet } from '@/lib/types';
import { usePyusd } from '@/hooks/usePyusd';

// Theme Provider
type Theme = 'dark' | 'light' | 'system';

type ThemeProviderState = {
  theme: Theme;
  setTheme: (theme: Theme) => void;
};

const initialThemeState: ThemeProviderState = {
  theme: 'system',
  setTheme: () => null,
};

export const ThemeProviderContext = createContext<ThemeProviderState>(initialThemeState);

function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [theme, setTheme] = useState<Theme>(() => {
    if (typeof window !== 'undefined') {
      return (localStorage.getItem('theme') as Theme) || 'system';
    }
    return 'system';
  });

  useEffect(() => {
    const root = window.document.documentElement;
    root.classList.remove('light', 'dark');

    if (theme === 'system') {
      const systemTheme = window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
      root.classList.add(systemTheme);
      return;
    }

    root.classList.add(theme);
  }, [theme]);

  const value = {
    theme,
    setTheme: (theme: Theme) => {
      if (typeof window !== 'undefined') {
        localStorage.setItem('theme', theme);
      }
      setTheme(theme);
    },
  };

  return (
    <ThemeProviderContext.Provider value={value}>
      {children}
    </ThemeProviderContext.Provider>
  );
}

// Auth Provider
const mockCoverages: Coverage[] = [
  {
    id: '#COV-123',
    category: 'Hospitality',
    value: 1500,
    fee: 1.4,
    duration: 7,
    status: 'Active',
  },
  {
    id: '#COV-124',
    category: 'Car Rental',
    value: 2000,
    fee: 2.1,
    duration: 10,
    status: 'Expired',
  },
   {
    id: '#COV-125',
    category: 'Freelance',
    value: 500,
    fee: 3.0,
    duration: 30,
    status: 'Active',
  },
   {
    id: '#COV-126',
    category: 'P2P',
    value: 800,
    fee: 2.5,
    duration: 14,
    status: 'Active',
  },
];


type AuthContextType = {
  user: User | null;
  coverages: Coverage[];
  login: (walletAddress: string, privateKey: string) => void;
  logout: () => void;
  addCoverage: (coverage: Coverage) => void;
  pyusdBalance: string | null;
  approve: (spender: string, amount: number) => Promise<any>;
  transfer: (to: string, amount: number) => Promise<any>;
};

export const AuthContext = createContext<AuthContextType>({
  user: null,
  coverages: [],
  login: () => {},
  logout: () => {},
  addCoverage: () => {},
  pyusdBalance: null,
  approve: async () => {},
  transfer: async () => {},
});

function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [coverages, setCoverages] = useState<Coverage[]>([]);
  const { balance, approve, transfer, setWallet } = usePyusd();

  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      const parsedUser = JSON.parse(storedUser);
      setUser(parsedUser);
      // We need private key to initialize the wallet for transactions
      // This is not ideal for production, but it's okay for a demo.
      // In a real app, the private key would be handled by a secure wallet provider.
      const wallet = localStorage.getItem('encryptedWallet'); // This is a placeholder, we'd need to decrypt it.
      if(wallet && parsedUser.privateKey) { // Assuming private key is stored for demo purposes
          setWallet(parsedUser.privateKey);
      }
    }
    const storedCoverages = localStorage.getItem('coverages');
    setCoverages(storedCoverages ? JSON.parse(storedCoverages) : mockCoverages);
  }, [setWallet]);

  const login = useCallback((walletAddress: string, privateKey: string) => {
    const mockUser: User = {
      walletAddress,
      reputationScore: 87, // Mock data
      privateKey, // Storing private key for demo purposes. NOT FOR PRODUCTION.
    };
    localStorage.setItem('user', JSON.stringify(mockUser));
    setUser(mockUser);
    setWallet(privateKey);
  }, [setWallet]);

  const logout = useCallback(() => {
    localStorage.removeItem('user');
    localStorage.removeItem('coverages');
    setUser(null);
    setCoverages([]);
  }, []);
  
  const addCoverage = useCallback((coverage: Coverage) => {
    setCoverages(prevCoverages => {
      const newCoverages = [...prevCoverages, coverage];
      localStorage.setItem('coverages', JSON.stringify(newCoverages));
      return newCoverages;
    })
  }, []);


  const value = useMemo(() => ({ 
      user, 
      coverages, 
      login, 
      logout, 
      addCoverage,
      pyusdBalance: balance,
      approve,
      transfer
    }), [user, coverages, login, logout, addCoverage, balance, approve, transfer]);

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

// Combined Providers
export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <ThemeProvider>
      <AuthProvider>{children}</AuthProvider>
    </ThemeProvider>
  );
}
