import React, { useState } from 'react';
import { Box, Button, TextField, Typography, CircularProgress, Paper, Tab, Tabs } from '@mui/material';
import { huggingFaceService } from '../services/ai/huggingface-service';

interface TabPanelProps {
    children?: React.ReactNode;
    index: number;
    value: number;
}

function TabPanel(props: TabPanelProps) {
    const { children, value, index, ...other } = props;
    return (
        <div role="tabpanel" hidden={value !== index} {...other}>
            {value === index && <Box sx={{ p: 3 }}>{children}</Box>}
        </div>
    );
}

export const AITestUI = () => {
    const [tabValue, setTabValue] = useState(0);
    const [textPrompt, setTextPrompt] = useState('');
    const [imagePrompt, setImagePrompt] = useState('');
    const [imageUrl, setImageUrl] = useState('');
    const [result, setResult] = useState<string>('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string>('');

    const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
        setTabValue(newValue);
        setResult('');
        setError('');
    };

    const handleTextGeneration = async () => {
        try {
            setLoading(true);
            setError('');
            const text = await huggingFaceService.generateText(textPrompt);
            setResult(text);
        } catch (err) {
            setError(err instanceof Error ? err.message : 'An error occurred');
        } finally {
            setLoading(false);
        }
    };

    const handleImageGeneration = async () => {
        try {
            setLoading(true);
            setError('');
            const imageData = await huggingFaceService.generateImage(imagePrompt);
            setResult(imageData);
        } catch (err) {
            setError(err instanceof Error ? err.message : 'An error occurred');
        } finally {
            setLoading(false);
        }
    };

    const handleImageAnalysis = async () => {
        try {
            setLoading(true);
            setError('');
            const analysis = await huggingFaceService.analyzeImage(imageUrl);
            setResult(analysis);
        } catch (err) {
            setError(err instanceof Error ? err.message : 'An error occurred');
        } finally {
            setLoading(false);
        }
    };

    return (
        <Box sx={{ width: '100%', maxWidth: 800, mx: 'auto', p: 3 }}>
            <Typography variant="h4" gutterBottom>
                AI Features Test
            </Typography>

            <Paper sx={{ width: '100%', mb: 2 }}>
                <Tabs value={tabValue} onChange={handleTabChange} centered>
                    <Tab label="Text Generation" />
                    <Tab label="Image Generation" />
                    <Tab label="Image Analysis" />
                </Tabs>
            </Paper>

            <TabPanel value={tabValue} index={0}>
                <TextField
                    fullWidth
                    multiline
                    rows={3}
                    value={textPrompt}
                    onChange={(e) => setTextPrompt(e.target.value)}
                    label="Enter text prompt"
                    variant="outlined"
                    margin="normal"
                />
                <Button
                    variant="contained"
                    onClick={handleTextGeneration}
                    disabled={loading || !textPrompt}
                    sx={{ mt: 2 }}
                >
                    {loading ? <CircularProgress size={24} /> : 'Generate Text'}
                </Button>
            </TabPanel>

            <TabPanel value={tabValue} index={1}>
                <TextField
                    fullWidth
                    multiline
                    rows={3}
                    value={imagePrompt}
                    onChange={(e) => setImagePrompt(e.target.value)}
                    label="Enter image prompt"
                    variant="outlined"
                    margin="normal"
                />
                <Button
                    variant="contained"
                    onClick={handleImageGeneration}
                    disabled={loading || !imagePrompt}
                    sx={{ mt: 2 }}
                >
                    {loading ? <CircularProgress size={24} /> : 'Generate Image'}
                </Button>
            </TabPanel>

            <TabPanel value={tabValue} index={2}>
                <TextField
                    fullWidth
                    value={imageUrl}
                    onChange={(e) => setImageUrl(e.target.value)}
                    label="Enter image URL"
                    variant="outlined"
                    margin="normal"
                />
                <Button
                    variant="contained"
                    onClick={handleImageAnalysis}
                    disabled={loading || !imageUrl}
                    sx={{ mt: 2 }}
                >
                    {loading ? <CircularProgress size={24} /> : 'Analyze Image'}
                </Button>
            </TabPanel>

            {error && (
                <Paper sx={{ mt: 2, p: 2, bgcolor: 'error.light' }}>
                    <Typography color="error">{error}</Typography>
                </Paper>
            )}

            {result && (
                <Paper sx={{ mt: 2, p: 2 }}>
                    <Typography variant="h6">Result:</Typography>
                    {tabValue === 1 && result.startsWith('data:image') ? (
                        <img src={result} alt="Generated" style={{ maxWidth: '100%', marginTop: '1rem' }} />
                    ) : (
                        <Typography sx={{ whiteSpace: 'pre-wrap' }}>{result}</Typography>
                    )}
                </Paper>
            )}
        </Box>
    );
}; 