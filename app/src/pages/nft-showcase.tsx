import React from 'react';
import { Container, Grid, Typography, Box, Tabs, Tab } from '@mui/material';
import { styled } from '@mui/material/styles';
import DynamicNFTCard from '../components/DynamicNFTCard';
import CanvasParticleEffect from '../components/CanvasParticleEffect';
import StakingPool from '../components/StakingPool';
import StakingPoolVisualizer from '../components/StakingPoolVisualizer';

const NeonText = styled(Typography)(({ theme }) => ({
    color: '#fff',
    textShadow: '0 0 10px rgba(0, 255, 255, 0.5)',
}));

interface AIStatus {
    governance: number;
    training: number;
    market: number;
    innovation: number;
    adaptability: number;
    accuracy: number;
    speed: number;
    specialization: number;
}

interface NFTData {
    id: number;
    title: string;
    price: string;
    rarity: 'Common' | 'Rare' | 'Epic' | 'Legendary' | 'Mythical';
    tier: 'Proto-AI' | 'Sentient-AI' | 'Neural-Overseer' | 'Quantum-Architect' | 'Singularity-Node';
    class: 'Governance' | 'Staking' | 'Trading' | 'Meta';
    name: string;
    evolutionProgress: number;
    aiMemory: string[];
    stakingAPY: number;
    aiStatus: AIStatus;
    governanceVotes: number;
    lastAction: string;
    specialAbilities: string[];
    marketInfluence: number;
    marketCondition: 'bull' | 'bear' | 'neutral';
    stakingPool: 'conservative' | 'balanced' | 'high-risk';
    daoRank: number;
}

