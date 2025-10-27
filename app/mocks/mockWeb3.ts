/**
 * Mock Web3 Integration for DecentraMind
 * Simulates blockchain interactions for development and testing
 */

export interface MockTransaction {
  hash: string;
  from: string;
  to: string;
  value: string;
  gasUsed: string;
  status: 'pending' | 'success' | 'failed';
}

export interface MockNFT {
  tokenId: string;
  contractAddress: string;
  metadataURI: string;
  owner: string;
  mintedAt: string;
}

export interface MockSubscription {
  id: string;
  userId: string;
  planId: string;
  status: 'active' | 'cancelled' | 'past_due';
  currentPeriodEnd: string;
  amount: number;
}

// Mock wallet state
let mockWalletBalance = 10000; // DMT tokens
let mockNFTs: MockNFT[] = [];
let mockSubscriptions: MockSubscription[] = [];

// Mock transaction history
let mockTransactions: MockTransaction[] = [];

/**
 * Mock Solana Pay Integration
 */
export const mockSolanaPay = {
  async mintNFT(agentId: string, userAddress: string): Promise<{ success: boolean; tx?: string; nft?: MockNFT; error?: string }> {
    console.log(`🎨 Mock Solana Pay: Minting NFT for ${agentId}`);
    
    // Simulate network delay
    await new Promise(resolve => setTimeout(resolve, 2000 + Math.random() * 1000));
    
    // Generate deterministic transaction hash
    const txHash = `0x${agentId.replace(/[^a-zA-Z0-9]/g, '').padEnd(64, '0').slice(0, 64)}`;
    const tokenId = `NFT_${agentId.toUpperCase()}_${Date.now()}`;
    
    // Simulate 10% failure rate
    if (Math.random() < 0.1) {
      return {
        success: false,
        error: 'Mock Solana network error - transaction failed'
      };
    }
    
    // Create mock NFT
    const nft: MockNFT = {
      tokenId,
      contractAddress: '0x1234567890abcdef1234567890abcdef12345678',
      metadataURI: `ipfs://Qm${agentId}${Date.now()}`,
      owner: userAddress,
      mintedAt: new Date().toISOString()
    };
    
    // Add to mock collection
    mockNFTs.push(nft);
    
    // Add transaction
    mockTransactions.push({
      hash: txHash,
      from: 'system',
      to: userAddress,
      value: '0',
      gasUsed: '50000',
      status: 'success'
    });
    
    return {
      success: true,
      tx: txHash,
      nft
    };
  },
  
  async checkNFTOwnership(userAddress: string, contractAddress: string): Promise<boolean> {
    console.log(`🔍 Mock Solana Pay: Checking NFT ownership for ${userAddress}`);
    
    await new Promise(resolve => setTimeout(resolve, 500));
    
    return mockNFTs.some(nft => 
      nft.owner === userAddress && 
      nft.contractAddress === contractAddress
    );
  },
  
  async getOwnedNFTs(userAddress: string): Promise<MockNFT[]> {
    console.log(`📋 Mock Solana Pay: Getting owned NFTs for ${userAddress}`);
    
    await new Promise(resolve => setTimeout(resolve, 300));
    
    return mockNFTs.filter(nft => nft.owner === userAddress);
  }
};

/**
 * Mock Stripe Integration
 */
export const mockStripe = {
  async createSubscription(userId: string, planId: string, amount: number): Promise<{ success: boolean; subscription?: MockSubscription; error?: string }> {
    console.log(`💳 Mock Stripe: Creating subscription ${planId} for ${userId}`);
    
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 1500 + Math.random() * 500));
    
    // Simulate 5% failure rate
    if (Math.random() < 0.05) {
      return {
        success: false,
        error: 'Mock payment processing error - card declined'
      };
    }
    
    // Create mock subscription
    const subscription: MockSubscription = {
      id: `sub_${planId}_${Date.now()}`,
      userId,
      planId,
      status: 'active',
      currentPeriodEnd: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(), // 30 days
      amount
    };
    
    // Add to mock subscriptions
    mockSubscriptions.push(subscription);
    
    return {
      success: true,
      subscription
    };
  },
  
  async checkSubscriptionStatus(userId: string, planId: string): Promise<boolean> {
    console.log(`🔍 Mock Stripe: Checking subscription status for ${userId}`);
    
    await new Promise(resolve => setTimeout(resolve, 400));
    
    const subscription = mockSubscriptions.find(sub => 
      sub.userId === userId && 
      sub.planId === planId && 
      sub.status === 'active'
    );
    
    return !!subscription;
  },
  
  async cancelSubscription(subscriptionId: string): Promise<{ success: boolean; error?: string }> {
    console.log(`❌ Mock Stripe: Cancelling subscription ${subscriptionId}`);
    
    await new Promise(resolve => setTimeout(resolve, 800));
    
    const subscription = mockSubscriptions.find(sub => sub.id === subscriptionId);
    if (!subscription) {
      return {
        success: false,
        error: 'Subscription not found'
      };
    }
    
    subscription.status = 'cancelled';
    
    return { success: true };
  }
};

