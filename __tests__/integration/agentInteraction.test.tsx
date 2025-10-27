/**
 * Integration Tests for Agent Interaction System
 * 
 * Tests complete task scenarios including:
 * - Cold plunge scheduling workflow
 * - Mood logging with XP rewards
 * - Meditation guidance (NFT unlock only)
 * - Subscription-only agent tasks (Nutrition Coach)
 * - End-to-end user interactions
 * - Cross-component communication
 */

import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { useAgentInteraction } from '../../hooks/useAgentInteraction';
import { useWalletBalance } from '../../hooks/useWalletBalance';
import { useXPLogging } from '../../hooks/useXPLogging';
import SubAgentCard from '../../components/agents/cards/SubAgentCard';
import AgentInteractionModal from '../../components/agents/modals/AgentInteractionModal';
import { SubAgentMetadata } from '../../data/agentMetadata';
import { MockAgentWebSocketService } from '../../services/agentWebSocket';

// Mock all dependencies
jest.mock('../../hooks/useAgentInteraction');
jest.mock('../../hooks/useWalletBalance');
jest.mock('../../hooks/useXPLogging');
jest.mock('../../services/agentWebSocket');

const mockUseAgentInteraction = useAgentInteraction as jest.MockedFunction<typeof useAgentInteraction>;
const mockUseWalletBalance = useWalletBalance as jest.MockedFunction<typeof useWalletBalance>;
const mockUseXPLogging = useXPLogging as jest.MockedFunction<typeof useXPLogging>;

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

// Mock framer-motion
jest.mock('framer-motion', () => ({
  motion: {
    div: ({ children, ...props }: any) => <div {...props}>{children}</div>,
    button: ({ children, ...props }: any) => <button {...props}>{children}</button>,
  },
  AnimatePresence: ({ children }: any) => <>{children}</>,
}));

