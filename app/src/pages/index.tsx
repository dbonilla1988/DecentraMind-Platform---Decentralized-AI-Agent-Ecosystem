import React from 'react';
import { Box, Container } from '@mui/material';
import AIAgents from '../components/AIAgents';

const Home = () => {
    return (
        <Container maxWidth="xl">
            <Box sx={{
                minHeight: '100vh',
                py: 4,
                backgroundColor: '#f5f5f5'  // Using a literal color instead of theme value
            }}>
                <AIAgents />
            </Box>
        </Container>
    );
};

export default Home; 