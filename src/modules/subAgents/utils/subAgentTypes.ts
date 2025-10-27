export type PaymentModel = 'NFT' | 'Subscription' | 'TokenUnlock';

export interface SubAgent {
  id: string;
  name: string;
  description: string;
  parent: 'CFO' | 'Care' | 'Alpha';
  model: PaymentModel;
  price?: number; // Optional for Subscription and TokenUnlock models
  metadataURI?: string;
  tokenRequirement?: number;
  subscriptionMonthly?: number;
  status: 'Available' | 'ComingSoon';
  features?: string[];
  icon?: string;
  category?: string;
}

export interface SubAgentCardProps {
  subAgent: SubAgent;
  onMint?: (subAgent: SubAgent) => void;
  onSubscribe?: (subAgent: SubAgent) => void;
  onUnlock?: (subAgent: SubAgent) => void;
  userTokens?: number;
  isUnlocked?: boolean;
}

export interface SubAgentModalProps {
  subAgent: SubAgent | null;
  isOpen: boolean;
  onClose: () => void;
  onMint?: (subAgent: SubAgent) => void;
  onSubscribe?: (subAgent: SubAgent) => void;
  onUnlock?: (subAgent: SubAgent) => void;
  userTokens?: number;
}

export interface SubAgentConfig {
  masterAgentId: string;
  masterAgentName: string;
  subAgents: SubAgent[];
}

export const getPaymentModelDisplay = (model: PaymentModel): string => {
  switch (model) {
    case 'NFT':
      return 'NFT Mint';
    case 'Subscription':
      return 'Monthly Subscription';
    case 'TokenUnlock':
      return 'Token Unlock';
    default:
      return 'Unknown';
  }
};

export const getPaymentModelColor = (model: PaymentModel): string => {
  switch (model) {
    case 'NFT':
      return 'purple';
    case 'Subscription':
      return 'blue';
    case 'TokenUnlock':
      return 'emerald';
    default:
      return 'gray';
  }
};
