use anchor_lang::prelude::*;

#[account]
pub struct GovernanceConfig {
    pub authority: Pubkey,
    pub proposal_threshold: u64,    // Min tokens to create proposal
    pub voting_period: i64,        // Voting duration
    pub execution_delay: i64,      // Time between approval and execution
    pub ai_consultation_required: bool, // Require AI analysis
    pub min_ai_power_level: u8,    // Min AI power to vote
}

#[account]
pub struct Proposal {
    pub proposer: Pubkey,
    pub title: String,
    pub description: String,
    pub status: ProposalStatus,
    pub yes_votes: u64,
    pub no_votes: u64,
    pub start_time: i64,
    pub end_time: i64,
    pub ai_analysis: Option<String>,    // AI's analysis of proposal
    pub execution_data: Vec<u8>,        // Instructions to execute
    pub votes: Vec<Vote>,
}

#[derive(AnchorSerialize, AnchorDeserialize, Clone, PartialEq, Eq)]
pub enum ProposalStatus {
    Active,
    Succeeded,
    Executed,
    Defeated,
    Cancelled,
} 