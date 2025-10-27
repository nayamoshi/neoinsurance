import { ethers, wordlists } from 'ethers';
import type { Wallet as EthersWallet } from 'ethers';
import type { StoredWallet, Wallet as AppWallet } from './types';

// Re-export the bip39 wordlist for use in the UI
export const bip39Wordlist = wordlists.en;

export const createWallet = (): { address: string; privateKey: string; seedPhrase: string } => {
  const wallet = ethers.Wallet.createRandom();
  return {
    address: wallet.address,
    privateKey: wallet.privateKey,
    seedPhrase: wallet.mnemonic!.phrase,
  };
};

export const importWalletFromSeed = async (seedPhrase: string): Promise<{ address: string; privateKey: string; seedPhrase: string }> => {
  try {
    const wallet = ethers.Wallet.fromPhrase(seedPhrase);
    return {
      address: wallet.address,
      privateKey: wallet.privateKey,
      seedPhrase: seedPhrase,
    };
  } catch (error) {
    throw new Error('Invalid seed phrase. Please check your words and try again.');
  }
};


export const storeWallet = async (wallet: { privateKey: string }, password: string): Promise<string> => {
  const ethersWallet = new ethers.Wallet(wallet.privateKey);
  const encryptedJson = await ethersWallet.encrypt(password);
  localStorage.setItem('encryptedWallet', encryptedJson);
  // Store non-sensitive info for lock screen
  const storedWalletInfo: Omit<StoredWallet, 'encryptedJson'> = {
    address: ethersWallet.address,
  };
  localStorage.setItem('walletInfo', JSON.stringify(storedWalletInfo));
  return encryptedJson;
};

export const clearStoredWallet = () => {
  localStorage.removeItem('encryptedWallet');
  localStorage.removeItem('walletInfo');
};

export const getStoredWallet = (): StoredWallet | null => {
  const encryptedJson = localStorage.getItem('encryptedWallet');
  const walletInfo = localStorage.getItem('walletInfo');
  if (encryptedJson && walletInfo) {
    return { ...JSON.parse(walletInfo), encryptedJson };
  }
  return null;
};

export const unlockWallet = async (password: string): Promise<AppWallet> => {
  const encryptedJson = localStorage.getItem('encryptedWallet');
  if (!encryptedJson) {
    throw new Error('No wallet found in storage.');
  }
  try {
    const wallet = await ethers.Wallet.fromEncryptedJson(encryptedJson, password);
    return {
      address: wallet.address,
      privateKey: wallet.privateKey,
      seedPhrase: wallet.mnemonic!.phrase, // Note: This will be null if unlocked from JSON
    };
  } catch (error) {
    // This typically means an incorrect password
    throw new Error('Failed to decrypt wallet. Incorrect password.');
  }
};

export const validatePassword = (password: string) => {
    const commonPasswords = ['123456', 'password', '12345678', 'qwerty']; // Simplified list
    
    const length = password.length >= 8;
    const uppercase = /[A-Z]/.test(password);
    const lowercase = /[a-z]/.test(password);
    const number = /[0-9]/.test(password);
    const special = /[!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?]/.test(password);
    const common = !commonPasswords.includes(password);

    return {
        length,
        uppercase,
        lowercase,
        number,
        special,
        common,
    };
};
