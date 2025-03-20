import React, { useState, useEffect } from 'react';
import { Box, Typography, Container, TextField, Button } from '@mui/material';
import { styled, keyframes } from '@mui/material/styles';

const floatAnimation = keyframes`
  0% { transform: translateY(0px) rotate(0deg); }
  50% { transform: translateY(-20px) rotate(2deg); }
  100% { transform: translateY(0px) rotate(0deg); }
`;

const glowAnimation = keyframes`
  0% { box-shadow: 0 0 20px rgba(0, 255, 255, 0.5); }
  50% { box-shadow: 0 0 40px rgba(255, 0, 255, 0.5); }
  100% { box-shadow: 0 0 20px rgba(0, 255, 255, 0.5); }
`;

const HeroContainer = styled(Box)(({ theme }) => ({
    minHeight: '100vh',
    background: 'linear-gradient(45deg, #0a0a1f 0%, #1a1a3f 100%)',
    position: 'relative',
    overflow: 'hidden',
    '&::before': {
        content: '""',
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        background: 'radial-gradient(circle at 50% 50%, rgba(0,255,255,0.1) 0%, transparent 50%)',
        animation: `${glowAnimation} 4s infinite`,
    }
}));

const AIAvatar = styled(Box)(({ theme }) => ({
    width: '400px',
    height: '400px',
    background: 'linear-gradient(45deg, rgba(0,255,255,0.1), rgba(255,0,255,0.1))',
    borderRadius: '50%',
    position: 'relative',
    animation: `${floatAnimation} 6s infinite ease-in-out`,
    '&::before': {
        content: '""',
        position: 'absolute',
        top: '5%',
        left: '5%',
        right: '5%',
        bottom: '5%',
        border: '2px solid rgba(0,255,255,0.3)',
        borderRadius: '50%',
        animation: `${glowAnimation} 3s infinite`,
    }
}));

const ChatContainer = styled(Box)(({ theme }) => ({
    background: 'rgba(0,0,0,0.5)',
    backdropFilter: 'blur(10px)',
    borderRadius: '15px',
    padding: theme.spacing(3),
    border: '1px solid rgba(0,255,255,0.2)',
    maxWidth: '400px',
    margin: '0 auto',
}));

const HeroSection: React.FC = () => {
    const [tagline, setTagline] = useState('AI-Powered Web3 Solutions ⚡');
    const [chatInput, setChatInput] = useState('');
    const [chatResponse, setChatResponse] = useState('');

    useEffect(() => {
        const taglines = [
            'AI-Powered Web3 Solutions ⚡',
            'Decentralized AI Agents 🤖',
            'Evolution of Intelligence 🧠',
            'Future of Web3 + AI 🚀'
        ];
        let currentIndex = 0;

        const interval = setInterval(() => {
            currentIndex = (currentIndex + 1) % taglines.length;
            setTagline(taglines[currentIndex]);
        }, 3000);

        return () => clearInterval(interval);
    }, []);

    const handleChatSubmit = async () => {
        // Implement chat functionality
        setChatResponse('Processing your request...');
        // Add actual AI response logic here
    };

    return (
        <HeroContainer>
            <Container maxWidth="lg">
                <Box
                    sx={{
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        justifyContent: 'center',
                        minHeight: '100vh',
                        textAlign: 'center',
                        gap: 4,
                    }}
                >
                    <Typography
                        variant="h1"
                        sx={{
                            fontSize: { xs: '2.5rem', md: '4rem' },
                            fontWeight: 'bold',
                            background: 'linear-gradient(45deg, #00ffff, #ff00ff)',
                            backgroundClip: 'text',
                            textFillColor: 'transparent',
                            WebkitBackgroundClip: 'text',
                            WebkitTextFillColor: 'transparent',
                        }}
                    >
                        DecentraMind
                    </Typography>

                    <Typography
                        variant="h2"
                        sx={{
                            fontSize: { xs: '1.5rem', md: '2.5rem' },
                            color: '#fff',
                            opacity: 0.9,
                            transition: 'all 0.5s ease-in-out',
                        }}
                    >
                        {tagline}
                    </Typography>

                    <AIAvatar />

                    <ChatContainer>
                        <Typography variant="h6" sx={{ color: '#00ffff', mb: 2 }}>
                            Talk to Our AI
                        </Typography>
                        <TextField
                            fullWidth
                            variant="outlined"
                            value={chatInput}
                            onChange={(e) => setChatInput(e.target.value)}
                            placeholder="Ask me anything about DecentraMind..."
                            sx={{
                                mb: 2,
                                '& .MuiOutlinedInput-root': {
                                    color: '#fff',
                                    '& fieldset': {
                                        borderColor: 'rgba(0,255,255,0.3)',
                                    },
                                    '&:hover fieldset': {
                                        borderColor: 'rgba(0,255,255,0.5)',
                                    },
                                    '&.Mui-focused fieldset': {
                                        borderColor: '#00ffff',
                                    },
                                },
                            }}
                        />
                        <Button
                            fullWidth
                            variant="contained"
                            onClick={handleChatSubmit}
                            sx={{
                                background: 'linear-gradient(45deg, #00ffff 30%, #ff00ff 90%)',
                                color: '#fff',
                                '&:hover': {
                                    background: 'linear-gradient(45deg, #00ffff 60%, #ff00ff 90%)',
                                },
                            }}
                        >
                            Send Message
                        </Button>
                        {chatResponse && (
                            <Typography sx={{ color: '#fff', mt: 2 }}>
                                {chatResponse}
                            </Typography>
                        )}
                    </ChatContainer>
                </Box>
            </Container>
        </HeroContainer>
    );
};

export default HeroSection; 