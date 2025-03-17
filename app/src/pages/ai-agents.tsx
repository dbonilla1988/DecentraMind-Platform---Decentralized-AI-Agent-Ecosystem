import React from 'react';
import { Box, Container } from '@mui/material';
import AIAgents from '../components/AIAgents';

const AIAgentsPage: React.FC = () => {
    return (
        <Container maxWidth="xl">
            <Box sx={{
                minHeight: '100vh',
                py: 4,
                backgroundColor: 'background.default'
            }}>
                <AIAgents />
            </Box>
        </Container>
    );
};

export default AIAgentsPage; 