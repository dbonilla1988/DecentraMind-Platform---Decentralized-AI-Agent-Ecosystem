export const projectStructure = {
    root: {
        app: {
            src: {
                components: {
                    ai: {
                        description: 'AI-related components',
                        files: [
                            'AIAgentCard.tsx',
                            'AITraining.tsx',
                            'AIGovernance.tsx',
                            'AIStaking.tsx'
                        ]
                    },
                    nft: {
                        description: 'NFT-related components',
                        files: [
                            'NFTCard.tsx',
                            'NFTMarketplace.tsx',
                            'NFTEvolution.tsx'
                        ]
                    },
                    governance: {
                        description: 'Governance components',
                        files: [
                            'ProposalCard.tsx',
                            'VotingInterface.tsx',
                            'TreasuryDashboard.tsx'
                        ]
                    },
                    staking: {
                        description: 'Staking components',
                        files: [
                            'StakingPool.tsx',
                            'RewardsCalculator.tsx',
                            'StakingStats.tsx'
                        ]
                    },
                    common: {
                        description: 'Shared components',
                        files: [
                            'Layout.tsx',
                            'Navigation.tsx',
                            'Dashboard.tsx'
                        ]
                    }
                },
                services: {
                    description: 'API and blockchain services',
                    files: [
                        'ai.service.ts',
                        'nft.service.ts',
                        'governance.service.ts',
                        'staking.service.ts'
                    ]
                },
                hooks: {
                    description: 'Custom React hooks',
                    files: [
                        'useAI.ts',
                        'useNFT.ts',
                        'useGovernance.ts',
                        'useStaking.ts'
                    ]
                },
                utils: {
                    description: 'Utility functions',
                    files: [
                        'ai-utils.ts',
                        'nft-utils.ts',
                        'blockchain-utils.ts'
                    ]
                },
                types: {
                    description: 'TypeScript type definitions',
                    files: [
                        'ai.types.ts',
                        'nft.types.ts',
                        'governance.types.ts',
                        'staking.types.ts'
                    ]
                }
            }
        }
    }
}; 