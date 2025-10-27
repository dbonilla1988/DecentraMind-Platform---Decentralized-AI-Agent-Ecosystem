'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useWalletBalance } from '../../../hooks/useWalletBalance';
import { useXPLogging } from '../../../hooks/useXPLogging';
import { useAgentUnlocks } from '../../../hooks/useAgentUnlocks';
import { useContractStatus } from '../../../hooks/useContractStatus';
import { AgentMetadata } from '../../../data/agentMetadata';
import { agentPreviews } from '../../../data/agentPreviews';
import { calculateXPForUnlock } from '../../../data/xpHistory';

interface AgentModalProps {
  agentData: AgentMetadata;
  isOpen: boolean;
  onClose: () => void;
}

const AgentModal: React.FC<AgentModalProps> = ({
  agentData,
  isOpen,
  onClose
}) => {
  const { balance, isAgentUnlocked } = useWalletBalance();
  const { logAgentUnlock } = useXPLogging();
  const { unlockAgent, logXP } = useAgentUnlocks('mock-wallet-address');
  const { contractStatus, executeUnlock, isProcessing } = useContractStatus(agentData.id, 'mock-wallet-address');
  
  const [isPreviewLoading, setIsPreviewLoading] = useState(false);
  const [showPreview, setShowPreview] = useState(false);
  
  // Mock user level - in production, get from user profile
  const [userLevel] = useState(2);
  const unlocked = isAgentUnlocked(agentData);

  // AI Preview function
  const handlePreviewAgent = async () => {
    setIsPreviewLoading(true);
    try {
      // Simulate AI preview generation
      await new Promise(resolve => setTimeout(resolve, 1000));
      setShowPreview(true);
    } catch (error) {
      console.error('Error generating preview:', error);
      setShowPreview(true);
    } finally {
      setIsPreviewLoading(false);
    }
  };

  // Get AI preview data
  const previewData = agentPreviews[agentData.id];

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

  const handleUnlock = async () => {
    try {
      // Check DAO access first
      if (userLevel < agentData.levelRequired) {
        alert(`Level ${agentData.levelRequired}+ required — upgrade your Care Orchestrator level.`);
        return;
      }

      // Execute contract-based unlock
      const result = await executeUnlock();
      
      if (result.success) {
        // Unlock agent in persistence layer
        const success = await unlockAgent(agentData.id, agentData.unlockType as any);
        
        if (success) {
          // Log XP reward
          const xpAmount = calculateXPForUnlock(agentData.cost);
          await logXP(agentData.id, xpAmount, `Unlocked ${agentData.name}`);
          
          // Also log to legacy system for compatibility
          logAgentUnlock(agentData.id, agentData.name, 'sub');
          
          onClose();
        } else {
          alert('Failed to unlock agent. Please try again.');
        }
      } else {
        alert(result.error || 'Failed to unlock agent. Please try again.');
      }
    } catch (error) {
      console.error('Error unlocking agent:', error);
      alert('An error occurred while unlocking the agent.');
    }
  };

  const canAfford = () => {
    return balance.dmt >= agentData.cost;
  };

  const getUnlockButtonText = () => {
    switch (agentData.unlockType) {
      case 'NFT':
        return `Mint NFT (${agentData.cost} DMT)`;
      case 'Subscription':
        return `Subscribe (${agentData.cost} DMT/mo)`;
      case 'TokenUnlock':
        return `Unlock Agent (${agentData.cost} DMT)`;
      default:
        return 'Unlock';
    }
  };

  const getXPReward = () => {
    return calculateXPForUnlock(agentData.cost);
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
                <div className="text-5xl">{agentData.icon}</div>
                <div>
                  <h2 className="text-2xl font-bold text-white">{agentData.name}</h2>
                  <p className="text-gray-400">{agentData.category}</p>
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
              <p className="text-gray-300">{agentData.description}</p>
            </div>

            {/* Features */}
            <div className="mb-6">
              <h3 className="text-lg font-semibold text-white mb-3">Capabilities</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                {agentData.features.map((feature, index) => (
                  <div key={index} className="flex items-center space-x-2">
                    <div className="w-2 h-2 bg-emerald-400 rounded-full"></div>
                    <span className="text-gray-300 text-sm">{feature}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* XP Requirements */}
            <div className="mb-6">
              <h3 className="text-lg font-semibold text-white mb-3">Requirements</h3>
              <div className="bg-blue-500/10 border border-blue-500/20 rounded-xl p-4">
                <div className="flex items-center space-x-3">
                  <span className="text-blue-400 text-xl">⭐</span>
                  <div>
                    <div className="text-blue-400 font-semibold">Level {agentData.levelRequired}+ Care Orchestrator</div>
                    <div className="text-blue-300 text-sm">
                      {agentData.levelRequired === 1 && 'Basic capabilities'}
                      {agentData.levelRequired === 2 && 'Intermediate capabilities'}
                      {agentData.levelRequired === 3 && 'Advanced capabilities'}
                      {agentData.levelRequired > 3 && 'Expert-level capabilities'}
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Payment Model */}
            <div className="mb-6">
              <h3 className="text-lg font-semibold text-white mb-3">Payment Model</h3>
              <div className={`p-4 rounded-xl bg-gradient-to-r ${getPaymentModelColor(agentData.unlockType)} text-white`}>
                <div className="flex items-center space-x-3">
                  <span className="text-2xl">{getPaymentModelIcon(agentData.unlockType)}</span>
                  <div>
                    <div className="font-semibold">{agentData.unlockType}</div>
                    <div className="text-sm opacity-90">
                      {agentData.unlockType === 'Subscription' 
                        ? `Monthly subscription: ${agentData.cost} DMT`
                        : agentData.unlockType === 'NFT'
                        ? `One-time purchase: ${agentData.cost} DMT`
                        : `Hold ${agentData.cost} DMT to unlock`
                      }
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* XP Reward Info */}
            <div className="mb-6">
              <h3 className="text-lg font-semibold text-white mb-3">Rewards</h3>
              <div className="bg-emerald-500/10 border border-emerald-500/20 rounded-xl p-4">
                <div className="flex items-center space-x-3">
                  <span className="text-emerald-400 text-xl">🎁</span>
                  <div>
                    <div className="text-emerald-400 font-semibold">+{getXPReward()} XP Reward</div>
                    <div className="text-emerald-300 text-sm">Earn XP upon successful unlock</div>
                  </div>
                </div>
              </div>
            </div>

            {/* AI Preview Section */}
            <div className="mb-6">
              <h3 className="text-lg font-semibold text-white mb-3">Try Agent Preview</h3>
              <div className="bg-slate-700/50 rounded-xl p-4">
                <p className="text-gray-300 text-sm mb-4">
                  Get a preview of how this agent would interact with you
                </p>
                
                {!showPreview ? (
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={handlePreviewAgent}
                    disabled={isPreviewLoading}
                    className={`w-full py-3 px-6 rounded-lg font-semibold transition-all duration-300 ${
                      isPreviewLoading
                        ? 'bg-gray-500/20 text-gray-400 cursor-not-allowed'
                        : 'bg-gradient-to-r from-purple-500 to-pink-500 hover:shadow-lg text-white'
                    }`}
                  >
                    {isPreviewLoading ? (
                      <div className="flex items-center justify-center space-x-2">
                        <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                        <span>Generating Preview...</span>
                      </div>
                    ) : (
                      '🤖 Try Agent Preview'
                    )}
                  </motion.button>
                ) : (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="bg-slate-800/50 rounded-lg p-4 border border-slate-600/30"
                  >
                    <div className="flex items-start space-x-3">
                      <div className="text-2xl">{agentData.icon}</div>
                      <div className="flex-1">
                        <div className="text-white font-medium mb-2">{agentData.name} says:</div>
                        {previewData ? (
                          <>
                            <div className="text-gray-300 text-sm leading-relaxed mb-3">
                              {previewData.message}
                            </div>
                            <blockquote className="text-emerald-300 text-sm italic border-l-2 border-emerald-500/30 pl-3">
                              "{previewData.example}"
                            </blockquote>
                          </>
                        ) : (
                          <div className="text-gray-400 text-sm">Preview not available for this agent.</div>
                        )}
                      </div>
                    </div>
                    <button
                      onClick={() => setShowPreview(false)}
                      className="mt-3 text-xs text-gray-400 hover:text-white transition-colors"
                    >
                      Generate New Preview
                    </button>
                  </motion.div>
                )}
              </div>
            </div>

            {/* DAO Access Warning */}
            {userLevel < agentData.levelRequired && (
              <div className="mb-6">
                <div className="bg-red-500/20 border border-red-500/30 rounded-xl p-4">
                  <div className="flex items-center space-x-2">
                    <span className="text-red-400">🔒</span>
                    <span className="text-red-400 font-semibold">Level Required</span>
                  </div>
                  <p className="text-red-300 text-sm mt-1">
                    Level {agentData.levelRequired}+ required — upgrade your Care Orchestrator level.
                  </p>
                </div>
              </div>
            )}

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
            {!unlocked && agentData.status === 'available' && userLevel >= agentData.levelRequired && (
              <div className="flex space-x-3">
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={handleUnlock}
                  disabled={!canAfford() || isProcessing}
                  className={`flex-1 py-3 px-6 rounded-xl font-semibold transition-all duration-300 ${
                    canAfford() && !isProcessing
                      ? `bg-gradient-to-r ${getPaymentModelColor(agentData.unlockType)} hover:shadow-lg text-white`
                      : 'bg-gray-500/20 text-gray-400 cursor-not-allowed'
                  }`}
                >
                  {isProcessing ? (
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
            {agentData.status === 'coming-soon' && (
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

export default AgentModal;
