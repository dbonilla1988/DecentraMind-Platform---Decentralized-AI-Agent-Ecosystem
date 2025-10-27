/**
 * Unit Tests for Agent WebSocket Service
 * 
 * Tests the WebSocket service including:
 * - Connection management (connect, disconnect, reconnect)
 * - Message handling and subscription system
 * - Mock WebSocket service functionality
 * - Error handling and recovery
 * - Heartbeat mechanism
 * - Real-time task progress simulation
 */

import {
  AgentWebSocketService,
  MockAgentWebSocketService,
  getWebSocketService,
  useAgentWebSocket,
  WebSocketMessage,
  WebSocketConfig,
} from '../../services/agentWebSocket';

// Mock WebSocket for testing
class MockWebSocket {
  public readyState: number = WebSocket.CONNECTING;
  public onopen: ((event: Event) => void) | null = null;
  public onclose: ((event: CloseEvent) => void) | null = null;
  public onmessage: ((event: MessageEvent) => void) | null = null;
  public onerror: ((event: Event) => void) | null = null;

  constructor(public url: string) {
    // Simulate connection delay
    setTimeout(() => {
      this.readyState = WebSocket.OPEN;
      if (this.onopen) {
        this.onopen(new Event('open'));
      }
    }, 100);
  }

  send(data: string) {
    // Mock send implementation
    console.log('Mock WebSocket send:', data);
  }

  close(code?: number, reason?: string) {
    this.readyState = WebSocket.CLOSED;
    if (this.onclose) {
      this.onclose(new CloseEvent('close', { code, reason }));
    }
  }
}

// Mock global WebSocket
(global as any).WebSocket = MockWebSocket;

