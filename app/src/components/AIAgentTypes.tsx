import React from 'react';
import { Box, Typography, Grid, Paper, Chip } from '@mui/material';
import { styled } from '@mui/material/styles';
import AutoGraphIcon from '@mui/icons-material/AutoGraph';
import SecurityIcon from '@mui/icons-material/Security';
import AccountBalanceIcon from '@mui/icons-material/AccountBalance';
import PsychologyIcon from '@mui/icons-material/Psychology';
import StorageIcon from '@mui/icons-material/Storage';
import CodeIcon from '@mui/icons-material/Code';

const AgentCard = styled(Paper)(({ theme }) => ({
    background: 'rgba(10, 10, 31, 0.9)',
    backdropFilter: 'blur(10px)',
    borderRadius: theme.spacing(2),
    padding: theme.spacing(3),
    border: '1px solid rgba(0,255,255,0.1)',
    transition: 'all 0.3s ease-in-out',
    '&:hover': {
        transform: 'translateY(-5px)',
        boxShadow: '0 10px 20px rgba(0,255,255,0.1)',
    }
}));

export const aiAgentTypes = {
    marketAnalyst: {
        icon: <AutoGraphIcon />,
        name: 'Market Analyst',
        description: 'Analyzes market trends and trading patterns',
        capabilities: ['Price Prediction', 'Volume Analysis', 'Trend Detection']
    },
    securityAuditor: {
        icon: <SecurityIcon />,
        name: 'Security Auditor',
        description: 'Monitors and audits smart contracts',
        capabilities: ['Vulnerability Detection', 'Risk Assessment', 'Security Optimization']
    },
    governanceSpecialist: {
        icon: <AccountBalanceIcon />,
        name: 'Governance Specialist',
        description: 'Manages DAO proposals and voting',
        capabilities: ['Proposal Analysis', 'Vote Optimization', 'Treasury Management']
    },
    dataScientist: {
        icon: <PsychologyIcon />,
        name: 'Data Scientist',
        description: 'Analyzes blockchain and AI data patterns',
        capabilities: ['Pattern Recognition', 'Predictive Analytics', 'Data Visualization']
    },
    storageOptimizer: {
        icon: <StorageIcon />,
        name: 'Storage Optimizer',
        description: 'Optimizes decentralized storage',
        capabilities: ['Data Compression', 'Storage Efficiency', 'Cost Optimization']
    },
    smartContractDev: {
        icon: <CodeIcon />,
        name: 'Smart Contract Developer',
        description: 'Develops and optimizes smart contracts',
        capabilities: ['Code Generation', 'Contract Optimization', 'Integration Testing']
    }
};

const AIAgentTypes: React.FC = () => {
    return (
        <Grid container spacing={3}>
            {Object.entries(aiAgentTypes).map(([key, agent]) => (
                <Grid item xs={12} sm={6} md={4} key={key}>
                    <AgentCard>
                        <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                            <Box sx={{
                                mr: 2,
                                color: '#00ffff',
                                transform: 'scale(1.5)'
                            }}>
                                {agent.icon}
                            </Box>
                            <Typography variant="h6" sx={{ color: '#fff' }}>
                                {agent.name}
                            </Typography>
                        </Box>
                        <Typography sx={{ color: 'rgba(255,255,255,0.7)', mb: 2 }}>
                            {agent.description}
                        </Typography>
                        <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                            {agent.capabilities.map((capability, index) => (
                                <Chip
                                    key={index}
                                    label={capability}
                                    size="small"
                                    sx={{
                                        background: 'rgba(0,255,255,0.1)',
                                        color: '#fff',
                                        border: '1px solid rgba(0,255,255,0.3)'
                                    }}
                                />
                            ))}
                        </Box>
                    </AgentCard>
                </Grid>
            ))}
        </Grid>
    );
};

export default AIAgentTypes; 