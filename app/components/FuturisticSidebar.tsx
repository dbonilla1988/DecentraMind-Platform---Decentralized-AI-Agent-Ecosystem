"use client";

import React from 'react';
import {
  Box,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Divider,
  Typography,
} from '@mui/material';
import {
  Home as HomeIcon,
  Chat as ChatIcon,
  Add as AddIcon,
  TrendingUp as TrendingUpIcon,
  AccountBalance as AccountBalanceIcon,
  RocketLaunch as RocketLaunchIcon,
  Psychology as PsychologyIcon,
  Dashboard as DashboardIcon,
  Timeline as TimelineIcon,
  Star as StarIcon,
  LocalFireDepartment as FireIcon,
  Store as StoreIcon,
  ViewInAr as ViewInArIcon,
  Engineering as EngineeringIcon,
} from '@mui/icons-material';

interface FuturisticSidebarProps {
  onDashboardChange: (index: number) => void;
  selectedDashboard: number;
}

const sidebarItems = [
  { name: 'Decentralized Productivity Hub', icon: <HomeIcon />, category: 'personal' },
  { name: 'Chat & Services Hub', icon: <ChatIcon />, category: 'personal' },
  { name: 'Agent Minting', icon: <AddIcon />, category: 'personal' },
  { name: 'Marketplace', icon: <StoreIcon />, category: 'personal' },
  { name: 'Staking & Rewards', icon: <TrendingUpIcon />, category: 'personal' },
  { name: 'DAO Governance', icon: <AccountBalanceIcon />, category: 'personal' },
  { name: 'IDO/ICO Launchpad', icon: <RocketLaunchIcon />, category: 'personal' },
  { name: 'Agent Management', icon: <PsychologyIcon />, category: 'personal' },
  { name: 'Multi-Domain Dashboard', icon: <DashboardIcon />, category: 'personal' },
  { name: 'History & Evolution Tracker', icon: <TimelineIcon />, category: 'personal' },
  { name: 'Subscription Management', icon: <StarIcon />, category: 'economic' },
  { name: 'Burning Analytics', icon: <FireIcon />, category: 'economic' },
  { name: 'Tokenomics Dashboard', icon: <AccountBalanceIcon />, category: 'economic' },
  { name: 'Professional Services', icon: <EngineeringIcon />, category: 'services' },
  { name: 'Metaverse Hub', icon: <ViewInArIcon />, category: 'future' },
];

const FuturisticSidebar: React.FC<FuturisticSidebarProps> = ({
  selectedDashboard,
  onDashboardChange,
}) => {
  return (
    <Box sx={{ p: 2 }}>
      <Box sx={{ mb: 3, textAlign: 'center' }}>
        <Typography variant="h5" sx={{ color: '#00ffff', fontWeight: 'bold', mb: 1, textShadow: '0 0 10px #00ffff' }}>
          DecentraMind
        </Typography>
        <Typography variant="body2" sx={{ color: 'rgba(255, 255, 255, 0.7)', fontSize: '12px' }}>
          AI-Powered Productivity Hub
        </Typography>
      </Box>

      <Divider sx={{ mb: 2, borderColor: 'rgba(0, 212, 255, 0.3)' }} />

      <List sx={{ p: 0 }}>
        {sidebarItems.map((item, index) => (
          <ListItem key={item.name} sx={{ p: 0, mb: 1 }}>
            <ListItemButton
              selected={selectedDashboard === index}
              onClick={() => onDashboardChange(index)}
              sx={{
                borderRadius: 1,
                mx: 1,
                minHeight: '64px',
                background: selectedDashboard === index
                  ? 'linear-gradient(135deg, rgba(0, 212, 255, 0.2) 0%, rgba(0, 212, 255, 0.1) 100%)'
                  : 'transparent',
                border: selectedDashboard === index
                  ? '1px solid #00ffff'
                  : '1px solid transparent',
                transition: 'all 0.3s ease',
                '&:hover': {
                  background: 'rgba(0, 212, 255, 0.1)',
                  border: '1px solid rgba(0, 212, 255, 0.5)',
                  transform: 'translateX(4px)',
                },
                '&.Mui-selected': {
                  background: 'linear-gradient(135deg, rgba(0, 212, 255, 0.3) 0%, rgba(0, 212, 255, 0.1) 100%)',
                  border: '1px solid #00ffff',
                  boxShadow: '0 0 10px rgba(0, 212, 255, 0.3)',
                },
              }}
            >
              <ListItemIcon
                sx={{
                  color: selectedDashboard === index ? '#00ffff' : 'rgba(255, 255, 255, 0.7)',
                  minWidth: '40px',
                  mr: 2,
                }}
              >
                {item.icon}
              </ListItemIcon>
              <ListItemText
                primary={item.name}
                secondary={item.category}
                primaryTypographyProps={{
                  sx: {
                    color: selectedDashboard === index ? '#00ffff' : 'white',
                    fontWeight: selectedDashboard === index ? 'bold' : 'normal',
                    fontSize: '14px',
                    lineHeight: 1.2,
                  },
                }}
                secondaryTypographyProps={{
                  sx: {
                    color: 'rgba(255, 255, 255, 0.6)',
                    fontSize: '11px',
                    lineHeight: 1.2,
                  },
                }}
              />
            </ListItemButton>
          </ListItem>
        ))}
      </List>

      <Divider sx={{ mt: 2, mb: 2, borderColor: 'rgba(0, 212, 255, 0.3)' }} />

      <Box sx={{ textAlign: 'center' }}>
        <Typography variant="caption" sx={{ color: 'rgba(255, 255, 255, 0.5)', fontSize: '10px' }}>
          Powered by AI & Blockchain
        </Typography>
      </Box>
    </Box>
  );
};

export default FuturisticSidebar; 