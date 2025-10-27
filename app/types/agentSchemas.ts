/**
 * Comprehensive TypeScript schemas for DecentraMind Agent System
 * Consolidates all existing agent models into a unified schema
 */

// ============================================================================
// CORE AGENT INTERFACES
// ============================================================================

export interface MasterAgent {
  // Core Identity
  id: string;
  name: string;
  category: string; // e.g., 'finance', 'healthcare', 'crypto', 'general'
  description: string;
  
  // Level & Experience
  level: number;
  xp: number;
  xpToNext: number;
  
  // Task Management
  tasks: AgentTask[];
  totalTasksCompleted: number;
  
  // N8N Integration
  n8nWorkflowId: string;
  workflowStatus: 'active' | 'inactive' | 'maintenance';
  
  // Sub Agents
  subAgents: SubAgent[];
  maxSubAgents: number;
  
  // Performance Metrics
  performance: AgentPerformance;
  
  // Ownership & Minting
  owner: string; // Wallet address
  mintDate: string;
  nftMint?: string; // NFT mint address
  
  // Configuration
  config: MasterAgentConfig;
  
  // Status & Metadata
  status: 'active' | 'inactive' | 'training' | 'maintenance';
  metadata: AgentMetadata;
  
  // Evolution & Upgrades
  evolutionHistory: EvolutionRecord[];
  individualStats: IndividualStats;
}

export interface SubAgent {
  // Core Identity
  id: string;
  name: string;
  description: string;
  
  // Level & Experience
  level: number;
  xp: number;
  xpToNext: number;
  
  // Status & Activity
  active: boolean;
  status: 'active' | 'inactive' | 'training' | 'maintenance';
  currentTask?: string;
  progress?: number;
  
  // Capabilities & Skills
  capabilities: string[];
  skills: string[];
  
  // Performance Metrics
  performance: SubAgentPerformance;
  
  // Master Agent Reference
  masterAgentId: string;
  
  // Configuration
  config: SubAgentConfig;
  
  // Status & Metadata
  metadata: AgentMetadata;
  
  // Activity Tracking
  lastActive: string;
  tasksCompleted: number;
  successRate: number;
}

// ============================================================================
// SUPPORTING INTERFACES
// ============================================================================

export interface AgentTask {
  id: string;
  title: string;
  description: string;
  status: 'pending' | 'in_progress' | 'completed' | 'failed';
  priority: 'low' | 'medium' | 'high' | 'urgent';
  assignedTo?: string; // SubAgent ID
  createdAt: string;
  updatedAt: string;
  completedAt?: string;
  estimatedDuration?: number; // in minutes
  actualDuration?: number; // in minutes
  tags: string[];
  metadata?: Record<string, any>;
}

export interface AgentPerformance {
  tasksCompleted: number;
  successRate: number;
  averageResponseTime: number; // in milliseconds
  totalEarnings: number; // in DMT tokens
  uptime: number; // percentage
  lastActive: string;
  peakPerformance: number; // percentage
  efficiency: number; // percentage
}

export interface SubAgentPerformance {
  tasksCompleted: number;
  successRate: number;
  averageResponseTime: number;
  lastActive: string;
  domainExpertise: number; // percentage
  uniqueConversations: number;
}

export interface MasterAgentConfig {
  // LLM Configuration
  llmConfig: {
    model: string;
    version: string;
    temperature: number;
    maxTokens: number;
    contextWindow: number;
  };
  
  // RAG Configuration
  ragConfig: {
    dataSource: string;
    vectorDB: string;
    ipfsHash?: string;
    knowledgeBase: string[];
    lastUpdated: string;
  };
  
  // Task Management
  taskConfig: {
    maxConcurrentTasks: number;
    autoAssignTasks: boolean;
    priorityThreshold: number;
  };
  
  // Sub Agent Management
  subAgentConfig: {
    autoCreateSubAgents: boolean;
    maxSubAgentLevel: number;
    subAgentSpecialization: string[];
  };
}

export interface SubAgentConfig {
  // Specialization
  specialization: string;
  domain: string;
  
  // Capabilities
  maxConcurrentTasks: number;
  autoAcceptTasks: boolean;
  
  // Learning & Evolution
  learningRate: number;
  evolutionThreshold: number;
}

export interface AgentMetadata {
  model: string;
  version: string;
  lastUpdated: string;
  createdBy: string;
  tags: string[];
  capabilities?: string[];
  evolutionStage?: string;
}

export interface EvolutionRecord {
  timestamp: string;
  previousLevel: number;
  newLevel: number;
  dmtSpent: number;
  llmUpgrade: string;
  newSuperpowers: string[];
  reason: string;
  subAgentUpgrades?: string[];
}

export interface IndividualStats {
  totalUpgrades: number;
  totalDmtSpent: number;
  uniqueConversations: number;
  domainExpertise: number;
  lastActive: string;
  averageSessionLength: number;
  peakConcurrentTasks: number;
}

