"use client";

import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Grid,
  Button,
  Chip,
  Tabs,
  Tab,
  Alert,
  Snackbar,
  Fade,
  Zoom,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  MenuItem,
  FormControl,
  InputLabel,
  Select,
} from '@mui/material';
import {
  Psychology as PsychologyIcon,
  TrendingUp as TrendingUpIcon,
  Star as StarIcon,
  AutoAwesome as AutoAwesomeIcon,
  Add as AddIcon,
  FilterList as FilterIcon,
  ViewModule as GridIcon,
  ViewList as ListIcon,
} from '@mui/icons-material';
import AgentCard from './AgentCard';
import AgentUpgradeModal from './AgentUpgradeModal';
import TaskManagement from './TaskManagement';
import { AgentUpgradeTier, getAgentTier } from '../utils/agentUpgradeUtils';

interface Agent {
  id: string;
  name: string;
  xp: number;
  level: number;
  tasksCompleted: number;
  usageCount: number;
  specialization: string;
  status: 'active' | 'idle' | 'training';
  lastActive: string;
  type: 'Master' | 'Sub-Agent';
  domain: string;
  personality: string;
  description: string;
  avatar: string;
  specializations: string[];
  parentAgent?: number;
  subAgents?: number[];
}

const AgentManagement: React.FC = () => {
  const [selectedTab, setSelectedTab] = useState(0);
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [selectedAgent, setSelectedAgent] = useState<Agent | null>(null);
  const [showUpgradeModal, setShowUpgradeModal] = useState(false);
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' as 'success' | 'error' | 'warning' | 'info' });
  const [userBalance, setUserBalance] = useState({ dmt: 1000, dmtx: 50 });
  const [showTaskManagement, setShowTaskManagement] = useState(false);
  const [showTaskModal, setShowTaskModal] = useState(false);

  // Task modal fields state
  const [assignedAgent, setAssignedAgent] = useState('');
  const [taskPriority, setTaskPriority] = useState('');
  const [taskName, setTaskName] = useState('');
  const [taskDescription, setTaskDescription] = useState('');

  // Enhanced agents data with upgrade system integration
  const [agents, setAgents] = useState<Agent[]>([
    {
      id: '1',
      name: 'Master Agent',
      type: 'Master',
      domain: 'Orchestration',
      personality: 'Strategic',
      level: 5,
      xp: 7500,
      tasksCompleted: 500,
      usageCount: 2500,
      status: 'active',
      lastActive: '2 minutes ago',
      description: 'Coordinates all sub-agents and manages overall strategy',
      avatar: '/master-agent.png',
      specialization: 'Leadership',
      specializations: ['Leadership', 'Coordination', 'Strategy'],
      subAgents: [2, 3, 4],
    },
    {
      id: '2',
      name: 'Language Agent',
      type: 'Sub-Agent',
      domain: 'Learning',
      personality: 'Educational',
      level: 2,
      xp: 750,
      tasksCompleted: 35,
      usageCount: 150,
      status: 'idle',
      lastActive: '1 hour ago',
      description: 'Specializes in language learning and communication',
      avatar: '/sub-agent-1.png',
      specialization: 'German',
      specializations: ['German', 'Spanish', 'French'],
      parentAgent: 1,
    },
    {
      id: '3',
      name: 'Productivity Agent',
      type: 'Sub-Agent',
      domain: 'Productivity',
      personality: 'Efficient',
      level: 3,
      xp: 1800,
      tasksCompleted: 120,
      usageCount: 600,
      status: 'active',
      lastActive: '5 minutes ago',
      description: 'Manages tasks, scheduling, and productivity optimization',
      avatar: '/sub-agent-2.png',
      specialization: 'Task Management',
      specializations: ['Task Management', 'Time Optimization', 'Goal Setting'],
      parentAgent: 1,
    },
    {
      id: '4',
      name: 'Creative Agent',
      type: 'Sub-Agent',
      domain: 'Creative',
      personality: 'Innovative',
      level: 1,
      xp: 200,
      tasksCompleted: 15,
      usageCount: 75,
      status: 'training',
      lastActive: '30 minutes ago',
      description: 'Generates creative ideas and artistic content',
      avatar: '/sub-agent-2.png',
      specialization: 'Design',
      specializations: ['Design', 'Writing', 'Art'],
      parentAgent: 1,
    },
    {
      id: '5',
      name: 'Technical Agent',
      type: 'Sub-Agent',
      domain: 'Technical',
      personality: 'Analytical',
      level: 4,
      xp: 4000,
      tasksCompleted: 280,
      usageCount: 1200,
      status: 'active',
      lastActive: '1 minute ago',
      description: 'Handles technical tasks and code generation',
      avatar: '/sub-agent-3.png',
      specialization: 'Coding',
      specializations: ['Coding', 'Debugging', 'Architecture'],
      parentAgent: 1,
    },
  ]);

  const [filteredAgents, setFilteredAgents] = useState<Agent[]>(agents);

  useEffect(() => {
    setFilteredAgents(agents);
  }, [agents]);

  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    setSelectedTab(newValue);
    
    // Filter agents based on tab
    switch (newValue) {
      case 0: // All Agents
        setFilteredAgents(agents);
        break;
      case 1: // Master Agents
        setFilteredAgents(agents.filter(agent => agent.type === 'Master'));
        break;
      case 2: // Sub-Agents
        setFilteredAgents(agents.filter(agent => agent.type === 'Sub-Agent'));
        break;
      case 3: // Upgradeable
        setFilteredAgents(agents.filter(agent => {
          const tier = getAgentTier(agent.level);
          return tier && agent.level < 5;
        }));
        break;
      default:
        setFilteredAgents(agents);
    }
  };

  const handleUpgrade = (agentId: string) => {
    const agent = agents.find(a => a.id === agentId);
    if (agent) {
      setSelectedAgent(agent);
      setShowUpgradeModal(true);
    }
  };

  const handleUpgradeConfirm = (agentId: string) => {
    // Simulate upgrade process
    setAgents(prevAgents => 
      prevAgents.map(agent => 
        agent.id === agentId 
          ? { 
              ...agent, 
              level: agent.level + 1,
              xp: 0, // Reset XP after upgrade
              tasksCompleted: 0, // Reset tasks after upgrade
              usageCount: 0, // Reset usage after upgrade
            }
          : agent
      )
    );

    // Update user balance (mock)
    setUserBalance(prev => ({
      dmt: prev.dmt - 50, // Mock cost
      dmtx: prev.dmtx - 5,
    }));

    setSnackbar({
      open: true,
      message: `${selectedAgent?.name} upgraded to Level ${selectedAgent ? selectedAgent.level + 1 : 1}!`,
      severity: 'success'
    });

    setShowUpgradeModal(false);
    setSelectedAgent(null);
  };

  const handleTaskCompleted = (agentId: string, xpGained: number, dmtSpent: number) => {
    setAgents(prev => prev.map(agent => 
      agent.id === agentId 
        ? { 
            ...agent, 
            xp: agent.xp + xpGained, 
            tasksCompleted: agent.tasksCompleted + 1,
            usageCount: agent.usageCount + 1
          }
        : agent
    ));
    setUserBalance(prev => ({ 
      ...prev, 
      dmt: Math.max(0, prev.dmt - dmtSpent) 
    }));
    setSnackbar({ 
      open: true, 
      message: `Task completed! +${xpGained} XP, -${dmtSpent} DMT`, 
      severity: 'success' 
    });
  };

  const handleManageTasks = (agent: Agent) => {
    setSelectedAgent(agent);
    setShowTaskManagement(true);
  };

  const getTierStats = () => {
    const tierCounts = agents.reduce((acc, agent) => {
      const tier = getAgentTier(agent.level);
      if (tier) {
        acc[tier.llmTier] = (acc[tier.llmTier] || 0) + 1;
      }
      return acc;
    }, {} as Record<string, number>);

    return tierCounts;
  };

  const tierStats = getTierStats();

  return (
    <Box sx={{ p: 4, bgcolor: '#121212', minHeight: '100vh' }}>
      {/* Task Creation Modal */}
      <Dialog 
        open={showTaskModal} 
        onClose={() => setShowTaskModal(false)}
        maxWidth="md"
        fullWidth
        PaperProps={{
          sx: {
            bgcolor: 'rgba(25, 25, 25, 0.95)',
            color: 'white',
            border: '2px solid #00ffff',
            borderRadius: 2,
          }
        }}
      >
        <DialogTitle sx={{ 
          color: '#00ffff', 
          borderBottom: '1px solid #00ffff',
          fontSize: '1.5rem',
          fontWeight: 'bold'
        }}>
          🎯 Create New Task
        </DialogTitle>
        <DialogContent sx={{ p: 3 }}>
          <Box component="form" sx={{ display: 'flex', flexDirection: 'column', gap: 3, mt: 2 }}>
            <TextField
              label="Task Name"
              variant="outlined"
              fullWidth
              value={taskName}
              onChange={e => setTaskName(e.target.value)}
              sx={{
                '& .MuiOutlinedInput-root': {
                  color: 'white',
                  '& fieldset': {
                    borderColor: '#00ffff',
                  },
                  '&:hover fieldset': {
                    borderColor: '#00ffff',
                  },
                  '&.Mui-focused fieldset': {
                    borderColor: '#00ffff',
                  },
                },
                '& .MuiInputLabel-root': {
                  color: '#b0b0b0',
                  '&.Mui-focused': {
                    color: '#00ffff',
                  },
                },
              }}
            />
            <TextField
              label="Task Description"
              variant="outlined"
              fullWidth
              multiline
              minRows={3}
              value={taskDescription}
              onChange={e => setTaskDescription(e.target.value)}
              sx={{
                '& .MuiOutlinedInput-root': {
                  color: 'white',
                  '& fieldset': {
                    borderColor: '#00ffff',
                  },
                  '&:hover fieldset': {
                    borderColor: '#00ffff',
                  },
                  '&.Mui-focused fieldset': {
                    borderColor: '#00ffff',
                  },
                },
                '& .MuiInputLabel-root': {
                  color: '#b0b0b0',
                  '&.Mui-focused': {
                    color: '#00ffff',
                  },
                },
              }}
            />
            <FormControl fullWidth>
              <InputLabel sx={{ color: '#b0b0b0' }}>Assign to Agent</InputLabel>
              <Select
                value={assignedAgent}
                onChange={e => setAssignedAgent(e.target.value)}
                label="Assign to Agent"
                sx={{
                  color: 'white',
                  '& .MuiOutlinedInput-notchedOutline': {
                    borderColor: '#00ffff',
                  },
                  '&:hover .MuiOutlinedInput-notchedOutline': {
                    borderColor: '#00ffff',
                  },
                  '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                    borderColor: '#00ffff',
                  },
                  '& .MuiSvgIcon-root': {
                    color: '#00ffff',
                  },
                }}
              >
                {agents.map(agent => (
                  <MenuItem key={agent.id} value={agent.id}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      <PsychologyIcon sx={{ color: '#00ffff' }} />
                      <Typography>{agent.name}</Typography>
                      <Chip 
                        label={agent.type} 
                        size="small" 
                        sx={{ 
                          bgcolor: agent.type === 'Master' ? '#ff9800' : '#4caf50',
                          color: 'white',
                          fontSize: '0.7rem'
                        }} 
                      />
                    </Box>
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
            <FormControl fullWidth>
              <InputLabel sx={{ color: '#b0b0b0' }}>Task Priority</InputLabel>
              <Select
                value={taskPriority}
                onChange={e => setTaskPriority(e.target.value)}
                label="Task Priority"
                sx={{
                  color: 'white',
                  '& .MuiOutlinedInput-notchedOutline': {
                    borderColor: '#00ffff',
                  },
                  '&:hover .MuiOutlinedInput-notchedOutline': {
                    borderColor: '#00ffff',
                  },
                  '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                    borderColor: '#00ffff',
                  },
                  '& .MuiSvgIcon-root': {
                    color: '#00ffff',
                  },
                }}
              >
                <MenuItem value="low">
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <Chip label="Low" size="small" color="success" />
                    <Typography>Low Priority</Typography>
                  </Box>
                </MenuItem>
                <MenuItem value="medium">
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <Chip label="Medium" size="small" color="warning" />
                    <Typography>Medium Priority</Typography>
                  </Box>
                </MenuItem>
                <MenuItem value="high">
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <Chip label="High" size="small" color="error" />
                    <Typography>High Priority</Typography>
                  </Box>
                </MenuItem>
              </Select>
            </FormControl>
          </Box>
        </DialogContent>
        <DialogActions sx={{ 
          p: 3, 
          borderTop: '1px solid #00ffff',
          gap: 2 
        }}>
          <Button 
            onClick={() => setShowTaskModal(false)} 
            variant="outlined"
            sx={{ 
              borderColor: '#666',
              color: '#666',
              '&:hover': {
                borderColor: '#999',
                color: '#999',
              }
            }}
          >
            Cancel
          </Button>
          <Button
            onClick={() => {
              console.log('Task Created:', {
                taskName,
                taskDescription,
                assignedAgent,
                taskPriority,
              });
              setShowTaskModal(false);
              setSnackbar({ open: true, message: 'Task created successfully!', severity: 'success' });
              setTaskName('');
              setTaskDescription('');
              setAssignedAgent('');
              setTaskPriority('');
            }}
            variant="contained"
            sx={{
              bgcolor: '#00ffff',
              color: '#000',
              fontWeight: 'bold',
              '&:hover': {
                bgcolor: '#00cccc',
              }
            }}
            disabled={!taskName || !taskDescription || !assignedAgent || !taskPriority}
          >
            Create Task
          </Button>
        </DialogActions>
      </Dialog>

      {/* Header */}
      <Box sx={{ mb: 4 }}>
        <Typography variant="h3" sx={{ color: '#00ffff', mb: 2, fontWeight: 'bold' }}>
          🤖 Agent Management
        </Typography>
        <Typography variant="h6" sx={{ color: 'rgba(255, 255, 255, 0.7)', mb: 3 }}>
          Manage, upgrade, and monitor your AI agents
        </Typography>

        {/* Stats Overview */}
        <Box sx={{ display: 'flex', gap: 2, mb: 3, flexWrap: 'wrap' }}>
          <Chip
            icon={<PsychologyIcon />}
            label={`${agents.length} Total Agents`}
            sx={{ bgcolor: 'rgba(0, 255, 255, 0.1)', color: '#00ffff', border: '1px solid #00ffff' }}
          />
          <Chip
            icon={<StarIcon />}
            label={`${tierStats.Mini || 0} Mini LLM`}
            sx={{ bgcolor: 'rgba(76, 175, 80, 0.1)', color: '#4caf50', border: '1px solid #4caf50' }}
          />
          <Chip
            icon={<TrendingUpIcon />}
            label={`${tierStats.Pro || 0} Pro LLM`}
            sx={{ bgcolor: 'rgba(33, 150, 243, 0.1)', color: '#2196f3', border: '1px solid #2196f3' }}
          />
          <Chip
            icon={<AutoAwesomeIcon />}
            label={`${tierStats.Custom || 0} Custom LLM`}
            sx={{ bgcolor: 'rgba(255, 152, 0, 0.1)', color: '#ff9800', border: '1px solid #ff9800' }}
          />
        </Box>

        {/* Controls */}
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
          <Tabs
            value={selectedTab}
            onChange={handleTabChange}
            sx={{
              '& .MuiTab-root': {
                color: 'rgba(255, 255, 255, 0.7)',
                '&.Mui-selected': { color: '#00ffff' },
              },
              '& .MuiTabs-indicator': { bgcolor: '#00ffff' },
            }}
          >
            <Tab label="All Agents" />
            <Tab label="Master Agents" />
            <Tab label="Sub-Agents" />
            <Tab label="Upgradeable" />
          </Tabs>

          <Box sx={{ display: 'flex', gap: 1 }}>
            <Button
              variant={viewMode === 'grid' ? 'contained' : 'outlined'}
              startIcon={<GridIcon />}
              onClick={() => setViewMode('grid')}
              sx={{
                bgcolor: viewMode === 'grid' ? '#00ffff' : 'transparent',
                color: viewMode === 'grid' ? 'black' : '#00ffff',
                borderColor: '#00ffff',
                '&:hover': {
                  bgcolor: viewMode === 'grid' ? '#00e5e5' : 'rgba(0, 255, 255, 0.1)',
                },
              }}
            >
              Grid
            </Button>
            <Button
              variant={viewMode === 'list' ? 'contained' : 'outlined'}
              startIcon={<ListIcon />}
              onClick={() => setViewMode('list')}
              sx={{
                bgcolor: viewMode === 'list' ? '#00ffff' : 'transparent',
                color: viewMode === 'list' ? 'black' : '#00ffff',
                borderColor: '#00ffff',
                '&:hover': {
                  bgcolor: viewMode === 'list' ? '#00e5e5' : 'rgba(0, 255, 255, 0.1)',
                },
              }}
            >
              List
            </Button>
          </Box>
        </Box>
      </Box>

      {/* Moved task creation button outside the fallback */}
      <Box sx={{ display: 'flex', justifyContent: 'flex-end', mb: 2 }}>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          sx={{
            bgcolor: '#00ffff',
            color: 'black',
            '&:hover': { bgcolor: '#00e5e5' },
          }}
          onClick={() => setShowTaskModal(true)}
        >
          Create New Task
        </Button>
      </Box>

      {/* Agents Grid/List */}
      {filteredAgents.length === 0 ? (
        <Box sx={{ textAlign: 'center', py: 8 }}>
          <Typography variant="h6" sx={{ color: 'rgba(255, 255, 255, 0.5)', mb: 2 }}>
            No agents found
          </Typography>
        </Box>
      ) : (
        <Grid container spacing={3}>
          {filteredAgents.map((agent, index) => (
            <Grid item xs={12} sm={6} md={4} lg={3} key={agent.id}>
              <Fade in timeout={300 + index * 100}>
                <div>
                  <AgentCard
                    agent={agent}
                    onUpgrade={handleUpgrade}
                    onManageTasks={handleManageTasks}
                    userBalance={userBalance}
                  />
                </div>
              </Fade>
            </Grid>
          ))}
        </Grid>
      )}

      {/* Upgrade Modal */}
      {selectedAgent && (
        <AgentUpgradeModal
          open={showUpgradeModal}
          onClose={() => {
            setShowUpgradeModal(false);
            setSelectedAgent(null);
          }}
          onUpgrade={handleUpgradeConfirm}
          agent={selectedAgent}
          userBalance={userBalance}
        />
      )}

      {/* Task Management Modal */}
      {showTaskManagement && selectedAgent && (
        <Dialog
          open={showTaskManagement}
          onClose={() => setShowTaskManagement(false)}
          maxWidth="lg"
          fullWidth
          PaperProps={{
            sx: {
              bgcolor: '#121212',
              color: 'white',
              minHeight: '80vh',
            }
          }}
        >
          <DialogTitle sx={{ color: '#00ffff', borderBottom: '1px solid #00ffff' }}>
            Task Management - {selectedAgent.name}
          </DialogTitle>
          <DialogContent sx={{ p: 0 }}>
            <TaskManagement
              selectedAgent={{
                id: selectedAgent.id,
                name: selectedAgent.name,
                level: selectedAgent.level,
                capabilities: selectedAgent.specializations,
                dmtBalance: userBalance.dmt,
              }}
              onTaskCompleted={handleTaskCompleted}
            />
          </DialogContent>
          <DialogActions sx={{ borderTop: '1px solid #00ffff', p: 2 }}>
            <Button
              onClick={() => setShowTaskManagement(false)}
              sx={{ color: '#00ffff' }}
            >
              Close
            </Button>
          </DialogActions>
        </Dialog>
      )}

      {/* Snackbar */}
      <Snackbar
        open={snackbar.open}
        autoHideDuration={6000}
        onClose={() => setSnackbar(prev => ({ ...prev, open: false }))}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
      >
        <Alert
          onClose={() => setSnackbar(prev => ({ ...prev, open: false }))}
          severity={snackbar.severity}
          sx={{ width: '100%' }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default AgentManagement;