// DAO Service for DecentraMind Governance
import { 
  Connection, 
  PublicKey, 
  Transaction, 
  SystemProgram,
  LAMPORTS_PER_SOL
} from '@solana/web3.js';
import { 
  collection, 
  addDoc, 
  getDocs, 
  getDoc, 
  doc, 
  updateDoc, 
  deleteDoc, 
  query, 
  where, 
  orderBy, 
  limit, 
  onSnapshot, 
  setDoc, 
  serverTimestamp,
  increment,
  Timestamp
} from 'firebase/firestore';
import { db } from '../lib/firebase';
import { tokenomicsService } from './tokenomicsService';

// DAO Configuration
export const DAO_CONFIG = {
  // Governance Token
  governanceToken: 'DMT',
  minVotingPower: 100, // Minimum DMT required to vote
  stakingBonus: 0.5, // 50% bonus for staked DMT
  
  // Proposal Requirements
  minProposalCreatorDMT: 1000,
  minEndorsements: 50,
  discussionPeriod: 3 * 24 * 60 * 60 * 1000, // 3 days
  timelockPeriod: 7 * 24 * 60 * 60 * 1000, // 7 days
  
  // Voting Periods (in days)
  votingPeriods: {
    platformDevelopment: 7,
    economicPolicy: 14,
    treasuryManagement: 10,
    governance: 21,
    emergency: 3
  },
  
  // Quorum Requirements (% of circulating DMT)
  quorumRequirements: {
    platformDevelopment: 0.05, // 5%
    economicPolicy: 0.10, // 10%
    treasuryManagement: 0.07, // 7%
    governance: 0.15, // 15%
    emergency: 0.03 // 3%
  },
  
  // Majority Requirements
  majorityRequirements: {
    standard: 0.50, // 50% + 1
    constitution: 0.66, // 66% + 1
    emergency: 0.75 // 75% + 1
  },
  
  // Treasury Configuration
  treasury: {
    multiSigThreshold: 3, // 3/5 guardians required
    maxGuardianSpending: 10000,
    maxCouncilSpending: 50000,
    maxEmergencySpending: 25000,
    timelockLargeTx: 7 * 24 * 60 * 60 * 1000 // 7 days for >100k DMT
  }
};

// DAO Interfaces
export interface Proposal {
  id: string;
  creator: string;
  creatorWallet: string;
  title: string;
  description: string;
  type: ProposalType;
  funding?: number;
  status: ProposalStatus;
  createdAt: string;
  discussionEnd: string;
  votingStart: string;
  votingEnd: string;
  executedAt?: string;
  quorum: number;
  majority: number;
  forVotes: number;
  againstVotes: number;
  abstainVotes: number;
  totalVotes: number;
  endorsements: string[];
  tags: string[];
  attachments?: string[];
  ipfsHash?: string;
}

export type ProposalType = 
  | 'platformDevelopment'
  | 'economicPolicy'
  | 'treasuryManagement'
  | 'governance'
  | 'emergency';

export type ProposalStatus = 
  | 'draft'
  | 'discussion'
  | 'voting'
  | 'passed'
  | 'failed'
  | 'executed'
  | 'cancelled';

export interface Vote {
  id: string;
  proposalId: string;
  voter: string;
  voterWallet: string;
  vote: 'for' | 'against' | 'abstain';
  votingPower: number;
  timestamp: string;
  transactionHash?: string;
}

export interface TreasuryTransaction {
  id: string;
  type: 'spending' | 'receiving' | 'investment' | 'emergency';
  amount: number;
  currency: 'DMT' | 'SOL';
  recipient: string;
  description: string;
  approvedBy: string[];
  timestamp: string;
  transactionHash?: string;
  status: 'pending' | 'approved' | 'executed' | 'rejected';
}

export interface GovernanceMetrics {
  totalProposals: number;
  activeProposals: number;
  totalVotes: number;
  activeVoters: number;
  treasuryBalance: number;
  averageParticipation: number;
  proposalSuccessRate: number;
  averageVotingPower: number;
}

export interface CouncilMember {
  id: string;
  wallet: string;
  name: string;
  role: 'guardian' | 'council' | 'member';
  dmtBalance: number;
  stakedAmount: number;
  votingPower: number;
  joinedAt: string;
  activeProposals: number;
  successfulProposals: number;
}

