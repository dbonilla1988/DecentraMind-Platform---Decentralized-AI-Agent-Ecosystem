'use client';

import { useState, useEffect } from 'react';

export interface WalletBalance {
  dmt: number;
  eth: number;
  sol: number;
  usdc: number;
}

export interface UnlockStatus {
  nftOwned: boolean;
  subscriptionActive: boolean;
  tokenBalanceSufficient: boolean;
}

const DEFAULT_BALANCE: WalletBalance = {
  dmt: 15000,
  eth: 2.5,
  sol: 15.8,
  usdc: 500
};

export const useWalletBalance = () => {
  const [balance, setBalance] = useState<WalletBalance>(DEFAULT_BALANCE);
  const [isLoading, setIsLoading] = useState(false);

  // Load balance from localStorage on mount
  useEffect(() => {
    const savedBalance = localStorage.getItem('wallet_balance');
    if (savedBalance) {
      try {
        setBalance(JSON.parse(savedBalance));
      } catch (error) {
        console.error('Error parsing saved balance:', error);
        setBalance(DEFAULT_BALANCE);
      }
    }
  }, []);

  // Save balance to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem('wallet_balance', JSON.stringify(balance));
  }, [balance]);

  const updateBalance = (updates: Partial<WalletBalance>) => {
    setBalance(prev => ({ ...prev, ...updates }));
  };

  const spendTokens = (amount: number, currency: keyof WalletBalance = 'dmt') => {
    if (balance[currency] >= amount) {
      updateBalance({ [currency]: balance[currency] - amount });
      return true;
    }
    return false;
  };

  const addTokens = (amount: number, currency: keyof WalletBalance = 'dmt') => {
    updateBalance({ [currency]: balance[currency] + amount });
  };

  const checkUnlockStatus = (subAgent: any): UnlockStatus => {
    const nftOwned = localStorage.getItem(`nft_${subAgent.id}`) === 'true';
    const subscriptionActive = localStorage.getItem(`subscription_${subAgent.id}`) === 'true';
    const tokenBalanceSufficient = subAgent.model === 'TokenUnlock' 
      ? balance.dmt >= (subAgent.tokenRequirement || 0)
      : false;

    return {
      nftOwned,
      subscriptionActive,
      tokenBalanceSufficient
    };
  };

  const isAgentUnlocked = (subAgent: any): boolean => {
    const status = checkUnlockStatus(subAgent);
    return status.nftOwned || status.subscriptionActive || status.tokenBalanceSufficient;
  };

  const unlockAgent = (subAgent: any, method: 'nft' | 'subscription' | 'token') => {
    switch (method) {
      case 'nft':
        if (spendTokens(subAgent.price || 0)) {
          localStorage.setItem(`nft_${subAgent.id}`, 'true');
          return true;
        }
        break;
      case 'subscription':
        if (spendTokens(subAgent.subscriptionMonthly || 0)) {
          localStorage.setItem(`subscription_${subAgent.id}`, 'true');
          return true;
        }
        break;
      case 'token':
        // Token unlock doesn't spend tokens, just checks balance
        if (balance.dmt >= (subAgent.tokenRequirement || 0)) {
          return true;
        }
        break;
    }
    return false;
  };

  return {
    balance,
    isLoading,
    updateBalance,
    spendTokens,
    addTokens,
    checkUnlockStatus,
    isAgentUnlocked,
    unlockAgent
  };
};















