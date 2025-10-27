'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Thermometer, 
  Clock, 
  Calendar, 
  Plus, 
  Wifi, 
  Edit3, 
  Trash2,
  Zap,
  Droplets,
  Snowflake,
  Heart
} from 'lucide-react';
import { useXPLogging } from '../../hooks/useXPLogging';
import { careAgents, getAgentById } from '../../utils/careAgentData';

interface ColdPlungeLog {
  id: string;
  timestamp: string;
  temperature: number; // in Celsius
  duration: number; // in minutes
  notes?: string;
  source: 'wearable' | 'manual';
}

interface ColdPlungeSyncProps {
  className?: string;
  agentId?: string;
}

const ColdPlungeSync: React.FC<ColdPlungeSyncProps> = ({ className = '', agentId = 'care-orchestrator' }) => {
  const [logs, setLogs] = useState<ColdPlungeLog[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [showManualForm, setShowManualForm] = useState(false);
  const [manualForm, setManualForm] = useState({
    temperature: '',
    duration: '',
    notes: ''
  });
  const [showSuccessMessage, setShowSuccessMessage] = useState(false);
  const { logColdPlungeSession, logTaskCompletion } = useXPLogging();

  // Load logs from localStorage on component mount
  useEffect(() => {
    const savedLogs = localStorage.getItem('coldPlungeLogs');
    if (savedLogs) {
      try {
        setLogs(JSON.parse(savedLogs));
      } catch (error) {
        console.error('Error loading cold plunge logs:', error);
      }
    }
  }, []);

  // Save logs to localStorage whenever logs change
  useEffect(() => {
    localStorage.setItem('coldPlungeLogs', JSON.stringify(logs));
  }, [logs]);

  // Mock wearable sync function
  const syncWithWearable = async () => {
    setIsLoading(true);
    
    // Simulate API call delay
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    // Mock wearable data
    const mockWearableData: ColdPlungeLog[] = [
      {
        id: `wearable_${Date.now()}_1`,
        timestamp: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(), // 2 days ago
        temperature: 8,
        duration: 3,
        notes: 'Morning session - felt energized',
        source: 'wearable'
      },
      {
        id: `wearable_${Date.now()}_2`,
        timestamp: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(), // 1 day ago
        temperature: 6,
        duration: 5,
        notes: 'Evening session - great recovery',
        source: 'wearable'
      },
      {
        id: `wearable_${Date.now()}_3`,
        timestamp: new Date(Date.now() - 6 * 60 * 60 * 1000).toISOString(), // 6 hours ago
        temperature: 4,
        duration: 4,
        notes: 'Post-workout plunge - muscles felt relaxed',
        source: 'wearable'
      }
    ];

    // Add new logs (avoid duplicates by checking timestamps)
    const existingTimestamps = logs.map(log => log.timestamp);
    const newLogs = mockWearableData.filter(log => !existingTimestamps.includes(log.timestamp));
    
    // Log XP for each new wearable session
    newLogs.forEach(log => {
      logColdPlungeSession(log.temperature, log.duration, log.notes);
    });
    
    setLogs(prevLogs => [...newLogs, ...prevLogs]);
    setIsLoading(false);
  };

  // Handle manual log submission
  const handleManualSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!manualForm.temperature || !manualForm.duration) {
      alert('Please fill in temperature and duration');
      return;
    }

    const temperature = parseFloat(manualForm.temperature);
    const duration = parseFloat(manualForm.duration);

    const newLog: ColdPlungeLog = {
      id: `manual_${Date.now()}`,
      timestamp: new Date().toISOString(),
      temperature,
      duration,
      notes: manualForm.notes || undefined,
      source: 'manual'
    };

    // Execute complete task flow for Care Orchestrator
    executeColdPlungeTask(temperature, duration, manualForm.notes);

    setLogs(prevLogs => [newLog, ...prevLogs]);
    setManualForm({ temperature: '', duration: '', notes: '' });
    setShowManualForm(false);
    
    // Show success message
    setShowSuccessMessage(true);
    setTimeout(() => setShowSuccessMessage(false), 3000);
  };

  // Delete a log entry
  const deleteLog = (logId: string) => {
    setLogs(prevLogs => prevLogs.filter(log => log.id !== logId));
  };

  // Complete task execution flow for Care Orchestrator
  const executeColdPlungeTask = (temperature: number, duration: number, notes?: string) => {
    const careAgent = getAgentById('wellness-agent');
    if (!careAgent) return;

    // 1. logTask() → Add to agent history
    const taskId = `cold_plunge_${Date.now()}`;
    const taskDescription = `Cold therapy completed at ${temperature}°C for ${duration} minutes${notes ? ` - ${notes}` : ''}`;
    
    // Update agent's task history in localStorage
    const updatedAgent = {
      ...careAgent,
      recentTasks: [
        {
          id: taskId,
          title: 'Cold Plunge Session',
          description: taskDescription,
          status: 'completed' as const,
          category: 'cold_plunge_session',
          xpReward: 20,
          timestamp: new Date().toISOString(),
          duration: `${duration}m`
        },
        ...careAgent.recentTasks.slice(0, 4) // Keep only 5 most recent
      ],
      tasksCompleted: careAgent.tasksCompleted + 1,
      xp: careAgent.xp + 20,
      totalEarnings: careAgent.totalEarnings + 20
    };

    // Save updated agent data
    const updatedAgents = careAgents.map(agent => 
      agent.id === 'wellness-agent' ? updatedAgent : agent
    );
    localStorage.setItem('care_agents', JSON.stringify(updatedAgents));

    // 2. updateXP() → Add XP to Care Orchestrator
    logColdPlungeSession(temperature, duration, notes);
    logTaskCompletion('wellness-agent', 'Care Orchestrator', 'Cold Plunge Session', 20);

    // 3. addInsight() → Cold therapy health tip
    const insightId = `insight_cold_plunge_${Date.now()}`;
    const coldTherapyInsight = {
      id: insightId,
      title: 'Cold Therapy Benefits',
      description: 'Cold exposure improves circulation and reduces inflammation',
      type: 'tip' as const,
      confidence: 95,
      timestamp: new Date().toISOString(),
      category: 'cold_therapy'
    };

    // Add insight to agent's insights
    const agentWithInsight = {
      ...updatedAgent,
      insights: [coldTherapyInsight, ...updatedAgent.insights.slice(0, 4)] // Keep only 5 most recent
    };

    const finalUpdatedAgents = careAgents.map(agent => 
      agent.id === 'wellness-agent' ? agentWithInsight : agent
    );
    localStorage.setItem('care_agents', JSON.stringify(finalUpdatedAgents));

    console.log('✅ Cold Plunge Task Execution Complete:');
    console.log(`📋 Task logged: ${taskDescription}`);
    console.log(`⭐ XP added: +20 XP to Care Orchestrator`);
    console.log(`💡 Insight added: Cold therapy health tip`);
  };

  // Format timestamp for display
  const formatTimestamp = (timestamp: string) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diffInHours = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60));
    
    if (diffInHours < 1) {
      return 'Just now';
    } else if (diffInHours < 24) {
      return `${diffInHours}h ago`;
    } else {
      const diffInDays = Math.floor(diffInHours / 24);
      return `${diffInDays}d ago`;
    }
  };

  // Get temperature color based on value
  const getTemperatureColor = (temp: number) => {
    if (temp <= 4) return 'text-blue-400';
    if (temp <= 8) return 'text-cyan-400';
    if (temp <= 12) return 'text-teal-400';
    return 'text-green-400';
  };

  // Get temperature icon
  const getTemperatureIcon = (temp: number) => {
    if (temp <= 4) return <Snowflake className="w-4 h-4" />;
    if (temp <= 8) return <Droplets className="w-4 h-4" />;
    return <Thermometer className="w-4 h-4" />;
  };

  return (
    <div className={`bg-slate-800/50 backdrop-blur-sm rounded-xl border border-slate-700/30 p-6 ${className}`}>
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center space-x-3">
          <div className="p-2 bg-blue-500/20 rounded-lg">
            <Snowflake className="w-6 h-6 text-blue-400" />
          </div>
          <div>
            <h3 className="text-xl font-semibold text-white">Cold Plunge Sync</h3>
            <p className="text-sm text-gray-400">Track your cold therapy sessions</p>
            <div className="flex items-center space-x-2 mt-1">
              <Heart className="w-3 h-3 text-emerald-400" />
              <span className="text-xs text-emerald-400">Connected to Care Orchestrator</span>
            </div>
          </div>
        </div>
        
        <div className="flex space-x-2">
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={syncWithWearable}
            disabled={isLoading}
            className="flex items-center px-4 py-2 bg-blue-500/20 hover:bg-blue-500/30 border border-blue-500/30 rounded-lg text-blue-400 font-medium transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <Wifi className="w-4 h-4 mr-2" />
            {isLoading ? 'Syncing...' : 'Sync Wearable'}
          </motion.button>
          
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setShowManualForm(!showManualForm)}
            className="flex items-center px-4 py-2 bg-emerald-500/20 hover:bg-emerald-500/30 border border-emerald-500/30 rounded-lg text-emerald-400 font-medium transition-all duration-300"
          >
            <Plus className="w-4 h-4 mr-2" />
            Log Manually
          </motion.button>
        </div>
      </div>

      {/* Success Message */}
      <AnimatePresence>
        {showSuccessMessage && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="mb-4 p-3 bg-emerald-500/20 border border-emerald-500/30 rounded-lg"
          >
            <div className="flex items-center space-x-2">
              <Heart className="w-4 h-4 text-emerald-400" />
              <span className="text-emerald-400 font-medium">Task Executed!</span>
              <span className="text-emerald-300 text-sm">Task logged • +20 XP • Health tip added</span>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Manual Log Form */}
      <AnimatePresence>
        {showManualForm && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="mb-6 p-4 bg-slate-700/30 rounded-lg border border-slate-600/30"
          >
            <h4 className="text-lg font-semibold text-white mb-4 flex items-center">
              <Edit3 className="w-5 h-5 mr-2 text-emerald-400" />
              Manual Log Entry
              <span className="ml-2 px-2 py-1 bg-emerald-500/20 text-emerald-400 text-xs rounded-full">
                Self-Reporting
              </span>
            </h4>
            
            <div className="mb-4 p-3 bg-blue-500/10 border border-blue-500/20 rounded-lg">
              <p className="text-sm text-blue-300">
                <strong>Perfect for users without wearables!</strong> Self-report your cold therapy sessions 
                and let the Care Orchestrator track your progress, award XP, and provide health insights.
              </p>
            </div>
            
            <form onSubmit={handleManualSubmit} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Temperature (°C)
                  </label>
                  <input
                    type="number"
                    step="0.1"
                    min="0"
                    max="20"
                    value={manualForm.temperature}
                    onChange={(e) => setManualForm(prev => ({ ...prev, temperature: e.target.value }))}
                    className="w-full px-3 py-2 bg-slate-800/50 border border-slate-600/50 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-emerald-500/50 focus:border-emerald-500/50 transition-all duration-300"
                    placeholder="e.g., 8.5"
                    required
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Duration (minutes)
                  </label>
                  <input
                    type="number"
                    step="0.5"
                    min="0.5"
                    max="30"
                    value={manualForm.duration}
                    onChange={(e) => setManualForm(prev => ({ ...prev, duration: e.target.value }))}
                    className="w-full px-3 py-2 bg-slate-800/50 border border-slate-600/50 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-emerald-500/50 focus:border-emerald-500/50 transition-all duration-300"
                    placeholder="e.g., 3.5"
                    required
                  />
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Notes (optional)
                </label>
                <textarea
                  value={manualForm.notes}
                  onChange={(e) => setManualForm(prev => ({ ...prev, notes: e.target.value }))}
                  className="w-full px-3 py-2 bg-slate-800/50 border border-slate-600/50 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-emerald-500/50 focus:border-emerald-500/50 transition-all duration-300"
                  placeholder="How did you feel? Any observations?"
                  rows={3}
                />
              </div>
              
              <div className="flex space-x-3">
                <motion.button
                  type="submit"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className="px-6 py-2 bg-emerald-500 hover:bg-emerald-600 rounded-lg text-white font-medium transition-all duration-300"
                >
                  Log Session
                </motion.button>
                
                <motion.button
                  type="button"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => setShowManualForm(false)}
                  className="px-6 py-2 bg-slate-600 hover:bg-slate-700 rounded-lg text-gray-300 font-medium transition-all duration-300"
                >
                  Cancel
                </motion.button>
              </div>
            </form>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Logs List */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h4 className="text-lg font-semibold text-white">Recent Sessions</h4>
          <span className="text-sm text-gray-400">{logs.length} sessions logged</span>
        </div>

        {logs.length === 0 ? (
          <div className="text-center py-8">
            <Snowflake className="w-12 h-12 text-gray-500 mx-auto mb-4" />
            <h5 className="text-lg font-medium text-gray-400 mb-2">No sessions logged yet</h5>
            <p className="text-sm text-gray-500">
              Sync with your wearable device or log a session manually to get started.
            </p>
          </div>
        ) : (
          <div className="space-y-3">
            {logs.map((log, index) => (
              <motion.div
                key={log.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="flex items-center justify-between p-4 bg-slate-700/30 rounded-lg border border-slate-600/30 hover:border-slate-500/50 transition-all duration-300"
              >
                <div className="flex items-center space-x-4">
                  <div className={`p-2 rounded-lg ${
                    log.source === 'wearable' ? 'bg-blue-500/20' : 'bg-emerald-500/20'
                  }`}>
                    {log.source === 'wearable' ? (
                      <Wifi className="w-5 h-5 text-blue-400" />
                    ) : (
                      <Edit3 className="w-5 h-5 text-emerald-400" />
                    )}
                  </div>
                  
                  <div className="flex-1">
                    <div className="flex items-center space-x-4 mb-1">
                      <div className="flex items-center space-x-1">
                        {getTemperatureIcon(log.temperature)}
                        <span className={`font-semibold ${getTemperatureColor(log.temperature)}`}>
                          {log.temperature}°C
                        </span>
                      </div>
                      
                      <div className="flex items-center space-x-1">
                        <Clock className="w-4 h-4 text-gray-400" />
                        <span className="text-gray-300">{log.duration} min</span>
                      </div>
                      
                      <div className="flex items-center space-x-1">
                        <Calendar className="w-4 h-4 text-gray-400" />
                        <span className="text-gray-400 text-sm">{formatTimestamp(log.timestamp)}</span>
                      </div>
                    </div>
                    
                    {log.notes && (
                      <p className="text-sm text-gray-400 italic">"{log.notes}"</p>
                    )}
                  </div>
                </div>
                
                <motion.button
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  onClick={() => deleteLog(log.id)}
                  className="p-2 text-red-400 hover:text-red-300 hover:bg-red-500/20 rounded-lg transition-all duration-300"
                >
                  <Trash2 className="w-4 h-4" />
                </motion.button>
              </motion.div>
            ))}
          </div>
        )}
      </div>

      {/* Future Feature Placeholder */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.5 }}
        className="mt-8 p-4 bg-gradient-to-r from-purple-500/10 to-blue-500/10 border border-purple-500/30 rounded-lg"
      >
        <div className="flex items-center space-x-3">
          <div className="p-2 bg-purple-500/20 rounded-lg">
            <Zap className="w-5 h-5 text-purple-400" />
          </div>
          <div>
            <h5 className="font-semibold text-purple-300">Terra API Integration</h5>
            <p className="text-sm text-purple-200/80">
              Coming soon: Direct integration with Terra API for seamless wearable data synchronization
            </p>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default ColdPlungeSync;
