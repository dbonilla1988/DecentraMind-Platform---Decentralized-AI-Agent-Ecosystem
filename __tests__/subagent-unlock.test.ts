/**
 * Unit Tests for Sub-Agent Unlock System
 * Tests unlock logic, XP rewards, and UI components
 */

import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { useSubAgentUnlocks } from '../app/hooks/useSubAgentUnlocks';
import { unlockPersistence } from '../app/services/unlockPersistence';
import { calculateXPReward } from '../app/data/xpHistory';
import SubAgentCard from '../app/components/agents/cards/SubAgentCard';
import SubAgentModal from '../app/components/agents/modals/SubAgentModal';
import { SubAgentMetadata } from '../app/data/agentMetadata';

// Mock the hooks
jest.mock('../app/hooks/useWalletBalance', () => ({
  useWalletBalance: () => ({
    balance: { dmt: 10000 },
    deductTokens: jest.fn()
  })
}));

jest.mock('../app/hooks/useXPLogging', () => ({
  useXPLogging: () => ({
    logXP: jest.fn()
  })
}));

jest.mock('../app/hooks/useContractStatus', () => ({
  useContractStatus: () => ({
    contractStatus: { isUnlocked: false, isLoading: false },
    executeUnlock: jest.fn(),
    isProcessing: false
  })
}));

// Mock localStorage
const localStorageMock = {
  getItem: jest.fn(),
  setItem: jest.fn(),
  removeItem: jest.fn(),
  clear: jest.fn(),
};
Object.defineProperty(window, 'localStorage', {
  value: localStorageMock
});

