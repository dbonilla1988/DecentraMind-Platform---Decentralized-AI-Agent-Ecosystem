'use client';

import React, { useState } from 'react';
import {
  Card,
  CardContent,
  CardActions,
  Typography,
  Button,
  Box,
  Chip,
  LinearProgress,
  IconButton,
  Tooltip,
  Badge,
  Avatar,
  Grid,
} from '@mui/material';
import {
  Upgrade as UpgradeIcon,
  Psychology as PsychologyIcon,
  Star as StarIcon,
  Speed as SpeedIcon,
  CheckCircle as AccuracyIcon,
  TrendingUp as TrendingUpIcon,
  FlashOn as FlashIcon,
  Rocket as RocketIcon,
  Diamond as CrownIcon,
} from '@mui/icons-material';
import {
  AgentUpgradePath,
  calculateUpgradePath,
  getAgentTier,
  getTierBadgeColor,
  AGENT_UPGRADE_TIERS,
  formatUpgradeCost,
} from '../utils/agentUpgradeUtils';
import AgentAccessControl from './AgentAccessControl';
import { userTierService, UserProfile } from '../services/userTierService';

interface AgentCardProps {
  agent: {
    id: string;
    name: string;
    xp: number;
    level: number;
    tasksCompleted: number;
    usageCount: number;
    specialization: string;
    status: 'active' | 'idle' | 'training';
    lastActive: string;
    tier?: string;
  };
  onUpgrade: (agentId: string) => void;
  onManageTasks?: (agent: any) => void;
  userBalance: {
    dmt: number;
    dmtx: number;
  };
  userProfile?: UserProfile;
  showAccessControl?: boolean;
}

