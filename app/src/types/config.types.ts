export interface ProjectConfig {
    network: {
        mainnet: string;
        devnet: string;
        localnet: string;
    };
    contracts: {
        aiAgent: string;
        nftMarket: string;
        governance: string;
        staking: string;
    };
    api: {
        endpoints: {
            ai: string;
            market: string;
            analytics: string;
        };
        keys: {
            huggingface: string;
            solana: string;
        };
    };
    features: {
        aiTraining: boolean;
        nftEvolution: boolean;
        governance: boolean;
        staking: boolean;
    };
} 