class DAOService {
  private static instance: DAOService;
  private connection: Connection;
  private proposals: Map<string, Proposal> = new Map();
  private votes: Map<string, Vote[]> = new Map();
  private treasuryTransactions: Map<string, TreasuryTransaction> = new Map();

  static getInstance(): DAOService {
    if (!DAOService.instance) {
      DAOService.instance = new DAOService();
    }
    return DAOService.instance;
  }

  constructor() {
    this.connection = new Connection(process.env.NEXT_PUBLIC_SOLANA_RPC_URL || 'https://api.devnet.solana.com');
  }

  // Proposal Management
  async createProposal(
    creator: string,
    creatorWallet: string,
    title: string,
    description: string,
    type: ProposalType,
    funding?: number,
    tags: string[] = []
  ): Promise<string> {
    try {
      console.log(`Creating proposal: ${title} by ${creatorWallet}`);

      // Validate creator requirements
      const creatorBalance = await tokenomicsService.getDmtBalance(creatorWallet);
      if (creatorBalance < DAO_CONFIG.minProposalCreatorDMT) {
        throw new Error(`Insufficient DMT balance. Required: ${DAO_CONFIG.minProposalCreatorDMT}, Current: ${creatorBalance}`);
      }

      // Calculate voting timeline
      const now = new Date();
      const discussionEnd = new Date(now.getTime() + DAO_CONFIG.discussionPeriod);
      const votingStart = discussionEnd;
      const votingEnd = new Date(votingStart.getTime() + (DAO_CONFIG.votingPeriods[type] * 24 * 60 * 60 * 1000));

      // Calculate quorum and majority requirements
      const quorum = await this.calculateQuorum(type);
      const majority = type === 'governance' ? DAO_CONFIG.majorityRequirements.constitution : 
                      type === 'emergency' ? DAO_CONFIG.majorityRequirements.emergency : 
                      DAO_CONFIG.majorityRequirements.standard;

      const proposal: Omit<Proposal, 'id'> = {
        creator,
        creatorWallet,
        title,
        description,
        type,
        funding,
        status: 'draft',
        createdAt: now.toISOString(),
        discussionEnd: discussionEnd.toISOString(),
        votingStart: votingStart.toISOString(),
        votingEnd: votingEnd.toISOString(),
        quorum,
        majority,
        forVotes: 0,
        againstVotes: 0,
        abstainVotes: 0,
        totalVotes: 0,
        endorsements: [],
        tags,
        ipfsHash: `ipfs_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
      };

      // Save to Firestore
      const docRef = await addDoc(collection(db, 'dao_proposals'), proposal);
      const proposalId = docRef.id;

      // Update local cache
      this.proposals.set(proposalId, { ...proposal, id: proposalId });

      console.log(`Proposal created successfully: ${proposalId}`);
      return proposalId;
    } catch (error) {
      console.error('Failed to create proposal:', error);
      throw error;
    }
  }

  async getProposal(proposalId: string): Promise<Proposal | null> {
    try {
      // Check cache first
      if (this.proposals.has(proposalId)) {
        return this.proposals.get(proposalId)!;
      }

      // Fetch from Firestore
      const docRef = doc(db, 'dao_proposals', proposalId);
      const docSnap = await getDoc(docRef);

      if (docSnap.exists()) {
        const proposal = { id: proposalId, ...docSnap.data() } as Proposal;
        this.proposals.set(proposalId, proposal);
        return proposal;
      }

      return null;
    } catch (error) {
      console.error('Failed to get proposal:', error);
      throw error;
    }
  }

  async getProposals(
    status?: ProposalStatus,
    type?: ProposalType,
    limit: number = 50
  ): Promise<Proposal[]> {
    try {
      let q = collection(db, 'dao_proposals');
      
      if (status) {
        q = query(q, where('status', '==', status));
      }
      
      if (type) {
        q = query(q, where('type', '==', type));
      }
      
      q = query(q, orderBy('createdAt', 'desc'), limit(limit));
      
      const querySnapshot = await getDocs(q);
      const proposals: Proposal[] = [];

      querySnapshot.forEach((doc) => {
        const proposal = { id: doc.id, ...doc.data() } as Proposal;
        proposals.push(proposal);
        this.proposals.set(doc.id, proposal);
      });

      return proposals;
    } catch (error) {
      console.error('Failed to get proposals:', error);
      throw error;
    }
  }

  async updateProposal(proposalId: string, updates: Partial<Proposal>): Promise<boolean> {
    try {
      const docRef = doc(db, 'dao_proposals', proposalId);
      await updateDoc(docRef, {
        ...updates,
        lastUpdated: serverTimestamp()
      });

      // Update cache
      const cached = this.proposals.get(proposalId);
      if (cached) {
        this.proposals.set(proposalId, { ...cached, ...updates });
      }

      return true;
    } catch (error) {
      console.error('Failed to update proposal:', error);
      throw error;
    }
  }

  async endorseProposal(proposalId: string, endorser: string): Promise<boolean> {
    try {
      const proposal = await this.getProposal(proposalId);
      if (!proposal) {
        throw new Error('Proposal not found');
      }

      if (proposal.status !== 'draft') {
        throw new Error('Can only endorse draft proposals');
      }

      if (proposal.endorsements.includes(endorser)) {
        throw new Error('Already endorsed this proposal');
      }

      const updatedEndorsements = [...proposal.endorsements, endorser];
      await this.updateProposal(proposalId, { endorsements: updatedEndorsements });

      // Check if proposal meets endorsement requirements
      if (updatedEndorsements.length >= DAO_CONFIG.minEndorsements) {
        await this.updateProposal(proposalId, { status: 'discussion' });
      }

      return true;
    } catch (error) {
      console.error('Failed to endorse proposal:', error);
      throw error;
    }
  }

  // Voting System
  async castVote(
    proposalId: string,
    voter: string,
    voterWallet: string,
    vote: 'for' | 'against' | 'abstain'
  ): Promise<string> {
    try {
      console.log(`Casting vote: ${vote} on proposal ${proposalId} by ${voterWallet}`);

      const proposal = await this.getProposal(proposalId);
      if (!proposal) {
        throw new Error('Proposal not found');
      }

      if (proposal.status !== 'voting') {
        throw new Error('Proposal is not in voting phase');
      }

      const now = new Date();
      if (now < new Date(proposal.votingStart) || now > new Date(proposal.votingEnd)) {
        throw new Error('Voting period is not active');
      }

      // Check if user already voted
      const existingVote = await this.getUserVote(proposalId, voterWallet);
      if (existingVote) {
        throw new Error('User has already voted on this proposal');
      }

      // Calculate voting power
      const votingPower = await this.calculateVotingPower(voterWallet);
      if (votingPower < DAO_CONFIG.minVotingPower) {
        throw new Error(`Insufficient voting power. Required: ${DAO_CONFIG.minVotingPower}, Current: ${votingPower}`);
      }

      // Create vote record
      const voteRecord: Omit<Vote, 'id'> = {
        proposalId,
        voter,
        voterWallet,
        vote,
        votingPower,
        timestamp: now.toISOString(),
        transactionHash: `vote_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
      };

      // Save to Firestore
      const docRef = await addDoc(collection(db, 'dao_votes'), voteRecord);
      const voteId = docRef.id;

      // Update proposal vote counts
      const voteCounts = await this.calculateVoteCounts(proposalId);
      await this.updateProposal(proposalId, voteCounts);

      // Check if proposal should be executed
      await this.checkProposalExecution(proposalId);

      console.log(`Vote cast successfully: ${voteId}`);
      return voteId;
    } catch (error) {
      console.error('Failed to cast vote:', error);
      throw error;
    }
  }

