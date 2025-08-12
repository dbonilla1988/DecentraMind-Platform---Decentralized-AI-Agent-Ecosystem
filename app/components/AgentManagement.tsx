"use client";

import React, { useState } from 'react';
import {
  Box,
  Card,
  CardContent,
  Typography,
  Grid,
  Button,
  Avatar,
  Chip,
  LinearProgress,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  List,
  ListItem,
  ListItemAvatar,
  ListItemText,
  Divider,
  Alert,
} from '@mui/material';
import {
  Psychology as PsychologyIcon,
  School as SchoolIcon,
  FitnessCenter as FitnessIcon,
  Brush as CreativeIcon,
  Code as TechnicalIcon,
  Business as BusinessIcon,
  Chat as ChatIcon,
  Assignment as TaskIcon,
  TrendingUp as UpgradeIcon,
  Star as StarIcon,
  AutoAwesome as AutoAwesomeIcon,
} from '@mui/icons-material';

const AgentManagement: React.FC = () => {
  const [selectedAgent, setSelectedAgent] = useState<any>(null);
  const [showChatDialog, setShowChatDialog] = useState(false);
  const [showTaskDialog, setShowTaskDialog] = useState(false);
  const [showUpgradeDialog, setShowUpgradeDialog] = useState(false);
  const [chatMessage, setChatMessage] = useState('');
  const [taskDescription, setTaskDescription] = useState('');
  const [upgradeType, setUpgradeType] = useState('');

  // Mock agents data - in real app this would come from global state
  const agents = [
    {
      id: 1,
      name: 'Master Agent',
      type: 'Master',
      domain: 'Orchestration',
      personality: 'Strategic',
      level: 5,
      xp: 300,
      status: 'Active',
      description: 'Coordinates all sub-agents and manages overall strategy',
      avatar: '/master-agent.png',
      specializations: ['Leadership', 'Coordination', 'Strategy'],
      subAgents: [2, 3, 4],
    },
    {
      id: 2,
      name: 'Language Agent',
      type: 'Sub-Agent',
      domain: 'Learning',
      personality: 'Educational',
      level: 2,
      xp: 75,
      status: 'Idle',
      description: 'Specializes in language learning and communication',
      avatar: '/sub-agent-1.png',
      specializations: ['German', 'Spanish', 'French'],
      parentAgent: 1,
    },
    {
      id: 3,
      name: 'Productivity Agent',
      type: 'Sub-Agent',
      domain: 'Productivity',
      personality: 'Efficient',
      level: 3,
      xp: 120,
      status: 'Active',
      description: 'Manages tasks, scheduling, and productivity optimization',
      avatar: '/sub-agent-2.png',
      specializations: ['Task Management', 'Time Optimization', 'Goal Setting'],
      parentAgent: 1,
    },
    {
      id: 4,
      name: 'Creative Agent',
      type: 'Sub-Agent',
      domain: 'Creative',
      personality: 'Innovative',
      level: 1,
      xp: 25,
      status: 'Idle',
      description: 'Generates creative ideas and artistic content',
      avatar: '/sub-agent-2.png',
      specializations: ['Design', 'Writing', 'Art'],
      parentAgent: 1,
    },
  ];

  const getDomainIcon = (domain: string) => {
    switch (domain) {
      case 'Learning': return <SchoolIcon />;
      case 'Productivity': return <PsychologyIcon />;
      case 'Health & Wellness': return <FitnessIcon />;
      case 'Creative': return <CreativeIcon />;
      case 'Technical': return <TechnicalIcon />;
      case 'Business': return <BusinessIcon />;
      case 'Orchestration': return <AutoAwesomeIcon />;
      default: return <PsychologyIcon />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Active': return '#2ed573';
      case 'Idle': return '#fdcb6e';
      case 'Busy': return '#ff3860';
      default: return '#666';
    }
  };

  const handleChat = (agent: any) => {
    setSelectedAgent(agent);
    setShowChatDialog(true);
  };

  const handleTask = (agent: any) => {
    setSelectedAgent(agent);
    setShowTaskDialog(true);
  };

  const handleUpgrade = (agent: any) => {
    setSelectedAgent(agent);
    setShowUpgradeDialog(true);
  };

  const sendChatMessage = () => {
    if (!chatMessage.trim()) return;
    
    // In real app, this would send message to the agent
    console.log(`Sending message to ${selectedAgent.name}:`, chatMessage);
    
    setChatMessage('');
    setShowChatDialog(false);
    alert(`Message sent to ${selectedAgent.name}! They will respond shortly.`);
  };

  const assignTask = () => {
    if (!taskDescription.trim()) return;
    
    // In real app, this would assign task to the agent
    console.log(`Assigning task to ${selectedAgent.name}:`, taskDescription);
    
    setTaskDescription('');
    setShowTaskDialog(false);
    alert(`Task assigned to ${selectedAgent.name}! They will start working on it.`);
  };

  const upgradeAgent = () => {
    if (!upgradeType) return;
    
    // In real app, this would upgrade the agent
    console.log(`Upgrading ${selectedAgent.name} with:`, upgradeType);
    
    setUpgradeType('');
    setShowUpgradeDialog(false);
    alert(`${selectedAgent.name} has been upgraded with ${upgradeType}!`);
  };

  return (
    <Box sx={{ p: { xs: 2, md: 4 }, width: '100%', maxWidth: 1200, mx: 'auto' }}>
      <Typography variant="h3" sx={{ color: '#00ffff', fontWeight: 'bold', mb: 2, textShadow: '0 0 8px #00ffff' }}>
        🤖 Agent Management
      </Typography>
      
      <Alert severity="info" sx={{ mb: 3, background: 'rgba(25, 25, 25, 0.9)', border: '1px solid #00ffff' }}>
        <Typography variant="body1" sx={{ color: 'white' }}>
          <strong>Master Agent System:</strong> The Master Agent coordinates all Sub-Agents. Sub-Agents specialize in specific domains and report back to the Master Agent.
        </Typography>
      </Alert>

      <Grid container spacing={3}>
        {agents.map((agent) => (
          <Grid item xs={12} md={6} lg={4} key={agent.id}>
            <Card
              sx={{
                background: 'rgba(25, 25, 25, 0.9)',
                border: `2px solid ${getStatusColor(agent.status)}`,
                borderRadius: 3,
                height: '100%',
                transition: 'all 0.3s ease',
                '&:hover': {
                  transform: 'translateY(-4px)',
                  boxShadow: `0 8px 25px ${getStatusColor(agent.status)}40`,
                },
              }}
            >
              <CardContent>
                <Box display="flex" alignItems="center" mb={2}>
                  <Avatar
                    sx={{
                      width: 56,
                      height: 56,
                      mr: 2,
                      background: agent.type === 'Master' ? '#00ffff' : '#2ed573',
                    }}
                  >
                    {getDomainIcon(agent.domain)}
                  </Avatar>
                  <Box flex={1}>
                    <Typography variant="h6" sx={{ color: 'white', fontWeight: 'bold' }}>
                      {agent.name}
                    </Typography>
                    <Chip
                      label={agent.type}
                      size="small"
                      sx={{
                        background: agent.type === 'Master' ? '#00ffff' : '#2ed573',
                        color: 'white',
                        fontWeight: 'bold',
                      }}
                    />
                  </Box>
                </Box>

                <Typography variant="body2" sx={{ color: 'text.secondary', mb: 2 }}>
                  {agent.description}
                </Typography>

                <Box sx={{ mb: 2 }}>
                  <Typography variant="body2" sx={{ color: 'white', mb: 1 }}>
                    Level {agent.level} | XP: {agent.xp}
                  </Typography>
                  <LinearProgress
                    variant="determinate"
                    value={(agent.xp % 100)}
                    sx={{
                      height: 6,
                      borderRadius: 3,
                      background: '#333',
                      '& .MuiLinearProgress-bar': {
                        background: agent.type === 'Master' ? '#00ffff' : '#2ed573',
                      },
                    }}
                  />
                </Box>

                <Box sx={{ mb: 2 }}>
                  <Typography variant="caption" sx={{ color: 'text.secondary' }}>
                    Domain: {agent.domain}
                  </Typography>
                  <Typography variant="body2" sx={{ color: 'white', fontWeight: 'bold' }}>
                    {agent.personality} Personality
                  </Typography>
                </Box>

                {agent.specializations && (
                  <Box sx={{ mb: 2 }}>
                    <Typography variant="caption" sx={{ color: 'text.secondary' }}>
                      Specializations:
                    </Typography>
                    <Box display="flex" flexWrap="wrap" gap={0.5} mt={0.5}>
                      {agent.specializations.map((spec, index) => (
                        <Chip
                          key={index}
                          label={spec}
                          size="small"
                          sx={{
                            background: '#333',
                            color: '#00ffff',
                            fontSize: '0.7rem',
                          }}
                        />
                      ))}
                    </Box>
                  </Box>
                )}

                <Box display="flex" gap={1}>
                  <Button
                    variant="outlined"
                    size="small"
                    startIcon={<ChatIcon />}
                    onClick={() => handleChat(agent)}
                    sx={{
                      borderColor: '#00ffff',
                      color: '#00ffff',
                      '&:hover': {
                        borderColor: '#00cccc',
                        background: '#00ffff20',
                      },
                    }}
                  >
                    Chat
                  </Button>
                  <Button
                    variant="outlined"
                    size="small"
                    startIcon={<TaskIcon />}
                    onClick={() => handleTask(agent)}
                    sx={{
                      borderColor: '#2ed573',
                      color: '#2ed573',
                      '&:hover': {
                        borderColor: '#2ed573',
                        background: '#2ed57320',
                      },
                    }}
                  >
                    Task
                  </Button>
                  <Button
                    variant="outlined"
                    size="small"
                    startIcon={<UpgradeIcon />}
                    onClick={() => handleUpgrade(agent)}
                    sx={{
                      borderColor: '#ff3860',
                      color: '#ff3860',
                      '&:hover': {
                        borderColor: '#ff3860',
                        background: '#ff386020',
                      },
                    }}
                  >
                    Upgrade
                  </Button>
                </Box>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>

      {/* Chat Dialog */}
      <Dialog open={showChatDialog} onClose={() => setShowChatDialog(false)} maxWidth="sm" fullWidth>
        <DialogTitle sx={{ color: '#00ffff', fontWeight: 'bold' }}>
          Chat with {selectedAgent?.name}
        </DialogTitle>
        <DialogContent>
          <TextField
            fullWidth
            multiline
            rows={4}
            label="Your message"
            value={chatMessage}
            onChange={(e) => setChatMessage(e.target.value)}
            sx={{ mt: 1 }}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setShowChatDialog(false)} sx={{ color: 'text.secondary' }}>
            Cancel
          </Button>
          <Button onClick={sendChatMessage} sx={{ color: '#00ffff' }}>
            Send
          </Button>
        </DialogActions>
      </Dialog>

      {/* Task Dialog */}
      <Dialog open={showTaskDialog} onClose={() => setShowTaskDialog(false)} maxWidth="sm" fullWidth>
        <DialogTitle sx={{ color: '#2ed573', fontWeight: 'bold' }}>
          Assign Task to {selectedAgent?.name}
        </DialogTitle>
        <DialogContent>
          <TextField
            fullWidth
            multiline
            rows={4}
            label="Task description"
            value={taskDescription}
            onChange={(e) => setTaskDescription(e.target.value)}
            sx={{ mt: 1 }}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setShowTaskDialog(false)} sx={{ color: 'text.secondary' }}>
            Cancel
          </Button>
          <Button onClick={assignTask} sx={{ color: '#2ed573' }}>
            Assign
          </Button>
        </DialogActions>
      </Dialog>

      {/* Upgrade Dialog */}
      <Dialog open={showUpgradeDialog} onClose={() => setShowUpgradeDialog(false)} maxWidth="sm" fullWidth>
        <DialogTitle sx={{ color: '#ff3860', fontWeight: 'bold' }}>
          Upgrade {selectedAgent?.name}
        </DialogTitle>
        <DialogContent>
          <Typography variant="body2" sx={{ color: 'text.secondary', mb: 2 }}>
            Choose upgrade type:
          </Typography>
          <List>
            <ListItem button onClick={() => setUpgradeType('Enhanced Intelligence')}>
              <ListItemText 
                primary="Enhanced Intelligence" 
                secondary="Improves decision-making and problem-solving"
              />
            </ListItem>
            <ListItem button onClick={() => setUpgradeType('Specialized Skills')}>
              <ListItemText 
                primary="Specialized Skills" 
                secondary="Adds domain-specific capabilities"
              />
            </ListItem>
            <ListItem button onClick={() => setUpgradeType('Communication')}>
              <ListItemText 
                primary="Communication" 
                secondary="Improves interaction and collaboration"
              />
            </ListItem>
          </List>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setShowUpgradeDialog(false)} sx={{ color: 'text.secondary' }}>
            Cancel
          </Button>
          <Button onClick={upgradeAgent} disabled={!upgradeType} sx={{ color: '#ff3860' }}>
            Upgrade
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default AgentManagement; 