import React from 'react';
import { Box, Typography, Paper, LinearProgress } from '@mui/material';
import { styled } from '@mui/material/styles';

const StakingContainer = styled(Paper)(({ theme }) => ({
    background: 'rgba(0,0,0,0.7)',
    backdropFilter: 'blur(10px)',
    border: '1px solid rgba(0,255,255,0.2)',
    padding: theme.spacing(2),
    borderRadius: '10px',
}));

const PoolBar = styled(LinearProgress)(({ theme }) => ({
    height: 20,
    borderRadius: 10,
    backgroundColor: 'rgba(255,255,255,0.1)',
    '& .MuiLinearProgress-bar': {
        borderRadius: 10,
    },
}));

interface StakingPoolVisualizerProps {
    pools: {
        name: 'conservative' | 'balanced' | 'high-risk';
        totalStaked: number;
        apy: number;
        utilization: number;
    }[];
}

const StakingPoolVisualizer: React.FC<StakingPoolVisualizerProps> = ({ pools }) => {
    return (
        <StakingContainer>
            <Typography variant="h6" sx={{ color: '#00ffff', mb: 2 }}>
                Staking Pools
            </Typography>
            {pools.map((pool) => (
                <Box key={pool.name} sx={{ mb: 2 }}>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                        <Typography sx={{ color: '#fff' }}>
                            {pool.name.charAt(0).toUpperCase() + pool.name.slice(1)}
                        </Typography>
                        <Typography sx={{ color: '#00ffff' }}>
                            {pool.apy}% APY
                        </Typography>
                    </Box>
                    <PoolBar
                        variant="determinate"
                        value={pool.utilization}
                        sx={{
                            '& .MuiLinearProgress-bar': {
                                background: pool.name === 'high-risk'
                                    ? 'linear-gradient(45deg, #ff4444, #ff0000)'
                                    : pool.name === 'balanced'
                                        ? 'linear-gradient(45deg, #ffbb33, #ff9900)'
                                        : 'linear-gradient(45deg, #00C851, #007E33)'
                            }
                        }}
                    />
                    <Typography variant="caption" sx={{ color: 'rgba(255,255,255,0.7)' }}>
                        {pool.totalStaked} SOL Staked
                    </Typography>
                </Box>
            ))}
        </StakingContainer>
    );
};

export default StakingPoolVisualizer; 