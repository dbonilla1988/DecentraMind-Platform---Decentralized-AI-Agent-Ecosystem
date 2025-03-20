import React, { useState, useEffect } from 'react';
import { Box, Typography, Grid, Card, Chip, Button, TextField, Select, MenuItem, InputAdornment, Dialog, CircularProgress, Switch } from '@mui/material';
import { styled, keyframes } from '@mui/material/styles';
import SearchIcon from '@mui/icons-material/Search';
import FilterListIcon from '@mui/icons-material/FilterList';
import { motion } from 'framer-motion';
import TimerIcon from '@mui/icons-material/Timer';
import GavelIcon from '@mui/icons-material/Gavel';
import LocalOfferIcon from '@mui/icons-material/LocalOffer';

const glowAnimation = keyframes`
  0% { box-shadow: 0 0 20px rgba(0,255,255,0.3); }
  50% { box-shadow: 0 0 40px rgba(255,0,255,0.3); }
  100% { box-shadow: 0 0 20px rgba(0,255,255,0.3); }
`;

const rotateAnimation = keyframes`
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
`;

const MarketplaceContainer = styled(Box)(({ theme }) => ({
    padding: theme.spacing(3),
    background: 'rgba(10, 10, 31, 0.8)',
    borderRadius: theme.spacing(2),
    minHeight: '100vh',
}));

const NFTCard = styled(motion.div)(({ theme }) => ({
    background: 'rgba(10, 10, 31, 0.9)',
    borderRadius: theme.spacing(2),
    padding: theme.spacing(2),
    border: '1px solid rgba(0,255,255,0.1)',
    transition: 'all 0.3s ease-in-out',
    '&:hover': {
        transform: 'translateY(-5px)',
        animation: `${glowAnimation} 2s infinite`,
    }
}));

const BidDialog = styled(Dialog)(({ theme }) => ({
    '& .MuiDialog-paper': {
        background: 'rgba(10, 10, 31, 0.95)',
        backdropFilter: 'blur(10px)',
        border: '1px solid rgba(0,255,255,0.1)',
        borderRadius: theme.spacing(2),
        padding: theme.spacing(3),
    }
}));

interface AINFT {
    id: string;
    name: string;
    type: 'Research' | 'Creative' | 'Strategy' | 'Custom';
    rarity: 'Common' | 'Rare' | 'Epic' | 'Legendary';
    intelligence: number;
    price: number;
    evolutionProgress: number;
    imageUrl: string;
    specializations: string[];
}

interface NFTListing {
    id: string;
    name: string;
    type: string;
    currentPrice: number;
    highestBid: number;
    auctionEnds?: Date;
    bids: number;
    likes: number;
    isAuction: boolean;
    imageUrl: string;
    seller: string;
    history: {
        type: 'bid' | 'sale' | 'transfer';
        amount?: number;
        from: string;
        to: string;
        date: Date;
    }[];
}

interface AuctionSettings {
    minimumBid: number;
    bidIncrement: number;
    reservePrice: number;
    buyNowPrice?: number;
}

