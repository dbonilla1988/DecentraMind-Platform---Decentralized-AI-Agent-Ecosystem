// DAO Governance Service
export type ProposalType = 'governance' | 'treasury' | 'feature' | 'agent' | 'upgrade';
export type ProposalStatus = 'draft' | 'active' | 'passed' | 'rejected' | 'executed';

export const DAO_CONFIG = {
  minProposalCreatorDMT: 1000,
  minVotingPower: 100,
  proposalFee: 50,
  votingPeriod: 7 * 24 * 60 * 60 * 1000, // 7 days in milliseconds
  executionPeriod: 30 * 24 * 60 * 60 * 1000, // 30 days in milliseconds
  quorumThreshold: 0.1, // 10%
  supermajorityThreshold: 0.67, // 67%
};

export interface Proposal {
  id: string;
  title: string;
  description: string;
  type: 'governance' | 'treasury' | 'feature' | 'agent' | 'upgrade';
  status: 'draft' | 'active' | 'passed' | 'rejected' | 'executed';
  proposer: string;
  createdAt: Date;
  votingStart: Date;
  votingEnd: Date;
  executionDeadline?: Date;
  votes: {
    for: number;
    against: number;
    abstain: number;
  };
  totalVotes: number;
  quorum: number;
  requiredQuorum: number;
  executionData?: any;
  executionTxHash?: string;
}

export interface Vote {
  id: string;
  proposalId: string;
  voter: string;
  choice: 'for' | 'against' | 'abstain';
  weight: number;
  timestamp: Date;
  txHash?: string;
}

export interface GovernanceStats {
  totalProposals: number;
  activeProposals: number;
  passedProposals: number;
  totalVotes: number;
  participationRate: number;
  treasuryBalance: number;
  activeVoters: number;
}

export class DaoService {
  private proposals: Map<string, Proposal> = new Map();
  private votes: Map<string, Vote[]> = new Map();
  private userVotes: Map<string, Set<string>> = new Map(); // userId -> Set of proposalIds

  // Minimum requirements for proposal creation
  private readonly PROPOSAL_REQUIREMENTS = {
    MIN_DMT: 1000,
    MIN_DMTX: 10,
    MIN_STAKED_DMT: 500
  };

  // Minimum requirements for voting
  private readonly VOTING_REQUIREMENTS = {
    MIN_DMT: 100,
    MIN_DMTX: 1,
    MIN_STAKED_DMT: 50
  };

  // Check if user can create proposals
  async canCreateProposal(userId: string, userTier: any, tokenBalance: any): Promise<{
    canCreate: boolean;
    reason?: string;
    requirements: {
      dmt: { required: number; current: number; met: boolean };
      dmtx: { required: number; current: number; met: boolean };
      stakedDmt: { required: number; current: number; met: boolean };
    };
  }> {
    const dmtMet = tokenBalance.dmt >= this.PROPOSAL_REQUIREMENTS.MIN_DMT;
    const dmtxMet = tokenBalance.dmtx >= this.PROPOSAL_REQUIREMENTS.MIN_DMTX;
    const stakedMet = tokenBalance.dmtStaked >= this.PROPOSAL_REQUIREMENTS.MIN_STAKED_DMT;
    const tierMet = userTier.benefits.proposalRights;

    const canCreate = (dmtMet || dmtxMet || stakedMet) && tierMet;

    return {
      canCreate,
      reason: canCreate ? undefined : 'Insufficient tokens or tier requirements not met',
      requirements: {
        dmt: {
          required: this.PROPOSAL_REQUIREMENTS.MIN_DMT,
          current: tokenBalance.dmt,
          met: dmtMet
        },
        dmtx: {
          required: this.PROPOSAL_REQUIREMENTS.MIN_DMTX,
          current: tokenBalance.dmtx,
          met: dmtxMet
        },
        stakedDmt: {
          required: this.PROPOSAL_REQUIREMENTS.MIN_STAKED_DMT,
          current: tokenBalance.dmtStaked,
          met: stakedMet
        }
      }
    };
  }