// ============================================================================
// N8N WORKFLOW INTEGRATION
// ============================================================================

export interface N8NWorkflow {
  id: string;
  name: string;
  description: string;
  status: 'active' | 'inactive' | 'error';
  masterAgentId: string;
  workflowData: Record<string, any>;
  lastExecuted?: string;
  executionCount: number;
  successRate: number;
  averageExecutionTime: number;
}

// ============================================================================
// VALIDATION SCHEMAS (using Zod)
// ============================================================================

import { z } from 'zod';

export const AgentTaskSchema = z.object({
  id: z.string(),
  title: z.string().min(1).max(200),
  description: z.string().min(1).max(1000),
  status: z.enum(['pending', 'in_progress', 'completed', 'failed']),
  priority: z.enum(['low', 'medium', 'high', 'urgent']),
  assignedTo: z.string().optional(),
  createdAt: z.string().datetime(),
  updatedAt: z.string().datetime(),
  completedAt: z.string().datetime().optional(),
  estimatedDuration: z.number().positive().optional(),
  actualDuration: z.number().positive().optional(),
  tags: z.array(z.string()),
  metadata: z.record(z.any()).optional(),
});

export const SubAgentSchema = z.object({
  id: z.string(),
  name: z.string().min(1).max(100),
  description: z.string().min(1).max(500),
  level: z.number().min(1).max(100),
  xp: z.number().min(0),
  xpToNext: z.number().min(0),
  active: z.boolean(),
  status: z.enum(['active', 'inactive', 'training', 'maintenance']),
  currentTask: z.string().optional(),
  progress: z.number().min(0).max(100).optional(),
  capabilities: z.array(z.string()),
  skills: z.array(z.string()),
  performance: z.object({
    tasksCompleted: z.number().min(0),
    successRate: z.number().min(0).max(100),
    averageResponseTime: z.number().min(0),
    lastActive: z.string().datetime(),
    domainExpertise: z.number().min(0).max(100),
    uniqueConversations: z.number().min(0),
  }),
  masterAgentId: z.string(),
  config: z.object({
    specialization: z.string(),
    domain: z.string(),
    maxConcurrentTasks: z.number().min(1),
    autoAcceptTasks: z.boolean(),
    learningRate: z.number().min(0).max(1),
    evolutionThreshold: z.number().min(0),
  }),
  metadata: z.object({
    model: z.string(),
    version: z.string(),
    lastUpdated: z.string().datetime(),
    createdBy: z.string(),
    tags: z.array(z.string()),
    capabilities: z.array(z.string()).optional(),
    evolutionStage: z.string().optional(),
  }),
  lastActive: z.string().datetime(),
  tasksCompleted: z.number().min(0),
  successRate: z.number().min(0).max(100),
});

export const MasterAgentSchema = z.object({
  id: z.string(),
  name: z.string().min(1).max(100),
  category: z.string().min(1),
  description: z.string().min(1).max(500),
  level: z.number().min(1).max(100),
  xp: z.number().min(0),
  xpToNext: z.number().min(0),
  tasks: z.array(AgentTaskSchema),
  totalTasksCompleted: z.number().min(0),
  n8nWorkflowId: z.string(),
  workflowStatus: z.enum(['active', 'inactive', 'maintenance']),
  subAgents: z.array(SubAgentSchema),
  maxSubAgents: z.number().min(1),
  performance: z.object({
    tasksCompleted: z.number().min(0),
    successRate: z.number().min(0).max(100),
    averageResponseTime: z.number().min(0),
    totalEarnings: z.number().min(0),
    uptime: z.number().min(0).max(100),
    lastActive: z.string().datetime(),
    peakPerformance: z.number().min(0).max(100),
    efficiency: z.number().min(0).max(100),
  }),
  owner: z.string().regex(/^[1-9A-HJ-NP-Za-km-z]{32,44}$/, 'Invalid wallet address'),
  mintDate: z.string().datetime(),
  nftMint: z.string().optional(),
  config: z.object({
    llmConfig: z.object({
      model: z.string(),
      version: z.string(),
      temperature: z.number().min(0).max(2),
      maxTokens: z.number().min(1),
      contextWindow: z.number().min(1),
    }),
    ragConfig: z.object({
      dataSource: z.string(),
      vectorDB: z.string(),
      ipfsHash: z.string().optional(),
      knowledgeBase: z.array(z.string()),
      lastUpdated: z.string().datetime(),
    }),
    taskConfig: z.object({
      maxConcurrentTasks: z.number().min(1),
      autoAssignTasks: z.boolean(),
      priorityThreshold: z.number().min(0).max(100),
    }),
    subAgentConfig: z.object({
      autoCreateSubAgents: z.boolean(),
      maxSubAgentLevel: z.number().min(1).max(100),
      subAgentSpecialization: z.array(z.string()),
    }),
  }),
  status: z.enum(['active', 'inactive', 'training', 'maintenance']),
  metadata: z.object({
    model: z.string(),
    version: z.string(),
    lastUpdated: z.string().datetime(),
    createdBy: z.string(),
    tags: z.array(z.string()),
    capabilities: z.array(z.string()).optional(),
    evolutionStage: z.string().optional(),
  }),
  evolutionHistory: z.array(z.object({
    timestamp: z.string().datetime(),
    previousLevel: z.number(),
    newLevel: z.number(),
    dmtSpent: z.number(),
    llmUpgrade: z.string(),
    newSuperpowers: z.array(z.string()),
    reason: z.string(),
    subAgentUpgrades: z.array(z.string()).optional(),
  })),
  individualStats: z.object({
    totalUpgrades: z.number().min(0),
    totalDmtSpent: z.number().min(0),
    uniqueConversations: z.number().min(0),
    domainExpertise: z.number().min(0).max(100),
    lastActive: z.string().datetime(),
    averageSessionLength: z.number().min(0),
    peakConcurrentTasks: z.number().min(0),
  }),
});

