'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { SubAgentMetadata } from '../../../data/agentMetadata';

interface SubAgentModalProps {
  subAgentData: SubAgentMetadata | null;
  agentId: string;
  isOpen: boolean;
  onClose: () => void;
  userId?: string;
}

const SubAgentModal: React.FC<SubAgentModalProps> = ({
  subAgentData,
  agentId,
  isOpen,
  onClose,
  userId = 'mock-user'
}) => {
  const [isUnlocking, setIsUnlocking] = useState(false);
  const [unlockError, setUnlockError] = useState<string | null>(null);
  const [unlockSuccess, setUnlockSuccess] = useState(false);

  if (!subAgentData) return null;

  const handleUnlock = async () => {
    setIsUnlocking(true);
    setUnlockError(null);
    
    try {
      // Simulate unlock process
      await new Promise(resolve => setTimeout(resolve, 2000));
      setUnlockSuccess(true);
      
      // Close modal after success
      setTimeout(() => {
        onClose();
        setUnlockSuccess(false);
      }, 2000);
    } catch (error) {
      setUnlockError('Failed to unlock agent');
    } finally {
      setIsUnlocking(false);
    }
  };

  const getPaymentModelIcon = (unlockType: string) => {
    switch (unlockType) {
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

  const getUnlockButtonText = () => {
    if (isUnlocking) return 'Processing...';
    if (unlockSuccess) return 'Unlocked!';

    switch (subAgentData.unlockType) {
      case 'NFT':
        return `Mint NFT (${subAgentData.cost} DMT)`;
      case 'Subscription':
        return `Subscribe (${subAgentData.cost} DMT/mo)`;
      case 'TokenUnlock':
        return `Unlock (${subAgentData.cost} DMT)`;
      default:
        return 'Unlock';
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
          onClick={onClose}
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            className="bg-slate-800/90 backdrop-blur-sm rounded-2xl p-8 max-w-2xl w-full max-h-[90vh] overflow-y-auto border border-slate-700/50"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div className="flex items-start justify-between mb-6">
              <div className="flex items-center space-x-4">
                <div className="text-5xl">{subAgentData.icon}</div>
                <div>
                  <h2 className="text-2xl font-bold text-white">{subAgentData.name}</h2>
                  <p className="text-gray-400">{subAgentData.category}</p>
                </div>
              </div>
              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                onClick={onClose}
                className="text-gray-400 hover:text-white transition-colors"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </motion.button>
            </div>

            {/* Description */}
            <div className="mb-6">
              <h3 className="text-lg font-semibold text-white mb-2">Description</h3>
              <p className="text-gray-300">{subAgentData.description}</p>
            </div>

            {/* Features */}
            {subAgentData.features && (
              <div className="mb-6">
                <h3 className="text-lg font-semibold text-white mb-3">Capabilities</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                  {subAgentData.features.map((feature, index) => (
                    <div key={index} className="flex items-center space-x-2">
                      <div className="w-2 h-2 bg-emerald-400 rounded-full"></div>
                      <span className="text-gray-300 text-sm">{feature}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Payment Model */}
            <div className="mb-6">
              <h3 className="text-lg font-semibold text-white mb-3">Payment Model</h3>
              <div className={`p-4 rounded-xl bg-gradient-to-r ${getPaymentModelColor(subAgentData.unlockType)} text-white`}>
                <div className="flex items-center space-x-3">
                  <span className="text-2xl">{getPaymentModelIcon(subAgentData.unlockType)}</span>
                  <div>
                    <div className="font-semibold">{subAgentData.unlockType}</div>
                    <div className="text-sm opacity-90">
                      {subAgentData.unlockType === 'NFT' && `One-time purchase: ${subAgentData.cost} DMT`}
                      {subAgentData.unlockType === 'Subscription' && `Monthly subscription: ${subAgentData.cost} DMT`}
                      {subAgentData.unlockType === 'TokenUnlock' && `Hold ${subAgentData.cost} DMT to unlock`}
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Level Requirement */}
            <div className="mb-6">
              <h3 className="text-lg font-semibold text-white mb-3">Care Orchestrator Level Required</h3>
              <div className="bg-slate-700/50 rounded-xl p-4">
                <div className="flex items-center justify-between">
                  <span className="text-gray-300">Level:</span>
                  <span className="text-white font-semibold">{subAgentData.levelRequired}+</span>
                </div>
                <p className="text-gray-400 text-sm mt-2">
                  Requires Care Orchestrator Level {subAgentData.levelRequired} or higher
                </p>
              </div>
            </div>

            {/* XP Reward */}
            <div className="mb-6">
              <h3 className="text-lg font-semibold text-white mb-3">Rewards</h3>
              <div className="bg-emerald-500/10 border border-emerald-500/20 rounded-xl p-4">
                <div className="flex items-center space-x-3">
                  <span className="text-emerald-400 text-xl">🎁</span>
                  <div>
                    <div className="text-emerald-400 font-semibold">+20 XP Reward</div>
                    <div className="text-emerald-300 text-sm">Earn XP upon successful unlock</div>
                  </div>
                </div>
              </div>
            </div>

            {/* Error Message */}
            {unlockError && (
              <div className="mb-6">
                <div className="bg-red-500/20 border border-red-500/30 rounded-xl p-4">
                  <div className="flex items-center space-x-2">
                    <span className="text-red-400">❌</span>
                    <span className="text-red-400 font-semibold">Unlock Failed</span>
                  </div>
                  <p className="text-red-300 text-sm mt-1">{unlockError}</p>
                </div>
              </div>
            )}

            {/* Success Message */}
            {unlockSuccess && (
              <div className="mb-6">
                <div className="bg-green-500/20 border border-green-500/30 rounded-xl p-4">
                  <div className="flex items-center space-x-2">
                    <span className="text-green-400">✅</span>
                    <span className="text-green-400 font-semibold">Sub-Agent Unlocked!</span>
                  </div>
                  <p className="text-green-300 text-sm mt-1">You now have access to {subAgentData.name}</p>
                </div>
              </div>
            )}

            {/* Action Buttons */}
            {subAgentData.status === 'available' && !unlockSuccess && (
              <div className="flex space-x-3">
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={handleUnlock}
                  disabled={isUnlocking}
                  className={`flex-1 py-3 px-6 rounded-xl font-semibold transition-all duration-300 ${
                    !isUnlocking
                      ? `bg-gradient-to-r ${getPaymentModelColor(subAgentData.unlockType)} hover:shadow-lg text-white`
                      : 'bg-gray-500/20 text-gray-400 cursor-not-allowed'
                  }`}
                >
                  {isUnlocking ? (
                    <div className="flex items-center justify-center space-x-2">
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                      <span>Processing...</span>
                    </div>
                  ) : (
                    getUnlockButtonText()
                  )}
                </motion.button>
              </div>
            )}

            {/* Coming Soon */}
            {subAgentData.status === 'coming-soon' && (
              <div className="bg-yellow-500/20 border border-yellow-500/30 rounded-xl p-4">
                <div className="flex items-center space-x-2">
                  <span className="text-yellow-400">🚀</span>
                  <span className="text-yellow-400 font-semibold">Coming Soon</span>
                </div>
                <p className="text-yellow-300 text-sm mt-1">
                  This sub-agent is currently in development. Stay tuned for updates!
                </p>
              </div>
            )}

            {/* Close Button */}
            <div className="mt-6 flex justify-end">
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={onClose}
                className="px-6 py-2 bg-slate-700/50 hover:bg-slate-600/50 text-gray-300 hover:text-white rounded-lg transition-all duration-300"
              >
                {unlockSuccess ? 'Close' : 'Cancel'}
              </motion.button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default SubAgentModal;