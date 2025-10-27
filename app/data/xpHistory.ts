/**
 * XP History Data Management
 * Centralized XP log records and history tracking
 */

export interface XPHistoryEntry {
  id: string;
  agentId: string;
  amount: number;
  timestamp: Date;
  reason: string;
  category: 'unlock' | 'task_completion' | 'bonus' | 'achievement';
  metadata?: {
    taskType?: string;
    duration?: number;
    difficulty?: 'easy' | 'medium' | 'hard';
    multiplier?: number;
  };
}

export interface UserXPProfile {
  walletAddress: string;
  totalXP: number;
  currentLevel: number;
  xpHistory: XPHistoryEntry[];
  achievements: string[];
  lastActivity: Date;
}

// Mock XP history data
export const mockXPHistory: XPHistoryEntry[] = [
  {
    id: 'xp_001',
    agentId: 'meditation-guide',
    amount: 30,
    timestamp: new Date('2024-01-15T10:30:00Z'),
    reason: 'Unlocked Meditation Guide',
    category: 'unlock',
    metadata: { taskType: 'agent_unlock' }
  },
  {
    id: 'xp_002',
    agentId: 'nutrition-coach',
    amount: 25,
    timestamp: new Date('2024-01-15T11:15:00Z'),
    reason: 'Completed meal planning task',
    category: 'task_completion',
    metadata: { 
      taskType: 'meal_planning',
      duration: 15,
      difficulty: 'medium'
    }
  },
  {
    id: 'xp_003',
    agentId: 'cold-plunge-coach',
    amount: 20,
    timestamp: new Date('2024-01-15T12:00:00Z'),
    reason: 'Cold therapy session completed',
    category: 'task_completion',
    metadata: { 
      taskType: 'cold_plunge_session',
      duration: 3,
      difficulty: 'hard'
    }
  },
  {
    id: 'xp_004',
    agentId: 'sleep-ai',
    amount: 15,
    timestamp: new Date('2024-01-15T14:30:00Z'),
    reason: 'Sleep pattern analysis bonus',
    category: 'bonus',
    metadata: { 
      taskType: 'sleep_analysis',
      multiplier: 1.5
    }
  },
  {
    id: 'xp_005',
    agentId: 'fitness-tracker',
    amount: 50,
    timestamp: new Date('2024-01-15T16:00:00Z'),
    reason: 'Achievement: First week streak',
    category: 'achievement',
    metadata: { 
      taskType: 'streak_achievement',
      difficulty: 'hard'
    }
  }
];

// XP calculation utilities
export const calculateXPForUnlock = (agentCost: number): number => {
  if (agentCost >= 4000) return 50;
  if (agentCost >= 1000) return 30;
  return 20;
};

export const calculateXPForTask = (taskType: string, duration?: number): number => {
  const baseXP: Record<string, number> = {
    'meal_planning': 25,
    'cold_plunge_session': 20,
    'sleep_analysis': 15,
    'meditation_session': 10,
    'workout_tracking': 30,
    'breathwork_session': 15
  };

  const base = baseXP[taskType] || 10;
  
  // Duration bonus
  if (duration) {
    if (duration >= 30) return base * 1.5;
    if (duration >= 15) return base * 1.25;
  }
  
  return base;
};

export const calculateLevel = (totalXP: number): number => {
  return Math.floor(totalXP / 1000) + 1;
};

export const calculateProgressToNextLevel = (totalXP: number): { progress: number; xpToNext: number } => {
  const currentLevel = calculateLevel(totalXP);
  const currentLevelXP = (currentLevel - 1) * 1000;
  const nextLevelXP = currentLevel * 1000;
  const xpToNext = nextLevelXP - totalXP;
  const progress = ((totalXP - currentLevelXP) / (nextLevelXP - currentLevelXP)) * 100;
  
  return { progress: Math.max(0, Math.min(100, progress)), xpToNext };
};

// Achievement system
export const achievements = {
  'first_unlock': {
    name: 'First Steps',
    description: 'Unlock your first agent',
    xpReward: 50,
    icon: '🎯'
  },
  'week_streak': {
    name: 'Consistency Champion',
    description: 'Complete tasks for 7 consecutive days',
    xpReward: 100,
    icon: '🔥'
  },
  'level_5': {
    name: 'Wellness Expert',
    description: 'Reach Care Orchestrator Level 5',
    xpReward: 200,
    icon: '⭐'
  },
  'all_agents': {
    name: 'Master Collector',
    description: 'Unlock all available agents',
    xpReward: 300,
    icon: '👑'
  }
};

// Helper functions
export const getXPHistoryByAgent = (agentId: string): XPHistoryEntry[] => {
  return mockXPHistory.filter(entry => entry.agentId === agentId);
};

export const getRecentXPActivity = (limit: number = 10): XPHistoryEntry[] => {
  return mockXPHistory
    .sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime())
    .slice(0, limit);
};

export const getTotalXPByAgent = (agentId: string): number => {
  return mockXPHistory
    .filter(entry => entry.agentId === agentId)
    .reduce((total, entry) => total + entry.amount, 0);
};

export const getXPStats = (walletAddress: string) => {
  const userHistory = mockXPHistory; // In production, filter by walletAddress
  const totalXP = userHistory.reduce((total, entry) => total + entry.amount, 0);
  const currentLevel = calculateLevel(totalXP);
  const { progress, xpToNext } = calculateProgressToNextLevel(totalXP);
  
  return {
    totalXP,
    currentLevel,
    progressToNextLevel: progress,
    xpToNextLevel: xpToNext,
    totalActivities: userHistory.length,
    recentActivity: getRecentXPActivity(5)
  };
};
