export interface User {
  walletAddress: string;
  reputationScore: number;
  privateKey?: string; // For demo purposes only, DO NOT use in production
}

export interface Coverage {
  id: string;
  category: string;
  value: number;
  fee: number;
  duration: number;
  status: 'Active' | 'Expired' | 'Claimed';
}

export interface Wallet {
    address: string;
    privateKey: string;
    seedPhrase: string;
}

export interface StoredWallet {
  address: string;
  encryptedJson: string;
}
