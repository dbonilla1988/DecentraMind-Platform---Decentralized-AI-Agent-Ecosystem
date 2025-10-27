'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { SubAgent } from '../utils/subAgentTypes';

interface LockedAgentCardProps {
  subAgent: SubAgent;
  accessType: 'nft' | 'subscription' | 'unlock' | 'none';
  onUnlock?: (subAgent: SubAgent) => void;
  onMint?: (subAgent: SubAgent) => void;
  onSubscribe?: (subAgent: SubAgent) => void;
  className?: string;
}

const LockedAgentCard: React.FC<LockedAgentCardProps> = ({
  subAgent,
  accessType,
  onUnlock,
  onMint,
  onSubscribe,
  className = ''
}) => {
  const handleAction = () => {
    switch (accessType) {
      case 'nft':
        if (onMint) onMint(subAgent);
        break;
      case 'subscription':
        if (onSubscribe) onSubscribe(subAgent);
        break;
      case 'unlock':
        if (onUnlock) onUnlock(subAgent);
        break;
      default:
        console.log(`No action available for ${subAgent.name}`);
    }
  };

  const getLockIcon = () => {
    switch (accessType) {
      case 'nft':
        return '🔒';
      case 'subscription':
        return '⏰';
      case 'unlock':
        return '💰';
      default:
        return '🔒';
    }
  };

  const getActionText = () => {
    switch (accessType) {
      case 'nft':
        return 'Mint NFT';
      case 'subscription':
        return 'Subscribe';
      case 'unlock':
        return 'Unlock';
      default:
        return 'Get Access';
    }
  };

  const getPriceText = () => {
    switch (subAgent.model) {
      case 'NFT':
        return `${subAgent.price} DMT`;
      case 'Subscription':
        return `${subAgent.subscriptionMonthly} DMT/mo`;
      case 'TokenUnlock':
        return `${subAgent.tokenRequirement} DMT`;
      default:
        return 'N/A';
    }
  };

  const getColorClasses = () => {
    switch (accessType) {
      case 'nft':
        return {
          border: 'border-purple-500/30 hover:border-purple-400/50',
          shadow: 'hover:shadow-purple-500/20',
          button: 'from-purple-500 to-purple-600 hover:from-purple-600 hover:to-purple-700',
          overlay: 'from-purple-500/5 to-purple-600/5'
        };
      case 'subscription':
        return {
          border: 'border-blue-500/30 hover:border-blue-400/50',
          shadow: 'hover:shadow-blue-500/20',
          button: 'from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700',
          overlay: 'from-blue-500/5 to-blue-600/5'
        };
      case 'unlock':
        return {
          border: 'border-emerald-500/30 hover:border-emerald-400/50',
          shadow: 'hover:shadow-emerald-500/20',
          button: 'from-emerald-500 to-emerald-600 hover:from-emerald-600 hover:to-emerald-700',
          overlay: 'from-emerald-500/5 to-emerald-600/5'
        };
      default:
        return {
          border: 'border-gray-500/30 hover:border-gray-400/50',
          shadow: 'hover:shadow-gray-500/20',
          button: 'from-gray-500 to-gray-600 hover:from-gray-600 hover:to-gray-700',
          overlay: 'from-gray-500/5 to-gray-600/5'
        };
    }
  };

  const colors = getColorClasses();

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ scale: 1.02, y: -5 }}
      className={`group relative bg-slate-800/30 backdrop-blur-sm rounded-2xl p-6 border ${colors.border} transition-all duration-300 hover:shadow-2xl ${colors.shadow} ${className}`}
    >
      {/* Lock Badge */}
      <div className="absolute top-3 right-3">
        <span className="px-2 py-1 rounded-full text-xs font-medium bg-gray-500/20 text-gray-400 border border-gray-500/30">
          🔒 Locked
        </span>
      </div>

      {/* Lock Icon Overlay */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
        <div className="text-6xl opacity-20">{getLockIcon()}</div>
      </div>

      {/* Icon */}
      <div className="text-4xl mb-4 group-hover:scale-110 transition-transform duration-300 opacity-60">
        {subAgent.icon}
      </div>

      {/* Title and Model */}
      <div className="flex items-center justify-between mb-3">
        <h3 className="text-xl font-bold text-gray-400 group-hover:text-gray-300 transition-colors">
          {subAgent.name}
        </h3>
        <span className="px-2 py-1 rounded-full text-xs font-medium bg-gray-500/20 text-gray-400 border border-gray-500/30">
          {subAgent.model}
        </span>
      </div>

      {/* Category */}
      {subAgent.category && (
        <div className="text-sm text-gray-500 mb-3">
          {subAgent.category}
        </div>
      )}

      {/* Description */}
      <p className="text-gray-400 text-sm mb-4 leading-relaxed opacity-75">
        {subAgent.description}
      </p>

      {/* Features Preview */}
      {subAgent.features && subAgent.features.length > 0 && (
        <div className="mb-6">
          <h4 className="text-sm font-semibold text-gray-500 mb-2">Features:</h4>
          <ul className="space-y-1">
            {subAgent.features.slice(0, 2).map((feature, index) => (
              <li key={index} className="flex items-center text-xs text-gray-500">
                <span className="w-1.5 h-1.5 bg-gray-500 rounded-full mr-2"></span>
                {feature}
              </li>
            ))}
            <li className="text-xs text-gray-600">
              +{subAgent.features.length - 2} more features
            </li>
          </ul>
        </div>
      )}

      {/* Price Display */}
      <div className="mb-4 p-3 bg-slate-700/30 rounded-lg">
        <div className="flex items-center justify-between">
          <span className="text-sm text-gray-400">Price:</span>
          <span className="text-lg font-bold text-white">{getPriceText()}</span>
        </div>
      </div>

      {/* Action Button */}
      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={handleAction}
        className={`w-full py-3 rounded-xl font-semibold transition-all duration-300 bg-gradient-to-r ${colors.button} text-white`}
      >
        <span className="flex items-center justify-center">
          <span className="mr-2">{getLockIcon()}</span>
          {getActionText()}
        </span>
      </motion.button>

      {/* Hover Effect Overlay */}
      <div className={`absolute inset-0 rounded-2xl bg-gradient-to-r ${colors.overlay} opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none`} />
    </motion.div>
  );
};

export default LockedAgentCard;

















