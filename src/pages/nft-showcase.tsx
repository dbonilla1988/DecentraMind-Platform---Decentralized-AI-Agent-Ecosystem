import React, { useState, useEffect } from 'react';
import {
    Container,
    Box,
    Typography,
    Grid,
    Card,
    CardContent,
    CardMedia,
    Button,
    Chip,
    CircularProgress
} from '@mui/material';
import { motion, AnimatePresence } from 'framer-motion';
import { useWallet } from '@solana/wallet-adapter-react';
import { WalletMultiButton } from '@solana/wallet-adapter-react-ui';
import { keyframes } from '@emotion/react';
import { styled } from '@mui/material/styles';
import CanvasParticleEffect from '../components/CanvasParticleEffect';

const MotionCard = motion(Card);

interface NFT {
    id: string;
    title: string;
    description: string;
    image: string;
    attributes: string[];
    rarity: 'Common' | 'Rare' | 'Epic' | 'Legendary';
    animation: {
        gradientColors: string[];
        pulseSpeed: number;
    };
    aiVisualization: {
        type: 'agent' | 'network' | 'quantum';
        animationData: string;
    };
}

const glowKeyframes = keyframes`
  0% { background-position: 0% 50% }
  50% { background-position: 100% 50% }
  100% { background-position: 0% 50% }
`;

interface AnimatedCardProps {
    gradientColors: string[];
    rarity: string;
}

const AnimatedCard = styled(MotionCard) <AnimatedCardProps>`
    position: relative;
    transform-style: preserve-3d;
    perspective: 1000px;

    &::before {
        content: '';
        position: absolute;
        inset: 0;
        z-index: 0;
        background: ${props => `linear-gradient(45deg, ${props.gradientColors.join(', ')})`};
        background-size: 200% 200%;
        animation: ${glowKeyframes} 3s linear infinite;
        opacity: 0.15;
        transition: opacity 0.3s ease;
        border-radius: inherit;
    }

    &:hover::before {
        opacity: 0.3;
    }

    &::after {
        content: '';
        position: absolute;
        inset: -2px;
        background: ${props => getRarityGradient(props.rarity)};
        border-radius: inherit;
        z-index: -1;
        animation: borderGlow 2s ease-in-out infinite;
    }
`;

const borderGlow = keyframes`
    0%, 100% { opacity: 0.5; }
    50% { opacity: 1; }
`;

const floatAnimation = keyframes`
    0%, 100% { transform: translateY(0px); }
    50% { transform: translateY(-10px); }
`;

const getRarityGradient = (rarity: string) => {
    switch (rarity) {
        case 'Legendary':
            return 'linear-gradient(45deg, #FFD700, #FFA500, #FF4500)';
        case 'Epic':
            return 'linear-gradient(45deg, #9400D3, #4B0082, #8A2BE2)';
        case 'Rare':
            return 'linear-gradient(45deg, #0000FF, #000080, #4169E1)';
        default:
            return 'linear-gradient(45deg, #808080, #404040, #696969)';
    }
};

