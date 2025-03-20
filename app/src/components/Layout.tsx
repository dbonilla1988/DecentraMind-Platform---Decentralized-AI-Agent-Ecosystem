import React from 'react';
import { Box, Container } from '@mui/material';
import { styled } from '@mui/material/styles';
import Navigation from './Navigation';
import { motion } from 'framer-motion';

const LayoutContainer = styled(Box)(({ theme }) => ({
    minHeight: '100vh',
    background: 'linear-gradient(45deg, #0a0a1f 0%, #1a1a3f 100%)',
}));

const MainContent = styled(Box)(({ theme }) => ({
    paddingTop: theme.spacing(8),
    paddingBottom: theme.spacing(3),
}));

interface LayoutProps {
    children: React.ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
    return (
        <LayoutContainer>
            <Navigation />
            <MainContent>
                <Container maxWidth="xl">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -20 }}
                        transition={{ duration: 0.5 }}
                    >
                        {children}
                    </motion.div>
                </Container>
            </MainContent>
        </LayoutContainer>
    );
};

export default Layout; 