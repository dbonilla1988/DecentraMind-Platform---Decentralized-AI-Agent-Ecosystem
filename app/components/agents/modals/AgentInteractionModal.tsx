'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAgentInteraction, TaskDefinition, AgentInteractionResponse } from '../../../hooks/useAgentInteraction';
import { AgentMetadata } from '../../../data/agentMetadata';

interface AgentInteractionModalProps {
  agent: AgentMetadata;
  subAgent?: AgentMetadata;
  isOpen: boolean;
  onClose: () => void;
  walletAddress: string;
}

const AgentInteractionModal: React.FC<AgentInteractionModalProps> = ({
  agent,
  subAgent,
  isOpen,
  onClose,
  walletAddress
}) => {
  const { interactWithAgent, getAvailableTasks, isLoading, lastResponse } = useAgentInteraction();
  const [selectedTask, setSelectedTask] = useState<TaskDefinition | null>(null);
  const [userPrompt, setUserPrompt] = useState('');
  const [availableTasks, setAvailableTasks] = useState<TaskDefinition[]>([]);
  const [interactionStep, setInteractionStep] = useState<'select' | 'interact' | 'result'>('select');

  const targetAgent = subAgent || agent;
  const agentId = subAgent ? agent.id : agent.id;

  useEffect(() => {
    if (isOpen) {
      const tasks = getAvailableTasks(agentId, subAgent?.id);
      setAvailableTasks(tasks);
      setSelectedTask(null);
      setUserPrompt('');
      setInteractionStep('select');
    }
  }, [isOpen, agentId, subAgent?.id, getAvailableTasks]);

  const handleTaskSelect = (task: TaskDefinition) => {
    setSelectedTask(task);
    setInteractionStep('interact');
    if (!task.requiresInput) {
      setUserPrompt('Execute task');
    }
  };

  const handleInteraction = async () => {
    if (!selectedTask) return;

    const request = {
      agentId,
      subAgentId: subAgent?.id,
      taskType: selectedTask.id,
      userPrompt: userPrompt || selectedTask.name,
      walletAddress,
      metadata: {
        timestamp: new Date().toISOString(),
        agentName: targetAgent.name
      }
    };

    const response = await interactWithAgent(request);
    setInteractionStep('result');
  };

  const handleClose = () => {
    setInteractionStep('select');
    setSelectedTask(null);
    setUserPrompt('');
    onClose();
  };

  const getStepIcon = (step: string) => {
    switch (step) {
      case 'select': return '🎯';
      case 'interact': return '💬';
      case 'result': return '✅';
      default: return '🤖';
    }
  };

  const getStepTitle = (step: string) => {
    switch (step) {
      case 'select': return 'Select Task';
      case 'interact': return 'Provide Input';
      case 'result': return 'Response';
      default: return 'Agent Interaction';
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
          onClick={handleClose}
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            className="bg-slate-800/90 backdrop-blur-sm rounded-2xl p-8 max-w-2xl w-full max-h-[90vh] overflow-y-auto border border-slate-700/50"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div className="flex items-start justify-between mb-6">
              <div className="flex items-center space-x-4">
                <div className="text-5xl">{targetAgent.icon}</div>
                <div>
                  <h2 className="text-2xl font-bold text-white">{targetAgent.name}</h2>
                  <p className="text-gray-400">
                    {subAgent ? `Sub-agent of ${agent.name}` : 'Master Agent'}
                  </p>
                </div>
              </div>
              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                onClick={handleClose}
                className="text-gray-400 hover:text-white transition-colors"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </motion.button>
            </div>

            {/* Progress Steps */}
            <div className="flex items-center justify-center mb-8">
              <div className="flex items-center space-x-4">
                {['select', 'interact', 'result'].map((step, index) => (
                  <div key={step} className="flex items-center">
                    <div className={`w-10 h-10 rounded-full flex items-center justify-center text-lg font-semibold transition-all duration-300 ${
                      interactionStep === step 
                        ? 'bg-gradient-to-r from-purple-500 to-blue-500 text-white' 
                        : interactionStep === 'result' && step !== 'result'
                        ? 'bg-emerald-500 text-white'
                        : 'bg-slate-700 text-gray-400'
                    }`}>
                      {interactionStep === 'result' && step !== 'result' ? '✓' : getStepIcon(step)}
                    </div>
                    {index < 2 && (
                      <div className={`w-8 h-1 mx-2 transition-all duration-300 ${
                        interactionStep === 'result' || (interactionStep === 'interact' && step === 'select')
                        ? 'bg-emerald-500' 
                        : 'bg-slate-700'
                      }`} />
                    )}
                  </div>
                ))}
              </div>
            </div>

            {/* Step Content */}
            <div className="min-h-[300px]">
              {interactionStep === 'select' && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="space-y-4"
                >
                  <h3 className="text-xl font-semibold text-white mb-4">Available Tasks</h3>
                  <div className="grid gap-3">
                    {availableTasks.map((task) => (
                      <motion.button
                        key={task.id}
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        onClick={() => handleTaskSelect(task)}
                        className="p-4 bg-slate-700/50 hover:bg-slate-700 rounded-xl border border-slate-600/30 hover:border-slate-500/50 transition-all duration-200 text-left"
                      >
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <h4 className="font-semibold text-white mb-1">{task.name}</h4>
                            <p className="text-gray-400 text-sm mb-2">{task.description}</p>
                            <div className="flex items-center space-x-4 text-xs">
                              <span className="text-emerald-400">+{task.xpReward} XP</span>
                              <span className="text-gray-500">•</span>
                              <span className="text-blue-400 capitalize">{task.category}</span>
                              {task.requiresInput && (
                                <>
                                  <span className="text-gray-500">•</span>
                                  <span className="text-yellow-400">Input Required</span>
                                </>
                              )}
                            </div>
                          </div>
                          <div className="text-2xl ml-4">→</div>
                        </div>
                      </motion.button>
                    ))}
                  </div>
                </motion.div>
              )}

              {interactionStep === 'interact' && selectedTask && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="space-y-6"
                >
                  <div className="text-center">
                    <div className="text-4xl mb-3">{selectedTask.name}</div>
                    <p className="text-gray-400 mb-4">{selectedTask.description}</p>
                    <div className="inline-flex items-center space-x-2 px-3 py-1 bg-emerald-500/20 text-emerald-400 rounded-full text-sm">
                      <span>+{selectedTask.xpReward} XP Reward</span>
                    </div>
                  </div>

                  {selectedTask.requiresInput ? (
                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-2">
                        {selectedTask.inputPlaceholder || 'Enter your request:'}
                      </label>
                      <textarea
                        value={userPrompt}
                        onChange={(e) => setUserPrompt(e.target.value)}
                        placeholder={selectedTask.inputPlaceholder || 'Describe what you want the agent to do...'}
                        className="w-full p-4 bg-slate-700/50 border border-slate-600 rounded-xl text-white placeholder-gray-400 focus:border-purple-500 focus:ring-1 focus:ring-purple-500 resize-none"
                        rows={4}
                      />
                    </div>
                  ) : (
                    <div className="p-4 bg-slate-700/30 rounded-xl border border-slate-600/30">
                      <p className="text-gray-300 text-sm">
                            This task will be executed automatically. No additional input required.
                      </p>
                    </div>
                  )}

                  <div className="flex space-x-3">
                    <motion.button
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={() => setInteractionStep('select')}
                      className="flex-1 py-3 px-6 bg-slate-700/50 hover:bg-slate-600/50 text-gray-300 hover:text-white rounded-xl font-semibold transition-all duration-300"
                    >
                      Back
                    </motion.button>
                    <motion.button
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={handleInteraction}
                      disabled={isLoading || (selectedTask.requiresInput && !userPrompt.trim())}
                      className={`flex-1 py-3 px-6 rounded-xl font-semibold transition-all duration-300 ${
                        isLoading || (selectedTask.requiresInput && !userPrompt.trim())
                          ? 'bg-gray-500/20 text-gray-400 cursor-not-allowed'
                          : 'bg-gradient-to-r from-purple-500 to-blue-500 hover:from-purple-600 hover:to-blue-600 text-white'
                      }`}
                    >
                      {isLoading ? (
                        <div className="flex items-center justify-center space-x-2">
                          <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                          <span>Processing...</span>
                        </div>
                      ) : (
                        'Execute Task'
                      )}
                    </motion.button>
                  </div>
                </motion.div>
              )}

              {interactionStep === 'result' && lastResponse && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="space-y-6"
                >
                  <div className="text-center">
                    <div className="text-4xl mb-3">
                      {lastResponse.success ? '✅' : '❌'}
                    </div>
                    <h3 className="text-xl font-semibold text-white mb-2">
                      {lastResponse.success ? 'Task Completed!' : 'Task Failed'}
                    </h3>
                    {lastResponse.xpReward && (
                      <div className="inline-flex items-center space-x-2 px-3 py-1 bg-emerald-500/20 text-emerald-400 rounded-full text-sm mb-4">
                        <span>+{lastResponse.xpReward} XP Earned</span>
                      </div>
                    )}
                  </div>

                  <div className="p-6 bg-slate-700/30 rounded-xl border border-slate-600/30">
                    <h4 className="font-semibold text-white mb-3">Agent Response:</h4>
                    <p className="text-gray-300 leading-relaxed">{lastResponse.message}</p>
                  </div>

                  {lastResponse.data?.taskLogEntry && (
                    <div className="p-4 bg-slate-800/30 rounded-xl border border-slate-600/30">
                      <h4 className="font-semibold text-white mb-2">Task Details:</h4>
                      <div className="text-sm text-gray-400 space-y-1">
                        <div>Task: {lastResponse.data.taskLogEntry.taskType}</div>
                        <div>Agent: {lastResponse.data.taskLogEntry.agentId}</div>
                        <div>Timestamp: {new Date(lastResponse.data.taskLogEntry.timestamp).toLocaleString()}</div>
                      </div>
                    </div>
                  )}

                  <div className="flex space-x-3">
                    <motion.button
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={() => setInteractionStep('select')}
                      className="flex-1 py-3 px-6 bg-slate-700/50 hover:bg-slate-600/50 text-gray-300 hover:text-white rounded-xl font-semibold transition-all duration-300"
                    >
                      New Task
                    </motion.button>
                    <motion.button
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={handleClose}
                      className="flex-1 py-3 px-6 bg-gradient-to-r from-purple-500 to-blue-500 hover:from-purple-600 hover:to-blue-600 text-white rounded-xl font-semibold transition-all duration-300"
                    >
                      Close
                    </motion.button>
                  </div>
                </motion.div>
              )}
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default AgentInteractionModal;
