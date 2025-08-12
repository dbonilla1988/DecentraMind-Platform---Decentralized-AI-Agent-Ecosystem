"use client";

import React, { useState } from 'react';
import { Box, Typography, Container, Card, CardContent, IconButton, Drawer } from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';

// Import all components
import EconomicStatusBar from './components/EconomicStatusBar';
import FuturisticSidebar from './components/FuturisticSidebar';
import TestMinting from './components/TestMinting';
import AgentManagement from './components/AgentManagement';
import AgentList from './components/AgentList';
import { AgentProfile } from './components/AgentProfile';
import AgentEvolutionTracker from './components/AgentEvolutionTracker';
import ProposalForm from './components/ProposalForm';
import ProposalsTab from './components/ProposalsTab';
import ProposalList from './components/ProposalList';
import EnhancedStakingTab from './components/EnhancedStakingTab';
import ChatServicesTab from './components/ChatServicesTab';
import MetaverseHub from './components/MetaverseHub';
import ProfessionalServices from './components/ProfessionalServices';
import RewardStats from './components/RewardStats';
import MasterAgentDashboard from './components/MasterAgentDashboard';
import IDOComponent from './components/IDOComponent';
import LearningTab from './components/LearningTab';
import AgentRating from './components/AgentRating';
import AgentUpgradeModal from './components/AgentUpgradeModal';
import Marketplace from './components/Marketplace';
import TokenomicsDashboard from './components/TokenomicsDashboard';
import BurningDashboard from './components/BurningDashboard';
import SubscriptionDashboard from './components/SubscriptionDashboard';

