'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { cfoConfig } from '../../../src/modules/subAgents/AutonomousCFO/config';
import SubAgentCard from '../../components/agents/SubAgentCard';
import SubAgentModal from '../../components/agents/SubAgentModal';
import { useWalletBalance } from '../../hooks/useWalletBalance';
import { SubAgent } from '../../../src/modules/subAgents/utils/subAgentTypes';

const AutonomousCFOPage: React.FC = () => {
  const [selectedSubAgent, setSelectedSubAgent] = useState<SubAgent | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [showOnlyUnlocked, setShowOnlyUnlocked] = useState(false);
  const { balance, isAgentUnlocked } = useWalletBalance();

  const handleMint = (subAgent: SubAgent) => {
    console.log('Minting NFT for:', subAgent.name);
    // TODO: Implement NFT minting logic
  };

  const handleSubscribe = (subAgent: SubAgent) => {
    console.log('Starting subscription for:', subAgent.name);
    // TODO: Implement subscription logic
  };

  const handleUnlock = (subAgent: SubAgent) => {
    console.log('Unlocking agent:', subAgent.name);
    // TODO: Implement token unlock logic
  };

  const openModal = (subAgent: SubAgent) => {
    setSelectedSubAgent(subAgent);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedSubAgent(null);
  };

  const filteredSubAgents = showOnlyUnlocked 
    ? cfoConfig.subAgents.filter(subAgent => isAgentUnlocked(subAgent))
    : cfoConfig.subAgents;

  const unlockedCount = cfoConfig.subAgents.filter(subAgent => isAgentUnlocked(subAgent)).length;

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="text-center mb-12">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex items-center justify-center space-x-4 mb-6"
          >
            <div className="text-6xl">🧠</div>
            <div>
              <h1 className="text-4xl sm:text-5xl font-bold bg-gradient-to-r from-purple-400 to-blue-400 bg-clip-text text-transparent">
                Autonomous CFO
              </h1>
              <p className="text-xl text-gray-300 mt-2">Financial Intelligence & Treasury Management</p>
            </div>
          </motion.div>
          
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-lg text-gray-400 max-w-3xl mx-auto"
          >
            Master agent specializing in financial intelligence, portfolio optimization, and treasury management. 
            Extend capabilities with specialized sub-agents for comprehensive financial control.
          </motion.p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-slate-800/50 backdrop-blur-sm rounded-xl p-6 border border-slate-700/30">
            <div className="text-3xl font-bold text-purple-400">{cfoConfig.subAgents.length}</div>
            <div className="text-sm text-gray-400">Total Sub-Agents</div>
          </div>
          <div className="bg-slate-800/50 backdrop-blur-sm rounded-xl p-6 border border-slate-700/30">
            <div className="text-3xl font-bold text-emerald-400">{unlockedCount}</div>
            <div className="text-sm text-gray-400">Unlocked</div>
          </div>
          <div className="bg-slate-800/50 backdrop-blur-sm rounded-xl p-6 border border-slate-700/30">
            <div className="text-3xl font-bold text-blue-400">
              {cfoConfig.subAgents.filter(sa => sa.status === 'Available').length}
            </div>
            <div className="text-sm text-gray-400">Available</div>
          </div>
          <div className="bg-slate-800/50 backdrop-blur-sm rounded-xl p-6 border border-slate-700/30">
            <div className="text-3xl font-bold text-yellow-400">{balance.dmt.toLocaleString()}</div>
            <div className="text-sm text-gray-400">Your DMT</div>
          </div>
        </div>

        {/* Filter Toggle */}
        <div className="flex justify-center mb-8">
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => setShowOnlyUnlocked(!showOnlyUnlocked)}
            className={`px-6 py-3 rounded-xl font-semibold transition-all duration-300 ${
              showOnlyUnlocked
                ? 'bg-gradient-to-r from-emerald-500 to-green-500 text-white'
                : 'bg-slate-700/50 text-gray-300 hover:bg-slate-600/50'
            }`}
          >
            {showOnlyUnlocked ? 'Show All Agents' : 'Show Only Unlocked Agents'}
          </motion.button>
        </div>

        {/* Sub-Agents Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredSubAgents.map((subAgent, index) => (
            <motion.div
              key={subAgent.id}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <SubAgentCard
                subAgent={subAgent}
                onMint={handleMint}
                onSubscribe={handleSubscribe}
                onUnlock={handleUnlock}
                onClick={() => openModal(subAgent)}
              />
            </motion.div>
          ))}
        </div>

        {/* Empty State */}
        {filteredSubAgents.length === 0 && (
          <div className="text-center py-12">
            <div className="text-6xl mb-4">🔒</div>
            <h3 className="text-xl font-semibold text-white mb-2">No Agents Found</h3>
            <p className="text-gray-400">
              {showOnlyUnlocked 
                ? "You haven't unlocked any sub-agents yet. Explore the available agents above!"
                : "No agents match your current filter criteria."
              }
            </p>
          </div>
        )}

        {/* Master Agent Info */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="mt-16 bg-slate-800/30 backdrop-blur-sm rounded-2xl p-8 border border-slate-700/50"
        >
          <h3 className="text-2xl font-bold text-white mb-6 text-center">About Autonomous CFO</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div>
              <h4 className="text-lg font-semibold text-white mb-3">Core Capabilities</h4>
              <ul className="space-y-2">
                <li className="flex items-center space-x-2">
                  <span className="text-emerald-400">✓</span>
                  <span className="text-gray-300">Portfolio Analysis & Optimization</span>
                </li>
                <li className="flex items-center space-x-2">
                  <span className="text-emerald-400">✓</span>
                  <span className="text-gray-300">Risk Assessment & Management</span>
                </li>
                <li className="flex items-center space-x-2">
                  <span className="text-emerald-400">✓</span>
                  <span className="text-gray-300">DeFi Strategy Development</span>
                </li>
                <li className="flex items-center space-x-2">
                  <span className="text-emerald-400">✓</span>
                  <span className="text-gray-300">Treasury Management</span>
                </li>
              </ul>
            </div>
            <div>
              <h4 className="text-lg font-semibold text-white mb-3">Sub-Agent Ecosystem</h4>
              <p className="text-gray-300 text-sm mb-3">
                Extend your CFO's capabilities with specialized sub-agents for specific financial tasks:
              </p>
              <div className="grid grid-cols-2 gap-2 text-sm">
                <div className="text-gray-400">• Portfolio Optimizer</div>
                <div className="text-gray-400">• Tax Helper</div>
                <div className="text-gray-400">• Yield Farmer</div>
                <div className="text-gray-400">• Gas Fee Predictor</div>
                <div className="text-gray-400">• DeFi Scanner</div>
                <div className="text-gray-400">• Treasury Manager</div>
              </div>
            </div>
          </div>
        </motion.div>
      </div>

      {/* Modal */}
      <SubAgentModal
        subAgent={selectedSubAgent}
        isOpen={isModalOpen}
        onClose={closeModal}
        onMint={handleMint}
        onSubscribe={handleSubscribe}
        onUnlock={handleUnlock}
      />
    </div>
  );
};

export default AutonomousCFOPage;


