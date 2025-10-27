'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { useWalletBalance } from '../../../hooks/useWalletBalance';
import { useXPLogging } from '../../../hooks/useXPLogging';
import { AgentMetadata } from '../../../data/agentMetadata';

interface AgentCardProps {
  agentData: AgentMetadata;
  onClick: () => void;
}

const AgentCard: React.FC<AgentCardProps> = ({
  agentData,
  onClick
}) => {
  const { balance, isAgentUnlocked } = useWalletBalance();
  const { logAgentUnlock } = useXPLogging();

  const unlocked = isAgentUnlocked(agentData);

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

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'available': return 'bg-green-500/20 text-green-400 border-green-500/30';
      case 'coming-soon': return 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30';
      default: return 'bg-gray-500/20 text-gray-400 border-gray-500/30';
    }
  };

  const getUnlockButtonText = () => {
    if (unlocked) return 'Unlocked';
    
    switch (agentData.unlockType) {
      case 'NFT':
        return `Mint NFT (${agentData.cost} DMT)`;
      case 'Subscription':
        return `Subscribe (${agentData.cost} DMT/mo)`;
      case 'TokenUnlock':
        return `Unlock (${agentData.cost} DMT)`;
      default:
        return 'Unlock';
    }
  };

  const handleUnlockClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    
    if (unlocked) return;

    // Log XP reward for unlocking agent
    logAgentUnlock(agentData.id, agentData.name, 'sub');
  };

  const canAfford = () => {
    return balance.dmt >= agentData.cost;
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
          <div className="text-3xl">{agentData.icon}</div>
          <div>
            <h3 className="text-lg font-semibold text-white">{agentData.name}</h3>
            <p className="text-gray-400 text-sm">{agentData.category}</p>
          </div>
        </div>
        <div className={`px-2 py-1 rounded-full text-xs font-medium border ${getStatusColor(agentData.status)}`}>
          {agentData.status === 'coming-soon' ? 'Coming Soon' : 'Available'}
        </div>
      </div>

      {/* Description */}
      <p className="text-gray-300 text-sm mb-4 line-clamp-2">{agentData.description}</p>

      {/* Payment Model */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center space-x-2">
          <span className="text-lg">{getPaymentModelIcon(agentData.unlockType)}</span>
          <span className="text-sm text-gray-400">
            {agentData.unlockType === 'Subscription' ? `${agentData.cost} DMT/mo` : `${agentData.cost} DMT`}
          </span>
        </div>
        <div className={`px-2 py-1 rounded-full text-xs font-medium bg-gradient-to-r ${getPaymentModelColor(agentData.unlockType)} text-white`}>
          {agentData.unlockType}
        </div>
      </div>

      {/* Features */}
      <div className="mb-4">
        <div className="text-sm text-gray-400 mb-2">Features:</div>
        <div className="flex flex-wrap gap-1">
          {agentData.features.slice(0, 3).map((feature, index) => (
            <span
              key={index}
              className="px-2 py-1 bg-slate-700/50 text-xs text-gray-300 rounded-full"
            >
              {feature}
            </span>
          ))}
          {agentData.features.length > 3 && (
            <span className="px-2 py-1 bg-slate-700/50 text-xs text-gray-300 rounded-full">
              +{agentData.features.length - 3} more
            </span>
          )}
        </div>
      </div>

      {/* XP Requirements */}
      <div className="mb-4 p-3 bg-blue-500/10 border border-blue-500/20 rounded-lg">
        <div className="flex items-center space-x-2">
          <span className="text-blue-400">⭐</span>
          <span className="text-sm text-blue-300">Requires Level {agentData.levelRequired}+ Care Orchestrator</span>
        </div>
      </div>

      {/* Unlock Button */}
      <motion.button
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        onClick={handleUnlockClick}
        disabled={unlocked || !canAfford() || agentData.status === 'coming-soon'}
        className={`w-full py-3 rounded-lg font-medium transition-all duration-300 ${
          unlocked
            ? 'bg-emerald-500/20 text-emerald-400 cursor-default'
            : !canAfford() || agentData.status === 'coming-soon'
            ? 'bg-gray-500/20 text-gray-400 cursor-not-allowed'
            : `bg-gradient-to-r ${getPaymentModelColor(agentData.unlockType)} hover:shadow-lg text-white`
        }`}
      >
        {unlocked ? '✅ Unlocked' : getUnlockButtonText()}
      </motion.button>

      {/* Insufficient Funds Warning */}
      {!canAfford() && !unlocked && agentData.status === 'available' && (
        <div className="mt-2 text-xs text-red-400 text-center">
          Insufficient DMT balance
        </div>
      )}

      {/* Coming Soon Overlay */}
      {agentData.status === 'coming-soon' && (
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

export default AgentCard;