export default function Home() {
  const [selectedDashboard, setSelectedDashboard] = useState(0);
  const [sidebarOpen, setSidebarOpen] = useState(true);

  const handleSidebarToggle = () => setSidebarOpen(!sidebarOpen);
  const handleDashboardChange = (index: number) => setSelectedDashboard(index);

  const renderDashboardContent = () => {
    switch (selectedDashboard) {
      case 0: // Decentralized Productivity Hub
        return (
          <Box>
            <Box sx={{ mb: 4 }}>
              <Typography variant="h3" sx={{ color: '#00ffff', fontWeight: 'bold', mb: 2, textShadow: '0 0 8px #00ffff' }}>
                🧠 Decentralized Productivity Hub
              </Typography>
              <Typography variant="h6" sx={{ color: '#fff', mb: 4, fontWeight: 500 }}>
                Your ADHD-friendly AI-powered productivity & wellness ecosystem
              </Typography>
            </Box>
            
            <Typography variant="body1" sx={{ color: 'white', mb: 4 }}>
              Welcome to DecentraMind! This is the main dashboard where you can access all your AI agents and productivity tools.
            </Typography>
            
            <Typography variant="body2" sx={{ color: 'text.secondary', mb: 4 }}>
              Use the navigation to access different features:
            </Typography>
            
            <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap' }}>
              <Box 
                sx={{ 
                  p: 2, 
                  border: '2px solid #00ffff', 
                  borderRadius: 2, 
                  cursor: 'pointer',
                  '&:hover': { bgcolor: 'rgba(0, 255, 255, 0.1)' }
                }}
                onClick={() => setSelectedDashboard(10)}
              >
                <Typography variant="h6" sx={{ color: '#00ffff' }}>
                  📊 Subscription Management
                </Typography>
                <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                  Manage your subscription and credits
                </Typography>
              </Box>
              
              <Box 
                sx={{ 
                  p: 2, 
                  border: '2px solid #ff6b6b', 
                  borderRadius: 2, 
                  cursor: 'pointer',
                  '&:hover': { bgcolor: 'rgba(255, 107, 107, 0.1)' }
                }}
                onClick={() => setSelectedDashboard(11)}
              >
                <Typography variant="h6" sx={{ color: '#ff6b6b' }}>
                  🔥 Burning Analytics
                </Typography>
                <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                  View token burning metrics
                </Typography>
              </Box>

              <Box 
                sx={{ 
                  p: 2, 
                  border: '2px solid #4ecdc4', 
                  borderRadius: 2, 
                  cursor: 'pointer',
                  '&:hover': { bgcolor: 'rgba(78, 205, 196, 0.1)' }
                }}
                onClick={() => setSelectedDashboard(2)}
              >
                <Typography variant="h6" sx={{ color: '#4ecdc4' }}>
                  🤖 Agent Minting
                </Typography>
                <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                  Create and mint AI agents
                </Typography>
              </Box>

              <Box 
                sx={{ 
                  p: 2, 
                  border: '2px solid #9b59b6', 
                  borderRadius: 2, 
                  cursor: 'pointer',
                  '&:hover': { bgcolor: 'rgba(155, 89, 182, 0.1)' }
                }}
                onClick={() => setSelectedDashboard(3)}
              >
                <Typography variant="h6" sx={{ color: '#9b59b6' }}>
                  🏪 Marketplace
                </Typography>
                <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                  Buy and sell AI agents
                </Typography>
              </Box>

              <Box 
                sx={{ 
                  p: 2, 
                  border: '2px solid #ffa726', 
                  borderRadius: 2, 
                  cursor: 'pointer',
                  '&:hover': { bgcolor: 'rgba(255, 167, 38, 0.1)' }
                }}
                onClick={() => setSelectedDashboard(4)}
              >
                <Typography variant="h6" sx={{ color: '#ffa726' }}>
                  💎 Staking & Rewards
                </Typography>
                <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                  Stake tokens and earn rewards
                </Typography>
              </Box>

              <Box 
                sx={{ 
                  p: 2, 
                  border: '2px solid #ab47bc', 
                  borderRadius: 2, 
                  cursor: 'pointer',
                  '&:hover': { bgcolor: 'rgba(171, 71, 188, 0.1)' }
                }}
                onClick={() => setSelectedDashboard(5)}
              >
                <Typography variant="h6" sx={{ color: '#ab47bc' }}>
                  🏛️ DAO Governance
                </Typography>
                <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                  Participate in governance
                </Typography>
              </Box>
            </Box>
          </Box>
        );
      case 1: return <ChatServicesTab />;
      case 2: return <TestMinting />;
      case 3: return <Marketplace />;
      case 4: return <EnhancedStakingTab />;
      case 5: return <ProposalsTab />;
      case 6: return <IDOComponent />;
      case 7: return <AgentManagement />;
      case 8: return <MasterAgentDashboard />;
      case 9: return <AgentEvolutionTracker />;
      case 10: return <SubscriptionDashboard />;
      case 11: return <BurningDashboard />;
      case 12: return <TokenomicsDashboard />;
      case 13: return <ProfessionalServices />;
      case 14: return <MetaverseHub />;
      default:
        return (
          <Box>
            <Typography variant="h4" sx={{ color: '#00ffff', mb: 2 }}>
              404 - Page Not Found
            </Typography>
            <Typography variant="body1" sx={{ color: 'white' }}>
              The selected dashboard does not exist.
            </Typography>
          </Box>
        );
    }
  };

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh', bgcolor: '#121212' }}>
      <Box
        sx={{
          bgcolor: 'rgba(25, 25, 25, 0.95)',
          borderBottom: '2px solid #00ffff',
          p: 2,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
        }}
      >
        <Typography variant="h6" sx={{ color: '#00ffff', fontWeight: 700 }}>
          DecentraMind AI
        </Typography>
        <Box sx={{ display: 'flex', gap: 2 }}>
          <Box
            sx={{
              px: 2,
              py: 1,
              border: '1px solid #00ffff',
              borderRadius: 1,
              cursor: 'pointer',
              '&:hover': { bgcolor: 'rgba(0, 255, 255, 0.1)' }
            }}
            onClick={() => setSelectedDashboard(0)}
          >
            <Typography variant="body2" sx={{ color: '#00ffff' }}>
              Dashboard
            </Typography>
          </Box>
          <Box
            sx={{
              px: 2,
              py: 1,
              border: '1px solid #4ecdc4',
              borderRadius: 1,
              cursor: 'pointer',
              '&:hover': { bgcolor: 'rgba(78, 205, 196, 0.1)' }
            }}
            onClick={() => setSelectedDashboard(2)}
          >
            <Typography variant="body2" sx={{ color: '#4ecdc4' }}>
              Agent Minting
            </Typography>
          </Box>
          <Box
            sx={{
              px: 2,
              py: 1,
              border: '1px solid #ffa726',
              borderRadius: 1,
              cursor: 'pointer',
              '&:hover': { bgcolor: 'rgba(255, 167, 38, 0.1)' }
            }}
            onClick={() => setSelectedDashboard(4)}
          >
            <Typography variant="body2" sx={{ color: '#ffa726' }}>
              Staking
            </Typography>
          </Box>
          <Box
            sx={{
              px: 2,
              py: 1,
              border: '1px solid #ab47bc',
              borderRadius: 1,
              cursor: 'pointer',
              '&:hover': { bgcolor: 'rgba(171, 71, 188, 0.1)' }
            }}
            onClick={() => setSelectedDashboard(5)}
          >
            <Typography variant="body2" sx={{ color: '#ab47bc' }}>
              DAO
            </Typography>
          </Box>
          <Box
            sx={{
              px: 2,
              py: 1,
              border: '1px solid #00ffff',
              borderRadius: 1,
              cursor: 'pointer',
              '&:hover': { bgcolor: 'rgba(0, 255, 255, 0.1)' }
            }}
            onClick={() => setSelectedDashboard(10)}
          >
            <Typography variant="body2" sx={{ color: '#00ffff' }}>
              Subscription
            </Typography>
          </Box>
          <Box
            sx={{
              px: 2,
              py: 1,
              border: '1px solid #ff6b6b',
              borderRadius: 1,
              cursor: 'pointer',
              '&:hover': { bgcolor: 'rgba(255, 107, 107, 0.1)' }
            }}
            onClick={() => setSelectedDashboard(11)}
          >
            <Typography variant="body2" sx={{ color: '#ff6b6b' }}>
              Burning
            </Typography>
          </Box>
          <Box
            sx={{
              px: 2,
              py: 1,
              border: '1px solid #9b59b6',
              borderRadius: 1,
              cursor: 'pointer',
              '&:hover': { bgcolor: 'rgba(155, 89, 182, 0.1)' }
            }}
            onClick={() => setSelectedDashboard(14)}
          >
            <Typography variant="body2" sx={{ color: '#9b59b6' }}>
              🌐 Metaverse
            </Typography>
          </Box>
        </Box>
      </Box>

      <Card
        sx={{
          background: 'rgba(25, 25, 25, 0.95)',
          border: '2px solid #00ffff',
          borderRadius: 2,
          position: 'sticky',
          top: 0,
          zIndex: 1000,
          backdropFilter: 'blur(10px)',
        }}
      >
        <CardContent sx={{ py: 1 }}>
          <EconomicStatusBar />
        </CardContent>
      </Card>

      <Box sx={{ display: 'flex', flexGrow: 1 }}>
        <IconButton
          sx={{
            position: 'fixed',
            top: 16,
            left: 16,
            zIndex: 1200,
            background: 'rgba(0, 212, 255, 0.1)',
            border: '1px solid #00ffff',
            color: '#00ffff',
            '&:hover': {
              background: 'rgba(0, 212, 255, 0.2)',
            },
          }}
          onClick={handleSidebarToggle}
        >
          {sidebarOpen ? <ChevronLeftIcon /> : <MenuIcon />}
        </IconButton>

        <Drawer
          variant="persistent"
          anchor="left"
          open={sidebarOpen}
          sx={{
            width: 320,
            flexShrink: 0,
            '& .MuiDrawer-paper': {
              width: 320,
              boxSizing: 'border-box',
              background: 'linear-gradient(135deg, rgba(26, 42, 68, 0.95) 0%, rgba(0, 0, 0, 0.95) 100%)',
              borderRight: '2px solid #00ffff',
              boxShadow: '0 0 20px rgba(0, 212, 255, 0.3)',
              backdropFilter: 'blur(10px)',
            },
          }}
        >
          <FuturisticSidebar onDashboardChange={handleDashboardChange} selectedDashboard={selectedDashboard} />
        </Drawer>

        <Box
          component="main"
          sx={{
            flexGrow: 1,
            p: 3,
            bgcolor: '#121212',
            marginLeft: sidebarOpen ? '320px' : 0,
            transition: 'margin-left 0.3s ease',
          }}
        >
          <Container maxWidth="xl">
            {renderDashboardContent()}
          </Container>
        </Box>
      </Box>
    </Box>
  );
} 