import React, { useState, useEffect } from 'react';
import { Box, TextField, Typography, Paper, CircularProgress, Chip, Button } from '@mui/material';
import { styled, keyframes } from '@mui/material/styles';
import AutoGraphIcon from '@mui/icons-material/AutoGraph';
import CreateIcon from '@mui/icons-material/Create';
import PsychologyIcon from '@mui/icons-material/Psychology';

const pulseAnimation = keyframes`
  0% { box-shadow: 0 0 0 0 rgba(0, 255, 255, 0.4); }
  70% { box-shadow: 0 0 0 10px rgba(0, 255, 255, 0); }
  100% { box-shadow: 0 0 0 0 rgba(0, 255, 255, 0); }
`;

const AgentCard = styled(Paper)(({ theme }) => ({
    background: 'rgba(10, 10, 31, 0.9)',
    backdropFilter: 'blur(10px)',
    borderRadius: theme.spacing(2),
    padding: theme.spacing(3),
    border: '1px solid rgba(0,255,255,0.1)',
    transition: 'all 0.3s ease-in-out',
    '&:hover': {
        transform: 'translateY(-5px)',
        animation: `${pulseAnimation} 2s infinite`,
    }
}));

interface AgentResponse {
    content: string;
    confidence: number;
    sources?: string[];
    recommendations?: string[];
}

interface Agent {
    type: 'research' | 'creative' | 'strategy';
    name: string;
    icon: React.ReactNode;
    description: string;
    specialties: string[];
    responseFormat: (query: string) => Promise<AgentResponse>;
}

const agents: Agent[] = [
    {
        type: 'research',
        name: 'Research Agent',
        icon: <AutoGraphIcon />,
        description: 'Analyzes blockchain and AI trends, provides data-driven insights',
        specialties: ['Market Analysis', 'Technology Trends', 'Risk Assessment'],
        responseFormat: async (query: string) => ({
            content: `Analysis Results:
                • Market Trends: Analysis of current blockchain market conditions
                • Technology Impact: Assessment of AI integration possibilities
                • Risk Evaluation: Potential challenges and mitigation strategies
                
                Based on your query "${query}", here are the key findings...`,
            confidence: Math.random() * 30 + 70,
            sources: [
                'Solana Network Data',
                'DecentraMind Analytics',
                'Market Research Reports',
                'Technical Documentation'
            ]
        })
    },
    {
        type: 'creative',
        name: 'Creative Agent',
        icon: <CreateIcon />,
        description: 'Generates innovative solutions for AI-blockchain integration',
        specialties: ['AI NFT Design', 'User Experience', 'Innovation Strategy'],
        responseFormat: async (query: string) => ({
            content: `Creative Solution:
                • Innovation Approach: Novel integration methods
                • Design Strategy: User-centric implementation
                • Feature Enhancement: Unique AI-powered capabilities
                
                For your query "${query}", here's the creative approach...`,
            confidence: Math.random() * 20 + 75,
            recommendations: [
                'AI NFT Evolution Features',
                'Interactive User Elements',
                'Gamification Strategies',
                'Visual Enhancement Ideas'
            ]
        })
    },
    {
        type: 'strategy',
        name: 'Strategy Agent',
        icon: <PsychologyIcon />,
        description: 'Develops optimization strategies for DecentraMind ecosystem',
        specialties: ['Resource Optimization', 'Growth Planning', 'Performance Analysis'],
        responseFormat: async (query: string) => ({
            content: `Strategic Recommendations:
                • Short-term Actions: Immediate implementation steps
                • Mid-term Goals: Development milestones
                • Long-term Vision: Strategic objectives
                
                Analyzing your query "${query}", here's the strategic plan...`,
            confidence: Math.random() * 25 + 70,
            recommendations: [
                'Governance Optimization',
                'Staking Efficiency',
                'Market Position Enhancement',
                'Community Growth Tactics'
            ]
        })
    }
];

const exampleQueries = [
    "How can we optimize DecentraMind's AI NFT evolution system?",
    "What are the best strategies for implementing AI governance?",
    "Analyze current market trends for AI-powered DAOs",
    "Suggest innovative features for AI agent evolution",
    "How can we improve staking rewards through AI optimization?"
];