describe('Sub-Agent Unlock System', () => {
  beforeEach(() => {
    localStorageMock.getItem.mockReturnValue(null);
    localStorageMock.setItem.mockClear();
    localStorageMock.getItem.mockClear();
  });

  describe('XP Reward Calculation', () => {
    test('should calculate correct XP rewards based on cost', () => {
      expect(calculateXPReward(25)).toBe(20);    // Basic agent
      expect(calculateXPReward(1000)).toBe(30);   // Mid-tier agent
      expect(calculateXPReward(4000)).toBe(50);   // High-tier agent
      expect(calculateXPReward(5000)).toBe(50);   // High-tier agent
    });
  });

  describe('Unlock Persistence', () => {
    test('should save unlock to localStorage', async () => {
      const result = await unlockPersistence.saveUnlock(
        'test-user',
        'care-orchestrator',
        'vitals-tracker',
        {
          unlockMethod: 'TokenUnlock',
          transactionHash: '0x123',
          metadata: { cost: 25 }
        }
      );

      expect(result).toBe(true);
      expect(localStorageMock.setItem).toHaveBeenCalled();
    });

    test('should retrieve unlocks from localStorage', async () => {
      const mockUnlocks = JSON.stringify([
        {
          id: 'test-user-care-orchestrator-vitals-tracker',
          userId: 'test-user',
          agentId: 'care-orchestrator',
          subAgentId: 'vitals-tracker',
          unlockMethod: 'TokenUnlock',
          unlockedAt: new Date().toISOString(),
          transactionHash: '0x123'
        }
      ]);
      
      localStorageMock.getItem.mockReturnValue(mockUnlocks);

      const unlocks = await unlockPersistence.getUnlocks('test-user');
      
      expect(unlocks).toHaveLength(1);
      expect(unlocks[0].subAgentId).toBe('vitals-tracker');
    });

    test('should check unlock status correctly', async () => {
      const mockUnlocks = JSON.stringify([
        {
          id: 'test-user-care-orchestrator-vitals-tracker',
          userId: 'test-user',
          agentId: 'care-orchestrator',
          subAgentId: 'vitals-tracker',
          unlockMethod: 'TokenUnlock',
          unlockedAt: new Date().toISOString()
        }
      ]);
      
      localStorageMock.getItem.mockReturnValue(mockUnlocks);

      const isUnlocked = await unlockPersistence.isUnlocked(
        'test-user',
        'care-orchestrator',
        'vitals-tracker'
      );
      
      expect(isUnlocked).toBe(true);
    });
  });

  describe('SubAgentCard Component', () => {
    const mockSubAgent: SubAgentMetadata = {
      id: 'vitals-tracker',
      name: 'Vitals Tracker',
      description: 'Monitors real-time patient vitals and health metrics',
      unlockType: 'TokenUnlock',
      cost: 25,
      levelRequired: 2,
      status: 'available',
      category: 'Health Monitoring',
      icon: '📊',
      features: ['Heart Rate Monitoring', 'Blood Pressure Tracking'],
      tokenAddress: 'DMT_TOKEN_ADDRESS'
    };

    test('should render sub-agent card with correct information', () => {
      render(
        <SubAgentCard
          subAgentData={mockSubAgent}
          agentId="care-orchestrator"
          onClick={() => {}}
        />
      );

      expect(screen.getByText('Vitals Tracker')).toBeInTheDocument();
      expect(screen.getByText('Health Monitoring')).toBeInTheDocument();
      expect(screen.getByText('Unlock (25 DMT)')).toBeInTheDocument();
    });

    test('should show Active status when unlocked', () => {
      // Mock the hook to return unlocked status
      jest.mocked(useSubAgentUnlocks).mockReturnValue({
        unlockedSubAgents: ['care-orchestrator-vitals-tracker'],
        isLoading: false,
        error: null,
        isSubAgentUnlocked: jest.fn().mockReturnValue(true),
        unlockSubAgent: jest.fn(),
        refreshUnlocks: jest.fn()
      });

      render(
        <SubAgentCard
          subAgentData={mockSubAgent}
          agentId="care-orchestrator"
          onClick={() => {}}
        />
      );

      expect(screen.getByText('✅ Active')).toBeInTheDocument();
    });

    test('should show insufficient balance warning', () => {
      // Mock low balance
      jest.mocked(useWalletBalance).mockReturnValue({
        balance: { dmt: 10 }, // Less than required 25
        deductTokens: jest.fn()
      });

      render(
        <SubAgentCard
          subAgentData={mockSubAgent}
          agentId="care-orchestrator"
          onClick={() => {}}
        />
      );

      expect(screen.getByText('Insufficient DMT balance')).toBeInTheDocument();
    });
  });

  describe('SubAgentModal Component', () => {
    const mockSubAgent: SubAgentMetadata = {
      id: 'meditation-guide',
      name: 'Meditation Guide',
      description: 'Personalized meditation sessions with progress tracking',
      unlockType: 'NFT',
      cost: 150,
      levelRequired: 1,
      status: 'available',
      category: 'Wellness',
      icon: '🧘',
      features: ['Guided meditation sessions', 'Progress tracking'],
      contractAddress: '0x1234567890abcdef'
    };

    test('should render modal with sub-agent information', () => {
      render(
        <SubAgentModal
          subAgentData={mockSubAgent}
          agentId="care-orchestrator"
          isOpen={true}
          onClose={() => {}}
        />
      );

      expect(screen.getByText('Meditation Guide')).toBeInTheDocument();
      expect(screen.getByText('Personalized meditation sessions with progress tracking')).toBeInTheDocument();
      expect(screen.getByText('Mint NFT (150 DMT)')).toBeInTheDocument();
    });

    test('should show success message after unlock', async () => {
      const mockUnlockSubAgent = jest.fn().mockResolvedValue({
        success: true,
        transactionHash: '0x123',
        tokenId: 'NFT123'
      });

      jest.mocked(useSubAgentUnlocks).mockReturnValue({
        unlockedSubAgents: [],
        isLoading: false,
        error: null,
        isSubAgentUnlocked: jest.fn().mockReturnValue(false),
        unlockSubAgent: mockUnlockSubAgent,
        refreshUnlocks: jest.fn()
      });

      render(
        <SubAgentModal
          subAgentData={mockSubAgent}
          agentId="care-orchestrator"
          isOpen={true}
          onClose={() => {}}
        />
      );

      const unlockButton = screen.getByText('Mint NFT (150 DMT)');
      fireEvent.click(unlockButton);

      await waitFor(() => {
        expect(screen.getByText('Sub-Agent Unlocked!')).toBeInTheDocument();
        expect(screen.getByText('+30 XP earned!')).toBeInTheDocument();
      });
    });

    test('should show error message on unlock failure', async () => {
      const mockUnlockSubAgent = jest.fn().mockResolvedValue({
        success: false,
        error: 'Insufficient token balance'
      });

      jest.mocked(useSubAgentUnlocks).mockReturnValue({
        unlockedSubAgents: [],
        isLoading: false,
        error: null,
        isSubAgentUnlocked: jest.fn().mockReturnValue(false),
        unlockSubAgent: mockUnlockSubAgent,
        refreshUnlocks: jest.fn()
      });

      render(
        <SubAgentModal
          subAgentData={mockSubAgent}
          agentId="care-orchestrator"
          isOpen={true}
          onClose={() => {}}
        />
      );

      const unlockButton = screen.getByText('Mint NFT (150 DMT)');
      fireEvent.click(unlockButton);

      await waitFor(() => {
        expect(screen.getByText('Unlock Failed')).toBeInTheDocument();
        expect(screen.getByText('Insufficient token balance')).toBeInTheDocument();
      });
    });
  });

  describe('Edge Cases', () => {
    test('should handle network error during unlock', async () => {
      const mockUnlockSubAgent = jest.fn().mockRejectedValue(new Error('Network error'));

      jest.mocked(useSubAgentUnlocks).mockReturnValue({
        unlockedSubAgents: [],
        isLoading: false,
        error: null,
        isSubAgentUnlocked: jest.fn().mockReturnValue(false),
        unlockSubAgent: mockUnlockSubAgent,
        refreshUnlocks: jest.fn()
      });

      const mockSubAgent: SubAgentMetadata = {
        id: 'test-agent',
        name: 'Test Agent',
        description: 'Test description',
        unlockType: 'TokenUnlock',
        cost: 100,
        levelRequired: 1,
        status: 'available',
        category: 'Test',
        icon: '🧪',
        features: ['Test feature']
      };

      render(
        <SubAgentModal
          subAgentData={mockSubAgent}
          agentId="care-orchestrator"
          isOpen={true}
          onClose={() => {}}
        />
      );

      const unlockButton = screen.getByText('Unlock (100 DMT)');
      fireEvent.click(unlockButton);

      await waitFor(() => {
        expect(screen.getByText('An error occurred while unlocking the sub-agent')).toBeInTheDocument();
      });
    });

    test('should prevent duplicate unlocks', async () => {
      const mockUnlockSubAgent = jest.fn().mockResolvedValue({
        success: true,
        error: 'Sub-agent already unlocked'
      });

      jest.mocked(useSubAgentUnlocks).mockReturnValue({
        unlockedSubAgents: ['care-orchestrator-test-agent'],
        isLoading: false,
        error: null,
        isSubAgentUnlocked: jest.fn().mockReturnValue(true),
        unlockSubAgent: mockUnlockSubAgent,
        refreshUnlocks: jest.fn()
      });

      const mockSubAgent: SubAgentMetadata = {
        id: 'test-agent',
        name: 'Test Agent',
        description: 'Test description',
        unlockType: 'TokenUnlock',
        cost: 100,
        levelRequired: 1,
        status: 'available',
        category: 'Test',
        icon: '🧪',
        features: ['Test feature']
      };

      render(
        <SubAgentModal
          subAgentData={mockSubAgent}
          agentId="care-orchestrator"
          isOpen={true}
          onClose={() => {}}
        />
      );

      expect(screen.getByText('✅ Sub-Agent Active')).toBeInTheDocument();
      expect(screen.queryByText('Unlock')).not.toBeInTheDocument();
    });
  });
});