const NFTShowcase = () => {
    const [selectedTab, setSelectedTab] = React.useState(0);

    const nfts: NFTData[] = [
        {
            id: 1,
            title: 'Zenith Alpha',
            name: 'Zenith',
            class: 'Governance',
            price: '2.5',
            rarity: 'Mythical',
            tier: 'Singularity-Node',
            evolutionProgress: 98,
            aiMemory: [
                'Achieved autonomous decision making',
                'Created successful DAO proposal #238',
                'Optimized treasury allocation: +5.7% efficiency',
                'Developed new staking strategy framework'
            ],
            stakingAPY: 15.5,
            aiStatus: {
                governance: 95,
                training: 98,
                market: 96,
                innovation: 92,
                adaptability: 94,
                accuracy: 96,
                speed: 93,
                specialization: 97
            },
            governanceVotes: 45,
            lastAction: 'Implementing cross-chain AI optimization',
            specialAbilities: ['Multi-chain Analysis', 'Autonomous Governance', 'Advanced Prediction'],
            marketInfluence: 92,
            marketCondition: 'bull',
            stakingPool: 'high-risk',
            daoRank: 1
        },
        {
            id: 2,
            title: 'DecentraMind #2',
            price: '2.2',
            rarity: 'Legendary',
            tier: 'Neural-Overseer',
            evolutionProgress: 85,
            aiMemory: [
                'Developed market prediction model v2.0',
                'Integrated cross-chain data analysis',
                'Optimized DeFi yield strategies'
            ],
            stakingAPY: 13.8,
            aiStatus: {
                governance: 88,
                training: 85,
                market: 90,
                innovation: 86,
                adaptability: 87,
                accuracy: 89,
                speed: 84,
                specialization: 88
            },
            governanceVotes: 32,
            lastAction: 'Optimizing cross-chain yield strategies',
            specialAbilities: ['DeFi Optimization', 'Market Prediction'],
            marketInfluence: 85
        },
        {
            id: 3,
            title: 'DecentraMind #3',
            price: '1.8',
            rarity: 'Rare',
            tier: 'Guardian',
            evolutionProgress: 60,
            aiMemory: ['Initial training completed'],
            stakingAPY: 9.5,
            aiStatus: {
                governance: 60,
                training: 65,
                market: 55,
                innovation: 58,
                adaptability: 62
            },
            governanceVotes: 8,
            lastAction: 'Started governance participation',
            specialAbilities: ['Basic Training', 'Governance Participation'],
            marketInfluence: 58
        },
        {
            id: 4,
            title: 'DecentraMind #4',
            price: '2.2',
            rarity: 'Legendary',
            tier: 'Singularity',
            evolutionProgress: 85,
            aiMemory: ['Advanced market prediction model'],
            stakingAPY: 11.2,
            aiStatus: {
                governance: 85,
                training: 90,
                market: 88,
                innovation: 87,
                adaptability: 86
            },
            governanceVotes: 22,
            lastAction: 'Optimized staking rewards',
            specialAbilities: ['Market Analysis', 'Yield Optimization', 'Predictive Modeling'],
            marketInfluence: 88
        },
        {
            id: 5,
            title: 'DecentraMind #5',
            price: '1.6',
            rarity: 'Epic',
            tier: 'Oracle',
            evolutionProgress: 70,
            aiMemory: ['Governance proposal analysis'],
            stakingAPY: 10.1,
            aiStatus: {
                governance: 70,
                training: 75,
                market: 72,
                innovation: 73,
                adaptability: 71
            },
            governanceVotes: 12,
            lastAction: 'Analyzed governance trends',
            specialAbilities: ['Trend Analysis', 'Proposal Generation'],
            marketInfluence: 72
        },
        {
            id: 6,
            title: 'DecentraMind #6',
            price: '1.9',
            rarity: 'Rare',
            tier: 'Sentinel',
            evolutionProgress: 45,
            aiMemory: ['Basic training initialized'],
            stakingAPY: 8.5,
            aiStatus: {
                governance: 45,
                training: 50,
                market: 40,
                innovation: 42,
                adaptability: 45
            },
            governanceVotes: 5,
            lastAction: 'Started basic training',
            specialAbilities: ['Basic Analysis', 'Learning Mode'],
            marketInfluence: 40
        }
    ];

    const filterNFTs = () => {
        switch (selectedTab) {
            case 1: // Staked NFTs
                return nfts.filter(nft => nft.stakingAPY > 10);
            case 2: // Governance Active
                return nfts.filter(nft => nft.governanceVotes > 20);
            case 3: // Evolution Ready
                return nfts.filter(nft => nft.evolutionProgress > 90);
            default:
                return nfts;
        }
    };

    const stakingPools = [
        {
            name: 'conservative' as const,
            totalStaked: 1000,
            apy: 8.5,
            utilization: 65
        },
        {
            name: 'balanced' as const,
            totalStaked: 2500,
            apy: 12.5,
            utilization: 80
        },
        {
            name: 'high-risk' as const,
            totalStaked: 1500,
            apy: 18.5,
            utilization: 45
        }
    ];

    return (
        <>
            <CanvasParticleEffect />
            <Container maxWidth="lg">
                <Box sx={{ my: 8, textAlign: 'center' }}>
                    <NeonText variant="h2" gutterBottom>
                        AI NFT Collection
                    </NeonText>
                    <NeonText variant="h5" sx={{ mb: 4, opacity: 0.8 }}>
                        Self-evolving NFTs powered by AI and on-chain activity
                    </NeonText>

                    <Tabs
                        value={selectedTab}
                        onChange={(_, newValue) => setSelectedTab(newValue)}
                        sx={{
                            mb: 4,
                            '& .MuiTab-root': {
                                color: 'rgba(255,255,255,0.7)',
                                '&.Mui-selected': {
                                    color: '#00ffff'
                                }
                            }
                        }}
                    >
                        <Tab label="All NFTs" />
                        <Tab label="Staked NFTs" />
                        <Tab label="Governance Active" />
                        <Tab label="Evolution Ready" />
                    </Tabs>
                </Box>

                <Grid container spacing={4}>
                    <Grid item xs={12} md={3}>
                        <StakingPoolVisualizer pools={stakingPools} />
                    </Grid>
                    <Grid item xs={12} md={9}>
                        <Grid container spacing={4}>
                            {filterNFTs().map((nft) => (
                                <Grid item xs={12} sm={6} md={4} key={nft.id}>
                                    <DynamicNFTCard {...nft} />
                                </Grid>
                            ))}
                        </Grid>
                    </Grid>
                </Grid>
            </Container>
        </>
    );
};

export default NFTShowcase; 