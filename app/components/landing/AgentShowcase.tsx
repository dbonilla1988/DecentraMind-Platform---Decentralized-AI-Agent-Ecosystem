'use client';

import React from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';
import { getAgentAvatarUrl } from '@/utils/avatarUtils';

interface Agent {
  agentId: string;
  icon: string;
  name: string;
  description: string;
  price: string;
  features: string[];
  color: string;
  level: number;
  did?: string; // DID for Storacha gravatar
}

const agents: Agent[] = [
  {
    agentId: 'agent-cfo',
    icon: '🧠',
    name: 'Autonomous CFO',
    description: 'Treasury, forecasting, governance integration, and token modeling.',
    price: '5 DMT',
    features: ['Treasury Forecasting', 'Token Modeling', 'Governance Analysis', 'Risk Assessment'],
    color: 'purple',
    level: 85,
    did: 'did:key:z6MknwpAmMmVTQMapEYEj5zyPhadGXRZ5KBfewN5JyYizmoC',
  },
  {
    agentId: 'agent-care',
    icon: '❤️',
    name: 'Care Orchestrator',
    description: 'Coordinates healthcare flows, provider dashboards, and HIPAA-compliant data access.',
    price: '8 DMT',
    features: ['Health Monitoring', 'Provider Coordination', 'HIPAA Compliance', 'Patient Analytics'],
    color: 'emerald',
    level: 92,
    did: 'did:key:z6MkhM38Q4gRRYcCL4WH4CE77LaBg9biEDedTTHA32Vg1iAv',
  },
  {
    agentId: 'agent-crypto',
    icon: '📈',
    name: 'Crypto Alpha Assistant',
    description: 'Tracks alpha, evaluates protocols, and submits DAO voting proposals.',
    price: '6 DMT',
    features: ['Alpha Tracking', 'Protocol Analysis', 'DAO Proposals', 'Market Intelligence'],
    color: 'blue',
    level: 78,
    did: 'did:key:z6Mkf8Q4gRRYcCL4WH4CE77LaBg9biEDedTTHA32Vg1iAv',
  },
];

