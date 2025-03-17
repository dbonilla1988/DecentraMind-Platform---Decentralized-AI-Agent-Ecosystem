import React, { ReactNode } from 'react';
import { Box, Container, AppBar, Toolbar, Typography, Button } from '@mui/material';
import { useRouter } from 'next/router';

interface LayoutProps {
    children: ReactNode;
}

const Layout = ({ children }: LayoutProps) => {
    const router = useRouter();

    return (
        <Box>
            <AppBar position="static" sx={{ mb: 4 }}>
                <Toolbar>
                    <Typography
                        variant="h6"
                        component="div"
                        sx={{
                            flexGrow: 1,
                            cursor: 'pointer',
                            background: 'linear-gradient(45deg, #FFF 30%, #E3F2FD 90%)',
                            WebkitBackgroundClip: 'text',
                            WebkitTextFillColor: 'transparent'
                        }}
                        onClick={() => router.push('/')}
                    >
                        DecentraMind
                    </Typography>
                    <Button
                        color="inherit"
                        onClick={() => router.push('/ai-agents')}
                    >
                        AI Agents
                    </Button>
                    <Button
                        color="inherit"
                        onClick={() => router.push('/nft-showcase')}
                    >
                        NFT Showcase
                    </Button>
                </Toolbar>
            </AppBar>
            <Container maxWidth="lg">
                <Box sx={{
                    minHeight: 'calc(100vh - 64px)',
                    py: 4,
                }}>
                    {children}
                </Box>
            </Container>
        </Box>
    );
};

export default Layout; 