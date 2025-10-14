'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import AIConsoleLayout from '../components/ai-console/AIConsoleLayout';
import AgentXPBar from '../components/ai-console/AgentXPBar';
import AgentTaskLog from '../components/ai-console/AgentTaskLog';
import InsightsPanel from '../components/ai-console/InsightsPanel';
import AgentSwitcher from '../components/ai-console/AgentSwitcher';
import AgentQuickActions from '../components/ai-console/AgentQuickActions';
import MoodTracker from '../components/ai-console/MoodTracker';
import CustomAgentCreator from '../components/ai-console/CustomAgentCreator';
import { getAgentById } from '../utils/careAgentData';

const AIConsolePage = () => {
  const [activeTab, setActiveTab] = useState('finance');
  const [selectedAgent, setSelectedAgent] = useState('finance-agent');

  const agent = getAgentById(selectedAgent);

  const handleTabChange = (tab: string) => {
    setActiveTab(tab);
    // Map tab names to agent IDs
    const agentIdMap: { [key: string]: string } = {
      'finance': 'finance-agent',
      'wellness': 'wellness-agent', 
      'alpha': 'alpha-agent',
      'custom': 'custom-agent'
    };
    setSelectedAgent(agentIdMap[tab] || 'finance-agent');
  };

  const renderTabContent = () => {
    switch (activeTab) {
      case 'finance':
        return (
          <div className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <div className="lg:col-span-2">
                <AgentTaskLog agentId="finance-agent" />
              </div>
              <div>
                <InsightsPanel agentId="finance-agent" />
              </div>
            </div>
            <AgentXPBar agentId="finance-agent" />
          </div>
        );
      
      case 'wellness':
        return (
          <div className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <div className="lg:col-span-2">
                <AgentTaskLog agentId="wellness-agent" />
                <div className="mt-6">
                  <MoodTracker />
                </div>
              </div>
              <div>
                <InsightsPanel agentId="wellness-agent" />
              </div>
            </div>
            <AgentXPBar agentId="wellness-agent" />
          </div>
        );
      
      case 'alpha':
        return (
          <div className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <div className="lg:col-span-2">
                <AgentTaskLog agentId="alpha-agent" />
              </div>
              <div>
                <InsightsPanel agentId="alpha-agent" />
              </div>
            </div>
            <AgentXPBar agentId="alpha-agent" />
          </div>
        );
      
      case 'custom':
        return (
          <div className="space-y-6">
            <CustomAgentCreator />
          </div>
        );
      
      default:
        return null;
    }
  };

  return (
    <AIConsoleLayout activeTab={activeTab} onTabChange={handleTabChange}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Agent Switcher */}
        <div className="mb-8">
          <AgentSwitcher 
            selectedAgent={selectedAgent} 
            onAgentChange={setSelectedAgent}
          />
        </div>

        {/* Quick Actions */}
        <div className="mb-8">
          <AgentQuickActions agentId={selectedAgent} />
        </div>

        {/* Tab Content */}
        {renderTabContent()}
      </div>
    </AIConsoleLayout>
  );
};

export default AIConsolePage;
