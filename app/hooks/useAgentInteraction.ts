'use client';

import { useState, useCallback } from 'react';
import { useAgentUnlocks } from './useAgentUnlocks';
import { useSubAgentUnlocks } from './useSubAgentUnlocks';
import { useWalletBalance } from './useWalletBalance';
import { useXPLogging } from './useXPLogging';
import { agentMetadata, getAgentById, getSubAgent } from '../data/agentMetadata';

export interface AgentInteractionRequest {
  agentId: string;
  subAgentId?: string;
  taskType: string;
  userPrompt: string;
  walletAddress: string;
  metadata?: Record<string, any>;
}

export interface AgentInteractionResponse {
  success: boolean;
  message: string;
  data?: any;
  xpReward?: number;
  error?: string;
}

export interface TaskDefinition {
  id: string;
  name: string;
  description: string;
  xpReward: number;
  category: string;
  requiresInput?: boolean;
  inputPlaceholder?: string;
}

// Task definitions for each agent type
const AGENT_TASKS: Record<string, TaskDefinition[]> = {
  'care-orchestrator': [
    {
      id: 'health_check',
      name: 'Health Check',
      description: 'Perform a comprehensive health assessment',
      xpReward: 25,
      category: 'health',
      requiresInput: false
    },
    {
      id: 'mood_log',
      name: 'Log Mood',
      description: 'Record your current emotional state',
      xpReward: 15,
      category: 'wellness',
      requiresInput: true,
      inputPlaceholder: 'How are you feeling today? (1-10 scale)'
    },
    {
      id: 'wellness_tip',
      name: 'Get Wellness Tip',
      description: 'Receive personalized wellness advice',
      xpReward: 20,
      category: 'advice',
      requiresInput: false
    }
  ],
  'cold-plunge-coach': [
    {
      id: 'cold_plunge_session',
      name: 'Schedule Cold Plunge',
      description: 'Schedule a cold therapy session',
      xpReward: 30,
      category: 'scheduling',
      requiresInput: true,
      inputPlaceholder: 'When would you like to schedule? (e.g., "6am tomorrow")'
    },
    {
      id: 'temperature_guidance',
      name: 'Temperature Guidance',
      description: 'Get optimal temperature recommendations',
      xpReward: 20,
      category: 'advice',
      requiresInput: false
    },
    {
      id: 'session_log',
      name: 'Log Session',
      description: 'Record completed cold plunge session',
      xpReward: 25,
      category: 'logging',
      requiresInput: true,
      inputPlaceholder: 'Duration and temperature (e.g., "3 minutes at 10°C")'
    }
  ],
  'sleep-ai': [
    {
      id: 'sleep_analysis',
      name: 'Sleep Analysis',
      description: 'Analyze your sleep patterns',
      xpReward: 35,
      category: 'analysis',
      requiresInput: false
    },
    {
      id: 'bedtime_routine',
      name: 'Bedtime Routine',
      description: 'Get personalized bedtime recommendations',
      xpReward: 25,
      category: 'advice',
      requiresInput: false
    },
    {
      id: 'sleep_log',
      name: 'Log Sleep',
      description: 'Record sleep quality and duration',
      xpReward: 20,
      category: 'logging',
      requiresInput: true,
      inputPlaceholder: 'Sleep quality and duration (e.g., "7 hours, quality 8/10")'
    }
  ],
  'nutrition-coach': [
    {
      id: 'meal_plan',
      name: 'Meal Planning',
      description: 'Get personalized meal recommendations',
      xpReward: 30,
      category: 'planning',
      requiresInput: true,
      inputPlaceholder: 'Dietary preferences or restrictions'
    },
    {
      id: 'macro_tracking',
      name: 'Macro Tracking',
      description: 'Track macronutrient intake',
      xpReward: 25,
      category: 'tracking',
      requiresInput: true,
      inputPlaceholder: 'Food items consumed today'
    },
    {
      id: 'nutrition_tip',
      name: 'Nutrition Tip',
      description: 'Get personalized nutrition advice',
      xpReward: 20,
      category: 'advice',
      requiresInput: false
    }
  ],
  'meditation-guide': [
    {
      id: 'guided_session',
      name: 'Guided Meditation',
      description: 'Start a guided meditation session',
      xpReward: 30,
      category: 'session',
      requiresInput: true,
      inputPlaceholder: 'Meditation type (e.g., "breathing", "mindfulness")'
    },
    {
      id: 'progress_tracking',
      name: 'Track Progress',
      description: 'Record meditation progress',
      xpReward: 20,
      category: 'tracking',
      requiresInput: true,
      inputPlaceholder: 'Session duration and experience'
    },
    {
      id: 'meditation_tip',
      name: 'Meditation Tip',
      description: 'Get mindfulness guidance',
      xpReward: 15,
      category: 'advice',
      requiresInput: false
    }
  ],
  'fitness-tracker': [
    {
      id: 'workout_plan',
      name: 'Workout Plan',
      description: 'Get personalized workout recommendations',
      xpReward: 35,
      category: 'planning',
      requiresInput: true,
      inputPlaceholder: 'Fitness goals and current level'
    },
    {
      id: 'exercise_log',
      name: 'Log Exercise',
      description: 'Record completed workout',
      xpReward: 25,
      category: 'logging',
      requiresInput: true,
      inputPlaceholder: 'Exercise type, duration, and intensity'
    },
    {
      id: 'recovery_tip',
      name: 'Recovery Advice',
      description: 'Get recovery and rest recommendations',
      xpReward: 20,
      category: 'advice',
      requiresInput: false
    }
  ],
  'finance-agent': [
    {
      id: 'portfolio_analysis',
      name: 'Portfolio Analysis',
      description: 'Analyze current portfolio performance',
      xpReward: 40,
      category: 'analysis',
      requiresInput: false
    },
    {
      id: 'risk_assessment',
      name: 'Risk Assessment',
      description: 'Evaluate portfolio risk factors',
      xpReward: 35,
      category: 'analysis',
      requiresInput: false
    },
    {
      id: 'yield_optimization',
      name: 'Yield Optimization',
      description: 'Find DeFi yield opportunities',
      xpReward: 30,
      category: 'research',
      requiresInput: false
    }
  ]
};

