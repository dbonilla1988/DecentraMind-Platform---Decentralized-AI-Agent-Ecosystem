import {
    Connection,
    PublicKey,
    Transaction,
    SystemProgram,
    LAMPORTS_PER_SOL,
    TransactionInstruction
} from '@solana/web3.js';
import { TOKEN_PROGRAM_ID } from '@solana/spl-token';

export class SolanaService {
    private connection: Connection;

    // Using actual devnet program IDs (you should replace these with your deployed program IDs)
    private static DMT_TOKEN_PROGRAM_ID = new PublicKey('TokenkegQfeZyiNwAJbNbGKPFXCWuBvf9Ss623VQ5DA');
    private static GOVERNANCE_PROGRAM_ID = new PublicKey('TokenkegQfeZyiNwAJbNbGKPFXCWuBvf9Ss623VQ5DA');
    private static STORAGE_PROGRAM_ID = new PublicKey('TokenkegQfeZyiNwAJbNbGKPFXCWuBvf9Ss623VQ5DA'); // Temporary, replace with your storage program ID

    constructor(connection: Connection) {
        this.connection = connection;
    }

    async getTokenBalance(walletAddress: PublicKey): Promise<number> {
        try {
            // For testing, return mock data
            return (await this.getMockData('token')).uiAmount;

            // Uncomment this when you have the actual token program
            /*const tokenAccounts = await this.connection.getParsedTokenAccountsByOwner(
                walletAddress,
                { programId: TOKEN_PROGRAM_ID }
            );
            
            const dmtAccount = tokenAccounts.value.find(
                account => account.account.data.parsed.info.mint === SolanaService.DMT_TOKEN_PROGRAM_ID.toString()
            );

            return dmtAccount ?
                parseInt(dmtAccount.account.data.parsed.info.tokenAmount.amount) / LAMPORTS_PER_SOL :
                0;*/
        } catch (error) {
            console.error('Error getting token balance:', error);
            throw error;
        }
    }

    async getGovernanceProposals(): Promise<any[]> {
        // Return mock proposals for testing
        return mockProposals;
    }

    async submitVote(proposalId: string, vote: boolean, wallet: any): Promise<string> {
        try {
            // For testing purposes, we'll simulate a successful vote
            // In production, this would interact with your actual governance program
            await new Promise(resolve => setTimeout(resolve, 1000));

            // Mock successful transaction
            const mockSignature = 'SimulatedVoteTx' + Math.random().toString(36).substring(7);

            // Update the mock proposals data
            const proposal = mockProposals.find(p => p.id === proposalId);
            if (proposal) {
                if (vote) {
                    proposal.votes.for += 1;
                } else {
                    proposal.votes.against += 1;
                }
            }

            return mockSignature;
        } catch (error) {
            console.error('Error submitting vote:', error);
            throw new Error('Failed to submit vote. Please try again.');
        }
    }

    async getStorageUsage(walletAddress: PublicKey): Promise<number> {
        try {
            const storageAccounts = await this.connection.getProgramAccounts(
                SolanaService.STORAGE_PROGRAM_ID,
                {
                    filters: [
                        {
                            memcmp: {
                                offset: 0,
                                bytes: walletAddress.toBase58()
                            }
                        }
                    ]
                }
            );

            // Calculate total storage used (simplified)
            return storageAccounts.reduce((total, account) => {
                return total + account.account.data.length;
            }, 0) / (1024 * 1024); // Convert to MB
        } catch (error) {
            console.error('Error getting storage usage:', error);
            throw error;
        }
    }

    async getMockData(contractId: string): Promise<any> {
        switch (contractId) {
            case 'token':
                return {
                    uiAmount: 1000
                };
            case 'governance':
                return [
                    {
                        id: '1',
                        title: 'Proposal #1',
                        description: 'Increase token rewards',
                        votes: 156
                    },
                    {
                        id: '2',
                        title: 'Proposal #2',
                        description: 'Update AI parameters',
                        votes: 89
                    }
                ];
            case 'storage':
                return 2.5; // MB
            default:
                return null;
        }
    }
}

// Move mockProposals here so it's accessible to the service
const mockProposals = [
    {
        id: 'prop-1',
        title: 'Upgrade AI Model Parameters',
        description: 'Proposal to enhance the AI model accuracy by updating the training parameters and increasing the token rewards for quality data contributions.',
        votes: {
            for: 156,
            against: 23
        },
        status: 'Active' as const,
        endDate: '2024-04-01'
    },
    {
        id: 'prop-2',
        title: 'Implement Cross-Chain Bridge',
        description: 'Deploy a secure bridge to enable DMT token transfers between Solana and other major blockchains for increased liquidity.',
        votes: {
            for: 89,
            against: 45
        },
        status: 'Active' as const,
        endDate: '2024-03-28'
    }
]; 