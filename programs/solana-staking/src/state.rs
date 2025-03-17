use anchor_lang::prelude::*;

#[account]
pub struct StakeAccount {
    pub owner: Pubkey,
    pub stake_amount: u64,
    pub stake_start_time: i64,
    pub last_claim_time: i64,
    pub reward_rate: u64,  // Rewards per second in base points (1/10000)
}

#[account]
pub struct StakePool {
    pub authority: Pubkey,
    pub total_staked: u64,
    pub reward_mint: Pubkey,
    pub stake_mint: Pubkey,
    pub stake_vault: Pubkey,
    pub reward_vault: Pubkey,
}

#[account]
pub struct DMTStakeAccount {
    pub owner: Pubkey,
    pub stake_amount: u64,
    pub stake_start_time: i64,
    pub last_claim_time: i64,
    pub reward_rate: u64,  // Rewards per second in base points (1/10000)
    pub ai_power_level: u8, // AI power level based on staking amount
    pub voting_power: u64,  // Governance voting power
    pub nft_boost: u8,     // Boost from owned AI NFTs
}

#[account]
pub struct DecentraMindPool {
    pub authority: Pubkey,
    pub total_staked: u64,
    pub dmt_mint: Pubkey,
    pub reward_mint: Pubkey,
    pub stake_vault: Pubkey,
    pub reward_vault: Pubkey,
    pub treasury_wallet: Pubkey,
    pub total_ai_power: u64,
    pub governance_threshold: u64,
}

#[account]
pub struct TreasuryDAO {
    pub authority: Pubkey,
    pub total_votes: u64,
    pub proposal_count: u64,
    pub min_proposal_threshold: u64,
    pub voting_period: i64,
}

#[account]
pub struct AIAgent {
    pub owner: Pubkey,
    pub intelligence_level: u8,
    pub training_points: u64,
    pub last_training: i64,
    pub specialization: [u8; 32], // AI agent specialization type
} 