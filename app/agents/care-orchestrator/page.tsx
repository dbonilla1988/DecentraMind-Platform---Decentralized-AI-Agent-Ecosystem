'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { getMasterAgentById, getAvailableSubAgents, SubAgentMetadata } from '../../data/agentMetadata';
import SubAgentCard from '../../components/agents/cards/SubAgentCard';
import SubAgentModal from '../../components/agents/modals/SubAgentModal';
import ColdPlungeSync from '../../components/agents/ColdPlungeSync';
import { useWalletBalance } from '../../hooks/useWalletBalance';
import { useSubAgentUnlocks } from '../../hooks/useSubAgentUnlocks';

const CareOrchestratorPage: React.FC = () => {
  const [selectedSubAgent, setSelectedSubAgent] = useState<SubAgentMetadata | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [showOnlyUnlocked, setShowOnlyUnlocked] = useState(false);
  const [showColdPlungeSync, setShowColdPlungeSync] = useState(false);
  
  const { balance } = useWalletBalance();
  const { isSubAgentUnlocked } = useSubAgentUnlocks('mock-user');
  
  const agentId = 'care-orchestrator';
  const masterAgent = getMasterAgentById(agentId);
  const subAgents = masterAgent?.subAgents || [];
  const availableSubAgents = getAvailableSubAgents(agentId);

  const openModal = (subAgent: SubAgentMetadata) => {
    setSelectedSubAgent(subAgent);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedSubAgent(null);
  };

  const filteredSubAgents = showOnlyUnlocked 
    ? subAgents.filter(subAgent => isSubAgentUnlocked(agentId, subAgent.id))
    : subAgents;

  const unlockedCount = subAgents.filter(subAgent => isSubAgentUnlocked(agentId, subAgent.id)).length;

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-emerald-900 to-slate-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="text-center mb-12">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex items-center justify-center space-x-4 mb-6"
          >
            <div className="text-6xl">❤️</div>
            <div>
              <h1 className="text-4xl sm:text-5xl font-bold bg-gradient-to-r from-emerald-400 to-green-400 bg-clip-text text-transparent">
                Care Orchestrator
              </h1>
              <p className="text-xl text-gray-300 mt-2">Health & Wellness Management</p>
            </div>
          </motion.div>
          
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-lg text-gray-400 max-w-3xl mx-auto"
          >
            Master agent specializing in health monitoring, wellness tracking, and care coordination. 
            Extend capabilities with specialized sub-agents for comprehensive health management.
          </motion.p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-slate-800/50 backdrop-blur-sm rounded-xl p-6 border border-slate-700/30">
            <div className="text-3xl font-bold text-emerald-400">{subAgents.length}</div>
            <div className="text-sm text-gray-400">Total Sub-Agents</div>
          </div>
          <div className="bg-slate-800/50 backdrop-blur-sm rounded-xl p-6 border border-slate-700/30">
            <div className="text-3xl font-bold text-green-400">{unlockedCount}</div>
            <div className="text-sm text-gray-400">Unlocked</div>
          </div>
          <div className="bg-slate-800/50 backdrop-blur-sm rounded-xl p-6 border border-slate-700/30">
            <div className="text-3xl font-bold text-blue-400">{availableSubAgents.length}</div>
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

        {/* Cold Plunge Sync Toggle */}
        <div className="flex justify-center mb-8">
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => setShowColdPlungeSync(!showColdPlungeSync)}
            className={`px-4 py-2 rounded-lg font-semibold transition-all duration-200 ${
              showColdPlungeSync
                ? 'bg-cyan-600 text-white hover:bg-cyan-700'
                : 'bg-blue-600 text-white hover:bg-blue-700'
            }`}
          >
            {showColdPlungeSync ? '❌ Close Cold Plunge Form' : '🧊 Log Cold Plunge Session'}
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
                subAgentData={subAgent}
                agentId={agentId}
                onClick={() => openModal(subAgent)}
              />
            </motion.div>
          ))}
        </div>

        {/* Cold Plunge Sync Form */}
        <AnimatePresence>
          {showColdPlungeSync && (
            <motion.div
              key="cold-plunge-form"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.3 }}
              className="mt-4"
            >
              <ColdPlungeSync agentId="care-orchestrator" />
            </motion.div>
          )}
        </AnimatePresence>

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
          <h3 className="text-2xl font-bold text-white mb-6 text-center">About Care Orchestrator</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div>
              <h4 className="text-lg font-semibold text-white mb-3">Core Capabilities</h4>
              <ul className="space-y-2">
                <li className="flex items-center space-x-2">
                  <span className="text-emerald-400">✓</span>
                  <span className="text-gray-300">Health Monitoring & Tracking</span>
                </li>
                <li className="flex items-center space-x-2">
                  <span className="text-emerald-400">✓</span>
                  <span className="text-gray-300">Wellness Program Management</span>
                </li>
                <li className="flex items-center space-x-2">
                  <span className="text-emerald-400">✓</span>
                  <span className="text-gray-300">Care Coordination</span>
                </li>
                <li className="flex items-center space-x-2">
                  <span className="text-emerald-400">✓</span>
                  <span className="text-gray-300">Medication Management</span>
                </li>
              </ul>
            </div>
            <div>
              <h4 className="text-lg font-semibold text-white mb-3">Sub-Agent Ecosystem</h4>
              <p className="text-gray-300 text-sm mb-3">
                Extend your Care Orchestrator's capabilities with specialized sub-agents for health tasks:
              </p>
              <div className="grid grid-cols-2 gap-2 text-sm">
                <div className="text-gray-400">• Breathwork Tracker</div>
                <div className="text-gray-400">• Cold Plunge Coach</div>
                <div className="text-gray-400">• Vitals Monitor</div>
                <div className="text-gray-400">• Appointment Scheduler</div>
                <div className="text-gray-400">• Billing Agent</div>
                <div className="text-gray-400">• Medication Manager</div>
              </div>
            </div>
          </div>
        </motion.div>
      </div>

      {/* Modal */}
      <SubAgentModal
        subAgentData={selectedSubAgent}
        agentId={agentId}
        isOpen={isModalOpen}
        onClose={closeModal}
      />
    </div>
  );
};

export default CareOrchestratorPage;