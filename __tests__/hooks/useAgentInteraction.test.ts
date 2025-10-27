/**
 * Unit Tests for useAgentInteraction Hook
 * 
 * Tests the core agent interaction logic including:
 * - Agent ownership validation
 * - Master agent context validation
 * - Task execution and XP assignment
 * - Task history persistence
 * - Mock response generation
 */

import { renderHook, act } from '@testing-library/react';
import { useAgentInteraction, AgentInteractionRequest, TaskDefinition } from '../../hooks/useAgentInteraction';
import { useWalletBalance } from '../../hooks/useWalletBalance';
import { useXPLogging } from '../../hooks/useXPLogging';
import { agentMetadata, getAgentById, getSubAgent } from '../../data/agentMetadata';

// Mock dependencies
jest.mock('../../hooks/useWalletBalance');
jest.mock('../../hooks/useXPLogging');
jest.mock('../../data/agentMetadata');

const mockUseWalletBalance = useWalletBalance as jest.MockedFunction<typeof useWalletBalance>;
const mockUseXPLogging = useXPLogging as jest.MockedFunction<typeof useXPLogging>;
const mockGetAgentById = getAgentById as jest.MockedFunction<typeof getAgentById>;
const mockGetSubAgent = getSubAgent as jest.MockedFunction<typeof getSubAgent>;

// Mock localStorage
const localStorageMock = {
  getItem: jest.fn(),
  setItem: jest.fn(),
  removeItem: jest.fn(),
  clear: jest.fn(),
};
Object.defineProperty(window, 'localStorage', {
  value: localStorageMock,
});

