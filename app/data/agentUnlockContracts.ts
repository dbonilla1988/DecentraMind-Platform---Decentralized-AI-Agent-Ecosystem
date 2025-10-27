export type UnlockMethod = 'NFT' | 'Subscription' | 'TokenUnlock';

export interface AgentUnlockContract {
  agentId: string;
  contractType: UnlockMethod;
  contractAddress?: string; // For NFT contracts
  tokenAddress?: string;    // For TokenUnlock (e.g., DMT token address)
  requiredBalance?: number; // For TokenUnlock
  subscriptionId?: string;  // For Subscription (e.g., Stripe product ID)
  network?: 'solana' | 'ethereum' | 'polygon'; // Optional: specify network
}

export const agentUnlockContracts: { [agentId: string]: AgentUnlockContract } = {
  "vitals-tracker": {
    agentId: "vitals-tracker",
    contractType: "TokenUnlock",
    tokenAddress: "DMT_TOKEN_ADDRESS", // Mock DMT token address
    requiredBalance: 25,
    network: "solana"
  },
  "cold-plunge-coach": {
    agentId: "cold-plunge-coach",
    contractType: "Subscription",
    subscriptionId: "svc_coldplunge", // Mock Stripe product ID
    network: "ethereum" // Example: subscription managed on Ethereum side
  },
  "meditation-guide": {
    agentId: "meditation-guide",
    contractType: "NFT",
    contractAddress: "0xMeditationNFTContract", // Mock NFT contract address
    network: "solana"
  },
  "sleep-ai": {
    agentId: "sleep-ai",
    contractType: "TokenUnlock",
    tokenAddress: "DMT_TOKEN_ADDRESS",
    requiredBalance: 3000,
    network: "solana"
  },
  "nutrition-coach": {
    agentId: "nutrition-coach",
    contractType: "Subscription",
    subscriptionId: "svc_nutrition", // Mock Stripe product ID
    network: "ethereum"
  },
  "fitness-tracker": {
    agentId: "fitness-tracker",
    contractType: "TokenUnlock",
    tokenAddress: "DMT_TOKEN_ADDRESS",
    requiredBalance: 4000,
    network: "solana"
  },
  "breathwork-tracker": {
    agentId: "breathwork-tracker",
    contractType: "NFT",
    contractAddress: "0xBreathworkNFTContract",
    network: "solana"
  },
  // Add other agents here as they get contract deployments
};

// Helper function to get contract info for an agent
export const getAgentContractInfo = (agentId: string): AgentUnlockContract | null => {
  return agentUnlockContracts[agentId] || null;
};

// Helper function to check if agent supports a specific unlock method
export const supportsUnlockMethod = (agentId: string, method: UnlockMethod): boolean => {
  const contract = agentUnlockContracts[agentId];
  return contract?.contractType === method;
};

// Helper function to get all agents by unlock method
export const getAgentsByUnlockMethod = (method: UnlockMethod): AgentUnlockContract[] => {
  return Object.values(agentUnlockContracts).filter(contract => contract.contractType === method);
};