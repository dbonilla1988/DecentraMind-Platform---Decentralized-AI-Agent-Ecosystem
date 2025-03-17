import React, { useEffect } from 'react';
import { Box, Container, Typography, Grid, Card, CardContent, Button } from '@mui/material';
import { motion } from 'framer-motion';
import { useRouter } from 'next/router';

const MotionCard = motion(Card);

const features = [
    {
        title: 'AI Agents',
        description: 'Intelligent agents powered by advanced AI models',
        icon: '🤖',
        color: '#2196f3',
        path: '/ai-demo'
    },
    {
        title: 'NFT Integration',
        description: 'Seamless NFT creation and management on Solana',
        icon: '🎨',
        color: '#4caf50',
        path: '/nft-showcase'
    },
    {
        title: 'Smart Contracts',
        description: 'Secure and efficient Solana programs',
        icon: '📝',
        color: '#ff9800',
        path: '/smart-contracts'
    },
    {
        title: 'Decentralized Storage',
        description: 'Reliable data storage on the blockchain',
        icon: '💾',
        color: '#9c27b0',
        path: '/storage'
    }
];

const HomePage = () => {
    const router = useRouter();

    useEffect(() => {
        router.push('/nft-showcase');
    }, [router]);

    return null;
};

export default HomePage; 