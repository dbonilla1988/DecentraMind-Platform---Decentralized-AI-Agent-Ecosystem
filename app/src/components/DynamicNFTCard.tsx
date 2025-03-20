import React, { useEffect, useState } from 'react';
import { Card, CardContent, Typography, Box, Button, LinearProgress, Chip, Grid, Collapse, Slider } from '@mui/material';
import { styled, keyframes } from '@mui/material/styles';

const pulseAnimation = keyframes`
  0% { box-shadow: 0 0 15px rgba(0, 255, 255, 0.3); }
  50% { box-shadow: 0 0 30px rgba(0, 255, 255, 0.6); }
  100% { box-shadow: 0 0 15px rgba(0, 255, 255, 0.3); }
`;

const colorShift = keyframes`
  0% { filter: hue-rotate(0deg); }
  50% { filter: hue-rotate(180deg); }
  100% { filter: hue-rotate(360deg); }
`;

const floatAnimation = keyframes`
  0% { transform: translateY(0px); }
  50% { transform: translateY(-10px); }
  100% { transform: translateY(0px); }
`;

const pulseEffect = keyframes`
    0% { transform: scale(1); }
    50% { transform: scale(1.02); }
    100% { transform: scale(1); }
`;

const SpecialAbilityChip = styled(Chip)(({ theme }) => ({
    margin: '2px',
    background: 'linear-gradient(45deg, #00ffff 30%, #ff00ff 90%)',
    color: 'white',
    fontSize: '0.7rem',
    height: '20px'
}));

const DynamicCard = styled(Card)(({ theme }) => ({
    background: 'rgba(15, 15, 25, 0.8)',
    backdropFilter: 'blur(10px)',
    border: '1px solid rgba(0, 255, 255, 0.2)',
    transition: 'all 0.4s ease-in-out',
    animation: `${pulseAnimation} 3s infinite`,
    '&:hover': {
        transform: 'translateY(-10px) scale(1.02)',
        border: '1px solid rgba(0, 255, 255, 0.8)',
    }
}));

const NFTImage = styled(Box)<{ tier: string }>(({ tier }) => ({
    width: '100%',
    height: '300px',
    background: getTierBackground(tier),
    borderRadius: '10px',
    overflow: 'hidden',
    position: 'relative',
    '&::before': {
        content: '""',
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        background: 'linear-gradient(45deg, rgba(0,255,255,0.2), rgba(255,0,255,0.2))',
        animation: `${colorShift} 10s infinite`,
    },
    '&::after': {
        content: '""',
        position: 'absolute',
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
        width: '80%',
        height: '80%',
        background: tier === 'Singularity-Node' ?
            'radial-gradient(circle, rgba(255,255,255,0.2) 0%, transparent 70%)' : 'none',
        animation: tier === 'Singularity-Node' ? `${pulseEffect} 2s infinite` : 'none',
    }
}));

const HoloButton = styled(Button)(({ theme }) => ({
    background: 'linear-gradient(45deg, rgba(0, 255, 255, 0.2), rgba(255, 0, 255, 0.2))',
    border: '1px solid rgba(255, 255, 255, 0.2)',
    color: '#fff',
    backdropFilter: 'blur(5px)',
    transition: 'all 0.3s ease-in-out',
    '&:hover': {
        background: 'linear-gradient(45deg, rgba(0, 255, 255, 0.4), rgba(255, 0, 255, 0.4))',
        border: '1px solid rgba(255, 255, 255, 0.5)',
        transform: 'translateY(-2px)',
        boxShadow: '0 5px 15px rgba(0, 255, 255, 0.3)',
    }
}));

const EvolutionIndicator = styled(Box)(({ theme }) => ({
    position: 'absolute',
    top: 10,
    right: 10,
    zIndex: 2,
}));

const AIMemoryLog = styled(Box)(({ theme }) => ({
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    padding: '10px',
    background: 'rgba(0, 0, 0, 0.8)',
    backdropFilter: 'blur(5px)',
    color: '#00ffff',
    fontSize: '0.8rem',
    transform: 'translateY(100%)',
    transition: 'transform 0.3s ease-in-out',
}));

const AIStatusBadge = styled(Box)(({ theme }) => ({
    position: 'absolute',
    top: 10,
    left: 10,
    zIndex: 2,
    display: 'flex',
    alignItems: 'center',
    gap: '5px',
}));

