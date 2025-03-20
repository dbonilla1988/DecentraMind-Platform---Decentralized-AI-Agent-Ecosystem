import React from 'react';
import { Box, Grid, Paper, Typography } from '@mui/material';
import { styled } from '@mui/material/styles';
import { motion } from 'framer-motion';
import AIAgentInteraction from './AIAgentInteraction';
import NFTMarketplace from './NFTMarketplace';
import SmartContractsPanel from './SmartContractsPanel';
import DecentralizedStorage from './DecentralizedStorage';

const DashboardContainer = styled(Box)(({ theme }) => ({
    padding: theme.spacing(3),
    background: 'linear-gradient(45deg, #0a0a1f 0%, #1a1a3f 100%)',
    minHeight: '100vh',
}));

const DashboardCard = styled(Paper)(({ theme }) => ({
    background: 'rgba(10, 10, 31, 0.9)',
    backdropFilter: 'blur(10px)',
    borderRadius: theme.spacing(2),
    padding: theme.spacing(3),
    height: '100%',
    border: '1px solid rgba(0,255,255,0.1)',
    transition: 'all 0.3s ease-in-out',
    '&:hover': {
        transform: 'translateY(-5px)',
        boxShadow: '0 10px 20px rgba(0,255,255,0.1)',
    }
}));

const Dashboard: React.FC = () => {
    return (
        <DashboardContainer>
            <Grid container spacing={3}>
                {/* AI Agents Section */}
                <Grid item xs={12} lg={8}>
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5 }}
                    >
                        <DashboardCard>
                            <AIAgentInteraction />
                        </DashboardCard>
                    </motion.div>
                </Grid>

                {/* Quick Stats */}
                <Grid item xs={12} lg={4}>
                    <motion.div
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.5, delay: 0.2 }}
                    >
                        <DashboardCard>
                            <Typography variant="h6" sx={{ color: '#00ffff', mb: 2 }}>
                                System Overview
                            </Typography>
                            {/* Add quick stats here */}
                        </DashboardCard>
                    </motion.div>
                </Grid>

                {/* NFT Marketplace Preview */}
                <Grid item xs={12}>
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5, delay: 0.4 }}
                    >
                        <DashboardCard>
                            <Typography variant="h6" sx={{ color: '#00ffff', mb: 2 }}>
                                Featured NFTs
                            </Typography>
                            <NFTMarketplace preview={true} />
                        </DashboardCard>
                    </motion.div>
                </Grid>

                {/* Smart Contracts and Storage */}
                <Grid item xs={12} md={6}>
                    <motion.div
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.5, delay: 0.6 }}
                    >
                        <DashboardCard>
                            <SmartContractsPanel />
                        </DashboardCard>
                    </motion.div>
                </Grid>
                <Grid item xs={12} md={6}>
                    <motion.div
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.5, delay: 0.8 }}
                    >
                        <DashboardCard>
                            <DecentralizedStorage />
                        </DashboardCard>
                    </motion.div>
                </Grid>
            </Grid>
        </DashboardContainer>
    );
};

export default Dashboard; 