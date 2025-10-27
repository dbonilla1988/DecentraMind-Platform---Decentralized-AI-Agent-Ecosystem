/**
 * WebSocket Service for Real-time Agent Interactions
 * 
 * This service provides real-time communication with agents for:
 * - Live task execution updates
 * - Streaming responses
 * - Real-time notifications
 * - Agent status updates
 */

export interface WebSocketMessage {
  type: 'task_update' | 'agent_response' | 'status_change' | 'error' | 'notification';
  agentId: string;
  subAgentId?: string;
  taskId?: string;
  data: any;
  timestamp: string;
}

export interface WebSocketConfig {
  url: string;
  reconnectInterval: number;
  maxReconnectAttempts: number;
  heartbeatInterval: number;
}

class AgentWebSocketService {
  private ws: WebSocket | null = null;
  private config: WebSocketConfig;
  private reconnectAttempts = 0;
  private heartbeatTimer: NodeJS.Timeout | null = null;
  private listeners: Map<string, ((message: WebSocketMessage) => void)[]> = new Map();

  constructor(config: WebSocketConfig) {
    this.config = config;
  }

  // Connect to WebSocket server
  connect(): Promise<void> {
    return new Promise((resolve, reject) => {
      try {
        this.ws = new WebSocket(this.config.url);

        this.ws.onopen = () => {
          console.log('[WebSocket] Connected to agent service');
          this.reconnectAttempts = 0;
          this.startHeartbeat();
          resolve();
        };

        this.ws.onmessage = (event) => {
          try {
            const message: WebSocketMessage = JSON.parse(event.data);
            this.handleMessage(message);
          } catch (error) {
            console.error('[WebSocket] Failed to parse message:', error);
          }
        };

        this.ws.onclose = (event) => {
          console.log('[WebSocket] Connection closed:', event.code, event.reason);
          this.stopHeartbeat();
          this.handleReconnect();
        };

        this.ws.onerror = (error) => {
          console.error('[WebSocket] Connection error:', error);
          reject(error);
        };

      } catch (error) {
        reject(error);
      }
    });
  }

  // Disconnect from WebSocket server
  disconnect(): void {
    this.stopHeartbeat();
    if (this.ws) {
      this.ws.close();
      this.ws = null;
    }
  }

  // Send message to server
  send(message: Partial<WebSocketMessage>): void {
    if (this.ws && this.ws.readyState === WebSocket.OPEN) {
      const fullMessage: WebSocketMessage = {
        type: message.type || 'notification',
        agentId: message.agentId || '',
        subAgentId: message.subAgentId,
        taskId: message.taskId,
        data: message.data || {},
        timestamp: new Date().toISOString()
      };
      
      this.ws.send(JSON.stringify(fullMessage));
    } else {
      console.warn('[WebSocket] Cannot send message - not connected');
    }
  }

  // Subscribe to specific message types
  subscribe(type: string, callback: (message: WebSocketMessage) => void): void {
    if (!this.listeners.has(type)) {
      this.listeners.set(type, []);
    }
    this.listeners.get(type)!.push(callback);
  }

  // Unsubscribe from message types
  unsubscribe(type: string, callback: (message: WebSocketMessage) => void): void {
    const callbacks = this.listeners.get(type);
    if (callbacks) {
      const index = callbacks.indexOf(callback);
      if (index > -1) {
        callbacks.splice(index, 1);
      }
    }
  }

  // Handle incoming messages
  private handleMessage(message: WebSocketMessage): void {
    const callbacks = this.listeners.get(message.type);
    if (callbacks) {
      callbacks.forEach(callback => callback(message));
    }

    // Also notify general listeners
    const generalCallbacks = this.listeners.get('*');
    if (generalCallbacks) {
      generalCallbacks.forEach(callback => callback(message));
    }
  }

  // Handle reconnection logic
  private handleReconnect(): void {
    if (this.reconnectAttempts < this.config.maxReconnectAttempts) {
      this.reconnectAttempts++;
      console.log(`[WebSocket] Attempting to reconnect (${this.reconnectAttempts}/${this.config.maxReconnectAttempts})`);
      
      setTimeout(() => {
        this.connect().catch(error => {
          console.error('[WebSocket] Reconnection failed:', error);
        });
      }, this.config.reconnectInterval);
    } else {
      console.error('[WebSocket] Max reconnection attempts reached');
    }
  }

