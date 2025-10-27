'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';

const MarketplacePage: React.FC = () => {
  const [activeTab, setActiveTab] = useState('nfts');

  const tabs = [
    { id: 'nfts', name: 'NFT Agents', icon: '🎨' },
    { id: 'subscriptions', name: 'Subscriptions', icon: '🔄' },
    { id: 'tokens', name: 'Token Unlocks', icon: '🔓' }
  ];

  const mockNFTs = [
    {
      id: '1',
      name: 'Portfolio Optimizer NFT',
      description: 'Automated portfolio rebalancing agent',
      price: 180,
      currency: 'DMT',
      image: '📊',
      rarity: 'Rare',
      owner: '0x1234...5678',
      listedAt: '2024-01-15'
    },
    {
      id: '2',
      name: 'DeFi Scanner NFT',
      description: 'Smart contract security analysis agent',
      price: 250,
      currency: 'DMT',
      image: '🔍',
      rarity: 'Epic',
      owner: '0x9876...5432',
      listedAt: '2024-01-14'
    }
  ];

  const mockSubscriptions = [
    {
      id: '1',
      name: 'Tax Helper Subscription',
      description: 'Monthly crypto tax reporting service',
      price: 25,
      currency: 'DMT',
      image: '📋',
      duration: 'Monthly',
      subscribers: 1247
    },
    {
      id: '2',
      name: 'Gas Fee Predictor',
      description: 'Real-time gas fee optimization',
      price: 15,
      currency: 'DMT',
      image: '⛽',
      duration: 'Monthly',
      subscribers: 892
    }
  ];

  const mockTokenUnlocks = [
    {
      id: '1',
      name: 'Yield Farmer',
      description: 'Cross-chain yield farming optimization',
      requirement: 5000,
      currency: 'DMT',
      image: '🌾',
      holders: 2341
    },
    {
      id: '2',
      name: 'Treasury Manager',
      description: 'Advanced treasury management',
      requirement: 10000,
      currency: 'DMT',
      image: '🏦',
      holders: 567
    }
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
            Agent Marketplace
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-xl text-gray-300 max-w-3xl mx-auto"
          >
            Buy, sell, and trade AI agent NFTs. Discover new capabilities and unlock the full potential 
            of your DecentraMind ecosystem.
          </motion.p>
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
          {activeTab === 'nfts' && (
            <div>
              <h2 className="text-2xl font-bold text-white mb-6">Available NFT Agents</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {mockNFTs.map((nft, index) => (
                  <motion.div
                    key={nft.id}
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className="bg-slate-800/50 backdrop-blur-sm rounded-xl p-6 border border-slate-700/30 hover:border-purple-500/50 transition-all duration-300"
                  >
                    <div className="text-center mb-4">
                      <div className="text-5xl mb-3">{nft.image}</div>
                      <h3 className="text-lg font-semibold text-white">{nft.name}</h3>
                      <p className="text-gray-400 text-sm">{nft.description}</p>
                    </div>
                    
                    <div className="space-y-3 mb-4">
                      <div className="flex justify-between">
                        <span className="text-gray-400">Price:</span>
                        <span className="text-white font-semibold">{nft.price} {nft.currency}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-400">Rarity:</span>
                        <span className={`font-semibold ${
                          nft.rarity === 'Rare' ? 'text-blue-400' : 'text-purple-400'
                        }`}>
                          {nft.rarity}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-400">Listed:</span>
                        <span className="text-gray-300">{nft.listedAt}</span>
                      </div>
                    </div>

                    <motion.button
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      className="w-full py-3 bg-gradient-to-r from-purple-500 to-blue-500 hover:from-purple-600 hover:to-blue-600 rounded-lg font-medium text-white transition-all duration-300"
                    >
                      Buy NFT
                    </motion.button>
                  </motion.div>
                ))}
              </div>
            </div>
          )}

          {activeTab === 'subscriptions' && (
            <div>
              <h2 className="text-2xl font-bold text-white mb-6">Subscription Services</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {mockSubscriptions.map((sub, index) => (
                  <motion.div
                    key={sub.id}
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className="bg-slate-800/50 backdrop-blur-sm rounded-xl p-6 border border-slate-700/30 hover:border-blue-500/50 transition-all duration-300"
                  >
                    <div className="text-center mb-4">
                      <div className="text-5xl mb-3">{sub.image}</div>
                      <h3 className="text-lg font-semibold text-white">{sub.name}</h3>
                      <p className="text-gray-400 text-sm">{sub.description}</p>
                    </div>
                    
                    <div className="space-y-3 mb-4">
                      <div className="flex justify-between">
                        <span className="text-gray-400">Price:</span>
                        <span className="text-white font-semibold">{sub.price} {sub.currency}/{sub.duration}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-400">Subscribers:</span>
                        <span className="text-blue-400 font-semibold">{sub.subscribers.toLocaleString()}</span>
                      </div>
                    </div>

                    <motion.button
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      className="w-full py-3 bg-gradient-to-r from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600 rounded-lg font-medium text-white transition-all duration-300"
                    >
                      Subscribe
                    </motion.button>
                  </motion.div>
                ))}
              </div>
            </div>
          )}

          {activeTab === 'tokens' && (
            <div>
              <h2 className="text-2xl font-bold text-white mb-6">Token Unlock Agents</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {mockTokenUnlocks.map((token, index) => (
                  <motion.div
                    key={token.id}
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className="bg-slate-800/50 backdrop-blur-sm rounded-xl p-6 border border-slate-700/30 hover:border-emerald-500/50 transition-all duration-300"
                  >
                    <div className="text-center mb-4">
                      <div className="text-5xl mb-3">{token.image}</div>
                      <h3 className="text-lg font-semibold text-white">{token.name}</h3>
                      <p className="text-gray-400 text-sm">{token.description}</p>
                    </div>
                    
                    <div className="space-y-3 mb-4">
                      <div className="flex justify-between">
                        <span className="text-gray-400">Requirement:</span>
                        <span className="text-white font-semibold">{token.requirement.toLocaleString()} {token.currency}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-400">Holders:</span>
                        <span className="text-emerald-400 font-semibold">{token.holders.toLocaleString()}</span>
                      </div>
                    </div>

                    <motion.button
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      className="w-full py-3 bg-gradient-to-r from-emerald-500 to-green-500 hover:from-emerald-600 hover:to-green-600 rounded-lg font-medium text-white transition-all duration-300"
                    >
                      Check Eligibility
                    </motion.button>
                  </motion.div>
                ))}
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
          <div className="text-4xl mb-4">🚀</div>
          <h3 className="text-2xl font-bold text-white mb-4">Marketplace Coming Soon</h3>
          <p className="text-gray-300 max-w-2xl mx-auto">
            The full marketplace experience is currently in development. This preview shows the planned 
            functionality for buying, selling, and trading AI agent NFTs and subscriptions.
          </p>
        </motion.div>
      </div>
    </div>
  );
};

export default MarketplacePage;