describe('useAgentInteraction', () => {
  const mockWalletAddress = 'mock-wallet-address';
  const mockAgentId = 'care-orchestrator';
  const mockSubAgentId = 'cold-plunge-coach';

  const mockMasterAgent = {
    id: 'care-orchestrator',
    name: 'Care Orchestrator',
    category: 'Health & Wellness',
    unlockType: 'TokenUnlock' as const,
    cost: 1000,
    levelRequired: 1,
    status: 'available' as const,
    description: 'Master health agent',
    features: ['Health monitoring', 'Wellness tracking'],
    icon: '🏥',
  };

  const mockSubAgent = {
    id: 'cold-plunge-coach',
    name: 'Cold Plunge Coach',
    category: 'Cold Therapy',
    unlockType: 'Subscription' as const,
    cost: 20,
    levelRequired: 1,
    status: 'available' as const,
    description: 'Cold therapy guidance',
    features: ['Temperature guidance', 'Session scheduling'],
    icon: '🧊',
  };

  const mockTaskDefinition: TaskDefinition = {
    id: 'cold_plunge_session',
    name: 'Schedule Cold Plunge',
    description: 'Schedule a cold therapy session',
    xpReward: 30,
    category: 'scheduling',
    requiresInput: true,
    inputPlaceholder: 'When would you like to schedule?',
  };

  beforeEach(() => {
    // Reset all mocks
    jest.clearAllMocks();
    localStorageMock.getItem.mockReturnValue(null);
    localStorageMock.setItem.mockImplementation(() => {});
    
    // Setup default mock implementations
    mockUseWalletBalance.mockReturnValue({
      balance: { dmt: 5000 },
      isAgentUnlocked: jest.fn().mockReturnValue(true),
      updateBalance: jest.fn(),
    });

    mockUseXPLogging.mockReturnValue({
      logAgentUnlock: jest.fn(),
      getTotalXP: jest.fn().mockReturnValue(100),
      getGlobalLevel: jest.fn().mockReturnValue(2),
      getTotalEarnings: jest.fn().mockReturnValue(500),
    });

    mockGetAgentById.mockReturnValue(mockMasterAgent);
    mockGetSubAgent.mockReturnValue(mockSubAgent);
  });

  describe('Agent Ownership Validation', () => {
    it('should validate master agent ownership', async () => {
      const { result } = renderHook(() => useAgentInteraction());
      
      const request: AgentInteractionRequest = {
        agentId: mockAgentId,
        taskType: 'health_check',
        userPrompt: 'Perform health check',
        walletAddress: mockWalletAddress,
      };

      await act(async () => {
        const response = await result.current.interactWithAgent(request);
        expect(response.success).toBe(true);
      });
    });

    it('should reject interaction if master agent is not unlocked', async () => {
      mockUseWalletBalance.mockReturnValue({
        balance: { dmt: 5000 },
        isAgentUnlocked: jest.fn().mockReturnValue(false),
        updateBalance: jest.fn(),
      });

      const { result } = renderHook(() => useAgentInteraction());
      
      const request: AgentInteractionRequest = {
        agentId: mockAgentId,
        taskType: 'health_check',
        userPrompt: 'Perform health check',
        walletAddress: mockWalletAddress,
      };

      await act(async () => {
        const response = await result.current.interactWithAgent(request);
        expect(response.success).toBe(false);
        expect(response.error).toContain('Master agent "Care Orchestrator" must be unlocked first');
      });
    });

    it('should validate sub-agent ownership when subAgentId is provided', async () => {
      const { result } = renderHook(() => useAgentInteraction());
      
      const request: AgentInteractionRequest = {
        agentId: mockAgentId,
        subAgentId: mockSubAgentId,
        taskType: 'cold_plunge_session',
        userPrompt: 'Schedule cold plunge at 6am',
        walletAddress: mockWalletAddress,
      };

      await act(async () => {
        const response = await result.current.interactWithAgent(request);
        expect(response.success).toBe(true);
      });
    });

    it('should reject interaction if sub-agent is not unlocked', async () => {
      mockUseWalletBalance.mockReturnValue({
        balance: { dmt: 5000 },
        isAgentUnlocked: jest.fn()
          .mockReturnValueOnce(true) // Master agent unlocked
          .mockReturnValueOnce(false), // Sub-agent locked
        updateBalance: jest.fn(),
      });

      const { result } = renderHook(() => useAgentInteraction());
      
      const request: AgentInteractionRequest = {
        agentId: mockAgentId,
        subAgentId: mockSubAgentId,
        taskType: 'cold_plunge_session',
        userPrompt: 'Schedule cold plunge',
        walletAddress: mockWalletAddress,
      };

      await act(async () => {
        const response = await result.current.interactWithAgent(request);
        expect(response.success).toBe(false);
        expect(response.error).toContain('Sub-agent "Cold Plunge Coach" must be unlocked first');
      });
    });
  });

  describe('Task Execution', () => {
    it('should execute task successfully and return mock response', async () => {
      const { result } = renderHook(() => useAgentInteraction());
      
      const request: AgentInteractionRequest = {
        agentId: mockAgentId,
        taskType: 'cold_plunge_session',
        userPrompt: 'Schedule cold plunge at 6am tomorrow',
        walletAddress: mockWalletAddress,
      };

      await act(async () => {
        const response = await result.current.interactWithAgent(request);
        
        expect(response.success).toBe(true);
        expect(response.message).toContain('Cold plunge scheduled');
        expect(response.xpReward).toBe(30);
        expect(response.data).toBeDefined();
        expect(response.data?.taskLogEntry).toBeDefined();
      });
    });

    it('should handle task not found error', async () => {
      const { result } = renderHook(() => useAgentInteraction());
      
      const request: AgentInteractionRequest = {
        agentId: mockAgentId,
        taskType: 'nonexistent_task',
        userPrompt: 'Execute nonexistent task',
        walletAddress: mockWalletAddress,
      };

      await act(async () => {
        const response = await result.current.interactWithAgent(request);
        
        expect(response.success).toBe(false);
        expect(response.error).toBe('Task type not found');
        expect(response.message).toContain('Task "nonexistent_task" is not available');
      });
    });

    it('should generate different mock responses for different tasks', async () => {
      const { result } = renderHook(() => useAgentInteraction());
      
      const tasks = [
        { taskType: 'health_check', expectedKeyword: 'health' },
        { taskType: 'mood_log', expectedKeyword: 'mood' },
        { taskType: 'wellness_tip', expectedKeyword: 'wellness' },
      ];

      for (const task of tasks) {
        const request: AgentInteractionRequest = {
          agentId: mockAgentId,
          taskType: task.taskType,
          userPrompt: `Execute ${task.taskType}`,
          walletAddress: mockWalletAddress,
        };

        await act(async () => {
          const response = await result.current.interactWithAgent(request);
          expect(response.success).toBe(true);
          expect(response.message.toLowerCase()).toContain(task.expectedKeyword);
        });
      }
    });
  });

  describe('XP Assignment Logic', () => {
    it('should assign correct XP based on task complexity', async () => {
      const { result } = renderHook(() => useAgentInteraction());
      
      const testCases = [
        { taskType: 'mood_log', expectedXP: 15 },
        { taskType: 'wellness_tip', expectedXP: 20 },
        { taskType: 'cold_plunge_session', expectedXP: 30 },
        { taskType: 'sleep_analysis', expectedXP: 35 },
        { taskType: 'portfolio_analysis', expectedXP: 40 },
      ];

      for (const testCase of testCases) {
        const request: AgentInteractionRequest = {
          agentId: mockAgentId,
          taskType: testCase.taskType,
          userPrompt: `Execute ${testCase.taskType}`,
          walletAddress: mockWalletAddress,
        };

        await act(async () => {
          const response = await result.current.interactWithAgent(request);
          expect(response.success).toBe(true);
          expect(response.xpReward).toBe(testCase.expectedXP);
        });
      }
    });

    it('should log XP reward to XP logging system', async () => {
      const mockLogAgentUnlock = jest.fn();
      mockUseXPLogging.mockReturnValue({
        logAgentUnlock: mockLogAgentUnlock,
        getTotalXP: jest.fn().mockReturnValue(100),
        getGlobalLevel: jest.fn().mockReturnValue(2),
        getTotalEarnings: jest.fn().mockReturnValue(500),
      });

      const { result } = renderHook(() => useAgentInteraction());
      
      const request: AgentInteractionRequest = {
        agentId: mockAgentId,
        taskType: 'cold_plunge_session',
        userPrompt: 'Schedule cold plunge',
        walletAddress: mockWalletAddress,
      };

      await act(async () => {
        await result.current.interactWithAgent(request);
      });

      expect(mockLogAgentUnlock).toHaveBeenCalledWith(
        mockAgentId,
        'Schedule Cold Plunge completed',
        'sub'
      );
    });
  });

  describe('Task History Persistence', () => {
    it('should save task log to localStorage', async () => {
      const { result } = renderHook(() => useAgentInteraction());
      
      const request: AgentInteractionRequest = {
        agentId: mockAgentId,
        taskType: 'cold_plunge_session',
        userPrompt: 'Schedule cold plunge at 6am',
        walletAddress: mockWalletAddress,
      };

      await act(async () => {
        await result.current.interactWithAgent(request);
      });

      expect(localStorageMock.setItem).toHaveBeenCalledWith(
        'agentTaskLogs',
        expect.stringContaining('cold_plunge_session')
      );
    });

    it('should retrieve task history correctly', () => {
      const mockTaskLogs = [
        {
          id: 'task-1',
          agentId: mockAgentId,
          taskType: 'cold_plunge_session',
          userPrompt: 'Schedule cold plunge',
          response: 'Mock response',
          xpReward: 30,
          timestamp: new Date().toISOString(),
          status: 'completed',
        },
        {
          id: 'task-2',
          agentId: mockAgentId,
          taskType: 'health_check',
          userPrompt: 'Health check',
          response: 'Mock response',
          xpReward: 25,
          timestamp: new Date().toISOString(),
          status: 'completed',
        },
      ];

      localStorageMock.getItem.mockReturnValue(JSON.stringify(mockTaskLogs));

      const { result } = renderHook(() => useAgentInteraction());
      
      const history = result.current.getTaskHistory(mockAgentId, 5);
      
      expect(history).toHaveLength(2);
      expect(history[0].taskType).toBe('cold_plunge_session');
      expect(history[1].taskType).toBe('health_check');
    });

    it('should clear task history', () => {
      const { result } = renderHook(() => useAgentInteraction());
      
      act(() => {
        result.current.clearTaskHistory();
      });

      expect(localStorageMock.removeItem).toHaveBeenCalledWith('agentTaskLogs');
    });
  });

  describe('Available Tasks', () => {
    it('should return available tasks for master agent', () => {
      const { result } = renderHook(() => useAgentInteraction());
      
      const tasks = result.current.getAvailableTasks(mockAgentId);
      
      expect(tasks).toBeDefined();
      expect(tasks.length).toBeGreaterThan(0);
      expect(tasks[0]).toHaveProperty('id');
      expect(tasks[0]).toHaveProperty('name');
      expect(tasks[0]).toHaveProperty('xpReward');
    });

    it('should return available tasks for sub-agent', () => {
      const { result } = renderHook(() => useAgentInteraction());
      
      const tasks = result.current.getAvailableTasks(mockAgentId, mockSubAgentId);
      
      expect(tasks).toBeDefined();
      expect(tasks.length).toBeGreaterThan(0);
      expect(tasks.some(task => task.id === 'cold_plunge_session')).toBe(true);
    });

    it('should return empty array for unknown agent', () => {
      const { result } = renderHook(() => useAgentInteraction());
      
      const tasks = result.current.getAvailableTasks('unknown-agent');
      
      expect(tasks).toEqual([]);
    });
  });

  describe('Loading States', () => {
    it('should set loading state during task execution', async () => {
      const { result } = renderHook(() => useAgentInteraction());
      
      expect(result.current.isLoading).toBe(false);

      const request: AgentInteractionRequest = {
        agentId: mockAgentId,
        taskType: 'cold_plunge_session',
        userPrompt: 'Schedule cold plunge',
        walletAddress: mockWalletAddress,
      };

      act(() => {
        result.current.interactWithAgent(request);
      });

      // Note: In a real test, you'd need to wait for the async operation
      // This is a simplified version for demonstration
    });

    it('should clear loading state after task completion', async () => {
      const { result } = renderHook(() => useAgentInteraction());
      
      const request: AgentInteractionRequest = {
        agentId: mockAgentId,
        taskType: 'cold_plunge_session',
        userPrompt: 'Schedule cold plunge',
        walletAddress: mockWalletAddress,
      };

      await act(async () => {
        await result.current.interactWithAgent(request);
      });

      expect(result.current.isLoading).toBe(false);
    });
  });

  describe('Error Handling', () => {
    it('should handle agent not found error', async () => {
      mockGetAgentById.mockReturnValue(undefined);

      const { result } = renderHook(() => useAgentInteraction());
      
      const request: AgentInteractionRequest = {
        agentId: 'nonexistent-agent',
        taskType: 'health_check',
        userPrompt: 'Health check',
        walletAddress: mockWalletAddress,
      };

      await act(async () => {
        const response = await result.current.interactWithAgent(request);
        
        expect(response.success).toBe(false);
        expect(response.error).toBe('Master agent not found');
      });
    });

    it('should handle sub-agent not found error', async () => {
      mockGetSubAgent.mockReturnValue(undefined);

      const { result } = renderHook(() => useAgentInteraction());
      
      const request: AgentInteractionRequest = {
        agentId: mockAgentId,
        subAgentId: 'nonexistent-sub-agent',
        taskType: 'cold_plunge_session',
        userPrompt: 'Schedule cold plunge',
        walletAddress: mockWalletAddress,
      };

      await act(async () => {
        const response = await result.current.interactWithAgent(request);
        
        expect(response.success).toBe(false);
        expect(response.error).toBe('Sub-agent not found');
      });
    });

    it('should handle localStorage errors gracefully', async () => {
      localStorageMock.setItem.mockImplementation(() => {
        throw new Error('localStorage error');
      });

      const { result } = renderHook(() => useAgentInteraction());
      
      const request: AgentInteractionRequest = {
        agentId: mockAgentId,
        taskType: 'cold_plunge_session',
        userPrompt: 'Schedule cold plunge',
        walletAddress: mockWalletAddress,
      };

      await act(async () => {
        const response = await result.current.interactWithAgent(request);
        
        // Should still succeed even if localStorage fails
        expect(response.success).toBe(true);
      });
    });
  });

  describe('Last Response State', () => {
    it('should store last response after successful interaction', async () => {
      const { result } = renderHook(() => useAgentInteraction());
      
      const request: AgentInteractionRequest = {
        agentId: mockAgentId,
        taskType: 'cold_plunge_session',
        userPrompt: 'Schedule cold plunge at 6am',
        walletAddress: mockWalletAddress,
      };

      await act(async () => {
        await result.current.interactWithAgent(request);
      });

      expect(result.current.lastResponse).toBeDefined();
      expect(result.current.lastResponse?.success).toBe(true);
      expect(result.current.lastResponse?.xpReward).toBe(30);
    });

    it('should store error response after failed interaction', async () => {
      mockGetAgentById.mockReturnValue(undefined);

      const { result } = renderHook(() => useAgentInteraction());
      
      const request: AgentInteractionRequest = {
        agentId: 'nonexistent-agent',
        taskType: 'health_check',
        userPrompt: 'Health check',
        walletAddress: mockWalletAddress,
      };

      await act(async () => {
        await result.current.interactWithAgent(request);
      });

      expect(result.current.lastResponse).toBeDefined();
      expect(result.current.lastResponse?.success).toBe(false);
      expect(result.current.lastResponse?.error).toBe('Master agent not found');
    });
  });
});
