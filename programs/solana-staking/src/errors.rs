use anchor_lang::prelude::*;

#[error_code]
pub enum DecentraMindError {
    #[msg("Amount must be greater than zero")]
    InvalidAmount,
    
    #[msg("Insufficient DMT balance")]
    InsufficientDMTBalance,
    
    #[msg("Stake duration has not been met")]
    StakeDurationNotMet,
    
    #[msg("Invalid authority")]
    InvalidAuthority,
    
    #[msg("Math overflow")]
    MathOverflow,
    
    #[msg("Invalid AI power level")]
    InvalidAIPowerLevel,
    
    #[msg("Insufficient voting power")]
    InsufficientVotingPower,
    
    #[msg("Invalid NFT ownership")]
    InvalidNFTOwnership,
    
    #[msg("Treasury threshold not met")]
    TreasuryThresholdNotMet,
} 