  async getUserVote(proposalId: string, voterWallet: string): Promise<Vote | null> {
    try {
      const q = query(
        collection(db, 'dao_votes'),
        where('proposalId', '==', proposalId),
        where('voterWallet', '==', voterWallet)
      );

      const querySnapshot = await getDocs(q);
      if (!querySnapshot.empty) {
        const doc = querySnapshot.docs[0];
        return { id: doc.id, ...doc.data() } as Vote;
      }

      return null;
    } catch (error) {
      console.error('Failed to get user vote:', error);
      throw error;
    }
  }

  async getProposalVotes(proposalId: string): Promise<Vote[]> {
    try {
      const q = query(
        collection(db, 'dao_votes'),
        where('proposalId', '==', proposalId),
        orderBy('timestamp', 'desc')
      );

      const querySnapshot = await getDocs(q);
      const votes: Vote[] = [];

      querySnapshot.forEach((doc) => {
        votes.push({ id: doc.id, ...doc.data() } as Vote);
      });

      return votes;
    } catch (error) {
      console.error('Failed to get proposal votes:', error);
      throw error;
    }
  }

  // Treasury Management
  async createTreasuryTransaction(
    type: TreasuryTransaction['type'],
    amount: number,
    currency: 'DMT' | 'SOL',
    recipient: string,
    description: string,
    approver: string
  ): Promise<string> {
    try {
      console.log(`Creating treasury transaction: ${type} ${amount} ${currency} to ${recipient}`);

      const transaction: Omit<TreasuryTransaction, 'id'> = {
        type,
        amount,
        currency,
        recipient,
        description,
        approvedBy: [approver],
        timestamp: new Date().toISOString(),
        status: 'pending'
      };

      // Save to Firestore
      const docRef = await addDoc(collection(db, 'dao_treasury'), transaction);
      const transactionId = docRef.id;

      this.treasuryTransactions.set(transactionId, { ...transaction, id: transactionId });

      console.log(`Treasury transaction created: ${transactionId}`);
      return transactionId;
    } catch (error) {
      console.error('Failed to create treasury transaction:', error);
      throw error;
    }
  }

