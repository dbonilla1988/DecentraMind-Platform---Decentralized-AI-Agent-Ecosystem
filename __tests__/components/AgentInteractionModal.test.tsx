/**
 * Unit Tests for AgentInteractionModal Component
 * 
 * Tests the interactive modal component including:
 * - 3-step interaction flow (Select → Input → Response)
 * - Task selection and input handling
 * - Real-time feedback and loading states
 * - Success/error state management
 * - Modal open/close functionality
 */

import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { motion } from 'framer-motion';
import AgentInteractionModal from '../../components/agents/modals/AgentInteractionModal';
import { useAgentInteraction } from '../../hooks/useAgentInteraction';
import { AgentMetadata } from '../../data/agentMetadata';

// Mock framer-motion to avoid animation issues in tests
jest.mock('framer-motion', () => ({
  motion: {
    div: ({ children, ...props }: any) => <div {...props}>{children}</div>,
    button: ({ children, ...props }: any) => <button {...props}>{children}</button>,
  },
  AnimatePresence: ({ children }: any) => <>{children}</>,
}));

// Mock the useAgentInteraction hook
jest.mock('../../hooks/useAgentInteraction');
const mockUseAgentInteraction = useAgentInteraction as jest.MockedFunction<typeof useAgentInteraction>;