export default function AgentCard({ agent, onUpgrade, onManageTasks, userBalance, userProfile, showAccessControl = false }: AgentCardProps) {
  const [upgradePath, setUpgradePath] = useState<AgentUpgradePath | null>(null);
  const [currentTier, setCurrentTier] = useState<any>(null);

  React.useEffect(() => {
    const path = calculateUpgradePath(
      agent.xp,
      agent.tasksCompleted,
      agent.usageCount,
      agent.level
    );
    setUpgradePath(path);
    setCurrentTier(getAgentTier(agent.level));
  }, [agent]);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return '#4caf50';
      case 'idle': return '#ff9800';
      case 'training': return '#2196f3';
      default: return '#9e9e9e';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'active': return <FlashIcon />;
      case 'idle': return <StarIcon />;
      case 'training': return <TrendingUpIcon />;
      default: return <PsychologyIcon />;
    }
  };

  const getTierIcon = (llmTier: string) => {
    switch (llmTier) {
      case 'Mini': return <FlashIcon />;
      case 'Pro': return <RocketIcon />;
      case 'Custom': return <CrownIcon />;
      default: return <PsychologyIcon />;
    }
  };

  if (!upgradePath || !currentTier) return null;

  // Determine agent tier for access control
  const agentTier = agent.tier || (agent.level <= 2 ? 'mini-llm' : agent.level <= 4 ? 'pro-llm' : 'custom-llm');

  return (
    <Card
      sx={{
        bgcolor: 'rgba(25, 25, 25, 0.9)',
        border: '2px solid rgba(0, 255, 255, 0.3)',
        borderRadius: 3,
        position: 'relative',
        overflow: 'visible',
        transition: 'all 0.3s ease',
        '&:hover': {
          borderColor: '#00ffff',
          boxShadow: '0 0 20px rgba(0, 255, 255, 0.3)',
          transform: 'translateY(-2px)',
        },
      }}
    >
      {/* Status Indicator */}
      <Box
        sx={{
          position: 'absolute',
          top: 12,
          right: 12,
          display: 'flex',
          alignItems: 'center',
          gap: 1,
        }}
      >
        <Chip
          icon={getStatusIcon(agent.status)}
          label={agent.status}
          size="small"
          sx={{
            bgcolor: getStatusColor(agent.status),
            color: 'white',
            fontWeight: 'bold',
          }}
        />
      </Box>

      {/* Tier Badge */}
      <Box
        sx={{
          position: 'absolute',
          top: 12,
          left: 12,
        }}
      >
        <Chip
          icon={getTierIcon(currentTier.llmTier)}
          label={`${currentTier.llmTier} LLM`}
          size="small"
          sx={{
            bgcolor: getTierBadgeColor(currentTier.llmTier),
            color: 'white',
            fontWeight: 'bold',
          }}
        />
      </Box>

      <CardContent sx={{ pt: 6, pb: 2 }}>
        {/* Agent Name and Level */}
        <Box sx={{ mb: 2, textAlign: 'center' }}>
          <Typography variant="h6" sx={{ color: 'white', fontWeight: 'bold', mb: 1 }}>
            {agent.name}
          </Typography>
          <Typography variant="body2" sx={{ color: 'rgba(255, 255, 255, 0.7)' }}>
            Level {agent.level} • {currentTier.name}
          </Typography>
          <Typography variant="caption" sx={{ color: 'rgba(255, 255, 255, 0.5)' }}>
            {agent.specialization}
          </Typography>
        </Box>

        {/* XP Progress Bar */}
        <Box sx={{ mb: 3 }}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
            <Typography variant="body2" sx={{ color: 'white' }}>
              Experience Points
            </Typography>
            <Typography variant="body2" sx={{ color: '#00ffff' }}>
              {agent.xp} / {upgradePath.upgradeCost.xp}
            </Typography>
          </Box>
          <LinearProgress
            variant="determinate"
            value={upgradePath.progress}
            sx={{
              height: 8,
              borderRadius: 4,
              bgcolor: 'rgba(255, 255, 255, 0.1)',
              '& .MuiLinearProgress-bar': {
                bgcolor: '#00ffff',
                borderRadius: 4,
              },
            }}
          />
        </Box>

        {/* Stats Grid */}
        <Grid container spacing={2} sx={{ mb: 3 }}>
          <Grid item xs={6}>
            <Box sx={{ textAlign: 'center', p: 1, bgcolor: 'rgba(0, 0, 0, 0.3)', borderRadius: 2 }}>
              <Typography variant="h6" sx={{ color: '#4caf50', fontWeight: 'bold' }}>
                {agent.tasksCompleted}
              </Typography>
              <Typography variant="caption" sx={{ color: 'rgba(255, 255, 255, 0.7)' }}>
                Tasks Completed
              </Typography>
            </Box>
          </Grid>
          <Grid item xs={6}>
            <Box sx={{ textAlign: 'center', p: 1, bgcolor: 'rgba(0, 0, 0, 0.3)', borderRadius: 2 }}>
              <Typography variant="h6" sx={{ color: '#ff9800', fontWeight: 'bold' }}>
                {agent.usageCount}
              </Typography>
              <Typography variant="caption" sx={{ color: 'rgba(255, 255, 255, 0.7)' }}>
                Total Interactions
              </Typography>
            </Box>
          </Grid>
        </Grid>

        {/* Capabilities Preview */}
        <Box sx={{ mb: 3 }}>
          <Typography variant="body2" sx={{ color: 'white', mb: 1, fontWeight: 'bold' }}>
            Current Capabilities:
          </Typography>
          <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
            {currentTier.capabilities.slice(0, 3).map((capability: string, index: number) => (
              <Chip
                key={index}
                label={capability}
                size="small"
                sx={{
                  bgcolor: 'rgba(0, 255, 255, 0.1)',
                  color: '#00ffff',
                  border: '1px solid rgba(0, 255, 255, 0.3)',
                  fontSize: '0.7rem',
                }}
              />
            ))}
            {currentTier.capabilities.length > 3 && (
              <Chip
                label={`+${currentTier.capabilities.length - 3} more`}
                size="small"
                sx={{
                  bgcolor: 'rgba(255, 255, 255, 0.1)',
                  color: 'rgba(255, 255, 255, 0.7)',
                  fontSize: '0.7rem',
                }}
              />
            )}
          </Box>
        </Box>

        {/* Performance Metrics */}
        <Grid container spacing={1} sx={{ mb: 3 }}>
          <Grid item xs={4}>
            <Box sx={{ textAlign: 'center' }}>
              <SpeedIcon sx={{ color: '#4caf50', fontSize: 20 }} />
              <Typography variant="caption" sx={{ color: 'white', display: 'block' }}>
                {currentTier.responseTime}
              </Typography>
              <Typography variant="caption" sx={{ color: 'rgba(255, 255, 255, 0.5)', fontSize: '0.6rem' }}>
                Response
              </Typography>
            </Box>
          </Grid>
          <Grid item xs={4}>
            <Box sx={{ textAlign: 'center' }}>
              <AccuracyIcon sx={{ color: '#2196f3', fontSize: 20 }} />
              <Typography variant="caption" sx={{ color: 'white', display: 'block' }}>
                {currentTier.accuracy}
              </Typography>
              <Typography variant="caption" sx={{ color: 'rgba(255, 255, 255, 0.5)', fontSize: '0.6rem' }}>
                Accuracy
              </Typography>
            </Box>
          </Grid>
          <Grid item xs={4}>
            <Box sx={{ textAlign: 'center' }}>
              <TrendingUpIcon sx={{ color: '#ff9800', fontSize: 20 }} />
              <Typography variant="caption" sx={{ color: 'white', display: 'block' }}>
                {currentTier.maxTasksPerDay === -1 ? '∞' : currentTier.maxTasksPerDay}
              </Typography>
              <Typography variant="caption" sx={{ color: 'rgba(255, 255, 255, 0.5)', fontSize: '0.6rem' }}>
                Daily Limit
              </Typography>
            </Box>
          </Grid>
        </Grid>

        {/* Next Level Preview */}
        {upgradePath.nextLevel > upgradePath.currentLevel && (
          <Box sx={{ mb: 2, p: 2, bgcolor: 'rgba(0, 255, 255, 0.05)', borderRadius: 2, border: '1px solid rgba(0, 255, 255, 0.2)' }}>
            <Typography variant="body2" sx={{ color: '#00ffff', mb: 1, fontWeight: 'bold' }}>
              Next Level: {upgradePath.nextLevel}
            </Typography>
            <Typography variant="caption" sx={{ color: 'rgba(255, 255, 255, 0.7)' }}>
              {upgradePath.benefits.slice(0, 2).join(', ')}
              {upgradePath.benefits.length > 2 && ` +${upgradePath.benefits.length - 2} more`}
            </Typography>
          </Box>
        )}
      </CardContent>

      <CardActions sx={{ p: 2, pt: 0, gap: 1 }}>
        {onManageTasks && (
          <Button
            variant="outlined"
            startIcon={<PsychologyIcon />}
            onClick={() => onManageTasks(agent)}
            sx={{
              borderColor: '#4caf50',
              color: '#4caf50',
              fontWeight: 'bold',
              flex: 1,
              '&:hover': {
                borderColor: '#66bb6a',
                bgcolor: 'rgba(76, 175, 80, 0.1)',
              },
            }}
          >
            Manage Tasks
          </Button>
        )}
        <Button
          variant="contained"
          startIcon={<UpgradeIcon />}
          onClick={() => onUpgrade(agent.id)}
          disabled={!upgradePath.canUpgrade}
          sx={{
            bgcolor: upgradePath.canUpgrade ? '#00ffff' : 'rgba(255, 255, 255, 0.1)',
            color: upgradePath.canUpgrade ? 'black' : 'rgba(255, 255, 255, 0.5)',
            fontWeight: 'bold',
            flex: 1,
            '&:hover': {
              bgcolor: upgradePath.canUpgrade ? '#00e5e5' : 'rgba(255, 255, 255, 0.1)',
            },
          }}
        >
          {upgradePath.canUpgrade ? 'Upgrade Agent' : 'Requirements Not Met'}
        </Button>
      </CardActions>

      {/* Access Control */}
      {showAccessControl && userProfile && (
        <Box sx={{ p: 2, pt: 0 }}>
          <AgentAccessControl
            agentTier={agentTier as any}
            userProfile={userProfile}
            onAccessGranted={() => {}}
            onUpgradeRequired={(upgradeInfo) => {
              console.log('Upgrade required:', upgradeInfo);
            }}
          />
        </Box>
      )}

      {/* Upgrade Cost Tooltip */}
      {upgradePath.canUpgrade && (
        <Tooltip
          title={
            <Box>
              <Typography variant="body2" sx={{ fontWeight: 'bold', mb: 1 }}>
                Upgrade Cost:
              </Typography>
              <Typography variant="body2">
                {formatUpgradeCost(upgradePath.upgradeCost)}
              </Typography>
              <Typography variant="caption" sx={{ color: 'rgba(255, 255, 255, 0.7)' }}>
                Your Balance: {userBalance.dmt} DMT, {userBalance.dmtx} DMTX
              </Typography>
            </Box>
          }
          placement="top"
        >
          <Box
            sx={{
              position: 'absolute',
              bottom: 8,
              right: 8,
              width: 20,
              height: 20,
              borderRadius: '50%',
              bgcolor: 'rgba(0, 255, 255, 0.2)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              cursor: 'help',
            }}
          >
            <Typography variant="caption" sx={{ color: '#00ffff', fontSize: '0.7rem' }}>
              ?
            </Typography>
          </Box>
        </Tooltip>
      )}
    </Card>
  );
}
