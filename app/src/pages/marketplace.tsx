import React from 'react';
import { Container } from '@mui/material';
import MarketplaceGrid from '../components/marketplace/MarketplaceGrid';
import Hero from '../components/shared/Hero';

const MarketplacePage = () => {
    return (
        <Container maxWidth="lg">
            <Hero
                title="AI Agent Marketplace"
                subtitle="Discover and trade intelligent NFT agents"
                ctaText="List Your Agent"
                ctaLink="/create"
            />
            <MarketplaceGrid />
        </Container>
    );
};

export default MarketplacePage; 