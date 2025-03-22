import React from 'react';
import { Grid } from '@mui/material';
import AgentCard from '../shared/AgentCard';

const AgentsList = () => {
    // Mock data - replace with actual data fetching
    const mockAgents = [
        {
            id: '1',
            name: 'Research Agent Alpha',
            type: 'research',
            level: 3,
            image: '/images/agent-placeholder.png', // Add placeholder image
            specializations: ['Data Analysis', 'Market Research'],
            intelligence: 85,
            experience: 750,
            nextLevelExp: 1000
        },
        // Add more mock agents...
    ];

    return (
        <Grid container spacing={3}>
            {mockAgents.map((agent) => (
                <Grid item xs={12} sm={6} md={4} key={agent.id}>
                    <AgentCard agent={agent} />
                </Grid>
            ))}
        </Grid>
    );
};

export default AgentsList; 