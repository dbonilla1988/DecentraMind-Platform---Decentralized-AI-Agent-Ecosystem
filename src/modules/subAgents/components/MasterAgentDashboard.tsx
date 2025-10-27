'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useSubAgentAccess, useUserTokenBalance } from '../hooks/useSubAgentAccess';
import SubAgentCard from './SubAgentCard';
import LockedAgentCard from './LockedAgentCard';
import { SubAgent } from '../utils/subAgentTypes';

interface MasterAgentDashboardProps {
  masterAgentId: string;
  masterAgentName: string;
  subAgents: SubAgent[];
  onSubAgentUse?: (subAgent: SubAgent) => void;
  onSubAgentMint?: (subAgent: SubAgent) => void;
  onSubAgentSubscribe?: (subAgent: SubAgent) => void;
  onSubAgentUnlock?: (subAgent: SubAgent) => void;
}

const MasterAgentDashboard: React.FC<MasterAgentDashboardProps> = ({
  masterAgentId,
  masterAgentName,
  subAgents,
  onSubAgentUse,
  onSubAgentMint,
  onSubAgentSubscribe,
  onSubAgentUnlock
}) => {
  const [showOnlyUnlocked, setShowOnlyUnlocked] = useState(false);
  const userTokenBalance = useUserTokenBalance();

  const handleSubAgentUse = (subAgent: SubAgent) => {
    if (onSubAgentUse) {
      onSubAgentUse(subAgent);
    } else {
      console.log(`Using sub-agent: ${subAgent.name}`);
      // Show success toast
      showToast(`Activating ${subAgent.name}...`, 'success');
    }
  };

  const handleSubAgentMint = (subAgent: SubAgent) => {
    if (onSubAgentMint) {
      onSubAgentMint(subAgent);
    } else {
      console.log(`Minting NFT for: ${subAgent.name}`);
      showToast(`Minting ${subAgent.name} NFT...`, 'info');
    }
  };

  const handleSubAgentSubscribe = (subAgent: SubAgent) => {
    if (onSubAgentSubscribe) {
      onSubAgentSubscribe(subAgent);
    } else {
      console.log(`Starting subscription for: ${subAgent.name}`);
      showToast(`Starting ${subAgent.name} subscription...`, 'info');
    }
  };

  const handleSubAgentUnlock = (subAgent: SubAgent) => {
    if (onSubAgentUnlock) {
      onSubAgentUnlock(subAgent);
    } else {
      console.log(`Unlocking: ${subAgent.name}`);
      showToast(`Unlocking ${subAgent.name}...`, 'info');
    }
  };

  const showToast = (message: string, type: 'success' | 'info' | 'error') => {
    // Simple toast implementation - in production would use a proper toast library
    const toast = document.createElement('div');
    toast.className = `fixed top-4 right-4 px-6 py-3 rounded-lg text-white font-medium z-50 ${
      type === 'success' ? 'bg-emerald-500' : 
      type === 'info' ? 'bg-blue-500' : 'bg-red-500'
    }`;
    toast.textContent = message;
    document.body.appendChild(toast);
    
    setTimeout(() => {
      toast.remove();
    }, 3000);
  };

  const filteredSubAgents = subAgents.filter(subAgent => {
    if (!showOnlyUnlocked) return true;
    
    const access = useSubAgentAccess(subAgent.id);
    return access.hasAccess;
  });

  const unlockedCount = subAgents.filter(subAgent => {
    const access = useSubAgentAccess(subAgent.id);
    return access.hasAccess;
  }).length;

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="text-center">
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-3xl font-bold text-white mb-4"
        >
          {masterAgentName} Sub-Agents
        </motion.h2>
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="text-gray-300 max-w-2xl mx-auto"
        >
          Extend your {masterAgentName} with specialized sub-agents. 
          You have access to {unlockedCount} of {subAgents.length} available sub-agents.
        </motion.p>
      </div>

      {/* User Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
        <div className="bg-slate-800/50 backdrop-blur-sm rounded-xl p-4 border border-slate-700/30">
          <div className="text-2xl font-bold text-purple-400">{userTokenBalance.toLocaleString()}</div>
          <div className="text-sm text-gray-400">DMT Balance</div>
        </div>
        <div className="bg-slate-800/50 backdrop-blur-sm rounded-xl p-4 border border-slate-700/30">
          <div className="text-2xl font-bold text-emerald-400">{unlockedCount}</div>
          <div className="text-sm text-gray-400">Unlocked Agents</div>
        </div>
        <div className="bg-slate-800/50 backdrop-blur-sm rounded-xl p-4 border border-slate-700/30">
          <div className="text-2xl font-bold text-blue-400">{subAgents.length - unlockedCount}</div>
          <div className="text-sm text-gray-400">Locked Agents</div>
        </div>
      </div>

      {/* Filter Toggle */}
      <div className="flex justify-center">
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={() => setShowOnlyUnlocked(!showOnlyUnlocked)}
          className={`px-6 py-3 rounded-xl font-semibold transition-all duration-300 ${
            showOnlyUnlocked
              ? 'bg-gradient-to-r from-emerald-500 to-green-500 text-white'
              : 'bg-slate-700/50 text-gray-300 hover:bg-slate-600/50'
          }`}
        >
          {showOnlyUnlocked ? 'Show All Agents' : 'Show Only Unlocked Agents'}
        </motion.button>
      </div>

      {/* Sub-Agents Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredSubAgents.map((subAgent, index) => {
          const access = useSubAgentAccess(subAgent.id);
          
          return (
            <motion.div
              key={subAgent.id}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              {access.hasAccess ? (
                <SubAgentCard
                  subAgent={subAgent}
                  onUse={handleSubAgentUse}
                />
              ) : (
                <LockedAgentCard
                  subAgent={subAgent}
                  accessType={access.accessType}
                  onMint={handleSubAgentMint}
                  onSubscribe={handleSubAgentSubscribe}
                  onUnlock={handleSubAgentUnlock}
                />
              )}
            </motion.div>
          );
        })}
      </div>

      {/* Empty State */}
      {filteredSubAgents.length === 0 && (
        <div className="text-center py-12">
          <div className="text-6xl mb-4">🔒</div>
          <h3 className="text-xl font-semibold text-white mb-2">No Unlocked Agents</h3>
          <p className="text-gray-400">
            You need to unlock agents in this category to see them here.
          </p>
        </div>
      )}
    </div>
  );
};

export default MasterAgentDashboard;
