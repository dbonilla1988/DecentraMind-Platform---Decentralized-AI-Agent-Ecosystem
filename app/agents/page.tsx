'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { careAgents, getAgentById } from '../utils/careAgentData';

const AgentsPage = () => {
  const [activeTab, setActiveTab] = useState('all');
  const [selectedAgent, setSelectedAgent] = useState<string | null>('finance-agent');

  const tabs = [
    { id: 'all', name: 'All Agents', icon: '🤖', color: 'blue' },
    { id: 'active', name: 'Active', icon: '✅', color: 'green' },
    { id: 'beta', name: 'Beta', icon: '🧪', color: 'yellow' },
    { id: 'custom', name: 'Custom', icon: '🎨', color: 'purple' }
  ];

  const filteredAgents = careAgents.filter(agent => {
    switch (activeTab) {
      case 'active':
        return agent.status === 'active';
      case 'beta':
        return agent.status === 'beta';
      case 'custom':
        return agent.type === 'custom';
      default:
        return true;
    }
  });

  const renderAgentCard = (agent: typeof careAgents[0]) => (
    <motion.div
      key={agent.id}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ scale: 1.02 }}
      onClick={() => setSelectedAgent(agent.id)}
      className={`cursor-pointer bg-slate-800/50 backdrop-blur-sm rounded-xl p-6 border transition-all duration-300 ${
        selectedAgent === agent.id
          ? 'border-purple-500/50 bg-purple-500/10'
          : 'border-slate-700/30 hover:border-slate-600/50'
      }`}
    >
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center space-x-3">
          <div className="text-3xl">{agent.avatar}</div>
          <div>
            <h3 className="text-lg font-semibold text-white">{agent.name}</h3>
            <p className="text-gray-400 text-sm">{agent.type}</p>
          </div>
        </div>
        <div className={`px-2 py-1 rounded-full text-xs font-medium ${
          agent.status === 'active' ? 'bg-green-500/20 text-green-400' :
          agent.status === 'beta' ? 'bg-yellow-500/20 text-yellow-400' :
          'bg-gray-500/20 text-gray-400'
        }`}>
          {agent.status}
        </div>
      </div>

      <p className="text-gray-300 text-sm mb-4">{agent.description}</p>

      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <span className="text-gray-400 text-sm">Level</span>
          <span className="text-white font-medium">Level {agent.level}</span>
        </div>
        <div className="flex items-center justify-between">
          <span className="text-gray-400 text-sm">XP</span>
          <span className="text-white font-medium">{agent.xp.toLocaleString()}</span>
        </div>
        <div className="flex items-center justify-between">
          <span className="text-gray-400 text-sm">Tasks Completed</span>
          <span className="text-white font-medium">{agent.tasksCompleted}</span>
        </div>
        <div className="flex items-center justify-between">
          <span className="text-gray-400 text-sm">Success Rate</span>
          <span className="text-white font-medium">{agent.successRate}%</span>
        </div>
        <div className="flex items-center justify-between">
          <span className="text-gray-400 text-sm">Earnings</span>
          <span className="text-white font-medium">{agent.totalEarnings} DMT</span>
        </div>
      </div>

      <div className="mt-4 pt-4 border-t border-slate-700/30">
        <div className="flex items-center justify-between">
          <span className="text-gray-400 text-sm">Mint Cost</span>
          <span className="text-purple-400 font-medium">{agent.pricing.mintCost} DMT</span>
        </div>
      </div>
    </motion.div>
  );

  const renderAgentDetails = () => {
    if (!selectedAgent) return null;
    
    const agent = getAgentById(selectedAgent);
    if (!agent) return null;

    return (
      <motion.div
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        className="bg-slate-800/50 backdrop-blur-sm rounded-xl p-6 border border-slate-700/30"
      >
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center space-x-3">
            <div className="text-4xl">{agent.avatar}</div>
            <div>
              <h2 className="text-2xl font-bold text-white">{agent.name}</h2>
              <p className="text-gray-400">{agent.description}</p>
            </div>
          </div>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="px-4 py-2 bg-gradient-to-r from-purple-500 to-blue-500 hover:from-purple-600 hover:to-blue-600 rounded-lg font-medium text-white transition-all duration-300"
          >
            Manage Agent
          </motion.button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          <div>
            <h3 className="text-lg font-semibold text-white mb-3">Performance Metrics</h3>
            <div className="space-y-2">
              <div className="flex justify-between">
                <span className="text-gray-400">Level</span>
                <span className="text-white font-medium">Level {agent.level}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-400">XP</span>
                <span className="text-white font-medium">{agent.xp.toLocaleString()}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-400">Tasks Completed</span>
                <span className="text-white font-medium">{agent.tasksCompleted}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-400">Success Rate</span>
                <span className="text-white font-medium">{agent.successRate}%</span>
              </div>
            </div>
          </div>

          <div>
            <h3 className="text-lg font-semibold text-white mb-3">Capabilities</h3>
            <div className="space-y-2">
              {agent.capabilities.map((capability, index) => (
                <div key={index} className="flex items-center space-x-2">
                  <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
                  <span className="text-gray-300 text-sm">{capability}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <h3 className="text-lg font-semibold text-white mb-3">Pricing</h3>
            <div className="space-y-2">
              <div className="flex justify-between">
                <span className="text-gray-400">Mint Cost</span>
                <span className="text-purple-400 font-medium">{agent.pricing.mintCost} DMT</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-400">Monthly Fee</span>
                <span className="text-purple-400 font-medium">{agent.pricing.monthlyFee} DMT</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-400">Total Earnings</span>
                <span className="text-green-400 font-medium">{agent.totalEarnings} DMT</span>
              </div>
            </div>
          </div>

          <div>
            <h3 className="text-lg font-semibold text-white mb-3">Quick Actions</h3>
            <div className="space-y-2">
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="w-full p-2 bg-slate-700/50 hover:bg-slate-700 rounded-lg text-white text-sm transition-colors"
              >
                View Task History
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="w-full p-2 bg-slate-700/50 hover:bg-slate-700 rounded-lg text-white text-sm transition-colors"
              >
                Configure Settings
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="w-full p-2 bg-slate-700/50 hover:bg-slate-700 rounded-lg text-white text-sm transition-colors"
              >
                Upgrade Agent
              </motion.button>
            </div>
          </div>
        </div>
      </motion.div>
    );
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      {/* Header */}
      <header className="bg-slate-900/80 backdrop-blur-md border-b border-slate-700/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center">
              <div className="w-8 h-8 bg-gradient-to-br from-purple-500 to-blue-500 rounded-lg flex items-center justify-center mr-3">
                <span className="text-white font-bold text-sm">DM</span>
              </div>
              <span className="text-xl font-bold bg-gradient-to-r from-white to-purple-200 bg-clip-text text-transparent">
                Agent Management
              </span>
            </div>
            <div className="text-sm text-gray-400">
              {careAgents.length} Total Agents
            </div>
          </div>
        </div>
      </header>

      {/* Tab Navigation */}
      <nav className="bg-slate-800/50 backdrop-blur-sm border-b border-slate-700/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex space-x-1 py-2">
            {tabs.map((tab) => (
              <motion.button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`relative px-6 py-3 rounded-lg font-medium transition-all duration-300 ${
                  activeTab === tab.id
                    ? `bg-gradient-to-r from-${tab.color}-500 to-${tab.color}-600 text-white shadow-lg shadow-${tab.color}-500/25`
                    : 'text-gray-400 hover:text-white hover:bg-slate-700/50'
                }`}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <span className="text-lg mr-2">{tab.icon}</span>
                {tab.name}
              </motion.button>
            ))}
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Agent List */}
          <div className="lg:col-span-2">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-white">Available Agents</h2>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="px-4 py-2 bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 rounded-lg font-medium text-white transition-all duration-300"
              >
                + Create Custom Agent
              </motion.button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {filteredAgents.map((agent, index) => (
                <motion.div
                  key={agent.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                >
                  {renderAgentCard(agent)}
                </motion.div>
              ))}
            </div>
          </div>

          {/* Agent Details */}
          <div className="lg:col-span-1">
            {renderAgentDetails()}
          </div>
        </div>
      </main>
    </div>
  );
};

export default AgentsPage;