const NFTShowcase = () => {
    const { connected } = useWallet();
    const [selectedNFT, setSelectedNFT] = useState<NFT | null>(null);
    const [loading, setLoading] = useState(false);
    const [rotation, setRotation] = useState({ x: 0, y: 0 });

    const mockNFTs: NFT[] = [
        {
            id: '1',
            title: 'Neural Network Entity #001',
            description: 'An AI-powered digital being that evolves with blockchain interactions',
            image: 'data:image/svg+xml;charset=UTF-8,' + encodeURIComponent(`
                <svg width="300" height="300" xmlns="http://www.w3.org/2000/svg">
                    <defs>
                        <linearGradient id="grad1" x1="0%" y1="0%" x2="100%" y2="100%">
                            <stop offset="0%" style="stop-color:#FF0080;stop-opacity:1" />
                            <stop offset="100%" style="stop-color:#7928CA;stop-opacity:1" />
                        </linearGradient>
                        <filter id="glow">
                            <feGaussianBlur stdDeviation="3" result="coloredBlur"/>
                            <feMerge>
                                <feMergeNode in="coloredBlur"/>
                                <feMergeNode in="SourceGraphic"/>
                            </feMerge>
                        </filter>
                    </defs>
                    <rect width="100%" height="100%" fill="url(#grad1)"/>
                    <g filter="url(#glow)">
                        <circle cx="150" cy="150" r="80" fill="none" stroke="white" stroke-width="2">
                            <animate attributeName="r" values="80;90;80" dur="2s" repeatCount="indefinite"/>
                        </circle>
                        <circle cx="150" cy="150" r="40" fill="none" stroke="white" stroke-width="2">
                            <animate attributeName="r" values="40;50;40" dur="1.5s" repeatCount="indefinite"/>
                        </circle>
                        ${Array.from({ length: 8 }).map((_, i) => {
                const angle = (i * Math.PI * 2) / 8;
                const x = 150 + Math.cos(angle) * 60;
                const y = 150 + Math.sin(angle) * 60;
                return `
                                <circle cx="${x}" cy="${y}" r="5" fill="white">
                                    <animate attributeName="opacity" values="0.3;1;0.3" dur="1s" repeatCount="indefinite" begin="${i * 0.2}s"/>
                                </circle>
                            `;
            }).join('')}
                    </g>
                    <text x="150" y="160" font-family="Arial" font-size="20" fill="white" text-anchor="middle" filter="url(#glow)">AI Agent #001</text>
                </svg>
            `),
            attributes: ['Self-Evolving', 'Interactive', 'Dynamic'],
            rarity: 'Legendary',
            animation: {
                gradientColors: ['#FF0080', '#7928CA', '#FF0080'],
                pulseSpeed: 2
            },
            aiVisualization: {
                type: 'agent',
                animationData: '...' // Add Lottie animation data here
            }
        },
        {
            id: '2',
            title: 'Quantum Data Sphere #042',
            description: 'Visualization of quantum computing processes in the metaverse',
            image: 'data:image/svg+xml;charset=UTF-8,' + encodeURIComponent(`
                <svg width="300" height="300" xmlns="http://www.w3.org/2000/svg">
                    <defs>
                        <linearGradient id="grad2" x1="0%" y1="0%" x2="100%" y2="100%">
                            <stop offset="0%" style="stop-color:#00ff87;stop-opacity:1" />
                            <stop offset="100%" style="stop-color:#60efff;stop-opacity:1" />
                        </linearGradient>
                    </defs>
                    <rect width="100%" height="100%" fill="url(#grad2)"/>
                    <g transform="translate(150,150)">
                        ${Array.from({ length: 12 }).map((_, i) => {
                const angle = (i * Math.PI * 2) / 12;
                const x = Math.cos(angle) * 60;
                const y = Math.sin(angle) * 60;
                return `
                                <circle cx="${x}" cy="${y}" r="8" fill="#60efff">
                                    <animate attributeName="r" values="8;12;8" dur="2s" repeatCount="indefinite" begin="${i * 0.2}s"/>
                                </circle>
                            `;
            }).join('')}
                    </g>
                </svg>
            `),
            attributes: ['Quantum-Enabled', 'Data-Reactive', 'Animated'],
            rarity: 'Epic',
            animation: {
                gradientColors: ['#00ff87', '#60efff', '#00ff87'],
                pulseSpeed: 3
            },
            aiVisualization: {
                type: 'quantum',
                animationData: '...' // Add quantum visualization data
            }
        },
        {
            id: '3',
            title: 'DecentraVision #103',
            description: 'A dynamic NFT that responds to blockchain activity',
            image: 'data:image/svg+xml;charset=UTF-8,' + encodeURIComponent(`
                <svg width="300" height="300" xmlns="http://www.w3.org/2000/svg">
                    <defs>
                        <linearGradient id="grad3" x1="0%" y1="0%" x2="100%" y2="100%">
                            <stop offset="0%" style="stop-color:#7928CA;stop-opacity:1" />
                            <stop offset="100%" style="stop-color:#FF0080;stop-opacity:1" />
                        </linearGradient>
                    </defs>
                    <rect width="100%" height="100%" fill="url(#grad3)"/>
                    <g transform="translate(150,150)">
                        <path d="M0,-60 L52,30 L-52,30 Z" fill="none" stroke="white" stroke-width="2">
                            <animate attributeName="stroke-dasharray" values="0,1000;1000,0" dur="3s" repeatCount="indefinite"/>
                        </path>
                    </g>
                </svg>
            `),
            attributes: ['Chain-Reactive', 'Generative', 'Unique'],
            rarity: 'Rare',
            animation: {
                gradientColors: ['#7928CA', '#FF0080', '#7928CA'],
                pulseSpeed: 4
            },
            aiVisualization: {
                type: 'network',
                animationData: '...' // Add network visualization data
            }
        }
    ];

    const getRarityColor = (rarity: string) => {
        switch (rarity) {
            case 'Legendary': return 'linear-gradient(45deg, #FFD700, #FFA500)';
            case 'Epic': return 'linear-gradient(45deg, #9400D3, #4B0082)';
            case 'Rare': return 'linear-gradient(45deg, #0000FF, #000080)';
            default: return 'linear-gradient(45deg, #808080, #404040)';
        }
    };

    const cardVariants = {
        hidden: { y: 20, opacity: 0 },
        visible: {
            y: 0,
            opacity: 1,
            transition: {
                duration: 0.5
            }
        },
        hover: {
            scale: 1.05,
            boxShadow: "0px 0px 20px rgba(0,0,0,0.3)",
            transition: {
                duration: 0.3
            }
        }
    };

    const containerVariants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: {
                staggerChildren: 0.2
            }
        }
    };

    const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
        const card = e.currentTarget;
        const rect = card.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        const centerX = rect.width / 2;
        const centerY = rect.height / 2;

        setRotation({
            x: ((y - centerY) / centerY) * 20,
            y: ((x - centerX) / centerX) * 20
        });
    };

    return (
        <Container maxWidth="lg">
            <Box sx={{
                py: 8,
                background: 'linear-gradient(180deg, rgba(0,0,0,0.8) 0%, rgba(0,0,0,0.6) 100%)',
                borderRadius: 2,
                backdropFilter: 'blur(10px)'
            }}>
                <Typography
                    variant="h3"
                    component="h1"
                    gutterBottom
                    sx={{
                        textAlign: 'center',
                        background: 'linear-gradient(45deg, #FF0080 30%, #7928CA 90%)',
                        WebkitBackgroundClip: 'text',
                        WebkitTextFillColor: 'transparent',
                        mb: 6,
                        fontWeight: 'bold',
                        textShadow: '2px 2px 4px rgba(0,0,0,0.2)'
                    }}
                >
                    Dynamic NFT Showcase
                </Typography>

                <Box sx={{ display: 'flex', justifyContent: 'center', mb: 4 }}>
                    <WalletMultiButton />
                </Box>

                <motion.div variants={containerVariants} initial="hidden" animate="visible">
                    <Grid container spacing={4}>
                        {mockNFTs.map((nft) => (
                            <Grid item xs={12} sm={6} md={4} key={nft.id}>
                                <AnimatedCard
                                    variants={cardVariants}
                                    whileHover="hover"
                                    gradientColors={nft.animation.gradientColors}
                                    rarity={nft.rarity}
                                    onMouseMove={handleMouseMove}
                                    onMouseLeave={() => setRotation({ x: 0, y: 0 })}
                                    style={{
                                        transform: `perspective(1000px) rotateX(${rotation.x}deg) rotateY(${rotation.y}deg)`
                                    }}
                                    sx={{
                                        background: 'rgba(255, 255, 255, 0.05)',
                                        backdropFilter: 'blur(10px)',
                                        border: '1px solid rgba(255, 255, 255, 0.1)',
                                        position: 'relative',
                                        overflow: 'hidden',
                                        animation: `${floatAnimation} 3s ease-in-out infinite`,
                                        '&:hover': {
                                            '& .MuiCardMedia-root': {
                                                transform: 'scale(1.05) rotateY(10deg)',
                                                filter: 'brightness(1.2) contrast(1.1)'
                                            },
                                            '& .attribute-chip': {
                                                transform: 'translateZ(20px)',
                                                boxShadow: '0 5px 15px rgba(0,0,0,0.3)'
                                            }
                                        }
                                    }}
                                >
                                    <CanvasParticleEffect rarity={nft.rarity} />
                                    <CardMedia
                                        component="img"
                                        height="300"
                                        image={nft.image}
                                        alt={nft.title}
                                        sx={{
                                            objectFit: 'cover',
                                            transition: 'all 0.5s cubic-bezier(0.4, 0, 0.2, 1)',
                                            position: 'relative',
                                            zIndex: 1,
                                            transformStyle: 'preserve-3d'
                                        }}
                                    />
                                    <CardContent sx={{ position: 'relative', zIndex: 2 }}>
                                        <Box sx={{
                                            mb: 2,
                                            position: 'relative',
                                            transformStyle: 'preserve-3d',
                                            '&::before': {
                                                content: '""',
                                                position: 'absolute',
                                                top: -24,
                                                left: -24,
                                                right: -24,
                                                bottom: -24,
                                                background: 'rgba(0,0,0,0.5)',
                                                backdropFilter: 'blur(5px)',
                                                zIndex: -1,
                                                borderRadius: 2
                                            }
                                        }}>
                                            <Chip
                                                label={nft.rarity}
                                                sx={{
                                                    background: getRarityGradient(nft.rarity),
                                                    color: 'white',
                                                    fontWeight: 'bold',
                                                    mb: 2,
                                                    boxShadow: '0 0 20px rgba(0,0,0,0.5)',
                                                    animation: `${borderGlow} 2s ease-in-out infinite`
                                                }}
                                            />
                                            <Typography
                                                variant="h6"
                                                gutterBottom
                                                sx={{
                                                    color: 'white',
                                                    textShadow: '2px 2px 4px rgba(0,0,0,0.3)'
                                                }}
                                            >
                                                {nft.title}
                                            </Typography>
                                            <Typography
                                                variant="body2"
                                                sx={{
                                                    color: 'rgba(255,255,255,0.8)',
                                                    textShadow: '1px 1px 2px rgba(0,0,0,0.3)'
                                                }}
                                            >
                                                {nft.description}
                                            </Typography>
                                        </Box>
                                        <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, mb: 2 }}>
                                            {nft.attributes.map((attr, index) => (
                                                <Chip
                                                    key={index}
                                                    label={attr}
                                                    className="attribute-chip"
                                                    size="small"
                                                    sx={{
                                                        background: 'rgba(255, 255, 255, 0.1)',
                                                        backdropFilter: 'blur(5px)',
                                                        border: '1px solid rgba(255, 255, 255, 0.2)',
                                                        transition: 'all 0.3s ease',
                                                        '&:hover': {
                                                            transform: 'scale(1.1) translateZ(30px)',
                                                            background: 'rgba(255, 255, 255, 0.2)'
                                                        }
                                                    }}
                                                />
                                            ))}
                                        </Box>
                                        <Button
                                            variant="contained"
                                            fullWidth
                                            disabled={!connected}
                                            sx={{
                                                background: getRarityGradient(nft.rarity),
                                                color: 'white',
                                                transform: 'translateZ(20px)',
                                                transition: 'all 0.3s ease',
                                                '&:hover': {
                                                    transform: 'translateZ(30px) scale(1.05)',
                                                    boxShadow: '0 10px 20px rgba(0,0,0,0.3)'
                                                }
                                            }}
                                        >
                                            {connected ? 'Mint NFT' : 'Connect Wallet'}
                                        </Button>
                                    </CardContent>
                                </AnimatedCard>
                            </Grid>
                        ))}
                    </Grid>
                </motion.div>
            </Box>

            <style jsx global>{`
                @keyframes pulse {
                    0% {
                        opacity: 0.1;
                    }
                    100% {
                        opacity: 0.3;
                    }
                }
            `}</style>
        </Container>
    );
};

export default NFTShowcase; 