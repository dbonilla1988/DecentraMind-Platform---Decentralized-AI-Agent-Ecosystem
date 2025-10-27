'use client';

import { useState, useEffect } from 'react';

export interface XPReward {
  id: string;
  agentId: string;
  agentName: string;
  taskId: string;
  taskName: string;
  xpAmount: number;
  timestamp: string;
  category: 'task_completion' | 'agent_unlock' | 'achievement' | 'daily_bonus' | 'cold_plunge_session';
  description: string;
}

export interface XPLog {
  totalXP: number;
  level: number;
  xpToNext: number;
  rewards: XPReward[];
  lastUpdated: string;
}

const DEFAULT_XP_LOG: XPLog = {
  totalXP: 15420,
  level: 15,
  xpToNext: 580,
  rewards: [],
  lastUpdated: new Date().toISOString()
};

export const useXPLogging = () => {
  const [xpLog, setXPLog] = useState<XPLog>(DEFAULT_XP_LOG);
  const [isLoading, setIsLoading] = useState(false);

  // Load XP log from localStorage on mount
  useEffect(() => {
    const savedXPLog = localStorage.getItem('xp_log');
    if (savedXPLog) {
      try {
        setXPLog(JSON.parse(savedXPLog));
      } catch (error) {
        console.error('Error parsing saved XP log:', error);
        setXPLog(DEFAULT_XP_LOG);
      }
    }
  }, []);

  // Save XP log to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem('xp_log', JSON.stringify(xpLog));
  }, [xpLog]);

  const calculateLevel = (totalXP: number): { level: number; xpToNext: number } => {
    const level = Math.floor(totalXP / 1000) + 1;
    const xpToNext = (level * 1000) - totalXP;
    return { level, xpToNext };
  };

  const addXPReward = (reward: Omit<XPReward, 'id' | 'timestamp'>) => {
    const newReward: XPReward = {
      ...reward,
      id: `xp_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      timestamp: new Date().toISOString()
    };

    const newTotalXP = xpLog.totalXP + reward.xpAmount;
    const { level, xpToNext } = calculateLevel(newTotalXP);

    const updatedXPLog: XPLog = {
      totalXP: newTotalXP,
      level,
      xpToNext,
      rewards: [newReward, ...xpLog.rewards],
      lastUpdated: new Date().toISOString()
    };

    setXPLog(updatedXPLog);

    // Log to console for debugging
    console.log(`XP Reward: +${reward.xpAmount} XP for ${reward.taskName} (${reward.agentName})`);
    console.log(`New Total: ${newTotalXP} XP (Level ${level})`);

    return newReward;
  };

  const logTaskCompletion = (agentId: string, agentName: string, taskName: string, baseXP: number = 25) => {
    return addXPReward({
      agentId,
      agentName,
      taskId: `task_${Date.now()}`,
      taskName,
      xpAmount: baseXP,
      category: 'task_completion',
      description: `Completed task: ${taskName}`
    });
  };

  const logAgentUnlock = (agentId: string, agentName: string, agentType: 'master' | 'sub') => {
    const xpAmount = agentType === 'master' ? 100 : 50;
    return addXPReward({
      agentId,
      agentName,
      taskId: `unlock_${Date.now()}`,
      taskName: `Unlocked ${agentName}`,
      xpAmount,
      category: 'agent_unlock',
      description: `Unlocked ${agentType} agent: ${agentName}`
    });
  };

  const logAchievement = (achievementName: string, xpAmount: number) => {
    return addXPReward({
      agentId: 'system',
      agentName: 'System',
      taskId: `achievement_${Date.now()}`,
      taskName: achievementName,
      xpAmount,
      category: 'achievement',
      description: `Achievement unlocked: ${achievementName}`
    });
  };

  const logDailyBonus = (bonusAmount: number = 10) => {
    return addXPReward({
      agentId: 'system',
      agentName: 'System',
      taskId: `daily_${Date.now()}`,
      taskName: 'Daily Login Bonus',
      xpAmount: bonusAmount,
      category: 'daily_bonus',
      description: 'Daily login bonus'
    });
  };

  const logColdPlungeSession = (temperature: number, duration: number, notes?: string) => {
    const xpAmount = 20; // Base XP for cold plunge sessions
    const taskName = `Cold Plunge Session (${temperature}°C, ${duration}min)`;
    
    return addXPReward({
      agentId: 'wellness-agent',
      agentName: 'Care Orchestrator',
      taskId: `cold_plunge_${Date.now()}`,
      taskName,
      xpAmount,
      category: 'cold_plunge_session',
      description: `Cold therapy completed at ${temperature}°C for ${duration} minutes${notes ? ` - ${notes}` : ''}`
    });
  };

  const getRecentRewards = (limit: number = 10): XPReward[] => {
    return xpLog.rewards.slice(0, limit);
  };

  const getRewardsByAgent = (agentId: string): XPReward[] => {
    return xpLog.rewards.filter(reward => reward.agentId === agentId);
  };

  const getRewardsByCategory = (category: XPReward['category']): XPReward[] => {
    return xpLog.rewards.filter(reward => reward.category === category);
  };

  const getWeeklyXP = (): number => {
    const oneWeekAgo = new Date();
    oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);
    
    return xpLog.rewards
      .filter(reward => new Date(reward.timestamp) >= oneWeekAgo)
      .reduce((total, reward) => total + reward.xpAmount, 0);
  };

  const getMonthlyXP = (): number => {
    const oneMonthAgo = new Date();
    oneMonthAgo.setMonth(oneMonthAgo.getMonth() - 1);
    
    return xpLog.rewards
      .filter(reward => new Date(reward.timestamp) >= oneMonthAgo)
      .reduce((total, reward) => total + reward.xpAmount, 0);
  };

  const resetXPLog = () => {
    setXPLog(DEFAULT_XP_LOG);
    localStorage.removeItem('xp_log');
  };

  return {
    xpLog,
    isLoading,
    addXPReward,
    logTaskCompletion,
    logAgentUnlock,
    logAchievement,
    logDailyBonus,
    logColdPlungeSession,
    getRecentRewards,
    getRewardsByAgent,
    getRewardsByCategory,
    getWeeklyXP,
    getMonthlyXP,
    resetXPLog
  };
};
