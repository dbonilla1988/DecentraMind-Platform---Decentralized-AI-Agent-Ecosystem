import React from 'react';
import { Box, Button, Container, Typography } from '@mui/material';
import { motion } from 'framer-motion';
import Link from 'next/link';

interface HeroProps {
    title: string;
    subtitle: string;
    ctaText: string;
    ctaLink: string;
}

const Hero: React.FC<HeroProps> = ({ title, subtitle, ctaText, ctaLink }) => {
    return (
        <Box
            component={motion.div}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            sx={{
                py: 8,
                background: 'linear-gradient(45deg, #1a237e, #0d47a1)',
                borderRadius: 2,
                color: 'white',
                textAlign: 'center',
                mb: 4
            }}
        >
            <Container maxWidth="md">
                <Typography
                    variant="h2"
                    component={motion.h2}
                    sx={{ mb: 2, fontWeight: 'bold' }}
                >
                    {title}
                </Typography>
                <Typography
                    variant="h5"
                    component={motion.h5}
                    sx={{ mb: 4, opacity: 0.9 }}
                >
                    {subtitle}
                </Typography>
                <Button
                    component={Link}
                    href={ctaLink}
                    variant="contained"
                    size="large"
                    sx={{
                        backgroundColor: '#00f5d4',
                        color: '#1a237e',
                        '&:hover': {
                            backgroundColor: '#00d4b6'
                        }
                    }}
                >
                    {ctaText}
                </Button>
            </Container>
        </Box>
    );
};

export default Hero; 