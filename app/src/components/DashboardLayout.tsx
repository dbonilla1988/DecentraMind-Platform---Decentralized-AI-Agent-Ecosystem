import React from 'react';
import { Box, Container, Grid } from '@mui/material';
import { styled } from '@mui/material/styles';

const DashboardContainer = styled(Box)(({ theme }) => ({
    minHeight: '100vh',
    background: 'linear-gradient(45deg, #0a0a1f 0%, #1a1a3f 100%)',
    padding: theme.spacing(4),
}));

const GridContainer = styled(Grid)(({ theme }) => ({
    '& > .MuiGrid-item': {
        position: 'relative',
        '&::before': {
            content: '""',
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: 'rgba(0,255,255,0.05)',
            borderRadius: theme.spacing(2),
            zIndex: -1,
        },
    },
}));

interface DashboardLayoutProps {
    children: React.ReactNode;
}

const DashboardLayout: React.FC<DashboardLayoutProps> = ({ children }) => {
    return (
        <DashboardContainer>
            <Container maxWidth="xl">
                <GridContainer container spacing={3}>
                    {children}
                </GridContainer>
            </Container>
        </DashboardContainer>
    );
};

export default DashboardLayout; 