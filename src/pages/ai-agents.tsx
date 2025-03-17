import React, { useState } from 'react';
import Layout from '@/components/common/Layout';
import {
    Grid,
    Typography,
    Box,
    Card,
    TextField,
    Button,
    CircularProgress
} from '@mui/material';
import { motion } from 'framer-motion';
import { Psychology, Analytics, Create } from '@mui/icons-material';
import ChatHistory from '@/components/ai/ChatHistory';
import { queryHuggingFace } from '@/services/ai/huggingface-service';

const MotionCard = motion(Card);

interface Agent {
    id: string;
    name: string;
    description: string;
    icon: React.ReactNode;
    color: string;
}

interface AgentResponse {
    text: string;
    confidence: number;
    timestamp: string;
}

interface Responses {
    [key: string]: AgentResponse;
}

interface ChatHistoryItem {
    query: string;
    response: AgentResponse;
}

const agents: Agent[] = [
    {
        id: 'research',
        name: 'Research Agent',
        description: 'Analyzes blockchain and AI trends',
        icon: <Psychology sx={{ fontSize: 40 }} />,
        color: '#2196F3'
    },
    {
        id: 'strategy',
        name: 'Strategy Agent',
        description: 'Provides strategic recommendations',
        icon: <Analytics sx={{ fontSize: 40 }} />,
        color: '#4CAF50'
    },
    {
        id: 'creative',
        name: 'Creative Agent',
        description: 'Generates creative solutions',
        icon: <Create sx={{ fontSize: 40 }} />,
        color: '#FF9800'
    }
];

const AIAgentsShowcase = () => {
    const [query, setQuery] = useState('');
    const [loading, setLoading] = useState<string[]>([]);
    const [responses, setResponses] = useState<Responses>({});
    const [chatHistory, setChatHistory] = useState<Record<string, ChatHistoryItem[]>>({});
    const [error, setError] = useState<string>('');

    const handleQuery = async (agentId: string) => {
        if (!query.trim()) return;

        setLoading(prev => [...prev, agentId]);
        setError('');

        try {
            const response = await queryHuggingFace(agentId, query);

            setResponses(prev => ({
                ...prev,
                [agentId]: {
                    text: response.text,
                    confidence: response.confidence,
                    timestamp: new Date().toLocaleTimeString()
                }
            }));

            setChatHistory(prev => ({
                ...prev,
                [agentId]: [
                    {
                        query,
                        response: {
                            text: response.text,
                            confidence: response.confidence,
                            timestamp: new Date().toLocaleTimeString()
                        }
                    },
                    ...(prev[agentId] || [])
                ].slice(0, 5)
            }));

        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(prev => prev.filter(id => id !== agentId));
        }
    };

    const handleKeyPress = (event: React.KeyboardEvent) => {
        if (event.key === 'Enter') {
            agents.forEach(agent => handleQuery(agent.id));
        }
    };

    return (
        <Layout>
            <Typography
                variant="h3"
                component="h1"
                gutterBottom
                sx={{
                    textAlign: 'center',
                    mb: 6,
                    background: 'linear-gradient(45deg, #2196F3 30%, #21CBF3 90%)',
                    WebkitBackgroundClip: 'text',
                    WebkitTextFillColor: 'transparent'
                }}
            >
                AI Agents Lab
            </Typography>

            {error && (
                <Box sx={{
                    mb: 4,
                    p: 2,
                    bgcolor: 'error.main',
                    color: 'error.contrastText',
                    borderRadius: 1
                }}>
                    <Typography>{error}</Typography>
                </Box>
            )}

            <Box sx={{ mb: 4 }}>
                <TextField
                    fullWidth
                    label="Ask your question"
                    variant="outlined"
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    onKeyPress={handleKeyPress}
                    placeholder="Press Enter to ask all agents at once"
                    sx={{ mb: 2 }}
                />
                <Button
                    variant="contained"
                    fullWidth
                    onClick={() => agents.forEach(agent => handleQuery(agent.id))}
                    disabled={!query.trim() || loading.length > 0}
                >
                    Ask All Agents
                </Button>
            </Box>

            <Grid container spacing={4}>
                {agents.map((agent) => (
                    <Grid item xs={12} md={4} key={agent.id}>
                        <MotionCard
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.5 }}
                            whileHover={{ scale: 1.02 }}
                            sx={{ height: '100%', p: 3 }}
                        >
                            <Box sx={{ textAlign: 'center', mb: 2 }}>
                                <Box sx={{ color: agent.color, mb: 1 }}>
                                    {agent.icon}
                                </Box>
                                <Typography variant="h5" gutterBottom>
                                    {agent.name}
                                </Typography>
                                <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
                                    {agent.description}
                                </Typography>
                                <Button
                                    variant="contained"
                                    onClick={() => handleQuery(agent.id)}
                                    disabled={!query.trim() || loading.includes(agent.id)}
                                    sx={{
                                        bgcolor: agent.color,
                                        '&:hover': { bgcolor: agent.color }
                                    }}
                                >
                                    {loading.includes(agent.id) ? (
                                        <CircularProgress size={24} color="inherit" />
                                    ) : (
                                        'Ask Agent'
                                    )}
                                </Button>
                            </Box>

                            {responses[agent.id] && (
                                <>
                                    <MotionCard
                                        initial={{ opacity: 0, y: 10 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        sx={{
                                            mt: 2,
                                            p: 2,
                                            bgcolor: 'background.default',
                                            borderRadius: 1
                                        }}
                                    >
                                        <Typography variant="caption" color="text.secondary">
                                            {responses[agent.id].timestamp}
                                        </Typography>
                                        <Typography variant="body2" sx={{ mt: 1 }}>
                                            {responses[agent.id].text}
                                        </Typography>
                                        <Box sx={{ mt: 2, display: 'flex', alignItems: 'center' }}>
                                            <Typography variant="caption" color="text.secondary">
                                                Confidence:
                                            </Typography>
                                            <Box sx={{ flex: 1, mx: 1 }}>
                                                <motion.div
                                                    initial={{ width: 0 }}
                                                    animate={{ width: `${responses[agent.id].confidence}%` }}
                                                    style={{
                                                        height: 4,
                                                        backgroundColor: agent.color,
                                                        borderRadius: 2
                                                    }}
                                                />
                                            </Box>
                                            <Typography variant="caption" color="text.secondary">
                                                {Math.round(responses[agent.id].confidence)}%
                                            </Typography>
                                        </Box>
                                    </MotionCard>

                                    <ChatHistory
                                        agentId={agent.id}
                                        history={chatHistory[agent.id] || []}
                                        color={agent.color}
                                    />
                                </>
                            )}
                        </MotionCard>
                    </Grid>
                ))}
            </Grid>
        </Layout>
    );
};

export default AIAgentsShowcase; 