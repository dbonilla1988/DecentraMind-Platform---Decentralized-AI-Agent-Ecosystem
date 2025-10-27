'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import ZoneLayout from '../components/layout/ZoneLayout';
import ConsoleLayout from '../components/shared/ConsoleLayout';

const StakingPage = () => {
  const [activeTab, setActiveTab] = useState('dmt');

  const tabs = [
    { id: 'dmt', name: 'DMT Staking', icon: '💰', apy: '12.5%' },
    { id: 'dmtx', name: 'DMTX Staking', icon: '🚀', apy: '18.2%' },
    { id: 'lp', name: 'LP Tokens', icon: '🔄', apy: '25.8%' }
  ];

  const stakingPools = [
    {
      id: 'dmt-30d',
      name: 'DMT 30-Day Pool',
      apy: '12.5%',
      minStake: '100 DMT',
      maxStake: '10,000 DMT',
      lockPeriod: '30 days',
      rewards: ['DMT Rewards', 'Governance Rights', 'Early Access'],
      totalStaked: '2,450,000 DMT',
      participants: 1247,
      status: 'active'
    },
    {
      id: 'dmt-90d',
      name: 'DMT 90-Day Pool',
      apy: '15.8%',
      minStake: '500 DMT',
      maxStake: '50,000 DMT',
      lockPeriod: '90 days',
      rewards: ['DMT Rewards', 'Governance Rights', 'Premium Features', 'NFT Discounts'],
      totalStaked: '1,890,000 DMT',
      participants: 892,
      status: 'active'
    },
    {
      id: 'dmtx-180d',
      name: 'DMTX 180-Day Pool',
      apy: '18.2%',
      minStake: '50 DMTX',
      maxStake: '5,000 DMTX',
      lockPeriod: '180 days',
      rewards: ['DMTX Rewards', 'VIP Access', 'Custom Agent Development', 'Revenue Share'],
      totalStaked: '890,000 DMTX',
      participants: 445,
      status: 'active'
    }
  ];

  const userStakes = [
    {
      id: 'user-stake-1',
      pool: 'DMT 30-Day Pool',
      amount: '2,500 DMT',
      apy: '12.5%',
      startDate: '2024-01-15',
      endDate: '2024-02-14',
      rewards: '156.25 DMT',
      status: 'active'
    },
    {
      id: 'user-stake-2',
      pool: 'DMTX 180-Day Pool',
      amount: '150 DMTX',
      apy: '18.2%',
      startDate: '2024-01-01',
      endDate: '2024-06-29',
      rewards: '136.5 DMTX',
      status: 'active'
    }
  ];

  return (
    <ZoneLayout zone="staking">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <ConsoleLayout title="Staking" subtitle="Earn Rewards by Staking DMT & DMTX Tokens" showWalletStatus={true}>
          {/* Header */}
          <div className="text-center mb-12">
            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-4xl sm:text-5xl font-bold mb-6 bg-gradient-to-r from-yellow-400 to-orange-400 bg-clip-text text-transparent"
            >
              Token Staking
            </motion.h1>
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="text-xl text-gray-300 max-w-3xl mx-auto"
            >
              Stake your DMT and DMTX tokens to earn rewards, unlock governance rights, and access premium features
            </motion.p>
          </div>

          {/* Wallet Status */}
          <div className="bg-slate-800/50 backdrop-blur-sm rounded-2xl p-6 border border-slate-700/30 mb-8">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="text-center">
                <div className="text-3xl font-bold text-emerald-400">2,500 DMT</div>
                <div className="text-sm text-gray-400">Available Balance</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-blue-400">150 DMTX</div>
                <div className="text-sm text-gray-400">Available Balance</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-purple-400">292.75</div>
                <div className="text-sm text-gray-400">Total Rewards</div>
              </div>
            </div>
          </div>

          {/* Tab Navigation */}
          <nav className="bg-slate-800/50 backdrop-blur-sm border-b border-slate-700/30 mb-8">
            <div className="flex space-x-1 py-2">
              {tabs.map((tab) => (
                <motion.button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`relative px-6 py-3 rounded-lg font-medium transition-all duration-300 ${
                    activeTab === tab.id
                      ? 'bg-gradient-to-r from-yellow-500 to-orange-500 text-white shadow-lg shadow-yellow-500/25'
                      : 'text-gray-400 hover:text-white hover:bg-slate-700/50'
                  }`}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <span className="text-lg mr-2">{tab.icon}</span>
                  {tab.name}
                  <span className="ml-2 px-2 py-1 rounded-full text-xs bg-slate-700/50 text-gray-300">
                    {tab.apy} APY
                  </span>
                </motion.button>
              ))}
            </div>
          </nav>

          {/* Staking Pools */}
          <div className="space-y-8">
            <h2 className="text-2xl font-bold text-white mb-6">Available Staking Pools</h2>
            
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {stakingPools.map((pool, index) => (
                <motion.div
                  key={pool.id}
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="group relative bg-slate-800/50 backdrop-blur-sm rounded-2xl p-8 border border-slate-700/50 hover:border-yellow-500/50 transition-all duration-300 hover:shadow-2xl hover:shadow-yellow-500/20"
                >
                  {/* Pool Header */}
                  <div className="flex items-center justify-between mb-6">
                    <div>
                      <h3 className="text-2xl font-bold text-white mb-2 group-hover:text-yellow-300 transition-colors">
                        {pool.name}
                      </h3>
                      <div className="text-3xl font-bold text-yellow-400">{pool.apy}</div>
                      <div className="text-sm text-gray-400">Annual Percentage Yield</div>
                    </div>
                    <div className="text-right">
                      <div className="text-lg font-bold text-emerald-400">{pool.totalStaked}</div>
                      <div className="text-sm text-gray-400">Total Staked</div>
                      <div className="text-sm text-gray-400">{pool.participants} participants</div>
                    </div>
                  </div>

                  {/* Pool Details */}
                  <div className="space-y-4 mb-6">
                    <div className="flex justify-between">
                      <span className="text-gray-400">Min Stake:</span>
                      <span className="text-white font-medium">{pool.minStake}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-400">Max Stake:</span>
                      <span className="text-white font-medium">{pool.maxStake}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-400">Lock Period:</span>
                      <span className="text-white font-medium">{pool.lockPeriod}</span>
                    </div>
                  </div>

                  {/* Rewards */}
                  <div className="mb-6">
                    <h4 className="text-sm font-semibold text-gray-400 mb-3">Rewards Include:</h4>
                    <div className="space-y-2">
                      {pool.rewards.map((reward, idx) => (
                        <div key={idx} className="flex items-center text-sm text-gray-300">
                          <span className="w-2 h-2 bg-yellow-400 rounded-full mr-3"></span>
                          {reward}
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Action Button */}
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    className="w-full py-3 bg-gradient-to-r from-yellow-500 to-orange-500 hover:from-yellow-600 hover:to-orange-600 rounded-xl font-semibold text-white transition-all duration-300"
                  >
                    Stake Now
                  </motion.button>
                </motion.div>
              ))}
            </div>
          </div>

          {/* User Stakes */}
          <div className="mt-16">
            <h2 className="text-2xl font-bold text-white mb-6">Your Active Stakes</h2>
            
            <div className="space-y-6">
              {userStakes.map((stake, index) => (
                <motion.div
                  key={stake.id}
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="bg-slate-800/50 backdrop-blur-sm rounded-xl p-6 border border-slate-700/30"
                >
                  <div className="grid grid-cols-1 md:grid-cols-5 gap-6 items-center">
                    <div>
                      <h3 className="text-lg font-semibold text-white mb-1">{stake.pool}</h3>
                      <div className="text-sm text-gray-400">Staked Amount</div>
                      <div className="text-xl font-bold text-emerald-400">{stake.amount}</div>
                    </div>
                    
                    <div>
                      <div className="text-sm text-gray-400">APY</div>
                      <div className="text-lg font-bold text-yellow-400">{stake.apy}</div>
                    </div>
                    
                    <div>
                      <div className="text-sm text-gray-400">Start Date</div>
                      <div className="text-sm text-white">{stake.startDate}</div>
                    </div>
                    
                    <div>
                      <div className="text-sm text-gray-400">End Date</div>
                      <div className="text-sm text-white">{stake.endDate}</div>
                    </div>
                    
                    <div className="text-right">
                      <div className="text-sm text-gray-400">Rewards</div>
                      <div className="text-lg font-bold text-purple-400">{stake.rewards}</div>
                      <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        className="mt-2 px-4 py-2 bg-gradient-to-r from-purple-500 to-blue-500 hover:from-purple-600 hover:to-blue-600 rounded-lg text-sm font-medium text-white transition-all duration-300"
                      >
                        Claim Rewards
                      </motion.button>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>

          {/* Info Section */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="mt-16 text-center bg-slate-800/30 backdrop-blur-sm rounded-2xl p-8 border border-slate-700/50"
          >
            <h2 className="text-3xl font-bold text-white mb-4">How Staking Works</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-left">
              <div>
                <div className="text-4xl mb-4">1️⃣</div>
                <h3 className="text-xl font-semibold text-white mb-2">Choose Pool</h3>
                <p className="text-gray-300">Select a staking pool that matches your risk tolerance and desired rewards.</p>
              </div>
              <div>
                <div className="text-4xl mb-4">2️⃣</div>
                <h3 className="text-xl font-semibold text-white mb-2">Stake Tokens</h3>
                <p className="text-gray-300">Lock your tokens for the specified period and start earning rewards immediately.</p>
              </div>
              <div>
                <div className="text-4xl mb-4">3️⃣</div>
                <h3 className="text-xl font-semibold text-white mb-2">Earn Rewards</h3>
                <p className="text-gray-300">Receive regular rewards and unlock additional benefits based on your stake.</p>
              </div>
            </div>
          </motion.div>
        </ConsoleLayout>
      </div>
    </ZoneLayout>
  );
};

export default StakingPage;

















