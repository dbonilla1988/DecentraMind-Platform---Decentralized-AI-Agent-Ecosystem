'use client';

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { AgentMetadata } from '../../data/agentMetadata';

interface AdminAgentFormData {
  id: string;
  name: string;
  description: string;
  category: string;
  unlockType: 'NFT' | 'Subscription' | 'TokenUnlock';
  cost: number;
  levelRequired: number;
  status: 'available' | 'coming-soon';
  icon: string;
  features: string[];
  metadataURI?: string;
}

const AdminAgentsPage: React.FC = () => {
  const [agents, setAgents] = useState<AgentMetadata[]>([]);
  const [selectedAgent, setSelectedAgent] = useState<AgentMetadata | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [isCreating, setIsCreating] = useState(false);
  const [formData, setFormData] = useState<AdminAgentFormData>({
    id: '',
    name: '',
    description: '',
    category: '',
    unlockType: 'NFT',
    cost: 0,
    levelRequired: 1,
    status: 'available',
    icon: '🤖',
    features: [],
    metadataURI: ''
  });

  // Load agents on mount
  useEffect(() => {
    // In production, this would fetch from Firebase/Supabase
    setAgents(agentMetadata);
  }, []);

  const handleCreateAgent = () => {
    setIsCreating(true);
    setIsEditing(false);
    setSelectedAgent(null);
    setFormData({
      id: '',
      name: '',
      description: '',
      category: '',
      unlockType: 'NFT',
      cost: 0,
      levelRequired: 1,
      status: 'available',
      icon: '🤖',
      features: [],
      metadataURI: ''
    });
  };

  const handleEditAgent = (agent: AgentMetadata) => {
    setIsEditing(true);
    setIsCreating(false);
    setSelectedAgent(agent);
    setFormData({
      id: agent.id,
      name: agent.name,
      description: agent.description,
      category: agent.category,
      unlockType: agent.unlockType,
      cost: agent.cost,
      levelRequired: agent.levelRequired,
      status: agent.status,
      icon: agent.icon,
      features: [...agent.features],
      metadataURI: agent.metadataURI || ''
    });
  };

  const handleSaveAgent = async () => {
    try {
      // In production, this would save to Firebase/Supabase
      if (isCreating) {
        // Create new agent
        const newAgent: AgentMetadata = {
          ...formData,
          features: formData.features.filter(f => f.trim() !== '')
        };
        setAgents(prev => [...prev, newAgent]);
      } else if (isEditing && selectedAgent) {
        // Update existing agent
        const updatedAgent: AgentMetadata = {
          ...formData,
          features: formData.features.filter(f => f.trim() !== '')
        };
        setAgents(prev => prev.map(agent => 
          agent.id === selectedAgent.id ? updatedAgent : agent
        ));
      }
      
      setIsCreating(false);
      setIsEditing(false);
      setSelectedAgent(null);
    } catch (error) {
      console.error('Error saving agent:', error);
      alert('Failed to save agent');
    }
  };

  const handleDeleteAgent = async (agentId: string) => {
    if (confirm('Are you sure you want to delete this agent?')) {
      try {
        // In production, this would delete from Firebase/Supabase
        setAgents(prev => prev.filter(agent => agent.id !== agentId));
      } catch (error) {
        console.error('Error deleting agent:', error);
        alert('Failed to delete agent');
      }
    }
  };

  const addFeature = () => {
    setFormData(prev => ({
      ...prev,
      features: [...prev.features, '']
    }));
  };

  const updateFeature = (index: number, value: string) => {
    setFormData(prev => ({
      ...prev,
      features: prev.features.map((feature, i) => i === index ? value : feature)
    }));
  };

  const removeFeature = (index: number) => {
    setFormData(prev => ({
      ...prev,
      features: prev.features.filter((_, i) => i !== index)
    }));
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-white mb-4">Agent Administration</h1>
          <p className="text-gray-400 max-w-2xl mx-auto">
            Manage agents, add new capabilities, and configure unlock requirements
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Agent List */}
          <div className="lg:col-span-1">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              className="bg-slate-800/50 backdrop-blur-sm rounded-xl p-6 border border-slate-700/30"
            >
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-bold text-white">Agents ({agents.length})</h2>
                <button
                  onClick={handleCreateAgent}
                  className="px-4 py-2 bg-emerald-500 hover:bg-emerald-600 text-white rounded-lg transition-all duration-300"
                >
                  + New Agent
                </button>
              </div>

              <div className="space-y-2">
                {agents.map((agent, index) => (
                  <motion.div
                    key={agent.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.05 }}
                    className={`p-3 rounded-lg cursor-pointer transition-all duration-300 ${
                      selectedAgent?.id === agent.id
                        ? 'bg-emerald-500/20 border border-emerald-500/30'
                        : 'bg-slate-700/50 hover:bg-slate-700/70'
                    }`}
                    onClick={() => handleEditAgent(agent)}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        <div className="text-2xl">{agent.icon}</div>
                        <div>
                          <div className="text-white font-medium">{agent.name}</div>
                          <div className="text-gray-400 text-sm">{agent.category}</div>
                        </div>
                      </div>
                      <div className="flex items-center space-x-2">
                        <span className={`px-2 py-1 rounded-full text-xs ${
                          agent.status === 'available' 
                            ? 'bg-green-500/20 text-green-400' 
                            : 'bg-yellow-500/20 text-yellow-400'
                        }`}>
                          {agent.status}
                        </span>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            handleDeleteAgent(agent.id);
                          }}
                          className="text-red-400 hover:text-red-300 transition-colors"
                        >
                          🗑️
                        </button>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          </div>

          {/* Agent Form */}
          <div className="lg:col-span-2">
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.1 }}
              className="bg-slate-800/50 backdrop-blur-sm rounded-xl p-6 border border-slate-700/30"
            >
              <h2 className="text-xl font-bold text-white mb-6">
                {isCreating ? 'Create New Agent' : isEditing ? 'Edit Agent' : 'Select an Agent'}
              </h2>

              {selectedAgent || isCreating ? (
                <div className="space-y-6">
                  {/* Basic Info */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-2">ID</label>
                      <input
                        type="text"
                        value={formData.id}
                        onChange={(e) => setFormData(prev => ({ ...prev, id: e.target.value }))}
                        className="w-full p-3 bg-slate-700/50 border border-slate-600/30 rounded-lg text-white focus:border-emerald-500/50 focus:outline-none"
                        placeholder="e.g., meditation-guide"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-2">Name</label>
                      <input
                        type="text"
                        value={formData.name}
                        onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                        className="w-full p-3 bg-slate-700/50 border border-slate-600/30 rounded-lg text-white focus:border-emerald-500/50 focus:outline-none"
                        placeholder="e.g., Meditation Guide"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">Description</label>
                    <textarea
                      value={formData.description}
                      onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                      className="w-full p-3 bg-slate-700/50 border border-slate-600/30 rounded-lg text-white focus:border-emerald-500/50 focus:outline-none"
                      rows={3}
                      placeholder="Describe what this agent does..."
                    />
                  </div>

                  {/* Configuration */}
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-2">Category</label>
                      <input
                        type="text"
                        value={formData.category}
                        onChange={(e) => setFormData(prev => ({ ...prev, category: e.target.value }))}
                        className="w-full p-3 bg-slate-700/50 border border-slate-600/30 rounded-lg text-white focus:border-emerald-500/50 focus:outline-none"
                        placeholder="e.g., Wellness"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-2">Unlock Type</label>
                      <select
                        value={formData.unlockType}
                        onChange={(e) => setFormData(prev => ({ ...prev, unlockType: e.target.value as any }))}
                        className="w-full p-3 bg-slate-700/50 border border-slate-600/30 rounded-lg text-white focus:border-emerald-500/50 focus:outline-none"
                      >
                        <option value="NFT">NFT</option>
                        <option value="Subscription">Subscription</option>
                        <option value="TokenUnlock">Token Unlock</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-2">Icon</label>
                      <input
                        type="text"
                        value={formData.icon}
                        onChange={(e) => setFormData(prev => ({ ...prev, icon: e.target.value }))}
                        className="w-full p-3 bg-slate-700/50 border border-slate-600/30 rounded-lg text-white focus:border-emerald-500/50 focus:outline-none"
                        placeholder="🧘"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-2">Cost</label>
                      <input
                        type="number"
                        value={formData.cost}
                        onChange={(e) => setFormData(prev => ({ ...prev, cost: parseInt(e.target.value) || 0 }))}
                        className="w-full p-3 bg-slate-700/50 border border-slate-600/30 rounded-lg text-white focus:border-emerald-500/50 focus:outline-none"
                        placeholder="150"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-2">Level Required</label>
                      <input
                        type="number"
                        value={formData.levelRequired}
                        onChange={(e) => setFormData(prev => ({ ...prev, levelRequired: parseInt(e.target.value) || 1 }))}
                        className="w-full p-3 bg-slate-700/50 border border-slate-600/30 rounded-lg text-white focus:border-emerald-500/50 focus:outline-none"
                        placeholder="1"
                        min="1"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-2">Status</label>
                      <select
                        value={formData.status}
                        onChange={(e) => setFormData(prev => ({ ...prev, status: e.target.value as any }))}
                        className="w-full p-3 bg-slate-700/50 border border-slate-600/30 rounded-lg text-white focus:border-emerald-500/50 focus:outline-none"
                      >
                        <option value="available">Available</option>
                        <option value="coming-soon">Coming Soon</option>
                      </select>
                    </div>
                  </div>

                  {/* Features */}
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">Features</label>
                    <div className="space-y-2">
                      {formData.features.map((feature, index) => (
                        <div key={index} className="flex items-center space-x-2">
                          <input
                            type="text"
                            value={feature}
                            onChange={(e) => updateFeature(index, e.target.value)}
                            className="flex-1 p-3 bg-slate-700/50 border border-slate-600/30 rounded-lg text-white focus:border-emerald-500/50 focus:outline-none"
                            placeholder="Feature description..."
                          />
                          <button
                            onClick={() => removeFeature(index)}
                            className="p-3 text-red-400 hover:text-red-300 transition-colors"
                          >
                            🗑️
                          </button>
                        </div>
                      ))}
                      <button
                        onClick={addFeature}
                        className="w-full p-3 border-2 border-dashed border-slate-600/30 rounded-lg text-gray-400 hover:text-white hover:border-emerald-500/50 transition-all duration-300"
                      >
                        + Add Feature
                      </button>
                    </div>
                  </div>

                  {/* Metadata URI */}
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">Metadata URI</label>
                    <input
                      type="text"
                      value={formData.metadataURI}
                      onChange={(e) => setFormData(prev => ({ ...prev, metadataURI: e.target.value }))}
                      className="w-full p-3 bg-slate-700/50 border border-slate-600/30 rounded-lg text-white focus:border-emerald-500/50 focus:outline-none"
                      placeholder="ipfs://Qm..."
                    />
                  </div>

                  {/* Actions */}
                  <div className="flex space-x-4">
                    <button
                      onClick={handleSaveAgent}
                      className="flex-1 py-3 px-6 bg-emerald-500 hover:bg-emerald-600 text-white rounded-lg font-semibold transition-all duration-300"
                    >
                      {isCreating ? 'Create Agent' : 'Save Changes'}
                    </button>
                    <button
                      onClick={() => {
                        setIsCreating(false);
                        setIsEditing(false);
                        setSelectedAgent(null);
                      }}
                      className="px-6 py-3 bg-slate-700 hover:bg-slate-600 text-white rounded-lg transition-all duration-300"
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              ) : (
                <div className="text-center py-12">
                  <div className="text-6xl mb-4">🤖</div>
                  <div className="text-gray-400">Select an agent to edit or create a new one</div>
                </div>
              )}
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminAgentsPage;
