import React, { useState, ChangeEvent } from 'react';
import { aiService } from '../services/ai/ai-service';
import { Box, Button, TextField, Typography, Card, CardContent, CircularProgress, Tabs, Tab, Paper } from '@mui/material';

interface TabPanelProps {
    children?: React.ReactNode;
    index: number;
    value: number;
}

function TabPanel(props: TabPanelProps) {
    const { children, value, index, ...other } = props;
    return (
        <div
            role="tabpanel"
            hidden={value !== index}
            {...other}
        >
            {value === index && (
                <Box sx={{ p: 3 }}>
                    {children}
                </Box>
            )}
        </div>
    );
}

export const AITest = () => {
    const [tabValue, setTabValue] = useState(0);
    const [textPrompt, setTextPrompt] = useState('');
    const [imagePrompt, setImagePrompt] = useState('');
    const [imageUrl, setImageUrl] = useState('');
    const [textResult, setTextResult] = useState('');
    const [imageResult, setImageResult] = useState('');
    const [analysisResult, setAnalysisResult] = useState('');
    const [loading, setLoading] = useState(false);

    const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
        setTabValue(newValue);
    };

    const handleTextGeneration = async () => {
        try {
            setLoading(true);
            const response = await aiService.generateText(textPrompt);
            setTextResult(response);
        } catch (error) {
            console.error('Error:', error);
            setTextResult('Error occurred during text generation');
        } finally {
            setLoading(false);
        }
    };

    const handleImageGeneration = async () => {
        try {
            setLoading(true);
            const response = await aiService.generateImage(imagePrompt);
            setImageResult(response);
        } catch (error) {
            console.error('Error:', error);
            setImageResult('Error occurred during image generation');
        } finally {
            setLoading(false);
        }
    };

    const handleImageAnalysis = async () => {
        try {
            setLoading(true);
            const response = await aiService.analyzeImage(imageUrl);
            setAnalysisResult(response);
        } catch (error) {
            console.error('Error:', error);
            setAnalysisResult('Error occurred during image analysis');
        } finally {
            setLoading(false);
        }
    };

    return (
        <Box sx={{ width: '100%', maxWidth: 800, margin: 'auto', p: 3 }}>
            <Typography variant="h4" gutterBottom>
                DecentraMind AI Testing Hub
            </Typography>

            <Paper sx={{ width: '100%', mb: 2 }}>
                <Tabs value={tabValue} onChange={handleTabChange} centered>
                    <Tab label="Text Generation" />
                    <Tab label="Image Generation" />
                    <Tab label="Image Analysis" />
                </Tabs>
            </Paper>

            <TabPanel value={tabValue} index={0}>
                <Card>
                    <CardContent>
                        <Typography variant="h6" gutterBottom>
                            Text Generation
                        </Typography>
                        <TextField
                            fullWidth
                            multiline
                            rows={3}
                            value={textPrompt}
                            onChange={(e: ChangeEvent<HTMLInputElement>) => setTextPrompt(e.target.value)}
                            placeholder="Enter your prompt for text generation"
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
                        {textResult && (
                            <Box sx={{ mt: 2 }}>
                                <Typography variant="h6">Result:</Typography>
                                <Paper sx={{ p: 2, bgcolor: 'grey.100' }}>
                                    <Typography>{textResult}</Typography>
                                </Paper>
                            </Box>
                        )}
                    </CardContent>
                </Card>
            </TabPanel>

            <TabPanel value={tabValue} index={1}>
                <Card>
                    <CardContent>
                        <Typography variant="h6" gutterBottom>
                            Image Generation
                        </Typography>
                        <TextField
                            fullWidth
                            multiline
                            rows={3}
                            value={imagePrompt}
                            onChange={(e: ChangeEvent<HTMLInputElement>) => setImagePrompt(e.target.value)}
                            placeholder="Describe the image you want to generate"
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
                        {imageResult && (
                            <Box sx={{ mt: 2 }}>
                                <Typography variant="h6">Generated Image:</Typography>
                                <img src={imageResult} alt="Generated" style={{ maxWidth: '100%', marginTop: '1rem' }} />
                            </Box>
                        )}
                    </CardContent>
                </Card>
            </TabPanel>

            <TabPanel value={tabValue} index={2}>
                <Card>
                    <CardContent>
                        <Typography variant="h6" gutterBottom>
                            Image Analysis
                        </Typography>
                        <TextField
                            fullWidth
                            value={imageUrl}
                            onChange={(e: ChangeEvent<HTMLInputElement>) => setImageUrl(e.target.value)}
                            placeholder="Enter image URL for analysis"
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
                        {imageUrl && (
                            <Box sx={{ mt: 2 }}>
                                <img src={imageUrl} alt="To analyze" style={{ maxWidth: '100%', marginTop: '1rem' }} />
                            </Box>
                        )}
                        {analysisResult && (
                            <Box sx={{ mt: 2 }}>
                                <Typography variant="h6">Analysis Result:</Typography>
                                <Paper sx={{ p: 2, bgcolor: 'grey.100' }}>
                                    <Typography>{analysisResult}</Typography>
                                </Paper>
                            </Box>
                        )}
                    </CardContent>
                </Card>
            </TabPanel>
        </Box>
    );
}; 