  // Check if user can vote
  async canVote(userId: string, userTier: any, tokenBalance: any): Promise<{
    canVote: boolean;
    reason?: string;
    requirements: {
      dmt: { required: number; current: number; met: boolean };
      dmtx: { required: number; current: number; met: boolean };
      stakedDmt: { required: number; current: number; met: boolean };
    };
  }> {
    const dmtMet = tokenBalance.dmt >= this.VOTING_REQUIREMENTS.MIN_DMT;
    const dmtxMet = tokenBalance.dmtx >= this.VOTING_REQUIREMENTS.MIN_DMTX;
    const stakedMet = tokenBalance.dmtStaked >= this.VOTING_REQUIREMENTS.MIN_STAKED_DMT;
    const tierMet = userTier.benefits.daoVotingRights;

    const canVote = (dmtMet || dmtxMet || stakedMet) && tierMet;

    return {
      canVote,
      reason: canVote ? undefined : 'Insufficient tokens or tier requirements not met',
      requirements: {
        dmt: {
          required: this.VOTING_REQUIREMENTS.MIN_DMT,
          current: tokenBalance.dmt,
          met: dmtMet
        },
        dmtx: {
          required: this.VOTING_REQUIREMENTS.MIN_DMTX,
          current: tokenBalance.dmtx,
          met: dmtxMet
        },
        stakedDmt: {
          required: this.VOTING_REQUIREMENTS.MIN_STAKED_DMT,
          current: tokenBalance.dmtStaked,
          met: stakedMet
        }
      }
    };
  }

  // Calculate voting weight
  calculateVotingWeight(tokenBalance: any): number {
    const dmtWeight = tokenBalance.dmt * 1;
    const dmtxWeight = tokenBalance.dmtx * 10; // DMTX has 10x voting power
    const stakedWeight = tokenBalance.dmtStaked * 2; // Staked DMT has 2x voting power
    
    return dmtWeight + dmtxWeight + stakedWeight;
  }

  // Create a new proposal
  async createProposal(
    proposerId: string,
    title: string,
    description: string,
    type: Proposal['type'],
    executionData?: any
  ): Promise<{
    success: boolean;
    proposalId?: string;
    error?: string;
  }> {
    const proposalId = `prop_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    
    const proposal: Proposal = {
      id: proposalId,
        title,
        description,
        type,
        status: 'draft',
      proposer: proposerId,
      createdAt: new Date(),
      votingStart: new Date(Date.now() + 24 * 60 * 60 * 1000), // 24 hours from now
      votingEnd: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 days from now
      executionDeadline: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000), // 14 days from now
      votes: { for: 0, against: 0, abstain: 0 },
        totalVotes: 0,
      quorum: 0,
      requiredQuorum: 1000, // Minimum voting power required
      executionData
    };

        this.proposals.set(proposalId, proposal);
    this.votes.set(proposalId, []);

    return {
      success: true,
      proposalId
    };
  }

  // Activate a proposal (move from draft to active)
  async activateProposal(proposalId: string): Promise<{
    success: boolean;
    error?: string;
  }> {
    const proposal = this.proposals.get(proposalId);
    if (!proposal) {
      return { success: false, error: 'Proposal not found' };
      }

      if (proposal.status !== 'draft') {
      return { success: false, error: 'Proposal is not in draft status' };
    }

    proposal.status = 'active';
    this.proposals.set(proposalId, proposal);

    return { success: true };
  }

  // Cast a vote
  async castVote(
    proposalId: string,
    voterId: string,
    choice: 'for' | 'against' | 'abstain',
    tokenBalance: any
  ): Promise<{
    success: boolean;
    error?: string;
    voteWeight?: number;
  }> {
    const proposal = this.proposals.get(proposalId);
      if (!proposal) {
      return { success: false, error: 'Proposal not found' };
      }

    if (proposal.status !== 'active') {
      return { success: false, error: 'Proposal is not active for voting' };
      }

      const now = new Date();
    if (now < proposal.votingStart || now > proposal.votingEnd) {
      return { success: false, error: 'Voting period is not active' };
      }

      // Check if user already voted
    const userVotes = this.userVotes.get(voterId) || new Set();
    if (userVotes.has(proposalId)) {
      return { success: false, error: 'User has already voted on this proposal' };
    }

    const voteWeight = this.calculateVotingWeight(tokenBalance);
    if (voteWeight === 0) {
      return { success: false, error: 'Insufficient voting power' };
    }

    const vote: Vote = {
      id: `vote_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
        proposalId,
      voter: voterId,
      choice,
      weight: voteWeight,
      timestamp: new Date()
    };