describe('Agent Interaction System Integration Tests', () => {
  const mockWalletAddress = 'mock-wallet-address';
  const mockAgentId = 'care-orchestrator';

  const mockColdPlungeAgent: SubAgentMetadata = {
    id: 'cold-plunge-coach',
    name: 'Cold Plunge Coach',
    category: 'Cold Therapy',
    unlockType: 'Subscription',
    cost: 20,
    levelRequired: 1,
    status: 'available',
    description: 'Suggests optimal cold therapy protocols and maintains your wellness calendar',
    features: [
      'Personalized cold therapy protocols',
      'Temperature and duration tracking',
      'Session scheduling',
      'Progress monitoring',
    ],
    icon: '🧊',
  };

  const mockMeditationAgent: SubAgentMetadata = {
    id: 'meditation-guide',
    name: 'Meditation Guide',
    category: 'Wellness',
    unlockType: 'NFT',
    cost: 150,
    levelRequired: 1,
    status: 'available',
    description: 'Personalized meditation sessions with progress tracking and mindfulness insights',
    features: [
      'Guided meditation sessions',
      'Progress tracking and analytics',
      'Mindfulness insights',
      'Custom meditation plans',
    ],
    icon: '🧘',
  };

  const mockNutritionAgent: SubAgentMetadata = {
    id: 'nutrition-coach',
    name: 'Nutrition Coach',
    category: 'Nutrition',
    unlockType: 'Subscription',
    cost: 30,
    levelRequired: 1,
    status: 'available',
    description: 'AI-powered nutrition guidance with meal planning and macro tracking',
    features: [
      'Personalized meal planning',
      'Macro and micronutrient tracking',
      'Nutritional analysis',
      'Diet recommendations',
    ],
    icon: '🥗',
  };

  const mockMasterAgent: SubAgentMetadata = {
    id: 'care-orchestrator',
    name: 'Care Orchestrator',
    category: 'Health & Wellness',
    unlockType: 'TokenUnlock',
    cost: 1000,
    levelRequired: 1,
    status: 'available',
    description: 'Master health agent',
    features: ['Health monitoring', 'Wellness tracking'],
    icon: '🏥',
  };

  beforeEach(() => {
    jest.clearAllMocks();
    localStorageMock.getItem.mockReturnValue(null);
    localStorageMock.setItem.mockImplementation(() => {});
    
    // Setup default mocks
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
  });

  describe('Cold Plunge Scheduling Workflow', () => {
    it('should complete end-to-end cold plunge scheduling', async () => {
      const user = userEvent.setup();
      const mockInteractWithAgent = jest.fn().mockResolvedValue({
        success: true,
        message: 'Cold plunge scheduled for 6am tomorrow! Temperature set to 10°C for 3 minutes.',
        data: {
          taskLogEntry: {
            id: 'task-123',
            agentId: 'cold-plunge-coach',
            taskType: 'cold_plunge_session',
            userPrompt: '6am tomorrow',
            response: 'Mock response',
            xpReward: 30,
            timestamp: new Date().toISOString(),
            status: 'completed',
          },
          agentId: 'cold-plunge-coach',
          taskName: 'Schedule Cold Plunge',
        },
        xpReward: 30,
      });

      mockUseAgentInteraction.mockReturnValue({
        interactWithAgent: mockInteractWithAgent,
        getAvailableTasks: jest.fn().mockReturnValue([
          {
            id: 'cold_plunge_session',
            name: 'Schedule Cold Plunge',
            description: 'Schedule a cold therapy session',
            xpReward: 30,
            category: 'scheduling',
            requiresInput: true,
            inputPlaceholder: 'When would you like to schedule?',
          },
        ]),
        getTaskHistory: jest.fn(),
        clearTaskHistory: jest.fn(),
        isLoading: false,
        lastResponse: null,
        AGENT_TASKS: {},
      });

      render(
        <SubAgentCard
          subAgentData={mockColdPlungeAgent}
          agentId={mockAgentId}
          onClick={jest.fn()}
          masterAgent={mockMasterAgent}
        />
      );

      // Step 1: Click Preview Tasks button
      const previewButton = screen.getByText('👁️ Preview Tasks');
      await user.click(previewButton);

      // Step 2: Select task
      await waitFor(() => {
        expect(screen.getByText('Schedule Cold Plunge')).toBeInTheDocument();
      });

      const taskButton = screen.getByText('Schedule Cold Plunge');
      await user.click(taskButton);

      // Step 3: Enter input
      await waitFor(() => {
        expect(screen.getByPlaceholderText('When would you like to schedule?')).toBeInTheDocument();
      });

      const inputField = screen.getByPlaceholderText('When would you like to schedule?');
      await user.type(inputField, '6am tomorrow');

      // Step 4: Execute task
      const executeButton = screen.getByText('Execute Task');
      await user.click(executeButton);

      // Step 5: Verify interaction was called
      await waitFor(() => {
        expect(mockInteractWithAgent).toHaveBeenCalledWith({
          agentId: mockAgentId,
          subAgentId: 'cold-plunge-coach',
          taskType: 'cold_plunge_session',
          userPrompt: '6am tomorrow',
          walletAddress: mockWalletAddress,
          metadata: {
            timestamp: expect.any(String),
            agentName: 'Cold Plunge Coach',
          },
        });
      });
    });

    it('should handle cold plunge scheduling with WebSocket updates', async () => {
      const mockWebSocketService = new MockAgentWebSocketService();
      const mockCallback = jest.fn();

      await mockWebSocketService.connect();
      mockWebSocketService.subscribe('task_update', mockCallback);

      // Simulate task execution
      mockWebSocketService.send({
        type: 'task_update',
        agentId: 'cold-plunge-coach',
        taskId: 'task-123',
        data: { status: 'processing', progress: 50 },
      });

      // Wait for simulated responses
      await new Promise(resolve => setTimeout(resolve, 1000));

      expect(mockCallback).toHaveBeenCalled();
    });
  });

  describe('Mood Logging with XP Rewards', () => {
    it('should complete mood logging and award XP', async () => {
      const user = userEvent.setup();
      const mockLogAgentUnlock = jest.fn();
      const mockInteractWithAgent = jest.fn().mockResolvedValue({
        success: true,
        message: 'Thank you for logging your mood. I\'ve recorded your emotional state and will track patterns over time.',
        data: {
          taskLogEntry: {
            id: 'task-456',
            agentId: 'care-orchestrator',
            taskType: 'mood_log',
            userPrompt: 'Feeling great today!',
            response: 'Mock response',
            xpReward: 15,
            timestamp: new Date().toISOString(),
            status: 'completed',
          },
          agentId: 'care-orchestrator',
          taskName: 'Log Mood',
        },
        xpReward: 15,
      });

      mockUseXPLogging.mockReturnValue({
        logAgentUnlock: mockLogAgentUnlock,
        getTotalXP: jest.fn().mockReturnValue(115), // Increased by 15
        getGlobalLevel: jest.fn().mockReturnValue(2),
        getTotalEarnings: jest.fn().mockReturnValue(500),
      });

      mockUseAgentInteraction.mockReturnValue({
        interactWithAgent: mockInteractWithAgent,
        getAvailableTasks: jest.fn().mockReturnValue([
          {
            id: 'mood_log',
            name: 'Log Mood',
            description: 'Record your current emotional state',
            xpReward: 15,
            category: 'wellness',
            requiresInput: true,
            inputPlaceholder: 'How are you feeling today? (1-10 scale)',
          },
        ]),
        getTaskHistory: jest.fn(),
        clearTaskHistory: jest.fn(),
        isLoading: false,
        lastResponse: null,
        AGENT_TASKS: {},
      });

      render(
        <AgentInteractionModal
          agent={mockMasterAgent}
          isOpen={true}
          onClose={jest.fn()}
          walletAddress={mockWalletAddress}
        />
      );

      // Select mood logging task
      const taskButton = screen.getByText('Log Mood');
      await user.click(taskButton);

      // Enter mood input
      const inputField = screen.getByPlaceholderText('How are you feeling today? (1-10 scale)');
      await user.type(inputField, 'Feeling great today!');

      // Execute task
      const executeButton = screen.getByText('Execute Task');
      await user.click(executeButton);

      // Verify XP was logged
      await waitFor(() => {
        expect(mockLogAgentUnlock).toHaveBeenCalledWith(
          'care-orchestrator',
          'Log Mood completed',
          'sub'
        );
      });

      // Verify task was executed
      expect(mockInteractWithAgent).toHaveBeenCalledWith({
        agentId: 'care-orchestrator',
        taskType: 'mood_log',
        userPrompt: 'Feeling great today!',
        walletAddress: mockWalletAddress,
        metadata: {
          timestamp: expect.any(String),
          agentName: 'Care Orchestrator',
        },
      });
    });
  });

  describe('Meditation Guidance (NFT Unlock Only)', () => {
    it('should handle meditation guidance for NFT-unlocked agents', async () => {
      const user = userEvent.setup();
      
      // Mock NFT ownership
      mockUseWalletBalance.mockReturnValue({
        balance: { dmt: 5000 },
        isAgentUnlocked: jest.fn()
          .mockReturnValueOnce(true) // Master agent unlocked
          .mockReturnValueOnce(true), // Meditation agent unlocked (NFT owned)
        updateBalance: jest.fn(),
      });

      const mockInteractWithAgent = jest.fn().mockResolvedValue({
        success: true,
        message: 'Starting your breathing meditation session. Focus on slow, deep breaths for 10 minutes.',
        data: {
          taskLogEntry: {
            id: 'task-789',
            agentId: 'meditation-guide',
            taskType: 'guided_session',
            userPrompt: 'breathing meditation',
            response: 'Mock response',
            xpReward: 30,
            timestamp: new Date().toISOString(),
            status: 'completed',
          },
          agentId: 'meditation-guide',
          taskName: 'Guided Meditation',
        },
        xpReward: 30,
      });

      mockUseAgentInteraction.mockReturnValue({
        interactWithAgent: mockInteractWithAgent,
        getAvailableTasks: jest.fn().mockReturnValue([
          {
            id: 'guided_session',
            name: 'Guided Meditation',
            description: 'Start a guided meditation session',
            xpReward: 30,
            category: 'session',
            requiresInput: true,
            inputPlaceholder: 'Meditation type (e.g., "breathing", "mindfulness")',
          },
        ]),
        getTaskHistory: jest.fn(),
        clearTaskHistory: jest.fn(),
        isLoading: false,
        lastResponse: null,
        AGENT_TASKS: {},
      });

      render(
        <SubAgentCard
          subAgentData={mockMeditationAgent}
          agentId={mockAgentId}
          onClick={jest.fn()}
          masterAgent={mockMasterAgent}
        />
      );

      // Should show Interact button for unlocked NFT agent
      const interactButton = screen.getByText('🤖 Interact with Agent');
      await user.click(interactButton);

      // Select guided meditation task
      await waitFor(() => {
        expect(screen.getByText('Guided Meditation')).toBeInTheDocument();
      });

      const taskButton = screen.getByText('Guided Meditation');
      await user.click(taskButton);

      // Enter meditation type
      const inputField = screen.getByPlaceholderText('Meditation type (e.g., "breathing", "mindfulness")');
      await user.type(inputField, 'breathing meditation');

      // Execute task
      const executeButton = screen.getByText('Execute Task');
      await user.click(executeButton);

      // Verify task was executed
      await waitFor(() => {
        expect(mockInteractWithAgent).toHaveBeenCalledWith({
          agentId: mockAgentId,
          subAgentId: 'meditation-guide',
          taskType: 'guided_session',
          userPrompt: 'breathing meditation',
          walletAddress: mockWalletAddress,
          metadata: {
            timestamp: expect.any(String),
            agentName: 'Meditation Guide',
          },
        });
      });
    });

    it('should reject interaction for non-NFT owners', async () => {
      // Mock no NFT ownership
      mockUseWalletBalance.mockReturnValue({
        balance: { dmt: 5000 },
        isAgentUnlocked: jest.fn()
          .mockReturnValueOnce(true) // Master agent unlocked
          .mockReturnValueOnce(false), // Meditation agent locked (no NFT)
        updateBalance: jest.fn(),
      });

      const mockInteractWithAgent = jest.fn().mockResolvedValue({
        success: false,
        error: 'Sub-agent "Meditation Guide" must be unlocked first',
        message: 'Sub-agent "Meditation Guide" must be unlocked first',
      });

      mockUseAgentInteraction.mockReturnValue({
        interactWithAgent: mockInteractWithAgent,
        getAvailableTasks: jest.fn().mockReturnValue([]),
        getTaskHistory: jest.fn(),
        clearTaskHistory: jest.fn(),
        isLoading: false,
        lastResponse: null,
        AGENT_TASKS: {},
      });

      render(
        <SubAgentCard
          subAgentData={mockMeditationAgent}
          agentId={mockAgentId}
          onClick={jest.fn()}
          masterAgent={mockMasterAgent}
        />
      );

      // Should show Preview Tasks button for locked agent
      const previewButton = screen.getByText('👁️ Preview Tasks');
      await user.click(previewButton);

      // Try to execute task (should fail)
      await waitFor(() => {
        expect(screen.getByText('Available Tasks')).toBeInTheDocument();
      });
    });
  });

  describe('Subscription-Only Agent Tasks (Nutrition Coach)', () => {
    it('should handle nutrition coach tasks for subscribers', async () => {
      const user = userEvent.setup();
      
      // Mock active subscription
      mockUseWalletBalance.mockReturnValue({
        balance: { dmt: 5000 },
        isAgentUnlocked: jest.fn()
          .mockReturnValueOnce(true) // Master agent unlocked
          .mockReturnValueOnce(true), // Nutrition agent unlocked (active subscription)
        updateBalance: jest.fn(),
      });

      const mockInteractWithAgent = jest.fn().mockResolvedValue({
        success: true,
        message: 'Here\'s your personalized meal plan: Breakfast - Greek yogurt with berries, Lunch - Grilled chicken salad, Dinner - Salmon with quinoa.',
        data: {
          taskLogEntry: {
            id: 'task-101',
            agentId: 'nutrition-coach',
            taskType: 'meal_plan',
            userPrompt: 'vegetarian diet',
            response: 'Mock response',
            xpReward: 30,
            timestamp: new Date().toISOString(),
            status: 'completed',
          },
          agentId: 'nutrition-coach',
          taskName: 'Meal Planning',
        },
        xpReward: 30,
      });

      mockUseAgentInteraction.mockReturnValue({
        interactWithAgent: mockInteractWithAgent,
        getAvailableTasks: jest.fn().mockReturnValue([
          {
            id: 'meal_plan',
            name: 'Meal Planning',
            description: 'Get personalized meal recommendations',
            xpReward: 30,
            category: 'planning',
            requiresInput: true,
            inputPlaceholder: 'Dietary preferences or restrictions',
          },
        ]),
        getTaskHistory: jest.fn(),
        clearTaskHistory: jest.fn(),
        isLoading: false,
        lastResponse: null,
        AGENT_TASKS: {},
      });

      render(
        <SubAgentCard
          subAgentData={mockNutritionAgent}
          agentId={mockAgentId}
          onClick={jest.fn()}
          masterAgent={mockMasterAgent}
        />
      );

      // Should show Interact button for subscribed agent
      const interactButton = screen.getByText('🤖 Interact with Agent');
      await user.click(interactButton);

      // Select meal planning task
      await waitFor(() => {
        expect(screen.getByText('Meal Planning')).toBeInTheDocument();
      });

      const taskButton = screen.getByText('Meal Planning');
      await user.click(taskButton);

      // Enter dietary preferences
      const inputField = screen.getByPlaceholderText('Dietary preferences or restrictions');
      await user.type(inputField, 'vegetarian diet');

      // Execute task
      const executeButton = screen.getByText('Execute Task');
      await user.click(executeButton);

      // Verify task was executed
      await waitFor(() => {
        expect(mockInteractWithAgent).toHaveBeenCalledWith({
          agentId: mockAgentId,
          subAgentId: 'nutrition-coach',
          taskType: 'meal_plan',
          userPrompt: 'vegetarian diet',
          walletAddress: mockWalletAddress,
          metadata: {
            timestamp: expect.any(String),
            agentName: 'Nutrition Coach',
          },
        });
      });
    });

    it('should reject interaction for non-subscribers', async () => {
      // Mock no active subscription
      mockUseWalletBalance.mockReturnValue({
        balance: { dmt: 5000 },
        isAgentUnlocked: jest.fn()
          .mockReturnValueOnce(true) // Master agent unlocked
          .mockReturnValueOnce(false), // Nutrition agent locked (no subscription)
        updateBalance: jest.fn(),
      });

      const mockInteractWithAgent = jest.fn().mockResolvedValue({
        success: false,
        error: 'Sub-agent "Nutrition Coach" must be unlocked first',
        message: 'Sub-agent "Nutrition Coach" must be unlocked first',
      });

      mockUseAgentInteraction.mockReturnValue({
        interactWithAgent: mockInteractWithAgent,
        getAvailableTasks: jest.fn().mockReturnValue([]),
        getTaskHistory: jest.fn(),
        clearTaskHistory: jest.fn(),
        isLoading: false,
        lastResponse: null,
        AGENT_TASKS: {},
      });

      render(
        <SubAgentCard
          subAgentData={mockNutritionAgent}
          agentId={mockAgentId}
          onClick={jest.fn()}
          masterAgent={mockMasterAgent}
        />
      );

      // Should show Preview Tasks button for locked agent
      const previewButton = screen.getByText('👁️ Preview Tasks');
      await user.click(previewButton);

      // Should not be able to execute tasks
      await waitFor(() => {
        expect(screen.getByText('Available Tasks')).toBeInTheDocument();
      });
    });
  });

  describe('Cross-Component Communication', () => {
    it('should maintain state consistency across components', async () => {
      const user = userEvent.setup();
      const mockOnClick = jest.fn();
      
      mockUseAgentInteraction.mockReturnValue({
        interactWithAgent: jest.fn().mockResolvedValue({
          success: true,
          message: 'Task completed',
          xpReward: 20,
        }),
        getAvailableTasks: jest.fn().mockReturnValue([]),
        getTaskHistory: jest.fn().mockReturnValue([
          {
            id: 'task-1',
            agentId: 'cold-plunge-coach',
            taskType: 'cold_plunge_session',
            userPrompt: '6am tomorrow',
            response: 'Mock response',
            xpReward: 30,
            timestamp: new Date().toISOString(),
            status: 'completed',
          },
        ]),
        clearTaskHistory: jest.fn(),
        isLoading: false,
        lastResponse: null,
        AGENT_TASKS: {},
      });

      render(
        <SubAgentCard
          subAgentData={mockColdPlungeAgent}
          agentId={mockAgentId}
          onClick={mockOnClick}
          masterAgent={mockMasterAgent}
        />
      );

      // Click card
      const card = screen.getByText('Cold Plunge Coach').closest('div');
      await user.click(card!);

      expect(mockOnClick).toHaveBeenCalled();
    });

    it('should handle multiple simultaneous interactions', async () => {
      const user = userEvent.setup();
      
      const mockInteractWithAgent = jest.fn()
        .mockResolvedValueOnce({
          success: true,
          message: 'First task completed',
          xpReward: 15,
        })
        .mockResolvedValueOnce({
          success: true,
          message: 'Second task completed',
          xpReward: 20,
        });

      mockUseAgentInteraction.mockReturnValue({
        interactWithAgent: mockInteractWithAgent,
        getAvailableTasks: jest.fn().mockReturnValue([
          {
            id: 'task1',
            name: 'Task 1',
            description: 'First task',
            xpReward: 15,
            category: 'test',
            requiresInput: false,
          },
          {
            id: 'task2',
            name: 'Task 2',
            description: 'Second task',
            xpReward: 20,
            category: 'test',
            requiresInput: false,
          },
        ]),
        getTaskHistory: jest.fn(),
        clearTaskHistory: jest.fn(),
        isLoading: false,
        lastResponse: null,
        AGENT_TASKS: {},
      });

      render(
        <AgentInteractionModal
          agent={mockMasterAgent}
          isOpen={true}
          onClose={jest.fn()}
          walletAddress={mockWalletAddress}
        />
      );

      // Execute first task
      const task1Button = screen.getByText('Task 1');
      await user.click(task1Button);
      
      const execute1Button = screen.getByText('Execute Task');
      await user.click(execute1Button);

      // Wait for completion
      await waitFor(() => {
        expect(mockInteractWithAgent).toHaveBeenCalledTimes(1);
      });

      // Execute second task
      const newTaskButton = screen.getByText('New Task');
      await user.click(newTaskButton);

      const task2Button = screen.getByText('Task 2');
      await user.click(task2Button);
      
      const execute2Button = screen.getByText('Execute Task');
      await user.click(execute2Button);

      // Wait for completion
      await waitFor(() => {
        expect(mockInteractWithAgent).toHaveBeenCalledTimes(2);
      });
    });
  });

  describe('Error Recovery and Edge Cases', () => {
    it('should handle network errors gracefully', async () => {
      const user = userEvent.setup();
      
      const mockInteractWithAgent = jest.fn().mockRejectedValue(new Error('Network error'));

      mockUseAgentInteraction.mockReturnValue({
        interactWithAgent: mockInteractWithAgent,
        getAvailableTasks: jest.fn().mockReturnValue([
          {
            id: 'test_task',
            name: 'Test Task',
            description: 'Test task',
            xpReward: 10,
            category: 'test',
            requiresInput: false,
          },
        ]),
        getTaskHistory: jest.fn(),
        clearTaskHistory: jest.fn(),
        isLoading: false,
        lastResponse: null,
        AGENT_TASKS: {},
      });

      render(
        <AgentInteractionModal
          agent={mockMasterAgent}
          isOpen={true}
          onClose={jest.fn()}
          walletAddress={mockWalletAddress}
        />
      );

      // Execute task that will fail
      const taskButton = screen.getByText('Test Task');
      await user.click(taskButton);
      
      const executeButton = screen.getByText('Execute Task');
      await user.click(executeButton);

      // Should handle error gracefully
      await waitFor(() => {
        expect(screen.getByText('Execute Task')).toBeInTheDocument();
      });
    });

    it('should handle localStorage errors gracefully', async () => {
      localStorageMock.setItem.mockImplementation(() => {
        throw new Error('localStorage error');
      });

      const user = userEvent.setup();
      
      const mockInteractWithAgent = jest.fn().mockResolvedValue({
        success: true,
        message: 'Task completed',
        xpReward: 10,
      });

      mockUseAgentInteraction.mockReturnValue({
        interactWithAgent: mockInteractWithAgent,
        getAvailableTasks: jest.fn().mockReturnValue([
          {
            id: 'test_task',
            name: 'Test Task',
            description: 'Test task',
            xpReward: 10,
            category: 'test',
            requiresInput: false,
          },
        ]),
        getTaskHistory: jest.fn(),
        clearTaskHistory: jest.fn(),
        isLoading: false,
        lastResponse: null,
        AGENT_TASKS: {},
      });

      render(
        <AgentInteractionModal
          agent={mockMasterAgent}
          isOpen={true}
          onClose={jest.fn()}
          walletAddress={mockWalletAddress}
        />
      );

      // Execute task
      const taskButton = screen.getByText('Test Task');
      await user.click(taskButton);
      
      const executeButton = screen.getByText('Execute Task');
      await user.click(executeButton);

      // Should still complete successfully despite localStorage error
      await waitFor(() => {
        expect(mockInteractWithAgent).toHaveBeenCalled();
      });
    });
  });
});
