import React from 'react';
import { Grid, Box, TextField, InputAdornment } from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import AgentCard from '../shared/AgentCard';

const MarketplaceGrid = () => {
    // Mock data - replace with actual marketplace data
    const mockListings = [
        {
            id: '1',
            name: 'Strategic Analyst v2',
            type: 'strategy',
            level: 5,
            image: '/images/agent-placeholder.png', // Add placeholder image
            specializations: ['DeFi Strategy', 'Risk Analysis'],
            intelligence: 92,
            experience: 2400,
            nextLevelExp: 3000
        },
        // Add more mock listings...
    ];

    return (
        <Box>
            <Box sx={{ mb: 4 }}>
                <TextField
                    fullWidth
                    placeholder="Search AI Agents..."
                    InputProps={{
                        startAdornment: (
                            <InputAdornment position="start">
                                <SearchIcon />
                            </InputAdornment>
                        ),
                    }}
                />
            </Box>

            <Grid container spacing={3}>
                {mockListings.map((agent) => (
                    <Grid item xs={12} sm={6} md={4} key={agent.id}>
                        <AgentCard
                            agent={agent}
                            onMint={() => console.log('Mint agent:', agent.id)}
                        />
                    </Grid>
                ))}
            </Grid>
        </Box>
    );
};

export default MarketplaceGrid; 