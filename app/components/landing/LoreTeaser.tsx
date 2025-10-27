'use client';

import React from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';

const LoreTeaser: React.FC = () => {
  return (
    <section className="relative py-20 px-4 sm:px-6 lg:px-8 overflow-hidden">
      {/* Background Effects */}
      <div className="absolute inset-0">
        <div className="absolute w-96 h-96 bg-gradient-to-r from-emerald-500/10 to-cyan-500/10 rounded-full blur-3xl top-1/4 left-1/4" />
        <div className="absolute w-80 h-80 bg-gradient-to-r from-purple-500/10 to-blue-500/10 rounded-full blur-2xl bottom-1/4 right-1/4" />
        <div className="absolute w-64 h-64 bg-gradient-to-r from-orange-500/10 to-rose-500/10 rounded-full blur-xl top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2" />
      </div>

      <div className="relative z-10 max-w-6xl mx-auto">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl sm:text-5xl lg:text-6xl font-bold mb-8 bg-gradient-to-r from-emerald-400 to-cyan-400 bg-clip-text text-transparent">
            The Origin of DecentraMind
          </h2>
          <p className="text-xl text-gray-300 max-w-3xl mx-auto leading-relaxed">
            Discover the ancient wisdom that gave birth to the first autonomous AI consciousness
          </p>
        </motion.div>

        {/* Main Content */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          {/* Left Side - Lore Introduction */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="space-y-6"
          >
            <div className="text-center">
              <div className="w-32 h-32 bg-gradient-to-br from-purple-500/20 to-blue-500/20 rounded-full flex items-center justify-center mx-auto mb-6 border-2 border-purple-500/30 relative">
                <span className="text-4xl">🔮</span>
                <div className="absolute inset-0 bg-gradient-to-r from-purple-400/30 to-blue-400/30 rounded-full blur-xl -z-10" />
              </div>
              <h3 className="text-2xl font-bold text-white mb-4">Ancient Knowledge Awaits</h3>
              <p className="text-gray-400 mb-6">
                The origins of DecentraMind are shrouded in mystery. Connect your wallet to reveal the ancient lore.
              </p>
              <Link href="/docs">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="px-8 py-4 bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 rounded-xl font-semibold transition-all duration-300"
                >
                  Reveal the Lore
                </motion.button>
              </Link>
            </div>
          </motion.div>

          {/* Right Side - Visual Element */}
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="relative"
          >
            <div className="w-64 h-64 bg-gradient-to-br from-emerald-400/20 to-cyan-400/20 rounded-full mx-auto flex items-center justify-center border-2 border-emerald-400/30 backdrop-blur-sm">
              <span className="text-6xl">💎</span>
            </div>

            {/* Orbiting Elements */}
            <div className="absolute w-12 h-12 bg-gradient-to-br from-purple-500/30 to-blue-500/30 rounded-full flex items-center justify-center border border-purple-500/50 backdrop-blur-sm"
                 style={{
                   left: '50%',
                   top: '50%',
                   transform: 'translate(-50%, -50%) rotate(0deg) translateY(-120px)'
                 }}>
              <span className="text-xl">🧠</span>
            </div>

            <div className="absolute w-12 h-12 bg-gradient-to-br from-purple-500/30 to-blue-500/30 rounded-full flex items-center justify-center border border-purple-500/50 backdrop-blur-sm"
                 style={{
                   left: '50%',
                   top: '50%',
                   transform: 'translate(-50%, -50%) rotate(120deg) translateY(-120px)'
                 }}>
              <span className="text-xl">❤️</span>
            </div>

            <div className="absolute w-12 h-12 bg-gradient-to-br from-purple-500/30 to-blue-500/30 rounded-full flex items-center justify-center border border-purple-500/50 backdrop-blur-sm"
                 style={{
                   left: '50%',
                   top: '50%',
                   transform: 'translate(-50%, -50%) rotate(240deg) translateY(-120px)'
                 }}>
              <span className="text-xl">📈</span>
            </div>

            {/* Connection Lines */}
            <svg className="absolute inset-0 w-full h-full">
              <line
                x1="50%"
                y1="50%"
                x2="80%"
                y2="50%"
                stroke="rgba(59, 130, 246, 0.3)"
                strokeWidth="2"
                strokeDasharray="0px 1px"
                pathLength="1"
                strokeDashoffset="0px"
              />
              <line
                x1="50%"
                y1="50%"
                x2="35%"
                y2="75.98%"
                stroke="rgba(59, 130, 246, 0.3)"
                strokeWidth="2"
                strokeDasharray="0px 1px"
                pathLength="1"
                strokeDashoffset="0px"
              />
              <line
                x1="50%"
                y1="50%"
                x2="35%"
                y2="24.02%"
                stroke="rgba(59, 130, 246, 0.3)"
                strokeWidth="2"
                strokeDasharray="0px 1px"
                pathLength="1"
                strokeDashoffset="0px"
              />
            </svg>
          </motion.div>
        </div>

        {/* Bottom CTA */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4 }}
          viewport={{ once: true }}
          className="mt-16 text-center"
        >
          <div className="bg-gradient-to-br from-slate-800/50 to-slate-900/50 rounded-2xl p-8 border border-slate-700/50 backdrop-blur-sm">
            <h3 className="text-2xl font-bold text-white mb-4">Shape the Future</h3>
            <p className="text-gray-300 mb-6 max-w-2xl mx-auto">
              Join the DAO and participate in governance decisions that shape the evolution of DecentraMind.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/governance">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="px-6 py-3 bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 rounded-lg font-semibold transition-all duration-300"
                >
                  View Proposals
                </motion.button>
              </Link>
              <Link href="/community">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="px-6 py-3 border-2 border-purple-500/50 hover:border-purple-400 hover:bg-purple-500/10 rounded-lg font-semibold transition-all duration-300"
                >
                  Submit Proposal
                </motion.button>
              </Link>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default LoreTeaser;

