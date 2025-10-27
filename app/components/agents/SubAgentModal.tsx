'use client';

import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { SubAgent } from '../../../src/modules/subAgents/utils/subAgentTypes';
import { useWalletBalance } from '../../hooks/useWalletBalance';
import { useXPLogging } from '../../hooks/useXPLogging';

interface SubAgentModalProps {
  subAgent: SubAgent | null;
  isOpen: boolean;
  onClose: () => void;
  onMint?: (subAgent: SubAgent) => void;
  onSubscribe?: (subAgent: SubAgent) => void;
  onUnlock?: (subAgent: SubAgent) => void;
}

const SubAgentModal: React.FC<SubAgentModalProps> = ({
  subAgent,
  isOpen,
  onClose,
  onMint,
  onSubscribe,
  onUnlock
}) => {
  const { balance, checkUnlockStatus, isAgentUnlocked, unlockAgent } = useWalletBalance();
  const { logAgentUnlock } = useXPLogging();

  if (!subAgent) return null;

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

  const handleUnlock = (method: 'nft' | 'subscription' | 'token') => {
    const success = unlockAgent(subAgent, method);
    if (success) {
      // Log XP reward for unlocking agent
      logAgentUnlock(subAgent.id, subAgent.name, 'sub');
      
      switch (method) {
        case 'nft':
          onMint?.(subAgent);
          break;
        case 'subscription':
          onSubscribe?.(subAgent);
          break;
        case 'token':
          onUnlock?.(subAgent);
          break;
      }
      onClose();
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
                <div className="text-5xl">{subAgent.icon}</div>
                <div>
                  <h2 className="text-2xl font-bold text-white">{subAgent.name}</h2>
                  <p className="text-gray-400">{subAgent.category}</p>
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
              <p className="text-gray-300">{subAgent.description}</p>
            </div>

            {/* Features */}
            {subAgent.features && (
              <div className="mb-6">
                <h3 className="text-lg font-semibold text-white mb-3">Capabilities</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                  {subAgent.features.map((feature, index) => (
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
              <div className={`p-4 rounded-xl bg-gradient-to-r ${getPaymentModelColor(subAgent.model)} text-white`}>
                <div className="flex items-center space-x-3">
                  <span className="text-2xl">{getPaymentModelIcon(subAgent.model)}</span>
                  <div>
                    <div className="font-semibold">{subAgent.model}</div>
                    <div className="text-sm opacity-90">
                      {subAgent.model === 'NFT' && `One-time purchase: ${subAgent.price} DMT`}
                      {subAgent.model === 'Subscription' && `Monthly subscription: ${subAgent.subscriptionMonthly} DMT`}
                      {subAgent.model === 'TokenUnlock' && `Hold ${subAgent.tokenRequirement} DMT to unlock`}
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Wallet Balance */}
            <div className="mb-6">
              <h3 className="text-lg font-semibold text-white mb-3">Your Balance</h3>
              <div className="bg-slate-700/50 rounded-xl p-4">
                <div className="flex items-center justify-between">
                  <span className="text-gray-300">DMT Balance:</span>
                  <span className="text-white font-semibold">{balance.dmt.toLocaleString()} DMT</span>
                </div>
                {!canAfford() && !unlocked && (
                  <div className="mt-2 text-sm text-red-400">
                    Insufficient balance for this agent
                  </div>
                )}
              </div>
            </div>

            {/* Unlock Status */}
            {unlocked && (
              <div className="mb-6">
                <div className="bg-emerald-500/20 border border-emerald-500/30 rounded-xl p-4">
                  <div className="flex items-center space-x-2">
                    <span className="text-emerald-400">✅</span>
                    <span className="text-emerald-400 font-semibold">Agent Unlocked</span>
                  </div>
                  <p className="text-emerald-300 text-sm mt-1">
                    You have access to this agent's capabilities
                  </p>
                </div>
              </div>
            )}

            {/* Action Buttons */}
            {!unlocked && subAgent.status === 'Available' && (
              <div className="flex space-x-3">
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => handleUnlock(subAgent.model.toLowerCase() as any)}
                  disabled={!canAfford()}
                  className={`flex-1 py-3 px-6 rounded-xl font-semibold transition-all duration-300 ${
                    canAfford()
                      ? `bg-gradient-to-r ${getPaymentModelColor(subAgent.model)} hover:shadow-lg text-white`
                      : 'bg-gray-500/20 text-gray-400 cursor-not-allowed'
                  }`}
                >
                  {subAgent.model === 'NFT' && `Mint NFT (${subAgent.price} DMT)`}
                  {subAgent.model === 'Subscription' && `Subscribe (${subAgent.subscriptionMonthly} DMT/mo)`}
                  {subAgent.model === 'TokenUnlock' && `Unlock (${subAgent.tokenRequirement} DMT)`}
                </motion.button>
              </div>
            )}

            {/* Coming Soon */}
            {subAgent.status === 'ComingSoon' && (
              <div className="bg-yellow-500/20 border border-yellow-500/30 rounded-xl p-4">
                <div className="flex items-center space-x-2">
                  <span className="text-yellow-400">🚀</span>
                  <span className="text-yellow-400 font-semibold">Coming Soon</span>
                </div>
                <p className="text-yellow-300 text-sm mt-1">
                  This agent is currently in development. Stay tuned for updates!
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
                {unlocked ? 'Close' : 'Cancel'}
              </motion.button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default SubAgentModal;