  // Start heartbeat to keep connection alive
  private startHeartbeat(): void {
    this.heartbeatTimer = setInterval(() => {
      if (this.ws && this.ws.readyState === WebSocket.OPEN) {
        this.send({ type: 'notification', agentId: 'heartbeat', data: { ping: true } });
      }
    }, this.config.heartbeatInterval);
  }

  // Stop heartbeat
  private stopHeartbeat(): void {
    if (this.heartbeatTimer) {
      clearInterval(this.heartbeatTimer);
      this.heartbeatTimer = null;
    }
  }

  // Check connection status
  isConnected(): boolean {
    return this.ws !== null && this.ws.readyState === WebSocket.OPEN;
  }
}

// Default configuration
const defaultConfig: WebSocketConfig = {
  url: process.env.NEXT_PUBLIC_WEBSOCKET_URL || 'ws://localhost:8080/agents',
  reconnectInterval: 5000,
  maxReconnectAttempts: 5,
  heartbeatInterval: 30000
};

// Create singleton instance
export const agentWebSocketService = new AgentWebSocketService(defaultConfig);

// Mock WebSocket service for demo mode
export class MockAgentWebSocketService {
  private listeners: Map<string, ((message: WebSocketMessage) => void)[]> = new Map();
  private isConnected = false;

  async connect(): Promise<void> {
    console.log('[Mock WebSocket] Connected to agent service (demo mode)');
    this.isConnected = true;
    
    // Simulate connection delay
    await new Promise(resolve => setTimeout(resolve, 1000));
  }

  disconnect(): void {
    console.log('[Mock WebSocket] Disconnected from agent service');
    this.isConnected = false;
  }

  send(message: Partial<WebSocketMessage>): void {
    console.log('[Mock WebSocket] Sending message:', message);
    
    // Simulate server response for demo
    setTimeout(() => {
      const response: WebSocketMessage = {
        type: 'task_update',
        agentId: message.agentId || '',
        subAgentId: message.subAgentId,
        taskId: message.taskId,
        data: {
          status: 'processing',
          progress: 50,
          message: 'Task is being processed...'
        },
        timestamp: new Date().toISOString()
      };
      
      this.handleMessage(response);
    }, 500);

    // Simulate completion
    setTimeout(() => {
      const completion: WebSocketMessage = {
        type: 'agent_response',
        agentId: message.agentId || '',
        subAgentId: message.subAgentId,
        taskId: message.taskId,
        data: {
          status: 'completed',
          progress: 100,
          message: 'Task completed successfully!',
          result: 'Mock response from agent'
        },
        timestamp: new Date().toISOString()
      };
      
      this.handleMessage(completion);
    }, 2000);
  }

  subscribe(type: string, callback: (message: WebSocketMessage) => void): void {
    if (!this.listeners.has(type)) {
      this.listeners.set(type, []);
    }
    this.listeners.get(type)!.push(callback);
  }

  unsubscribe(type: string, callback: (message: WebSocketMessage) => void): void {
    const callbacks = this.listeners.get(type);
    if (callbacks) {
      const index = callbacks.indexOf(callback);
      if (index > -1) {
        callbacks.splice(index, 1);
      }
    }
  }

  private handleMessage(message: WebSocketMessage): void {
    const callbacks = this.listeners.get(message.type);
    if (callbacks) {
      callbacks.forEach(callback => callback(message));
    }

    const generalCallbacks = this.listeners.get('*');
    if (generalCallbacks) {
      generalCallbacks.forEach(callback => callback(message));
    }
  }

  isConnected(): boolean {
    return this.isConnected;
  }
}

// Create mock instance for demo mode
export const mockAgentWebSocketService = new MockAgentWebSocketService();

// Export the appropriate service based on environment
export const getWebSocketService = (): AgentWebSocketService | MockAgentWebSocketService => {
  const useMock = process.env.NODE_ENV === 'development' || process.env.USE_MOCK_WEBSOCKET === 'true';
  return useMock ? mockAgentWebSocketService : agentWebSocketService;
};

// React hook for WebSocket integration
export const useAgentWebSocket = () => {
  const service = getWebSocketService();
  
  return {
    connect: () => service.connect(),
    disconnect: () => service.disconnect(),
    send: (message: Partial<WebSocketMessage>) => service.send(message),
    subscribe: (type: string, callback: (message: WebSocketMessage) => void) => service.subscribe(type, callback),
    unsubscribe: (type: string, callback: (message: WebSocketMessage) => void) => service.unsubscribe(type, callback),
    isConnected: () => service.isConnected()
  };
};

export default agentWebSocketService;














