import React, { useState } from 'react';
import { Container, Box, Typography, TextField, Button, Grid, Card, CardContent, CircularProgress, Chip } from '@mui/material';
import { huggingFaceService } from '../services/ai/huggingface-service';

interface AgentResponse {
    text: string;
    confidence: number;
}

const AIAgents = () => {
    const [query, setQuery] = useState('');
    const [loading, setLoading] = useState(false);
    const [responses, setResponses] = useState<Record<string, AgentResponse>>({
        research: { text: '', confidence: 0 },
        creative: { text: '', confidence: 0 },
        strategy: { text: '', confidence: 0 }
    });

    const handleSubmit = async () => {
        setLoading(true);
        try {
            const researchPrompt = `Analyze this blockchain/AI query: ${query}`;
            const creativePrompt = `Generate creative solutions for: ${query}`;
            const strategyPrompt = `Provide strategic recommendations for: ${query}`;

            const [researchRes, creativeRes, strategyRes] = await Promise.all([
                huggingFaceService.generateText(researchPrompt),
                huggingFaceService.generateText(creativePrompt),
                huggingFaceService.generateText(strategyPrompt)
            ]);

            setResponses({
                research: { text: researchRes, confidence: 0.85 },
                creative: { text: creativeRes, confidence: 0.78 },
                strategy: { text: strategyRes, confidence: 0.92 }
            });
        } catch (error) {
            console.error('Error:', error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <Container maxWidth="lg">
            <Box sx={{ my: 4 }}>
                <Typography variant="h3" component="h1" gutterBottom>
                    AI Agents Interface
                </Typography>
                <Typography variant="h6" color="textSecondary" gutterBottom>
                    Interact with specialized AI agents for blockchain and AI solutions
                </Typography>

                <Box sx={{ my: 4 }}>
                    <TextField
                        fullWidth
                        multiline
                        rows={3}
                        variant="outlined"
                        label="Enter your query"
                        value={query}
                        onChange={(e) => setQuery(e.target.value)}
                        sx={{ mb: 2 }}
                    />
                    <Button
                        variant="contained"
                        color="primary"
                        onClick={handleSubmit}
                        disabled={loading || !query.trim()}
                        size="large"
                    >
                        {loading ? <CircularProgress size={24} /> : 'Submit Query'}
                    </Button>
                </Box>

                <Grid container spacing={3}>
                    {Object.entries(responses).map(([agent, response]) => (
                        <Grid item xs={12} md={4} key={agent}>
                            <Card>
                                <CardContent>
                                    <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                                        <Typography variant="h5" component="h2">
                                            {agent.charAt(0).toUpperCase() + agent.slice(1)} Agent
                                        </Typography>
                                        <Chip
                                            label={`${(response.confidence * 100).toFixed(0)}%`}
                                            color={response.confidence > 0.8 ? "success" : "warning"}
                                            size="small"
                                            sx={{ ml: 2 }}
                                        />
                                    </Box>
                                    <Box sx={{
                                        bgcolor: 'background.paper',
                                        p: 2,
                                        borderRadius: 1,
                                        minHeight: 150
                                    }}>
                                        <Typography>
                                            {response.text || 'Waiting for query...'}
                                        </Typography>
                                    </Box>
                                </CardContent>
                            </Card>
                        </Grid>
                    ))}
                </Grid>
            </Box>
        </Container>
    );
};

export default AIAgents; 