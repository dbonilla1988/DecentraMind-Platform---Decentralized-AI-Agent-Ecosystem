'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { getMasterAgentById, getAvailableSubAgents, masterAgentData, SubAgentMetadata } from '../../data/agentMetadata';
import SubAgentCard from '../../components/agents/cards/SubAgentCard';
import SubAgentModal from '../../components/agents/modals/SubAgentModal';
import { useWalletBalance } from '../../hooks/useWalletBalance';
import { useSubAgentUnlocks } from '../../hooks/useSubAgentUnlocks';
import ZoneLayout from '../../components/layout/ZoneLayout';

const SubAgentsPage: React.FC = () => {
  const [selectedSubAgent, setSelectedSubAgent] = useState<SubAgentMetadata | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [showOnlyUnlocked, setShowOnlyUnlocked] = useState(false);
  const [selectedMasterAgent, setSelectedMasterAgent] = useState<string>('care-orchestrator');
  
  const { balance } = useWalletBalance();
  const { isSubAgentUnlocked } = useSubAgentUnlocks('mock-user');
  
  const masterAgent = getMasterAgentById(selectedMasterAgent);
  const subAgents = masterAgent?.subAgents || [];
  const availableSubAgents = getAvailableSubAgents(selectedMasterAgent);

  const openModal = (subAgent: SubAgentMetadata) => {
    setSelectedSubAgent(subAgent);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedSubAgent(null);
  };

  const filteredSubAgents = showOnlyUnlocked 
    ? subAgents.filter(subAgent => isSubAgentUnlocked(selectedMasterAgent, subAgent.id))
    : subAgents;

  const unlockedCount = subAgents.filter(subAgent => isSubAgentUnlocked(selectedMasterAgent, subAgent.id)).length;

  // Get all master agents dynamically
  const masterAgents = masterAgentData.map(agent => ({
    id: agent.id,
    name: agent.name,
    icon: agent.icon,
    description: agent.description,
    category: agent.category,
    level: agent.level,
    xp: agent.xp,
    color: getAgentColor(agent.category)
  }));

  // Helper function to get color based on category
  function getAgentColor(category: string): string {
    switch (category) {
      case 'Wellness': return 'emerald';
      case 'Finance': return 'blue';
      case 'Research': return 'purple';
      case 'Crypto': return 'yellow';
      default: return 'gray';
    }
  }

  return (
    <ZoneLayout zone="agents">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="text-center mb-12">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex items-center justify-center space-x-4 mb-6"
          >
            <div className="text-6xl">🔧</div>
            <div>
              <h1 className="text-4xl sm:text-5xl font-bold bg-gradient-to-r from-purple-400 to-blue-400 bg-clip-text text-transparent">
                Sub-Agents
              </h1>
              <p className="text-xl text-gray-300 mt-2">Specialized AI Agents for Enhanced Capabilities</p>
            </div>
          </motion.div>
          
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-lg text-gray-400 max-w-3xl mx-auto"
          >
            Unlock specialized sub-agents to extend your master agents' capabilities. 
            Each sub-agent offers unique features and can be unlocked through different payment models.
          </motion.p>
        </div>

        {/* Master Agent Selection */}
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-white mb-4">Select Master Agent</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {masterAgents.map((agent) => (
              <motion.button
                key={agent.id}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => setSelectedMasterAgent(agent.id)}
                className={`p-6 rounded-xl border transition-all duration-300 ${
                  selectedMasterAgent === agent.id
                    ? `bg-gradient-to-r from-${agent.color}-500/20 to-${agent.color}-600/20 border-${agent.color}-500/50 ring-2 ring-${agent.color}-500/20`
                    : 'bg-slate-800/50 border-slate-700/30 hover:border-slate-600/50'
                }`}
              >
                <div className="text-center">
                  <div className="text-4xl mb-3">{agent.icon}</div>
                  <h3 className="text-lg font-semibold text-white mb-2">{agent.name}</h3>
                  <p className="text-gray-400 text-sm mb-3">{agent.description}</p>
                  <div className="flex justify-center space-x-4 text-xs text-gray-500">
                    <span>Level {agent.level}</span>
                    <span>{agent.xp} XP</span>
                  </div>
                  <div className="mt-2 text-xs text-gray-400">
                    {agent.category}
                  </div>
                </div>
              </motion.button>
            ))}
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-slate-800/50 backdrop-blur-sm rounded-xl p-6 border border-slate-700/30">
            <div className="text-3xl font-bold text-purple-400">{subAgents.length}</div>
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
                ? 'bg-gradient-to-r from-green-500 to-emerald-500 text-white'
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
                subAgentData={subAgent}
                agentId={selectedMasterAgent}
                onClick={() => openModal(subAgent)}
                masterAgent={masterAgent}
              />
            </motion.div>
          ))}
        </div>

        {/* Empty State */}
        {filteredSubAgents.length === 0 && (
          <div className="text-center py-12">
            <div className="text-6xl mb-4">🔒</div>
            <h3 className="text-xl font-semibold text-white mb-2">No Sub-Agents Found</h3>
            <p className="text-gray-400">
              {showOnlyUnlocked 
                ? "You haven't unlocked any sub-agents yet. Explore the available agents above!"
                : "No sub-agents match your current filter criteria."
              }
            </p>
          </div>
        )}

        {/* Quick Links */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="mt-16 bg-slate-800/30 backdrop-blur-sm rounded-2xl p-8 border border-slate-700/50"
        >
          <h3 className="text-2xl font-bold text-white mb-6 text-center">Quick Links</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {masterAgents.slice(0, 4).map((agent) => (
              <motion.a
                key={agent.id}
                href={`/agents/${agent.id}`}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className={`p-6 bg-gradient-to-r from-${agent.color}-500/20 to-${agent.color}-600/20 border border-${agent.color}-500/30 rounded-xl text-center hover:shadow-lg hover:shadow-${agent.color}-500/10 transition-all duration-300`}
              >
                <div className="text-3xl mb-3">{agent.icon}</div>
                <h4 className="text-lg font-semibold text-white mb-2">{agent.name}</h4>
                <p className="text-gray-400 text-sm">{agent.description}</p>
              </motion.a>
            ))}
            
            <motion.a
              href="/agents"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="p-6 bg-gradient-to-r from-purple-500/20 to-blue-500/20 border border-purple-500/30 rounded-xl text-center hover:shadow-lg hover:shadow-purple-500/10 transition-all duration-300"
            >
              <div className="text-3xl mb-3">🤖</div>
              <h4 className="text-lg font-semibold text-white mb-2">All Agents</h4>
              <p className="text-gray-400 text-sm">Master Agent Marketplace</p>
            </motion.a>
            
            <motion.a
              href="/marketplace"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="p-6 bg-gradient-to-r from-yellow-500/20 to-orange-500/20 border border-yellow-500/30 rounded-xl text-center hover:shadow-lg hover:shadow-yellow-500/10 transition-all duration-300"
            >
              <div className="text-3xl mb-3">🛒</div>
              <h4 className="text-lg font-semibold text-white mb-2">Marketplace</h4>
              <p className="text-gray-400 text-sm">NFT Trading & Resale</p>
            </motion.a>
          </div>
        </motion.div>
      </div>

      {/* Modal */}
      <SubAgentModal
        subAgentData={selectedSubAgent}
        agentId={selectedMasterAgent}
        isOpen={isModalOpen}
        onClose={closeModal}
      />
    </ZoneLayout>
  );
};

export default SubAgentsPage;