  async approveTreasuryTransaction(transactionId: string, approver: string): Promise<boolean> {
    try {
      const transaction = this.treasuryTransactions.get(transactionId);
      if (!transaction) {
        throw new Error('Transaction not found');
      }

      if (transaction.status !== 'pending') {
        throw new Error('Transaction is not pending approval');
      }

      const updatedApprovers = [...transaction.approvedBy, approver];
      const approvalCount = updatedApprovers.length;

      let newStatus = 'pending';
      if (approvalCount >= DAO_CONFIG.treasury.multiSigThreshold) {
        newStatus = 'approved';
      }

      await updateDoc(doc(db, 'dao_treasury', transactionId), {
        approvedBy: updatedApprovers,
        status: newStatus
      });

      // Update cache
      this.treasuryTransactions.set(transactionId, {
        ...transaction,
        approvedBy: updatedApprovers,
        status: newStatus
      });

      return true;
    } catch (error) {
      console.error('Failed to approve treasury transaction:', error);
      throw error;
    }
  }

  async executeTreasuryTransaction(transactionId: string): Promise<boolean> {
    try {
      const transaction = this.treasuryTransactions.get(transactionId);
      if (!transaction) {
        throw new Error('Transaction not found');
      }

      if (transaction.status !== 'approved') {
        throw new Error('Transaction is not approved');
      }

      // Execute the transaction
      if (transaction.currency === 'DMT') {
        await tokenomicsService.transferDmt('treasury_wallet', transaction.recipient, transaction.amount);
      }

      // Update status
      await updateDoc(doc(db, 'dao_treasury', transactionId), {
        status: 'executed',
        executedAt: new Date().toISOString()
      });

      this.treasuryTransactions.set(transactionId, {
        ...transaction,
        status: 'executed',
        executedAt: new Date().toISOString()
      });

      return true;
    } catch (error) {
      console.error('Failed to execute treasury transaction:', error);
      throw error;
    }
  }

  // Utility Methods
  async calculateVotingPower(walletAddress: string): Promise<number> {
    try {
      const balance = await tokenomicsService.getDmtBalance(walletAddress);
      const stakingInfo = await tokenomicsService.getStakingInfo(walletAddress);
      
      const stakedAmount = stakingInfo?.stakedAmount || 0;
      const stakingBonus = stakedAmount * DAO_CONFIG.stakingBonus;
      
      return balance + stakingBonus;
    } catch (error) {
      console.error('Failed to calculate voting power:', error);
      return 0;
    }
  }

