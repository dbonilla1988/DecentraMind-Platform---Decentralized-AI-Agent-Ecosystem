import React, { useState, useEffect } from 'react';
import {
    Box,
    Container,
    Typography,
    Grid,
    Card,
    CardContent,
    Button,
    TextField,
    Alert,
    CircularProgress,
    Chip,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    Stack,
    IconButton,
    Tooltip,
    MenuItem,
    Select,
    FormControl,
    InputLabel,
    FormGroup,
    FormControlLabel,
    Checkbox,
    Tab,
    Tabs,
    Paper,
    InputAdornment,
    Divider
} from '@mui/material';
import { motion } from 'framer-motion';
import CodeIcon from '@mui/icons-material/Code';
import SecurityIcon from '@mui/icons-material/Security';
import AccountBalanceWalletIcon from '@mui/icons-material/AccountBalanceWallet';
import { SolanaService } from '../services/solana-service';
import { WalletMultiButton } from '@solana/wallet-adapter-react-ui';
import { useWallet } from '@solana/wallet-adapter-react';
import { useConnection } from '@solana/wallet-adapter-react';
import TokenIcon from '@mui/icons-material/Token';
import AccountBalanceIcon from '@mui/icons-material/AccountBalance';
import StorageIcon from '@mui/icons-material/Storage';
import AddCircleIcon from '@mui/icons-material/AddCircle';
import CloseIcon from '@mui/icons-material/Close';
import SearchIcon from '@mui/icons-material/Search';
import SortIcon from '@mui/icons-material/Sort';
import FilterListIcon from '@mui/icons-material/FilterList';

const MotionCard = motion(Card);

interface ContractInfo {
    id: string;
    title: string;
    description: string;
    icon: React.ReactNode;
    status: string;
}

interface Proposal {
    id: string;
    title: string;
    description: string;
    votes: {
        for: number;
        against: number;
    };
    status: 'Active' | 'Completed' | 'Pending';
    endDate: string;
    type: 'governance' | 'technical' | 'treasury';
}

const mockProposals: Proposal[] = [
    {
        id: 'prop-1',
        title: 'Upgrade AI Model Parameters',
        description: 'Proposal to enhance the AI model accuracy by updating the training parameters and increasing the token rewards for quality data contributions.',
        votes: {
            for: 156,
            against: 23
        },
        status: 'Active',
        endDate: '2024-04-01',
        type: 'governance'
    },
    {
        id: 'prop-2',
        title: 'Implement Cross-Chain Bridge',
        description: 'Deploy a secure bridge to enable DMT token transfers between Solana and other major blockchains for increased liquidity.',
        votes: {
            for: 89,
            against: 45
        },
        status: 'Active',
        endDate: '2024-03-28',
        type: 'governance'
    }
];

interface CreateProposalForm {
    title: string;
    description: string;
    duration: number;
    type: 'governance' | 'technical' | 'treasury';
}

interface Filters {
    status: ('Active' | 'Completed' | 'Pending')[];
    type: ('governance' | 'technical' | 'treasury')[];
}

interface SortOption {
    field: 'votes' | 'endDate' | 'title';
    direction: 'asc' | 'desc';
}

