/**
 * Cursor Configuration Types and References
 * This file serves as a reference for Cursor's architecture and configuration
 */

// AI Agent Types
export interface AIAgent {
    id: string;
    tier: AITier;
    evolution: EvolutionState;
    intelligence: IntelligenceMetrics;
    governance: GovernanceCapabilities;
    training: TrainingState;
    memory: MemorySystem;
}

export enum AITier {
    PROTO_AI = 'Proto-AI',
    SENTIENT_AI = 'Sentient-AI',
    NEURAL_OVERSEER = 'Neural-Overseer',
    QUANTUM_ARCHITECT = 'Quantum-Architect',
    SINGULARITY_NODE = 'Singularity-Node'
}

export interface EvolutionState {
    currentStage: number;
    progress: number;
    history: EvolutionEvent[];
    unlockedFeatures: string[];
    nextThreshold: number;
}

export interface IntelligenceMetrics {
    level: number;
    consciousness: number;
    adaptability: number;
    learningRate: number;
    specializations: string[];
}

export interface GovernanceCapabilities {
    votingPower: number;
    proposalRights: boolean;
    senatorStatus: boolean;
    reputationScore: number;
    consensusWeight: number;
}

export interface TrainingState {
    experience: number;
    level: number;
    completedTasks: TrainingTask[];
    activeModules: string[];
    performance: TrainingMetrics;
}

export interface MemorySystem {
    shortTerm: MemoryBlock[];
    longTerm: MemoryBlock[];
    capacity: number;
    accessSpeed: number;
}

// NFT Marketplace Types
export interface NFTMarket {
    listings: NFTListing[];
    analytics: MarketAnalytics;
    trading: TradingSystem;
    evolution: EvolutionTracking;
}

export interface NFTListing {
    id: string;
    agent: AIAgent;
    price: number;
    history: TradeHistory[];
    metrics: NFTMetrics;
}

export interface MarketAnalytics {
    volume24h: number;
    priceHistory: PricePoint[];
    trends: TrendAnalysis;
    predictions: AIPrediction[];
}

// Staking System Types
export interface StakingSystem {
    pools: StakingPool[];
    rewards: RewardMetrics;
    reputation: ReputationSystem;
    treasury: TreasuryManagement;
}

export interface StakingPool {
    id: string;
    manager: AIAgent;
    totalStaked: number;
    apy: number;
    strategy: StakingStrategy;
}

// Development Configuration
export interface DevelopmentConfig {
    environment: 'development' | 'staging' | 'production';
    features: FeatureFlags;
    api: APIConfig;
    testing: TestingConfig;
}

export interface FeatureFlags {
    enableEvolution: boolean;
    enableTraining: boolean;
    enableGovernance: boolean;
    enableStaking: boolean;
    enableMarketplace: boolean;
}

export interface APIConfig {
    huggingface: {
        endpoint: string;
        models: {
            text: string[];
            image: string[];
            analysis: string[];
        };
        rateLimit: number;
    };
    blockchain: {
        network: 'devnet' | 'testnet' | 'mainnet';
        rpc: string;
        wsEndpoint: string;
    };
}

export interface TestingConfig {
    mockData: boolean;
    aiSimulation: boolean;
    networkDelay: number;
    errorRate: number;
}

// Architecture Reference
export const ArchitectureReference = {
    layers: {
        presentation: {
            components: [
                'AIAgents',
                'NFTShowcase',
                'GovernanceUI',
                'StakingInterface'
            ],
            routing: 'Next.js Pages',
            state: 'React Context/Redux'
        },
        business: {
            services: [
                'AIEvolutionService',
                'TrainingService',
                'GovernanceService',
                'StakingService'
            ],
            processors: [
                'AILogicProcessor',
                'MarketAnalyzer',
                'GovernanceEngine'
            ]
        },
        data: {
            storage: {
                onChain: 'Solana Programs',
                offChain: 'PostgreSQL/Redis'
            },
            caching: 'Redis',
            indexing: 'ElasticSearch'
        },
        infrastructure: {
            hosting: 'Vercel/AWS',
            blockchain: 'Solana',
            ai: 'Hugging Face',
            monitoring: 'Grafana/Prometheus'
        }
    },
    patterns: {
        design: [
            'Repository Pattern',
            'Factory Pattern',
            'Observer Pattern',
            'Strategy Pattern'
        ],
        architectural: [
            'Clean Architecture',
            'Event-Driven',
            'Microservices',
            'CQRS'
        ]
    }
} as const;

// Development Guidelines
export const DevelopmentGuidelines = {
    coding: {
        style: 'TypeScript Strict',
        testing: 'Jest + React Testing Library',
        documentation: 'TSDoc',
        linting: 'ESLint + Prettier'
    },
    workflow: {
        git: {
            branches: ['main', 'develop', 'feature/*', 'hotfix/*'],
            commits: 'Conventional Commits',
            reviews: 'Required PR Reviews'
        },
        ci: {
            tests: 'GitHub Actions',
            builds: 'Automated Builds',
            deployment: 'Automated Deployment'
        }
    },
    security: {
        auth: 'Web3 Wallet Authentication',
        encryption: 'End-to-End Encryption',
        validation: 'Input Validation + Sanitization'
    }
} as const; 