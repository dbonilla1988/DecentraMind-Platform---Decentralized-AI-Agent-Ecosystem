'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { SubAgent } from '../../../src/modules/subAgents/utils/subAgentTypes';
import { useWalletBalance } from '../../hooks/useWalletBalance';
import { useXPLogging } from '../../hooks/useXPLogging';

interface SubAgentCardProps {
  subAgent: SubAgent;
  onMint?: (subAgent: SubAgent) => void;
  onSubscribe?: (subAgent: SubAgent) => void;
  onUnlock?: (subAgent: SubAgent) => void;
  userTokens?: number;
  isUnlocked?: boolean;
  onClick?: () => void;
}

const SubAgentCard: React.FC<SubAgentCardProps> = ({
  subAgent,
  onMint,
  onSubscribe,
  onUnlock,
  onClick
}) => {
  const { balance, checkUnlockStatus, isAgentUnlocked, unlockAgent } = useWalletBalance();
  const { logAgentUnlock } = useXPLogging();
  const unlockStatus = checkUnlockStatus(subAgent);
  const unlocked = isAgentUnlocked(subAgent);

  const getPaymentModelIcon = (model: string) => {
    switch (model) {
      case 'NFT': return '🎨';
      case 'Subscription': return '🔄';
      case 'TokenUnlock': return '🔓';
      default: return '💰';
    }
  };

  const getPaymentModelColor = (model: string) => {
    switch (model) {
      case 'NFT': return 'from-purple-500 to-purple-600';
      case 'Subscription': return 'from-blue-500 to-blue-600';
      case 'TokenUnlock': return 'from-emerald-500 to-emerald-600';
      default: return 'from-gray-500 to-gray-600';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Available': return 'bg-green-500/20 text-green-400 border-green-500/30';
      case 'ComingSoon': return 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30';
      default: return 'bg-gray-500/20 text-gray-400 border-gray-500/30';
    }
  };

  const getUnlockButtonText = () => {
    if (unlocked) return 'Unlocked';
    
    switch (subAgent.model) {
      case 'NFT':
        return `Mint NFT (${subAgent.price} DMT)`;
      case 'Subscription':
        return `Subscribe (${subAgent.subscriptionMonthly} DMT/mo)`;
      case 'TokenUnlock':
        return `Unlock (${subAgent.tokenRequirement} DMT)`;
      default:
        return 'Unlock';
    }
  };

  const handleUnlockClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    
    if (unlocked) return;

    // Log XP reward for unlocking agent
    logAgentUnlock(subAgent.id, subAgent.name, 'sub');

    switch (subAgent.model) {
      case 'NFT':
        onMint?.(subAgent);
        break;
      case 'Subscription':
        onSubscribe?.(subAgent);
        break;
      case 'TokenUnlock':
        onUnlock?.(subAgent);
        break;
    }
  };

  const canAfford = () => {
    switch (subAgent.model) {
      case 'NFT':
        return balance.dmt >= (subAgent.price || 0);
      case 'Subscription':
        return balance.dmt >= (subAgent.subscriptionMonthly || 0);
      case 'TokenUnlock':
        return balance.dmt >= (subAgent.tokenRequirement || 0);
      default:
        return false;
    }
  };

  return (
    <motion.div
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      onClick={onClick}
      className={`relative cursor-pointer bg-slate-800/50 backdrop-blur-sm rounded-xl p-6 border transition-all duration-300 ${
        unlocked 
          ? 'border-emerald-500/50 bg-emerald-500/10 ring-2 ring-emerald-500/20' 
          : 'border-slate-700/30 hover:border-slate-600/50 hover:bg-slate-700/30'
      }`}
    >
      {/* Unlock Status Indicator */}
      {unlocked && (
        <div className="absolute top-3 right-3">
          <div className="w-3 h-3 bg-emerald-500 rounded-full animate-pulse"></div>
        </div>
      )}

      {/* Header */}
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center space-x-3">
          <div className="text-3xl">{subAgent.icon}</div>
          <div>
            <h3 className="text-lg font-semibold text-white">{subAgent.name}</h3>
            <p className="text-gray-400 text-sm">{subAgent.category}</p>
          </div>
        </div>
        <div className={`px-2 py-1 rounded-full text-xs font-medium border ${getStatusColor(subAgent.status)}`}>
          {subAgent.status}
        </div>
      </div>

      {/* Description */}
      <p className="text-gray-300 text-sm mb-4 line-clamp-2">{subAgent.description}</p>

      {/* Payment Model */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center space-x-2">
          <span className="text-lg">{getPaymentModelIcon(subAgent.model)}</span>
          <span className="text-sm text-gray-400">
            {subAgent.model === 'NFT' && `${subAgent.price} DMT`}
            {subAgent.model === 'Subscription' && `${subAgent.subscriptionMonthly} DMT/mo`}
            {subAgent.model === 'TokenUnlock' && `${subAgent.tokenRequirement} DMT`}
          </span>
        </div>
        <div className={`px-2 py-1 rounded-full text-xs font-medium bg-gradient-to-r ${getPaymentModelColor(subAgent.model)} text-white`}>
          {subAgent.model}
        </div>
      </div>

      {/* Features */}
      {subAgent.features && (
        <div className="mb-4">
          <div className="text-sm text-gray-400 mb-2">Features:</div>
          <div className="flex flex-wrap gap-1">
            {subAgent.features.slice(0, 3).map((feature, index) => (
              <span
                key={index}
                className="px-2 py-1 bg-slate-700/50 text-xs text-gray-300 rounded-full"
              >
                {feature}
              </span>
            ))}
            {subAgent.features.length > 3 && (
              <span className="px-2 py-1 bg-slate-700/50 text-xs text-gray-300 rounded-full">
                +{subAgent.features.length - 3} more
              </span>
            )}
          </div>
        </div>
      )}

      {/* Unlock Button */}
      <motion.button
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        onClick={handleUnlockClick}
        disabled={unlocked || !canAfford() || subAgent.status === 'ComingSoon'}
        className={`w-full py-3 rounded-lg font-medium transition-all duration-300 ${
          unlocked
            ? 'bg-emerald-500/20 text-emerald-400 cursor-default'
            : !canAfford() || subAgent.status === 'ComingSoon'
            ? 'bg-gray-500/20 text-gray-400 cursor-not-allowed'
            : `bg-gradient-to-r ${getPaymentModelColor(subAgent.model)} hover:shadow-lg hover:shadow-${subAgent.model.toLowerCase()}-500/25 text-white`
        }`}
      >
        {unlocked ? '✅ Unlocked' : getUnlockButtonText()}
      </motion.button>

      {/* Insufficient Funds Warning */}
      {!canAfford() && !unlocked && subAgent.status === 'Available' && (
        <div className="mt-2 text-xs text-red-400 text-center">
          Insufficient DMT balance
        </div>
      )}

      {/* Coming Soon Overlay */}
      {subAgent.status === 'ComingSoon' && (
        <div className="absolute inset-0 bg-slate-900/80 backdrop-blur-sm rounded-xl flex items-center justify-center">
          <div className="text-center">
            <div className="text-2xl mb-2">🚀</div>
            <div className="text-white font-semibold">Coming Soon</div>
            <div className="text-gray-400 text-sm">Stay tuned!</div>
          </div>
        </div>
      )}
    </motion.div>
  );
};

export default SubAgentCard;
