import React from 'react';
import { Grid, Card, CardContent, Typography, Box } from '@mui/material';
import { motion } from 'framer-motion';

const MotionCard = motion(Card);

// Use simpler icons temporarily until we resolve the MUI icons issue
const features = [
    {
        title: 'AI Agents',
        description: 'Intelligent agents powered by advanced AI models',
        icon: '🤖',
        color: '#2196f3'
    },
    {
        title: 'NFT Integration',
        description: 'Seamless NFT creation and management on Solana',
        icon: '🎨',
        color: '#4caf50'
    },
    {
        title: 'Smart Contracts',
        description: 'Secure and efficient Solana programs',
        icon: '📝',
        color: '#ff9800'
    },
    {
        title: 'Decentralized Storage',
        description: 'Reliable data storage on the blockchain',
        icon: '💾',
        color: '#9c27b0'
    }
];

const FeatureShowcase = () => {
    return (
        <Grid container spacing={4}>
            {features.map((feature, index) => (
                <Grid item xs={12} sm={6} md={3} key={index}>
                    <MotionCard
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.2 }}
                        whileHover={{ scale: 1.05 }}
                        sx={{ height: '100%' }}
                    >
                        <CardContent sx={{ textAlign: 'center' }}>
                            <Box
                                sx={{
                                    fontSize: '2rem',
                                    mb: 2,
                                    color: feature.color
                                }}
                            >
                                {feature.icon}
                            </Box>
                            <Typography variant="h6" gutterBottom>
                                {feature.title}
                            </Typography>
                            <Typography variant="body2" color="text.secondary">
                                {feature.description}
                            </Typography>
                        </CardContent>
                    </MotionCard>
                </Grid>
            ))}
        </Grid>
    );
};

export default FeatureShowcase; 