'use client';

import React from 'react';
import { motion } from 'framer-motion';
import ZoneLayout from '../components/layout/ZoneLayout';

const MetaversePage: React.FC = () => {
  return (
    <ZoneLayout zone="community" showNavigation={false}>
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 text-white">
        {/* Header */}
        <div className="relative py-20 px-4 sm:px-6 lg:px-8 text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="max-w-4xl mx-auto"
          >
            <div className="flex items-center justify-center mb-8">
              <div className="w-20 h-20 bg-gradient-to-br from-cyan-400/20 to-blue-400/20 rounded-2xl flex items-center justify-center border border-cyan-400/30 mr-6">
                <span className="text-4xl">🌐</span>
              </div>
              <div>
                <h1 className="text-5xl sm:text-6xl lg:text-7xl font-bold bg-gradient-to-r from-white via-purple-200 to-blue-200 bg-clip-text text-transparent">
                  Metaverse
                </h1>
                <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold bg-gradient-to-r from-cyan-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
                  Portal
                </h2>
              </div>
            </div>
            
            <p className="text-xl sm:text-2xl text-gray-300 mb-8 leading-relaxed">
              Immersive 3D environments for AI agent interaction
            </p>
            
            <div className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-orange-500/20 to-red-500/20 border border-orange-500/30 rounded-full backdrop-blur-sm mb-12">
              <div className="w-3 h-3 bg-orange-400 rounded-full mr-3 animate-pulse" />
              <span className="text-orange-400 font-medium">🚀 Coming Soon - Q2 2024</span>
            </div>
          </motion.div>
        </div>

        {/* Main Content */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-20">
          {/* Coming Soon Alert */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="bg-gradient-to-r from-blue-500/10 to-purple-500/10 border border-blue-500/30 rounded-2xl p-8 mb-12 backdrop-blur-sm"
          >
            <div className="text-center">
              <h3 className="text-2xl font-bold text-blue-300 mb-4">
                🚧 Under Development
              </h3>
              <p className="text-gray-300 mb-6 max-w-2xl mx-auto">
                We're building an immersive metaverse experience where your AI agents can interact in 3D environments. 
                This will integrate with Three.js and Babylon.js for stunning visual experiences.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <button className="px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 rounded-xl font-semibold transition-all duration-300">
                  Join Beta Program
                </button>
                <button className="px-6 py-3 border-2 border-blue-500/50 hover:border-blue-400 hover:bg-blue-500/10 rounded-xl font-semibold transition-all duration-300">
                  Get Notified
                </button>
              </div>
            </div>
          </motion.div>

          {/* Features Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
            {[
              {
                icon: '🌍',
                title: 'Virtual Worlds',
                description: 'Explore immersive 3D environments where your AI agents can interact and collaborate.',
                status: 'In Development',
                color: 'cyan'
              },
              {
                icon: '👥',
                title: 'Social Spaces',
                description: 'Meet other users and collaborate in virtual meeting rooms and shared workspaces.',
                status: 'Planned',
                color: 'emerald'
              },
              {
                icon: '🏗️',
                title: 'World Builder',
                description: 'Create and customize your own virtual environments using intuitive tools.',
                status: 'Planned',
                color: 'orange'
              },
              {
                icon: '🤖',
                title: 'Agent Avatars',
                description: 'See your AI agents as 3D avatars with realistic animations and interactions.',
                status: 'In Development',
                color: 'purple'
              },
              {
                icon: '🛒',
                title: 'Virtual Marketplace',
                description: 'Trade agents and assets in immersive 3D market spaces.',
                status: 'Research',
                color: 'rose'
              },
              {
                icon: '🥽',
                title: 'VR Support',
                description: 'Full virtual reality experience with VR headset support.',
                status: 'Research',
                color: 'blue'
              }
            ].map((feature, index) => (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 50 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                className="group relative p-6 bg-gradient-to-br from-slate-800/50 to-slate-900/50 rounded-2xl border border-slate-700/50 hover:border-purple-500/50 transition-all duration-300 backdrop-blur-sm"
              >
                <div className="text-4xl mb-4 group-hover:scale-110 transition-transform duration-300">
                  {feature.icon}
                </div>
                <h3 className="text-xl font-bold text-white mb-3 group-hover:text-purple-300 transition-colors duration-300">
                  {feature.title}
                </h3>
                <p className="text-gray-300 mb-4 leading-relaxed group-hover:text-gray-200 transition-colors duration-300">
                  {feature.description}
                </p>
                <div className="flex items-center justify-between">
                  <span className={`text-sm font-medium px-3 py-1 rounded-full ${
                    feature.status === 'In Development' ? 'bg-blue-500/20 text-blue-300' :
                    feature.status === 'Planned' ? 'bg-emerald-500/20 text-emerald-300' :
                    'bg-orange-500/20 text-orange-300'
                  }`}>
                    {feature.status}
                  </span>
                </div>
              </motion.div>
            ))}
          </div>

          {/* Technology Stack */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.6 }}
            className="bg-gradient-to-r from-slate-800/30 to-slate-900/30 rounded-2xl p-8 border border-slate-700/30 backdrop-blur-sm"
          >
            <h3 className="text-2xl font-bold text-white mb-6 text-center">
              Technology Stack
            </h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
              {[
                { name: 'Three.js', icon: '📦', description: '3D Graphics' },
                { name: 'Babylon.js', icon: '🎮', description: 'Game Engine' },
                { name: 'WebXR', icon: '🥽', description: 'VR/AR Support' },
                { name: 'WebGL', icon: '🎨', description: 'Rendering' }
              ].map((tech) => (
                <div key={tech.name} className="text-center">
                  <div className="text-3xl mb-2">{tech.icon}</div>
                  <h4 className="font-semibold text-white mb-1">{tech.name}</h4>
                  <p className="text-sm text-gray-400">{tech.description}</p>
                </div>
              ))}
            </div>
          </motion.div>
        </div>
      </div>
    </ZoneLayout>
  );
};

export default MetaversePage;

