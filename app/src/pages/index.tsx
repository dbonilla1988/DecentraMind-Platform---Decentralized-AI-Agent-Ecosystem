import React from 'react';
import { Container, Box, Typography, Grid, Card, CardContent, Button } from '@mui/material';
import { styled } from '@mui/material/styles';
import Link from 'next/link';
import CanvasParticleEffect from '../components/CanvasParticleEffect';

const GlowingCard = styled(Card)(({ theme }) => ({
    background: 'rgba(25, 25, 25, 0.8)',
    backdropFilter: 'blur(10px)',
    border: '1px solid rgba(255, 255, 255, 0.1)',
    transition: 'all 0.3s ease-in-out',
    '&:hover': {
        transform: 'translateY(-5px)',
        boxShadow: '0 0 20px rgba(0, 255, 255, 0.3)',
        border: '1px solid rgba(0, 255, 255, 0.5)',
    }
}));

const NeonText = styled(Typography)(({ theme }) => ({
    color: '#fff',
    textShadow: '0 0 10px rgba(0, 255, 255, 0.5)',
}));

const Home = () => {
    return (
        <>
            <CanvasParticleEffect />
            <Container maxWidth="lg">
                <Box sx={{ my: 8, textAlign: 'center' }}>
                    <NeonText variant="h1" gutterBottom>
                        DecentraMind
                    </NeonText>
                    <NeonText variant="h4" sx={{ mb: 8 }}>
                        AI-Powered Web3 Solutions on Solana
                    </NeonText>
                </Box>

                <Grid container spacing={4}>
                    <Grid item xs={12} md={6}>
                        <Link href="/ai-agents" passHref style={{ textDecoration: 'none' }}>
                            <GlowingCard>
                                <CardContent>
                                    <NeonText variant="h4" gutterBottom>
                                        AI Agents
                                    </NeonText>
                                    <Typography color="rgba(255,255,255,0.7)" paragraph>
                                        Intelligent agents powered by advanced AI models
                                    </Typography>
                                    <Button
                                        variant="outlined"
                                        sx={{
                                            color: '#00ffff',
                                            borderColor: '#00ffff',
                                            '&:hover': {
                                                borderColor: '#00ffff',
                                                backgroundColor: 'rgba(0, 255, 255, 0.1)'
                                            }
                                        }}
                                    >
                                        Explore Agents
                                    </Button>
                                </CardContent>
                            </GlowingCard>
                        </Link>
                    </Grid>

                    <Grid item xs={12} md={6}>
                        <Link href="/nft-showcase" passHref style={{ textDecoration: 'none' }}>
                            <GlowingCard>
                                <CardContent>
                                    <NeonText variant="h4" gutterBottom>
                                        NFT Integration
                                    </NeonText>
                                    <Typography color="rgba(255,255,255,0.7)" paragraph>
                                        Seamless NFT integration and management
                                    </Typography>
                                    <Button
                                        variant="outlined"
                                        sx={{
                                            color: '#00ffff',
                                            borderColor: '#00ffff',
                                            '&:hover': {
                                                borderColor: '#00ffff',
                                                backgroundColor: 'rgba(0, 255, 255, 0.1)'
                                            }
                                        }}
                                    >
                                        View NFTs
                                    </Button>
                                </CardContent>
                            </GlowingCard>
                        </Link>
                    </Grid>

                    <Grid item xs={12} md={6}>
                        <GlowingCard>
                            <CardContent>
                                <NeonText variant="h4" gutterBottom>
                                    Smart Contracts
                                </NeonText>
                                <Typography color="rgba(255,255,255,0.7)" paragraph>
                                    Secure, efficient Solana programs
                                </Typography>
                                <Button
                                    variant="outlined"
                                    sx={{
                                        color: '#00ffff',
                                        borderColor: '#00ffff',
                                        '&:hover': {
                                            borderColor: '#00ffff',
                                            backgroundColor: 'rgba(0, 255, 255, 0.1)'
                                        }
                                    }}
                                >
                                    Explore Contracts
                                </Button>
                            </CardContent>
                        </GlowingCard>
                    </Grid>

                    <Grid item xs={12} md={6}>
                        <GlowingCard>
                            <CardContent>
                                <NeonText variant="h4" gutterBottom>
                                    Decentralized Storage
                                </NeonText>
                                <Typography color="rgba(255,255,255,0.7)" paragraph>
                                    Distributed data management solutions
                                </Typography>
                                <Button
                                    variant="outlined"
                                    sx={{
                                        color: '#00ffff',
                                        borderColor: '#00ffff',
                                        '&:hover': {
                                            borderColor: '#00ffff',
                                            backgroundColor: 'rgba(0, 255, 255, 0.1)'
                                        }
                                    }}
                                >
                                    Learn More
                                </Button>
                            </CardContent>
                        </GlowingCard>
                    </Grid>
                </Grid>
            </Container>
        </>
    );
};

export default Home; 