interface AIStatus {
    governance: number;
    training: number;
    market: number;
    innovation: number;
    adaptability: number;
    accuracy: number;
    speed: number;
    specialization: number;
}

interface NFTData {
    id: number;
    title: string;
    price: string;
    rarity: 'Common' | 'Rare' | 'Epic' | 'Legendary' | 'Mythical';
    tier: 'Proto-AI' | 'Sentient-AI' | 'Neural-Overseer' | 'Quantum-Architect' | 'Singularity-Node';
    evolutionProgress: number;
    aiMemory: string[];
    stakingAPY: number;
    aiStatus: AIStatus;
    governanceVotes: number;
    lastAction: string;
    specialAbilities: string[];
    marketInfluence: number;
    class: 'Governance' | 'Staking' | 'Trading' | 'Meta';
    name: string;
    marketCondition: 'bull' | 'bear' | 'neutral';
    stakingPool: 'conservative' | 'balanced' | 'high-risk';
    daoRank: number;
}

interface DynamicNFTCardProps extends NFTData { }

const MarketConditionGlow = styled(Box)<{ condition: 'bull' | 'bear' | 'neutral' }>(({ condition }) => ({
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    zIndex: 1,
    pointerEvents: 'none',
    background: `radial-gradient(circle, ${condition === 'bull' ? 'rgba(0, 255, 0, 0.2)' :
        condition === 'bear' ? 'rgba(255, 0, 0, 0.2)' :
            'rgba(255, 255, 255, 0.2)'
        } 0%, transparent 70%)`
}));

const trainingPulse = keyframes`
    0% { transform: scale(1); opacity: 0.8; }
    50% { transform: scale(1.1); opacity: 1; }
    100% { transform: scale(1); opacity: 0.8; }
`;

const neuralPathway = keyframes`
    0% { background-position: 0% 0%; }
    100% { background-position: 100% 100%; }
`;

const TrainingOverlay = styled(Box)(({ theme }) => ({
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    background: 'linear-gradient(45deg, rgba(0,255,255,0.1), rgba(255,0,255,0.1))',
    backgroundSize: '200% 200%',
    animation: `${neuralPathway} 2s linear infinite`,
    zIndex: 2,
    pointerEvents: 'none',
}));

const evolutionRipple = keyframes`
  0% { transform: scale(1); opacity: 0.8; border-color: #00ffff; }
  50% { transform: scale(1.2); opacity: 0.4; border-color: #ff00ff; }
  100% { transform: scale(1); opacity: 0.8; border-color: #00ffff; }
`;

const evolutionGlow = keyframes`
  0% { box-shadow: 0 0 20px #00ffff; }
  50% { box-shadow: 0 0 40px #ff00ff; }
  100% { box-shadow: 0 0 20px #00ffff; }
`;

const TrainingInterface = styled(Box)(({ theme }) => ({
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: '90%',
    padding: '20px',
    backgroundColor: 'rgba(0,0,0,0.9)',
    borderRadius: '10px',
    border: '1px solid #00ffff',
    zIndex: 10,
}));

const energyCore = keyframes`
  0% { box-shadow: 0 0 20px #00ffff, inset 0 0 20px #00ffff; }
  50% { box-shadow: 0 0 40px #ff00ff, inset 0 0 40px #ff00ff; }
  100% { box-shadow: 0 0 20px #00ffff, inset 0 0 20px #00ffff; }
`;

const holoDisplay = keyframes`
  0% { opacity: 0.7; transform: translateY(0); }
  50% { opacity: 1; transform: translateY(-5px); }
  100% { opacity: 0.7; transform: translateY(0); }
`;

const AIHologram = styled(Box)<{ tier: string }>(({ tier }) => ({
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    background: getTierBackground(tier),
    opacity: 0.6,
    zIndex: 1,
    animation: `${holoDisplay} 3s infinite ease-in-out`,
}));

const EnergyCore = styled(Box)<{ active: boolean }>(({ active }) => ({
    position: 'absolute',
    width: '30px',
    height: '30px',
    borderRadius: '50%',
    background: 'radial-gradient(circle, #00ffff 0%, #ff00ff 100%)',
    animation: active ? `${energyCore} 2s infinite` : 'none',
    zIndex: 2,
}));

