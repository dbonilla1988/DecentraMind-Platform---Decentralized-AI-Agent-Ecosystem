'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { SubAgentModalProps, getPaymentModelDisplay, getPaymentModelColor } from '../utils/subAgentTypes';

const SubAgentModal: React.FC<SubAgentModalProps> = ({
  subAgent,
  isOpen,
  onClose,
  onMint,
  onSubscribe,
  onUnlock,
  userTokens = 0
}) => {
  const [isProcessing, setIsProcessing] = useState(false);

  if (!subAgent) return null;

  const { model, price, subscriptionMonthly, tokenRequirement, features = [] } = subAgent;
  const modelColor = getPaymentModelColor(model);
  const modelDisplay = getPaymentModelDisplay(model);

  const getPriceDisplay = () => {
    switch (model) {
      case 'NFT':
        return `${price} DMT`;
      case 'Subscription':
        return `${subscriptionMonthly} DMT/month`;
      case 'TokenUnlock':
        return `${tokenRequirement} DMT required`;
      default:
        return 'N/A';
    }
  };

  const getButtonText = () => {
    switch (model) {
      case 'NFT':
        return 'Mint NFT';
      case 'Subscription':
        return 'Start Subscription';
      case 'TokenUnlock':
        return 'Unlock Agent';
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
        return true;
      case 'TokenUnlock':
        return userTokens >= (tokenRequirement || 0);
      default:
        return false;
    }
  };

  const handleAction = async () => {
    setIsProcessing(true);
    try {
      const action = getButtonAction();
      if (action) {
        await action(subAgent);
      }
    } catch (error) {
      console.error('Action failed:', error);
    } finally {
      setIsProcessing(false);
      onClose();
    }
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

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm"
          onClick={onClose}
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            className="relative w-full max-w-2xl bg-slate-800 rounded-2xl border border-slate-700 overflow-hidden"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div className="relative p-6 border-b border-slate-700">
              <button
                onClick={onClose}
                className="absolute top-4 right-4 p-2 text-gray-400 hover:text-white hover:bg-slate-700 rounded-lg transition-colors"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>

              <div className="flex items-center space-x-4">
                <div className="text-5xl">{subAgent.icon}</div>
                <div>
                  <h2 className="text-2xl font-bold text-white mb-1">{subAgent.name}</h2>
                  <p className="text-gray-400">{subAgent.category}</p>
                </div>
              </div>
            </div>

            {/* Content */}
            <div className="p-6 space-y-6">
              {/* Description */}
              <div>
                <h3 className="text-lg font-semibold text-white mb-2">Description</h3>
                <p className="text-gray-300 leading-relaxed">{subAgent.description}</p>
              </div>

              {/* Features */}
              {features.length > 0 && (
                <div>
                  <h3 className="text-lg font-semibold text-white mb-3">Features</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    {features.map((feature, index) => (
                      <div key={index} className="flex items-center space-x-3 p-3 bg-slate-700/30 rounded-lg">
                        <div className="w-2 h-2 bg-purple-400 rounded-full"></div>
                        <span className="text-gray-300 text-sm">{feature}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Payment Details */}
              <div className="bg-slate-700/30 rounded-xl p-4">
                <h3 className="text-lg font-semibold text-white mb-3">Payment Details</h3>
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-gray-400">Model:</span>
                    <span className={`px-3 py-1 rounded-full text-sm font-medium bg-${modelColor}-500/20 text-${modelColor}-400 border border-${modelColor}-500/30`}>
                      {modelDisplay}
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-400">Price:</span>
                    <span className="text-xl font-bold text-white">{getPriceDisplay()}</span>
                  </div>
                  {model === 'TokenUnlock' && (
                    <div className="flex justify-between items-center">
                      <span className="text-gray-400">Your DMT:</span>
                      <span className={`font-medium ${canAfford() ? 'text-emerald-400' : 'text-red-400'}`}>
                        {userTokens.toLocaleString()} DMT
                      </span>
                    </div>
                  )}
                </div>
              </div>

              {/* Terms and Conditions */}
              <div className="text-sm text-gray-400 space-y-2">
                <p>
                  {model === 'NFT' && 'By minting this NFT, you agree to the terms of service and will receive exclusive access to this sub-agent.'}
                  {model === 'Subscription' && 'Subscription will automatically renew monthly. You can cancel anytime from your account settings.'}
                  {model === 'TokenUnlock' && 'This agent will be unlocked permanently once you meet the token requirement. No additional fees apply.'}
                </p>
                <p className="text-xs">
                  All transactions are processed on-chain and are irreversible. Please ensure you have sufficient funds before proceeding.
                </p>
              </div>
            </div>

            {/* Footer */}
            <div className="p-6 border-t border-slate-700 flex space-x-4">
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={onClose}
                className="flex-1 py-3 px-6 border-2 border-slate-600 hover:border-slate-500 rounded-xl font-semibold text-gray-300 hover:text-white transition-all duration-300"
              >
                Cancel
              </motion.button>
              <motion.button
                whileHover={{ scale: isProcessing || !canAfford() ? 1 : 1.02 }}
                whileTap={{ scale: isProcessing || !canAfford() ? 1 : 0.98 }}
                onClick={handleAction}
                disabled={isProcessing || !canAfford() || subAgent.status === 'ComingSoon'}
                className={`flex-1 py-3 px-6 rounded-xl font-semibold transition-all duration-300 ${
                  isProcessing || !canAfford() || subAgent.status === 'ComingSoon'
                    ? 'bg-gray-600 text-gray-400 cursor-not-allowed'
                    : `bg-gradient-to-r ${getColorClasses(modelColor)} text-white`
                }`}
              >
                {isProcessing ? 'Processing...' : getButtonText()}
              </motion.button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default SubAgentModal;

