const NFTMarketplace: React.FC = () => {
    const [nfts, setNfts] = useState<AINFT[]>([
        {
            id: '001',
            name: 'Zenith Alpha',
            type: 'Research',
            rarity: 'Legendary',
            intelligence: 95,
            price: 100,
            evolutionProgress: 85,
            imageUrl: '/ai-nfts/zenith.png',
            specializations: ['Deep Learning', 'Market Analysis']
        },
        // Add more NFTs...
    ]);

    const [filters, setFilters] = useState({
        type: 'all',
        rarity: 'all',
        minIntelligence: 0,
        search: ''
    });

    const [listings, setListings] = useState<NFTListing[]>([]);
    const [selectedNFT, setSelectedNFT] = useState<NFTListing | null>(null);
    const [bidAmount, setBidAmount] = useState('');
    const [isProcessing, setIsProcessing] = useState(false);
    const [autoBidSettings, setAutoBidSettings] = useState({
        enabled: false,
        maxBid: 0,
        incrementAmount: 0.5
    });

    const handleBid = async (nftId: string) => {
        setIsProcessing(true);
        // Simulate bid processing
        await new Promise(resolve => setTimeout(resolve, 2000));
        setListings(prev => prev.map(nft =>
            nft.id === nftId
                ? {
                    ...nft,
                    highestBid: parseFloat(bidAmount),
                    bids: nft.bids + 1,
                    history: [
                        {
                            type: 'bid',
                            amount: parseFloat(bidAmount),
                            from: 'Current User',
                            to: nft.seller,
                            date: new Date()
                        },
                        ...nft.history
                    ]
                }
                : nft
        ));
        setIsProcessing(false);
        setSelectedNFT(null);
    };

    const formatTimeLeft = (endDate: Date) => {
        const now = new Date();
        const diff = endDate.getTime() - now.getTime();
        const hours = Math.floor(diff / (1000 * 60 * 60));
        const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
        return `${hours}h ${minutes}m`;
    };

    return (
        <MarketplaceContainer>
            {/* Search and Filter Section */}
            <Box sx={{ mb: 4 }}>
                <Grid container spacing={3} alignItems="center">
                    <Grid item xs={12} md={4}>
                        <TextField
                            fullWidth
                            placeholder="Search AI NFTs..."
                            variant="outlined"
                            InputProps={{
                                startAdornment: (
                                    <InputAdornment position="start">
                                        <SearchIcon sx={{ color: '#00ffff' }} />
                                    </InputAdornment>
                                ),
                            }}
                            sx={{
                                '& .MuiOutlinedInput-root': {
                                    color: '#fff',
                                    '& fieldset': {
                                        borderColor: 'rgba(0,255,255,0.3)',
                                    },
                                    '&:hover fieldset': {
                                        borderColor: '#00ffff',
                                    },
                                }
                            }}
                        />
                    </Grid>
                    <Grid item xs={12} md={8}>
                        <Box sx={{ display: 'flex', gap: 2 }}>
                            <Select
                                value={filters.type}
                                onChange={(e) => setFilters({ ...filters, type: e.target.value })}
                                sx={{ minWidth: 150, color: '#fff' }}
                            >
                                <MenuItem value="all">All Types</MenuItem>
                                <MenuItem value="Research">Research</MenuItem>
                                <MenuItem value="Creative">Creative</MenuItem>
                                <MenuItem value="Strategy">Strategy</MenuItem>
                            </Select>
                            {/* Add more filters */}
                        </Box>
                    </Grid>
                </Grid>
            </Box>

            {/* NFT Grid */}
            <Grid container spacing={3}>
                {listings.map((nft) => (
                    <Grid item xs={12} sm={6} md={4} key={nft.id}>
                        <NFTCard
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.5 }}
                        >
                            <Box
                                sx={{
                                    height: 200,
                                    background: `url(${nft.imageUrl})`,
                                    backgroundSize: 'cover',
                                    borderRadius: 2,
                                    mb: 2,
                                }}
                            />

                            <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                                <Typography variant="h6" sx={{ color: '#fff' }}>
                                    {nft.name}
                                </Typography>
                                <Chip
                                    icon={nft.isAuction ? <GavelIcon /> : <LocalOfferIcon />}
                                    label={nft.isAuction ? 'Auction' : 'Fixed Price'}
                                    sx={{
                                        background: nft.isAuction
                                            ? 'linear-gradient(45deg, #ff6b6b, #ffd93d)'
                                            : 'linear-gradient(45deg, #00ffff, #ff00ff)',
                                    }}
                                />
                            </Box>

                            {nft.isAuction && nft.auctionEnds && (
                                <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                                    <TimerIcon sx={{ color: '#ff6b6b', mr: 1 }} />
                                    <Typography sx={{ color: '#ff6b6b' }}>
                                        Ends in: {formatTimeLeft(nft.auctionEnds)}
                                    </Typography>
                                </Box>
                            )}

                            <Box sx={{ mb: 2 }}>
                                <Typography sx={{ color: 'rgba(255,255,255,0.7)' }}>
                                    Current {nft.isAuction ? 'Bid' : 'Price'}
                                </Typography>
                                <Typography variant="h5" sx={{ color: '#00ffff' }}>
                                    {nft.isAuction ? nft.highestBid : nft.currentPrice} SOL
                                </Typography>
                            </Box>

                            <Button
                                fullWidth
                                variant="contained"
                                onClick={() => setSelectedNFT(nft)}
                                sx={{
                                    background: 'linear-gradient(45deg, #00ffff, #ff00ff)',
                                    color: '#fff',
                                    '&:hover': {
                                        background: 'linear-gradient(45deg, #ff00ff, #00ffff)',
                                    }
                                }}
                            >
                                {nft.isAuction ? 'Place Bid' : 'Buy Now'}
                            </Button>
                        </NFTCard>
                    </Grid>
                ))}
            </Grid>

            <BidDialog
                open={!!selectedNFT}
                onClose={() => setSelectedNFT(null)}
            >
                {selectedNFT && (
                    <Box sx={{ color: '#fff' }}>
                        <Typography variant="h6" sx={{ mb: 2 }}>
                            {selectedNFT.isAuction ? 'Place Bid' : 'Buy'} - {selectedNFT.name}
                        </Typography>

                        <TextField
                            fullWidth
                            type="number"
                            value={bidAmount}
                            onChange={(e) => setBidAmount(e.target.value)}
                            label={selectedNFT.isAuction ? "Bid Amount (SOL)" : "Purchase Amount (SOL)"}
                            sx={{
                                mb: 2,
                                '& .MuiOutlinedInput-root': {
                                    color: '#fff',
                                    '& fieldset': {
                                        borderColor: 'rgba(0,255,255,0.3)',
                                    },
                                }
                            }}
                        />

                        <Button
                            fullWidth
                            variant="contained"
                            onClick={() => handleBid(selectedNFT.id)}
                            disabled={isProcessing}
                            sx={{
                                background: 'linear-gradient(45deg, #00ffff, #ff00ff)',
                                color: '#fff',
                            }}
                        >
                            {isProcessing ? (
                                <CircularProgress size={24} sx={{ color: '#fff' }} />
                            ) : (
                                selectedNFT.isAuction ? 'Confirm Bid' : 'Confirm Purchase'
                            )}
                        </Button>

                        <Box sx={{ mt: 2 }}>
                            <Typography variant="subtitle2" sx={{ color: '#fff', mb: 1 }}>
                                Auto-Bidding Settings
                            </Typography>
                            <Box sx={{ display: 'flex', gap: 2, alignItems: 'center' }}>
                                <Switch
                                    checked={autoBidSettings.enabled}
                                    onChange={(e) => setAutoBidSettings(prev => ({
                                        ...prev,
                                        enabled: e.target.checked
                                    }))}
                                    sx={{
                                        '& .MuiSwitch-switchBase.Mui-checked': {
                                            color: '#00ffff',
                                        },
                                    }}
                                />
                                <TextField
                                    label="Maximum Bid"
                                    type="number"
                                    value={autoBidSettings.maxBid}
                                    onChange={(e) => setAutoBidSettings(prev => ({
                                        ...prev,
                                        maxBid: parseFloat(e.target.value)
                                    }))}
                                    disabled={!autoBidSettings.enabled}
                                    sx={{ width: 150 }}
                                />
                                <TextField
                                    label="Increment"
                                    type="number"
                                    value={autoBidSettings.incrementAmount}
                                    onChange={(e) => setAutoBidSettings(prev => ({
                                        ...prev,
                                        incrementAmount: parseFloat(e.target.value)
                                    }))}
                                    disabled={!autoBidSettings.enabled}
                                    sx={{ width: 150 }}
                                />
                            </Box>
                        </Box>
                    </Box>
                )}
            </BidDialog>
        </MarketplaceContainer>
    );
};

export default NFTMarketplace; 