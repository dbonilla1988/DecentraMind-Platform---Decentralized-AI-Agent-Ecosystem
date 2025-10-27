/**
 * Contract Mocks for Development
 * Provides deterministic mock responses for contract interactions
 */

export interface MintResult {
  success: boolean;
  tx?: string;
  tokenId?: string;
  error?: string;
}

export interface SubscriptionResult {
  success: boolean;
  subscriptionId?: string;
  error?: string;
}

export interface BalanceCheckResult {
  success: boolean;
  hasBalance: boolean;
  currentBalance: number;
  requiredBalance: number;
  error?: string;
}

// Mock NFT Minting
export const mintSubAgent = async (agentId: string, userAddress: string): Promise<MintResult> => {
  console.log(`🔄 Mock: Minting NFT for ${agentId} to ${userAddress}`);
  
  // Simulate network delay
  await new Promise(resolve => setTimeout(resolve, 2000));
  
  // Deterministic mock response based on agentId
  const mockTxHash = `0x${agentId.replace(/[^a-zA-Z0-9]/g, '').padEnd(64, '0').slice(0, 64)}`;
  const mockTokenId = `NFT_${agentId.toUpperCase()}_${Date.now()}`;
  
  // Simulate occasional failures (10% chance)
  if (Math.random() < 0.1) {
    return {
      success: false,
      error: 'Mock network error - transaction failed'
    };
  }
  
  return {
    success: true,
    tx: mockTxHash,
    tokenId: mockTokenId
  };
};

// Mock Subscription Creation
export const subscribeUser = async (subscriptionId: string, userAddress: string): Promise<SubscriptionResult> => {
  console.log(`🔄 Mock: Creating subscription ${subscriptionId} for ${userAddress}`);
  
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 1500));
  
  // Deterministic mock response
  const mockSubscriptionId = `sub_${subscriptionId}_${Date.now()}`;
  
  // Simulate occasional failures (5% chance)
  if (Math.random() < 0.05) {
    return {
      success: false,
      error: 'Mock payment processing error'
    };
  }
  
  return {
    success: true,
    subscriptionId: mockSubscriptionId
  };
};

// Mock Token Balance Check
export const checkTokenBalance = async (
  userAddress: string, 
  tokenAddress: string, 
  requiredBalance: number
): Promise<BalanceCheckResult> => {
  console.log(`🔄 Mock: Checking token balance for ${userAddress}`);
  
  // Simulate network delay
  await new Promise(resolve => setTimeout(resolve, 800));
  
  // Deterministic mock balance based on userAddress
  const mockBalance = Math.floor(Math.random() * 10000);
  
  return {
    success: true,
    hasBalance: mockBalance >= requiredBalance,
    currentBalance: mockBalance,
    requiredBalance
  };
};

// Mock NFT Ownership Check
export const checkNFTOwnership = async (userAddress: string, contractAddress: string): Promise<boolean> => {
  console.log(`🔄 Mock: Checking NFT ownership for ${userAddress}`);
  
  // Simulate network delay
  await new Promise(resolve => setTimeout(resolve, 1000));
  
  // Deterministic mock ownership (30% chance of owning NFT)
  return Math.random() > 0.7;
};

// Mock Subscription Status Check
export const checkSubscriptionStatus = async (userAddress: string, subscriptionId: string): Promise<boolean> => {
  console.log(`🔄 Mock: Checking subscription status for ${userAddress}`);
  
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 600));
  
  // Deterministic mock subscription status (70% chance of active subscription)
  return Math.random() > 0.3;
};

// Mock Contract Interaction Factory
export const createMockContract = (agentId: string) => {
  return {
    async mint(): Promise<MintResult> {
      return mintSubAgent(agentId, 'mock-user-address');
    },
    
    async subscribe(subscriptionId: string): Promise<SubscriptionResult> {
      return subscribeUser(subscriptionId, 'mock-user-address');
    },
    
    async checkBalance(tokenAddress: string, requiredBalance: number): Promise<BalanceCheckResult> {
      return checkTokenBalance('mock-user-address', tokenAddress, requiredBalance);
    },
    
    async checkOwnership(contractAddress: string): Promise<boolean> {
      return checkNFTOwnership('mock-user-address', contractAddress);
    },
    
    async checkSubscription(subscriptionId: string): Promise<boolean> {
      return checkSubscriptionStatus('mock-user-address', subscriptionId);
    }
  };
};

// Environment-based mock control
export const shouldUseMocks = (): boolean => {
  return process.env.NODE_ENV === 'development' || 
         process.env.USE_MOCKS === 'true' ||
         !process.env.N8N_DOMAIN; // Use mocks if N8N is not configured
};

// Mock delay utilities
export const mockDelay = (ms: number = 1000): Promise<void> => {
  return new Promise(resolve => setTimeout(resolve, ms));
};

// Mock error simulation
export const simulateError = (probability: number = 0.1): boolean => {
  return Math.random() < probability;
};

// Mock success simulation
export const simulateSuccess = (probability: number = 0.9): boolean => {
  return Math.random() < probability;
};