const getTierBackground = (tier: string) => {
    switch (tier) {
        case 'Proto-AI':
            return 'linear-gradient(45deg, rgba(76, 175, 80, 0.3), rgba(33, 150, 243, 0.3))';
        case 'Sentient-AI':
            return 'linear-gradient(45deg, rgba(33, 150, 243, 0.3), rgba(156, 39, 176, 0.3))';
        case 'Neural-Overseer':
            return 'linear-gradient(45deg, rgba(156, 39, 176, 0.3), rgba(255, 152, 0, 0.3))';
        case 'Quantum-Architect':
            return 'linear-gradient(45deg, rgba(255, 152, 0, 0.3), rgba(255, 23, 68, 0.3))';
        case 'Singularity-Node':
            return 'linear-gradient(45deg, rgba(255, 23, 68, 0.3), rgba(0, 255, 255, 0.3))';
        default:
            return 'none';
    }
};

const hologramFlicker = keyframes`
  0% { opacity: 0.8; transform: scale(1); filter: brightness(1); }
  25% { opacity: 0.9; transform: scale(1.001); filter: brightness(1.2); }
  50% { opacity: 0.7; transform: scale(0.999); filter: brightness(0.9); }
  75% { opacity: 0.9; transform: scale(1.001); filter: brightness(1.1); }
  100% { opacity: 0.8; transform: scale(1); filter: brightness(1); }
`;

const dataStream = keyframes`
  0% { transform: translateY(-100%); opacity: 0; }
  50% { opacity: 1; }
  100% { transform: translateY(100%); opacity: 0; }
`;

const circuitFlow = keyframes`
  0% { background-position: 0% 0%; }
  100% { background-position: 200% 200%; }
`;

const HolographicOverlay = styled(Box)<{ tier: string }>(({ tier }) => ({
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    background: `
    linear-gradient(45deg, 
      ${getTierBackground(tier).split('),')[0]}, 
      transparent
    )
  `,
    animation: `${hologramFlicker} 5s infinite`,
    pointerEvents: 'none',
    zIndex: 2,
}));

const DataStreamEffect = styled(Box)`
  position: absolute;
  width: 2px;
  height: 100%;
  background: linear-gradient(to bottom, transparent, #00ffff, transparent);
  animation: ${dataStream} 2s linear infinite;
`;

const CircuitPattern = styled(Box)<{ tier: string }>(({ tier }) => ({
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundImage: `
    repeating-linear-gradient(
      45deg,
      transparent,
      transparent 10px,
      ${getTierColor(tier)}20 10px,
      ${getTierColor(tier)}20 20px
    )
  `,
    backgroundSize: '200% 200%',
    animation: `${circuitFlow} 20s linear infinite`,
    opacity: 0.1,
    zIndex: 1,
}));

const getTierColor = (tier: string) => {
    const colors = {
        'Proto-AI': '#4CAF50',
        'Sentient-AI': '#2196F3',
        'Neural-Overseer': '#9C27B0',
        'Quantum-Architect': '#FF9800',
        'Singularity-Node': '#FF1744'
    };
    return colors[tier as keyof typeof colors] || '#ffffff';
};

