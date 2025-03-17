import React, { useState } from 'react';
import { Box, TextField, Button, Typography, Grid } from '@mui/material';
import Layout from '@/components/common/Layout';
import ResponseFormatter from '@/components/ai/ResponseFormatter';
import { queryHuggingFace } from '@/services/ai/huggingface-service';
import LoadingIndicator from '@/components/ai/LoadingIndicator';
import { AnimatePresence } from 'framer-motion';

const agents = [
    {
        id: 'research',
        name: 'Research Agent',
        color: '#2196F3',
        description: 'Analyzes blockchain and AI topics'
    },
    {
        id: 'strategy',
        name: 'Strategy Agent',
        color: '#4CAF50',
        description: 'Provides strategic recommendations'
    },
    {
        id: 'creative',
        name: 'Creative Agent',
        color: '#FF9800',
        description: 'Generates creative solutions'
    }
];

const TestAgents = () => {
    const [query, setQuery] = useState('');
    const [loading, setLoading] = useState<string[]>([]);
    const [responses, setResponses] = useState<Record<string, any>>({});
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
                    ...response,
                    timestamp: new Date().toLocaleTimeString()
                }
            }));
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(prev => prev.filter(id => id !== agentId));
        }
    };

    const handleTestAll = () => {
        agents.forEach(agent => handleQuery(agent.id));
    };

    const handleKeyPress = (event: React.KeyboardEvent) => {
        if (event.key === 'Enter' && !event.shiftKey) {
            event.preventDefault();
            handleTestAll();
        }
    };

    return (
        <Layout>
            <Box sx={{ maxWidth: 800, mx: 'auto', p: 3 }}>
                <Typography
                    variant="h4"
                    gutterBottom
                    sx={{
                        background: 'linear-gradient(45deg, #2196F3 30%, #21CBF3 90%)',
                        WebkitBackgroundClip: 'text',
                        WebkitTextFillColor: 'transparent'
                    }}
                >
                    AI Agents Test Interface
                </Typography>

                <Box sx={{ my: 4 }}>
                    <TextField
                        fullWidth
                        label="Enter your query"
                        value={query}
                        onChange={(e) => setQuery(e.target.value)}
                        onKeyPress={handleKeyPress}
                        multiline
                        rows={2}
                        sx={{ mb: 2 }}
                        placeholder="Press Enter to test all agents"
                    />
                    <Button
                        variant="contained"
                        onClick={handleTestAll}
                        disabled={!query.trim() || loading.length > 0}
                        sx={{ mb: 2 }}
                    >
                        {loading.length > 0 ? 'Processing...' : 'Test All Agents'}
                    </Button>

                    <AnimatePresence>
                        {error && (
                            <motion.div
                                initial={{ opacity: 0, y: -10 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0 }}
                            >
                                <Typography color="error" sx={{ mt: 2 }}>
                                    {error}
                                </Typography>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </Box>

                <Grid container spacing={3}>
                    {agents.map((agent) => (
                        <Grid item xs={12} key={agent.id}>
                            <Box sx={{
                                mb: 3,
                                p: 2,
                                borderRadius: 1,
                                bgcolor: 'background.paper',
                                boxShadow: 1
                            }}>
                                <Typography variant="h6" gutterBottom>
                                    {agent.name}
                                </Typography>
                                <Typography variant="body2" color="text.secondary" gutterBottom>
                                    {agent.description}
                                </Typography>

                                <AnimatePresence>
                                    {loading.includes(agent.id) ? (
                                        <LoadingIndicator agentName={agent.name} />
                                    ) : responses[agent.id] ? (
                                        <ResponseFormatter
                                            agentId={agent.id}
                                            response={responses[agent.id]}
                                            color={agent.color}
                                        />
                                    ) : null}
                                </AnimatePresence>
                            </Box>
                        </Grid>
                    ))}
                </Grid>
            </Box>
        </Layout>
    );
};

export default TestAgents; 