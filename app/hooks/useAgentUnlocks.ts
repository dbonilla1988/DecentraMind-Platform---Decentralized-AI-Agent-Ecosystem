/**
 * Agent Unlock Persistence Hook
 * Handles Firebase/Supabase persistence for unlocked agents and XP tracking
 */

import { useState, useEffect, useCallback } from 'react';

interface UnlockedAgent {
  agentId: string;
  unlockedAt: Date;
  xpEarned: number;
  unlockMethod: 'NFT' | 'Subscription' | 'TokenUnlock';
}

interface XPHistory {
  agentId: string;
  amount: number;
  timestamp: Date;
  reason: string;
}

interface UseAgentUnlocksReturn {
  unlockedAgents: string[];
  totalXP: number;
  xpHistory: XPHistory[];
  unlockAgent: (agentId: string, method: 'NFT' | 'Subscription' | 'TokenUnlock') => Promise<boolean>;
  logXP: (agentId: string, amount: number, reason: string) => Promise<void>;
  isLoading: boolean;
  error: string | null;
}

export const useAgentUnlocks = (walletAddress: string): UseAgentUnlocksReturn => {
  const [unlockedAgents, setUnlockedAgents] = useState<string[]>([]);
  const [totalXP, setTotalXP] = useState<number>(0);
  const [xpHistory, setXpHistory] = useState<XPHistory[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  // Mock Firebase/Supabase implementation
  // In production, replace with actual Firebase/Supabase calls
  const mockDatabase = {
    users: new Map<string, {
      unlockedAgents: UnlockedAgent[];
      totalXP: number;
      xpHistory: XPHistory[];
    }>()
  };

  // Initialize user data if not exists
  const initializeUser = useCallback((address: string) => {
    if (!mockDatabase.users.has(address)) {
      mockDatabase.users.set(address, {
        unlockedAgents: [],
        totalXP: 0,
        xpHistory: []
      });
    }
  }, []);

  // Load user data
  useEffect(() => {
    if (!walletAddress) return;

    setIsLoading(true);
    setError(null);

    try {
      initializeUser(walletAddress);
      const userData = mockDatabase.users.get(walletAddress);
      
      if (userData) {
        setUnlockedAgents(userData.unlockedAgents.map(agent => agent.agentId));
        setTotalXP(userData.totalXP);
        setXpHistory(userData.xpHistory);
      }
    } catch (err) {
      setError('Failed to load user data');
      console.error('Error loading user data:', err);
    } finally {
      setIsLoading(false);
    }
  }, [walletAddress, initializeUser]);

  // Unlock agent
  const unlockAgent = useCallback(async (
    agentId: string, 
    method: 'NFT' | 'Subscription' | 'TokenUnlock'
  ): Promise<boolean> => {
    if (!walletAddress) return false;

    try {
      initializeUser(walletAddress);
      const userData = mockDatabase.users.get(walletAddress);
      
      if (!userData) return false;

      // Check if already unlocked
      if (userData.unlockedAgents.some(agent => agent.agentId === agentId)) {
        return true; // Already unlocked
      }

      // Add to unlocked agents
      const newUnlockedAgent: UnlockedAgent = {
        agentId,
        unlockedAt: new Date(),
        xpEarned: 0, // Will be set by logXP
        unlockMethod: method
      };

      userData.unlockedAgents.push(newUnlockedAgent);
      mockDatabase.users.set(walletAddress, userData);

      // Update local state
      setUnlockedAgents(prev => [...prev, agentId]);

      return true;
    } catch (err) {
      setError('Failed to unlock agent');
      console.error('Error unlocking agent:', err);
      return false;
    }
  }, [walletAddress, initializeUser]);

  // Log XP
  const logXP = useCallback(async (
    agentId: string, 
    amount: number, 
    reason: string
  ): Promise<void> => {
    if (!walletAddress) return;

    try {
      initializeUser(walletAddress);
      const userData = mockDatabase.users.get(walletAddress);
      
      if (!userData) return;

      // Add to XP history
      const xpEntry: XPHistory = {
        agentId,
        amount,
        timestamp: new Date(),
        reason
      };

      userData.xpHistory.push(xpEntry);
      userData.totalXP += amount;

      // Update unlocked agent XP if it exists
      const unlockedAgent = userData.unlockedAgents.find(agent => agent.agentId === agentId);
      if (unlockedAgent) {
        unlockedAgent.xpEarned += amount;
      }

      mockDatabase.users.set(walletAddress, userData);

      // Update local state
      setTotalXP(prev => prev + amount);
      setXpHistory(prev => [...prev, xpEntry]);

    } catch (err) {
      setError('Failed to log XP');
      console.error('Error logging XP:', err);
    }
  }, [walletAddress, initializeUser]);

  return {
    unlockedAgents,
    totalXP,
    xpHistory,
    unlockAgent,
    logXP,
    isLoading,
    error
  };
};

// Helper functions
export const getUnlockedAgents = (walletAddress: string): string[] => {
  // This would be replaced with actual database query
  return [];
};

export const isAgentUnlocked = (agentId: string, walletAddress: string): boolean => {
  // This would be replaced with actual database query
  return false;
};
