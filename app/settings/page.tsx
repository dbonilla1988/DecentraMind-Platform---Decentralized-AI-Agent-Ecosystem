'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import ZoneLayout from '../components/layout/ZoneLayout';
import ConsoleLayout from '../components/shared/ConsoleLayout';

const SettingsPage = () => {
  const [activeTab, setActiveTab] = useState('profile');

  const tabs = [
    { id: 'profile', name: 'Profile', icon: '👤' },
    { id: 'wallet', name: 'Wallet', icon: '💰' },
    { id: 'notifications', name: 'Notifications', icon: '🔔' },
    { id: 'privacy', name: 'Privacy', icon: '🔒' }
  ];

  const [profileSettings, setProfileSettings] = useState({
    name: 'Alex Johnson',
    username: '@alexj_crypto',
    email: 'alex@example.com',
    bio: 'AI enthusiast and blockchain developer',
    timezone: 'UTC-8',
    language: 'English'
  });

  const [walletSettings, setWalletSettings] = useState({
    primaryWallet: '0x1234...5678',
    autoConnect: true,
    showBalance: true,
    currency: 'USD'
  });

  const [notificationSettings, setNotificationSettings] = useState({
    emailNotifications: true,
    pushNotifications: true,
    taskUpdates: true,
    proposalUpdates: true,
    stakingRewards: true,
    airdropAlerts: false
  });

  const [privacySettings, setPrivacySettings] = useState({
    profileVisibility: 'public',
    showXP: true,
    showAgents: true,
    showNFTs: true,
    dataSharing: false
  });

  return (
    <ZoneLayout zone="settings">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <ConsoleLayout title="Settings" subtitle="Manage Your Account & Preferences" showWalletStatus={true}>
          {/* Header */}
          <div className="text-center mb-12">
            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-4xl sm:text-5xl font-bold mb-6 bg-gradient-to-r from-gray-400 to-slate-400 bg-clip-text text-transparent"
            >
              Settings
            </motion.h1>
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="text-xl text-gray-300 max-w-3xl mx-auto"
            >
              Customize your DecentraMind experience and manage your account preferences
            </motion.p>
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
                      ? 'bg-gradient-to-r from-gray-500 to-slate-500 text-white shadow-lg shadow-gray-500/25'
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
          </nav>

          {/* Profile Tab */}
          {activeTab === 'profile' && (
            <div className="space-y-8">
              <div className="bg-slate-800/50 backdrop-blur-sm rounded-xl p-6 border border-slate-700/30">
                <h3 className="text-xl font-bold text-white mb-6">Profile Information</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-400 mb-2">Display Name</label>
                    <input
                      type="text"
                      value={profileSettings.name}
                      onChange={(e) => setProfileSettings({...profileSettings, name: e.target.value})}
                      className="w-full px-4 py-3 bg-slate-700/50 border border-slate-600/50 rounded-lg text-white placeholder-gray-400 focus:border-gray-400 focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-400 mb-2">Username</label>
                    <input
                      type="text"
                      value={profileSettings.username}
                      onChange={(e) => setProfileSettings({...profileSettings, username: e.target.value})}
                      className="w-full px-4 py-3 bg-slate-700/50 border border-slate-600/50 rounded-lg text-white placeholder-gray-400 focus:border-gray-400 focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-400 mb-2">Email</label>
                    <input
                      type="email"
                      value={profileSettings.email}
                      onChange={(e) => setProfileSettings({...profileSettings, email: e.target.value})}
                      className="w-full px-4 py-3 bg-slate-700/50 border border-slate-600/50 rounded-lg text-white placeholder-gray-400 focus:border-gray-400 focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-400 mb-2">Timezone</label>
                    <select
                      value={profileSettings.timezone}
                      onChange={(e) => setProfileSettings({...profileSettings, timezone: e.target.value})}
                      className="w-full px-4 py-3 bg-slate-700/50 border border-slate-600/50 rounded-lg text-white focus:border-gray-400 focus:outline-none"
                    >
                      <option value="UTC-8">UTC-8 (PST)</option>
                      <option value="UTC-5">UTC-5 (EST)</option>
                      <option value="UTC+0">UTC+0 (GMT)</option>
                      <option value="UTC+1">UTC+1 (CET)</option>
                    </select>
                  </div>
                </div>
                <div className="mt-6">
                  <label className="block text-sm font-medium text-gray-400 mb-2">Bio</label>
                  <textarea
                    value={profileSettings.bio}
                    onChange={(e) => setProfileSettings({...profileSettings, bio: e.target.value})}
                    rows={3}
                    className="w-full px-4 py-3 bg-slate-700/50 border border-slate-600/50 rounded-lg text-white placeholder-gray-400 focus:border-gray-400 focus:outline-none"
                    placeholder="Tell us about yourself..."
                  />
                </div>
              </div>
            </div>
          )}

          {/* Wallet Tab */}
          {activeTab === 'wallet' && (
            <div className="space-y-8">
              <div className="bg-slate-800/50 backdrop-blur-sm rounded-xl p-6 border border-slate-700/30">
                <h3 className="text-xl font-bold text-white mb-6">Wallet Settings</h3>
                <div className="space-y-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-400 mb-2">Primary Wallet</label>
                    <div className="flex items-center space-x-4">
                      <input
                        type="text"
                        value={walletSettings.primaryWallet}
                        readOnly
                        className="flex-1 px-4 py-3 bg-slate-700/50 border border-slate-600/50 rounded-lg text-white"
                      />
                      <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        className="px-4 py-3 bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 rounded-lg font-semibold text-white transition-all duration-300"
                      >
                        Change
                      </motion.button>
                    </div>
                  </div>
                  
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <div className="text-white font-medium">Auto-connect Wallet</div>
                        <div className="text-sm text-gray-400">Automatically connect wallet on page load</div>
                      </div>
                      <label className="relative inline-flex items-center cursor-pointer">
                        <input
                          type="checkbox"
                          checked={walletSettings.autoConnect}
                          onChange={(e) => setWalletSettings({...walletSettings, autoConnect: e.target.checked})}
                          className="sr-only peer"
                        />
                        <div className="w-11 h-6 bg-slate-600 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                      </label>
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <div>
                        <div className="text-white font-medium">Show Balance</div>
                        <div className="text-sm text-gray-400">Display wallet balance in UI</div>
                      </div>
                      <label className="relative inline-flex items-center cursor-pointer">
                        <input
                          type="checkbox"
                          checked={walletSettings.showBalance}
                          onChange={(e) => setWalletSettings({...walletSettings, showBalance: e.target.checked})}
                          className="sr-only peer"
                        />
                        <div className="w-11 h-6 bg-slate-600 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                      </label>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Notifications Tab */}
          {activeTab === 'notifications' && (
            <div className="space-y-8">
              <div className="bg-slate-800/50 backdrop-blur-sm rounded-xl p-6 border border-slate-700/30">
                <h3 className="text-xl font-bold text-white mb-6">Notification Preferences</h3>
                <div className="space-y-6">
                  {[
                    { key: 'emailNotifications', label: 'Email Notifications', description: 'Receive notifications via email' },
                    { key: 'pushNotifications', label: 'Push Notifications', description: 'Receive browser push notifications' },
                    { key: 'taskUpdates', label: 'Task Updates', description: 'Get notified when tasks are completed' },
                    { key: 'proposalUpdates', label: 'Proposal Updates', description: 'Get notified about new DAO proposals' },
                    { key: 'stakingRewards', label: 'Staking Rewards', description: 'Get notified about staking rewards' },
                    { key: 'airdropAlerts', label: 'Airdrop Alerts', description: 'Get notified about new airdrops' }
                  ].map((setting) => (
                    <div key={setting.key} className="flex items-center justify-between">
                      <div>
                        <div className="text-white font-medium">{setting.label}</div>
                        <div className="text-sm text-gray-400">{setting.description}</div>
                      </div>
                      <label className="relative inline-flex items-center cursor-pointer">
                        <input
                          type="checkbox"
                          checked={notificationSettings[setting.key as keyof typeof notificationSettings]}
                          onChange={(e) => setNotificationSettings({...notificationSettings, [setting.key]: e.target.checked})}
                          className="sr-only peer"
                        />
                        <div className="w-11 h-6 bg-slate-600 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                      </label>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Privacy Tab */}
          {activeTab === 'privacy' && (
            <div className="space-y-8">
              <div className="bg-slate-800/50 backdrop-blur-sm rounded-xl p-6 border border-slate-700/30">
                <h3 className="text-xl font-bold text-white mb-6">Privacy Settings</h3>
                <div className="space-y-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-400 mb-2">Profile Visibility</label>
                    <select
                      value={privacySettings.profileVisibility}
                      onChange={(e) => setPrivacySettings({...privacySettings, profileVisibility: e.target.value})}
                      className="w-full px-4 py-3 bg-slate-700/50 border border-slate-600/50 rounded-lg text-white focus:border-gray-400 focus:outline-none"
                    >
                      <option value="public">Public</option>
                      <option value="friends">Friends Only</option>
                      <option value="private">Private</option>
                    </select>
                  </div>
                  
                  <div className="space-y-4">
                    {[
                      { key: 'showXP', label: 'Show XP', description: 'Display your XP on your profile' },
                      { key: 'showAgents', label: 'Show Agents', description: 'Display your agents on your profile' },
                      { key: 'showNFTs', label: 'Show NFTs', description: 'Display your NFTs on your profile' },
                      { key: 'dataSharing', label: 'Data Sharing', description: 'Allow data sharing for analytics' }
                    ].map((setting) => (
                      <div key={setting.key} className="flex items-center justify-between">
                        <div>
                          <div className="text-white font-medium">{setting.label}</div>
                          <div className="text-sm text-gray-400">{setting.description}</div>
                        </div>
                        <label className="relative inline-flex items-center cursor-pointer">
                          <input
                            type="checkbox"
                            checked={privacySettings[setting.key as keyof typeof privacySettings]}
                            onChange={(e) => setPrivacySettings({...privacySettings, [setting.key]: e.target.checked})}
                            className="sr-only peer"
                          />
                          <div className="w-11 h-6 bg-slate-600 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                        </label>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Save Button */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="mt-12 text-center"
          >
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="px-8 py-3 bg-gradient-to-r from-emerald-500 to-cyan-500 hover:from-emerald-600 hover:to-cyan-600 rounded-xl font-semibold text-white transition-all duration-300"
            >
              Save Changes
            </motion.button>
          </motion.div>
        </ConsoleLayout>
      </div>
    </ZoneLayout>
  );
};

export default SettingsPage;

















