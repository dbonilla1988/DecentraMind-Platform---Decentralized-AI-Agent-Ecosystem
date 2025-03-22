import React, { useState, useCallback, useEffect } from 'react';
import {
    Box, TextField, Typography, Card, CircularProgress,
    Button, Grid, Alert, Chip, IconButton, Dialog,
    DialogTitle, DialogContent, DialogActions, Tabs, Tab,
    Tooltip, LinearProgress
} from '@mui/material';
import SendIcon from '@mui/icons-material/Send';
import PsychologyIcon from '@mui/icons-material/Psychology';
import AutoFixHighIcon from '@mui/icons-material/AutoFixHigh';
import StrategyIcon from '@mui/icons-material/Lightbulb';
import AddIcon from '@mui/icons-material/Add';
import HistoryIcon from '@mui/icons-material/History';
import TokenIcon from '@mui/icons-material/Token';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';
import { OpenAIService } from '../services/ai/openai-service';
import { AgentNFTService } from '../services/nft/agent-nft-service';
import { Connection } from '@solana/web3.js';
import { useWallet } from '@solana/wallet-adapter-react';

// Enhanced Agent State Interface
interface AgentState extends BaseAgentState {
    specialization: string[];
    level: number;
    experience: number;
    nextLevelExp: number;
    mintStatus?: 'available' | 'minted' | 'locked';
    performance: {
        accuracy: number;
        speed: number;
        uniqueness: number;
    };
    history: QueryHistory[];
}

interface BaseAgentState {
    response: string;
    confidence: number;
    isLoading: boolean;
    error?: string;
    metadata?: {
        analysisTime: number;
        sources?: string[];
        relatedTopics?: string[];
    };
}

interface QueryHistory {
    query: string;
    response: string;
    timestamp: number;
    confidence: number;
}

