'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';

const ProfilePage: React.FC = () => {
  const [activeTab, setActiveTab] = useState('overview');

  const tabs = [
    { id: 'overview', name: 'Overview', icon: '👤' },
    { id: 'agents', name: 'My Agents', icon: '🤖' },
    { id: 'achievements', name: 'Achievements', icon: '🏆' },
    { id: 'settings', name: 'Settings', icon: '⚙️' }
  ];

  const userProfile = {
    name: 'CryptoTrader',
    avatar: '👨‍💻',
    level: 15,
    xp: 15420,
    joinDate: '2024-01-01',
    walletAddress: '0x1234...5678',
    totalAgents: 8,
    unlockedAgents: 5,
    totalEarnings: 2500
  };

  const mockAgents = [
    {
      id: '1',
      name: 'Autonomous CFO',
      type: 'Master',
      status: 'Active',
      xp: 2450,
      level: 4,
      earnings: 850
    },
    {
      id: '2',
      name: 'Portfolio Optimizer',
      type: 'Sub-Agent',
      status: 'Active',
      xp: 1200,
      level: 2,
      earnings: 450
    },
    {
      id: '3',
      name: 'Tax Helper',
      type: 'Sub-Agent',
      status: 'Active',
      xp: 800,
      level: 1,
      earnings: 200
    }
  ];

  const mockAchievements = [
    {
      id: '1',
      name: 'First Agent',
      description: 'Minted your first AI agent',
      icon: '🎉',
      earned: true,
      earnedDate: '2024-01-05'
    },
    {
      id: '2',
      name: 'Agent Collector',
      description: 'Own 5 or more agents',
      icon: '📚',
      earned: true,
      earnedDate: '2024-01-15'
    },
    {
      id: '3',
      name: 'XP Master',
      description: 'Reach level 20',
      icon: '⭐',
      earned: false,
      earnedDate: null
    }
  ];

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
            <div className="text-6xl">{userProfile.avatar}</div>
            <div>
              <h1 className="text-4xl sm:text-5xl font-bold bg-gradient-to-r from-purple-400 to-blue-400 bg-clip-text text-transparent">
                {userProfile.name}
              </h1>
              <p className="text-xl text-gray-300 mt-2">Level {userProfile.level} • {userProfile.xp.toLocaleString()} XP</p>
            </div>
          </motion.div>
        </div>

        {/* Profile Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-slate-800/50 backdrop-blur-sm rounded-xl p-6 border border-slate-700/30">
            <div className="text-3xl font-bold text-purple-400">{userProfile.totalAgents}</div>
            <div className="text-sm text-gray-400">Total Agents</div>
          </div>
          <div className="bg-slate-800/50 backdrop-blur-sm rounded-xl p-6 border border-slate-700/30">
            <div className="text-3xl font-bold text-emerald-400">{userProfile.unlockedAgents}</div>
            <div className="text-sm text-gray-400">Unlocked</div>
          </div>
          <div className="bg-slate-800/50 backdrop-blur-sm rounded-xl p-6 border border-slate-700/30">
            <div className="text-3xl font-bold text-blue-400">{userProfile.totalEarnings}</div>
            <div className="text-sm text-gray-400">Total Earnings (DMT)</div>
          </div>
          <div className="bg-slate-800/50 backdrop-blur-sm rounded-xl p-6 border border-slate-700/30">
            <div className="text-3xl font-bold text-yellow-400">{userProfile.joinDate}</div>
            <div className="text-sm text-gray-400">Member Since</div>
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
              <h2 className="text-2xl font-bold text-white mb-6">Profile Overview</h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="bg-slate-800/50 backdrop-blur-sm rounded-xl p-6 border border-slate-700/30">
                  <h3 className="text-lg font-semibold text-white mb-4">Account Information</h3>
                  <div className="space-y-3">
                    <div className="flex justify-between">
                      <span className="text-gray-400">Username:</span>
                      <span className="text-white font-semibold">{userProfile.name}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-400">Wallet:</span>
                      <span className="text-blue-400 font-semibold">{userProfile.walletAddress}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-400">Member Since:</span>
                      <span className="text-gray-300">{userProfile.joinDate}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-400">Current Level:</span>
                      <span className="text-purple-400 font-semibold">{userProfile.level}</span>
                    </div>
                  </div>
                </div>
                
                <div className="bg-slate-800/50 backdrop-blur-sm rounded-xl p-6 border border-slate-700/30">
                  <h3 className="text-lg font-semibold text-white mb-4">Activity Summary</h3>
                  <div className="space-y-3">
                    <div className="flex justify-between">
                      <span className="text-gray-400">Total XP Earned:</span>
                      <span className="text-emerald-400 font-semibold">{userProfile.xp.toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-400">Agents Owned:</span>
                      <span className="text-blue-400 font-semibold">{userProfile.totalAgents}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-400">Total Earnings:</span>
                      <span className="text-yellow-400 font-semibold">{userProfile.totalEarnings} DMT</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-400">Success Rate:</span>
                      <span className="text-green-400 font-semibold">94%</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'agents' && (
            <div>
              <h2 className="text-2xl font-bold text-white mb-6">My Agents</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {mockAgents.map((agent, index) => (
                  <motion.div
                    key={agent.id}
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className="bg-slate-800/50 backdrop-blur-sm rounded-xl p-6 border border-slate-700/30 hover:border-purple-500/50 transition-all duration-300"
                  >
                    <div className="text-center mb-4">
                      <div className="text-4xl mb-3">🤖</div>
                      <h3 className="text-lg font-semibold text-white mb-2">{agent.name}</h3>
                      <p className="text-gray-400 text-sm">{agent.type} Agent</p>
                    </div>
                    
                    <div className="space-y-3 mb-4">
                      <div className="flex justify-between">
                        <span className="text-gray-400">Status:</span>
                        <span className="text-emerald-400 font-semibold">{agent.status}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-400">Level:</span>
                        <span className="text-blue-400 font-semibold">{agent.level}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-400">XP:</span>
                        <span className="text-purple-400 font-semibold">{agent.xp.toLocaleString()}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-400">Earnings:</span>
                        <span className="text-yellow-400 font-semibold">{agent.earnings} DMT</span>
                      </div>
                    </div>

                    <motion.button
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      className="w-full py-3 bg-gradient-to-r from-purple-500 to-blue-500 hover:from-purple-600 hover:to-blue-600 rounded-lg font-medium text-white transition-all duration-300"
                    >
                      Manage Agent
                    </motion.button>
                  </motion.div>
                ))}
              </div>
            </div>
          )}

          {activeTab === 'achievements' && (
            <div>
              <h2 className="text-2xl font-bold text-white mb-6">Achievements</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {mockAchievements.map((achievement, index) => (
                  <motion.div
                    key={achievement.id}
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className={`bg-slate-800/50 backdrop-blur-sm rounded-xl p-6 border transition-all duration-300 ${
                      achievement.earned 
                        ? 'border-emerald-500/50 bg-emerald-500/10' 
                        : 'border-slate-700/30'
                    }`}
                  >
                    <div className="text-center mb-4">
                      <div className="text-4xl mb-3">{achievement.icon}</div>
                      <h3 className="text-lg font-semibold text-white mb-2">{achievement.name}</h3>
                      <p className="text-gray-400 text-sm">{achievement.description}</p>
                    </div>
                    
                    <div className="text-center">
                      {achievement.earned ? (
                        <div>
                          <div className="text-emerald-400 font-semibold mb-2">✅ Earned</div>
                          <div className="text-sm text-gray-400">{achievement.earnedDate}</div>
                        </div>
                      ) : (
                        <div className="text-gray-400 font-semibold">🔒 Locked</div>
                      )}
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
          )}

          {activeTab === 'settings' && (
            <div>
              <h2 className="text-2xl font-bold text-white mb-6">Settings</h2>
              <div className="bg-slate-800/50 backdrop-blur-sm rounded-xl p-6 border border-slate-700/30">
                <div className="space-y-6">
                  <div>
                    <h3 className="text-lg font-semibold text-white mb-4">Account Settings</h3>
                    <div className="space-y-4">
                      <div className="flex justify-between items-center">
                        <span className="text-gray-300">Email Notifications</span>
                        <motion.button
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                          className="w-12 h-6 bg-emerald-500 rounded-full relative"
                        >
                          <div className="w-5 h-5 bg-white rounded-full absolute right-0.5 top-0.5"></div>
                        </motion.button>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-gray-300">Push Notifications</span>
                        <motion.button
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                          className="w-12 h-6 bg-slate-600 rounded-full relative"
                        >
                          <div className="w-5 h-5 bg-white rounded-full absolute left-0.5 top-0.5"></div>
                        </motion.button>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-gray-300">Public Profile</span>
                        <motion.button
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                          className="w-12 h-6 bg-emerald-500 rounded-full relative"
                        >
                          <div className="w-5 h-5 bg-white rounded-full absolute right-0.5 top-0.5"></div>
                        </motion.button>
                      </div>
                    </div>
                  </div>
                  
                  <div className="pt-6 border-t border-slate-700/30">
                    <h3 className="text-lg font-semibold text-white mb-4">Danger Zone</h3>
                    <motion.button
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      className="px-6 py-3 bg-red-500/20 hover:bg-red-500/30 border border-red-500/30 rounded-lg text-red-400 font-medium transition-all duration-300"
                    >
                      Delete Account
                    </motion.button>
                  </div>
                </div>
              </div>
            </div>
          )}
        </motion.div>
      </div>
    </div>
  );
};

export default ProfilePage;