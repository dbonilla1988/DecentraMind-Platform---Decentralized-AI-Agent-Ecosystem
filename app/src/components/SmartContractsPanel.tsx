import React, { useState, useEffect } from 'react';
import { Box, Typography, Paper, Grid, CircularProgress, Chip } from '@mui/material';
import { styled, keyframes } from '@mui/material/styles';

const pulseAnimation = keyframes`
  0% { transform: scale(1); opacity: 0.8; }
  50% { transform: scale(1.05); opacity: 1; }
  100% { transform: scale(1); opacity: 0.8; }
`;

const dataFlowAnimation = keyframes`
  0% { transform: translateY(-100%); opacity: 0; }
  50% { opacity: 1; }
  100% { transform: translateY(100%); opacity: 0; }
`;

const ContractPanel = styled(Paper)(({ theme }) => ({
    background: 'rgba(10, 10, 31, 0.8)',
    backdropFilter: 'blur(10px)',
    borderRadius: theme.spacing(2),
    padding: theme.spacing(3),
    border: '1px solid rgba(0, 255, 255, 0.1)',
    position: 'relative',
    overflow: 'hidden',
    '&:hover': {
        '&::before': {
            opacity: 0.2,
        }
    },
    '&::before': {
        content: '""',
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        background: 'linear-gradient(45deg, rgba(0,255,255,0.1), rgba(255,0,255,0.1))',
        opacity: 0.1,
        transition: 'opacity 0.3s ease-in-out',
    }
}));

const DataStream = styled(Box)`
  position: absolute;
  width: 2px;
  height: 100%;
  background: linear-gradient(to bottom, transparent, #00ffff, transparent);
  animation: ${dataFlowAnimation} 2s linear infinite;
`;

interface NetworkStatus {
    tps: number;
    blockHeight: string;
    gasPrice: number;
    activeValidators: number;
}

interface GovernanceVote {
    id: string;
    title: string;
    votes: number;
    status: 'active' | 'passed' | 'rejected';
    aiContribution: number;
}

const SmartContractsPanel: React.FC = () => {
    const [networkStatus, setNetworkStatus] = useState<NetworkStatus>({
        tps: 2456,
        blockHeight: '189,234,567',
        gasPrice: 0.000001,
        activeValidators: 1578
    });

    const [governanceVotes, setGovernanceVotes] = useState<GovernanceVote[]>([
        {
            id: 'GOV-001',
            title: 'Upgrade AI Training Protocol',
            votes: 234,
            status: 'active',
            aiContribution: 75
        },
        // Add more governance votes...
    ]);

    const [dataStreams, setDataStreams] = useState<number[]>([]);

    useEffect(() => {
        // Simulate real-time updates
        const interval = setInterval(() => {
            setNetworkStatus(prev => ({
                ...prev,
                tps: prev.tps + Math.floor(Math.random() * 100 - 50),
                blockHeight: (parseInt(prev.blockHeight.replace(/,/g, '')) + 1).toLocaleString()
            }));
        }, 2000);

        return () => clearInterval(interval);
    }, []);

    return (
        <ContractPanel>
            {/* Add animated data streams */}
            {[...Array(5)].map((_, i) => (
                <DataStream
                    key={i}
                    sx={{
                        left: `${20 * i}%`,
                        animationDelay: `${i * 0.3}s`
                    }}
                />
            ))}

            <Grid container spacing={3}>
                {/* Network Status Section */}
                <Grid item xs={12}>
                    <Typography
                        variant="h5"
                        sx={{
                            color: '#00ffff',
                            mb: 2,
                            textShadow: '0 0 10px rgba(0,255,255,0.5)'
                        }}
                    >
                        Solana Network Status
                    </Typography>
                    <Grid container spacing={2}>
                        {Object.entries(networkStatus).map(([key, value]) => (
                            <Grid item xs={6} md={3} key={key}>
                                <Box
                                    sx={{
                                        background: 'rgba(0,255,255,0.1)',
                                        p: 2,
                                        borderRadius: 2,
                                        animation: `${pulseAnimation} 2s infinite`,
                                    }}
                                >
                                    <Typography variant="caption" sx={{ color: '#fff', opacity: 0.7 }}>
                                        {key.replace(/([A-Z])/g, ' $1').toUpperCase()}
                                    </Typography>
                                    <Typography variant="h6" sx={{ color: '#00ffff' }}>
                                        {value}
                                    </Typography>
                                </Box>
                            </Grid>
                        ))}
                    </Grid>
                </Grid>

                {/* Governance Votes Section */}
                <Grid item xs={12}>
                    <Typography
                        variant="h5"
                        sx={{
                            color: '#00ffff',
                            mb: 2,
                            textShadow: '0 0 10px rgba(0,255,255,0.5)'
                        }}
                    >
                        AI Governance Activity
                    </Typography>
                    <Box sx={{ mt: 2 }}>
                        {governanceVotes.map((vote) => (
                            <Box
                                key={vote.id}
                                sx={{
                                    background: 'rgba(0,255,255,0.05)',
                                    p: 2,
                                    borderRadius: 2,
                                    mb: 2,
                                    border: '1px solid rgba(0,255,255,0.1)',
                                    '&:hover': {
                                        background: 'rgba(0,255,255,0.1)',
                                    }
                                }}
                            >
                                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
                                    <Typography sx={{ color: '#fff' }}>
                                        {vote.title}
                                    </Typography>
                                    <Chip
                                        label={vote.status}
                                        sx={{
                                            background: vote.status === 'active' ? '#00ffff' :
                                                vote.status === 'passed' ? '#00ff00' : '#ff0000',
                                            color: '#000'
                                        }}
                                    />
                                </Box>
                                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                                    <CircularProgress
                                        variant="determinate"
                                        value={vote.aiContribution}
                                        sx={{
                                            color: '#00ffff',
                                            '& .MuiCircularProgress-circle': {
                                                strokeLinecap: 'round',
                                            }
                                        }}
                                    />
                                    <Typography sx={{ color: '#fff', opacity: 0.7 }}>
                                        {`${vote.votes} votes | ${vote.aiContribution}% AI Contribution`}
                                    </Typography>
                                </Box>
                            </Box>
                        ))}
                    </Box>
                </Grid>
            </Grid>
        </ContractPanel>
    );
};

export default SmartContractsPanel; 