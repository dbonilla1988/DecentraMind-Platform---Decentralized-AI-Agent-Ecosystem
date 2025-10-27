'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';

const DAOPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState('proposals');

  const tabs = [
    { id: 'proposals', name: 'Proposals', icon: '📋' },
    { id: 'voting', name: 'Voting', icon: '🗳️' },
    { id: 'treasury', name: 'Treasury', icon: '💰' },
    { id: 'members', name: 'Members', icon: '👥' }
  ];

  const mockProposals = [
    {
      id: '1',
      title: 'Increase Agent Minting Fees',
      description: 'Proposal to increase agent minting fees by 20% to fund development',
      status: 'Active',
      votesFor: 1250,
      votesAgainst: 340,
      endDate: '2024-01-25',
      proposer: '0x1234...5678'
    },
    {
      id: '2',
      title: 'Add New Master Agent',
      description: 'Proposal to add a new "Legal Assistant" master agent',
      status: 'Pending',
      votesFor: 0,
      votesAgainst: 0,
      endDate: '2024-01-30',
      proposer: '0x9876...5432'
    }
  ];

  const treasuryStats = {
    totalValue: 1250000,
    currency: 'DMT',
    monthlyIncome: 45000,
    monthlyExpenses: 32000,
    proposals: 12,
    activeVotes: 3
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="text-center mb-12">
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-4xl sm:text-5xl font-bold mb-6 bg-gradient-to-r from-purple-400 to-blue-400 bg-clip-text text-transparent"
          >
            DecentraMind DAO
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-xl text-gray-300 max-w-3xl mx-auto"
          >
            Participate in governance decisions that shape the future of DecentraMind. 
            Vote on proposals, manage treasury, and help guide the ecosystem.
          </motion.p>
        </div>

        {/* DAO Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-slate-800/50 backdrop-blur-sm rounded-xl p-6 border border-slate-700/30">
            <div className="text-3xl font-bold text-purple-400">{treasuryStats.totalValue.toLocaleString()}</div>
            <div className="text-sm text-gray-400">Treasury Value ({treasuryStats.currency})</div>
          </div>
          <div className="bg-slate-800/50 backdrop-blur-sm rounded-xl p-6 border border-slate-700/30">
            <div className="text-3xl font-bold text-emerald-400">{treasuryStats.proposals}</div>
            <div className="text-sm text-gray-400">Total Proposals</div>
          </div>
          <div className="bg-slate-800/50 backdrop-blur-sm rounded-xl p-6 border border-slate-700/30">
            <div className="text-3xl font-bold text-blue-400">{treasuryStats.activeVotes}</div>
            <div className="text-sm text-gray-400">Active Votes</div>
          </div>
          <div className="bg-slate-800/50 backdrop-blur-sm rounded-xl p-6 border border-slate-700/30">
            <div className="text-3xl font-bold text-yellow-400">2,847</div>
            <div className="text-sm text-gray-400">DAO Members</div>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="flex justify-center mb-8">
          <div className="bg-slate-800/50 backdrop-blur-sm rounded-xl p-2 border border-slate-700/30">
            <div className="flex space-x-2">
              {tabs.map((tab) => (
                <motion.button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`px-6 py-3 rounded-lg font-medium transition-all duration-300 ${
                    activeTab === tab.id
                      ? 'bg-gradient-to-r from-purple-500 to-blue-500 text-white shadow-lg'
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
        </div>

        {/* Content */}
        <motion.div
          key={activeTab}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-8"
        >
          {activeTab === 'proposals' && (
            <div>
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold text-white">Active Proposals</h2>
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className="px-6 py-3 bg-gradient-to-r from-purple-500 to-blue-500 hover:from-purple-600 hover:to-blue-600 rounded-lg font-medium text-white transition-all duration-300"
                >
                  Create Proposal
                </motion.button>
              </div>
              
              <div className="space-y-4">
                {mockProposals.map((proposal, index) => (
                  <motion.div
                    key={proposal.id}
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className="bg-slate-800/50 backdrop-blur-sm rounded-xl p-6 border border-slate-700/30 hover:border-purple-500/50 transition-all duration-300"
                  >
                    <div className="flex justify-between items-start mb-4">
                      <div>
                        <h3 className="text-lg font-semibold text-white mb-2">{proposal.title}</h3>
                        <p className="text-gray-400 text-sm">{proposal.description}</p>
                      </div>
                      <div className={`px-3 py-1 rounded-full text-xs font-medium ${
                        proposal.status === 'Active' 
                          ? 'bg-emerald-500/20 text-emerald-400' 
                          : 'bg-yellow-500/20 text-yellow-400'
                      }`}>
                        {proposal.status}
                      </div>
                    </div>
                    
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
                      <div className="text-center">
                        <div className="text-lg font-bold text-emerald-400">{proposal.votesFor}</div>
                        <div className="text-xs text-gray-400">Votes For</div>
                      </div>
                      <div className="text-center">
                        <div className="text-lg font-bold text-red-400">{proposal.votesAgainst}</div>
                        <div className="text-xs text-gray-400">Votes Against</div>
                      </div>
                      <div className="text-center">
                        <div className="text-lg font-bold text-blue-400">{proposal.endDate}</div>
                        <div className="text-xs text-gray-400">End Date</div>
                      </div>
                      <div className="text-center">
                        <div className="text-lg font-bold text-purple-400">{proposal.proposer}</div>
                        <div className="text-xs text-gray-400">Proposer</div>
                      </div>
                    </div>

                    <div className="flex space-x-3">
                      <motion.button
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        className="flex-1 py-2 bg-emerald-500/20 hover:bg-emerald-500/30 border border-emerald-500/30 rounded-lg text-emerald-400 font-medium transition-all duration-300"
                      >
                        Vote For
                      </motion.button>
                      <motion.button
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        className="flex-1 py-2 bg-red-500/20 hover:bg-red-500/30 border border-red-500/30 rounded-lg text-red-400 font-medium transition-all duration-300"
                      >
                        Vote Against
                      </motion.button>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
          )}

          {activeTab === 'treasury' && (
            <div>
              <h2 className="text-2xl font-bold text-white mb-6">Treasury Overview</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="bg-slate-800/50 backdrop-blur-sm rounded-xl p-6 border border-slate-700/30">
                  <h3 className="text-lg font-semibold text-white mb-4">Financial Summary</h3>
                  <div className="space-y-3">
                    <div className="flex justify-between">
                      <span className="text-gray-400">Total Treasury:</span>
                      <span className="text-white font-semibold">{treasuryStats.totalValue.toLocaleString()} {treasuryStats.currency}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-400">Monthly Income:</span>
                      <span className="text-emerald-400 font-semibold">+{treasuryStats.monthlyIncome.toLocaleString()} {treasuryStats.currency}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-400">Monthly Expenses:</span>
                      <span className="text-red-400 font-semibold">-{treasuryStats.monthlyExpenses.toLocaleString()} {treasuryStats.currency}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-400">Net Monthly:</span>
                      <span className="text-blue-400 font-semibold">+{(treasuryStats.monthlyIncome - treasuryStats.monthlyExpenses).toLocaleString()} {treasuryStats.currency}</span>
                    </div>
                  </div>
                </div>
                
                <div className="bg-slate-800/50 backdrop-blur-sm rounded-xl p-6 border border-slate-700/30">
                  <h3 className="text-lg font-semibold text-white mb-4">Recent Transactions</h3>
                  <div className="space-y-3">
                    <div className="flex justify-between items-center">
                      <span className="text-gray-300">Agent Minting Revenue</span>
                      <span className="text-emerald-400">+15,000 DMT</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-gray-300">Development Costs</span>
                      <span className="text-red-400">-8,500 DMT</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-gray-300">Marketing Campaign</span>
                      <span className="text-red-400">-3,200 DMT</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-gray-300">Subscription Revenue</span>
                      <span className="text-emerald-400">+12,000 DMT</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'members' && (
            <div>
              <h2 className="text-2xl font-bold text-white mb-6">DAO Members</h2>
              <div className="bg-slate-800/50 backdrop-blur-sm rounded-xl p-6 border border-slate-700/30">
                <div className="text-center py-12">
                  <div className="text-6xl mb-4">👥</div>
                  <h3 className="text-xl font-semibold text-white mb-2">Member Directory</h3>
                  <p className="text-gray-400 mb-6">
                    View and manage DAO members, their voting power, and contribution history.
                  </p>
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    className="px-6 py-3 bg-gradient-to-r from-purple-500 to-blue-500 hover:from-purple-600 hover:to-blue-600 rounded-lg font-medium text-white transition-all duration-300"
                  >
                    View Members
                  </motion.button>
                </div>
              </div>
            </div>
          )}
        </motion.div>

        {/* Coming Soon Notice */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="mt-16 bg-slate-800/30 backdrop-blur-sm rounded-2xl p-8 border border-slate-700/50 text-center"
        >
          <div className="text-4xl mb-4">🏛️</div>
          <h3 className="text-2xl font-bold text-white mb-4">DAO Governance</h3>
          <p className="text-gray-300 max-w-2xl mx-auto">
            Full DAO governance functionality is coming soon. This preview shows the planned 
            proposal system, voting mechanisms, and treasury management features.
          </p>
        </motion.div>
      </div>
    </div>
  );
};

export default DAOPage;