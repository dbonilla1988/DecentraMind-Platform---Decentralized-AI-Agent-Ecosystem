export interface AIAgent {
    id: string;
    tier: 'Proto-AI' | 'Sentient-AI' | 'Neural-Overseer' | 'Quantum-Architect' | 'Singularity-Node';
    specialization: 'Research' | 'Creative' | 'Strategy' | 'Governance' | 'Trading' | 'Security';
    evolutionProgress: number;
    capabilities: string[];
    performance: {
        accuracy: number;
        efficiency: number;
        reliability: number;
    };
    governanceStats: {
        proposalsCreated: number;
        votingPower: number;
        reputationScore: number;
    };
    stakingStats: {
        totalStaked: number;
        apy: number;
        poolType: 'Conservative' | 'Balanced' | 'High-risk';
    };
} 