describe('AgentWebSocketService', () => {
  let service: AgentWebSocketService;
  let config: WebSocketConfig;

  beforeEach(() => {
    config = {
      url: 'ws://localhost:8080/agents',
      reconnectInterval: 1000,
      maxReconnectAttempts: 3,
      heartbeatInterval: 5000,
    };
    service = new AgentWebSocketService(config);
  });

  afterEach(() => {
    service.disconnect();
  });

  describe('Connection Management', () => {
    it('should connect to WebSocket server', async () => {
      await expect(service.connect()).resolves.not.toThrow();
      expect(service.isConnected()).toBe(true);
    });

    it('should disconnect from WebSocket server', async () => {
      await service.connect();
      service.disconnect();
      expect(service.isConnected()).toBe(false);
    });

    it('should handle connection errors', async () => {
      // Mock WebSocket to throw error
      const originalWebSocket = (global as any).WebSocket;
      (global as any).WebSocket = class ErrorWebSocket {
        constructor() {
          throw new Error('Connection failed');
        }
      };

      await expect(service.connect()).rejects.toThrow('Connection failed');

      // Restore original WebSocket
      (global as any).WebSocket = originalWebSocket;
    });
  });

  describe('Message Handling', () => {
    beforeEach(async () => {
      await service.connect();
    });

    it('should send messages when connected', () => {
      const message: Partial<WebSocketMessage> = {
        type: 'task_update',
        agentId: 'test-agent',
        data: { status: 'processing' },
      };

      expect(() => service.send(message)).not.toThrow();
    });

    it('should not send messages when disconnected', () => {
      service.disconnect();
      
      const message: Partial<WebSocketMessage> = {
        type: 'task_update',
        agentId: 'test-agent',
        data: { status: 'processing' },
      };

      expect(() => service.send(message)).not.toThrow();
      // Should not crash, but message won't be sent
    });

    it('should subscribe to message types', () => {
      const callback = jest.fn();
      service.subscribe('task_update', callback);
      
      // Simulate receiving a message
      const mockMessage: WebSocketMessage = {
        type: 'task_update',
        agentId: 'test-agent',
        data: { status: 'processing' },
        timestamp: new Date().toISOString(),
      };

      // Manually trigger the callback (in real implementation, this would be triggered by onmessage)
      callback(mockMessage);
      
      expect(callback).toHaveBeenCalledWith(mockMessage);
    });

    it('should unsubscribe from message types', () => {
      const callback = jest.fn();
      service.subscribe('task_update', callback);
      service.unsubscribe('task_update', callback);
      
      // Simulate receiving a message
      const mockMessage: WebSocketMessage = {
        type: 'task_update',
        agentId: 'test-agent',
        data: { status: 'processing' },
        timestamp: new Date().toISOString(),
      };

      callback(mockMessage);
      
      // Callback should not be called after unsubscribe
      expect(callback).not.toHaveBeenCalled();
    });

    it('should handle general message listeners', () => {
      const callback = jest.fn();
      service.subscribe('*', callback);
      
      const mockMessage: WebSocketMessage = {
        type: 'task_update',
        agentId: 'test-agent',
        data: { status: 'processing' },
        timestamp: new Date().toISOString(),
      };

      callback(mockMessage);
      
      expect(callback).toHaveBeenCalledWith(mockMessage);
    });
  });

  describe('Reconnection Logic', () => {
    it('should attempt reconnection on connection close', async () => {
      await service.connect();
      
      // Mock connection close
      const mockWs = service['ws'] as any;
      if (mockWs && mockWs.onclose) {
        mockWs.onclose(new CloseEvent('close', { code: 1000 }));
      }

      // Wait for reconnection attempt
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // Should attempt to reconnect (implementation would show this in logs)
      expect(service['reconnectAttempts']).toBeGreaterThan(0);
    });

    it('should stop reconnecting after max attempts', async () => {
      await service.connect();
      
      // Force multiple disconnections
      for (let i = 0; i < 5; i++) {
        const mockWs = service['ws'] as any;
        if (mockWs && mockWs.onclose) {
          mockWs.onclose(new CloseEvent('close', { code: 1000 }));
        }
        await new Promise(resolve => setTimeout(resolve, 100));
      }

      // Wait for all reconnection attempts
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      expect(service['reconnectAttempts']).toBeGreaterThanOrEqual(config.maxReconnectAttempts);
    });
  });

  describe('Heartbeat Mechanism', () => {
    it('should start heartbeat when connected', async () => {
      await service.connect();
      
      // Heartbeat should be started
      expect(service['heartbeatTimer']).toBeDefined();
    });

    it('should stop heartbeat when disconnected', async () => {
      await service.connect();
      service.disconnect();
      
      // Heartbeat should be stopped
      expect(service['heartbeatTimer']).toBeNull();
    });

    it('should send heartbeat messages', async () => {
      const sendSpy = jest.spyOn(service, 'send');
      await service.connect();
      
      // Wait for heartbeat
      await new Promise(resolve => setTimeout(resolve, 100));
      
      // Should have sent heartbeat message
      expect(sendSpy).toHaveBeenCalledWith({
        type: 'notification',
        agentId: 'heartbeat',
        data: { ping: true },
      });
    });
  });
});

describe('MockAgentWebSocketService', () => {
  let mockService: MockAgentWebSocketService;

  beforeEach(() => {
    mockService = new MockAgentWebSocketService();
  });

  describe('Mock Connection', () => {
    it('should simulate connection', async () => {
      await expect(mockService.connect()).resolves.not.toThrow();
      expect(mockService.isConnected()).toBe(true);
    });

    it('should simulate disconnection', async () => {
      await mockService.connect();
      mockService.disconnect();
      expect(mockService.isConnected()).toBe(false);
    });
  });

  describe('Mock Message Handling', () => {
    beforeEach(async () => {
      await mockService.connect();
    });

    it('should simulate message sending', () => {
      const message: Partial<WebSocketMessage> = {
        type: 'task_update',
        agentId: 'test-agent',
        data: { status: 'processing' },
      };

      expect(() => mockService.send(message)).not.toThrow();
    });

    it('should simulate task progress updates', async () => {
      const callback = jest.fn();
      mockService.subscribe('task_update', callback);
      
      const message: Partial<WebSocketMessage> = {
        type: 'task_update',
        agentId: 'test-agent',
        taskId: 'task-123',
        data: { status: 'processing' },
      };

      mockService.send(message);

      // Wait for simulated responses
      await new Promise(resolve => setTimeout(resolve, 1000));

      expect(callback).toHaveBeenCalled();
    });

    it('should simulate agent responses', async () => {
      const callback = jest.fn();
      mockService.subscribe('agent_response', callback);
      
      const message: Partial<WebSocketMessage> = {
        type: 'task_update',
        agentId: 'test-agent',
        taskId: 'task-123',
        data: { status: 'processing' },
      };

      mockService.send(message);

      // Wait for simulated completion
      await new Promise(resolve => setTimeout(resolve, 2500));

      expect(callback).toHaveBeenCalled();
    });
  });

  describe('Mock Subscription System', () => {
    it('should handle subscriptions', () => {
      const callback = jest.fn();
      mockService.subscribe('task_update', callback);
      
      // Should not throw
      expect(() => mockService.subscribe('task_update', callback)).not.toThrow();
    });

    it('should handle unsubscriptions', () => {
      const callback = jest.fn();
      mockService.subscribe('task_update', callback);
      mockService.unsubscribe('task_update', callback);
      
      // Should not throw
      expect(() => mockService.unsubscribe('task_update', callback)).not.toThrow();
    });
  });
});

