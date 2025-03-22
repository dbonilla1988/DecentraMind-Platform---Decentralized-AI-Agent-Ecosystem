import React from 'react';
import { Container, Grid, Typography } from '@mui/material';
import AgentsList from '../components/agents/AgentsList';
import Hero from '../components/shared/Hero';

const AgentsPage = () => {
    return (
        <Container maxWidth="lg">
            <Hero
                title="AI Agents Dashboard"
                subtitle="Manage and train your intelligent NFT agents"
                ctaText="Create New Agent"
                ctaLink="/create"
            />
            <AgentsList />
        </Container>
    );
};

export default AgentsPage; 