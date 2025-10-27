'use client';

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useAgentUnlocks } from '../../hooks/useAgentUnlocks';
import { agentMetadata } from '../../data/agentMetadata';

interface LeaderboardEntry {
  walletAddress: string;
  totalXP: number;
  unlockedAgents: number;
  rank: number;
}

const CareOrchestratorDashboard: React.FC = () => {
  const [walletAddress] = useState('mock-wallet-address'); // In production, get from wallet connection
  const { unlockedAgents, totalXP, xpHistory, isLoading } = useAgentUnlocks(walletAddress);
  
  // Mock leaderboard data
  const [leaderboard, setLeaderboard] = useState<LeaderboardEntry[]>([
    { walletAddress: '0x1234...5678', totalXP: 15420, unlockedAgents: 6, rank: 1 },
    { walletAddress: '0x2345...6789', totalXP: 12850, unlockedAgents: 5, rank: 2 },
    { walletAddress: '0x3456...7890', totalXP: 11200, unlockedAgents: 4, rank: 3 },
    { walletAddress: '0x4567...8901', totalXP: 9850, unlockedAgents: 4, rank: 4 },
    { walletAddress: '0x5678...9012', totalXP: 8750, unlockedAgents: 3, rank: 5 },
    { walletAddress: '0x6789...0123', totalXP: 7200, unlockedAgents: 3, rank: 6 },
    { walletAddress: '0x7890...1234', totalXP: 6500, unlockedAgents: 2, rank: 7 },
    { walletAddress: '0x8901...2345', totalXP: 5800, unlockedAgents: 2, rank: 8 },
    { walletAddress: '0x9012...3456', totalXP: 4200, unlockedAgents: 1, rank: 9 },
    { walletAddress: '0x0123...4567', totalXP: 3500, unlockedAgents: 1, rank: 10 }
  ]);

  // Calculate user's rank
  const userRank = leaderboard.findIndex(entry => entry.walletAddress === walletAddress) + 1;
  const userEntry = leaderboard.find(entry => entry.walletAddress === walletAddress);

  // Calculate level based on XP
  const calculateLevel = (xp: number): number => {
    return Math.floor(xp / 1000) + 1;
  };

  const calculateProgressToNextLevel = (xp: number): number => {
    const currentLevel = calculateLevel(xp);
    const currentLevelXP = (currentLevel - 1) * 1000;
    const nextLevelXP = currentLevel * 1000;
    return ((xp - currentLevelXP) / (nextLevelXP - currentLevelXP)) * 100;
  };

  const currentLevel = calculateLevel(totalXP);
  const progressToNextLevel = calculateProgressToNextLevel(totalXP);

  // Recent unlock history
  const recentUnlocks = xpHistory
    .filter(entry => entry.reason.includes('unlock'))
    .slice(-5)
    .reverse();

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-emerald-900 to-slate-900 flex items-center justify-center">
        <div className="text-white text-xl">Loading dashboard...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-emerald-900 to-slate-900">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-white mb-4">Care Orchestrator Dashboard</h1>
          <p className="text-gray-400 max-w-2xl mx-auto">
            Track your wellness journey, unlock achievements, and compete with the community
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* User Stats */}
          <div className="lg:col-span-2 space-y-6">
            {/* XP Overview */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-slate-800/50 backdrop-blur-sm rounded-xl p-6 border border-slate-700/30"
            >
              <h2 className="text-2xl font-bold text-white mb-4">Your Progress</h2>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
                <div className="text-center">
                  <div className="text-3xl font-bold text-emerald-400">{totalXP.toLocaleString()}</div>
                  <div className="text-gray-400">Total XP</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-blue-400">Level {currentLevel}</div>
                  <div className="text-gray-400">Current Level</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-purple-400">{unlockedAgents.length}</div>
                  <div className="text-gray-400">Agents Unlocked</div>
                </div>
              </div>

              {/* Progress Bar */}
              <div className="mb-4">
                <div className="flex justify-between text-sm text-gray-400 mb-2">
                  <span>Progress to Level {currentLevel + 1}</span>
                  <span>{Math.round(progressToNextLevel)}%</span>
                </div>
                <div className="w-full bg-slate-700 rounded-full h-3">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${progressToNextLevel}%` }}
                    transition={{ duration: 1, ease: "easeOut" }}
                    className="bg-gradient-to-r from-emerald-500 to-blue-500 h-3 rounded-full"
                  />
                </div>
              </div>

              {/* Rank */}
              {userEntry && (
                <div className="text-center">
                  <div className="text-lg text-gray-300">
                    Ranked #{userRank} out of {leaderboard.length} users
                  </div>
                </div>
              )}
            </motion.div>

            {/* Recent Activity */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="bg-slate-800/50 backdrop-blur-sm rounded-xl p-6 border border-slate-700/30"
            >
              <h2 className="text-2xl font-bold text-white mb-4">Recent Activity</h2>
              
              {recentUnlocks.length > 0 ? (
                <div className="space-y-3">
                  {recentUnlocks.map((entry, index) => {
                    const agent = agentMetadata.find(a => a.id === entry.agentId);
                    return (
                      <div key={index} className="flex items-center justify-between p-3 bg-slate-700/50 rounded-lg">
                        <div className="flex items-center space-x-3">
                          <div className="text-2xl">{agent?.icon || '🤖'}</div>
                          <div>
                            <div className="text-white font-medium">{agent?.name || 'Unknown Agent'}</div>
                            <div className="text-gray-400 text-sm">{entry.reason}</div>
                          </div>
                        </div>
                        <div className="text-emerald-400 font-semibold">+{entry.amount} XP</div>
                      </div>
                    );
                  })}
                </div>
              ) : (
                <div className="text-center text-gray-400 py-8">
                  No recent activity. Start unlocking agents to see your progress here!
                </div>
              )}
            </motion.div>
          </div>

          {/* Leaderboard */}
          <div className="space-y-6">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="bg-slate-800/50 backdrop-blur-sm rounded-xl p-6 border border-slate-700/30"
            >
              <h2 className="text-2xl font-bold text-white mb-4">Leaderboard</h2>
              
              <div className="space-y-3">
                {leaderboard.slice(0, 10).map((entry, index) => (
                  <motion.div
                    key={entry.walletAddress}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.05 }}
                    className={`flex items-center justify-between p-3 rounded-lg ${
                      entry.walletAddress === walletAddress
                        ? 'bg-emerald-500/20 border border-emerald-500/30'
                        : 'bg-slate-700/50'
                    }`}
                  >
                    <div className="flex items-center space-x-3">
                      <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold ${
                        index < 3 ? 'bg-gradient-to-r from-yellow-400 to-orange-500 text-black' : 'bg-slate-600 text-white'
                      }`}>
                        {index + 1}
                      </div>
                      <div>
                        <div className="text-white font-medium">
                          {entry.walletAddress === walletAddress ? 'You' : `${entry.walletAddress.slice(0, 6)}...${entry.walletAddress.slice(-4)}`}
                        </div>
                        <div className="text-gray-400 text-sm">{entry.unlockedAgents} agents</div>
                      </div>
                    </div>
                    <div className="text-emerald-400 font-semibold">{entry.totalXP.toLocaleString()} XP</div>
                  </motion.div>
                ))}
              </div>
            </motion.div>

            {/* Quick Actions */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="bg-slate-800/50 backdrop-blur-sm rounded-xl p-6 border border-slate-700/30"
            >
              <h2 className="text-2xl font-bold text-white mb-4">Quick Actions</h2>
              
              <div className="space-y-3">
                <button className="w-full p-3 bg-emerald-500/20 hover:bg-emerald-500/30 border border-emerald-500/30 rounded-lg text-emerald-400 transition-all duration-300">
                  View All Agents
                </button>
                <button className="w-full p-3 bg-blue-500/20 hover:bg-blue-500/30 border border-blue-500/30 rounded-lg text-blue-400 transition-all duration-300">
                  Share Progress
                </button>
                <button className="w-full p-3 bg-purple-500/20 hover:bg-purple-500/30 border border-purple-500/30 rounded-lg text-purple-400 transition-all duration-300">
                  Export Data
                </button>
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CareOrchestratorDashboard;
