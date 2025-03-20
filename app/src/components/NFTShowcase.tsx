import React from 'react';
import { Container, Grid, Card, CardContent, CardMedia, Typography, Button, Box } from '@mui/material';

const NFTShowcase = () => {
    const mockNFTs = [
        { id: 1, title: 'DecentraMind #1', image: 'https://via.placeholder.com/300', price: '1.5 SOL' },
        { id: 2, title: 'DecentraMind #2', image: 'https://via.placeholder.com/300', price: '2.0 SOL' },
        { id: 3, title: 'DecentraMind #3', image: 'https://via.placeholder.com/300', price: '1.8 SOL' },
        { id: 4, title: 'DecentraMind #4', image: 'https://via.placeholder.com/300', price: '2.2 SOL' }
    ];

    return (
        <Container maxWidth="lg">
            <Box sx={{ my: 4 }}>
                <Typography variant="h3" component="h1" gutterBottom>
                    NFT Collection
                </Typography>
                <Grid container spacing={4}>
                    {mockNFTs.map((nft) => (
                        <Grid item xs={12} sm={6} md={3} key={nft.id}>
                            <Card sx={{ height: '100%' }}>
                                <CardMedia
                                    component="img"
                                    height="300"
                                    image={nft.image}
                                    alt={nft.title}
                                />
                                <CardContent>
                                    <Typography gutterBottom variant="h5" component="h2">
                                        {nft.title}
                                    </Typography>
                                    <Typography variant="body2" color="text.secondary">
                                        Price: {nft.price}
                                    </Typography>
                                    <Button
                                        variant="contained"
                                        color="primary"
                                        fullWidth
                                        sx={{ mt: 2 }}
                                    >
                                        View Details
                                    </Button>
                                </CardContent>
                            </Card>
                        </Grid>
                    ))}
                </Grid>
            </Box>
        </Container>
    );
};

export default NFTShowcase; 