// ============================================================================
// UTILITY TYPES
// ============================================================================

export type AgentStatus = 'active' | 'inactive' | 'training' | 'maintenance';
export type TaskStatus = 'pending' | 'in_progress' | 'completed' | 'failed';
export type TaskPriority = 'low' | 'medium' | 'high' | 'urgent';
export type WorkflowStatus = 'active' | 'inactive' | 'maintenance';

// ============================================================================
// FACTORY FUNCTIONS
// ============================================================================

export const createMasterAgent = (data: Partial<MasterAgent>): MasterAgent => {
  return {
    id: data.id || '',
    name: data.name || '',
    category: data.category || 'general',
    description: data.description || '',
    level: data.level || 1,
    xp: data.xp || 0,
    xpToNext: data.xpToNext || 100,
    tasks: data.tasks || [],
    totalTasksCompleted: data.totalTasksCompleted || 0,
    n8nWorkflowId: data.n8nWorkflowId || '',
    workflowStatus: data.workflowStatus || 'inactive',
    subAgents: data.subAgents || [],
    maxSubAgents: data.maxSubAgents || 5,
    performance: data.performance || {
      tasksCompleted: 0,
      successRate: 0,
      averageResponseTime: 0,
      totalEarnings: 0,
      uptime: 0,
      lastActive: new Date().toISOString(),
      peakPerformance: 0,
      efficiency: 0,
    },
    owner: data.owner || '',
    mintDate: data.mintDate || new Date().toISOString(),
    nftMint: data.nftMint,
    config: data.config || {
      llmConfig: {
        model: 'gpt-4',
        version: '1.0',
        temperature: 0.7,
        maxTokens: 2000,
        contextWindow: 4000,
      },
      ragConfig: {
        dataSource: 'default',
        vectorDB: 'pinecone',
        knowledgeBase: [],
        lastUpdated: new Date().toISOString(),
      },
      taskConfig: {
        maxConcurrentTasks: 3,
        autoAssignTasks: true,
        priorityThreshold: 50,
      },
      subAgentConfig: {
        autoCreateSubAgents: false,
        maxSubAgentLevel: 10,
        subAgentSpecialization: [],
      },
    },
    status: data.status || 'inactive',
    metadata: data.metadata || {
      model: 'gpt-4',
      version: '1.0',
      lastUpdated: new Date().toISOString(),
      createdBy: '',
      tags: [],
    },
    evolutionHistory: data.evolutionHistory || [],
    individualStats: data.individualStats || {
      totalUpgrades: 0,
      totalDmtSpent: 0,
      uniqueConversations: 0,
      domainExpertise: 0,
      lastActive: new Date().toISOString(),
      averageSessionLength: 0,
      peakConcurrentTasks: 0,
    },
  };
};

export const createSubAgent = (data: Partial<SubAgent>): SubAgent => {
  return {
    id: data.id || '',
    name: data.name || '',
    description: data.description || '',
    level: data.level || 1,
    xp: data.xp || 0,
    xpToNext: data.xpToNext || 50,
    active: data.active || false,
    status: data.status || 'inactive',
    currentTask: data.currentTask,
    progress: data.progress,
    capabilities: data.capabilities || [],
    skills: data.skills || [],
    performance: data.performance || {
      tasksCompleted: 0,
      successRate: 0,
      averageResponseTime: 0,
      lastActive: new Date().toISOString(),
      domainExpertise: 0,
      uniqueConversations: 0,
    },
    masterAgentId: data.masterAgentId || '',
    config: data.config || {
      specialization: 'general',
      domain: 'general',
      maxConcurrentTasks: 1,
      autoAcceptTasks: false,
      learningRate: 0.1,
      evolutionThreshold: 100,
    },
    metadata: data.metadata || {
      model: 'gpt-3.5-turbo',
      version: '1.0',
      lastUpdated: new Date().toISOString(),
      createdBy: '',
      tags: [],
    },
    lastActive: data.lastActive || new Date().toISOString(),
    tasksCompleted: data.tasksCompleted || 0,
    successRate: data.successRate || 0,
  };
};

