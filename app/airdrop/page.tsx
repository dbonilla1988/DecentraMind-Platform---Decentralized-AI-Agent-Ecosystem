'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';

const AirdropPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState('available');

  const tabs = [
    { id: 'available', name: 'Available', icon: '🎁' },
    { id: 'claimed', name: 'Claimed', icon: '✅' },
    { id: 'upcoming', name: 'Upcoming', icon: '🚀' }
  ];

  const mockAirdrops = [
    {
      id: '1',
      name: 'Early Adopter Bonus',
      description: 'Reward for being an early user of DecentraMind',
      amount: 1000,
      currency: 'DMT',
      icon: '🌟',
      status: 'Available',
      requirements: ['Hold at least 1 agent', 'Account created before Jan 15, 2024'],
      endDate: '2024-02-15',
      claimed: false
    },
    {
      id: '2',
      name: 'Agent Collector Reward',
      description: 'Bonus for owning multiple agents',
      amount: 500,
      currency: 'DMT',
      icon: '🤖',
      status: 'Available',
      requirements: ['Own 3 or more agents', 'Active for 30+ days'],
      endDate: '2024-02-20',
      claimed: false
    },
    {
      id: '3',
      name: 'Community Contributor',
      description: 'Reward for active community participation',
      amount: 250,
      currency: 'DMT',
      icon: '👥',
      status: 'Claimed',
      requirements: ['Participate in 5+ discussions', 'Help 3+ community members'],
      endDate: '2024-01-30',
      claimed: true,
      claimedDate: '2024-01-25'
    }
  ];

  const upcomingAirdrops = [
    {
      id: '4',
      name: 'DeFi Integration Bonus',
      description: 'Reward for using DeFi features',
      amount: 750,
      currency: 'DMT',
      icon: '💰',
      startDate: '2024-02-01',
      requirements: ['Use DeFi protocols', 'Complete 10+ transactions']
    },
    {
      id: '5',
      name: 'Governance Participant',
      description: 'Reward for DAO participation',
      amount: 300,
      currency: 'DMT',
      icon: '🗳️',
      startDate: '2024-02-10',
      requirements: ['Vote on 3+ proposals', 'Submit 1+ proposal']
    }
  ];

  const userStats = {
    totalClaimed: 250,
    totalAvailable: 1500,
    totalUpcoming: 1050,
    claimHistory: 1
  };

  const filteredAirdrops = () => {
    switch (activeTab) {
      case 'available':
        return mockAirdrops.filter(airdrop => airdrop.status === 'Available' && !airdrop.claimed);
      case 'claimed':
        return mockAirdrops.filter(airdrop => airdrop.claimed);
      case 'upcoming':
        return upcomingAirdrops;
      default:
        return [];
    }
  };

  const handleClaim = (airdropId: string) => {
    console.log('Claiming airdrop:', airdropId);
    // TODO: Implement airdrop claiming logic
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
            Airdrop Center
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-xl text-gray-300 max-w-3xl mx-auto"
          >
            Claim your rewards and bonuses. Participate in community activities to unlock 
            exclusive airdrops and earn additional DMT tokens.
          </motion.p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-slate-800/50 backdrop-blur-sm rounded-xl p-6 border border-slate-700/30">
            <div className="text-3xl font-bold text-emerald-400">{userStats.totalClaimed}</div>
            <div className="text-sm text-gray-400">Claimed (DMT)</div>
          </div>
          <div className="bg-slate-800/50 backdrop-blur-sm rounded-xl p-6 border border-slate-700/30">
            <div className="text-3xl font-bold text-blue-400">{userStats.totalAvailable}</div>
            <div className="text-sm text-gray-400">Available (DMT)</div>
          </div>
          <div className="bg-slate-800/50 backdrop-blur-sm rounded-xl p-6 border border-slate-700/30">
            <div className="text-3xl font-bold text-purple-400">{userStats.totalUpcoming}</div>
            <div className="text-sm text-gray-400">Upcoming (DMT)</div>
          </div>
          <div className="bg-slate-800/50 backdrop-blur-sm rounded-xl p-6 border border-slate-700/30">
            <div className="text-3xl font-bold text-yellow-400">{userStats.claimHistory}</div>
            <div className="text-sm text-gray-400">Claims Made</div>
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
          {activeTab === 'available' && (
            <div>
              <h2 className="text-2xl font-bold text-white mb-6">Available Airdrops</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredAirdrops().map((airdrop, index) => (
                  <motion.div
                    key={airdrop.id}
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className="bg-slate-800/50 backdrop-blur-sm rounded-xl p-6 border border-slate-700/30 hover:border-emerald-500/50 transition-all duration-300"
                  >
                    <div className="text-center mb-4">
                      <div className="text-5xl mb-3">{airdrop.icon}</div>
                      <h3 className="text-lg font-semibold text-white mb-2">{airdrop.name}</h3>
                      <p className="text-gray-400 text-sm">{airdrop.description}</p>
                    </div>
                    
                    <div className="space-y-3 mb-4">
                      <div className="flex justify-between">
                        <span className="text-gray-400">Reward:</span>
                        <span className="text-emerald-400 font-semibold">{airdrop.amount} {airdrop.currency}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-400">End Date:</span>
                        <span className="text-gray-300">{airdrop.endDate}</span>
                      </div>
                    </div>

                    <div className="mb-4">
                      <div className="text-sm text-gray-400 mb-2">Requirements:</div>
                      <ul className="space-y-1">
                        {airdrop.requirements.map((req, idx) => (
                          <li key={idx} className="text-xs text-gray-300 flex items-center">
                            <span className="text-emerald-400 mr-2">✓</span>
                            {req}
                          </li>
                        ))}
                      </ul>
                    </div>

                    <motion.button
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={() => handleClaim(airdrop.id)}
                      className="w-full py-3 bg-gradient-to-r from-emerald-500 to-green-500 hover:from-emerald-600 hover:to-green-600 rounded-lg font-medium text-white transition-all duration-300"
                    >
                      Claim Airdrop
                    </motion.button>
                  </motion.div>
                ))}
              </div>
            </div>
          )}

          {activeTab === 'claimed' && (
            <div>
              <h2 className="text-2xl font-bold text-white mb-6">Claimed Airdrops</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredAirdrops().map((airdrop, index) => (
                  <motion.div
                    key={airdrop.id}
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className="bg-slate-800/50 backdrop-blur-sm rounded-xl p-6 border border-emerald-500/50 bg-emerald-500/10"
                  >
                    <div className="text-center mb-4">
                      <div className="text-5xl mb-3">{airdrop.icon}</div>
                      <h3 className="text-lg font-semibold text-white mb-2">{airdrop.name}</h3>
                      <p className="text-gray-400 text-sm">{airdrop.description}</p>
                    </div>
                    
                    <div className="space-y-3 mb-4">
                      <div className="flex justify-between">
                        <span className="text-gray-400">Reward:</span>
                        <span className="text-emerald-400 font-semibold">{airdrop.amount} {airdrop.currency}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-400">Claimed:</span>
                        <span className="text-emerald-400 font-semibold">{airdrop.claimedDate}</span>
                      </div>
                    </div>

                    <div className="text-center">
                      <div className="text-emerald-400 font-semibold">✅ Claimed</div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
          )}

          {activeTab === 'upcoming' && (
            <div>
              <h2 className="text-2xl font-bold text-white mb-6">Upcoming Airdrops</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredAirdrops().map((airdrop, index) => (
                  <motion.div
                    key={airdrop.id}
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className="bg-slate-800/50 backdrop-blur-sm rounded-xl p-6 border border-slate-700/30 hover:border-blue-500/50 transition-all duration-300"
                  >
                    <div className="text-center mb-4">
                      <div className="text-5xl mb-3">{airdrop.icon}</div>
                      <h3 className="text-lg font-semibold text-white mb-2">{airdrop.name}</h3>
                      <p className="text-gray-400 text-sm">{airdrop.description}</p>
                    </div>
                    
                    <div className="space-y-3 mb-4">
                      <div className="flex justify-between">
                        <span className="text-gray-400">Reward:</span>
                        <span className="text-blue-400 font-semibold">{airdrop.amount} {airdrop.currency}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-400">Start Date:</span>
                        <span className="text-gray-300">{airdrop.startDate}</span>
                      </div>
                    </div>

                    <div className="mb-4">
                      <div className="text-sm text-gray-400 mb-2">Requirements:</div>
                      <ul className="space-y-1">
                        {airdrop.requirements.map((req, idx) => (
                          <li key={idx} className="text-xs text-gray-300 flex items-center">
                            <span className="text-blue-400 mr-2">📋</span>
                            {req}
                          </li>
                        ))}
                      </ul>
                    </div>

                    <div className="text-center">
                      <div className="text-blue-400 font-semibold">🚀 Coming Soon</div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
          )}
        </motion.div>

        {/* Info Section */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="mt-16 bg-slate-800/30 backdrop-blur-sm rounded-2xl p-8 border border-slate-700/50 text-center"
        >
          <div className="text-4xl mb-4">🎁</div>
          <h3 className="text-2xl font-bold text-white mb-4">Airdrop Information</h3>
          <p className="text-gray-300 max-w-2xl mx-auto mb-6">
            Airdrops are distributed based on your activity and participation in the DecentraMind ecosystem. 
            Complete requirements to unlock rewards and grow your token holdings.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-sm">
            <div>
              <div className="text-emerald-400 font-semibold mb-2">How to Qualify</div>
              <div className="text-gray-400">Complete specific requirements for each airdrop</div>
            </div>
            <div>
              <div className="text-blue-400 font-semibold mb-2">Claim Process</div>
              <div className="text-gray-400">Click claim button when requirements are met</div>
            </div>
            <div>
              <div className="text-purple-400 font-semibold mb-2">Token Distribution</div>
              <div className="text-gray-400">Tokens are sent directly to your wallet</div>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default AirdropPage;