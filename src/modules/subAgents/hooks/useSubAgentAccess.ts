'use client';

import { useState, useEffect } from 'react';
import { SubAgent } from '../utils/subAgentTypes';

export interface SubAgentAccess {
  hasAccess: boolean;
  accessType: 'nft' | 'subscription' | 'unlock' | 'none';
  reason?: string;
  unlockPrice?: number;
  subscriptionPrice?: number;
  tokenRequirement?: number;
}

// Mock user data - in production this would come from wallet/backend
declare global {
  interface Window {
    userNFTs: string[];
    userSubscriptions: string[];
    userTokenBalance: number;
  }
}

// Initialize mock user data
if (typeof window !== 'undefined') {
  window.userNFTs = window.userNFTs || [
    'portfolio-optimizer',
    'breathwork-tracker',
    'alpha-sniper',
    'meditation-guide',
    'defi-scanner'
  ];
  window.userSubscriptions = window.userSubscriptions || [
    'cold-plunge-coach',
    'tax-helper',
    'dao-sentinel'
  ];
  window.userTokenBalance = window.userTokenBalance || 8000;
}

export const useSubAgentAccess = (subAgentId: string): SubAgentAccess => {
  const [access, setAccess] = useState<SubAgentAccess>({
    hasAccess: false,
    accessType: 'none'
  });

  useEffect(() => {
    const checkAccess = () => {
      // Check NFT ownership
      if (window.userNFTs?.includes(subAgentId)) {
        setAccess({
          hasAccess: true,
          accessType: 'nft'
        });
        return;
      }

      // Check active subscription
      if (window.userSubscriptions?.includes(subAgentId)) {
        setAccess({
          hasAccess: true,
          accessType: 'subscription'
        });
        return;
      }

      // Check token unlock requirement
      const subAgent = getSubAgentById(subAgentId);
      if (subAgent && subAgent.model === 'TokenUnlock') {
        const hasEnoughTokens = window.userTokenBalance >= (subAgent.tokenRequirement || 0);
        setAccess({
          hasAccess: hasEnoughTokens,
          accessType: 'unlock',
          tokenRequirement: subAgent.tokenRequirement,
          reason: hasEnoughTokens ? 'Unlocked via token hold' : 'Insufficient tokens'
        });
        return;
      }

      // No access
      setAccess({
        hasAccess: false,
        accessType: 'none',
        reason: 'Access required'
      });
    };

    checkAccess();
  }, [subAgentId]);

  return access;
};

