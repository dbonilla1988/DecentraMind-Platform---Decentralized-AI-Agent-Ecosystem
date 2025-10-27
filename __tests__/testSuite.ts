/**
 * Comprehensive Test Suite for DecentraMind Agent Interaction System
 * 
 * This test suite provides complete coverage for:
 * - Core interaction logic (useAgentInteraction hook)
 * - UI components (AgentInteractionModal, SubAgentCard)
 * - WebSocket service (real and mock implementations)
 * - Integration scenarios (end-to-end workflows)
 * - Error handling and edge cases
 * 
 * Run with: npm test
 * Coverage report: npm run test:coverage
 * Watch mode: npm run test:watch
 */

import { renderHook, act } from '@testing-library/react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

// Import all test modules
import './hooks/useAgentInteraction.test';
import './components/AgentInteractionModal.test';
import './components/SubAgentCard.test';
import './services/agentWebSocket.test';
import './integration/agentInteraction.test';

// Test configuration and utilities
export const testConfig = {
  mockWalletAddress: 'mock-wallet-address',
  mockAgentId: 'care-orchestrator',
  mockSubAgentId: 'cold-plunge-coach',
  testTimeout: 10000,
  mockDelay: 100,
};

// Test utilities
export const testUtils = {
  createMockAgent: (overrides = {}) => ({
    id: 'test-agent',
    name: 'Test Agent',
    category: 'Test Category',
    unlockType: 'TokenUnlock',
    cost: 100,
    levelRequired: 1,
    status: 'available',
    description: 'Test agent description',
    features: ['Feature 1', 'Feature 2'],
    icon: '🤖',
    ...overrides,
  }),

  createMockTask: (overrides = {}) => ({
    id: 'test_task',
    name: 'Test Task',
    description: 'Test task description',
    xpReward: 20,
    category: 'test',
    requiresInput: true,
    inputPlaceholder: 'Enter test input',
    ...overrides,
  }),

  createMockResponse: (overrides = {}) => ({
    success: true,
    message: 'Test response message',
    data: {
      taskLogEntry: {
        id: 'task-123',
        agentId: 'test-agent',
        taskType: 'test_task',
        userPrompt: 'test input',
        response: 'test response',
        xpReward: 20,
        timestamp: new Date().toISOString(),
        status: 'completed',
      },
      agentId: 'test-agent',
      taskName: 'Test Task',
    },
    xpReward: 20,
    ...overrides,
  }),

  waitForAsync: (ms = 100) => new Promise(resolve => setTimeout(resolve, ms)),
};

// Mock implementations for consistent testing
export const mockImplementations = {
  localStorage: {
    getItem: jest.fn(),
    setItem: jest.fn(),
    removeItem: jest.fn(),
    clear: jest.fn(),
  },

  useWalletBalance: {
    balance: { dmt: 5000 },
    isAgentUnlocked: jest.fn().mockReturnValue(true),
    updateBalance: jest.fn(),
  },

  useXPLogging: {
    logAgentUnlock: jest.fn(),
    getTotalXP: jest.fn().mockReturnValue(100),
    getGlobalLevel: jest.fn().mockReturnValue(2),
    getTotalEarnings: jest.fn().mockReturnValue(500),
  },

  useAgentInteraction: {
    interactWithAgent: jest.fn().mockResolvedValue({
      success: true,
      message: 'Mock response',
      xpReward: 20,
    }),
    getAvailableTasks: jest.fn().mockReturnValue([]),
    getTaskHistory: jest.fn().mockReturnValue([]),
    clearTaskHistory: jest.fn(),
    isLoading: false,
    lastResponse: null,
    AGENT_TASKS: {},
  },
};

// Test scenarios for comprehensive coverage
export const testScenarios = {
  coldPlungeScheduling: {
    agentId: 'cold-plunge-coach',
    taskType: 'cold_plunge_session',
    userPrompt: '6am tomorrow',
    expectedXP: 30,
    expectedResponse: 'Cold plunge scheduled',
  },

  moodLogging: {
    agentId: 'care-orchestrator',
    taskType: 'mood_log',
    userPrompt: 'Feeling great today!',
    expectedXP: 15,
    expectedResponse: 'mood',
  },

  meditationGuidance: {
    agentId: 'meditation-guide',
    taskType: 'guided_session',
    userPrompt: 'breathing meditation',
    expectedXP: 30,
    expectedResponse: 'meditation',
    unlockType: 'NFT',
  },

  nutritionCoaching: {
    agentId: 'nutrition-coach',
    taskType: 'meal_plan',
    userPrompt: 'vegetarian diet',
    expectedXP: 30,
    expectedResponse: 'meal plan',
    unlockType: 'Subscription',
  },
};

// Performance benchmarks
export const performanceBenchmarks = {
  maxRenderTime: 1000, // ms
  maxInteractionTime: 2000, // ms
  maxWebSocketResponseTime: 500, // ms
  maxTaskExecutionTime: 3000, // ms
};

// Test data generators
export const testDataGenerators = {
  generateTaskLogs: (count = 10) => 
    Array.from({ length: count }, (_, i) => ({
      id: `task-${i}`,
      agentId: 'test-agent',
      taskType: 'test_task',
      userPrompt: `Test input ${i}`,
      response: `Test response ${i}`,
      xpReward: 20,
      timestamp: new Date(Date.now() - i * 1000).toISOString(),
      status: 'completed',
    })),

  generateWebSocketMessages: (count = 5) =>
    Array.from({ length: count }, (_, i) => ({
      type: 'task_update',
      agentId: 'test-agent',
      taskId: `task-${i}`,
      data: { status: 'processing', progress: (i + 1) * 20 },
      timestamp: new Date().toISOString(),
    })),

  generateAgentList: (count = 5) =>
    Array.from({ length: count }, (_, i) => testUtils.createMockAgent({
      id: `agent-${i}`,
      name: `Agent ${i}`,
      cost: (i + 1) * 100,
    })),
};

// Error simulation utilities
export const errorSimulators = {
  simulateNetworkError: () => Promise.reject(new Error('Network error')),
  simulateLocalStorageError: () => {
    throw new Error('localStorage error');
  },
  simulateWebSocketError: () => {
    throw new Error('WebSocket connection failed');
  },
  simulateTaskExecutionError: () => Promise.reject(new Error('Task execution failed')),
};

// Test cleanup utilities
export const cleanupUtils = {
  clearAllMocks: () => {
    jest.clearAllMocks();
    localStorageMock.getItem.mockReturnValue(null);
    localStorageMock.setItem.mockImplementation(() => {});
  },

  resetTestEnvironment: () => {
    cleanupUtils.clearAllMocks();
    // Reset any global state
    if (typeof window !== 'undefined') {
      window.localStorage.clear();
    }
  },
};

// Export for use in individual test files
export default {
  testConfig,
  testUtils,
  mockImplementations,
  testScenarios,
  performanceBenchmarks,
  testDataGenerators,
  errorSimulators,
  cleanupUtils,
};
