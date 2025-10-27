'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';

const XPPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState('overview');

  const tabs = [
    { id: 'overview', name: 'Overview', icon: '📊' },
    { id: 'rewards', name: 'Rewards', icon: '🎁' },
    { id: 'leaderboard', name: 'Leaderboard', icon: '🏆' },
    { id: 'history', name: 'History', icon: '📈' }
  ];

  const userStats = {
    totalXP: 15420,
    level: 15,
    xpToNext: 580,
    rank: 247,
    weeklyXP: 1250,
    monthlyXP: 4200
  };

  const mockRewards = [
    {
      id: '1',
      name: 'Level 10 Achievement',
      description: 'Reached level 10 with any agent',
      xpRequired: 10000,
      reward: 'Exclusive NFT Badge',
      claimed: true
    },
    {
      id: '2',
      name: 'Master Agent Collector',
      description: 'Own all 3 master agents',
      xpRequired: 5000,
      reward: 'Special Avatar Frame',
      claimed: false
    },
    {
      id: '3',
      name: 'Sub-Agent Expert',
      description: 'Unlock 10 sub-agents',
      xpRequired: 15000,
      reward: 'Premium Agent Access',
      claimed: false
    }
  ];

  const mockLeaderboard = [
    { rank: 1, name: 'CryptoWhale', xp: 125000, level: 125 },
    { rank: 2, name: 'DeFiMaster', xp: 118000, level: 118 },
    { rank: 3, name: 'AgentKing', xp: 110000, level: 110 },
    { rank: 4, name: 'BlockchainPro', xp: 105000, level: 105 },
    { rank: 5, name: 'SmartTrader', xp: 98000, level: 98 }
  ];

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
            XP System
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-xl text-gray-300 max-w-3xl mx-auto"
          >
            Track your progress, earn rewards, and climb the leaderboard. Your XP journey 
            in the DecentraMind ecosystem starts here.
          </motion.p>
        </div>

        {/* User Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-slate-800/50 backdrop-blur-sm rounded-xl p-6 border border-slate-700/30">
            <div className="text-3xl font-bold text-purple-400">{userStats.totalXP.toLocaleString()}</div>
            <div className="text-sm text-gray-400">Total XP</div>
          </div>
          <div className="bg-slate-800/50 backdrop-blur-sm rounded-xl p-6 border border-slate-700/30">
            <div className="text-3xl font-bold text-emerald-400">Level {userStats.level}</div>
            <div className="text-sm text-gray-400">Current Level</div>
          </div>
          <div className="bg-slate-800/50 backdrop-blur-sm rounded-xl p-6 border border-slate-700/30">
            <div className="text-3xl font-bold text-blue-400">#{userStats.rank}</div>
            <div className="text-sm text-gray-400">Global Rank</div>
          </div>
          <div className="bg-slate-800/50 backdrop-blur-sm rounded-xl p-6 border border-slate-700/30">
            <div className="text-3xl font-bold text-yellow-400">{userStats.xpToNext}</div>
            <div className="text-sm text-gray-400">XP to Next Level</div>
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
          {activeTab === 'overview' && (
            <div>
              <h2 className="text-2xl font-bold text-white mb-6">XP Overview</h2>
              
              {/* XP Progress Bar */}
              <div className="bg-slate-800/50 backdrop-blur-sm rounded-xl p-6 border border-slate-700/30 mb-6">
                <div className="flex justify-between items-center mb-4">
                  <h3 className="text-lg font-semibold text-white">Level Progress</h3>
                  <span className="text-gray-400">Level {userStats.level} → Level {userStats.level + 1}</span>
                </div>
                <div className="w-full bg-slate-700/50 rounded-full h-4 mb-2">
                  <div 
                    className="bg-gradient-to-r from-purple-500 to-blue-500 h-4 rounded-full transition-all duration-500"
                    style={{ width: `${((userStats.totalXP % 1000) / 1000) * 100}%` }}
                  ></div>
                </div>
                <div className="flex justify-between text-sm text-gray-400">
                  <span>{userStats.totalXP % 1000} XP</span>
                  <span>{userStats.xpToNext} XP to next level</span>
                </div>
              </div>

              {/* Weekly/Monthly Stats */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="bg-slate-800/50 backdrop-blur-sm rounded-xl p-6 border border-slate-700/30">
                  <h3 className="text-lg font-semibold text-white mb-4">Weekly Progress</h3>
                  <div className="text-3xl font-bold text-emerald-400 mb-2">+{userStats.weeklyXP} XP</div>
                  <div className="text-sm text-gray-400">This week</div>
                </div>
                <div className="bg-slate-800/50 backdrop-blur-sm rounded-xl p-6 border border-slate-700/30">
                  <h3 className="text-lg font-semibold text-white mb-4">Monthly Progress</h3>
                  <div className="text-3xl font-bold text-blue-400 mb-2">+{userStats.monthlyXP} XP</div>
                  <div className="text-sm text-gray-400">This month</div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'rewards' && (
            <div>
              <h2 className="text-2xl font-bold text-white mb-6">Available Rewards</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {mockRewards.map((reward, index) => (
                  <motion.div
                    key={reward.id}
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className={`bg-slate-800/50 backdrop-blur-sm rounded-xl p-6 border transition-all duration-300 ${
                      reward.claimed 
                        ? 'border-emerald-500/50 bg-emerald-500/10' 
                        : 'border-slate-700/30 hover:border-purple-500/50'
                    }`}
                  >
                    <div className="text-center mb-4">
                      <div className="text-4xl mb-3">{reward.claimed ? '✅' : '🎁'}</div>
                      <h3 className="text-lg font-semibold text-white mb-2">{reward.name}</h3>
                      <p className="text-gray-400 text-sm">{reward.description}</p>
                    </div>
                    
                    <div className="space-y-3 mb-4">
                      <div className="flex justify-between">
                        <span className="text-gray-400">XP Required:</span>
                        <span className="text-white font-semibold">{reward.xpRequired.toLocaleString()}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-400">Reward:</span>
                        <span className="text-purple-400 font-semibold">{reward.reward}</span>
                      </div>
                    </div>

                    <motion.button
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      disabled={reward.claimed}
                      className={`w-full py-3 rounded-lg font-medium transition-all duration-300 ${
                        reward.claimed
                          ? 'bg-emerald-500/20 text-emerald-400 cursor-default'
                          : 'bg-gradient-to-r from-purple-500 to-blue-500 hover:from-purple-600 hover:to-blue-600 text-white'
                      }`}
                    >
                      {reward.claimed ? 'Claimed' : 'Claim Reward'}
                    </motion.button>
                  </motion.div>
                ))}
              </div>
            </div>
          )}

          {activeTab === 'leaderboard' && (
            <div>
              <h2 className="text-2xl font-bold text-white mb-6">Global Leaderboard</h2>
              <div className="bg-slate-800/50 backdrop-blur-sm rounded-xl border border-slate-700/30 overflow-hidden">
                <div className="p-6">
                  <div className="space-y-4">
                    {mockLeaderboard.map((player, index) => (
                      <motion.div
                        key={player.rank}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: index * 0.1 }}
                        className={`flex items-center justify-between p-4 rounded-lg ${
                          player.rank <= 3 
                            ? 'bg-gradient-to-r from-yellow-500/10 to-orange-500/10 border border-yellow-500/30' 
                            : 'bg-slate-700/30'
                        }`}
                      >
                        <div className="flex items-center space-x-4">
                          <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold ${
                            player.rank === 1 ? 'bg-yellow-500 text-black' :
                            player.rank === 2 ? 'bg-gray-400 text-black' :
                            player.rank === 3 ? 'bg-orange-500 text-black' :
                            'bg-slate-600 text-white'
                          }`}>
                            {player.rank}
                          </div>
                          <div>
                            <div className="font-semibold text-white">{player.name}</div>
                            <div className="text-sm text-gray-400">Level {player.level}</div>
                          </div>
                        </div>
                        <div className="text-right">
                          <div className="font-semibold text-white">{player.xp.toLocaleString()} XP</div>
                          <div className="text-sm text-gray-400">Total</div>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'history' && (
            <div>
              <h2 className="text-2xl font-bold text-white mb-6">XP History</h2>
              <div className="bg-slate-800/50 backdrop-blur-sm rounded-xl p-6 border border-slate-700/30">
                <div className="text-center py-12">
                  <div className="text-6xl mb-4">📈</div>
                  <h3 className="text-xl font-semibold text-white mb-2">XP History</h3>
                  <p className="text-gray-400 mb-6">
                    View your detailed XP earning history and activity logs.
                  </p>
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    className="px-6 py-3 bg-gradient-to-r from-purple-500 to-blue-500 hover:from-purple-600 hover:to-blue-600 rounded-lg font-medium text-white transition-all duration-300"
                  >
                    View History
                  </motion.button>
                </div>
              </div>
            </div>
          )}
        </motion.div>
      </div>
    </div>
  );
};

export default XPPage;