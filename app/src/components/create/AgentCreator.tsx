import React, { useState } from 'react';
import {
    Box,
    Card,
    TextField,
    Button,
    Typography,
    Grid,
    CircularProgress,
    Chip
} from '@mui/material';
import { OpenAIService } from '../../services/ai/openai-service';

const AgentCreator = () => {
    const [prompt, setPrompt] = useState('');
    const [generating, setGenerating] = useState(false);
    const [generatedContent, setGeneratedContent] = useState('');
    const openAIService = new OpenAIService();

    const handleGenerate = async () => {
        if (!prompt.trim()) return;

        setGenerating(true);
        try {
            const response = await openAIService.getAgentResponse('creative', prompt);
            setGeneratedContent(response.content);
        } catch (error) {
            console.error('Generation error:', error);
        } finally {
            setGenerating(false);
        }
    };

    return (
        <Card sx={{ p: 4 }}>
            <Typography variant="h4" gutterBottom>
                Agent Creator
            </Typography>

            <Grid container spacing={3}>
                <Grid item xs={12}>
                    <TextField
                        fullWidth
                        multiline
                        rows={4}
                        label="Describe your AI agent"
                        value={prompt}
                        onChange={(e) => setPrompt(e.target.value)}
                        placeholder="Describe the capabilities and personality of your AI agent..."
                    />
                </Grid>

                <Grid item xs={12}>
                    <Button
                        variant="contained"
                        onClick={handleGenerate}
                        disabled={generating || !prompt.trim()}
                    >
                        {generating ? <CircularProgress size={24} /> : 'Generate Agent'}
                    </Button>
                </Grid>

                {generatedContent && (
                    <Grid item xs={12}>
                        <Box sx={{ mt: 2 }}>
                            <Typography variant="h6">Generated Agent Profile</Typography>
                            <Typography variant="body1">{generatedContent}</Typography>
                        </Box>
                    </Grid>
                )}
            </Grid>
        </Card>
    );
};

export default AgentCreator; 