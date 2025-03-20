import React, { useState, useEffect } from 'react';
import { Box, Typography, Paper, TextField, Button, Avatar, CircularProgress, Chip, IconButton } from '@mui/material';
import { styled, keyframes } from '@mui/material/styles';
import { motion, AnimatePresence } from 'framer-motion';
import AutoGraphIcon from '@mui/icons-material/AutoGraph';
import BrainIcon from '@mui/icons-material/Psychology';
import CreateIcon from '@mui/icons-material/Create';
import AccountBalanceIcon from '@mui/icons-material/AccountBalance';
import ShowChartIcon from '@mui/icons-material/ShowChart';
import SecurityIcon from '@mui/icons-material/Security';

const pulseAnimation = keyframes`
  0% { transform: scale(1); opacity: 0.8; }
  50% { transform: scale(1.05); opacity: 1; }
  100% { transform: scale(1); opacity: 0.8; }
`;

const floatAnimation = keyframes`
  0% { transform: translateY(0px); }
  50% { transform: translateY(-10px); }
  100% { transform: translateY(0px); }
`;

const AgentContainer = styled(Paper)(({ theme }) => ({
    background: 'rgba(10, 10, 31, 0.9)',
    backdropFilter: 'blur(10px)',
    borderRadius: theme.spacing(2),
    padding: theme.spacing(3),
    border: '1px solid rgba(0,255,255,0.1)',
    position: 'relative',
    overflow: 'hidden',
}));

const AgentAvatar = styled(Avatar)(({ theme }) => ({
    width: 80,
    height: 80,
    background: 'linear-gradient(45deg, #00ffff, #ff00ff)',
    animation: `${pulseAnimation} 2s infinite`,
}));

const AgentSelector = styled(Box)(({ theme }) => ({
    display: 'flex',
    gap: theme.spacing(2),
    marginBottom: theme.spacing(3),
}));

const AgentChip = styled(Chip)<{ active: boolean }>(({ active, theme }) => ({
    background: active ? 'linear-gradient(45deg, #00ffff, #ff00ff)' : 'rgba(255,255,255,0.1)',
    color: active ? '#000' : '#fff',
    cursor: 'pointer',
    '&:hover': {
        background: active ? 'linear-gradient(45deg, #ff00ff, #00ffff)' : 'rgba(255,255,255,0.2)',
    },
}));

interface Message {
    id: string;
    text: string;
    sender: 'user' | 'agent';
    timestamp: Date;
}

const agentTypes = {
    research: {
        icon: <AutoGraphIcon />,
        name: 'Research Agent',
        description: 'Analyzes blockchain and AI data',
        specialty: ['Market Analysis', 'Trend Prediction', 'Data Synthesis']
    },
    creative: {
        icon: <CreateIcon />,
        name: 'Creative Agent',
        description: 'Generates innovative solutions',
        specialty: ['Content Creation', 'Design Ideas', 'Strategy Innovation']
    },
    strategy: {
        icon: <BrainIcon />,
        name: 'Strategy Agent',
        description: 'Optimizes decision-making',
        specialty: ['Risk Assessment', 'Resource Optimization', 'Performance Analysis']
    },
    governance: {
        icon: <AccountBalanceIcon />,
        name: 'Governance Agent',
        description: 'Manages DAO proposals and voting',
        specialty: ['Proposal Analysis', 'Vote Optimization', 'Treasury Management']
    },
    trading: {
        icon: <ShowChartIcon />,
        name: 'Trading Agent',
        description: 'Analyzes market trends and opportunities',
        specialty: ['Price Analysis', 'Market Prediction', 'Risk Management']
    },
    security: {
        icon: <SecurityIcon />,
        name: 'Security Agent',
        description: 'Monitors and protects system integrity',
        specialty: ['Threat Detection', 'Smart Contract Auditing', 'Risk Assessment']
    }
};