const DynamicNFTCard: React.FC<DynamicNFTCardProps> = ({
    id, title, price, rarity, tier, evolutionProgress: initialEvolutionProgress, aiMemory, stakingAPY, aiStatus, governanceVotes, lastAction, specialAbilities = [], marketInfluence, class: aiClass, name, marketCondition, stakingPool, daoRank
}) => {
    const [glowIntensity, setGlowIntensity] = useState(0.3);
    const [showMemory, setShowMemory] = useState(false);
    const [isTraining, setIsTraining] = useState(false);
    const [showAIStats, setShowAIStats] = useState(false);
    const [isVoting, setIsVoting] = useState(false);
    const [voteAmount, setVoteAmount] = useState(0);
    const [trainingPhase, setTrainingPhase] = useState<'idle' | 'learning' | 'evolving'>('idle');
    const [evolutionProgress, setEvolutionProgress] = useState(initialEvolutionProgress);
    const [isEvolving, setIsEvolving] = useState(false);
    const [trainingStats, setTrainingStats] = useState({
        currentPhase: '',
        completedTasks: 0,
        totalTasks: 5,
        currentFocus: '',
    });
    const [showTrainingInterface, setShowTrainingInterface] = useState(false);
    const [isHovered, setIsHovered] = useState(false);
    const [activeDataStreams, setActiveDataStreams] = useState<number[]>([]);

    useEffect(() => {
        const interval = setInterval(() => {
            setGlowIntensity(prev => Math.random() * 0.5 + 0.3);
        }, 2000);

        return () => clearInterval(interval);
    }, []);

    useEffect(() => {
        if (isHovered && tier !== 'Proto-AI') {
            const interval = setInterval(() => {
                setActiveDataStreams(prev => {
                    const newStreams = [...prev];
                    if (newStreams.length < getMaxDataStreams(tier)) {
                        newStreams.push(Math.random() * 100);
                    }
                    return newStreams.slice(-getMaxDataStreams(tier));
                });
            }, 500);
            return () => clearInterval(interval);
        }
    }, [isHovered, tier]);

    const getTierColor = (tier: string) => {
        const colors = {
            'Proto-AI': '#4CAF50',
            'Sentient-AI': '#2196F3',
            'Neural-Overseer': '#9C27B0',
            'Quantum-Architect': '#FF9800',
            'Singularity-Node': '#FF1744'
        };
        return colors[tier as keyof typeof colors] || '#ffffff';
    };

    const getMarketStyle = () => {
        switch (marketCondition) {
            case 'bull': return { filter: 'hue-rotate(120deg)' };
            case 'bear': return { filter: 'hue-rotate(0deg)' };
            default: return { filter: 'hue-rotate(60deg)' };
        }
    };

    const handleTraining = () => {
        setIsTraining(true);
        setTrainingPhase('learning');

        // Simulate AI training phases
        setTimeout(() => {
            setTrainingPhase('evolving');
            setTimeout(() => {
                setIsTraining(false);
                setTrainingPhase('idle');
                // Simulate AI evolution
                setEvolutionProgress(prev => Math.min(prev + 5, 100));
            }, 3000);
        }, 3000);
    };

    const handleTrainingPhase = async () => {
        setShowTrainingInterface(true);
        setTrainingStats(prev => ({ ...prev, currentPhase: 'Initializing Training' }));

        const trainingPhases = [
            { phase: 'Data Analysis', focus: 'Analyzing historical governance data' },
            { phase: 'Pattern Recognition', focus: 'Learning market patterns' },
            { phase: 'Strategy Development', focus: 'Developing optimization strategies' },
            { phase: 'Integration Testing', focus: 'Testing new capabilities' },
            { phase: 'Evolution Assessment', focus: 'Evaluating performance metrics' }
        ];

        for (let i = 0; i < trainingPhases.length; i++) {
            setTrainingStats(prev => ({
                ...prev,
                currentPhase: trainingPhases[i].phase,
                currentFocus: trainingPhases[i].focus,
                completedTasks: i
            }));
            await new Promise(resolve => setTimeout(resolve, 2000));
        }

        setIsEvolving(true);
        await new Promise(resolve => setTimeout(resolve, 3000));
        setEvolutionProgress(prev => Math.min(prev + 5, 100));
        setIsEvolving(false);
        setShowTrainingInterface(false);
    };

    const renderTrainingInterface = () => (
        <TrainingInterface>
            <Typography variant="h6" sx={{ color: '#00ffff', mb: 2 }}>
                AI Training Progress
            </Typography>
            <Box sx={{ mb: 2 }}>
                <Typography variant="body2" sx={{ color: '#fff' }}>
                    Phase: {trainingStats.currentPhase}
                </Typography>
                <Typography variant="caption" sx={{ color: 'rgba(255,255,255,0.7)' }}>
                    {trainingStats.currentFocus}
                </Typography>
                <LinearProgress
                    variant="determinate"
                    value={(trainingStats.completedTasks / trainingStats.totalTasks) * 100}
                    sx={{
                        mt: 1,
                        backgroundColor: 'rgba(255,255,255,0.1)',
                        '& .MuiLinearProgress-bar': {
                            background: 'linear-gradient(45deg, #00ffff, #ff00ff)'
                        }
                    }}
                />
            </Box>
        </TrainingInterface>
    );

    const getMaxDataStreams = (tier: string) => {
        switch (tier) {
            case 'Singularity-Node': return 8;
            case 'Quantum-Architect': return 6;
            case 'Neural-Overseer': return 4;
            case 'Sentient-AI': return 2;
            default: return 0;
        }
    };

    return (
        <DynamicCard
            onMouseEnter={() => {
                setIsHovered(true);
                setShowMemory(true);
            }}
            onMouseLeave={() => {
                setIsHovered(false);
                setActiveDataStreams([]);
                setShowMemory(false);
            }}
            sx={{
                boxShadow: `0 0 ${20 * glowIntensity}px rgba(0, 255, 255, ${glowIntensity})`,
                position: 'relative',
                overflow: 'hidden',
                animation: isTraining ? `${floatAnimation} 2s infinite` : isEvolving ? `${evolutionRipple} 2s infinite` : undefined,
                ...getMarketStyle(),
                transform: isHovered ? 'scale(1.02)' : 'scale(1)',
            }}
        >
            <AIHologram tier={tier} />

            {(tier === 'Quantum-Architect' || tier === 'Singularity-Node') && (
                <EnergyCore
                    active={true}
                    sx={{
                        top: '20px',
                        left: '20px'
                    }}
                />
            )}

            <MarketConditionGlow condition={marketCondition} />

            <Box sx={{ position: 'absolute', top: 10, right: 10, zIndex: 3 }}>
                <Chip
                    label={`DAO Rank #${daoRank}`}
                    sx={{
                        background: 'linear-gradient(45deg, #FFD700, #FFA500)',
                        color: 'black',
                        fontWeight: 'bold'
                    }}
                />
            </Box>

            <Box sx={{ position: 'absolute', top: 10, left: 10, zIndex: 3 }}>
                <Chip
                    label={`${aiClass} AI: ${name}`}
                    sx={{
                        background: 'linear-gradient(45deg, #00ffff, #ff00ff)',
                        color: 'white'
                    }}
                />
            </Box>

            <Box sx={{ position: 'absolute', bottom: 10, right: 10, zIndex: 3 }}>
                <Chip
                    label={`${stakingPool} Pool`}
                    sx={{
                        backgroundColor: stakingPool === 'high-risk' ? '#ff4444' :
                            stakingPool === 'balanced' ? '#ffbb33' :
                                '#00C851'
                    }}
                />
            </Box>

            <AIStatusBadge>
                <Chip
                    label={`AI Level: ${Math.floor(
                        (aiStatus.governance +
                            aiStatus.training +
                            aiStatus.market +
                            aiStatus.innovation +
                            aiStatus.adaptability) / 5
                    )}`}
                    sx={{
                        background: 'linear-gradient(45deg, #00ffff 30%, #ff00ff 90%)',
                        color: 'white'
                    }}
                />
            </AIStatusBadge>

            <EvolutionIndicator>
                <Chip
                    label={tier}
                    sx={{
                        backgroundColor: getTierColor(tier),
                        color: 'white',
                        fontWeight: 'bold'
                    }}
                />
            </EvolutionIndicator>

            <NFTImage
                tier={tier}
                sx={{
                    filter: isTraining ? 'hue-rotate(90deg) brightness(1.2)' : undefined,
                    transition: 'all 0.5s ease-in-out',
                    transform: tier === 'Singularity-Node' ? 'scale(1.05)' : 'none'
                }}
            />

            {(tier === 'Neural-Overseer' || tier === 'Quantum-Architect' || tier === 'Singularity-Node') && (
                <Box
                    sx={{
                        position: 'absolute',
                        top: '50%',
                        left: '50%',
                        transform: 'translate(-50%, -50%)',
                        width: '100%',
                        height: '100%',
                        background: 'linear-gradient(45deg, rgba(0,255,255,0.1), rgba(255,0,255,0.1))',
                        opacity: 0.5,
                        zIndex: 2,
                        pointerEvents: 'none',
                        animation: `${holoDisplay} 3s infinite ease-in-out`
                    }}
                />
            )}

            <CardContent>
                <Typography variant="h5" component="div" sx={{
                    color: '#fff',
                    textShadow: '0 0 10px rgba(0, 255, 255, 0.5)'
                }}>
                    {title}
                </Typography>

                <Box sx={{ mt: 2, mb: 1 }}>
                    <Typography variant="caption" sx={{ color: 'rgba(255,255,255,0.7)' }}>
                        Evolution Progress
                    </Typography>
                    <LinearProgress
                        variant="determinate"
                        value={evolutionProgress}
                        sx={{
                            backgroundColor: 'rgba(255,255,255,0.1)',
                            '& .MuiLinearProgress-bar': {
                                backgroundColor: getTierColor(tier)
                            }
                        }}
                    />
                </Box>

                <Typography sx={{ color: 'rgba(255,255,255,0.7)', mb: 2 }}>
                    {price} SOL • {rarity} • APY: {stakingAPY}%
                </Typography>

                {specialAbilities && specialAbilities.length > 0 && (
                    <Box sx={{ mt: 2 }}>
                        <Typography variant="caption" sx={{ color: '#00ffff' }}>
                            Special Abilities
                        </Typography>
                        <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5, mt: 1 }}>
                            {specialAbilities.map((ability, index) => (
                                <SpecialAbilityChip key={index} label={ability} />
                            ))}
                        </Box>
                    </Box>
                )}

                <Box sx={{ mt: 2 }}>
                    <Typography variant="caption" sx={{ color: '#00ffff' }}>
                        AI Metrics
                    </Typography>
                    <Grid container spacing={1} sx={{ mt: 1 }}>
                        {Object.entries(aiStatus).map(([key, value]) => (
                            <Grid item xs={6} key={key}>
                                <Typography variant="caption" sx={{ color: 'rgba(255,255,255,0.7)' }}>
                                    {key.charAt(0).toUpperCase() + key.slice(1)}
                                </Typography>
                                <LinearProgress
                                    variant="determinate"
                                    value={value}
                                    sx={{
                                        backgroundColor: 'rgba(255,255,255,0.1)',
                                        '& .MuiLinearProgress-bar': {
                                            background: 'linear-gradient(45deg, #00ffff 30%, #ff00ff 90%)'
                                        }
                                    }}
                                />
                            </Grid>
                        ))}
                    </Grid>
                </Box>

                {showTrainingInterface && renderTrainingInterface()}

                <Box sx={{ display: 'flex', gap: 1, mt: 2 }}>
                    <HoloButton
                        fullWidth
                        onClick={handleTrainingPhase}
                        disabled={showTrainingInterface}
                    >
                        {showTrainingInterface ? 'Training in Progress' : 'Train AI'}
                    </HoloButton>
                    <HoloButton
                        fullWidth
                        onClick={() => setIsVoting(!isVoting)}
                        disabled={showTrainingInterface}
                    >
                        Governance
                    </HoloButton>
                </Box>

                {showAIStats && (
                    <Box sx={{
                        mt: 2,
                        p: 2,
                        backgroundColor: 'rgba(0,0,0,0.3)',
                        borderRadius: '4px'
                    }}>
                        <Typography variant="caption" display="block">
                            Governance Votes: {governanceVotes}
                        </Typography>
                        <Typography variant="caption" display="block" sx={{ color: '#00ffff' }}>
                            Last Action: {lastAction}
                        </Typography>
                    </Box>
                )}
            </CardContent>

            <CircuitPattern tier={tier} />
            <HolographicOverlay tier={tier} />
            {activeDataStreams.map((position, index) => (
                <DataStreamEffect
                    key={index}
                    sx={{
                        left: `${position}%`,
                        animationDelay: `${index * 0.2}s`,
                        opacity: tier === 'Singularity-Node' ? 0.8 : 0.4,
                    }}
                />
            ))}

            {tier === 'Singularity-Node' && (
                <Box
                    sx={{
                        position: 'absolute',
                        top: '50%',
                        left: '50%',
                        transform: 'translate(-50%, -50%) rotate(45deg)',
                        width: '80%',
                        height: '80%',
                        border: '2px solid rgba(0, 255, 255, 0.3)',
                        borderRadius: '10px',
                        animation: `${evolutionRipple} 3s infinite`,
                        zIndex: 1,
                    }}
                />
            )}

            {(tier === 'Neural-Overseer' || tier === 'Quantum-Architect' || tier === 'Singularity-Node') && (
                <Box
                    sx={{
                        position: 'absolute',
                        top: isHovered ? '10%' : '50%',
                        left: '50%',
                        transform: 'translate(-50%, -50%)',
                        transition: 'all 0.5s ease-in-out',
                        opacity: isHovered ? 1 : 0,
                        zIndex: 3,
                    }}
                >
                    <Typography
                        sx={{
                            color: '#00ffff',
                            textShadow: '0 0 10px rgba(0, 255, 255, 0.5)',
                            fontSize: '0.8rem',
                            textAlign: 'center',
                            animation: `${hologramFlicker} 2s infinite`,
                        }}
                    >
                        {`${tier} Stats Active`}
                    </Typography>
                </Box>
            )}
        </DynamicCard>
    );
};

export default DynamicNFTCard; 