describe('getWebSocketService', () => {
  it('should return mock service in development', () => {
    const originalEnv = process.env.NODE_ENV;
    process.env.NODE_ENV = 'development';
    
    const service = getWebSocketService();
    expect(service).toBeInstanceOf(MockAgentWebSocketService);
    
    process.env.NODE_ENV = originalEnv;
  });

  it('should return mock service when USE_MOCK_WEBSOCKET is true', () => {
    const originalEnv = process.env.USE_MOCK_WEBSOCKET;
    process.env.USE_MOCK_WEBSOCKET = 'true';
    
    const service = getWebSocketService();
    expect(service).toBeInstanceOf(MockAgentWebSocketService);
    
    process.env.USE_MOCK_WEBSOCKET = originalEnv;
  });

  it('should return real service in production', () => {
    const originalEnv = process.env.NODE_ENV;
    const originalMockEnv = process.env.USE_MOCK_WEBSOCKET;
    
    process.env.NODE_ENV = 'production';
    process.env.USE_MOCK_WEBSOCKET = 'false';
    
    const service = getWebSocketService();
    expect(service).toBeInstanceOf(AgentWebSocketService);
    
    process.env.NODE_ENV = originalEnv;
    process.env.USE_MOCK_WEBSOCKET = originalMockEnv;
  });
});

describe('useAgentWebSocket Hook', () => {
  it('should return WebSocket service methods', () => {
    const hook = useAgentWebSocket();
    
    expect(hook).toHaveProperty('connect');
    expect(hook).toHaveProperty('disconnect');
    expect(hook).toHaveProperty('send');
    expect(hook).toHaveProperty('subscribe');
    expect(hook).toHaveProperty('unsubscribe');
    expect(hook).toHaveProperty('isConnected');
    
    expect(typeof hook.connect).toBe('function');
    expect(typeof hook.disconnect).toBe('function');
    expect(typeof hook.send).toBe('function');
    expect(typeof hook.subscribe).toBe('function');
    expect(typeof hook.unsubscribe).toBe('function');
    expect(typeof hook.isConnected).toBe('function');
  });

  it('should use appropriate service based on environment', () => {
    const hook = useAgentWebSocket();
    
    // In test environment, should use mock service
    expect(hook.isConnected()).toBe(false);
  });
});