const AIAgents: React.FC = () => {
    const [query, setQuery] = useState('');
    const [selectedTab, setSelectedTab] = useState(0);
    const [showHistory, setShowHistory] = useState(false);
    const [showMintDialog, setShowMintDialog] = useState(false);
    const [selectedAgent, setSelectedAgent] = useState<string | null>(null);
    const wallet = useWallet();
    const connection = new Connection(
        process.env.NEXT_PUBLIC_SOLANA_RPC_URL || 'https://api.devnet.solana.com'
    );
    const agentNFTService = new AgentNFTService(connection);

    // Enhanced agents state with more capabilities
    const [agents, setAgents] = useState<Record<string, AgentState>>({
        research: {
            response: '',
            confidence: 0,
            isLoading: false,
            specialization: ['Data Analysis', 'Academic Research'],
            level: 1,
            experience: 0,
            nextLevelExp: 100,
            mintStatus: 'available',
            performance: {
                accuracy: 85,
                speed: 90,
                uniqueness: 75
            },
            history: []
        },
        creative: {
            response: '',
            confidence: 0,
            isLoading: false,
            specialization: ['Innovation', 'Design Thinking'],
            level: 1,
            experience: 0,
            nextLevelExp: 100,
            mintStatus: 'available',
            performance: {
                accuracy: 70,
                speed: 95,
                uniqueness: 95
            },
            history: []
        },
        strategy: {
            response: '',
            confidence: 0,
            isLoading: false,
            specialization: ['Planning', 'Risk Analysis'],
            level: 1,
            experience: 0,
            nextLevelExp: 100,
            mintStatus: 'available',
            performance: {
                accuracy: 90,
                speed: 85,
                uniqueness: 80
            },
            history: []
        },
        technical: {
            response: '',
            confidence: 0,
            isLoading: false,
            specialization: ['Smart Contracts', 'Protocol Design'],
            level: 1,
            experience: 0,
            nextLevelExp: 100,
            mintStatus: 'locked',
            performance: {
                accuracy: 95,
                speed: 80,
                uniqueness: 85
            },
            history: []
        }
    });

    const openAIService = new OpenAIService();

    // Handle agent leveling up
    const handleExperienceGain = (agentType: string, expGain: number) => {
        setAgents(prev => {
            const agent = prev[agentType];
            const newExp = agent.experience + expGain;

            if (newExp >= agent.nextLevelExp) {
                return {
                    ...prev,
                    [agentType]: {
                        ...agent,
                        level: agent.level + 1,
                        experience: newExp - agent.nextLevelExp,
                        nextLevelExp: agent.nextLevelExp * 1.5,
                        performance: {
                            accuracy: Math.min(agent.performance.accuracy + 2, 100),
                            speed: Math.min(agent.performance.speed + 2, 100),
                            uniqueness: Math.min(agent.performance.uniqueness + 2, 100)
                        }
                    }
                };
            }

            return {
                ...prev,
                [agentType]: {
                    ...agent,
                    experience: newExp
                }
            };
        });
    };

    // Enhanced query submission with experience and history
    const handleQuerySubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!query.trim()) return;

        // Update loading states
        Object.keys(agents).forEach(agentType => {
            if (agents[agentType].mintStatus !== 'locked') {
                setAgents(prev => ({
                    ...prev,
                    [agentType]: {
                        ...prev[agentType],
                        isLoading: true
                    }
                }));
            }
        });

        try {
            const responses = await Promise.all(
                Object.keys(agents)
                    .filter(agentType => agents[agentType].mintStatus !== 'locked')
                    .map(agentType =>
                        openAIService.getAgentResponse(agentType, query)
                    )
            );

            responses.forEach((response, index) => {
                const agentType = Object.keys(agents).filter(
                    type => agents[type].mintStatus !== 'locked'
                )[index];

                // Calculate experience gain based on confidence
                const expGain = Math.round(response.confidence * 50);
                handleExperienceGain(agentType, expGain);

                // Update agent state with response and history
                setAgents(prev => ({
                    ...prev,
                    [agentType]: {
                        ...prev[agentType],
                        response: response.content,
                        confidence: response.confidence,
                        isLoading: false,
                        metadata: response.metadata,
                        history: [
                            {
                                query,
                                response: response.content,
                                timestamp: Date.now(),
                                confidence: response.confidence
                            },
                            ...prev[agentType].history
                        ].slice(0, 10) // Keep last 10 queries
                    }
                }));
            });
        } catch (error) {
            console.error('Error processing query:', error);
            Object.keys(agents).forEach(agentType => {
                if (agents[agentType].mintStatus !== 'locked') {
                    setAgents(prev => ({
                        ...prev,
                        [agentType]: {
                            ...prev[agentType],
                            isLoading: false,
                            error: 'Failed to process query. Please try again.'
                        }
                    }));
                }
            });
        }
    };

    // Render agent performance metrics
    const renderPerformanceMetrics = (agent: AgentState) => (
        <Box sx={{ mt: 2 }}>
            <Typography variant="subtitle2">Performance Metrics</Typography>
            <Grid container spacing={1}>
                <Grid item xs={4}>
                    <Tooltip title="Accuracy">
                        <Box>
                            <Typography variant="caption">Accuracy</Typography>
                            <LinearProgress
                                variant="determinate"
                                value={agent.performance.accuracy}
                                sx={{ height: 8, borderRadius: 4 }}
                            />
                        </Box>
                    </Tooltip>
                </Grid>
                <Grid item xs={4}>
                    <Tooltip title="Response Speed">
                        <Box>
                            <Typography variant="caption">Speed</Typography>
                            <LinearProgress
                                variant="determinate"
                                value={agent.performance.speed}
                                sx={{ height: 8, borderRadius: 4 }}
                            />
                        </Box>
                    </Tooltip>
                </Grid>
                <Grid item xs={4}>
                    <Tooltip title="Response Uniqueness">
                        <Box>
                            <Typography variant="caption">Uniqueness</Typography>
                            <LinearProgress
                                variant="determinate"
                                value={agent.performance.uniqueness}
                                sx={{ height: 8, borderRadius: 4 }}
                            />
                        </Box>
                    </Tooltip>
                </Grid>
            </Grid>
        </Box>
    );

    // Render agent level progress
    const renderLevelProgress = (agent: AgentState) => (
        <Box sx={{ mt: 2 }}>
            <Typography variant="subtitle2">
                Level {agent.level} ({agent.experience}/{agent.nextLevelExp} XP)
            </Typography>
            <LinearProgress
                variant="determinate"
                value={(agent.experience / agent.nextLevelExp) * 100}
                sx={{ height: 8, borderRadius: 4 }}
            />
        </Box>
    );

    const getAgentIcon = (agentType: string) => {
        switch (agentType) {
            case 'research':
                return <PsychologyIcon />;
            case 'creative':
                return <AutoFixHighIcon />;
            case 'strategy':
                return <StrategyIcon />;
            default:
                return <PsychologyIcon />;
        }
    };

    // Add new function for minting
    const handleMintAgent = async (agentType: string) => {
        if (!wallet.connected) {
            // Show connect wallet message
            return;
        }

        try {
            const agent = agents[agentType];
            const nftAddress = await agentNFTService.mintAgentNFT(
                agentType as AgentType,
                agent.performance,
                agent.level,
                agent.specialization
            );

            // Update agent status
            setAgents(prev => ({
                ...prev,
                [agentType]: {
                    ...prev[agentType],
                    mintStatus: 'minted',
                    nftAddress
                }
            }));

            // Show success message
        } catch (error) {
            console.error('Error minting agent:', error);
            // Show error message
        }
    };

    return (
        <Box sx={{ p: 3, maxWidth: 1200, margin: '0 auto' }}>
            <Typography variant="h4" gutterBottom sx={{ color: '#1a237e' }}>
                AI Agents Interface
            </Typography>
            <Typography variant="subtitle1" gutterBottom sx={{ color: '#455a64' }}>
                Interact with specialized AI agents for blockchain and AI solutions
            </Typography>

            <Box component="form" onSubmit={handleQuerySubmit} sx={{ mb: 4 }}>
                <Grid container spacing={2} alignItems="center">
                    <Grid item xs={10}>
                        <TextField
                            fullWidth
                            label="Enter your query"
                            value={query}
                            onChange={(e) => setQuery(e.target.value)}
                            variant="outlined"
                            sx={{
                                backgroundColor: 'white',
                                '& .MuiOutlinedInput-root': {
                                    '&:hover fieldset': {
                                        borderColor: '#1a237e',
                                    },
                                }
                            }}
                        />
                    </Grid>
                    <Grid item xs={2}>
                        <Button
                            type="submit"
                            variant="contained"
                            fullWidth
                            disabled={!query.trim()}
                            sx={{
                                height: '56px',
                                backgroundColor: '#1a237e',
                                '&:hover': {
                                    backgroundColor: '#0d47a1',
                                }
                            }}
                            endIcon={<SendIcon />}
                        >
                            Ask
                        </Button>
                    </Grid>
                </Grid>
            </Box>

            <Grid container spacing={3}>
                {Object.entries(agents).map(([agentType, agent]) => (
                    <Grid item xs={12} md={4} key={agentType}>
                        <Card sx={{
                            p: 3,
                            height: '100%',
                            backgroundColor: agent.mintStatus === 'locked' ? '#f0f0f0' : '#f5f5f5',
                            boxShadow: 3,
                            opacity: agent.mintStatus === 'locked' ? 0.7 : 1,
                            '&:hover': {
                                boxShadow: 6,
                            }
                        }}>
                            <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
                                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                                    {getAgentIcon(agentType)}
                                    <Typography variant="h6" sx={{ ml: 1, textTransform: 'capitalize' }}>
                                        {agentType} Agent
                                    </Typography>
                                </Box>
                                <Box>
                                    {agent.mintStatus === 'available' && (
                                        <Tooltip title="Mint this agent">
                                            <IconButton
                                                onClick={() => {
                                                    setSelectedAgent(agentType);
                                                    setShowMintDialog(true);
                                                }}
                                            >
                                                <TokenIcon />
                                            </IconButton>
                                        </Tooltip>
                                    )}
                                    <Tooltip title="View History">
                                        <IconButton
                                            onClick={() => {
                                                setSelectedAgent(agentType);
                                                setShowHistory(true);
                                            }}
                                        >
                                            <HistoryIcon />
                                        </IconButton>
                                    </Tooltip>
                                </Box>
                            </Box>

                            {renderLevelProgress(agent)}
                            {renderPerformanceMetrics(agent)}

                            {agent.isLoading ? (
                                <Box sx={{ display: 'flex', justifyContent: 'center', p: 3 }}>
                                    <CircularProgress />
                                </Box>
                            ) : agent.error ? (
                                <Alert severity="error">{agent.error}</Alert>
                            ) : (
                                <Box>
                                    <Typography variant="body1" sx={{ mb: 2, minHeight: '100px' }}>
                                        {agent.response || 'Waiting for query...'}
                                    </Typography>

                                    {agent.metadata?.relatedTopics && (
                                        <Box sx={{ mb: 2 }}>
                                            {agent.metadata.relatedTopics.map((topic, index) => (
                                                <Chip
                                                    key={index}
                                                    label={topic}
                                                    size="small"
                                                    sx={{ mr: 0.5, mb: 0.5 }}
                                                />
                                            ))}
                                        </Box>
                                    )}

                                    <Box sx={{ display: 'flex', alignItems: 'center', mt: 2 }}>
                                        <CircularProgress
                                            variant="determinate"
                                            value={agent.confidence * 100}
                                            size={24}
                                            sx={{ mr: 1 }}
                                        />
                                        <Typography variant="body2">
                                            {Math.round(agent.confidence * 100)}% confidence
                                        </Typography>
                                    </Box>
                                </Box>
                            )}
                        </Card>
                    </Grid>
                ))}
            </Grid>

            {/* History Dialog */}
            <Dialog
                open={showHistory}
                onClose={() => setShowHistory(false)}
                maxWidth="md"
                fullWidth
            >
                <DialogTitle>Query History</DialogTitle>
                <DialogContent>
                    {selectedAgent && agents[selectedAgent].history.map((item, index) => (
                        <Box key={index} sx={{ mb: 2, p: 2, bgcolor: '#f5f5f5', borderRadius: 1 }}>
                            <Typography variant="subtitle2">Query: {item.query}</Typography>
                            <Typography variant="body2">Response: {item.response}</Typography>
                            <Typography variant="caption">
                                Confidence: {Math.round(item.confidence * 100)}% |
                                {new Date(item.timestamp).toLocaleString()}
                            </Typography>
                        </Box>
                    ))}
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setShowHistory(false)}>Close</Button>
                </DialogActions>
            </Dialog>

            {/* Mint Dialog */}
            <Dialog
                open={showMintDialog}
                onClose={() => setShowMintDialog(false)}
            >
                <DialogTitle>Mint AI Agent NFT</DialogTitle>
                <DialogContent>
                    {selectedAgent && (
                        <Box>
                            <Typography variant="h6">
                                {selectedAgent.charAt(0).toUpperCase() + selectedAgent.slice(1)} Agent
                            </Typography>
                            <Typography variant="body1">
                                Level: {agents[selectedAgent].level}
                            </Typography>
                            <Typography variant="body2">
                                Specializations: {agents[selectedAgent].specialization.join(', ')}
                            </Typography>
                            {renderPerformanceMetrics(agents[selectedAgent])}

                            <Box sx={{ mt: 2 }}>
                                <Typography variant="h6">Evolution Potential</Typography>
                                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                                    {Object.values(AgentTier).map((tier, index) => (
                                        <Box
                                            key={tier}
                                            sx={{
                                                p: 1,
                                                border: '1px solid',
                                                borderColor: 'divider',
                                                borderRadius: 1,
                                                opacity: index <= agents[selectedAgent].level / 2 ? 1 : 0.5
                                            }}
                                        >
                                            <Typography variant="body2">{tier}</Typography>
                                            <LinearProgress
                                                variant="determinate"
                                                value={index <= agents[selectedAgent].level / 2 ? 100 : 0}
                                            />
                                        </Box>
                                    ))}
                                </Box>
                            </Box>

                            <Box sx={{ mt: 2 }}>
                                <Typography variant="h6">Governance Capabilities</Typography>
                                <Typography variant="body2">
                                    Voting Power: {Math.round(agents[selectedAgent].level * 5)}
                                </Typography>
                                <Typography variant="body2">
                                    Proposal Rights: {agents[selectedAgent].level >= 3 ? 'Yes' : 'No'}
                                </Typography>
                            </Box>
                        </Box>
                    )}
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setShowMintDialog(false)}>Cancel</Button>
                    <Button
                        variant="contained"
                        onClick={() => selectedAgent && handleMintAgent(selectedAgent)}
                        disabled={!wallet.connected}
                    >
                        {wallet.connected ? 'Mint Agent NFT' : 'Connect Wallet to Mint'}
                    </Button>
                </DialogActions>
            </Dialog>
        </Box>
    );
};

export default AIAgents; 