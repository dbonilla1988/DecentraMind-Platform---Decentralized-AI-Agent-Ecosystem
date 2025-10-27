/**
 * Avatar Utility Functions for DecentraMind AI Agents
 * 
 * Provides a unified system for handling agent avatars with proper fallback hierarchy:
 * 1. Primary: IPFS CID from agent.imageCid
 * 2. Secondary: Local fallback image from /public/avatars/
 * 3. Final: Emoji-based fallback
 */

export interface Agent {
  id?: string;
  name: string;
  imageCid?: string; // IPFS CID for the agent's avatar image
  avatar?: string; // Legacy avatar field
  domain?: string;
  type?: string;
}

export interface AvatarConfig {
  ipfsUrl: string;
  localPath: string;
  emoji: string;
}

/**
 * Avatar configuration mapping for different agent types
 */
const AVATAR_CONFIG: Record<string, AvatarConfig> = {
  'agent-cfo': {
    ipfsUrl: '', // Will be populated from agent.imageCid
    localPath: '/avatars/agent-cfo.png',
    emoji: '🧠'
  },
  'agent-care': {
    ipfsUrl: '', // Will be populated from agent.imageCid
    localPath: '/avatars/agent-care.png',
    emoji: '🩺'
  },
  'agent-crypto': {
    ipfsUrl: '', // Will be populated from agent.imageCid
    localPath: '/avatars/agent-crypto.png',
    emoji: '📈'
  },
  'default': {
    ipfsUrl: '',
    localPath: '/avatars/default-agent.png',
    emoji: '🤖'
  }
};

/**
 * Get agent avatar configuration based on agent ID or name
 */
export const getAgentAvatarConfig = (agent: Agent): AvatarConfig => {
  // Try to match by agent ID first
  if (agent.id && AVATAR_CONFIG[agent.id]) {
    return AVATAR_CONFIG[agent.id];
  }

  // Try to match by agent name
  const nameKey = agent.name.toLowerCase().replace(/\s+/g, '-');
  if (AVATAR_CONFIG[nameKey]) {
    return AVATAR_CONFIG[nameKey];
  }

  // Try to match by domain
  if (agent.domain) {
    const domainKey = `agent-${agent.domain.toLowerCase()}`;
    if (AVATAR_CONFIG[domainKey]) {
      return AVATAR_CONFIG[domainKey];
    }
  }

  // Default fallback
  return AVATAR_CONFIG['default'];
};

/**
 * Get the primary avatar URL (IPFS if available, otherwise local)
 */
export const getAgentAvatarUrl = (agent: Agent): string => {
  const config = getAgentAvatarConfig(agent);
  
  // Primary: Use IPFS CID if available
  if (agent.imageCid) {
    return `https://ipfs.io/ipfs/${agent.imageCid}`;
  }
  
  // Secondary: Use local fallback
  return config.localPath;
};

/**
 * Get the fallback emoji for an agent
 */
export const getAgentEmoji = (agent: Agent): string => {
  const config = getAgentAvatarConfig(agent);
  return config.emoji;
};

/**
 * Get all avatar information for an agent
 */
export const getAgentAvatarInfo = (agent: Agent) => {
  const config = getAgentAvatarConfig(agent);
  const primaryUrl = getAgentAvatarUrl(agent);
  const emoji = getAgentEmoji(agent);
  
  return {
    primaryUrl,
    fallbackPath: config.localPath,
    emoji,
    config
  };
};

/**
 * Legacy function for backward compatibility
 * @deprecated Use getAgentAvatarUrl instead
 */
export const getAgentAvatar = (agentId: string): string => {
  const config = AVATAR_CONFIG[agentId] || AVATAR_CONFIG['default'];
  return config.localPath;
};

/**
 * Check if an agent has an IPFS avatar
 */
export const hasIPFSAvatar = (agent: Agent): boolean => {
  return Boolean(agent.imageCid);
};

/**
 * Get agent type from name or ID
 */
export const getAgentType = (agent: Agent): string => {
  if (agent.id) return agent.id;
  
  const nameKey = agent.name.toLowerCase().replace(/\s+/g, '-');
  if (AVATAR_CONFIG[nameKey]) return nameKey;
  
  if (agent.domain) {
    const domainKey = `agent-${agent.domain.toLowerCase()}`;
    if (AVATAR_CONFIG[domainKey]) return domainKey;
  }
  
  return 'default';
};

