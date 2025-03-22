import React from 'react';
import {
    Card,
    CardContent,
    CardMedia,
    Typography,
    Box,
    Chip,
    LinearProgress,
    IconButton,
    Tooltip
} from '@mui/material';
import { motion } from 'framer-motion';
import PsychologyIcon from '@mui/icons-material/Psychology';
import AutoFixHighIcon from '@mui/icons-material/AutoFixHigh';
import TokenIcon from '@mui/icons-material/Token';

interface AgentCardProps {
    agent: {
        id: string;
        name: string;
        type: string;
        level: number;
        image: string;
        specializations: string[];
        intelligence: number;
        experience: number;
        nextLevelExp: number;
    };
    onMint?: () => void;
}

const AgentCard: React.FC<AgentCardProps> = ({ agent, onMint }) => {
    return (
        <Card
            component={motion.div}
            whileHover={{ scale: 1.02 }}
            sx={{
                height: '100%',
                display: 'flex',
                flexDirection: 'column',
                position: 'relative',
                overflow: 'visible'
            }}
        >
            <Box
                sx={{
                    position: 'absolute',
                    top: -15,
                    right: -15,
                    bgcolor: 'primary.main',
                    borderRadius: '50%',
                    p: 1,
                    zIndex: 1
                }}
            >
                <Typography variant="h6">Lvl {agent.level}</Typography>
            </Box>

            <CardMedia
                component="img"
                height="200"
                image={agent.image}
                alt={agent.name}
            />

            <CardContent>
                <Typography variant="h5" gutterBottom>
                    {agent.name}
                </Typography>

                <Box sx={{ mb: 2 }}>
                    {agent.specializations.map((spec, index) => (
                        <Chip
                            key={index}
                            label={spec}
                            size="small"
                            icon={<AutoFixHighIcon />}
                            sx={{ mr: 0.5, mb: 0.5 }}
                        />
                    ))}
                </Box>

                <Box sx={{ mb: 2 }}>
                    <Typography variant="body2" color="text.secondary">
                        Intelligence
                    </Typography>
                    <LinearProgress
                        variant="determinate"
                        value={agent.intelligence}
                        sx={{ height: 8, borderRadius: 4 }}
                    />
                </Box>

                <Box sx={{ mb: 2 }}>
                    <Typography variant="body2" color="text.secondary">
                        Experience
                    </Typography>
                    <LinearProgress
                        variant="determinate"
                        value={(agent.experience / agent.nextLevelExp) * 100}
                        sx={{ height: 8, borderRadius: 4 }}
                    />
                    <Typography variant="caption">
                        {agent.experience} / {agent.nextLevelExp} XP
                    </Typography>
                </Box>

                {onMint && (
                    <Box sx={{ display: 'flex', justifyContent: 'flex-end' }}>
                        <Tooltip title="Mint as NFT">
                            <IconButton onClick={onMint} color="primary">
                                <TokenIcon />
                            </IconButton>
                        </Tooltip>
                    </Box>
                )}
            </CardContent>
        </Card>
    );
};

export default AgentCard; 