'use client';

import React, { createContext, useContext, useEffect, useState, useCallback } from 'react';

interface WalletContextType {
  isConnected: boolean;
  walletAddress: string | null;
  shortAddress: string | null;
  connectWallet: () => Promise<void>;
  disconnectWallet: () => void;
  copyAddress: () => void;
  checkAgentMintEligibility: (address: string) => Promise<boolean>;
  mintAgent: (agentType: string) => Promise<void>;
  isLoading: boolean;
  error: string | null;
}

const WalletContext = createContext<WalletContextType | undefined>(undefined);

export const useWallet = () => {
  const context = useContext(WalletContext);
  if (!context) {
    throw new Error('useWallet must be used within a WalletProvider');
  }
  return context;
};

interface WalletProviderProps {
  children: React.ReactNode;
}

export const WalletProvider: React.FC<WalletProviderProps> = ({ children }) => {
  const [isConnected, setIsConnected] = useState(false);
  const [walletAddress, setWalletAddress] = useState<string | null>(null);
  const [shortAddress, setShortAddress] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Format wallet address for display
  const formatAddress = (address: string): string => {
    if (address.length <= 8) return address;
    return `${address.slice(0, 4)}...${address.slice(-4)}`;
  };

  // Load wallet state from localStorage on mount
  useEffect(() => {
    const savedWallet = localStorage.getItem('decentramind_wallet_address');
    const savedConnection = localStorage.getItem('decentramind_wallet_connected');
    
    if (savedWallet && savedConnection === 'true') {
      setWalletAddress(savedWallet);
      setShortAddress(formatAddress(savedWallet));
      setIsConnected(true);
    }
  }, []);

  // Connect wallet function
  const connectWallet = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    
    try {
      // Simulate wallet connection (replace with actual wallet adapter)
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Mock wallet address (replace with actual wallet address)
      const mockAddress = '3sdP9weT8kL2mN4qR7vX1yZ6hJ5cB8nM3pQ9sA2dF4gH7jK';
      
      setWalletAddress(mockAddress);
      setShortAddress(formatAddress(mockAddress));
      setIsConnected(true);
      
      // Save to localStorage
      localStorage.setItem('decentramind_wallet_address', mockAddress);
      localStorage.setItem('decentramind_wallet_connected', 'true');
      
      // Show success toast
      showToast('success', `✅ Wallet Connected: ${formatAddress(mockAddress)}`);
      
    } catch (err) {
      setError('Failed to connect wallet');
      showToast('error', '❌ Failed to connect wallet');
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Disconnect wallet function
  const disconnectWallet = useCallback(() => {
    setWalletAddress(null);
    setShortAddress(null);
    setIsConnected(false);
    setError(null);
    
    // Clear localStorage
    localStorage.removeItem('decentramind_wallet_address');
    localStorage.removeItem('decentramind_wallet_connected');
    
    showToast('info', '🔌 Wallet Disconnected');
  }, []);

  // Copy address to clipboard
  const copyAddress = useCallback(async () => {
    if (walletAddress) {
      try {
        await navigator.clipboard.writeText(walletAddress);
        showToast('success', '📋 Address copied to clipboard');
      } catch (err) {
        showToast('error', '❌ Failed to copy address');
      }
    }
  }, [walletAddress]);

  // Check agent mint eligibility
  const checkAgentMintEligibility = useCallback(async (address: string): Promise<boolean> => {
    try {
      // Simulate API call to check eligibility
      await new Promise(resolve => setTimeout(resolve, 500));
      
      // Mock logic: check if user has minted max agents (3)
      const mintedAgents = localStorage.getItem(`minted_agents_${address}`) || '0';
      const agentCount = parseInt(mintedAgents);
      
      return agentCount < 3; // Max 3 agents per wallet
    } catch (err) {
      console.error('Error checking mint eligibility:', err);
      return false;
    }
  }, []);

  // Mint agent function
  const mintAgent = useCallback(async (agentType: string) => {
    if (!walletAddress) {
      showToast('error', '❌ Please connect your wallet first');
      return;
    }

    setIsLoading(true);
    try {
      // Check eligibility first
      const isEligible = await checkAgentMintEligibility(walletAddress);
      if (!isEligible) {
        showToast('error', '❌ You have reached your agent mint limit (3 agents)');
        return;
      }

      // Simulate minting process
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Update minted agents count
      const currentCount = parseInt(localStorage.getItem(`minted_agents_${walletAddress}`) || '0');
      localStorage.setItem(`minted_agents_${walletAddress}`, (currentCount + 1).toString());
      
      showToast('success', `🎉 Agent Minted Successfully to Wallet: ${shortAddress}`);
      
    } catch (err) {
      showToast('error', '❌ Failed to mint agent');
    } finally {
      setIsLoading(false);
    }
  }, [walletAddress, shortAddress, checkAgentMintEligibility]);

  // Toast notification function
  const showToast = (type: 'success' | 'error' | 'info', message: string) => {
    // Create toast element
    const toast = document.createElement('div');
    toast.className = `fixed top-4 right-4 z-50 px-6 py-3 rounded-lg shadow-lg transition-all duration-300 ${
      type === 'success' ? 'bg-green-600 text-white' :
      type === 'error' ? 'bg-red-600 text-white' :
      'bg-blue-600 text-white'
    }`;
    toast.textContent = message;
    
    document.body.appendChild(toast);
    
    // Animate in
    setTimeout(() => {
      toast.style.transform = 'translateX(0)';
      toast.style.opacity = '1';
    }, 100);
    
    // Remove after 3 seconds
    setTimeout(() => {
      toast.style.transform = 'translateX(100%)';
      toast.style.opacity = '0';
      setTimeout(() => {
        document.body.removeChild(toast);
      }, 300);
    }, 3000);
  };

  const value: WalletContextType = {
    isConnected,
    walletAddress,
    shortAddress,
    connectWallet,
    disconnectWallet,
    copyAddress,
    checkAgentMintEligibility,
    mintAgent,
    isLoading,
    error,
  };

  return (
    <WalletContext.Provider value={value}>
      {children}
    </WalletContext.Provider>
  );
};
