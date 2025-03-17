use anchor_lang::prelude::*;

#[account]
pub struct Treasury {
    pub authority: Pubkey,
    pub total_funds: u64,
    pub reward_rate: u64,          // Base reward rate
    pub ai_bonus_multiplier: u8,   // Bonus for AI performance
    pub staking_bonus_rate: u64,   // Additional rewards for stakers
    pub governance_allocation: u8,  // % allocated to governance
    pub development_allocation: u8, // % for development
}

#[account]
pub struct RewardDistribution {
    pub recipient: Pubkey,
    pub amount: u64,
    pub reward_type: RewardType,
    pub timestamp: i64,
    pub ai_power_bonus: u64,
    pub staking_bonus: u64,
} 