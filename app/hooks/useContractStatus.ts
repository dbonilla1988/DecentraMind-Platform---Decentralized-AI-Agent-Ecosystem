/**
 * Contract Status Hook
 * Manages contract integration and verification for agent unlocks
 */

import { useState, useEffect, useCallback } from 'react';
import { agentUnlockContracts } from '../data/agentUnlockContracts';
import { 
  mintSubAgent, 
  subscribeUser, 
  checkTokenBalance, 
  checkNFTOwnership, 
  checkSubscriptionStatus,
  shouldUseMocks 
} from '../mocks/contractMocks';

interface ContractStatus {
  isUnlocked: boolean;
  isLoading: boolean;
  error: string | null;
}

interface UseContractStatusReturn {
  contractStatus: ContractStatus;
  executeUnlock: () => Promise<{ success: boolean; error?: string }>;
  isProcessing: boolean;
}

export const useContractStatus = (
  agentId: string, 
  walletAddress: string
): UseContractStatusReturn => {
  const [contractStatus, setContractStatus] = useState<ContractStatus>({
    isUnlocked: false,
    isLoading: true,
    error: null
  });
  const [isProcessing, setIsProcessing] = useState(false);

  const contractInfo = agentUnlockContracts[agentId];

  // Check unlock status
  const checkUnlockStatus = useCallback(async () => {
    if (!walletAddress || !agentId) return;

    setContractStatus(prev => ({ ...prev, isLoading: true, error: null }));

    try {
      let isUnlocked = false;

      if (contractInfo) {
        switch (contractInfo.contractType) {
          case 'NFT':
            if (contractInfo.contractAddress) {
              isUnlocked = await checkNFTOwnership(walletAddress, contractInfo.contractAddress);
            }
            break;
          case 'Subscription':
            if (contractInfo.subscriptionId) {
              isUnlocked = await checkSubscriptionStatus(walletAddress, contractInfo.subscriptionId);
            }
            break;
          case 'TokenUnlock':
            if (contractInfo.requiredBalance) {
              const balanceCheck = await checkTokenBalance(walletAddress, contractInfo.tokenAddress || '', contractInfo.requiredBalance);
              isUnlocked = balanceCheck.hasBalance;
            }
            break;
        }
      }

      setContractStatus({
        isUnlocked,
        isLoading: false,
        error: null
      });
    } catch (error) {
      console.error('Error checking contract status:', error);
      setContractStatus({
        isUnlocked: false,
        isLoading: false,
        error: 'Failed to verify contract status'
      });
    }
  }, [agentId, walletAddress, contractInfo]);

  // Execute unlock
  const executeUnlock = useCallback(async (): Promise<{ success: boolean; error?: string }> => {
    if (!contractInfo) {
      return { success: false, error: 'No contract information available for this agent.' };
    }

    setIsProcessing(true);
    try {
      switch (contractInfo.contractType) {
        case 'NFT':
          const mintResult = await mintSubAgent(agentId, walletAddress);
          return { success: mintResult.success, error: mintResult.error };
          
        case 'Subscription':
          const subResult = await subscribeUser(contractInfo.subscriptionId || '', walletAddress);
          return { success: subResult.success, error: subResult.error };
          
        case 'TokenUnlock':
          if (contractInfo.requiredBalance) {
            const balanceCheck = await checkTokenBalance(walletAddress, contractInfo.tokenAddress || '', contractInfo.requiredBalance);
            if (balanceCheck.hasBalance) {
              return { success: true };
            } else {
              return { success: false, error: 'Insufficient token balance.' };
            }
          }
          return { success: false, error: 'Required balance not specified for TokenUnlock.' };
          
        default:
          return { success: false, error: 'Unknown contract type.' };
      }
    } catch (error) {
      console.error('Error executing unlock:', error);
      return { success: false, error: 'An unexpected error occurred during unlock.' };
    } finally {
      setIsProcessing(false);
    }
  }, [contractInfo, agentId, walletAddress]);

  // Check status on mount
  useEffect(() => {
    checkUnlockStatus();
  }, [checkUnlockStatus]);

  return {
    contractStatus,
    executeUnlock,
    isProcessing
  };
};
