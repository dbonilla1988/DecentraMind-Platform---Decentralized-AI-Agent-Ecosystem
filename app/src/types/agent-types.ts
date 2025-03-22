export interface AgentNFTMetadata {
    name: string;
    symbol: string;
    description: string;
    agentType: AgentType;
    tier: AgentTier;
    attributes: AgentAttributes;
    evolution: EvolutionState;
    governance: GovernanceCapabilities;
    training: TrainingState;
}

export enum AgentType {
    RESEARCH = 'research',
    CREATIVE = 'creative',
    STRATEGY = 'strategy',
    TECHNICAL = 'technical',
    GOVERNANCE = 'governance',
    MARKET = 'market'
}

export enum AgentTier {
    PROTO_AI = 'Proto-AI',
    SENTIENT_AI = 'Sentient-AI',
    NEURAL_OVERSEER = 'Neural-Overseer',
    QUANTUM_ARCHITECT = 'Quantum-Architect',
    SINGULARITY_NODE = 'Singularity-Node'
}

export interface AgentAttributes {
    intelligence: number;
    adaptability: number;
    specialization: string[];
    consciousness: number;
    reputation: number;
}

export interface EvolutionState {
    currentTier: AgentTier;
    progress: number;
    unlockedFeatures: string[];
    evolutionHistory: EvolutionEvent[];
}

export interface GovernanceCapabilities {
    votingPower: number;
    proposalRights: boolean;
    consensusWeight: number;
    treasuryAccess: boolean;
}

export interface TrainingState {
    level: number;
    experience: number;
    completedTasks: number;
    specializations: string[];
    performance: PerformanceMetrics;
} 