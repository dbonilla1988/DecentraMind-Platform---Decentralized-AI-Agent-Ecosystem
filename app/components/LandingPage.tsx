"use client";

import React, { useState } from 'react';
import {
  Box,
  Typography,
  Button,
  Card,
  CardContent,
  Grid,
  Avatar,
  Chip,
  LinearProgress,
  Container,
  Paper,
  Fade,
  Grow,
} from '@mui/material';
import {
  Psychology as BrainIcon,
  AutoAwesome as AutoAwesomeIcon,
  TrendingUp as TrendingUpIcon,
  Star as StarIcon,
  Rocket as RocketIcon,
  Psychology as PsychologyIcon,
  School as SchoolIcon,
  Business as BusinessIcon,
  Science as ScienceIcon,
  Favorite as HealthIcon,
  Brush as CreativeIcon,
} from '@mui/icons-material';
import { useWallet } from '@solana/wallet-adapter-react';
import { useToast } from './ToastNotifications';
import TestMinting from './TestMinting';

const LandingPage: React.FC = () => {
  const { connected, publicKey, connect, disconnect } = useWallet();
  const { showSuccess, showError, showInfo } = useToast();
  const [showMintFlow, setShowMintFlow] = useState(false);

  const features = [
    {
      icon: <BrainIcon sx={{ fontSize: 40, color: '#00ffff' }} />,
      title: 'AI Agent Minting',
      description: 'Create your unique AI agent with specialized skills and personality',
      color: '#00ffff'
    },
    {
      icon: <TrendingUpIcon sx={{ fontSize: 40, color: '#2ed573' }} />,
      title: 'Agent Evolution',
      description: 'Watch your agent grow and evolve through learning and experience',
      color: '#2ed573'
    },
    {
      icon: <StarIcon sx={{ fontSize: 40, color: '#fdcb6e' }} />,
      title: 'Staking Rewards',
      description: 'Earn rewards by staking tokens and participating in governance',
      color: '#fdcb6e'
    },
    {
      icon: <AutoAwesomeIcon sx={{ fontSize: 40, color: '#ff3860' }} />,
      title: 'DAO Governance',
      description: 'Participate in community decisions and shape the future',
      color: '#ff3860'
    }
  ];

  const agentDomains = [
    { name: 'Learning', icon: <SchoolIcon />, color: '#00ffff' },
    { name: 'Health', icon: <HealthIcon />, color: '#2ed573' },
    { name: 'Creative', icon: <CreativeIcon />, color: '#fdcb6e' },
    { name: 'Business', icon: <BusinessIcon />, color: '#ff3860' },
    { name: 'Technical', icon: <PsychologyIcon />, color: '#9b59b6' },
    { name: 'Science', icon: <ScienceIcon />, color: '#e74c3c' },
  ];

  const handleConnectWallet = () => {
    if (!connected) {
      // Actually trigger wallet connection
      if (typeof window !== 'undefined' && window.solana) {
        window.solana.connect();
      } else {
        showInfo('Please install Phantom or Solflare wallet extension');
      }
    } else {
      showSuccess('Wallet connected! Ready to mint your agent');
    }
  };

  const handleStartMinting = () => {
    if (!connected) {
      showError('Please connect your wallet first');
      return;
    }
    setShowMintFlow(true);
  };

  const handleUnlockDashboard = () => {
    if (!connected) {
      showError('Please connect your wallet first');
      return;
    }
    // Navigate to dashboard
    window.location.href = '/?forceDashboard=true';
  };

  if (showMintFlow) {
    return (
      <Container maxWidth="xl" sx={{ py: 4 }}>
        <Box sx={{ mb: 4 }}>
          <Button 
            onClick={() => setShowMintFlow(false)}
            sx={{ color: '#00ffff', mb: 2 }}
          >
            ← Back to Landing
          </Button>
          <Typography variant="h3" sx={{ color: '#00ffff', fontWeight: 'bold', mb: 2 }}>
            🚀 Mint Your AI Agent
          </Typography>
          <Typography variant="body1" sx={{ color: 'text.secondary', mb: 4 }}>
            Create your unique AI agent and unlock the full DecentraMind experience
          </Typography>
        </Box>
        <TestMinting />
      </Container>
    );
  }

  return (
    <Box sx={{ 
      minHeight: '100vh', 
      background: 'linear-gradient(135deg, #0a0a0a 0%, #1a1a2e 50%, #16213e 100%)',
      color: 'white'
    }}>
      <Container maxWidth="xl" sx={{ py: 8 }}>
        {/* Hero Section */}
        <Fade in timeout={1000}>
          <Box sx={{ textAlign: 'center', mb: 8 }}>
            <Avatar sx={{ 
              width: 120, 
              height: 120, 
              bgcolor: '#00ffff', 
              mx: 'auto', 
              mb: 3,
              boxShadow: '0 0 30px #00ffff'
            }}>
              <BrainIcon sx={{ fontSize: 60, color: 'black' }} />
            </Avatar>
            
            <Typography variant="h2" sx={{ 
              color: '#00ffff', 
              fontWeight: 'bold', 
              mb: 2,
              textShadow: '0 0 20px #00ffff'
            }}>
              Welcome to DecentraMind
            </Typography>
            
            <Typography variant="h5" sx={{ 
              color: 'text.secondary', 
              mb: 4,
              maxWidth: 600,
              mx: 'auto'
            }}>
              The future of AI is decentralized. Mint your personal AI agent and join the revolution.
            </Typography>

            <Box sx={{ mb: 6 }}>
              {!connected ? (
                <Box>
                  <Button
                    variant="contained"
                    size="large"
                    onClick={handleConnectWallet}
                    sx={{
                      background: 'linear-gradient(45deg, #00ffff 30%, #00bcd4 90%)',
                      color: 'black',
                      fontWeight: 'bold',
                      px: 4,
                      py: 2,
                      fontSize: '1.2rem',
                      mb: 2,
                      '&:hover': {
                        background: 'linear-gradient(45deg, #00bcd4 30%, #00ffff 90%)',
                      }
                    }}
                  >
                    🔗 Connect Wallet to Begin
                  </Button>
                  <Typography variant="body2" sx={{ color: 'text.secondary', mt: 1 }}>
                    Click the wallet button in the top-right corner to connect
                  </Typography>
                </Box>
              ) : (
                <Box>
                  <Button
                    variant="contained"
                    size="large"
                    onClick={handleStartMinting}
                    sx={{
                      background: 'linear-gradient(45deg, #2ed573 30%, #00b894 90%)',
                      color: 'white',
                      fontWeight: 'bold',
                      px: 4,
                      py: 2,
                      fontSize: '1.2rem',
                      mb: 2,
                      '&:hover': {
                        background: 'linear-gradient(45deg, #00b894 30%, #2ed573 90%)',
                      }
                    }}
                  >
                    🚀 Mint Your AI Agent
                  </Button>
                  <Typography variant="body2" sx={{ color: '#2ed573', mt: 1 }}>
                    ✅ Wallet connected: {publicKey?.toBase58().slice(0, 8)}...
                  </Typography>
                  
                  {/* Manual Dashboard Access for Testing */}
                  <Button
                    variant="outlined"
                    size="small"
                    onClick={handleUnlockDashboard}
                    sx={{
                      borderColor: '#ffc107',
                      color: '#ffc107',
                      mt: 2,
                      '&:hover': {
                        borderColor: '#ff9800',
                        color: '#ff9800',
                      }
                    }}
                  >
                    🔧 Force Dashboard Access (Testing)
                  </Button>
                  
                  {/* Manual Landing Page Access for Testing */}
                  <Button
                    variant="outlined"
                    size="small"
                    onClick={() => window.location.href = '/?forceLanding=true'}
                    sx={{
                      borderColor: '#e91e63',
                      color: '#e91e63',
                      mt: 1,
                      '&:hover': {
                        borderColor: '#c2185b',
                        color: '#c2185b',
                      }
                    }}
                  >
                    🏠 Force Landing Page (Testing)
                  </Button>
                </Box>
              )}
            </Box>
          </Box>
        </Fade>

        {/* Features Grid */}
        <Grow in timeout={1500}>
          <Box sx={{ mb: 8 }}>
            <Typography variant="h4" sx={{ 
              color: 'white', 
              textAlign: 'center', 
              mb: 4,
              fontWeight: 'bold'
            }}>
              What You'll Unlock
            </Typography>
            
            <Grid container spacing={4}>
              {features.map((feature, index) => (
                <Grid item xs={12} md={6} lg={3} key={index}>
                  <Card sx={{ 
                    background: 'rgba(25, 25, 25, 0.9)', 
                    border: `2px solid ${feature.color}`,
                    borderRadius: 3,
                    height: '100%',
                    transition: 'transform 0.3s ease',
                    '&:hover': {
                      transform: 'translateY(-5px)',
                      boxShadow: `0 10px 30px ${feature.color}40`
                    }
                  }}>
                    <CardContent sx={{ textAlign: 'center', py: 3 }}>
                      <Box sx={{ mb: 2 }}>
                        {feature.icon}
                      </Box>
                      <Typography variant="h6" sx={{ 
                        color: 'white', 
                        fontWeight: 'bold',
                        mb: 1
                      }}>
                        {feature.title}
                      </Typography>
                      <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                        {feature.description}
                      </Typography>
                    </CardContent>
                  </Card>
                </Grid>
              ))}
            </Grid>
          </Box>
        </Grow>

        {/* Agent Domains */}
        <Grow in timeout={2000}>
          <Box sx={{ mb: 8 }}>
            <Typography variant="h4" sx={{ 
              color: 'white', 
              textAlign: 'center', 
              mb: 4,
              fontWeight: 'bold'
            }}>
              Choose Your Agent Domain
            </Typography>
            
            <Grid container spacing={3}>
              {agentDomains.map((domain, index) => (
                <Grid item xs={6} md={4} lg={2} key={index}>
                  <Card sx={{ 
                    background: 'rgba(25, 25, 25, 0.9)', 
                    border: `2px solid ${domain.color}`,
                    borderRadius: 3,
                    textAlign: 'center',
                    py: 2,
                    transition: 'all 0.3s ease',
                    '&:hover': {
                      transform: 'scale(1.05)',
                      boxShadow: `0 5px 20px ${domain.color}40`
                    }
                  }}>
                    <Box sx={{ color: domain.color, mb: 1 }}>
                      {domain.icon}
                    </Box>
                    <Typography variant="body2" sx={{ color: 'white', fontWeight: 'bold' }}>
                      {domain.name}
                    </Typography>
                  </Card>
                </Grid>
              ))}
            </Grid>
          </Box>
        </Grow>

        {/* Progress Indicator */}
        <Grow in timeout={2500}>
          <Box sx={{ textAlign: 'center' }}>
            <Typography variant="h6" sx={{ color: 'white', mb: 2 }}>
              Ready to Start Your Journey?
            </Typography>
            
            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 2, mb: 3 }}>
              <Chip 
                label="Connect Wallet" 
                color={connected ? 'success' : 'default'}
                icon={connected ? <RocketIcon /> : undefined}
                sx={{ 
                  background: connected ? '#2ed573' : 'rgba(255,255,255,0.1)',
                  color: connected ? 'black' : 'white'
                }}
              />
              <Typography variant="body2" sx={{ color: 'text.secondary' }}>→</Typography>
              <Chip 
                label="Mint Agent" 
                color={connected ? 'primary' : 'default'}
                icon={<BrainIcon />}
                sx={{ 
                  background: connected ? '#00ffff' : 'rgba(255,255,255,0.1)',
                  color: connected ? 'black' : 'white'
                }}
              />
              <Typography variant="body2" sx={{ color: 'text.secondary' }}>→</Typography>
              <Chip 
                label="Unlock Dashboard" 
                color="secondary"
                icon={<AutoAwesomeIcon />}
                sx={{ 
                  background: 'rgba(255,255,255,0.1)',
                  color: 'white'
                }}
              />
            </Box>
            
            <LinearProgress 
              variant="determinate" 
              value={connected ? 50 : 0}
              sx={{ 
                height: 8, 
                borderRadius: 4,
                maxWidth: 400,
                mx: 'auto',
                '& .MuiLinearProgress-bar': {
                  background: 'linear-gradient(45deg, #00ffff, #2ed573)'
                }
              }}
            />
            <Typography variant="caption" sx={{ color: 'text.secondary', mt: 1, display: 'block' }}>
              {connected ? 'Step 1/2: Wallet Connected ✅' : 'Step 1/2: Connect your wallet to begin'}
            </Typography>
            
            {/* Action Buttons */}
            <Box sx={{ display: 'flex', gap: 2, justifyContent: 'center', mt: 3, flexWrap: 'wrap' }}>
              <Button
                variant="contained"
                size="large"
                onClick={handleConnectWallet}
                disabled={connected}
                sx={{
                  background: connected ? '#2ed573' : 'linear-gradient(45deg, #00ffff, #2ed573)',
                  color: 'black',
                  fontWeight: 'bold',
                  px: 4,
                  py: 1.5,
                  '&:hover': {
                    background: connected ? '#2ed573' : 'linear-gradient(45deg, #2ed573, #00ffff)',
                  },
                  '&:disabled': {
                    background: '#2ed573',
                    color: 'black'
                  }
                }}
              >
                {connected ? '✅ Wallet Connected' : '🔗 Connect Wallet'}
              </Button>
              
              <Button
                variant="contained"
                size="large"
                onClick={handleStartMinting}
                disabled={!connected}
                sx={{
                  background: !connected ? 'rgba(255,255,255,0.1)' : 'linear-gradient(45deg, #ff6b6b, #ffc107)',
                  color: 'white',
                  fontWeight: 'bold',
                  px: 4,
                  py: 1.5,
                  '&:hover': {
                    background: !connected ? 'rgba(255,255,255,0.1)' : 'linear-gradient(45deg, #ffc107, #ff6b6b)',
                  },
                  '&:disabled': {
                    background: 'rgba(255,255,255,0.1)',
                    color: 'rgba(255,255,255,0.5)'
                  }
                }}
              >
                🚀 Mint Agent
              </Button>
              
              <Button
                variant="contained"
                size="large"
                onClick={handleUnlockDashboard}
                disabled={!connected}
                sx={{
                  background: !connected ? 'rgba(255,255,255,0.1)' : 'linear-gradient(45deg, #9b59b6, #e74c3c)',
                  color: 'white',
                  fontWeight: 'bold',
                  px: 4,
                  py: 1.5,
                  '&:hover': {
                    background: !connected ? 'rgba(255,255,255,0.1)' : 'linear-gradient(45deg, #e74c3c, #9b59b6)',
                  },
                  '&:disabled': {
                    background: 'rgba(255,255,255,0.1)',
                    color: 'rgba(255,255,255,0.5)'
                  }
                }}
              >
                🎯 Unlock Dashboard
              </Button>
            </Box>
          </Box>
        </Grow>
      </Container>
    </Box>
  );
};

export default LandingPage; 