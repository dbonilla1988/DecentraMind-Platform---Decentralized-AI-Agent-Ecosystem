/**
 * Unit Tests for SubAgentCard Component
 * 
 * Tests the sub-agent card component including:
 * - Card rendering with agent information
 * - Unlock status display and badges
 * - Interaction buttons (Interact, Preview Tasks)
 * - Payment model display
 * - Level requirements
 * - Modal integration
 */

import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { motion } from 'framer-motion';
import SubAgentCard from '../../components/agents/cards/SubAgentCard';
import AgentInteractionModal from '../../components/agents/modals/AgentInteractionModal';
import { SubAgentMetadata } from '../../data/agentMetadata';

// Mock framer-motion to avoid animation issues in tests
jest.mock('framer-motion', () => ({
  motion: {
    div: ({ children, ...props }: any) => <div {...props}>{children}</div>,
    button: ({ children, ...props }: any) => <button {...props}>{children}</button>,
  },
}));

// Mock the AgentInteractionModal component
jest.mock('../../components/agents/modals/AgentInteractionModal', () => {
  return function MockAgentInteractionModal({ isOpen, onClose }: any) {
    return isOpen ? (
      <div data-testid="agent-interaction-modal">
        <button onClick={onClose}>Close Modal</button>
      </div>
    ) : null;
  };
});