// Mock response generators
const generateMockResponse = (agentId: string, taskType: string, userPrompt: string): string => {
  const responses: Record<string, Record<string, string[]>> = {
    'care-orchestrator': {
      'health_check': [
        "Your health metrics look great! Heart rate: 72 BPM, Blood pressure: 120/80. Keep up the good work!",
        "Health assessment complete. All vitals within normal range. Consider increasing water intake.",
        "Health check shows excellent results. Your wellness routine is working effectively."
      ],
      'mood_log': [
        "Thank you for logging your mood. I've recorded your emotional state and will track patterns over time.",
        "Mood logged successfully. I notice you're feeling positive today - that's wonderful!",
        "Your mood has been recorded. I'll use this data to provide better wellness recommendations."
      ],
      'wellness_tip': [
        "Try taking 5 deep breaths every hour to reduce stress and improve focus.",
        "Consider adding 10 minutes of morning sunlight exposure to regulate your circadian rhythm.",
        "Stay hydrated! Aim for 8 glasses of water daily for optimal health."
      ]
    },
    'cold-plunge-coach': {
      'cold_plunge_session': [
        "Cold plunge scheduled for 6am tomorrow! Temperature set to 10°C for 3 minutes. Remember to breathe deeply.",
        "Session booked! I've set reminders and prepared your optimal cold therapy protocol.",
        "Cold plunge scheduled successfully. You'll receive a reminder 30 minutes before your session."
      ],
      'temperature_guidance': [
        "For beginners, start with 15°C for 1-2 minutes. Gradually work down to 10°C for 3-5 minutes.",
        "Optimal temperature for your level: 12°C for 3 minutes. Focus on controlled breathing.",
        "Based on your experience, try 8°C for 4 minutes. This will maximize the benefits."
      ],
      'session_log': [
        "Session logged! 3 minutes at 10°C is excellent. Your cold tolerance is improving steadily.",
        "Great session! I've recorded your progress. You're building resilience effectively.",
        "Session completed and logged. Your recovery time is getting faster - keep it up!"
      ]
    },
    'sleep-ai': {
      'sleep_analysis': [
        "Your sleep patterns show 7.2 hours average with 85% efficiency. Consider going to bed 30 minutes earlier.",
        "Sleep analysis complete. Your REM sleep is optimal, but deep sleep could be improved.",
        "Your sleep quality is good! Try reducing screen time 1 hour before bed for better results."
      ],
      'bedtime_routine': [
        "Create a relaxing bedtime routine: dim lights, read a book, and avoid screens 1 hour before bed.",
        "Try this routine: warm shower, herbal tea, and 10 minutes of meditation before sleep.",
        "Optimal bedtime routine: stop eating 3 hours before bed, create a cool, dark environment."
      ],
      'sleep_log': [
        "Sleep logged successfully! 7 hours with quality 8/10 is excellent. Keep maintaining this routine.",
        "Great sleep data! Your consistency is improving your overall sleep quality.",
        "Sleep recorded. I notice you sleep better on days with morning exercise - consider this pattern."
      ]
    },
    'nutrition-coach': {
      'meal_plan': [
        "Here's your personalized meal plan: Breakfast - Greek yogurt with berries, Lunch - Grilled chicken salad, Dinner - Salmon with quinoa.",
        "Based on your preferences, I recommend Mediterranean-style meals with plenty of vegetables and lean proteins.",
        "Your meal plan is ready! Focus on whole foods, limit processed items, and stay hydrated throughout the day."
      ],
      'macro_tracking': [
        "Macros logged! You're at 45% carbs, 30% protein, 25% fat. Consider adding more protein to your next meal.",
        "Great tracking! Your macro balance is good. Try adding some healthy fats like avocado or nuts.",
        "Macro analysis complete. You're meeting your protein goals but could use more fiber-rich foods."
      ],
      'nutrition_tip': [
        "Eat the rainbow! Include colorful vegetables in every meal for maximum nutrient diversity.",
        "Try the 80/20 rule: 80% whole foods, 20% treats. This creates sustainable healthy eating habits.",
        "Meal timing matters! Eat protein within 30 minutes of waking to kickstart your metabolism."
      ]
    },
    'meditation-guide': {
      'guided_session': [
        "Starting your breathing meditation session. Focus on slow, deep breaths for 10 minutes.",
        "Guided mindfulness session beginning. Notice your thoughts without judgment, gently returning to your breath.",
        "Meditation session started. I'll guide you through body scan relaxation for 15 minutes."
      ],
      'progress_tracking': [
        "Progress logged! You've meditated 5 days this week - excellent consistency!",
        "Your meditation streak is impressive! 20 minutes daily is building strong mindfulness habits.",
        "Progress recorded. I notice you feel more centered after longer sessions - consider extending to 20 minutes."
      ],
      'meditation_tip': [
        "Start with just 5 minutes daily. Consistency matters more than duration when building meditation habits.",
        "Try the 4-7-8 breathing technique: inhale for 4, hold for 7, exhale for 8 counts.",
        "Create a dedicated meditation space. Even a corner with a cushion helps signal your mind to relax."
      ]
    },
    'fitness-tracker': {
      'workout_plan': [
        "Your personalized workout plan: Monday - Upper body, Wednesday - Lower body, Friday - Cardio + Core.",
        "Based on your goals, I recommend 3 strength sessions and 2 cardio sessions per week.",
        "Workout plan created! Focus on compound movements like squats, deadlifts, and push-ups for maximum efficiency."
      ],
      'exercise_log': [
        "Workout logged! 45 minutes of strength training with 8 exercises completed. Great job!",
        "Exercise session recorded. Your intensity was high - remember to prioritize recovery.",
        "Workout completed and logged. You're making steady progress toward your fitness goals."
      ],
      'recovery_tip': [
        "Prioritize sleep! Aim for 7-9 hours nightly for optimal muscle recovery and growth.",
        "Try active recovery: light walking, yoga, or stretching on rest days.",
        "Hydration is key! Drink water before, during, and after workouts for better performance and recovery."
      ]
    },
    'finance-agent': {
      'portfolio_analysis': [
        "Portfolio analysis complete. Your allocation is 60% stocks, 30% bonds, 10% crypto. Consider rebalancing quarterly.",
        "Your portfolio shows 12% annual return. Diversification is good, but consider adding international exposure.",
        "Portfolio review done. Risk level is moderate. Consider adding some defensive assets for stability."
      ],
      'risk_assessment': [
        "Risk assessment: Your portfolio has moderate risk exposure. Consider adding some treasury bonds for stability.",
        "Risk analysis shows your crypto allocation is high. Consider reducing to 5-10% of total portfolio.",
        "Your risk tolerance matches your allocation well. Monitor market conditions and adjust as needed."
      ],
      'yield_optimization': [
        "Current DeFi yields: ETH staking at 5.2%, USDC lending at 8.5%. Consider diversifying across protocols.",
        "Yield opportunities found: Compound Finance offering 6.8% APY on USDC. Risk level: Medium.",
        "DeFi yield analysis: Aave V3 has competitive rates. Consider starting with smaller amounts to test."
      ]
    }
  };

  const agentResponses = responses[agentId]?.[taskType];
  if (agentResponses && agentResponses.length > 0) {
    return agentResponses[Math.floor(Math.random() * agentResponses.length)];
  }
  
  return `Task completed successfully! Your request "${userPrompt}" has been processed.`;
};

