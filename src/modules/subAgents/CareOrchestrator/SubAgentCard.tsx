'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { SubAgentCardProps, getPaymentModelDisplay, getPaymentModelColor } from '../utils/subAgentTypes';

const SubAgentCard: React.FC<SubAgentCardProps> = ({
  subAgent,
  onMint,
  onSubscribe,
  onUnlock,
  userTokens = 0,
  isUnlocked = false
}) => {
  const { model, price, subscriptionMonthly, tokenRequirement } = subAgent;
  const modelColor = getPaymentModelColor(model);
  const modelDisplay = getPaymentModelDisplay(model);

  const getPriceDisplay = () => {
    switch (model) {
      case 'NFT':
        return `${price} DMT`;
      case 'Subscription':
        return `${subscriptionMonthly} DMT/mo`;
      case 'TokenUnlock':
        return `${tokenRequirement} DMT`;
      default:
        return 'N/A';
    }
  };

  const getButtonText = () => {
    switch (model) {
      case 'NFT':
        return 'Mint NFT';
      case 'Subscription':
        return 'Subscribe';
      case 'TokenUnlock':
        return isUnlocked ? 'Unlocked' : 'Unlock';
      default:
        return 'Get Access';
    }
  };

  const getButtonAction = () => {
    switch (model) {
      case 'NFT':
        return onMint;
      case 'Subscription':
        return onSubscribe;
      case 'TokenUnlock':
        return onUnlock;
      default:
        return undefined;
    }
  };

  const canAfford = () => {
    switch (model) {
      case 'NFT':
        return userTokens >= price;
      case 'Subscription':
        return true; // Subscription doesn't require upfront tokens
      case 'TokenUnlock':
        return userTokens >= (tokenRequirement || 0);
      default:
        return false;
    }
  };

  const isDisabled = () => {
    if (subAgent.status === 'ComingSoon') return true;
    if (model === 'TokenUnlock' && isUnlocked) return true;
    if (model === 'TokenUnlock' && !canAfford()) return true;
    if (model === 'NFT' && !canAfford()) return true;
    return false;
  };

  const getColorClasses = (color: string) => {
    const colorMap = {
      purple: 'from-purple-500 to-purple-600 hover:from-purple-600 hover:to-purple-700',
      blue: 'from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700',
      emerald: 'from-emerald-500 to-emerald-600 hover:from-emerald-600 hover:to-emerald-700',
      gray: 'from-gray-500 to-gray-600 hover:from-gray-600 hover:to-gray-700'
    };
    return colorMap[color as keyof typeof colorMap] || colorMap.gray;
  };

  const getBorderColor = (color: string) => {
    const colorMap = {
      purple: 'border-purple-500/50 hover:border-purple-400',
      blue: 'border-blue-500/50 hover:border-blue-400',
      emerald: 'border-emerald-500/50 hover:border-emerald-400',
      gray: 'border-gray-500/50 hover:border-gray-400'
    };
    return colorMap[color as keyof typeof colorMap] || colorMap.gray;
  };

  const getShadowColor = (color: string) => {
    const colorMap = {
      purple: 'shadow-purple-500/20',
      blue: 'shadow-blue-500/20',
      emerald: 'shadow-emerald-500/20',
      gray: 'shadow-gray-500/20'
    };
    return colorMap[color as keyof typeof colorMap] || colorMap.gray;
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ scale: 1.02 }}
      className={`group relative bg-slate-800/50 backdrop-blur-sm rounded-2xl p-6 border transition-all duration-300 hover:shadow-2xl ${getBorderColor(modelColor)} ${getShadowColor(modelColor)}`}
    >
      {/* Status Badge */}
      <div className="absolute top-4 right-4">
        <span className={`px-3 py-1 rounded-full text-xs font-medium ${
          subAgent.status === 'Available'
            ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
            : 'bg-yellow-500/20 text-yellow-400 border border-yellow-500/30'
        }`}>
          {subAgent.status}
        </span>
      </div>

      {/* Icon */}
      <div className="text-4xl mb-4 group-hover:scale-110 transition-transform duration-300">
        {subAgent.icon}
      </div>

      {/* Title */}
      <h3 className="text-xl font-bold text-white mb-2 group-hover:text-purple-300 transition-colors">
        {subAgent.name}
      </h3>

      {/* Category */}
      {subAgent.category && (
        <div className="text-sm text-gray-400 mb-3">
          {subAgent.category}
        </div>
      )}

      {/* Description */}
      <p className="text-gray-300 text-sm mb-4 leading-relaxed">
        {subAgent.description}
      </p>

      {/* Features */}
      {subAgent.features && subAgent.features.length > 0 && (
        <div className="mb-4">
          <h4 className="text-sm font-semibold text-gray-400 mb-2">Features:</h4>
          <ul className="space-y-1">
            {subAgent.features.slice(0, 3).map((feature, index) => (
              <li key={index} className="flex items-center text-xs text-gray-300">
                <span className="w-1.5 h-1.5 bg-purple-400 rounded-full mr-2"></span>
                {feature}
              </li>
            ))}
            {subAgent.features.length > 3 && (
              <li className="text-xs text-gray-400">
                +{subAgent.features.length - 3} more features
              </li>
            )}
          </ul>
        </div>
      )}

      {/* Payment Model */}
      <div className="mb-4">
        <div className="flex items-center justify-between">
          <span className="text-sm text-gray-400">Model:</span>
          <span className={`px-2 py-1 rounded text-xs font-medium bg-${modelColor}-500/20 text-${modelColor}-400 border border-${modelColor}-500/30`}>
            {modelDisplay}
          </span>
        </div>
        <div className="flex items-center justify-between mt-2">
          <span className="text-sm text-gray-400">Price:</span>
          <span className="text-lg font-bold text-white">{getPriceDisplay()}</span>
        </div>
      </div>

      {/* Token Balance Check */}
      {model === 'TokenUnlock' && !isUnlocked && (
        <div className="mb-4 p-3 bg-slate-700/30 rounded-lg">
          <div className="flex items-center justify-between text-sm">
            <span className="text-gray-400">Your DMT:</span>
            <span className={`font-medium ${canAfford() ? 'text-emerald-400' : 'text-red-400'}`}>
              {userTokens.toLocaleString()} DMT
            </span>
          </div>
          {!canAfford() && (
            <div className="text-xs text-red-400 mt-1">
              Need {(tokenRequirement || 0) - userTokens} more DMT
            </div>
          )}
        </div>
      )}

      {/* Action Button */}
      <motion.button
        whileHover={{ scale: isDisabled() ? 1 : 1.05 }}
        whileTap={{ scale: isDisabled() ? 1 : 0.95 }}
        onClick={() => {
          const action = getButtonAction();
          if (action && !isDisabled()) {
            action(subAgent);
          }
        }}
        disabled={isDisabled()}
        className={`w-full py-3 rounded-xl font-semibold transition-all duration-300 ${
          isDisabled()
            ? 'bg-gray-600 text-gray-400 cursor-not-allowed'
            : `bg-gradient-to-r ${getColorClasses(modelColor)} text-white`
        }`}
      >
        {getButtonText()}
      </motion.button>

      {/* Hover Effect Overlay */}
      <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-purple-500/5 to-blue-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />
    </motion.div>
  );
};

export default SubAgentCard;