// Helper function to get sub-agent by ID
const getSubAgentById = (id: string): SubAgent | null => {
  // Import all sub-agents from configs
  const allSubAgents: SubAgent[] = [
    // CFO Sub-agents
    { id: 'portfolio-optimizer', name: 'Portfolio Optimizer', description: 'Automatically rebalances portfolio allocations', parent: 'CFO', model: 'NFT', price: 180, status: 'Available' },
    { id: 'tax-helper', name: 'Tax Helper', description: 'Generates comprehensive tax reports', parent: 'CFO', model: 'Subscription', subscriptionMonthly: 25, status: 'Available' },
    { id: 'yield-farmer', name: 'Yield Farmer', description: 'Finds best yield farming opportunities', parent: 'CFO', model: 'TokenUnlock', tokenRequirement: 5000, status: 'ComingSoon' },
    { id: 'gas-fee-predictor', name: 'Gas Fee Predictor', description: 'Predicts ETH gas fee spikes', parent: 'CFO', model: 'Subscription', subscriptionMonthly: 15, status: 'Available' },
    { id: 'defi-scanner', name: 'DeFi Scanner', description: 'Scans and analyzes DeFi protocols', parent: 'CFO', model: 'NFT', price: 250, status: 'Available' },
    { id: 'treasury-manager', name: 'Treasury Manager', description: 'Advanced treasury management', parent: 'CFO', model: 'TokenUnlock', tokenRequirement: 10000, status: 'ComingSoon' },
    
    // Care Sub-agents
    { id: 'breathwork-tracker', name: 'Breathwork Tracker', description: 'Logs breathing sessions', parent: 'Care', model: 'NFT', price: 120, status: 'Available' },
    { id: 'cold-plunge-coach', name: 'Cold Plunge Coach', description: 'Suggests cold therapy protocols', parent: 'Care', model: 'Subscription', subscriptionMonthly: 20, status: 'Available' },
    { id: 'sleep-ai', name: 'Sleep AI', description: 'Monitors sleep patterns', parent: 'Care', model: 'TokenUnlock', tokenRequirement: 3000, status: 'ComingSoon' },
    { id: 'nutrition-coach', name: 'Nutrition Coach', description: 'AI-powered nutrition guidance', parent: 'Care', model: 'Subscription', subscriptionMonthly: 30, status: 'Available' },
    { id: 'meditation-guide', name: 'Meditation Guide', description: 'Personalized meditation sessions', parent: 'Care', model: 'NFT', price: 150, status: 'Available' },
    { id: 'fitness-tracker', name: 'Fitness Tracker', description: 'Comprehensive fitness monitoring', parent: 'Care', model: 'TokenUnlock', tokenRequirement: 4000, status: 'ComingSoon' },
    
    // Alpha Sub-agents
    { id: 'alpha-sniper', name: 'Alpha Sniper', description: 'Detects new token breakouts', parent: 'Alpha', model: 'NFT', price: 300, status: 'Available' },
    { id: 'dao-sentinel', name: 'DAO Sentinel', description: 'Monitors governance votes', parent: 'Alpha', model: 'Subscription', subscriptionMonthly: 35, status: 'Available' },
    { id: 'whale-radar', name: 'Whale Radar', description: 'Monitors smart wallets', parent: 'Alpha', model: 'TokenUnlock', tokenRequirement: 7500, status: 'ComingSoon' },
    { id: 'protocol-scanner', name: 'Protocol Scanner', description: 'Scans new DeFi protocols', parent: 'Alpha', model: 'Subscription', subscriptionMonthly: 40, status: 'Available' },
    { id: 'arbitrage-hunter', name: 'Arbitrage Hunter', description: 'Identifies arbitrage opportunities', parent: 'Alpha', model: 'NFT', price: 400, status: 'Available' },
    { id: 'sentiment-analyzer', name: 'Sentiment Analyzer', description: 'Analyzes market sentiment', parent: 'Alpha', model: 'TokenUnlock', tokenRequirement: 6000, status: 'ComingSoon' }
  ];

  return allSubAgents.find(agent => agent.id === id) || null;
};

// Hook to get all user's accessible sub-agents
export const useUserSubAgents = () => {
  const [accessibleAgents, setAccessibleAgents] = useState<string[]>([]);

  useEffect(() => {
    const getAllAccessibleAgents = () => {
      const accessible: string[] = [];
      
      // Check NFT ownership
      window.userNFTs?.forEach(nftId => {
        if (!accessible.includes(nftId)) {
          accessible.push(nftId);
        }
      });
      
      // Check subscriptions
      window.userSubscriptions?.forEach(subId => {
        if (!accessible.includes(subId)) {
          accessible.push(subId);
        }
      });
      
      // Check token unlocks
      const tokenUnlockAgents = [
        'yield-farmer', 'treasury-manager', 'sleep-ai', 'fitness-tracker',
        'whale-radar', 'sentiment-analyzer'
      ];
      
      tokenUnlockAgents.forEach(agentId => {
        const subAgent = getSubAgentById(agentId);
        if (subAgent && window.userTokenBalance >= (subAgent.tokenRequirement || 0)) {
          if (!accessible.includes(agentId)) {
            accessible.push(agentId);
          }
        }
      });
      
      setAccessibleAgents(accessible);
    };

    getAllAccessibleAgents();
  }, []);

  return accessibleAgents;
};

// Hook to get user's token balance
export const useUserTokenBalance = () => {
  const [balance, setBalance] = useState<number>(0);

  useEffect(() => {
    setBalance(window.userTokenBalance || 0);
  }, []);

  return balance;
};

// Hook to get user's NFTs
export const useUserNFTs = () => {
  const [nfts, setNfts] = useState<string[]>([]);

  useEffect(() => {
    setNfts(window.userNFTs || []);
  }, []);

  return nfts;
};

// Hook to get user's subscriptions
export const useUserSubscriptions = () => {
  const [subscriptions, setSubscriptions] = useState<string[]>([]);

  useEffect(() => {
    setSubscriptions(window.userSubscriptions || []);
  }, []);

  return subscriptions;
};
