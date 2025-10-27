/**
 * Sub-Agent Unlocks Hook
 * Manages sub-agent unlock state, persistence, and XP logging
 */

import { useState, useEffect, useCallback } from 'react';
import { SubAgentMetadata } from '../data/agentMetadata';
import { unlockPersistence, UnlockRecord } from '../services/unlockPersistence';
import { useXPLogging } from './useXPLogging';
import { useWalletBalance } from './useWalletBalance';
import { 
  mintSubAgent, 
  subscribeUser, 
  checkTokenBalance, 
  shouldUseMocks 
} from '../mocks/contractMocks';

interface UnlockOptions {
  userId: string;
  agentId: string;
  subAgentId: string;
  method: 'NFT' | 'Subscription' | 'TokenUnlock';
  tx?: any;
}

interface UnlockResult {
  success: boolean;
  error?: string;
  transactionHash?: string;
  tokenId?: string;
  subscriptionId?: string;
}

interface UseSubAgentUnlocksReturn {
  unlockedSubAgents: string[];
  isLoading: boolean;
  error: string | null;
  isSubAgentUnlocked: (agentId: string, subAgentId: string) => boolean;
  unlockSubAgent: (options: UnlockOptions) => Promise<UnlockResult>;
  refreshUnlocks: () => Promise<void>;
}

export const useSubAgentUnlocks = (userId: string = 'mock-user'): UseSubAgentUnlocksReturn => {
  const [unlockedSubAgents, setUnlockedSubAgents] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  const { logXP } = useXPLogging();
  const { balance, deductTokens } = useWalletBalance();

  // Load unlocked sub-agents on mount
  useEffect(() => {
    loadUnlocks();
  }, [userId]);

  const loadUnlocks = useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null);
      
      const unlocks = await unlockPersistence.getUnlocks(userId);
      const unlockedIds = unlocks.map(unlock => `${unlock.agentId}-${unlock.subAgentId}`);
      setUnlockedSubAgents(unlockedIds);
    } catch (err) {
      console.error('Error loading unlocks:', err);
      setError('Failed to load unlock data');
    } finally {
      setIsLoading(false);
    }
  }, [userId]);

  const isSubAgentUnlocked = useCallback((agentId: string, subAgentId: string): boolean => {
    return unlockedSubAgents.includes(`${agentId}-${subAgentId}`);
  }, [unlockedSubAgents]);

  const calculateXPReward = (cost: number): number => {
    if (cost >= 4000) return 50;  // High-tier agents
    if (cost >= 1000) return 30;   // Mid-tier agents
    return 20;                     // Basic agents
  };

  const unlockSubAgent = useCallback(async (options: UnlockOptions): Promise<UnlockResult> => {
    const { userId, agentId, subAgentId, method } = options;
    
    try {
      setError(null);
      
      // Check if already unlocked
      if (isSubAgentUnlocked(agentId, subAgentId)) {
        return {
          success: true,
          error: 'Sub-agent already unlocked'
        };
      }

      let unlockResult: UnlockResult = { success: false };

      // Handle different unlock methods
      switch (method) {
        case 'NFT':
          unlockResult = await handleNFTUnlock(agentId, subAgentId);
          break;
          
        case 'Subscription':
          unlockResult = await handleSubscriptionUnlock(agentId, subAgentId);
          break;
          
        case 'TokenUnlock':
          unlockResult = await handleTokenUnlock(agentId, subAgentId);
          break;
          
        default:
          return {
            success: false,
            error: 'Invalid unlock method'
          };
      }

      if (!unlockResult.success) {
        return unlockResult;
      }

      // Save unlock to persistence
      const saveSuccess = await unlockPersistence.saveUnlock(userId, agentId, subAgentId, {
        unlockMethod: method,
        transactionHash: unlockResult.transactionHash,
        tokenId: unlockResult.tokenId,
        subscriptionId: unlockResult.subscriptionId,
        metadata: {
          timestamp: new Date().toISOString(),
          method,
          cost: options.tx?.cost || 0
        }
      });

      if (!saveSuccess) {
        return {
          success: false,
          error: 'Failed to save unlock data'
        };
      }

      // Log XP reward
      const xpReward = calculateXPReward(options.tx?.cost || 0);
      await logXP(subAgentId, xpReward, `Unlocked ${subAgentId} sub-agent`);

      // Refresh unlocked list
      await loadUnlocks();

      return {
        success: true,
        transactionHash: unlockResult.transactionHash,
        tokenId: unlockResult.tokenId,
        subscriptionId: unlockResult.subscriptionId
      };

    } catch (err) {
      console.error('Error unlocking sub-agent:', err);
      return {
        success: false,
        error: err instanceof Error ? err.message : 'Unknown error occurred'
      };
    }
  }, [userId, isSubAgentUnlocked, logXP, deductTokens, balance, loadUnlocks]);

  const handleNFTUnlock = async (agentId: string, subAgentId: string): Promise<UnlockResult> => {
    try {
      if (shouldUseMocks()) {
        const result = await mintSubAgent(subAgentId, 'mock-user-address');
        return {
          success: result.success,
          error: result.error,
          transactionHash: result.tx,
          tokenId: result.tokenId
        };
      } else {
        // TODO: Implement real NFT minting
        throw new Error('Real NFT minting not implemented yet');
      }
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'NFT minting failed'
      };
    }
  };

  const handleSubscriptionUnlock = async (agentId: string, subAgentId: string): Promise<UnlockResult> => {
    try {
      if (shouldUseMocks()) {
        const result = await subscribeUser(`svc_${subAgentId}`, 'mock-user-address');
        return {
          success: result.success,
          error: result.error,
          subscriptionId: result.subscriptionId
        };
      } else {
        // TODO: Implement real Stripe subscription
        throw new Error('Real subscription creation not implemented yet');
      }
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Subscription creation failed'
      };
    }
  };

  const handleTokenUnlock = async (agentId: string, subAgentId: string): Promise<UnlockResult> => {
    try {
      // Check token balance
      const balanceCheck = await checkTokenBalance('mock-user-address', 'DMT_TOKEN_ADDRESS', 25);
      
      if (!balanceCheck.hasBalance) {
        return {
          success: false,
          error: `Insufficient token balance. Required: ${balanceCheck.requiredBalance}, Current: ${balanceCheck.currentBalance}`
        };
      }

      // Deduct tokens from wallet (mock)
      if (shouldUseMocks()) {
        deductTokens(25); // Mock deduction
      }

      return {
        success: true,
        transactionHash: `0x${Math.random().toString(16).substr(2, 64)}`
      };
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Token unlock failed'
      };
    }
  };

  const refreshUnlocks = useCallback(async () => {
    await loadUnlocks();
  }, [loadUnlocks]);

  return {
    unlockedSubAgents,
    isLoading,
    error,
    isSubAgentUnlocked,
    unlockSubAgent,
    refreshUnlocks
  };
};

// Helper hook for checking specific sub-agent unlock status
export const useSubAgentUnlockStatus = (userId: string, agentId: string, subAgentId: string) => {
  const { isSubAgentUnlocked, isLoading } = useSubAgentUnlocks(userId);
  
  return {
    isUnlocked: isSubAgentUnlocked(agentId, subAgentId),
    isLoading
  };
};
