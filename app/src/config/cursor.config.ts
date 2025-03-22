import { DevelopmentConfig, FeatureFlags, APIConfig } from '../types/cursor-config';

export const cursorConfig: DevelopmentConfig = {
    environment: process.env.NODE_ENV as 'development' | 'staging' | 'production',
    features: {
        enableEvolution: true,
        enableTraining: true,
        enableGovernance: true,
        enableStaking: true,
        enableMarketplace: true
    },
    api: {
        huggingface: {
            endpoint: process.env.HUGGINGFACE_API_ENDPOINT || '',
            models: {
                text: ['gpt2', 'bert-base-uncased'],
                image: ['stable-diffusion'],
                analysis: ['vit-base-patch16-224']
            },
            rateLimit: 100
        },
        blockchain: {
            network: (process.env.SOLANA_NETWORK || 'devnet') as 'devnet' | 'testnet' | 'mainnet',
            rpc: process.env.SOLANA_RPC_ENDPOINT || '',
            wsEndpoint: process.env.SOLANA_WS_ENDPOINT || ''
        }
    },
    testing: {
        mockData: true,
        aiSimulation: true,
        networkDelay: 100,
        errorRate: 0.05
    }
};

export default cursorConfig; 