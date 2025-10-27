'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import AgentCard from '../cards/AgentCard';
import AgentModal from '../modals/AgentModal';
import { agentMetadata, AgentMetadata } from '../../../data/agentMetadata';

interface CareOrchestratorSubAgentsProps {
  className?: string;
}

const CareOrchestratorSubAgents: React.FC<CareOrchestratorSubAgentsProps> = ({ 
  className = '' 
}) => {
  const [selectedAgent, setSelectedAgent] = useState<AgentMetadata | null>(null);

  const handleMint = (agentType: string) => {
    console.log(`Minting NFT for ${agentType}`);
    // TODO: Implement NFT minting logic
  };

  const handleSubscribe = (agentType: string) => {
    console.log(`Starting subscription for ${agentType}`);
    // TODO: Implement subscription logic
  };

  const handleUnlock = (agentType: string) => {
    console.log(`Unlocking agent: ${agentType}`);
    // TODO: Implement token unlock logic
  };

  return (
    <div className={`space-y-6 ${className}`}>
      {/* Header */}
      <div className="text-center mb-8">
        <h2 className="text-3xl font-bold text-white mb-4">Care Orchestrator Sub-Agents</h2>
        <p className="text-gray-400 max-w-2xl mx-auto">
          Specialized health and wellness agents that extend your Care Orchestrator's capabilities
        </p>
      </div>

      {/* Sub-Agents Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {agentMetadata.map((agent, index) => (
          <motion.div
            key={agent.id}
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
          >
            <AgentCard
              agentData={agent}
              onClick={() => setSelectedAgent(agent)}
            />
          </motion.div>
        ))}
      </div>

      {/* Payment Model Legend */}
      <div className="mt-8 p-6 bg-slate-800/50 backdrop-blur-sm rounded-xl border border-slate-700/30">
        <h3 className="text-lg font-semibold text-white mb-4">Payment Models</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 bg-gradient-to-r from-purple-500 to-purple-600 rounded-lg flex items-center justify-center">
              <span className="text-white text-sm">🎨</span>
            </div>
            <div>
              <div className="text-white font-medium">NFT Mint</div>
              <div className="text-gray-400 text-sm">One-time purchase</div>
            </div>
          </div>
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-blue-600 rounded-lg flex items-center justify-center">
              <span className="text-white text-sm">🔄</span>
            </div>
            <div>
              <div className="text-white font-medium">Subscription</div>
              <div className="text-gray-400 text-sm">Monthly recurring</div>
            </div>
          </div>
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 bg-gradient-to-r from-emerald-500 to-emerald-600 rounded-lg flex items-center justify-center">
              <span className="text-white text-sm">🔓</span>
            </div>
            <div>
              <div className="text-white font-medium">Token Unlock</div>
              <div className="text-gray-400 text-sm">Hold tokens to access</div>
            </div>
          </div>
        </div>
      </div>

      {/* Agent Metadata Info */}
      <div className="mt-6 p-4 bg-slate-800/30 backdrop-blur-sm rounded-lg border border-slate-700/20">
        <h4 className="text-sm font-semibold text-white mb-2">📊 Agent Registry Status</h4>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-xs">
          <div>
            <div className="text-gray-400">Total Agents:</div>
            <div className="text-white font-medium">{agentMetadata.length}</div>
          </div>
          <div>
            <div className="text-gray-400">Available:</div>
            <div className="text-green-400 font-medium">{agentMetadata.filter(a => a.status === 'available').length}</div>
          </div>
          <div>
            <div className="text-gray-400">Coming Soon:</div>
            <div className="text-yellow-400 font-medium">{agentMetadata.filter(a => a.status === 'coming-soon').length}</div>
          </div>
          <div>
            <div className="text-gray-400">Categories:</div>
            <div className="text-blue-400 font-medium">{new Set(agentMetadata.map(a => a.category)).size}</div>
          </div>
        </div>
      </div>

      {/* Render Modal */}
      {selectedAgent && (
        <AgentModal
          agentData={selectedAgent}
          isOpen={!!selectedAgent}
          onClose={() => setSelectedAgent(null)}
        />
      )}
    </div>
  );
};

export default CareOrchestratorSubAgents;