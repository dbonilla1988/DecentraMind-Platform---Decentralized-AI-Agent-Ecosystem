/**
 * Central Agent Metadata Registry
 * Single source of truth for all agent configurations
 */

export interface SubAgentMetadata {
  id: string;
  name: string;
  description: string;
  unlockType: 'TokenUnlock' | 'Subscription' | 'NFT';
  cost: number;
  levelRequired: number;
  status: 'available' | 'coming-soon';
  category: string;
  icon: string;
  features: string[];
  metadataURI?: string;
  contractAddress?: string;
  subscriptionId?: string;
  tokenAddress?: string;
}

export interface MasterAgentMetadata {
  id: string;
  name: string;
  description: string;
  category: string;
  icon: string;
  level: number;
  xp: number;
  subAgents: SubAgentMetadata[];
}

export interface AgentMetadata {
  id: string;
  name: string;
  description: string;
  unlockType: 'TokenUnlock' | 'Subscription' | 'NFT';
  cost: number;
  levelRequired: number;
  status: 'available' | 'coming-soon';
  category: string;
  icon: string;
  features: string[];
  metadataURI?: string;
}

export const agentMetadata: AgentMetadata[] = [
  // Care Orchestrator Sub-Agents
  {
    id: "sleep-ai",
    name: "Sleep AI",
    description: "Monitors sleep patterns via journal entries and AI analysis for optimal rest",
    unlockType: "TokenUnlock",
    cost: 3000,
    levelRequired: 2,
    status: "coming-soon",
    category: "Sleep Optimization",
    icon: "😴",
    features: [
      "Sleep pattern analysis",
      "AI-powered sleep coaching",
      "Journal entry processing",
      "Rest optimization recommendations"
    ],
    metadataURI: "ipfs://QmSleepAI789"
  },
  {
    id: "nutrition-coach",
    name: "Nutrition Coach",
    description: "AI-powered nutrition guidance with meal planning and macro tracking",
    unlockType: "Subscription",
    cost: 30,
    levelRequired: 1,
    status: "available",
    category: "Nutrition",
    icon: "🥗",
    features: [
      "Personalized meal planning",
      "Macro and micronutrient tracking",
      "Dietary restriction management",
      "Grocery list generation"
    ],
    metadataURI: "ipfs://QmNutritionCoach101"
  },
  {
    id: "meditation-guide",
    name: "Meditation Guide",
    description: "Personalized meditation sessions with progress tracking and mindfulness insights",
    unlockType: "NFT",
    cost: 150,
    levelRequired: 1,
    status: "available",
    category: "Wellness",
    icon: "🧘",
    features: [
      "Guided meditation sessions",
      "Progress tracking and analytics",
      "Mindfulness insights",
      "Stress level monitoring"
    ],
    metadataURI: "ipfs://QmMeditationGuide202"
  },
  {
    id: "fitness-tracker",
    name: "Fitness Tracker",
    description: "Comprehensive fitness monitoring with workout optimization and recovery tracking",
    unlockType: "TokenUnlock",
    cost: 4000,
    levelRequired: 3,
    status: "coming-soon",
    category: "Fitness",
    icon: "💪",
    features: [
      "Workout optimization algorithms",
      "Recovery time tracking",
      "Performance analytics",
      "Injury prevention insights"
    ],
    metadataURI: "ipfs://QmFitnessTracker303"
  },
  {
    id: "breathwork-tracker",
    name: "Breathwork Tracker",
    description: "Logs breathing sessions and syncs with wearables for comprehensive wellness tracking",
    unlockType: "NFT",
    cost: 120,
    levelRequired: 1,
    status: "available",
    category: "Breathwork",
    icon: "🫁",
    features: [
      "Wearable device integration",
      "Breathing pattern analysis",
      "Session logging and tracking",
      "Wellness insights dashboard"
    ],
    metadataURI: "ipfs://QmBreathworkTracker123"
  },
  {
    id: "cold-plunge-coach",
    name: "Cold Plunge Coach",
    description: "Suggests optimal cold therapy protocols and maintains your wellness calendar",
    unlockType: "Subscription",
    cost: 20,
    levelRequired: 1,
    status: "available",
    category: "Cold Therapy",
    icon: "🧊",
    features: [
      "Personalized cold therapy protocols",
      "Temperature and duration tracking",
      "Recovery optimization",
      "Calendar integration"
    ],
    metadataURI: "ipfs://QmColdPlungeCoach456"
  }
];

