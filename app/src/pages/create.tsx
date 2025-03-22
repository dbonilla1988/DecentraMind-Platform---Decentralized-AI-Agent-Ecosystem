import React from 'react';
import { Box, Container, Typography } from '@mui/material';
import AgentCreator from '../components/create/AgentCreator';
import Hero from '../components/shared/Hero';

const CreatePage = () => {
    return (
        <Container maxWidth="lg">
            <Hero
                title="Create Your AI Agent"
                subtitle="Design and mint intelligent NFT agents powered by advanced AI"
                ctaText="Start Creating"
                ctaLink="#creator"
            />
            <Box id="creator" sx={{ mt: 8 }}>
                <AgentCreator />
            </Box>
        </Container>
    );
};

export default CreatePage; 