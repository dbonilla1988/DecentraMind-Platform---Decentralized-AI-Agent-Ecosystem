// Task Management Service for Agent Tasks
export interface Task {
  id: string;
  agentId: string;
  title: string;
  description: string;
  type: 'chat' | 'code' | 'analysis' | 'creative' | 'research' | 'automation';
  priority: 'low' | 'medium' | 'high' | 'urgent';
  status: 'pending' | 'in_progress' | 'completed' | 'failed';
  createdAt: Date;
  completedAt?: Date;
  xpReward: number;
  dmtCost: number;
  estimatedDuration: number; // in minutes
  result?: any;
  error?: string;
}

export interface TaskTemplate {
  id: string;
  name: string;
  description: string;
  type: Task['type'];
  xpReward: number;
  dmtCost: number;
  estimatedDuration: number;
  requirements: {
    minLevel: number;
    capabilities: string[];
  };
}

export class TaskService {
  private tasks: Task[] = [];
  private taskTemplates: TaskTemplate[] = [
    {
      id: 'chat-basic',
      name: 'Basic Chat Interaction',
      description: 'Have a conversation with the agent',
      type: 'chat',
      xpReward: 10,
      dmtCost: 1,
      estimatedDuration: 5,
      requirements: { minLevel: 1, capabilities: ['Basic text generation'] }
    },
    {
      id: 'code-review',
      name: 'Code Review',
      description: 'Review and analyze code quality',
      type: 'code',
      xpReward: 25,
      dmtCost: 3,
      estimatedDuration: 15,
      requirements: { minLevel: 2, capabilities: ['Code debugging assistance'] }
    },
    {
      id: 'data-analysis',
      name: 'Data Analysis',
      description: 'Analyze data and provide insights',
      type: 'analysis',
      xpReward: 50,
      dmtCost: 5,
      estimatedDuration: 30,
      requirements: { minLevel: 3, capabilities: ['Advanced reasoning', 'Complex problem solving'] }
    },
    {
      id: 'creative-writing',
      name: 'Creative Writing',
      description: 'Generate creative content',
      type: 'creative',
      xpReward: 30,
      dmtCost: 4,
      estimatedDuration: 20,
      requirements: { minLevel: 2, capabilities: ['Enhanced text generation'] }
    },
    {
      id: 'research-task',
      name: 'Research Task',
      description: 'Research a topic and provide comprehensive analysis',
      type: 'research',
      xpReward: 75,
      dmtCost: 8,
      estimatedDuration: 45,
      requirements: { minLevel: 4, capabilities: ['Master-level reasoning', 'Multi-domain expertise'] }
    },
    {
      id: 'automation-script',
      name: 'Automation Script',
      description: 'Create an automation script for a specific task',
      type: 'automation',
      xpReward: 100,
      dmtCost: 10,
      estimatedDuration: 60,
      requirements: { minLevel: 5, capabilities: ['Custom fine-tuned intelligence', 'Real-time collaboration'] }
    }
  ];

  // Get all task templates
  getTaskTemplates(): TaskTemplate[] {
    return this.taskTemplates;
  }

  // Get task templates available for an agent
  getAvailableTaskTemplates(agentLevel: number, agentCapabilities: string[]): TaskTemplate[] {
    console.log('Getting templates for level:', agentLevel, 'capabilities:', agentCapabilities);
    // For now, return all templates that match the agent level
    // TODO: Implement proper capability matching
    const availableTemplates = this.taskTemplates.filter(template => 
      template.requirements.minLevel <= agentLevel
    );
    console.log('Available templates:', availableTemplates);
    return availableTemplates;
  }

  // Create a new task
  createTask(agentId: string, templateId: string, customDescription?: string): Task {
    const template = this.taskTemplates.find(t => t.id === templateId);
    if (!template) {
      throw new Error('Task template not found');
    }

    const task: Task = {
      id: `task_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      agentId,
      title: template.name,
      description: customDescription || template.description,
      type: template.type,
      priority: 'medium',
      status: 'pending',
      createdAt: new Date(),
      xpReward: template.xpReward,
      dmtCost: template.dmtCost,
      estimatedDuration: template.estimatedDuration,
    };

    this.tasks.push(task);
    return task;
  }

  // Get tasks for an agent
  getAgentTasks(agentId: string): Task[] {
    return this.tasks.filter(task => task.agentId === agentId);
  }

  // Get all tasks
  getAllTasks(): Task[] {
    return this.tasks;
  }

  // Start a task
  startTask(taskId: string): Task {
    const task = this.tasks.find(t => t.id === taskId);
    if (!task) {
      throw new Error('Task not found');
    }
    if (task.status !== 'pending') {
      throw new Error('Task cannot be started');
    }

    task.status = 'in_progress';
    return task;
  }

  // Complete a task
  completeTask(taskId: string, result?: any): Task {
    const task = this.tasks.find(t => t.id === taskId);
    if (!task) {
      throw new Error('Task not found');
    }
    if (task.status !== 'in_progress') {
      throw new Error('Task is not in progress');
    }

    task.status = 'completed';
    task.completedAt = new Date();
    task.result = result;
    return task;
  }

  // Fail a task
  failTask(taskId: string, error: string): Task {
    const task = this.tasks.find(t => t.id === taskId);
    if (!task) {
      throw new Error('Task not found');
    }

    task.status = 'failed';
    task.error = error;
    return task;
  }

  // Get task statistics
  getTaskStats(agentId: string): {
    total: number;
    completed: number;
    inProgress: number;
    failed: number;
    totalXp: number;
    totalDmtSpent: number;
  } {
    const agentTasks = this.getAgentTasks(agentId);
    return {
      total: agentTasks.length,
      completed: agentTasks.filter(t => t.status === 'completed').length,
      inProgress: agentTasks.filter(t => t.status === 'in_progress').length,
      failed: agentTasks.filter(t => t.status === 'failed').length,
      totalXp: agentTasks.filter(t => t.status === 'completed').reduce((sum, t) => sum + t.xpReward, 0),
      totalDmtSpent: agentTasks.reduce((sum, t) => sum + t.dmtCost, 0),
    };
  }

  // Simulate task execution (for demo purposes)
  async executeTask(taskId: string): Promise<Task> {
    const task = this.startTask(taskId);
    
    // Simulate task execution time
    await new Promise(resolve => setTimeout(resolve, Math.min(task.estimatedDuration * 100, 5000)));
    
    // Simulate success/failure (90% success rate)
    if (Math.random() > 0.1) {
      return this.completeTask(taskId, { 
        message: 'Task completed successfully!',
        timestamp: new Date().toISOString(),
        performance: Math.random() * 0.3 + 0.7 // 70-100% performance
      });
    } else {
      return this.failTask(taskId, 'Task execution failed due to unexpected error');
    }
  }
}

// Singleton instance
export const taskService = new TaskService();