const AgentShowcase: React.FC = () => {
  const getColorClasses = (color: string) => {
    const colorMap = {
      purple: {
        gradient: 'from-purple-500/20 to-purple-600/20',
        border: 'border-purple-500/30',
        hoverBorder: 'hover:border-purple-400/50',
        button: 'from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700',
        shadow: 'shadow-purple-500/20',
        text: 'text-purple-300',
      },
      emerald: {
        gradient: 'from-emerald-500/20 to-emerald-600/20',
        border: 'border-emerald-500/30',
        hoverBorder: 'hover:border-emerald-400/50',
        button: 'from-emerald-600 to-green-600 hover:from-emerald-700 hover:to-green-700',
        shadow: 'shadow-emerald-500/20',
        text: 'text-emerald-300',
      },
      blue: {
        gradient: 'from-blue-500/20 to-blue-600/20',
        border: 'border-blue-500/30',
        hoverBorder: 'hover:border-blue-400/50',
        button: 'from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700',
        shadow: 'shadow-blue-500/20',
        text: 'text-blue-300',
      },
    };
    return colorMap[color as keyof typeof colorMap] || colorMap.purple;
  };

  return (
    <section className="relative py-20 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl sm:text-5xl lg:text-6xl font-bold mb-8 bg-gradient-to-r from-green-400 to-cyan-400 bg-clip-text text-transparent">
            A Modular, Intelligent Stack
          </h2>
          <p className="text-xl text-gray-300 max-w-3xl mx-auto leading-relaxed">
            Three specialized AI agents designed to revolutionize how we interact with technology
          </p>
        </motion.div>

        {/* Agent Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {agents.map((agent, index) => {
            const colors = getColorClasses(agent.color);
            
            return (
              <motion.div
                key={agent.name}
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.2 }}
                viewport={{ once: true }}
                whileHover={{ scale: 1.02, y: -10 }}
                className="group relative p-8 bg-gradient-to-br from-slate-800/50 to-slate-900/50 rounded-3xl border border-slate-700/50 hover:border-purple-500/50 transition-all duration-500 hover:shadow-2xl backdrop-blur-sm"
              >
                {/* Level Indicator */}
                <div className="absolute -top-4 -right-4 w-16 h-16">
                  <svg className="w-16 h-16 transform -rotate-90" viewBox="0 0 64 64">
                    <circle
                      cx="32"
                      cy="32"
                      r="28"
                      stroke="rgba(255, 255, 255, 0.1)"
                      strokeWidth="4"
                      fill="none"
                    />
                    <circle
                      cx="32"
                      cy="32"
                      r="28"
                      stroke="url(#gradient)"
                      strokeWidth="4"
                      fill="none"
                      strokeLinecap="round"
                      strokeDasharray={`${(agent.level / 100) * 175.93} 175.93`}
                      strokeDashoffset="0"
                    />
                    <defs>
                      <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="100%">
                        <stop offset="0%" stopColor="#8b5cf6" />
                        <stop offset="100%" stopColor="#06b6d4" />
                      </linearGradient>
                    </defs>
                  </svg>
                  <div className="absolute inset-0 flex items-center justify-center">
                    <span className="text-xs font-bold text-purple-400">{agent.level}</span>
                  </div>
                </div>

                {/* Agent Avatar */}
                <div className="mb-6 group-hover:scale-110 transition-transform duration-500">
                  <img
                    src={agent.did ? `https://gravatar.storacha.network/avatar/${agent.did}` : getAgentAvatarUrl({ id: agent.agentId, name: agent.name })}
                    alt={agent.name}
                    className="w-20 h-20 rounded-full border-4 border-gradient shadow-md mb-2"
                    onError={(e) => {
                      // Fallback to existing avatar system if Storacha fails
                      if (agent.did) {
                        e.currentTarget.src = getAgentAvatarUrl({ id: agent.agentId, name: agent.name });
                      }
                    }}
                  />
                </div>

                {/* Agent Info */}
                <h3 className="text-3xl font-bold mb-4 text-white group-hover:text-purple-300 transition-colors duration-300">
                  {agent.name}
                </h3>
                <p className="text-gray-300 mb-6 leading-relaxed group-hover:text-gray-200 transition-colors duration-300">
                  {agent.description}
                </p>

                {/* Price */}
                <div className="mb-6">
                  <div className="text-4xl font-bold text-purple-400 mb-2">
                    {agent.price}
                  </div>
                  <div className="text-sm text-gray-400">Starting Price</div>
                </div>

                {/* Features */}
                <div className="space-y-3 mb-8">
                  {agent.features.map((feature, featureIndex) => (
                    <motion.div
                      key={feature}
                      initial={{ opacity: 0, x: -20 }}
                      whileInView={{ opacity: 1, x: 0 }}
                      transition={{ duration: 0.4, delay: featureIndex * 0.1 }}
                      viewport={{ once: true }}
                      className="flex items-center text-sm text-gray-400 group-hover:text-gray-300 transition-colors duration-300"
                    >
                      <span className="text-green-400 mr-3">✓</span>
                      {feature}
                    </motion.div>
                  ))}
                </div>

                {/* Mint Button */}
                <Link href="/agents">
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className={`w-full py-4 bg-gradient-to-r ${colors.button} rounded-xl font-semibold transition-all duration-300 transform group-hover:scale-105 relative overflow-hidden`}
                  >
                    <div className="absolute inset-0 bg-gradient-to-r from-white/20 to-transparent transform -translate-x-full group-hover:translate-x-full transition-transform duration-500" />
                    <span className="relative z-10">Mint {agent.name}</span>
                  </motion.button>
                </Link>

                {/* Hover Effect Overlay */}
                <div className="absolute inset-0 rounded-3xl bg-gradient-to-r from-purple-500/10 to-blue-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />
              </motion.div>
            );
          })}
        </div>

        {/* Sub-Agents Highlight */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4 }}
          viewport={{ once: true }}
          className="mt-16"
        >
          <div className="text-center mb-12">
            <h3 className="text-3xl font-bold text-white mb-4">🔧 Sub-Agents Available</h3>
            <p className="text-lg text-gray-400 max-w-2xl mx-auto">
              Extend your master agents with specialized sub-agents for enhanced capabilities
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
            {[
              { name: 'Vitals Tracker', icon: '📊', unlock: 'TokenUnlock', cost: '25 DMT', color: 'emerald' },
              { name: 'Cold Plunge Coach', icon: '🧊', unlock: 'Subscription', cost: '20 DMT/mo', color: 'blue' },
              { name: 'Meditation Guide', icon: '🧘', unlock: 'NFT', cost: '150 DMT', color: 'purple' },
              { name: 'Sleep AI', icon: '😴', unlock: 'TokenUnlock', cost: '3000 DMT', color: 'indigo' },
              { name: 'Nutrition Coach', icon: '🥗', unlock: 'Subscription', cost: '30 DMT/mo', color: 'green' },
              { name: 'Fitness Tracker', icon: '💪', unlock: 'TokenUnlock', cost: '4000 DMT', color: 'orange' }
            ].map((subAgent, index) => (
              <motion.div
                key={subAgent.name}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                viewport={{ once: true }}
                className="bg-slate-800/50 backdrop-blur-sm rounded-xl p-6 border border-slate-700/30 hover:border-slate-600/50 transition-all duration-300"
              >
                <div className="text-center">
                  <div className="text-4xl mb-3">{subAgent.icon}</div>
                  <h4 className="text-lg font-semibold text-white mb-2">{subAgent.name}</h4>
                  <div className={`inline-block px-3 py-1 rounded-full text-xs font-medium mb-3 ${
                    subAgent.unlock === 'NFT' ? 'bg-purple-500/20 text-purple-400' :
                    subAgent.unlock === 'Subscription' ? 'bg-blue-500/20 text-blue-400' :
                    'bg-emerald-500/20 text-emerald-400'
                  }`}>
                    {subAgent.unlock}
                  </div>
                  <p className="text-gray-400 text-sm">{subAgent.cost}</p>
                </div>
              </motion.div>
            ))}
          </div>
          
          <div className="text-center">
            <Link href="/agents/sub-agents">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="px-8 py-4 bg-gradient-to-r from-emerald-500 to-green-500 hover:from-emerald-600 hover:to-green-600 rounded-xl font-semibold text-lg text-white transition-all duration-300 shadow-lg hover:shadow-emerald-500/25"
              >
                🔧 Explore All Sub-Agents
              </motion.button>
            </Link>
          </div>
        </motion.div>

        {/* Bottom CTA */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.6 }}
          viewport={{ once: true }}
          className="text-center mt-16"
        >
          <div className="bg-gradient-to-r from-slate-800/30 to-slate-900/30 rounded-2xl p-8 border border-slate-700/30 backdrop-blur-sm">
            <h3 className="text-2xl font-bold text-white mb-4">
              Ready to Build Your Agent Army?
            </h3>
            <p className="text-gray-300 mb-6 max-w-2xl mx-auto">
              Each agent specializes in different domains, creating a comprehensive ecosystem of AI intelligence.
            </p>
            <Link href="/agents">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="px-8 py-4 bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 rounded-xl font-semibold transition-all duration-300"
              >
                Explore All Agents
              </motion.button>
            </Link>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default AgentShowcase;