  async calculateQuorum(type: ProposalType): Promise<number> {
    try {
      // TODO: Get circulating supply from tokenomics service
      const circulatingSupply = 700_000_000; // 70% of total supply
      const quorumPercentage = DAO_CONFIG.quorumRequirements[type];
      return Math.floor(circulatingSupply * quorumPercentage);
    } catch (error) {
      console.error('Failed to calculate quorum:', error);
      return 0;
    }
  }

  async calculateVoteCounts(proposalId: string): Promise<Partial<Proposal>> {
    try {
      const votes = await this.getProposalVotes(proposalId);
      
      let forVotes = 0;
      let againstVotes = 0;
      let abstainVotes = 0;
      let totalVotes = 0;

      votes.forEach(vote => {
        const power = vote.votingPower;
        totalVotes += power;
        
        switch (vote.vote) {
          case 'for':
            forVotes += power;
            break;
          case 'against':
            againstVotes += power;
            break;
          case 'abstain':
            abstainVotes += power;
            break;
        }
      });

      return { forVotes, againstVotes, abstainVotes, totalVotes };
    } catch (error) {
      console.error('Failed to calculate vote counts:', error);
      return {};
    }
  }

  async checkProposalExecution(proposalId: string): Promise<void> {
    try {
      const proposal = await this.getProposal(proposalId);
      if (!proposal || proposal.status !== 'voting') return;

      const now = new Date();
      if (now < new Date(proposal.votingEnd)) return;

      // Check if quorum is met
      if (proposal.totalVotes < proposal.quorum) {
        await this.updateProposal(proposalId, { status: 'failed' });
        return;
      }

      // Check if majority is met
      const totalVotes = proposal.forVotes + proposal.againstVotes;
      const majorityThreshold = totalVotes * proposal.majority;

      if (proposal.forVotes > majorityThreshold) {
        await this.updateProposal(proposalId, { status: 'passed' });
      } else {
        await this.updateProposal(proposalId, { status: 'failed' });
      }
    } catch (error) {
      console.error('Failed to check proposal execution:', error);
    }
  }

  async getGovernanceMetrics(): Promise<GovernanceMetrics> {
    try {
      const proposals = await this.getProposals();
      const activeProposals = proposals.filter(p => p.status === 'voting' || p.status === 'discussion');
      
      // Calculate metrics
      const totalProposals = proposals.length;
      const totalVotes = proposals.reduce((sum, p) => sum + p.totalVotes, 0);
      const averageParticipation = totalProposals > 0 ? totalVotes / totalProposals : 0;
      const passedProposals = proposals.filter(p => p.status === 'passed').length;
      const proposalSuccessRate = totalProposals > 0 ? passedProposals / totalProposals : 0;

      return {
        totalProposals,
        activeProposals: activeProposals.length,
        totalVotes,
        activeVoters: 0, // TODO: Calculate unique voters
        treasuryBalance: 0, // TODO: Get from treasury service
        averageParticipation,
        proposalSuccessRate,
        averageVotingPower: 0 // TODO: Calculate average voting power
      };
    } catch (error) {
      console.error('Failed to get governance metrics:', error);
      throw error;
    }
  }

  // Proposal Lifecycle Management
  async startDiscussion(proposalId: string): Promise<boolean> {
    return this.updateProposal(proposalId, { status: 'discussion' });
  }

  async startVoting(proposalId: string): Promise<boolean> {
    return this.updateProposal(proposalId, { status: 'voting' });
  }

  async executeProposal(proposalId: string): Promise<boolean> {
    try {
      const proposal = await this.getProposal(proposalId);
      if (!proposal || proposal.status !== 'passed') {
        throw new Error('Proposal is not ready for execution');
      }

      // Execute the proposal based on type
      switch (proposal.type) {
        case 'treasuryManagement':
          if (proposal.funding) {
            await this.createTreasuryTransaction(
              'spending',
              proposal.funding,
              'DMT',
              proposal.creatorWallet,
              proposal.description,
              'dao_executor'
            );
          }
          break;
        // Add other proposal type executions
      }

      return this.updateProposal(proposalId, { 
        status: 'executed',
        executedAt: new Date().toISOString()
      });
    } catch (error) {
      console.error('Failed to execute proposal:', error);
      throw error;
    }
  }
}

// Export singleton instance
export const daoService = DAOService.getInstance(); 