export const useAgentInteraction = (userId: string = 'mock-user') => {
  const [isLoading, setIsLoading] = useState(false);
  const [lastResponse, setLastResponse] = useState<AgentInteractionResponse | null>(null);
  const { getUnlockedAgents, unlockAgent } = useAgentUnlocks('mock-wallet-address');
  const { isSubAgentUnlocked } = useSubAgentUnlocks(userId);
  const { isAgentUnlocked } = useWalletBalance();
  const { logAgentUnlock } = useXPLogging();

  // Validate agent ownership and context
  const validateAgentAccess = useCallback((agentId: string, subAgentId?: string): { valid: boolean; error?: string } => {
    // Check if master agent is unlocked
    const masterAgent = getAgentById(agentId);
    if (!masterAgent) {
      return { valid: false, error: 'Master agent not found' };
    }

    const isMasterUnlocked = isAgentUnlocked(masterAgent);
    if (!isMasterUnlocked) {
      return { valid: false, error: `Master agent "${masterAgent.name}" must be unlocked first` };
    }

    // If sub-agent is specified, check if it's unlocked
    if (subAgentId) {
      const subAgent = getSubAgent(agentId, subAgentId);
      if (!subAgent) {
        return { valid: false, error: 'Sub-agent not found' };
      }

      const isSubUnlocked = isSubAgentUnlocked(agentId, subAgentId);
      if (!isSubUnlocked) {
        return { valid: false, error: `Sub-agent "${subAgent.name}" must be unlocked first` };
      }
    }

    return { valid: true };
  }, [isAgentUnlocked, isSubAgentUnlocked]);

  // Get available tasks for an agent
  const getAvailableTasks = useCallback((agentId: string, subAgentId?: string): TaskDefinition[] => {
    const targetAgentId = subAgentId || agentId;
    return AGENT_TASKS[targetAgentId] || [];
  }, []);

  // Main interaction function
  const interactWithAgent = useCallback(async (request: AgentInteractionRequest): Promise<AgentInteractionResponse> => {
    setIsLoading(true);
    setLastResponse(null);

    try {
      // Validate agent access
      const validation = validateAgentAccess(request.agentId, request.subAgentId);
      if (!validation.valid) {
        return {
          success: false,
          error: validation.error,
          message: validation.error || 'Agent access validation failed'
        };
      }

      // Get task definition
      const targetAgentId = request.subAgentId || request.agentId;
      const tasks = AGENT_TASKS[targetAgentId];
      const task = tasks?.find(t => t.id === request.taskType);
      
      if (!task) {
        return {
          success: false,
          error: 'Task type not found',
          message: `Task "${request.taskType}" is not available for this agent`
        };
      }

      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 1500 + Math.random() * 1000));

      // Generate mock response
      const responseMessage = generateMockResponse(targetAgentId, request.taskType, request.userPrompt);

      // Log XP reward
      if (task.xpReward > 0) {
        logAgentUnlock(targetAgentId, `${task.name} completed`, 'sub');
      }

      // Log task completion
      const taskLogEntry = {
        id: `task-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`,
        agentId: targetAgentId,
        taskType: request.taskType,
        userPrompt: request.userPrompt,
        response: responseMessage,
        xpReward: task.xpReward,
        timestamp: new Date().toISOString(),
        status: 'completed' as const
      };

      // Store in localStorage for persistence
      const existingLogs = JSON.parse(localStorage.getItem('agentTaskLogs') || '[]');
      existingLogs.unshift(taskLogEntry);
      localStorage.setItem('agentTaskLogs', JSON.stringify(existingLogs));

      const response: AgentInteractionResponse = {
        success: true,
        message: responseMessage,
        data: {
          taskLogEntry,
          agentId: targetAgentId,
          taskName: task.name
        },
        xpReward: task.xpReward
      };

      setLastResponse(response);
      return response;

    } catch (error) {
      const errorResponse: AgentInteractionResponse = {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error occurred',
        message: 'Failed to interact with agent'
      };
      
      setLastResponse(errorResponse);
      return errorResponse;
    } finally {
      setIsLoading(false);
    }
  }, [validateAgentAccess, logAgentUnlock]);

  // Get task history for an agent
  const getTaskHistory = useCallback((agentId: string, limit: number = 10) => {
    const logs = JSON.parse(localStorage.getItem('agentTaskLogs') || '[]');
    return logs
      .filter((log: any) => log.agentId === agentId)
      .slice(0, limit);
  }, []);

  // Clear task history
  const clearTaskHistory = useCallback(() => {
    localStorage.removeItem('agentTaskLogs');
  }, []);

  return {
    interactWithAgent,
    getAvailableTasks,
    getTaskHistory,
    clearTaskHistory,
    isLoading,
    lastResponse,
    AGENT_TASKS
  };
};

export default useAgentInteraction;
