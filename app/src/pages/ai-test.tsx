import React from 'react';
import { Container } from '@mui/material';
import Navigation from '../components/Navigation';
import AITest from '../components/AITest';

const AITestPage = () => {
    return (
        <>
            <Navigation />
            <Container maxWidth="lg" sx={{ mt: 4 }}>
                <AITest />
            </Container>
        </>
    );
};

export default AITestPage; 