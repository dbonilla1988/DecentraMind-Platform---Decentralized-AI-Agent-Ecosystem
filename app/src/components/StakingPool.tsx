import React from 'react';
import { Box, Typography, CircularProgress, Card, Button } from '@mui/material';
import { styled, keyframes } from '@mui/material/styles';

const pulseGlow = keyframes`
  0% { box-shadow: 0 0 10px rgba(0, 255, 255, 0.3); }
  50% { box-shadow: 0 0 20px rgba(0, 255, 255, 0.6); }
  100% { box-shadow: 0 0 10px rgba(0, 255, 255, 0.3); }
`;

const StakingCard = styled(Card)(({ theme }) => ({
    background: 'rgba(10, 10, 20, 0.8)',
    backdropFilter: 'blur(10px)',
    border: '1px solid rgba(0, 255, 255, 0.2)',
    padding: '20px',
    animation: `${pulseGlow} 3s infinite`,
    position: 'relative',
    overflow: 'hidden',
}));

const StakingPool = () => {
    return (
        <StakingCard>
            <Typography variant="h5" sx={{ color: '#00ffff', mb: 2 }}>
                AI-Managed Staking Pool
            </Typography>

            <Box sx={{ display: 'flex', justifyContent: 'space-around', mb: 3 }}>
                <Box sx={{ textAlign: 'center' }}>
                    <CircularProgress
                        variant="determinate"
                        value={75}
                        sx={{ color: '#00ffff' }}
                    />
                    <Typography sx={{ color: 'white', mt: 1 }}>
                        Pool Efficiency
                    </Typography>
                </Box>
                <Box sx={{ textAlign: 'center' }}>
                    <Typography variant="h4" sx={{ color: '#00ffff' }}>
                        12.5%
                    </Typography>
                    <Typography sx={{ color: 'white' }}>
                        Current APY
                    </Typography>
                </Box>
            </Box>

            <Button
                fullWidth
                variant="outlined"
                sx={{
                    color: '#00ffff',
                    borderColor: '#00ffff',
                    '&:hover': {
                        borderColor: '#00ffff',
                        backgroundColor: 'rgba(0, 255, 255, 0.1)'
                    }
                }}
            >
                Join Staking Pool
            </Button>
        </StakingCard>
    );
};

export default StakingPool; 