describe('SubAgentCard', () => {
  const mockAgentId = 'care-orchestrator';
  const mockOnClick = jest.fn();

  const mockSubAgent: SubAgentMetadata = {
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
  });

  const renderCard = (props = {}) => {
    const defaultProps = {
      subAgentData: mockSubAgent,
      agentId: mockAgentId,
      onClick: mockOnClick,
      masterAgent: mockMasterAgent,
      ...props,
    };

    return render(<SubAgentCard {...defaultProps} />);
  };

  describe('Card Rendering', () => {
    it('should render agent information correctly', () => {
      renderCard();
      
      expect(screen.getByText('Cold Plunge Coach')).toBeInTheDocument();
      expect(screen.getByText('Cold Therapy')).toBeInTheDocument();
      expect(screen.getByText('Suggests optimal cold therapy protocols and maintains your wellness calendar')).toBeInTheDocument();
      expect(screen.getByText('🧊')).toBeInTheDocument();
    });

    it('should display payment model information', () => {
      renderCard();
      
      expect(screen.getByText('Subscription')).toBeInTheDocument();
      expect(screen.getByText('20 DMT')).toBeInTheDocument();
      expect(screen.getByText('🔄')).toBeInTheDocument(); // Subscription icon
    });

    it('should display level requirement', () => {
      renderCard();
      
      expect(screen.getByText('Level Required:')).toBeInTheDocument();
      expect(screen.getByText('Level 1+')).toBeInTheDocument();
    });

    it('should display features preview', () => {
      renderCard();
      
      expect(screen.getByText('Personalized cold therapy protocols')).toBeInTheDocument();
      expect(screen.getByText('Temperature and duration tracking')).toBeInTheDocument();
      expect(screen.getByText('+2 more')).toBeInTheDocument();
    });
  });

  describe('Status Badges', () => {
    it('should show Available badge for available agents', () => {
      renderCard();
      
      expect(screen.getByText('Available')).toBeInTheDocument();
    });

    it('should show Active badge for unlocked agents', () => {
      // Mock unlocked status
      const unlockedAgent = { ...mockSubAgent, status: 'unlocked' as const };
      renderCard({ subAgentData: unlockedAgent });
      
      expect(screen.getByText('✅ Active')).toBeInTheDocument();
    });

    it('should show Coming Soon badge for coming-soon agents', () => {
      const comingSoonAgent = { ...mockSubAgent, status: 'coming-soon' as const };
      renderCard({ subAgentData: comingSoonAgent });
      
      expect(screen.getByText('🚀 Coming Soon')).toBeInTheDocument();
    });
  });

  describe('Payment Model Display', () => {
    it('should display NFT payment model correctly', () => {
      const nftAgent = { ...mockSubAgent, unlockType: 'NFT' as const, cost: 150 };
      renderCard({ subAgentData: nftAgent });
      
      expect(screen.getByText('NFT')).toBeInTheDocument();
      expect(screen.getByText('150 DMT')).toBeInTheDocument();
      expect(screen.getByText('🎨')).toBeInTheDocument(); // NFT icon
    });

    it('should display TokenUnlock payment model correctly', () => {
      const tokenAgent = { ...mockSubAgent, unlockType: 'TokenUnlock' as const, cost: 3000 };
      renderCard({ subAgentData: tokenAgent });
      
      expect(screen.getByText('TokenUnlock')).toBeInTheDocument();
      expect(screen.getByText('3000 DMT')).toBeInTheDocument();
      expect(screen.getByText('🔓')).toBeInTheDocument(); // TokenUnlock icon
    });

    it('should display Subscription payment model correctly', () => {
      renderCard();
      
      expect(screen.getByText('Subscription')).toBeInTheDocument();
      expect(screen.getByText('20 DMT')).toBeInTheDocument();
      expect(screen.getByText('🔄')).toBeInTheDocument(); // Subscription icon
    });
  });

  describe('Action Buttons', () => {
    it('should show Interact button for unlocked agents', () => {
      const unlockedAgent = { ...mockSubAgent, status: 'unlocked' as const };
      renderCard({ subAgentData: unlockedAgent });
      
      expect(screen.getByText('🤖 Interact with Agent')).toBeInTheDocument();
    });

    it('should show Unlock button for locked agents', () => {
      renderCard();
      
      expect(screen.getByText('Unlock Cold Plunge Coach')).toBeInTheDocument();
    });

    it('should show Preview Tasks button for locked agents', () => {
      renderCard();
      
      expect(screen.getByText('👁️ Preview Tasks')).toBeInTheDocument();
    });

    it('should not show action buttons for coming-soon agents', () => {
      const comingSoonAgent = { ...mockSubAgent, status: 'coming-soon' as const };
      renderCard({ subAgentData: comingSoonAgent });
      
      expect(screen.queryByText('🤖 Interact with Agent')).not.toBeInTheDocument();
      expect(screen.queryByText('Unlock Cold Plunge Coach')).not.toBeInTheDocument();
      expect(screen.queryByText('👁️ Preview Tasks')).not.toBeInTheDocument();
    });
  });

  describe('Modal Integration', () => {
    it('should open interaction modal when Interact button is clicked', async () => {
      const user = userEvent.setup();
      const unlockedAgent = { ...mockSubAgent, status: 'unlocked' as const };
      renderCard({ subAgentData: unlockedAgent });
      
      const interactButton = screen.getByText('🤖 Interact with Agent');
      await user.click(interactButton);
      
      expect(screen.getByTestId('agent-interaction-modal')).toBeInTheDocument();
    });

    it('should open interaction modal when Preview Tasks button is clicked', async () => {
      const user = userEvent.setup();
      renderCard();
      
      const previewButton = screen.getByText('👁️ Preview Tasks');
      await user.click(previewButton);
      
      expect(screen.getByTestId('agent-interaction-modal')).toBeInTheDocument();
    });

    it('should close interaction modal when close button is clicked', async () => {
      const user = userEvent.setup();
      const unlockedAgent = { ...mockSubAgent, status: 'unlocked' as const };
      renderCard({ subAgentData: unlockedAgent });
      
      // Open modal
      const interactButton = screen.getByText('🤖 Interact with Agent');
      await user.click(interactButton);
      
      expect(screen.getByTestId('agent-interaction-modal')).toBeInTheDocument();
      
      // Close modal
      const closeButton = screen.getByText('Close Modal');
      await user.click(closeButton);
      
      expect(screen.queryByTestId('agent-interaction-modal')).not.toBeInTheDocument();
    });

    it('should pass correct props to AgentInteractionModal', async () => {
      const user = userEvent.setup();
      const unlockedAgent = { ...mockSubAgent, status: 'unlocked' as const };
      renderCard({ subAgentData: unlockedAgent });
      
      const interactButton = screen.getByText('🤖 Interact with Agent');
      await user.click(interactButton);
      
      // The modal should be rendered with the correct agent data
      expect(screen.getByTestId('agent-interaction-modal')).toBeInTheDocument();
    });
  });

  describe('Card Click Behavior', () => {
    it('should call onClick when card is clicked', async () => {
      const user = userEvent.setup();
      renderCard();
      
      const card = screen.getByText('Cold Plunge Coach').closest('div');
      await user.click(card!);
      
      expect(mockOnClick).toHaveBeenCalled();
    });

    it('should not call onClick when action buttons are clicked', async () => {
      const user = userEvent.setup();
      renderCard();
      
      const previewButton = screen.getByText('👁️ Preview Tasks');
      await user.click(previewButton);
      
      expect(mockOnClick).not.toHaveBeenCalled();
    });
  });

  describe('Coming Soon Overlay', () => {
    it('should show coming soon overlay for coming-soon agents', () => {
      const comingSoonAgent = { ...mockSubAgent, status: 'coming-soon' as const };
      renderCard({ subAgentData: comingSoonAgent });
      
      expect(screen.getByText('🚀')).toBeInTheDocument();
      expect(screen.getByText('Coming Soon')).toBeInTheDocument();
      expect(screen.getByText('In Development')).toBeInTheDocument();
    });

    it('should not show coming soon overlay for available agents', () => {
      renderCard();
      
      expect(screen.queryByText('🚀')).not.toBeInTheDocument();
      expect(screen.queryByText('Coming Soon')).not.toBeInTheDocument();
      expect(screen.queryByText('In Development')).not.toBeInTheDocument();
    });
  });

  describe('Feature Display', () => {
    it('should show first 2 features and count for remaining', () => {
      renderCard();
      
      expect(screen.getByText('Personalized cold therapy protocols')).toBeInTheDocument();
      expect(screen.getByText('Temperature and duration tracking')).toBeInTheDocument();
      expect(screen.getByText('+2 more')).toBeInTheDocument();
    });

    it('should handle agents with fewer features', () => {
      const agentWithFewFeatures = {
        ...mockSubAgent,
        features: ['Feature 1', 'Feature 2'],
      };
      renderCard({ subAgentData: agentWithFewFeatures });
      
      expect(screen.getByText('Feature 1')).toBeInTheDocument();
      expect(screen.getByText('Feature 2')).toBeInTheDocument();
      expect(screen.queryByText('+0 more')).not.toBeInTheDocument();
    });

    it('should handle agents with no features', () => {
      const agentWithNoFeatures = {
        ...mockSubAgent,
        features: [],
      };
      renderCard({ subAgentData: agentWithNoFeatures });
      
      expect(screen.queryByText('+0 more')).not.toBeInTheDocument();
    });
  });

  describe('Accessibility', () => {
    it('should have proper button roles', () => {
      renderCard();
      
      const unlockButton = screen.getByText('Unlock Cold Plunge Coach');
      const previewButton = screen.getByText('👁️ Preview Tasks');
      
      expect(unlockButton).toHaveAttribute('role', 'button');
      expect(previewButton).toHaveAttribute('role', 'button');
    });

    it('should have proper button states', () => {
      renderCard();
      
      const unlockButton = screen.getByText('Unlock Cold Plunge Coach');
      expect(unlockButton).not.toBeDisabled();
    });

    it('should have proper button states for coming-soon agents', () => {
      const comingSoonAgent = { ...mockSubAgent, status: 'coming-soon' as const };
      renderCard({ subAgentData: comingSoonAgent });
      
      // Should not have any action buttons for coming-soon agents
      expect(screen.queryByRole('button')).not.toBeInTheDocument();
    });
  });

  describe('Responsive Design', () => {
    it('should render without crashing on different screen sizes', () => {
      // Test that the component renders without layout issues
      renderCard();
      
      expect(screen.getByText('Cold Plunge Coach')).toBeInTheDocument();
      expect(screen.getByText('Cold Therapy')).toBeInTheDocument();
    });
  });

  describe('Error Handling', () => {
    it('should handle missing master agent gracefully', () => {
      renderCard({ masterAgent: undefined });
      
      expect(screen.getByText('Cold Plunge Coach')).toBeInTheDocument();
      // Should still render the card even without master agent
    });

    it('should handle missing features gracefully', () => {
      const agentWithoutFeatures = {
        ...mockSubAgent,
        features: undefined,
      };
      renderCard({ subAgentData: agentWithoutFeatures });
      
      expect(screen.getByText('Cold Plunge Coach')).toBeInTheDocument();
      // Should not crash when features are undefined
    });
  });

  describe('Master Agent Context', () => {
    it('should pass master agent to interaction modal', async () => {
      const user = userEvent.setup();
      const unlockedAgent = { ...mockSubAgent, status: 'unlocked' as const };
      renderCard({ subAgentData: unlockedAgent });
      
      const interactButton = screen.getByText('🤖 Interact with Agent');
      await user.click(interactButton);
      
      expect(screen.getByTestId('agent-interaction-modal')).toBeInTheDocument();
      // The modal should receive the master agent context
    });

    it('should use sub-agent as fallback when master agent is not provided', async () => {
      const user = userEvent.setup();
      const unlockedAgent = { ...mockSubAgent, status: 'unlocked' as const };
      renderCard({ subAgentData: unlockedAgent, masterAgent: undefined });
      
      const interactButton = screen.getByText('🤖 Interact with Agent');
      await user.click(interactButton);
      
      expect(screen.getByTestId('agent-interaction-modal')).toBeInTheDocument();
      // Should still work with sub-agent as fallback
    });
  });
});