const AIAgentsInterface: React.FC = () => {
    const [query, setQuery] = useState('');
    const [responses, setResponses] = useState<Record<string, AgentResponse | null>>({});
    const [isProcessing, setIsProcessing] = useState(false);
    const [activeAgents, setActiveAgents] = useState<string[]>([]);
    const [showExamples, setShowExamples] = useState(false);

    const handleQuery = async () => {
        if (!query.trim() || isProcessing) return;

        setIsProcessing(true);
        setResponses({});
        setActiveAgents(agents.map(a => a.type));

        try {
            await new Promise(resolve => setTimeout(resolve, 2000));

            const results = await Promise.all(
                agents.map(async (agent) => {
                    await new Promise(resolve => setTimeout(resolve, 1000));

                    const response = await agent.responseFormat(query);

                    switch (agent.type) {
                        case 'research':
                            response.content = `Research Analysis:
                                • Market Analysis: Current blockchain trends indicate ${query.includes('NFT') ? 'growing NFT adoption' : 'increasing DeFi integration'}
                                • Technical Assessment: AI integration opportunities in ${query.includes('governance') ? 'DAO governance' : 'system optimization'}
                                • Risk Analysis: Identified key challenges and opportunities
                                
                                Detailed Findings: ${response.content}`;
                            break;
                        case 'creative':
                            response.content = `Innovation Proposal:
                                • Creative Solution: Novel approach to ${query.includes('NFT') ? 'NFT evolution' : 'AI integration'}
                                • Implementation Strategy: Phased rollout with user feedback
                                • Feature Recommendations: Enhanced user experience elements
                                
                                Detailed Approach: ${response.content}`;
                            break;
                        case 'strategy':
                            response.content = `Strategic Plan:
                                • Short-term Goals: Immediate implementation steps
                                • Growth Strategy: Scaling approach for ${query.includes('governance') ? 'governance system' : 'platform features'}
                                • Market Position: Competitive advantage analysis
                                
                                Detailed Strategy: ${response.content}`;
                            break;
                    }

                    return [agent.type, response] as [string, AgentResponse];
                })
            );

            setResponses(Object.fromEntries(results));
        } catch (error) {
            console.error('Error processing query:', error);
            setResponses(
                agents.reduce((acc, agent) => ({
                    ...acc,
                    [agent.type]: {
                        content: 'Error processing query. Please try again.',
                        confidence: 0,
                        recommendations: ['Retry query', 'Check connection', 'Contact support']
                    }
                }), {})
            );
        } finally {
            setIsProcessing(false);
        }
    };

    const handleExampleQuery = (example: string) => {
        setQuery(example);
        handleQuery();
    };

    return (
        <Box sx={{ p: 3 }}>
            <Typography variant="h4" sx={{ color: '#00ffff', mb: 3 }}>
                AI Agents Interface
            </Typography>

            <Box sx={{ mb: 4 }}>
                <TextField
                    fullWidth
                    multiline
                    rows={2}
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    placeholder="Enter your query (e.g., 'How can we optimize DecentraMind's governance system?')"
                    sx={{
                        '& .MuiOutlinedInput-root': {
                            color: '#fff',
                            '& fieldset': {
                                borderColor: 'rgba(0,255,255,0.3)',
                            },
                            '&:hover fieldset': {
                                borderColor: '#00ffff',
                            },
                        }
                    }}
                />
                <Box sx={{ display: 'flex', gap: 2, mt: 2 }}>
                    <Button
                        variant="contained"
                        onClick={handleQuery}
                        disabled={isProcessing || !query.trim()}
                        sx={{
                            background: 'linear-gradient(45deg, #00ffff, #ff00ff)',
                            color: '#fff',
                        }}
                    >
                        {isProcessing ? 'Processing...' : 'Analyze Query'}
                    </Button>
                    <Button
                        variant="outlined"
                        onClick={() => setShowExamples(!showExamples)}
                        sx={{
                            borderColor: 'rgba(0,255,255,0.3)',
                            color: '#fff',
                            '&:hover': {
                                borderColor: '#00ffff',
                            }
                        }}
                    >
                        {showExamples ? 'Hide Examples' : 'Show Examples'}
                    </Button>
                </Box>

                {showExamples && (
                    <Box sx={{ mt: 2 }}>
                        <Typography sx={{ color: '#fff', mb: 1 }}>
                            Example Queries:
                        </Typography>
                        <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                            {exampleQueries.map((example, index) => (
                                <Chip
                                    key={index}
                                    label={example}
                                    onClick={() => handleExampleQuery(example)}
                                    sx={{
                                        background: 'rgba(0,255,255,0.1)',
                                        color: '#fff',
                                        cursor: 'pointer',
                                        '&:hover': {
                                            background: 'rgba(0,255,255,0.2)',
                                        }
                                    }}
                                />
                            ))}
                        </Box>
                    </Box>
                )}
            </Box>

            <Box sx={{ display: 'flex', gap: 3, flexWrap: 'wrap' }}>
                {agents.map((agent) => (
                    <AgentCard key={agent.type} sx={{ flex: 1, minWidth: 300 }}>
                        <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                            <Box sx={{ color: '#00ffff', mr: 2 }}>{agent.icon}</Box>
                            <Typography variant="h6" sx={{ color: '#fff' }}>
                                {agent.name}
                            </Typography>
                        </Box>

                        <Typography sx={{ color: 'rgba(255,255,255,0.7)', mb: 2 }}>
                            {agent.description}
                        </Typography>

                        <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap', mb: 2 }}>
                            {agent.specialties.map((specialty, index) => (
                                <Chip
                                    key={index}
                                    label={specialty}
                                    size="small"
                                    sx={{
                                        background: 'rgba(0,255,255,0.1)',
                                        color: '#fff',
                                    }}
                                />
                            ))}
                        </Box>

                        {isProcessing && activeAgents.includes(agent.type) ? (
                            <Box sx={{ textAlign: 'center', py: 2 }}>
                                <CircularProgress
                                    size={40}
                                    sx={{
                                        color: '#00ffff',
                                        '& .MuiCircularProgress-circle': {
                                            strokeLinecap: 'round',
                                        }
                                    }}
                                />
                                <Typography sx={{ color: '#fff', mt: 2 }}>
                                    {`${agent.name} is analyzing your query...`}
                                </Typography>
                                <Typography sx={{ color: 'rgba(255,255,255,0.7)', fontSize: '0.9rem', mt: 1 }}>
                                    Processing specialized insights...
                                </Typography>
                            </Box>
                        ) : responses[agent.type] ? (
                            <Box>
                                <Typography
                                    sx={{
                                        color: '#fff',
                                        mb: 2,
                                        whiteSpace: 'pre-line',
                                        fontSize: '0.9rem',
                                        lineHeight: 1.6
                                    }}
                                >
                                    {responses[agent.type]?.content}
                                </Typography>
                                <Box sx={{
                                    display: 'flex',
                                    justifyContent: 'space-between',
                                    alignItems: 'center',
                                    mt: 2,
                                    p: 1,
                                    background: 'rgba(0,255,255,0.1)',
                                    borderRadius: 1
                                }}>
                                    <Typography sx={{ color: '#00ffff' }}>
                                        Confidence: {responses[agent.type]?.confidence.toFixed(1)}%
                                    </Typography>
                                    <Chip
                                        label={`${agent.type.charAt(0).toUpperCase() + agent.type.slice(1)} Analysis`}
                                        size="small"
                                        sx={{
                                            background: 'rgba(0,255,255,0.2)',
                                            color: '#fff',
                                        }}
                                    />
                                </Box>
                                {responses[agent.type]?.recommendations && (
                                    <Box sx={{ mt: 2 }}>
                                        <Typography sx={{ color: '#fff', mb: 1 }}>
                                            Recommendations:
                                        </Typography>
                                        {responses[agent.type]?.recommendations?.map((rec, index) => (
                                            <Chip
                                                key={index}
                                                label={rec}
                                                size="small"
                                                sx={{
                                                    m: 0.5,
                                                    background: 'rgba(0,255,255,0.1)',
                                                    color: '#fff',
                                                }}
                                            />
                                        ))}
                                    </Box>
                                )}
                            </Box>
                        ) : (
                            <Box sx={{ textAlign: 'center', py: 2 }}>
                                <Typography sx={{ color: 'rgba(255,255,255,0.5)' }}>
                                    Waiting for query...
                                </Typography>
                                <Typography sx={{ color: 'rgba(255,255,255,0.3)', fontSize: '0.8rem', mt: 1 }}>
                                    Enter your question above to get {agent.name.toLowerCase()} insights
                                </Typography>
                            </Box>
                        )}
                    </AgentCard>
                ))}
            </Box>
        </Box>
    );
};

export default AIAgentsInterface; 