const SmartContracts = () => {
    const { publicKey, connected, wallet } = useWallet();
    const { connection } = useConnection();
    const [loading, setLoading] = useState<string>('');
    const [result, setResult] = useState<string>('');
    const [error, setError] = useState<string>('');
    const [contractData, setContractData] = useState<any>({});
    const [openCreateDialog, setOpenCreateDialog] = useState(false);
    const [proposalForm, setProposalForm] = useState<CreateProposalForm>({
        title: '',
        description: '',
        duration: 7,
        type: 'governance'
    });
    const [filters, setFilters] = useState<Filters>({
        status: ['Active', 'Pending'],
        type: ['governance', 'technical', 'treasury']
    });
    const [searchTerm, setSearchTerm] = useState('');
    const [sortOption, setSortOption] = useState<SortOption>({
        field: 'votes',
        direction: 'desc'
    });
    const [selectedTab, setSelectedTab] = useState(0);

    const solanaService = new SolanaService(connection);

    const contracts: ContractInfo[] = [
        {
            id: 'token',
            title: 'DecentraMind Token (DMT)',
            description: 'Manage and interact with the DMT token contract',
            icon: <TokenIcon sx={{ fontSize: 40 }} />,
            status: 'Active'
        },
        {
            id: 'governance',
            title: 'Governance Contract',
            description: 'Participate in DAO voting and proposal creation',
            icon: <AccountBalanceIcon sx={{ fontSize: 40 }} />,
            status: 'Active'
        },
        {
            id: 'storage',
            title: 'Data Storage Contract',
            description: 'Manage decentralized data storage',
            icon: <StorageIcon sx={{ fontSize: 40 }} />,
            status: 'Active'
        }
    ];

    const containerVariants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: { staggerChildren: 0.1 }
        }
    };

    const cardVariants = {
        hidden: { y: 20, opacity: 0 },
        visible: {
            y: 0,
            opacity: 1,
            transition: { duration: 0.5 }
        },
        hover: {
            scale: 1.02,
            transition: { duration: 0.2 }
        }
    };

    const handleContractInteraction = async (contractId: string) => {
        if (!connected || !publicKey) {
            setError('Please connect your wallet first');
            return;
        }

        setLoading(contractId);
        setError('');
        setResult('');

        try {
            switch (contractId) {
                case 'token':
                    const balance = await solanaService.getTokenBalance(publicKey);
                    setContractData({
                        ...contractData,
                        token: { uiAmount: balance }
                    });
                    setResult(`Token balance: ${balance} DMT`);
                    break;

                case 'governance':
                    const proposals = await solanaService.getGovernanceProposals();
                    setContractData({
                        ...contractData,
                        governance: proposals
                    });
                    setResult(`Found ${proposals.length} active proposals`);
                    break;

                case 'storage':
                    const storageUsage = await solanaService.getStorageUsage(publicKey);
                    setContractData({
                        ...contractData,
                        storage: storageUsage.toFixed(2)
                    });
                    setResult(`Storage Usage: ${storageUsage.toFixed(2)} MB`);
                    break;
            }
        } catch (err) {
            setError('Failed to interact with contract: ' + (err as Error).message);
        } finally {
            setLoading('');
        }
    };

    const handleVote = async (proposalId: string, vote: boolean) => {
        if (!connected || !wallet) {
            setError('Please connect your wallet first');
            return;
        }

        setLoading(proposalId);
        setError('');
        setResult('');

        try {
            const signature = await solanaService.submitVote(proposalId, vote, wallet.adapter);
            setResult(`Vote submitted successfully! Transaction: ${signature}`);

            const updatedProposals = await solanaService.getGovernanceProposals();
            setContractData({
                ...contractData,
                governance: updatedProposals
            });
        } catch (err) {
            setError((err as Error).message);
        } finally {
            setLoading('');
        }
    };

    const handleCreateProposal = async () => {
        if (!connected || !wallet) {
            setError('Please connect your wallet first');
            return;
        }

        setLoading('create');
        try {
            await new Promise(resolve => setTimeout(resolve, 1000));

            const newProposal: Proposal = {
                id: 'prop-' + (mockProposals.length + 1),
                title: proposalForm.title,
                description: proposalForm.description,
                votes: {
                    for: 0,
                    against: 0
                },
                status: 'Active',
                endDate: new Date(Date.now() + proposalForm.duration * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
                type: proposalForm.type
            };

            mockProposals.unshift(newProposal);

            setResult('Proposal created successfully!');
            setOpenCreateDialog(false);
            setProposalForm({
                title: '',
                description: '',
                duration: 7,
                type: 'governance'
            });
        } catch (err) {
            setError('Failed to create proposal: ' + (err as Error).message);
        } finally {
            setLoading('');
        }
    };

    const handleExecuteProposal = async (proposalId: string) => {
        if (!connected || !wallet) {
            setError('Please connect your wallet first');
            return;
        }

        setLoading(`execute-${proposalId}`);
        try {
            // Simulate proposal execution
            await new Promise(resolve => setTimeout(resolve, 1500));
            const proposal = mockProposals.find(p => p.id === proposalId);
            if (proposal) {
                proposal.status = 'Completed';
                setResult(`Proposal "${proposal.title}" executed successfully!`);
            }
        } catch (err) {
            setError('Failed to execute proposal: ' + (err as Error).message);
        } finally {
            setLoading('');
        }
    };

    const filteredAndSortedProposals = React.useMemo(() => {
        return mockProposals
            .filter(proposal => {
                const matchesSearch = proposal.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                    proposal.description.toLowerCase().includes(searchTerm.toLowerCase());
                const matchesStatus = filters.status.includes(proposal.status);
                const matchesType = filters.type.includes(proposal.type);
                return matchesSearch && matchesStatus && matchesType;
            })
            .sort((a, b) => {
                const { field, direction } = sortOption;
                if (field === 'votes') {
                    const votesA = a.votes.for + a.votes.against;
                    const votesB = b.votes.for + b.votes.against;
                    return direction === 'desc' ? votesB - votesA : votesA - votesB;
                }
                if (field === 'endDate') {
                    return direction === 'desc'
                        ? new Date(b.endDate).getTime() - new Date(a.endDate).getTime()
                        : new Date(a.endDate).getTime() - new Date(b.endDate).getTime();
                }
                return direction === 'desc'
                    ? b.title.localeCompare(a.title)
                    : a.title.localeCompare(b.title);
            });
    }, [mockProposals, searchTerm, filters, sortOption]);

    const renderContractDetails = (contractId: string) => {
        if (!contractData[contractId]) return null;

        return (
            <Box sx={{ mt: 2 }}>
                {contractId === 'token' && (
                    <Typography variant="body2">
                        Balance: {contractData.token.uiAmount} DMT
                    </Typography>
                )}
                {contractId === 'governance' && (
                    <Box>
                        {contractData.governance.map((proposal: any) => (
                            <Box key={proposal.id} sx={{ mb: 2, p: 2, bgcolor: 'rgba(255,255,255,0.05)', borderRadius: 1 }}>
                                <Typography variant="body2" gutterBottom>
                                    {proposal.title} - {proposal.votes} votes
                                </Typography>
                                <Box sx={{ display: 'flex', gap: 1, mt: 1 }}>
                                    <Button
                                        size="small"
                                        variant="contained"
                                        color="success"
                                        onClick={() => handleVote(proposal.id, true)}
                                        disabled={loading === 'vote'}
                                    >
                                        For
                                    </Button>
                                    <Button
                                        size="small"
                                        variant="contained"
                                        color="error"
                                        onClick={() => handleVote(proposal.id, false)}
                                        disabled={loading === 'vote'}
                                    >
                                        Against
                                    </Button>
                                </Box>
                            </Box>
                        ))}
                    </Box>
                )}
                {contractId === 'storage' && (
                    <Typography variant="body2">
                        Storage Usage: {contractData.storage} MB
                    </Typography>
                )}
            </Box>
        );
    };

    const renderProposalCard = (proposal: Proposal) => {
        const totalVotes = proposal.votes.for + proposal.votes.against;
        const forPercentage = totalVotes > 0 ? (proposal.votes.for / totalVotes) * 100 : 0;
        const isVoting = loading === proposal.id;

        return (
            <Card
                sx={{
                    mb: 3,
                    background: 'rgba(255, 255, 255, 0.05)',
                    backdropFilter: 'blur(10px)',
                    border: '1px solid rgba(255, 255, 255, 0.1)'
                }}
            >
                <CardContent>
                    <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 2 }}>
                        <Typography variant="h6" component="h3">
                            {proposal.title}
                        </Typography>
                        <Chip
                            label={proposal.status}
                            color={proposal.status === 'Active' ? 'success' : 'default'}
                            size="small"
                        />
                    </Box>

                    <Typography variant="body2" sx={{ mb: 3 }}>
                        {proposal.description}
                    </Typography>

                    <Box sx={{ mb: 2 }}>
                        <Box sx={{
                            width: '100%',
                            height: '8px',
                            bgcolor: 'rgba(255, 0, 0, 0.2)',
                            borderRadius: '4px',
                            overflow: 'hidden'
                        }}>
                            <Box sx={{
                                width: `${forPercentage}%`,
                                height: '100%',
                                bgcolor: 'success.main',
                                transition: 'width 0.5s ease-in-out'
                            }} />
                        </Box>

                        <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 1 }}>
                            <Typography variant="caption">
                                For: {proposal.votes.for}
                            </Typography>
                            <Typography variant="caption">
                                Against: {proposal.votes.against}
                            </Typography>
                        </Box>
                    </Box>

                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <Typography variant="caption" color="text.secondary">
                            Ends: {new Date(proposal.endDate).toLocaleDateString()}
                        </Typography>

                        <Box sx={{ display: 'flex', gap: 1 }}>
                            <Button
                                variant="contained"
                                color="success"
                                size="small"
                                onClick={() => handleVote(proposal.id, true)}
                                disabled={!connected || isVoting}
                            >
                                {isVoting ? <CircularProgress size={20} /> : 'For'}
                            </Button>
                            <Button
                                variant="contained"
                                color="error"
                                size="small"
                                onClick={() => handleVote(proposal.id, false)}
                                disabled={!connected || isVoting}
                            >
                                {isVoting ? <CircularProgress size={20} /> : 'Against'}
                            </Button>
                        </Box>
                    </Box>
                </CardContent>
            </Card>
        );
    };

    const CreateProposalDialog = () => (
        <Dialog
            open={openCreateDialog}
            onClose={() => setOpenCreateDialog(false)}
            maxWidth="sm"
            fullWidth
        >
            <DialogTitle sx={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                background: 'linear-gradient(45deg, #2196F3 30%, #21CBF3 90%)',
                color: 'white'
            }}>
                Create New Proposal
                <IconButton
                    onClick={() => setOpenCreateDialog(false)}
                    sx={{ color: 'white' }}
                >
                    <CloseIcon />
                </IconButton>
            </DialogTitle>
            <DialogContent>
                <Stack spacing={3} sx={{ mt: 2 }}>
                    <TextField
                        label="Proposal Title"
                        fullWidth
                        value={proposalForm.title}
                        onChange={(e) => setProposalForm({ ...proposalForm, title: e.target.value })}
                        required
                    />
                    <TextField
                        label="Description"
                        fullWidth
                        multiline
                        rows={4}
                        value={proposalForm.description}
                        onChange={(e) => setProposalForm({ ...proposalForm, description: e.target.value })}
                        required
                    />
                    <FormControl fullWidth>
                        <InputLabel>Proposal Type</InputLabel>
                        <Select
                            value={proposalForm.type}
                            label="Proposal Type"
                            onChange={(e) => setProposalForm({ ...proposalForm, type: e.target.value as any })}
                        >
                            <MenuItem value="governance">Governance</MenuItem>
                            <MenuItem value="technical">Technical</MenuItem>
                            <MenuItem value="treasury">Treasury</MenuItem>
                        </Select>
                    </FormControl>
                    <TextField
                        label="Duration (days)"
                        type="number"
                        fullWidth
                        value={proposalForm.duration}
                        onChange={(e) => setProposalForm({ ...proposalForm, duration: parseInt(e.target.value) })}
                        InputProps={{ inputProps: { min: 1, max: 30 } }}
                    />
                </Stack>
            </DialogContent>
            <DialogActions sx={{ p: 3 }}>
                <Button
                    onClick={() => setOpenCreateDialog(false)}
                    color="inherit"
                >
                    Cancel
                </Button>
                <Button
                    onClick={handleCreateProposal}
                    variant="contained"
                    disabled={!proposalForm.title || !proposalForm.description || loading === 'create'}
                    sx={{
                        background: 'linear-gradient(45deg, #2196F3 30%, #21CBF3 90%)',
                    }}
                >
                    {loading === 'create' ? <CircularProgress size={24} /> : 'Create Proposal'}
                </Button>
            </DialogActions>
        </Dialog>
    );

    const FilterSection = () => (
        <Paper sx={{ p: 2, mb: 3, background: 'rgba(255, 255, 255, 0.05)' }}>
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <FilterListIcon sx={{ mr: 1 }} />
                <Typography variant="h6">Filters</Typography>
            </Box>
            <Grid container spacing={2}>
                <Grid item xs={12} md={6}>
                    <FormGroup>
                        <Typography variant="subtitle2" sx={{ mb: 1 }}>Status</Typography>
                        {['Active', 'Completed', 'Pending'].map((status) => (
                            <FormControlLabel
                                key={status}
                                control={
                                    <Checkbox
                                        checked={filters.status.includes(status as any)}
                                        onChange={(e) => {
                                            if (e.target.checked) {
                                                setFilters(prev => ({
                                                    ...prev,
                                                    status: [...prev.status, status as any]
                                                }));
                                            } else {
                                                setFilters(prev => ({
                                                    ...prev,
                                                    status: prev.status.filter(s => s !== status)
                                                }));
                                            }
                                        }}
                                    />
                                }
                                label={status}
                            />
                        ))}
                    </FormGroup>
                </Grid>
                <Grid item xs={12} md={6}>
                    <FormGroup>
                        <Typography variant="subtitle2" sx={{ mb: 1 }}>Type</Typography>
                        {['governance', 'technical', 'treasury'].map((type) => (
                            <FormControlLabel
                                key={type}
                                control={
                                    <Checkbox
                                        checked={filters.type.includes(type as any)}
                                        onChange={(e) => {
                                            if (e.target.checked) {
                                                setFilters(prev => ({
                                                    ...prev,
                                                    type: [...prev.type, type as any]
                                                }));
                                            } else {
                                                setFilters(prev => ({
                                                    ...prev,
                                                    type: prev.type.filter(t => t !== type)
                                                }));
                                            }
                                        }}
                                    />
                                }
                                label={type.charAt(0).toUpperCase() + type.slice(1)}
                            />
                        ))}
                    </FormGroup>
                </Grid>
            </Grid>
        </Paper>
    );

    return (
        <Container maxWidth="lg">
            <Box sx={{ py: 8 }}>
                <Typography
                    variant="h3"
                    component="h1"
                    gutterBottom
                    sx={{
                        textAlign: 'center',
                        background: 'linear-gradient(45deg, #2196F3 30%, #21CBF3 90%)',
                        WebkitBackgroundClip: 'text',
                        WebkitTextFillColor: 'transparent',
                        mb: 6
                    }}
                >
                    Governance Proposals
                </Typography>

                <Box sx={{
                    display: 'flex',
                    justifyContent: 'center',
                    gap: 2,
                    mb: 4
                }}>
                    <WalletMultiButton />
                    <Tooltip title="Create New Proposal">
                        <Button
                            variant="contained"
                            startIcon={<AddCircleIcon />}
                            onClick={() => setOpenCreateDialog(true)}
                            disabled={!connected}
                            sx={{
                                background: 'linear-gradient(45deg, #2196F3 30%, #21CBF3 90%)',
                            }}
                        >
                            Create Proposal
                        </Button>
                    </Tooltip>
                </Box>

                {error && (
                    <Alert severity="error" sx={{ mb: 4 }}>
                        {error}
                    </Alert>
                )}

                {result && (
                    <Alert severity="success" sx={{ mb: 4 }}>
                        {result}
                    </Alert>
                )}

                <Box sx={{ mb: 4 }}>
                    <TextField
                        fullWidth
                        placeholder="Search proposals..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        InputProps={{
                            startAdornment: (
                                <InputAdornment position="start">
                                    <SearchIcon />
                                </InputAdornment>
                            )
                        }}
                        sx={{ mb: 3 }}
                    />

                    <FilterSection />

                    <Box sx={{ mb: 3 }}>
                        <FormControl fullWidth>
                            <Select
                                value={`${sortOption.field}-${sortOption.direction}`}
                                onChange={(e) => {
                                    const [field, direction] = e.target.value.split('-');
                                    setSortOption({
                                        field: field as any,
                                        direction: direction as 'asc' | 'desc'
                                    });
                                }}
                                startAdornment={
                                    <InputAdornment position="start">
                                        <SortIcon />
                                    </InputAdornment>
                                }
                            >
                                <MenuItem value="votes-desc">Most Votes</MenuItem>
                                <MenuItem value="votes-asc">Least Votes</MenuItem>
                                <MenuItem value="endDate-desc">End Date (Newest)</MenuItem>
                                <MenuItem value="endDate-asc">End Date (Oldest)</MenuItem>
                                <MenuItem value="title-asc">Title (A-Z)</MenuItem>
                                <MenuItem value="title-desc">Title (Z-A)</MenuItem>
                            </Select>
                        </FormControl>
                    </Box>
                </Box>

                <Box sx={{ maxWidth: 800, mx: 'auto' }}>
                    {filteredAndSortedProposals.length === 0 ? (
                        <Alert severity="info">No proposals match your criteria</Alert>
                    ) : (
                        filteredAndSortedProposals.map(proposal => renderProposalCard(proposal))
                    )}
                </Box>

                <CreateProposalDialog />
            </Box>
        </Container>
    );
};

export default SmartContracts; 