    // Record vote
    const proposalVotes = this.votes.get(proposalId) || [];
    proposalVotes.push(vote);
    this.votes.set(proposalId, proposalVotes);

    // Update user votes
    userVotes.add(proposalId);
    this.userVotes.set(voterId, userVotes);

      // Update proposal vote counts
    proposal.votes[choice] += voteWeight;
    proposal.totalVotes += voteWeight;
    proposal.quorum = proposal.totalVotes;

    this.proposals.set(proposalId, proposal);

    return {
      success: true,
      voteWeight
    };
  }

  // Get all proposals
  getAllProposals(): Proposal[] {
    return Array.from(this.proposals.values()).sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());
  }

  // Get active proposals
  getActiveProposals(): Proposal[] {
    return this.getAllProposals().filter(p => p.status === 'active');
  }

  // Get proposal by ID
  getProposal(proposalId: string): Proposal | undefined {
    return this.proposals.get(proposalId);
  }

  // Get votes for a proposal
  getProposalVotes(proposalId: string): Vote[] {
    return this.votes.get(proposalId) || [];
  }

  // Get user's voting history
  getUserVotingHistory(userId: string): Vote[] {
    const allVotes: Vote[] = [];
    for (const votes of this.votes.values()) {
      allVotes.push(...votes.filter(v => v.voter === userId));
    }
    return allVotes.sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime());
  }

  // Check if user voted on proposal
  hasUserVoted(proposalId: string, userId: string): boolean {
    const userVotes = this.userVotes.get(userId) || new Set();
    return userVotes.has(proposalId);
  }

  // Get governance statistics
  getGovernanceStats(): GovernanceStats {
    const allProposals = this.getAllProposals();
    const activeProposals = allProposals.filter(p => p.status === 'active').length;
    const passedProposals = allProposals.filter(p => p.status === 'passed').length;
    
    const allVotes: Vote[] = [];
    for (const votes of this.votes.values()) {
      allVotes.push(...votes);
    }
    
    const uniqueVoters = new Set(allVotes.map(v => v.voter)).size;
    const totalVotes = allVotes.length;

      return {
      totalProposals: allProposals.length,
      activeProposals,
      passedProposals,
        totalVotes,
      participationRate: uniqueVoters > 0 ? (totalVotes / uniqueVoters) : 0,
      treasuryBalance: 1000000, // Mock treasury balance
      activeVoters: uniqueVoters
    };
  }

  // Execute a proposal (mock implementation)
  async executeProposal(proposalId: string): Promise<{
    success: boolean;
    txHash?: string;
    error?: string;
  }> {
    const proposal = this.proposals.get(proposalId);
    if (!proposal) {
      return { success: false, error: 'Proposal not found' };
    }

    if (proposal.status !== 'passed') {
      return { success: false, error: 'Proposal has not passed' };
    }

    // Mock execution
    proposal.status = 'executed';
    proposal.executionTxHash = `0x${Math.random().toString(16).substr(2, 64)}`;
    this.proposals.set(proposalId, proposal);

    return {
      success: true,
      txHash: proposal.executionTxHash
    };
  }
}

// Singleton instance
export const daoService = new DaoService();