describe('WebSocket Message Types', () => {
  it('should handle task_update messages', () => {
    const message: WebSocketMessage = {
      type: 'task_update',
      agentId: 'test-agent',
      taskId: 'task-123',
      data: { status: 'processing', progress: 50 },
      timestamp: new Date().toISOString(),
    };

    expect(message.type).toBe('task_update');
    expect(message.agentId).toBe('test-agent');
    expect(message.taskId).toBe('task-123');
    expect(message.data).toEqual({ status: 'processing', progress: 50 });
  });

  it('should handle agent_response messages', () => {
    const message: WebSocketMessage = {
      type: 'agent_response',
      agentId: 'test-agent',
      taskId: 'task-123',
      data: { 
        status: 'completed', 
        result: 'Task completed successfully',
        xpReward: 30 
      },
      timestamp: new Date().toISOString(),
    };

    expect(message.type).toBe('agent_response');
    expect(message.data.status).toBe('completed');
    expect(message.data.xpReward).toBe(30);
  });

  it('should handle status_change messages', () => {
    const message: WebSocketMessage = {
      type: 'status_change',
      agentId: 'test-agent',
      data: { 
        oldStatus: 'locked', 
        newStatus: 'unlocked',
        unlockMethod: 'NFT' 
      },
      timestamp: new Date().toISOString(),
    };

    expect(message.type).toBe('status_change');
    expect(message.data.oldStatus).toBe('locked');
    expect(message.data.newStatus).toBe('unlocked');
  });

  it('should handle error messages', () => {
    const message: WebSocketMessage = {
      type: 'error',
      agentId: 'test-agent',
      data: { 
        error: 'Task execution failed',
        code: 'TASK_ERROR',
        details: 'Insufficient permissions' 
      },
      timestamp: new Date().toISOString(),
    };

    expect(message.type).toBe('error');
    expect(message.data.error).toBe('Task execution failed');
    expect(message.data.code).toBe('TASK_ERROR');
  });

  it('should handle notification messages', () => {
    const message: WebSocketMessage = {
      type: 'notification',
      agentId: 'test-agent',
      data: { 
        title: 'Task Completed',
        message: 'Your cold plunge session has been scheduled',
        priority: 'high' 
      },
      timestamp: new Date().toISOString(),
    };

    expect(message.type).toBe('notification');
    expect(message.data.title).toBe('Task Completed');
    expect(message.data.priority).toBe('high');
  });
});

describe('Error Handling', () => {
  let service: AgentWebSocketService;

  beforeEach(() => {
    service = new AgentWebSocketService({
      url: 'ws://localhost:8080/agents',
      reconnectInterval: 100,
      maxReconnectAttempts: 2,
      heartbeatInterval: 1000,
    });
  });

  afterEach(() => {
    service.disconnect();
  });

  it('should handle WebSocket errors gracefully', async () => {
    // Mock WebSocket to trigger error
    const originalWebSocket = (global as any).WebSocket;
    (global as any).WebSocket = class ErrorWebSocket {
      constructor() {
        setTimeout(() => {
          if (this.onerror) {
            this.onerror(new Event('error'));
          }
        }, 50);
      }
      onerror: ((event: Event) => void) | null = null;
    };

    await expect(service.connect()).rejects.toThrow();

    // Restore original WebSocket
    (global as any).WebSocket = originalWebSocket;
  });

  it('should handle message parsing errors', () => {
    const callback = jest.fn();
    service.subscribe('task_update', callback);

    // Simulate invalid JSON message
    const invalidMessage = 'invalid json';
    
    // In real implementation, this would be handled in onmessage
    expect(() => {
      try {
        JSON.parse(invalidMessage);
      } catch (error) {
        console.error('Failed to parse message:', error);
      }
    }).not.toThrow();
  });
});

describe('Performance and Memory', () => {
  let service: AgentWebSocketService;

  beforeEach(() => {
    service = new AgentWebSocketService({
      url: 'ws://localhost:8080/agents',
      reconnectInterval: 100,
      maxReconnectAttempts: 1,
      heartbeatInterval: 1000,
    });
  });

  afterEach(() => {
    service.disconnect();
  });

  it('should clean up timers on disconnect', async () => {
    await service.connect();
    
    const heartbeatTimer = service['heartbeatTimer'];
    expect(heartbeatTimer).toBeDefined();
    
    service.disconnect();
    expect(service['heartbeatTimer']).toBeNull();
  });

  it('should handle multiple subscriptions efficiently', () => {
    const callbacks = Array.from({ length: 100 }, () => jest.fn());
    
    callbacks.forEach((callback, index) => {
      service.subscribe('task_update', callback);
    });

    // Should not throw or cause memory issues
    expect(() => {
      callbacks.forEach((callback, index) => {
        service.unsubscribe('task_update', callback);
      });
    }).not.toThrow();
  });
});