// Helper functions
export const getAgentById = (id: string): AgentMetadata | undefined => {
  return agentMetadata.find(agent => agent.id === id);
};

export const getAgentsByCategory = (category: string): AgentMetadata[] => {
  return agentMetadata.filter(agent => agent.category === category);
};

export const getAgentsByStatus = (status: 'available' | 'coming-soon'): AgentMetadata[] => {
  return agentMetadata.filter(agent => agent.status === status);
};

export const getAgentsByUnlockType = (unlockType: 'TokenUnlock' | 'Subscription' | 'NFT'): AgentMetadata[] => {
  return agentMetadata.filter(agent => agent.unlockType === unlockType);
};

export const getAvailableAgents = (): AgentMetadata[] => {
  return getAgentsByStatus('available');
};

export const getComingSoonAgents = (): AgentMetadata[] => {
  return getAgentsByStatus('coming-soon');
};

// Master Agent Data with Sub-Agents
export const masterAgentData: MasterAgentMetadata[] = [
  {
    id: 'care-orchestrator',
    name: 'Care Orchestrator',
    description: 'Comprehensive health & wellness management system',
    category: 'Wellness',
    icon: '🏥',
    level: 3,
    xp: 1200,
    subAgents: [
      {
        id: 'vitals-tracker',
        name: 'Vitals Tracker',
        description: 'Monitors real-time patient vitals and health metrics',
        unlockType: 'TokenUnlock',
        cost: 25,
        levelRequired: 2,
        status: 'available',
        category: 'Health Monitoring',
        icon: '📊',
        features: [
          'Heart Rate Monitoring',
          'Blood Pressure Tracking',
          'Temperature Monitoring',
          'Oxygen Saturation Tracking'
        ],
        tokenAddress: 'DMT_TOKEN_ADDRESS'
      },
      {
        id: 'cold-plunge-coach',
        name: 'Cold Plunge Coach',
        description: 'Suggests optimal cold therapy protocols and maintains your wellness calendar',
        unlockType: 'Subscription',
        cost: 20,
        levelRequired: 1,
        status: 'available',
        category: 'Cold Therapy',
        icon: '🧊',
        features: [
          'Personalized cold therapy protocols',
          'Temperature and duration tracking',
          'Recovery optimization',
          'Calendar integration'
        ],
        subscriptionId: 'svc_coldplunge'
      },
      {
        id: 'meditation-guide',
        name: 'Meditation Guide',
        description: 'Personalized meditation sessions with progress tracking and mindfulness insights',
        unlockType: 'NFT',
        cost: 150,
        levelRequired: 1,
        status: 'available',
        category: 'Wellness',
        icon: '🧘',
        features: [
          'Guided meditation sessions',
          'Progress tracking and analytics',
          'Mindfulness insights',
          'Stress level monitoring'
        ],
        contractAddress: '0x1234567890abcdef1234567890abcdef12345678'
      },
      {
        id: 'sleep-ai',
        name: 'Sleep AI',
        description: 'Monitors sleep patterns via journal entries and AI analysis for optimal rest',
        unlockType: 'TokenUnlock',
        cost: 3000,
        levelRequired: 2,
        status: 'coming-soon',
        category: 'Sleep Optimization',
        icon: '😴',
        features: [
          'Sleep pattern analysis',
          'AI-powered sleep coaching',
          'Journal entry processing',
          'Rest optimization recommendations'
        ],
        tokenAddress: 'DMT_TOKEN_ADDRESS'
      },
      {
        id: 'nutrition-coach',
        name: 'Nutrition Coach',
        description: 'AI-powered nutrition guidance with meal planning and macro tracking',
        unlockType: 'Subscription',
        cost: 30,
        levelRequired: 1,
        status: 'available',
        category: 'Nutrition',
        icon: '🥗',
        features: [
          'Personalized meal planning',
          'Macro and micronutrient tracking',
          'Dietary restriction management',
          'Grocery list generation'
        ],
        subscriptionId: 'svc_nutrition'
      },
      {
        id: 'fitness-tracker',
        name: 'Fitness Tracker',
        description: 'Comprehensive fitness monitoring with workout optimization and recovery tracking',
        unlockType: 'TokenUnlock',
        cost: 4000,
        levelRequired: 3,
        status: 'coming-soon',
        category: 'Fitness',
        icon: '💪',
        features: [
          'Workout optimization algorithms',
          'Recovery time tracking',
          'Performance analytics',
          'Injury prevention insights'
        ],
        tokenAddress: 'DMT_TOKEN_ADDRESS'
      }
    ]
  },
  {
    id: 'autonomous-cfo',
    name: 'Autonomous CFO',
    description: 'Advanced DeFi portfolio management and yield optimization',
    category: 'Finance',
    icon: '💰',
    level: 5,
    xp: 2500,
    subAgents: [
      {
        id: 'portfolio-optimizer',
        name: 'Portfolio Optimizer',
        description: 'AI-powered portfolio rebalancing and risk management',
        unlockType: 'TokenUnlock',
        cost: 5000,
        levelRequired: 3,
        status: 'available',
        category: 'Portfolio Management',
        icon: '📈',
        features: [
          'Automated rebalancing',
          'Risk assessment',
          'Yield optimization',
          'Market analysis'
        ],
        tokenAddress: 'DMT_TOKEN_ADDRESS'
      },
      {
        id: 'defi-scanner',
        name: 'DeFi Scanner',
        description: 'Discovers high-yield opportunities across DeFi protocols',
        unlockType: 'Subscription',
        cost: 50,
        levelRequired: 2,
        status: 'available',
        category: 'DeFi Research',
        icon: '🔍',
        features: [
          'Yield farming opportunities',
          'Liquidity mining alerts',
          'Protocol risk analysis',
          'APY comparisons'
        ],
        subscriptionId: 'svc_defi_scanner'
      },
      {
        id: 'tax-optimizer',
        name: 'Tax Optimizer',
        description: 'Automated tax loss harvesting and optimization strategies',
        unlockType: 'NFT',
        cost: 200,
        levelRequired: 4,
        status: 'coming-soon',
        category: 'Tax Management',
        icon: '🧾',
        features: [
          'Tax loss harvesting',
          'Gain/loss tracking',
          'Optimization strategies',
          'Compliance reporting'
        ],
        contractAddress: '0x1234567890abcdef1234567890abcdef12345678'
      }
    ]
  },
  {
    id: 'crypto-alpha-assistant',
    name: 'Crypto Alpha Assistant',
    description: 'Exclusive crypto market intelligence and alpha generation',
    category: 'Crypto',
    icon: '₿',
    level: 6,
    xp: 3500,
    subAgents: [
      {
        id: 'market-scanner',
        name: 'Market Scanner',
        description: 'Real-time market scanning for trading opportunities',
        unlockType: 'Subscription',
        cost: 100,
        levelRequired: 4,
        status: 'available',
        category: 'Trading',
        icon: '📡',
        features: [
          'Real-time scanning',
          'Signal generation',
          'Risk assessment',
          'Portfolio alerts'
        ],
        subscriptionId: 'svc_market_scanner'
      },
      {
        id: 'whale-tracker',
        name: 'Whale Tracker',
        description: 'Monitor whale movements and large transactions',
        unlockType: 'TokenUnlock',
        cost: 7500,
        levelRequired: 5,
        status: 'available',
        category: 'Market Intelligence',
        icon: '🐋',
        features: [
          'Whale tracking',
          'Transaction monitoring',
          'Market impact analysis',
          'Alert system'
        ],
        tokenAddress: 'DMT_TOKEN_ADDRESS'
      },
      {
        id: 'alpha-generator',
        name: 'Alpha Generator',
        description: 'Exclusive alpha signals and market insights',
        unlockType: 'NFT',
        cost: 500,
        levelRequired: 6,
        status: 'coming-soon',
        category: 'Alpha',
        icon: '⚡',
        features: [
          'Exclusive signals',
          'Market insights',
          'Early opportunities',
          'Premium analysis'
        ],
        contractAddress: '0x1234567890abcdef1234567890abcdef12345678'
      }
    ]
  }
];

// Sub-Agent Helper Functions
export const getMasterAgentById = (agentId: string): MasterAgentMetadata | undefined => {
  return masterAgentData.find(agent => agent.id === agentId);
};

export const getSubAgent = (agentId: string, subAgentId: string): SubAgentMetadata | undefined => {
  const masterAgent = getMasterAgentById(agentId);
  return masterAgent?.subAgents.find(subAgent => subAgent.id === subAgentId);
};

export const getSubAgentsFor = (agentId: string): SubAgentMetadata[] => {
  const masterAgent = getMasterAgentById(agentId);
  return masterAgent?.subAgents || [];
};

export const getAvailableSubAgents = (agentId: string): SubAgentMetadata[] => {
  const subAgents = getSubAgentsFor(agentId);
  return subAgents.filter(subAgent => subAgent.status === 'available');
};
