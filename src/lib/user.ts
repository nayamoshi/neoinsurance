import type { User } from './types';

// Mock user management
export const getOrCreateUser = async (walletAddress: string) => {
  // In a real app, this would make an API call to your backend
  console.log(`Getting or creating user for wallet: ${walletAddress}`);

  // We call our own API route to handle user/wallet creation and balance fetching
  const response = await fetch('/api/wallet', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ walletAddress }),
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.error?.message || 'Failed to get or create user.');
  }
  
  // The API returns the user and wallet objects
  return data;
};
