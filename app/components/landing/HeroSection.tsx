'use client';

import React from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';
import DecentraMindLogo from '../DecentraMindLogo';

const HeroSection: React.FC = () => {
  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* Background Effects */}
      <div className="absolute inset-0">
        <div className="absolute w-96 h-96 bg-gradient-to-r from-cyan-500/10 to-purple-500/10 rounded-full blur-3xl top-1/4 left-1/4" />
        <div className="absolute w-80 h-80 bg-gradient-to-r from-emerald-500/10 to-blue-500/10 rounded-full blur-2xl bottom-1/4 right-1/4" />
        <div className="absolute w-64 h-64 bg-gradient-to-r from-orange-500/10 to-rose-500/10 rounded-full blur-xl top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2" />
      </div>

      {/* Floating Particles */}
      <div className="absolute inset-0 pointer-events-none">
        {[...Array(20)].map((_, i) => {
          // Use deterministic positioning based on index to avoid hydration mismatch
          const positions = [
            { left: 14.1, top: 68.1 }, { left: 73.0, top: 71.2 }, { left: 85.5, top: 33.9 },
            { left: 22.8, top: 82.1 }, { left: 76.2, top: 14.0 }, { left: 76.2, top: 19.0 },
            { left: 14.8, top: 80.7 }, { left: 29.3, top: 25.4 }, { left: 67.2, top: 1.6 },
            { left: 41.2, top: 53.0 }, { left: 75.2, top: 57.3 }, { left: 27.4, top: 82.8 },
            { left: 3.8, top: 63.9 }, { left: 80.4, top: 49.3 }, { left: 53.5, top: 47.6 },
            { left: 49.2, top: 70.5 }, { left: 62.4, top: 49.2 }, { left: 6.4, top: 97.0 },
            { left: 35.7, top: 88.2 }, { left: 52.3, top: 80.3 }
          ];
          const pos = positions[i] || { left: 50, top: 50 };
          
          return (
            <motion.div
              key={i}
              className="absolute w-2 h-2 bg-cyan-400/30 rounded-full"
              style={{
                left: `${pos.left}%`,
                top: `${pos.top}%`,
              }}
              animate={{
                y: [0, -20, 0],
                opacity: [0.3, 0.8, 0.3],
              }}
              transition={{
                duration: 3 + (i % 3) * 0.5, // Use index-based duration instead of random
                repeat: Infinity,
                delay: (i % 4) * 0.5, // Use index-based delay instead of random
              }}
            />
          );
        })}
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
                    {/* Hero Title */}
                    <motion.div
                      initial={{ opacity: 0, y: 30 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.8 }}
                      className="mb-8"
                    >
                      <h1 className="text-6xl sm:text-7xl lg:text-8xl font-bold mb-6 bg-gradient-to-r from-white via-purple-200 to-blue-200 bg-clip-text text-transparent">
                        DecentraMind Labs
                      </h1>
                      <p className="text-xl sm:text-2xl text-emerald-300 font-medium">
                        — The Swiss Army of AI Agents
                      </p>
                    </motion.div>

        {/* Subtitle */}
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="text-xl sm:text-2xl text-gray-300 mb-16 max-w-5xl mx-auto leading-relaxed"
        >
          Empowering users through{' '}
          <span className="text-cyan-400 font-semibold">tokenized intelligence</span>,{' '}
          <span className="text-purple-400 font-semibold">decentralized governance</span>, and{' '}
          <span className="text-emerald-400 font-semibold">self-evolving agents</span>.
        </motion.p>

        {/* CTA Buttons */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4 }}
          className="flex flex-col sm:flex-row gap-8 justify-center items-center mb-20"
        >
          <Link href="/agents">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="group relative px-12 py-6 bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 rounded-2xl font-bold text-xl transition-all duration-300 overflow-hidden shadow-2xl shadow-purple-500/25"
            >
              <div className="absolute inset-0 bg-gradient-to-r from-white/20 to-transparent transform -translate-x-full group-hover:translate-x-full transition-transform duration-500" />
              <span className="relative z-10 flex items-center">
                <span className="mr-3 text-2xl">🤖</span>
                Mint Your Agent
              </span>
              <div className="absolute -top-2 -right-2 w-6 h-6 bg-yellow-400 rounded-full flex items-center justify-center">
                <span className="text-xs">✨</span>
              </div>
            </motion.button>
          </Link>

          <Link href="/ai-console">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="group px-12 py-6 border-2 border-purple-500/50 hover:border-purple-400 hover:bg-purple-500/10 rounded-2xl font-bold text-xl transition-all duration-300 backdrop-blur-sm shadow-xl shadow-purple-500/10"
            >
              <span className="group-hover:text-purple-300 transition-colors flex items-center">
                <span className="mr-3 text-2xl">🚀</span>
                Launch MVP Demo
              </span>
            </motion.button>
          </Link>
        </motion.div>


        {/* Scroll Indicator */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.8 }}
          className="flex flex-col items-center"
        >
          <span className="text-sm text-gray-400 mb-2">Scroll to explore</span>
          <div className="w-6 h-10 border-2 border-gray-400 rounded-full flex justify-center">
            <motion.div
              animate={{ y: [0, 12, 0] }}
              transition={{ duration: 2, repeat: Infinity }}
              className="w-1 h-3 bg-gray-400 rounded-full mt-2"
            />
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default HeroSection;