describe('AgentInteractionModal', () => {
  const mockWalletAddress = 'mock-wallet-address';
  const mockAgentId = 'care-orchestrator';
  const mockSubAgentId = 'cold-plunge-coach';

  const mockMasterAgent: AgentMetadata = {
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

  const mockSubAgent: AgentMetadata = {
    id: 'cold-plunge-coach',
    name: 'Cold Plunge Coach',
    category: 'Cold Therapy',
    unlockType: 'Subscription',
    cost: 20,
    levelRequired: 1,
    status: 'available',
    description: 'Cold therapy guidance',
    features: ['Temperature guidance', 'Session scheduling'],
    icon: '🧊',
  };

  const mockTasks = [
    {
      id: 'cold_plunge_session',
      name: 'Schedule Cold Plunge',
      description: 'Schedule a cold therapy session',
      xpReward: 30,
      category: 'scheduling',
      requiresInput: true,
      inputPlaceholder: 'When would you like to schedule?',
    },
    {
      id: 'temperature_guidance',
      name: 'Temperature Guidance',
      description: 'Get optimal temperature recommendations',
      xpReward: 20,
      category: 'advice',
      requiresInput: false,
    },
  ];

  const mockInteractWithAgent = jest.fn();
  const mockGetAvailableTasks = jest.fn();
  const mockOnClose = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
    
    mockUseAgentInteraction.mockReturnValue({
      interactWithAgent: mockInteractWithAgent,
      getAvailableTasks: mockGetAvailableTasks.mockReturnValue(mockTasks),
      getTaskHistory: jest.fn(),
      clearTaskHistory: jest.fn(),
      isLoading: false,
      lastResponse: null,
      AGENT_TASKS: {},
    });
  });

  const renderModal = (props = {}) => {
    const defaultProps = {
      agent: mockMasterAgent,
      subAgent: mockSubAgent,
      isOpen: true,
      onClose: mockOnClose,
      walletAddress: mockWalletAddress,
      ...props,
    };

    return render(<AgentInteractionModal {...defaultProps} />);
  };

  describe('Modal Rendering', () => {
    it('should render when isOpen is true', () => {
      renderModal();
      
      expect(screen.getByText('Cold Plunge Coach')).toBeInTheDocument();
      expect(screen.getByText('Sub-agent of Care Orchestrator')).toBeInTheDocument();
    });

    it('should not render when isOpen is false', () => {
      renderModal({ isOpen: false });
      
      expect(screen.queryByText('Cold Plunge Coach')).not.toBeInTheDocument();
    });

    it('should display correct agent information', () => {
      renderModal();
      
      expect(screen.getByText('Cold Plunge Coach')).toBeInTheDocument();
      expect(screen.getByText('Sub-agent of Care Orchestrator')).toBeInTheDocument();
      expect(screen.getByText('🧊')).toBeInTheDocument();
    });

    it('should display master agent when no sub-agent provided', () => {
      renderModal({ subAgent: undefined });
      
      expect(screen.getByText('Care Orchestrator')).toBeInTheDocument();
      expect(screen.getByText('Master Agent')).toBeInTheDocument();
    });
  });

  describe('Step 1: Task Selection', () => {
    it('should display available tasks', () => {
      renderModal();
      
      expect(screen.getByText('Available Tasks')).toBeInTheDocument();
      expect(screen.getByText('Schedule Cold Plunge')).toBeInTheDocument();
      expect(screen.getByText('Temperature Guidance')).toBeInTheDocument();
    });

    it('should show task details including XP reward', () => {
      renderModal();
      
      expect(screen.getByText('Schedule a cold therapy session')).toBeInTheDocument();
      expect(screen.getByText('+30 XP')).toBeInTheDocument();
      expect(screen.getByText('+20 XP')).toBeInTheDocument();
    });

    it('should show input requirement indicators', () => {
      renderModal();
      
      expect(screen.getByText('Input Required')).toBeInTheDocument();
    });

    it('should navigate to step 2 when task is selected', async () => {
      const user = userEvent.setup();
      renderModal();
      
      const taskButton = screen.getByText('Schedule Cold Plunge');
      await user.click(taskButton);
      
      expect(screen.getByText('Schedule Cold Plunge')).toBeInTheDocument();
      expect(screen.getByText('Schedule a cold therapy session')).toBeInTheDocument();
      expect(screen.getByText('+30 XP Reward')).toBeInTheDocument();
    });

    it('should show progress steps correctly', () => {
      renderModal();
      
      // Should show step 1 as active
      expect(screen.getByText('🎯')).toBeInTheDocument();
    });
  });

  describe('Step 2: Input Collection', () => {
    beforeEach(() => {
      // Start at step 2 by selecting a task
      renderModal();
      const taskButton = screen.getByText('Schedule Cold Plunge');
      fireEvent.click(taskButton);
    });

    it('should display selected task information', () => {
      expect(screen.getByText('Schedule Cold Plunge')).toBeInTheDocument();
      expect(screen.getByText('Schedule a cold therapy session')).toBeInTheDocument();
      expect(screen.getByText('+30 XP Reward')).toBeInTheDocument();
    });

    it('should show input field for tasks requiring input', () => {
      expect(screen.getByPlaceholderText('When would you like to schedule?')).toBeInTheDocument();
    });

    it('should show no input required message for tasks without input', async () => {
      const user = userEvent.setup();
      
      // Go back to step 1
      const backButton = screen.getByText('Back');
      await user.click(backButton);
      
      // Select task without input requirement
      const taskButton = screen.getByText('Temperature Guidance');
      await user.click(taskButton);
      
      expect(screen.getByText('This task will be executed automatically. No additional input required.')).toBeInTheDocument();
    });

    it('should allow user to enter input', async () => {
      const user = userEvent.setup();
      const inputField = screen.getByPlaceholderText('When would you like to schedule?');
      
      await user.type(inputField, '6am tomorrow');
      
      expect(inputField).toHaveValue('6am tomorrow');
    });

    it('should disable execute button when input is required but not provided', () => {
      const executeButton = screen.getByText('Execute Task');
      expect(executeButton).toBeDisabled();
    });

    it('should enable execute button when input is provided', async () => {
      const user = userEvent.setup();
      const inputField = screen.getByPlaceholderText('When would you like to schedule?');
      const executeButton = screen.getByText('Execute Task');
      
      await user.type(inputField, '6am tomorrow');
      
      expect(executeButton).not.toBeDisabled();
    });

    it('should navigate back to step 1 when back button is clicked', async () => {
      const user = userEvent.setup();
      const backButton = screen.getByText('Back');
      
      await user.click(backButton);
      
      expect(screen.getByText('Available Tasks')).toBeInTheDocument();
    });

    it('should execute task when execute button is clicked', async () => {
      const user = userEvent.setup();
      const inputField = screen.getByPlaceholderText('When would you like to schedule?');
      const executeButton = screen.getByText('Execute Task');
      
      await user.type(inputField, '6am tomorrow');
      await user.click(executeButton);
      
      expect(mockInteractWithAgent).toHaveBeenCalledWith({
        agentId: mockAgentId,
        subAgentId: mockSubAgentId,
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

  describe('Step 3: Response Display', () => {
    const mockSuccessResponse = {
      success: true,
      message: 'Cold plunge scheduled for 6am tomorrow! Temperature set to 10°C for 3 minutes.',
      data: {
        taskLogEntry: {
          id: 'task-123',
          agentId: mockSubAgentId,
          taskType: 'cold_plunge_session',
          userPrompt: '6am tomorrow',
          response: 'Mock response',
          xpReward: 30,
          timestamp: new Date().toISOString(),
          status: 'completed',
        },
        agentId: mockSubAgentId,
        taskName: 'Schedule Cold Plunge',
      },
      xpReward: 30,
    };

    const mockErrorResponse = {
      success: false,
      message: 'Task failed',
      error: 'Agent not unlocked',
    };

    beforeEach(() => {
      // Start at step 2
      renderModal();
      const taskButton = screen.getByText('Schedule Cold Plunge');
      fireEvent.click(taskButton);
    });

    it('should display success response', async () => {
      mockUseAgentInteraction.mockReturnValue({
        interactWithAgent: mockInteractWithAgent,
        getAvailableTasks: mockGetAvailableTasks.mockReturnValue(mockTasks),
        getTaskHistory: jest.fn(),
        clearTaskHistory: jest.fn(),
        isLoading: false,
        lastResponse: mockSuccessResponse,
        AGENT_TASKS: {},
      });

      // Re-render with success response
      renderModal();
      
      // Navigate to step 2 and execute
      const taskButton = screen.getByText('Schedule Cold Plunge');
      fireEvent.click(taskButton);
      
      const inputField = screen.getByPlaceholderText('When would you like to schedule?');
      fireEvent.change(inputField, { target: { value: '6am tomorrow' } });
      
      const executeButton = screen.getByText('Execute Task');
      fireEvent.click(executeButton);

      await waitFor(() => {
        expect(screen.getByText('Task Completed!')).toBeInTheDocument();
        expect(screen.getByText('+30 XP Earned')).toBeInTheDocument();
        expect(screen.getByText('Cold plunge scheduled for 6am tomorrow! Temperature set to 10°C for 3 minutes.')).toBeInTheDocument();
      });
    });

    it('should display error response', async () => {
      mockUseAgentInteraction.mockReturnValue({
        interactWithAgent: mockInteractWithAgent,
        getAvailableTasks: mockGetAvailableTasks.mockReturnValue(mockTasks),
        getTaskHistory: jest.fn(),
        clearTaskHistory: jest.fn(),
        isLoading: false,
        lastResponse: mockErrorResponse,
        AGENT_TASKS: {},
      });

      // Re-render with error response
      renderModal();
      
      // Navigate to step 2 and execute
      const taskButton = screen.getByText('Schedule Cold Plunge');
      fireEvent.click(taskButton);
      
      const inputField = screen.getByPlaceholderText('When would you like to schedule?');
      fireEvent.change(inputField, { target: { value: '6am tomorrow' } });
      
      const executeButton = screen.getByText('Execute Task');
      fireEvent.click(executeButton);

      await waitFor(() => {
        expect(screen.getByText('Task Failed')).toBeInTheDocument();
        expect(screen.getByText('Task failed')).toBeInTheDocument();
      });
    });

    it('should show task details in response', async () => {
      mockUseAgentInteraction.mockReturnValue({
        interactWithAgent: mockInteractWithAgent,
        getAvailableTasks: mockGetAvailableTasks.mockReturnValue(mockTasks),
        getTaskHistory: jest.fn(),
        clearTaskHistory: jest.fn(),
        isLoading: false,
        lastResponse: mockSuccessResponse,
        AGENT_TASKS: {},
      });

      renderModal();
      
      // Navigate to step 2 and execute
      const taskButton = screen.getByText('Schedule Cold Plunge');
      fireEvent.click(taskButton);
      
      const inputField = screen.getByPlaceholderText('When would you like to schedule?');
      fireEvent.change(inputField, { target: { value: '6am tomorrow' } });
      
      const executeButton = screen.getByText('Execute Task');
      fireEvent.click(executeButton);

      await waitFor(() => {
        expect(screen.getByText('Task Details:')).toBeInTheDocument();
        expect(screen.getByText('Task: cold_plunge_session')).toBeInTheDocument();
        expect(screen.getByText('Agent: cold-plunge-coach')).toBeInTheDocument();
      });
    });

    it('should allow starting new task from response', async () => {
      mockUseAgentInteraction.mockReturnValue({
        interactWithAgent: mockInteractWithAgent,
        getAvailableTasks: mockGetAvailableTasks.mockReturnValue(mockTasks),
        getTaskHistory: jest.fn(),
        clearTaskHistory: jest.fn(),
        isLoading: false,
        lastResponse: mockSuccessResponse,
        AGENT_TASKS: {},
      });

      renderModal();
      
      // Navigate to step 2 and execute
      const taskButton = screen.getByText('Schedule Cold Plunge');
      fireEvent.click(taskButton);
      
      const inputField = screen.getByPlaceholderText('When would you like to schedule?');
      fireEvent.change(inputField, { target: { value: '6am tomorrow' } });
      
      const executeButton = screen.getByText('Execute Task');
      fireEvent.click(executeButton);

      await waitFor(() => {
        const newTaskButton = screen.getByText('New Task');
        fireEvent.click(newTaskButton);
        
        expect(screen.getByText('Available Tasks')).toBeInTheDocument();
      });
    });

    it('should close modal when close button is clicked', async () => {
      mockUseAgentInteraction.mockReturnValue({
        interactWithAgent: mockInteractWithAgent,
        getAvailableTasks: mockGetAvailableTasks.mockReturnValue(mockTasks),
        getTaskHistory: jest.fn(),
        clearTaskHistory: jest.fn(),
        isLoading: false,
        lastResponse: mockSuccessResponse,
        AGENT_TASKS: {},
      });

      renderModal();
      
      // Navigate to step 2 and execute
      const taskButton = screen.getByText('Schedule Cold Plunge');
      fireEvent.click(taskButton);
      
      const inputField = screen.getByPlaceholderText('When would you like to schedule?');
      fireEvent.change(inputField, { target: { value: '6am tomorrow' } });
      
      const executeButton = screen.getByText('Execute Task');
      fireEvent.click(executeButton);

      await waitFor(() => {
        const closeButton = screen.getByText('Close');
        fireEvent.click(closeButton);
        
        expect(mockOnClose).toHaveBeenCalled();
      });
    });
  });

  describe('Loading States', () => {
    it('should show loading state during task execution', () => {
      mockUseAgentInteraction.mockReturnValue({
        interactWithAgent: mockInteractWithAgent,
        getAvailableTasks: mockGetAvailableTasks.mockReturnValue(mockTasks),
        getTaskHistory: jest.fn(),
        clearTaskHistory: jest.fn(),
        isLoading: true,
        lastResponse: null,
        AGENT_TASKS: {},
      });

      renderModal();
      
      // Navigate to step 2
      const taskButton = screen.getByText('Schedule Cold Plunge');
      fireEvent.click(taskButton);
      
      const inputField = screen.getByPlaceholderText('When would you like to schedule?');
      fireEvent.change(inputField, { target: { value: '6am tomorrow' } });
      
      const executeButton = screen.getByText('Execute Task');
      fireEvent.click(executeButton);

      expect(screen.getByText('Processing...')).toBeInTheDocument();
    });

    it('should disable execute button during loading', () => {
      mockUseAgentInteraction.mockReturnValue({
        interactWithAgent: mockInteractWithAgent,
        getAvailableTasks: mockGetAvailableTasks.mockReturnValue(mockTasks),
        getTaskHistory: jest.fn(),
        clearTaskHistory: jest.fn(),
        isLoading: true,
        lastResponse: null,
        AGENT_TASKS: {},
      });

      renderModal();
      
      // Navigate to step 2
      const taskButton = screen.getByText('Schedule Cold Plunge');
      fireEvent.click(taskButton);
      
      const inputField = screen.getByPlaceholderText('When would you like to schedule?');
      fireEvent.change(inputField, { target: { value: '6am tomorrow' } });
      
      const executeButton = screen.getByText('Execute Task');
      fireEvent.click(executeButton);

      expect(executeButton).toBeDisabled();
    });
  });

  describe('Modal Close Functionality', () => {
    it('should call onClose when close button is clicked', () => {
      renderModal();
      
      const closeButton = screen.getByRole('button', { name: /close/i });
      fireEvent.click(closeButton);
      
      expect(mockOnClose).toHaveBeenCalled();
    });

    it('should call onClose when clicking outside modal', () => {
      renderModal();
      
      const modalOverlay = screen.getByRole('dialog');
      fireEvent.click(modalOverlay);
      
      expect(mockOnClose).toHaveBeenCalled();
    });

    it('should not call onClose when clicking inside modal content', () => {
      renderModal();
      
      const modalContent = screen.getByText('Cold Plunge Coach');
      fireEvent.click(modalContent);
      
      expect(mockOnClose).not.toHaveBeenCalled();
    });
  });

  describe('Progress Steps', () => {
    it('should show correct step icons and progress', () => {
      renderModal();
      
      // Step 1 should be active
      expect(screen.getByText('🎯')).toBeInTheDocument();
    });

    it('should update progress when navigating between steps', async () => {
      const user = userEvent.setup();
      renderModal();
      
      // Step 1: Select task
      const taskButton = screen.getByText('Schedule Cold Plunge');
      await user.click(taskButton);
      
      // Should show step 2 active
      expect(screen.getByText('💬')).toBeInTheDocument();
    });
  });

  describe('Error Handling', () => {
    it('should handle empty task list gracefully', () => {
      mockGetAvailableTasks.mockReturnValue([]);
      
      renderModal();
      
      expect(screen.getByText('Available Tasks')).toBeInTheDocument();
      // Should not crash when no tasks are available
    });

    it('should handle interaction errors gracefully', async () => {
      mockInteractWithAgent.mockRejectedValue(new Error('Network error'));
      
      renderModal();
      
      // Navigate to step 2
      const taskButton = screen.getByText('Schedule Cold Plunge');
      fireEvent.click(taskButton);
      
      const inputField = screen.getByPlaceholderText('When would you like to schedule?');
      fireEvent.change(inputField, { target: { value: '6am tomorrow' } });
      
      const executeButton = screen.getByText('Execute Task');
      fireEvent.click(executeButton);

      // Should handle error gracefully without crashing
      await waitFor(() => {
        expect(screen.getByText('Execute Task')).toBeInTheDocument();
      });
    });
  });
});
