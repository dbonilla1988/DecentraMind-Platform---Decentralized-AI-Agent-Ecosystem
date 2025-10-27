'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { toast } from 'react-hot-toast';
import { SubAgentMetadata } from '../../../data/agentMetadata';
import AgentInteractionModal from '../modals/AgentInteractionModal';
import { useSubAgentUnlocks } from '../../../hooks/useSubAgentUnlocks';
import { useWalletBalance } from '../../../hooks/useWalletBalance';
import { mockWeb3Provider, mockContractStatus } from '../../../mocks/mockWeb3';

interface SubAgentCardProps {
  subAgentData: SubAgentMetadata;
  agentId: string;
  onClick: () => void;
  userId?: string;
  masterAgent?: SubAgentMetadata; // Add master agent for context
}

const SubAgentCard: React.FC<SubAgentCardProps> = ({
  subAgentData,
  agentId,
  onClick,
  masterAgent,
  userId = 'mock-user'
}) => {
  const [showInteractionModal, setShowInteractionModal] = useState(false);
  const [isUnlocking, setIsUnlocking] = useState(false);
  
  // Use unlock hooks
  const { isSubAgentUnlocked, unlockSubAgent, isLoading: unlocksLoading } = useSubAgentUnlocks(userId);
  const { balance } = useWalletBalance();
  
  // Check unlock status
  const unlocked = isSubAgentUnlocked(agentId, subAgentData.id);
  const isComingSoon = subAgentData.status === 'coming-soon';
  
  // Check if user can afford the unlock
  const canAfford = (() => {
    switch (subAgentData.unlockType) {
      case 'TokenUnlock':
        return balance >= subAgentData.cost;
      case 'Subscription':
        return true; // Subscriptions are handled by Stripe
      case 'NFT':
        return true; // NFTs are handled by Solana Pay
      default:
        return false;
    }
  })();

  const getPaymentModelIcon = (unlockType: string) => {
    switch (unlockType) {
      case 'NFT': return '🎨';
      case 'Subscription': return '🔄';
      case 'TokenUnlock': return '🔓';
      default: return '💰';
    }
  };

  const getPaymentModelColor = (unlockType: string) => {
    switch (unlockType) {
      case 'NFT': return 'from-purple-500 to-purple-600';
      case 'Subscription': return 'from-blue-500 to-blue-600';
      case 'TokenUnlock': return 'from-emerald-500 to-emerald-600';
      default: return 'from-gray-500 to-gray-600';
    }
  };

  // Handle unlock action
  const handleUnlock = async (e: React.MouseEvent) => {
    e.stopPropagation();
    
    if (isUnlocking || unlocked) return;
    
    setIsUnlocking(true);
    
    try {
      const result = await unlockSubAgent({
        userId,
        agentId,
        subAgentId: subAgentData.id,
        method: subAgentData.unlockType,
        tx: {
          cost: subAgentData.cost,
          contractAddress: subAgentData.contractAddress,
          subscriptionId: subAgentData.subscriptionId,
          tokenAddress: subAgentData.tokenAddress
        }
      });
      
      if (result.success) {
        toast.success(`🎉 ${subAgentData.name} unlocked successfully!`, {
          duration: 4000,
          icon: '✅'
        });
      } else {
        toast.error(result.error || 'Failed to unlock agent', {
          duration: 4000,
          icon: '❌'
        });
      }
    } catch (error) {
      console.error('Unlock error:', error);
      toast.error('An unexpected error occurred', {
        duration: 4000,
        icon: '❌'
      });
    } finally {
      setIsUnlocking(false);
    }
  };

  const getStatusBadge = () => {
    if (unlocked) {
      return (
        <span className="bg-green-500/20 text-green-400 text-xs px-3 py-1 rounded-full border border-green-500/30">
          ✅ Active
        </span>
      );
    }
    if (isComingSoon) {
      return (
        <span className="bg-yellow-500/20 text-yellow-400 text-xs px-3 py-1 rounded-full border border-yellow-500/30">
          🚀 Coming Soon
        </span>
      );
    }
    return (
      <span className="bg-blue-500/20 text-blue-400 text-xs px-3 py-1 rounded-full border border-blue-500/30">
        Available
      </span>
    );
  };

  const getUnlockButtonText = () => {
    if (isUnlocking) {
      return 'Unlocking...';
    }
    
    switch (subAgentData.unlockType) {
      case 'NFT':
        return `Mint NFT (${subAgentData.cost} DMT)`;
      case 'Subscription':
        return `Subscribe ($${subAgentData.cost}/mo)`;
      case 'TokenUnlock':
        return `Unlock with ${subAgentData.cost} DMT`;
      default:
        return `Unlock ${subAgentData.name}`;
    }
  };

  return (
    <motion.div
      whileHover={{ y: -5, boxShadow: '0 10px 20px rgba(0,0,0,0.2)' }}
      className={`relative bg-slate-800/50 backdrop-blur-sm rounded-xl p-6 border transition-all duration-300 cursor-pointer ${
        unlocked
          ? 'border-green-500/50 bg-green-500/10'
          : 'border-slate-700/30 hover:border-slate-600/50 hover:bg-slate-700/30'
      }`}
      onClick={onClick}
    >
      {/* Status Badge */}
      <div className="absolute top-4 right-4">
        {getStatusBadge()}
      </div>

      {/* Agent Icon and Name */}
      <div className="flex items-center space-x-3 mb-4">
        <div className="text-3xl">{subAgentData.icon}</div>
        <div>
          <h3 className="text-lg font-semibold text-white">{subAgentData.name}</h3>
          <p className="text-gray-400 text-sm">{subAgentData.category}</p>
        </div>
      </div>

      {/* Description */}
      <p className="text-gray-300 text-sm mb-4 line-clamp-2">
        {subAgentData.description}
      </p>

      {/* Payment Model */}
      <div className={`p-3 rounded-lg bg-gradient-to-r ${getPaymentModelColor(subAgentData.unlockType)} text-white mb-4`}>
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <span className="text-lg">{getPaymentModelIcon(subAgentData.unlockType)}</span>
            <span className="text-sm font-medium">{subAgentData.unlockType}</span>
          </div>
          <span className="text-sm font-bold">{subAgentData.cost} DMT</span>
        </div>
      </div>

      {/* Level Requirement */}
      <div className="flex items-center justify-between mb-4">
        <span className="text-gray-400 text-sm">Level Required:</span>
        <span className="text-white font-medium">Level {subAgentData.levelRequired}+</span>
      </div>

      {/* Features Preview */}
      {subAgentData.features && (
        <div className="mb-4">
          <div className="flex flex-wrap gap-1">
            {subAgentData.features.slice(0, 2).map((feature, index) => (
              <span
                key={index}
                className="text-xs bg-slate-700/50 text-gray-300 px-2 py-1 rounded-full"
              >
                {feature}
              </span>
            ))}
            {subAgentData.features.length > 2 && (
              <span className="text-xs bg-slate-700/50 text-gray-300 px-2 py-1 rounded-full">
                +{subAgentData.features.length - 2} more
              </span>
            )}
          </div>
        </div>
      )}

      {/* Action Buttons */}
      {!isComingSoon && (
        <div className="space-y-2">
          {unlocked ? (
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={(e) => {
                e.stopPropagation();
                setShowInteractionModal(true);
              }}
              className="w-full py-2 px-4 rounded-lg font-medium transition-all duration-300 bg-gradient-to-r from-purple-500 to-blue-500 hover:from-purple-600 hover:to-blue-600 text-white"
            >
              🤖 Interact with Agent
            </motion.button>
          ) : (
            <motion.button
              whileHover={{ scale: canAfford && !isUnlocking ? 1.02 : 1 }}
              whileTap={{ scale: canAfford && !isUnlocking ? 0.98 : 1 }}
              onClick={handleUnlock}
              disabled={!canAfford || isUnlocking}
              className={`w-full py-2 px-4 rounded-lg font-medium transition-all duration-300 ${
                canAfford && !isUnlocking
                  ? `bg-gradient-to-r ${getPaymentModelColor(subAgentData.unlockType)} hover:shadow-lg text-white`
                  : 'bg-gray-500/20 text-gray-400 cursor-not-allowed'
              }`}
            >
              {isUnlocking ? (
                <div className="flex items-center justify-center space-x-2">
                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                  <span>Unlocking...</span>
                </div>
              ) : (
                getUnlockButtonText()
              )}
            </motion.button>
          )}
          
          {/* Preview Button for locked agents */}
          {!unlocked && (
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={(e) => {
                e.stopPropagation();
                setShowInteractionModal(true);
              }}
              className="w-full py-2 px-4 rounded-lg font-medium transition-all duration-300 bg-slate-700/50 hover:bg-slate-600/50 text-gray-300 hover:text-white border border-slate-600/30"
            >
              👁️ Preview Tasks
            </motion.button>
          )}
        </div>
      )}

      {/* Coming Soon Overlay */}
      {isComingSoon && (
        <div className="absolute inset-0 bg-slate-900/80 backdrop-blur-sm rounded-xl flex items-center justify-center">
          <div className="text-center">
            <div className="text-2xl mb-2">🚀</div>
            <div className="text-white font-semibold">Coming Soon</div>
            <div className="text-gray-400 text-sm">In Development</div>
          </div>
        </div>
      )}

      {/* Agent Interaction Modal */}
      <AgentInteractionModal
        agent={masterAgent || subAgentData}
        subAgent={subAgentData}
        isOpen={showInteractionModal}
        onClose={() => setShowInteractionModal(false)}
        walletAddress="mock-wallet-address"
      />
    </motion.div>
  );
};

export default SubAgentCard;