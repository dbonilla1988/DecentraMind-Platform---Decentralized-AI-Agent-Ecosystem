// Export all sub-agent configurations
export { cfoConfig, cfoSubAgents } from './AutonomousCFO/config';
export { careConfig, careSubAgents } from './CareOrchestrator/config';
export { alphaConfig, alphaSubAgents } from './CryptoAlphaAssistant/config';

// Export shared types and utilities
export * from './utils/subAgentTypes';

// Export components
export { default as SubAgentCard } from './AutonomousCFO/SubAgentCard';
export { default as SubAgentModal } from './AutonomousCFO/SubAgentModal';
export { default as SubAgentCardUnlocked } from './components/SubAgentCard';
export { default as LockedAgentCard } from './components/LockedAgentCard';
export { default as MasterAgentDashboard } from './components/MasterAgentDashboard';

// Export hooks
export * from './hooks/useSubAgentAccess';

// Export middleware
export { default as SubAgentMiddleware, useSubAgentExecution, withSubAgentAccess } from './middleware/SubAgentMiddleware';

// Master agent configurations
export const masterAgentConfigs = [
  {
    id: 'autonomous-cfo',
    name: 'Autonomous CFO',
    description: 'Financial intelligence and treasury management',
    icon: '🧠',
    color: 'purple',
    subAgents: cfoConfig.subAgents
  },
  {
    id: 'care-orchestrator',
    name: 'Care Orchestrator',
    description: 'Health and wellness coordination',
    icon: '❤️',
    color: 'emerald',
    subAgents: careConfig.subAgents
  },
  {
    id: 'crypto-alpha-assistant',
    name: 'Crypto Alpha Assistant',
    description: 'Market intelligence and alpha generation',
    icon: '📈',
    color: 'blue',
    subAgents: alphaConfig.subAgents
  }
];

// Helper functions
export const getMasterAgentConfig = (agentId: string) => {
  return masterAgentConfigs.find(config => config.id === agentId);
};

export const getAllSubAgents = () => {
  return masterAgentConfigs.flatMap(config => config.subAgents);
};

export const getSubAgentsByParent = (parent: 'CFO' | 'Care' | 'Alpha') => {
  return getAllSubAgents().filter(subAgent => subAgent.parent === parent);
};

export const getSubAgentsByModel = (model: 'NFT' | 'Subscription' | 'TokenUnlock') => {
  return getAllSubAgents().filter(subAgent => subAgent.model === model);
};
