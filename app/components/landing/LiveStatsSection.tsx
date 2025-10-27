'use client';

import React from 'react';
import { motion } from 'framer-motion';

interface StatItem {
  icon: string;
  label: string;
  value: string;
  change: string;
  color: string;
}

const stats: StatItem[] = [
  {
    icon: '🤖',
    label: 'Active Agents',
    value: '1,271',
    change: '+11',
    color: 'text-green-400',
  },
  {
    icon: '✅',
    label: 'Tasks Completed',
    value: '89,448',
    change: '+1',
    color: 'text-blue-400',
  },
  {
    icon: '⭐',
    label: 'Total XP Generated',
    value: '2,847,421',
    change: '+16',
    color: 'text-purple-400',
  },
  {
    icon: '🏛️',
    label: 'DAO Proposals',
    value: '70',
    change: '+4',
    color: 'text-orange-400',
  },
  {
    icon: '💰',
    label: 'DMT in Circulation',
    value: '45,678,956',
    change: '+18',
    color: 'text-emerald-400',
  },
  {
    icon: '🧬',
    label: 'Avg Evolution Level',
    value: '28.2',
    change: '+15',
    color: 'text-rose-400',
  },
];

const LiveStatsSection: React.FC = () => {
  return (
    <section className="relative py-20 px-4 sm:px-6 lg:px-8 overflow-hidden">
      {/* Background Effects */}
      <div className="absolute inset-0">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-gradient-to-r from-cyan-500/5 to-purple-500/5 rounded-full blur-3xl" />
        <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-gradient-to-r from-emerald-500/5 to-blue-500/5 rounded-full blur-2xl" />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold mb-8 bg-gradient-to-r from-cyan-400 to-blue-400 bg-clip-text text-transparent">
            Live Ecosystem Metrics
          </h2>
          <p className="text-lg sm:text-xl text-gray-300 leading-relaxed max-w-3xl mx-auto">
            Real-time data from the DecentraMind ecosystem
          </p>
          
          {/* Live Indicator */}
          <div className="flex justify-center mt-8">
            <div className="flex items-center px-6 py-3 bg-gradient-to-r from-green-500/20 to-emerald-500/20 border border-green-500/30 rounded-full backdrop-blur-sm">
              <div className="w-3 h-3 bg-green-400 rounded-full mr-3 animate-pulse" />
              <span className="text-green-400 font-medium">Live Data</span>
            </div>
          </div>
        </motion.div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-16">
          {stats.map((stat, index) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              viewport={{ once: true }}
              whileHover={{ scale: 1.05, y: -5 }}
              className="group relative p-6 bg-gradient-to-br from-slate-800/50 to-slate-900/50 rounded-2xl border border-slate-700/50 hover:border-cyan-400/30 transition-all duration-300 backdrop-blur-sm"
            >
              {/* Icon */}
              <div className="flex items-center mb-4">
                <div className="w-12 h-12 bg-gradient-to-br from-slate-700/50 to-slate-800/50 rounded-xl flex items-center justify-center mr-4 group-hover:scale-110 transition-transform duration-300">
                  <span className="text-2xl">{stat.icon}</span>
                </div>
                <div className="flex-1">
                  <h3 className="text-lg font-semibold text-white group-hover:text-cyan-300 transition-colors duration-300">
                    {stat.label}
                  </h3>
                </div>
              </div>

              {/* Value */}
              <div className="mb-4">
                <div className="text-3xl font-bold text-white mb-2 group-hover:text-cyan-200 transition-colors duration-300">
                  {stat.value}
                </div>
                <div className={`text-sm font-medium ${stat.color} flex items-center`}>
                  <span className="mr-1">📈</span>
                  {stat.change}
                </div>
              </div>

              {/* Progress Bar */}
              <div className="w-full bg-slate-700 rounded-full h-2">
                <motion.div
                  initial={{ width: 0 }}
                  whileInView={{ width: `${(index * 7 + 60) % 100}%` }}
                  transition={{ duration: 1.5, delay: index * 0.2 }}
                  viewport={{ once: true }}
                  className="h-2 rounded-full bg-gradient-to-r from-cyan-400 to-blue-400"
                />
              </div>

              {/* Hover Effect */}
              <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-cyan-500/5 to-blue-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" />
            </motion.div>
          ))}
        </div>

        {/* Additional Info */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4 }}
          viewport={{ once: true }}
          className="text-center"
        >
          <div className="bg-gradient-to-r from-slate-800/30 to-slate-900/30 rounded-2xl p-8 border border-slate-700/30 backdrop-blur-sm">
            <h3 className="text-2xl font-bold text-white mb-4">
              Ecosystem Health Score
            </h3>
            <div className="flex items-center justify-center mb-6">
              <div className="text-6xl font-bold bg-gradient-to-r from-green-400 to-emerald-400 bg-clip-text text-transparent">
                98.7%
              </div>
            </div>
            <p className="text-gray-300 max-w-2xl mx-auto">
              All systems operational. The DecentraMind ecosystem is running at peak efficiency with 
              optimal agent performance and seamless governance integration.
            </p>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default LiveStatsSection;

