"use client";

import React, { useState } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Typography,
  Box,
  Grid,
  Card,
  CardContent,
  Chip,
  LinearProgress,
  Alert,
  Divider,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
} from '@mui/material';
import {
  TrendingUp as TrendingUpIcon,
  Star as StarIcon,
  Security as SecurityIcon,
  Psychology as PsychologyIcon,
  CheckCircle as CheckCircleIcon,
  Warning as WarningIcon,
  Token as TokenIcon,
} from '@mui/icons-material';
import { useWallet } from '@solana/wallet-adapter-react';
import { useToast } from './ToastNotifications';

interface AgentUpgradeModalProps {
  open: boolean;
  onClose: () => void;
  agent: any;
  onUpgrade: (agentId: string, cost: number) => Promise<{ success: boolean; error?: string }>;
}

const AgentUpgradeModal: React.FC<AgentUpgradeModalProps> = ({
  open,
  onClose,
  agent,
  onUpgrade,
}) => {
  const { publicKey, connected, signTransaction } = useWallet();
  const { showSuccess, showError, showInfo } = useToast();
  const [loading, setLoading] = useState(false);
  const [walletBalance, setWalletBalance] = useState(10000); // Mock balance

  const upgradeCost = agent ? agent.level * 50 : 0;
  const hasEnoughBalance = walletBalance >= upgradeCost;

  const upgradeBenefits = [
    {
      title: 'Enhanced Intelligence',
      description: 'Improved problem-solving and decision-making capabilities',
      icon: <PsychologyIcon />,
      improvement: '+25% AI Performance',
    },
    {
      title: 'New Skills Unlocked',
      description: 'Access to advanced features and specialized abilities',
      icon: <StarIcon />,
      improvement: '+3 New Skills',
    },
    {
      title: 'Better Task Management',
      description: 'Improved efficiency in handling complex tasks',
      icon: <TrendingUpIcon />,
      improvement: '+40% Task Speed',
    },
    {
      title: 'Enhanced Security',
      description: 'Advanced security protocols and data protection',
      icon: <SecurityIcon />,
      improvement: '+50% Security',
    },
  ];

  const handleUpgrade = async () => {
    if (!connected) {
      showError('Please connect your wallet first');
      return;
    }

    if (!hasEnoughBalance) {
      showError(`Insufficient balance. You need ${upgradeCost} DMT but have ${walletBalance} DMT`);
      return;
    }

    setLoading(true);
    try {
      // Simulate wallet signature requirement
      showInfo('Please approve the transaction in your wallet...');
      
      // Simulate transaction delay
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      const result = await onUpgrade(agent.id, upgradeCost);
      
      if (result.success) {
        showSuccess(`Agent ${agent.name} upgraded successfully!`);
        setWalletBalance(prev => prev - upgradeCost);
        onClose();
      } else {
        showError(`Upgrade failed: ${result.error}`);
      }
    } catch (error) {
      console.error('Upgrade error:', error);
      showError('Failed to upgrade agent. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  if (!agent) return null;

  return (
    <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
      <DialogTitle sx={{ color: '#00ffff', fontWeight: 'bold' }}>
        🚀 Upgrade Agent: {agent.name}
      </DialogTitle>
      
      <DialogContent>
        {/* Current Agent Stats */}
        <Box sx={{ mb: 3 }}>
          <Typography variant="h6" sx={{ color: 'white', mb: 2 }}>
            Current Level: {agent.level}
          </Typography>
          
          <Grid container spacing={2} sx={{ mb: 2 }}>
            <Grid item xs={6}>
              <Card sx={{ background: 'rgba(25, 25, 25, 0.9)', border: '1px solid #333' }}>
                <CardContent>
                  <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                    Current XP
                  </Typography>
                  <Typography variant="h6" sx={{ color: '#00ffff' }}>
                    {agent.xp}
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
            <Grid item xs={6}>
              <Card sx={{ background: 'rgba(25, 25, 25, 0.9)', border: '1px solid #333' }}>
                <CardContent>
                  <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                    Skills
                  </Typography>
                  <Typography variant="h6" sx={{ color: '#2ed573' }}>
                    {agent.skills?.length || 0}
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
          </Grid>
        </Box>

        <Divider sx={{ my: 2, borderColor: '#333' }} />

        {/* Upgrade Requirements */}
        <Box sx={{ mb: 3 }}>
          <Typography variant="h6" sx={{ color: 'white', mb: 2 }}>
            Upgrade Requirements
          </Typography>
          
          <Grid container spacing={2}>
            <Grid item xs={12} md={6}>
              <Card sx={{ 
                background: hasEnoughBalance ? 'rgba(25, 25, 25, 0.9)' : 'rgba(255, 0, 0, 0.1)',
                border: hasEnoughBalance ? '1px solid #2ed573' : '1px solid #ff3860'
              }}>
                <CardContent>
                  <Box display="flex" alignItems="center" mb={1}>
                    <TokenIcon sx={{ color: hasEnoughBalance ? '#2ed573' : '#ff3860', mr: 1 }} />
                    <Typography variant="h6" sx={{ color: hasEnoughBalance ? '#2ed573' : '#ff3860' }}>
                      {upgradeCost} DMT
                    </Typography>
                  </Box>
                  <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                    Your Balance: {walletBalance} DMT
                  </Typography>
                  {!hasEnoughBalance && (
                    <Alert severity="error" sx={{ mt: 1 }}>
                      Insufficient balance
                    </Alert>
                  )}
                </CardContent>
              </Card>
            </Grid>
            
            <Grid item xs={12} md={6}>
              <Card sx={{ background: 'rgba(25, 25, 25, 0.9)', border: '1px solid #333' }}>
                <CardContent>
                  <Typography variant="h6" sx={{ color: '#fdcb6e' }}>
                    Level {agent.level + 1}
                  </Typography>
                  <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                    New Level
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
          </Grid>
        </Box>

        <Divider sx={{ my: 2, borderColor: '#333' }} />

        {/* Upgrade Benefits */}
        <Box sx={{ mb: 3 }}>
          <Typography variant="h6" sx={{ color: 'white', mb: 2 }}>
            Upgrade Benefits
          </Typography>
          
          <Grid container spacing={2}>
            {upgradeBenefits.map((benefit, index) => (
              <Grid item xs={12} md={6} key={index}>
                <Card sx={{ background: 'rgba(25, 25, 25, 0.9)', border: '1px solid #333' }}>
                  <CardContent>
                    <Box display="flex" alignItems="center" mb={1}>
                      <Box sx={{ color: '#00ffff', mr: 1 }}>
                        {benefit.icon}
                      </Box>
                      <Typography variant="subtitle1" sx={{ color: 'white', fontWeight: 'bold' }}>
                        {benefit.title}
                      </Typography>
                    </Box>
                    <Typography variant="body2" sx={{ color: 'text.secondary', mb: 1 }}>
                      {benefit.description}
                    </Typography>
                    <Chip
                      label={benefit.improvement}
                      size="small"
                      sx={{ background: '#2ed573', color: 'white', fontWeight: 'bold' }}
                    />
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>
        </Box>

        <Divider sx={{ my: 2, borderColor: '#333' }} />

        {/* Upgrade Process */}
        <Box sx={{ mb: 3 }}>
          <Typography variant="h6" sx={{ color: 'white', mb: 2 }}>
            Upgrade Process
          </Typography>
          
          <List>
            <ListItem>
              <ListItemIcon>
                <CheckCircleIcon sx={{ color: '#2ed573' }} />
              </ListItemIcon>
              <ListItemText 
                primary="Wallet Connection" 
                secondary="Connect your Solana wallet to proceed"
                primaryTypographyProps={{ color: 'white' }}
                secondaryTypographyProps={{ color: 'text.secondary' }}
              />
            </ListItem>
            
            <ListItem>
              <ListItemIcon>
                {connected ? <CheckCircleIcon sx={{ color: '#2ed573' }} /> : <WarningIcon sx={{ color: '#ff3860' }} />}
              </ListItemIcon>
              <ListItemText 
                primary="Balance Verification" 
                secondary={`Verify you have ${upgradeCost} DMT available`}
                primaryTypographyProps={{ color: 'white' }}
                secondaryTypographyProps={{ color: 'text.secondary' }}
              />
            </ListItem>
            
            <ListItem>
              <ListItemIcon>
                <CheckCircleIcon sx={{ color: '#2ed573' }} />
              </ListItemIcon>
              <ListItemText 
                primary="Transaction Approval" 
                secondary="Sign the upgrade transaction in your wallet"
                primaryTypographyProps={{ color: 'white' }}
                secondaryTypographyProps={{ color: 'text.secondary' }}
              />
            </ListItem>
            
            <ListItem>
              <ListItemIcon>
                <CheckCircleIcon sx={{ color: '#2ed573' }} />
              </ListItemIcon>
              <ListItemText 
                primary="Agent Evolution" 
                secondary="Your agent will evolve to the next level"
                primaryTypographyProps={{ color: 'white' }}
                secondaryTypographyProps={{ color: 'text.secondary' }}
              />
            </ListItem>
          </List>
        </Box>

        {!connected && (
          <Alert severity="warning" sx={{ mb: 2 }}>
            Please connect your wallet to upgrade your agent
          </Alert>
        )}

        {connected && !hasEnoughBalance && (
          <Alert severity="error" sx={{ mb: 2 }}>
            Insufficient DMT balance. You need {upgradeCost} DMT but have {walletBalance} DMT
          </Alert>
        )}
      </DialogContent>

      <DialogActions>
        <Button onClick={onClose} sx={{ color: 'text.secondary' }}>
          Cancel
        </Button>
        <Button
          onClick={handleUpgrade}
          disabled={!connected || !hasEnoughBalance || loading}
          variant="contained"
          sx={{
            background: '#00ffff',
            color: 'black',
            fontWeight: 'bold',
            '&:hover': {
              background: '#00cccc',
            },
            '&:disabled': {
              background: '#666',
              color: '#999',
            },
          }}
        >
          {loading ? 'Processing...' : `Upgrade Agent (${upgradeCost} DMT)`}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default AgentUpgradeModal; 