import type { ReactElement } from 'react';
import React, { useState } from 'react';
import {
    Box,
    Card,
    CardContent,
    Typography,
    TextField,
    Button,
    Grid,
    CircularProgress,
    Avatar,
    Chip,
    Paper
} from '@mui/material';
import { huggingFaceService } from '../services/ai/huggingface-service';

interface AgentResponse {
    text: string;
    confidence: number;
    type: 'analysis' | 'generation' | 'recommendation';
}

const AIAgents = (): ReactElement => {
    const [userInput, setUserInput] = useState('');
    const [loading, setLoading] = useState(false);
    const [agentResponses, setAgentResponses] = useState<AgentResponse[]>([]);

    const agents = [
        {
            name: 'Research Agent',
            description: 'Analyzes and provides insights on blockchain and AI topics',
            avatar: '🔍',
            color: '#4CAF50'
        },
        {
            name: 'Creative Agent',
            description: 'Generates creative content and visual concepts',
            avatar: '🎨',
            color: '#2196F3'
        },
        {
            name: 'Strategy Agent',
            description: 'Provides strategic recommendations for Web3 projects',
            avatar: '🎯',
            color: '#9C27B0'
        }
    ];

    const handleAgentQuery = async () => {
        try {
            setLoading(true);
            const responses: AgentResponse[] = [];

            // Research Agent
            const researchResponse = await huggingFaceService.generateText(
                `Analyze this topic from a blockchain and AI perspective: ${userInput}`
            );
            responses.push({
                text: researchResponse,
                confidence: 0.89,
                type: 'analysis'
            });

            // Creative Agent
            const creativeResponse = await huggingFaceService.generateText(
                `Generate creative ideas about: ${userInput}`
            );
            responses.push({
                text: creativeResponse,
                confidence: 0.92,
                type: 'generation'
            });

            // Strategy Agent
            const strategyResponse = await huggingFaceService.generateText(
                `Provide strategic recommendations for: ${userInput}`
            );
            responses.push({
                text: strategyResponse,
                confidence: 0.85,
                type: 'recommendation'
            });

            setAgentResponses(responses);
        } catch (error) {
            console.error('Error in agent processing:', error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <Box sx={{ maxWidth: 1200, margin: 'auto', p: 3 }}>
            <Typography variant="h4" gutterBottom sx={{ textAlign: 'center', mb: 4 }}>
                DecentraMind AI Agents
            </Typography>

            <Grid container spacing={3} sx={{ mb: 4 }}>
                {agents.map((agent) => (
                    <Grid item xs={12} md={4} key={agent.name}>
                        <Card sx={{ height: '100%' }}>
                            <CardContent>
                                <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                                    <Avatar sx={{ bgcolor: agent.color, mr: 2 }}>
                                        {agent.avatar}
                                    </Avatar>
                                    <Typography variant="h6">{agent.name}</Typography>
                                </Box>
                                <Typography variant="body2" color="text.secondary">
                                    {agent.description}
                                </Typography>
                            </CardContent>
                        </Card>
                    </Grid>
                ))}
            </Grid>

            <Paper sx={{ p: 3, mb: 4 }}>
                <TextField
                    fullWidth
                    multiline
                    rows={3}
                    value={userInput}
                    onChange={(e) => setUserInput(e.target.value)}
                    label="Enter your query for the AI agents"
                    variant="outlined"
                    sx={{ mb: 2 }}
                />
                <Button
                    variant="contained"
                    onClick={handleAgentQuery}
                    disabled={loading || !userInput}
                    fullWidth
                >
                    {loading ? <CircularProgress size={24} /> : 'Consult AI Agents'}
                </Button>
            </Paper>

            {agentResponses.length > 0 && (
                <Box>
                    <Typography variant="h6" gutterBottom>
                        Agent Responses
                    </Typography>
                    <Grid container spacing={2}>
                        {agentResponses.map((response, index) => (
                            <Grid item xs={12} key={index}>
                                <Card>
                                    <CardContent>
                                        <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
                                            <Typography variant="subtitle1" color="primary">
                                                {agents[index].name}
                                            </Typography>
                                            <Chip
                                                label={`Confidence: ${(response.confidence * 100).toFixed(1)}%`}
                                                color="primary"
                                                size="small"
                                            />
                                        </Box>
                                        <Typography variant="body1">
                                            {response.text}
                                        </Typography>
                                    </CardContent>
                                </Card>
                            </Grid>
                        ))}
                    </Grid>
                </Box>
            )}
        </Box>
    );
};

export default AIAgents; 