/**
 * Mock Token Operations
 */
export const mockTokenOps = {
  async checkBalance(userAddress: string, tokenAddress: string): Promise<number> {
    console.log(`💰 Mock Token: Checking balance for ${userAddress}`);
    
    await new Promise(resolve => setTimeout(resolve, 300));
    
    return mockWalletBalance;
  },
  
  async transferTokens(from: string, to: string, amount: number): Promise<{ success: boolean; tx?: string; error?: string }> {
    console.log(`💸 Mock Token: Transferring ${amount} tokens from ${from} to ${to}`);
    
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    if (mockWalletBalance < amount) {
      return {
        success: false,
        error: 'Insufficient token balance'
      };
    }
    
    // Deduct tokens
    mockWalletBalance -= amount;
    
    // Generate transaction hash
    const txHash = `0x${Math.random().toString(16).substr(2, 64)}`;
    
    // Add transaction
    mockTransactions.push({
      hash: txHash,
      from,
      to,
      value: amount.toString(),
      gasUsed: '21000',
      status: 'success'
    });
    
    return {
      success: true,
      tx: txHash
    };
  },
  
  async addTokens(amount: number): Promise<void> {
    console.log(`➕ Mock Token: Adding ${amount} tokens to wallet`);
    mockWalletBalance += amount;
  }
};

/**
 * Mock Contract Status Checker
 */
export const mockContractStatus = {
  async hasNFTOwnership(userAddress: string, contractAddress: string): Promise<boolean> {
    return mockSolanaPay.checkNFTOwnership(userAddress, contractAddress);
  },
  
  async hasSPLBalance(userAddress: string, tokenAddress: string, requiredAmount: number): Promise<boolean> {
    const balance = await mockTokenOps.checkBalance(userAddress, tokenAddress);
    return balance >= requiredAmount;
  },
  
  async hasActiveSubscription(userId: string, planId: string): Promise<boolean> {
    return mockStripe.checkSubscriptionStatus(userId, planId);
  }
};

/**
 * Mock Web3 Provider
 */
export const mockWeb3Provider = {
  // Wallet operations
  async connect(): Promise<{ success: boolean; address?: string; error?: string }> {
    console.log(`🔌 Mock Web3: Connecting wallet`);
    
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    return {
      success: true,
      address: 'mock-user-address-123456789'
    };
  },
  
  async disconnect(): Promise<{ success: boolean }> {
    console.log(`🔌 Mock Web3: Disconnecting wallet`);
    return { success: true };
  },
  
  async getAddress(): Promise<string | null> {
    return 'mock-user-address-123456789';
  },
  
  // Transaction operations
  async sendTransaction(tx: any): Promise<{ success: boolean; hash?: string; error?: string }> {
    console.log(`📤 Mock Web3: Sending transaction`);
    
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    const hash = `0x${Math.random().toString(16).substr(2, 64)}`;
    
    return {
      success: true,
      hash
    };
  },
  
  // Event listening
  on(event: string, callback: (data: any) => void): void {
    console.log(`👂 Mock Web3: Listening for ${event}`);
    // Mock event emission after 2 seconds
    setTimeout(() => {
      callback({ mock: true, event });
    }, 2000);
  },
  
  off(event: string, callback: (data: any) => void): void {
    console.log(`🔇 Mock Web3: Stopped listening for ${event}`);
  }
};

/**
 * Reset mock state (for testing)
 */
export const resetMockState = (): void => {
  mockWalletBalance = 10000;
  mockNFTs = [];
  mockSubscriptions = [];
  mockTransactions = [];
  console.log('🔄 Mock state reset');
};

/**
 * Get mock state for debugging
 */
export const getMockState = () => ({
  walletBalance: mockWalletBalance,
  nfts: mockNFTs,
  subscriptions: mockSubscriptions,
  transactions: mockTransactions
});

/**
 * Environment check
 */
export const isMockMode = (): boolean => {
  return process.env.NODE_ENV === 'development' || 
         process.env.NEXT_PUBLIC_USE_MOCKS === 'true' ||
         !process.env.NEXT_PUBLIC_N8N_DOMAIN;
};
