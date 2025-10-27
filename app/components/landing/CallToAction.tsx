'use client';

import React from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';

const CallToAction: React.FC = () => {
  return (
    <section className="relative py-20 px-4 sm:px-6 lg:px-8 overflow-hidden">
      {/* Background Effects */}
      <div className="absolute inset-0">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-gradient-to-r from-purple-500/10 to-pink-500/10 rounded-full blur-3xl" />
        <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-gradient-to-r from-cyan-500/10 to-blue-500/10 rounded-full blur-2xl" />
        
        {/* Floating Particles */}
        {[...Array(15)].map((_, i) => {
          // Use deterministic positioning based on index to avoid hydration mismatch
          const positions = [
            { left: 19.2, top: 69.5 }, { left: 81.9, top: 85.1 }, { left: 53.6, top: 57.8 },
            { left: 55.1, top: 67.7 }, { left: 48.7, top: 42.8 }, { left: 37.4, top: 77.6 },
            { left: 86.1, top: 66.6 }, { left: 16.1, top: 49.6 }, { left: 5.5, top: 24.6 },
            { left: 15.3, top: 87.5 }, { left: 9.7, top: 33.6 }, { left: 92.4, top: 20.0 },
            { left: 51.2, top: 91.7 }, { left: 69.1, top: 97.7 }, { left: 44.1, top: 43.0 }
          ];
          const pos = positions[i] || { left: 50, top: 50 };
          
          return (
            <motion.div
              key={i}
              className="absolute w-2 h-2 bg-gradient-to-r from-purple-400 to-cyan-400 rounded-full opacity-60"
              style={{
                left: `${pos.left}%`,
                top: `${pos.top}%`,
              }}
              animate={{
                y: [0, -20, 0],
                opacity: [0.6, 1, 0.6],
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

      <div className="relative z-10 max-w-4xl mx-auto text-center">
        {/* Main CTA */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
        >
          <h2 className="text-4xl sm:text-5xl lg:text-6xl font-bold mb-8 bg-gradient-to-r from-white via-purple-200 to-blue-200 bg-clip-text text-transparent">
            Join the Collective
          </h2>
          <p className="text-xl text-gray-300 mb-12 leading-relaxed max-w-3xl mx-auto">
            Be part of the future of autonomous AI agents and decentralized intelligence.
          </p>
        </motion.div>

        {/* CTA Buttons */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          viewport={{ once: true }}
          className="flex flex-col sm:flex-row gap-6 justify-center items-center mb-16"
        >
          <Link href="/airdrop">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="group relative px-10 py-5 bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 rounded-2xl font-semibold text-lg transition-all duration-300 overflow-hidden"
            >
              <div className="absolute inset-0 bg-gradient-to-r from-white/20 to-transparent transform -translate-x-full group-hover:translate-x-full transition-transform duration-500" />
              <span className="relative z-10">Join Airdrop</span>
              <div className="absolute -top-2 -right-2 w-4 h-4 bg-yellow-400 rounded-full" />
            </motion.button>
          </Link>

          <Link href="/agents/sub-agents">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="group px-10 py-5 border-2 border-emerald-500/50 hover:border-emerald-400 hover:bg-emerald-500/10 rounded-2xl font-semibold text-lg transition-all duration-300 backdrop-blur-sm"
            >
              <span className="group-hover:text-emerald-300 transition-colors">🔧 Explore Sub-Agents</span>
            </motion.button>
          </Link>

          <Link href="/marketplace">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="group px-10 py-5 border-2 border-purple-500/50 hover:border-purple-400 hover:bg-purple-500/10 rounded-2xl font-semibold text-lg transition-all duration-300 backdrop-blur-sm"
            >
              <span className="group-hover:text-purple-300 transition-colors">Explore Marketplace</span>
            </motion.button>
          </Link>
        </motion.div>

        {/* Social Links */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4 }}
          viewport={{ once: true }}
          className="flex justify-center space-x-6 mb-16"
        >
          {[
            { icon: '💬', label: 'Discord', href: '/community' },
            { icon: '🐦', label: 'Twitter', href: '/community' },
            { icon: '🐙', label: 'GitHub', href: '/docs' },
            { icon: '📧', label: 'Newsletter', href: '/community' },
          ].map((social, index) => (
            <Link key={social.label} href={social.href}>
              <motion.button
                whileHover={{ scale: 1.1, y: -5 }}
                whileTap={{ scale: 0.9 }}
                className="p-4 rounded-xl bg-slate-800/50 border border-slate-700/50 hover:border-purple-500/50 transition-all duration-300 hover:text-purple-400 backdrop-blur-sm"
              >
                <span className="text-2xl">{social.icon}</span>
              </motion.button>
            </Link>
          ))}
        </motion.div>

        {/* Animated Element */}
        <motion.div
          initial={{ opacity: 0, scale: 0 }}
          whileInView={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8, delay: 0.6 }}
          viewport={{ once: true }}
          className="flex justify-center"
        >
          <div className="relative">
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
              className="w-24 h-24 border-2 border-purple-500/50 rounded-full flex items-center justify-center backdrop-blur-sm"
            >
              <span className="text-3xl">🌀</span>
            </motion.div>
            <div className="absolute inset-0 border border-purple-500/30 rounded-full animate-pulse" />
            <div className="absolute inset-0 border border-purple-500/30 rounded-full animate-pulse" style={{ animationDelay: '0.5s' }} />
            <div className="absolute inset-0 border border-purple-500/30 rounded-full animate-pulse" style={{ animationDelay: '1s' }} />
          </div>
        </motion.div>

        {/* Status Indicator */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.8 }}
          viewport={{ once: true }}
          className="mt-8"
        >
          <div className="inline-flex items-center px-4 py-2 bg-green-500/20 border border-green-500/30 rounded-full backdrop-blur-sm">
            <div className="w-2 h-2 bg-green-400 rounded-full mr-3 animate-pulse" />
            <span className="text-green-400 font-medium text-sm">🚀 Now Live on Devnet</span>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default CallToAction;