const AIAgentInteraction: React.FC = () => {
    const [messages, setMessages] = useState<Message[]>([]);
    const [input, setInput] = useState('');
    const [isTyping, setIsTyping] = useState(false);
    const [activeAgent, setActiveAgent] = useState<'research' | 'creative' | 'strategy' | 'governance' | 'trading' | 'security'>('research');
    const [agentConfidence, setAgentConfidence] = useState(0);
    const [isProcessing, setIsProcessing] = useState(false);
    const [specialtyFocus, setSpecialtyFocus] = useState<string[]>([]);

    useEffect(() => {
        setSpecialtyFocus(agentTypes[activeAgent].specialty);
    }, [activeAgent]);

    const handleAgentSwitch = (type: 'research' | 'creative' | 'strategy' | 'governance' | 'trading' | 'security') => {
        setActiveAgent(type);
        setMessages([]);
        setAgentConfidence(0);
    };

    const simulateAgentProcessing = async () => {
        setIsProcessing(true);
        setAgentConfidence(0);

        // Simulate progressive confidence building
        for (let i = 0; i <= 100; i += 20) {
            await new Promise(resolve => setTimeout(resolve, 500));
            setAgentConfidence(i);
        }

        setIsProcessing(false);
    };

    const handleSendMessage = async () => {
        if (!input.trim()) return;

        const userMessage: Message = {
            id: Date.now().toString(),
            text: input,
            sender: 'user',
            timestamp: new Date(),
        };

        setMessages(prev => [...prev, userMessage]);
        setInput('');
        setIsTyping(true);

        await simulateAgentProcessing();

        // Simulate AI response based on agent type
        const response = `[${agentTypes[activeAgent].name}] Analysis complete with ${agentConfidence}% confidence: ${input}`;

        const agentMessage: Message = {
            id: (Date.now() + 1).toString(),
            text: response,
            sender: 'agent',
            timestamp: new Date(),
        };

        setMessages(prev => [...prev, agentMessage]);
        setIsTyping(false);
    };

    return (
        <AgentContainer>
            <AgentSelector>
                {Object.entries(agentTypes).map(([type, data]) => (
                    <AgentChip
                        key={type}
                        icon={data.icon}
                        label={data.name}
                        active={activeAgent === type}
                        onClick={() => handleAgentSwitch(type as 'research' | 'creative' | 'strategy' | 'governance' | 'trading' | 'security')}
                    />
                ))}
            </AgentSelector>

            <Box sx={{ display: 'flex', alignItems: 'center', mb: 4 }}>
                <motion.div
                    animate={{ scale: isProcessing ? 1.1 : 1 }}
                    transition={{ duration: 0.5, repeat: isProcessing ? Infinity : 0 }}
                >
                    <AgentAvatar>
                        {agentTypes[activeAgent].icon}
                    </AgentAvatar>
                </motion.div>
                <Box sx={{ ml: 2 }}>
                    <Typography variant="h5" sx={{ color: '#00ffff' }}>
                        {agentTypes[activeAgent].name}
                    </Typography>
                    <Typography variant="body2" sx={{ color: 'rgba(255,255,255,0.7)' }}>
                        {agentTypes[activeAgent].description}
                    </Typography>
                    <Box sx={{ display: 'flex', gap: 1, mt: 1 }}>
                        {specialtyFocus.map((specialty, index) => (
                            <Chip
                                key={index}
                                label={specialty}
                                size="small"
                                sx={{
                                    background: 'rgba(0,255,255,0.1)',
                                    color: '#fff',
                                    border: '1px solid rgba(0,255,255,0.3)'
                                }}
                            />
                        ))}
                    </Box>
                </Box>
            </Box>

            <Box sx={{
                height: 400,
                overflowY: 'auto',
                mb: 3,
                position: 'relative',
                '&::-webkit-scrollbar': {
                    width: '8px',
                },
                '&::-webkit-scrollbar-track': {
                    background: 'rgba(0,0,0,0.1)',
                },
                '&::-webkit-scrollbar-thumb': {
                    background: 'rgba(0,255,255,0.3)',
                    borderRadius: '4px',
                },
            }}>
                <AnimatePresence>
                    {messages.map((message) => (
                        <motion.div
                            key={message.id}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -20 }}
                        >
                            <Box
                                sx={{
                                    display: 'flex',
                                    justifyContent: message.sender === 'user' ? 'flex-end' : 'flex-start',
                                    mb: 2,
                                }}
                            >
                                <Paper
                                    sx={{
                                        maxWidth: '70%',
                                        p: 2,
                                        background: message.sender === 'user'
                                            ? 'linear-gradient(45deg, #00ffff, #ff00ff)'
                                            : 'rgba(255,255,255,0.1)',
                                        borderRadius: 2,
                                    }}
                                >
                                    <Typography sx={{ color: message.sender === 'user' ? '#000' : '#fff' }}>
                                        {message.text}
                                    </Typography>
                                </Paper>
                            </Box>
                        </motion.div>
                    ))}
                </AnimatePresence>

                {isTyping && (
                    <Box sx={{ display: 'flex', gap: 1, p: 2 }}>
                        <CircularProgress size={20} sx={{ color: '#00ffff' }} />
                        <Typography sx={{ color: '#fff' }}>AI is thinking...</Typography>
                    </Box>
                )}
            </Box>

            <Box sx={{ display: 'flex', gap: 2 }}>
                <TextField
                    fullWidth
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    placeholder={`Ask the ${agentTypes[activeAgent].name.toLowerCase()}...`}
                    onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                    disabled={isProcessing}
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
                <Button
                    variant="contained"
                    onClick={handleSendMessage}
                    disabled={isProcessing || !input.trim()}
                    sx={{
                        background: 'linear-gradient(45deg, #00ffff, #ff00ff)',
                        color: '#fff',
                        '&:hover': {
                            background: 'linear-gradient(45deg, #ff00ff, #00ffff)',
                        }
                    }}
                >
                    {isProcessing ? 'Processing...' : 'Send'}
                </Button>
            </Box>

            {isProcessing && (
                <Box sx={{ mt: 2, textAlign: 'center' }}>
                    <CircularProgress
                        variant="determinate"
                        value={agentConfidence}
                        sx={{
                            color: '#00ffff',
                            '& .MuiCircularProgress-circle': {
                                strokeLinecap: 'round',
                            }
                        }}
                    />
                    <Typography sx={{ color: '#fff', mt: 1 }}>
                        Processing with {agentConfidence}% confidence
                    </Typography>
                </Box>
            )}
        </AgentContainer>
    );
};

export default AIAgentInteraction; 