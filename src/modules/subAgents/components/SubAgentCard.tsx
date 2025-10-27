'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { SubAgent } from '../utils/subAgentTypes';

interface SubAgentCardProps {
  subAgent: SubAgent;
  onUse?: (subAgent: SubAgent) => void;
  className?: string;
}

const SubAgentCard: React.FC<SubAgentCardProps> = ({
  subAgent,
  onUse,
  className = ''
}) => {
  const handleUse = () => {
    if (onUse) {
      onUse(subAgent);
    } else {
      console.log(`Using sub-agent: ${subAgent.name}`);
      // Default action - could trigger sub-agent execution
    }
  };

  const getAccessBadge = () => {
    // This would be determined by the access hook in the parent component
    return (
      <div className="absolute top-3 right-3">
        <span className="px-2 py-1 rounded-full text-xs font-medium bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
          ✓ Unlocked
        </span>
      </div>
    );
  };

  const getModelBadge = () => {
    const colorMap = {
      NFT: 'bg-purple-500/20 text-purple-400 border-purple-500/30',
      Subscription: 'bg-blue-500/20 text-blue-400 border-blue-500/30',
      TokenUnlock: 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30'
    };

    return (
      <span className={`px-2 py-1 rounded-full text-xs font-medium border ${colorMap[subAgent.model]}`}>
        {subAgent.model}
      </span>
    );
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ scale: 1.02, y: -5 }}
      className={`group relative bg-slate-800/50 backdrop-blur-sm rounded-2xl p-6 border border-emerald-500/30 hover:border-emerald-400/50 transition-all duration-300 hover:shadow-2xl hover:shadow-emerald-500/20 ${className}`}
    >
      {/* Access Badge */}
      {getAccessBadge()}

      {/* Icon */}
      <div className="text-4xl mb-4 group-hover:scale-110 transition-transform duration-300">
        {subAgent.icon}
      </div>

      {/* Title and Model */}
      <div className="flex items-center justify-between mb-3">
        <h3 className="text-xl font-bold text-white group-hover:text-emerald-300 transition-colors">
          {subAgent.name}
        </h3>
        {getModelBadge()}
      </div>

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
        <div className="mb-6">
          <h4 className="text-sm font-semibold text-gray-400 mb-2">Features:</h4>
          <ul className="space-y-1">
            {subAgent.features.slice(0, 3).map((feature, index) => (
              <li key={index} className="flex items-center text-xs text-gray-300">
                <span className="w-1.5 h-1.5 bg-emerald-400 rounded-full mr-2"></span>
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

      {/* Action Button */}
      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={handleUse}
        className="w-full py-3 rounded-xl font-semibold transition-all duration-300 bg-gradient-to-r from-emerald-500 to-green-500 hover:from-emerald-600 hover:to-green-600 text-white"
      >
        <span className="flex items-center justify-center">
          <span className="mr-2">🚀</span>
          Use Agent
        </span>
      </motion.button>

      {/* Hover Effect Overlay */}
      <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-emerald-500/5 to-green-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />
    </motion.div>
  );
};

export default SubAgentCard;

















