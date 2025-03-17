use anchor_lang::prelude::*;
use anchor_spl::token::{self, Token, TokenAccount, Transfer};
use crate::state::*;
use crate::errors::*;

pub fn stake_dmt(ctx: Context<StakeDMT>, amount: u64) -> Result<()> {
    require!(amount > 0, DecentraMindError::InvalidAmount);

    let stake_account = &mut ctx.accounts.stake_account;
    let clock = Clock::get()?;

    // Transfer DMT tokens to stake vault
    let cpi_accounts = Transfer {
        from: ctx.accounts.user_token_account.to_account_info(),
        to: ctx.accounts.stake_vault.to_account_info(),
        authority: ctx.accounts.user.to_account_info(),
    };
    
    let cpi_program = ctx.accounts.token_program.to_account_info();
    let cpi_ctx = CpiContext::new(cpi_program, cpi_accounts);
    token::transfer(cpi_ctx, amount)?;

    // Calculate AI power level based on stake amount
    let ai_power = calculate_ai_power(amount);
    
    // Update stake account
    stake_account.owner = ctx.accounts.user.key();
    stake_account.stake_amount = amount;
    stake_account.stake_start_time = clock.unix_timestamp;
    stake_account.last_claim_time = clock.unix_timestamp;
    stake_account.reward_rate = 100; // 1% per day in base points
    stake_account.ai_power_level = ai_power;
    stake_account.voting_power = calculate_voting_power(amount, ai_power);

    // Update pool stats
    let pool = &mut ctx.accounts.decentramind_pool;
    pool.total_staked = pool.total_staked.checked_add(amount)
        .ok_or(DecentraMindError::MathOverflow)?;
    pool.total_ai_power = pool.total_ai_power.checked_add(ai_power as u64)
        .ok_or(DecentraMindError::MathOverflow)?;

    Ok(())
}

#[derive(Accounts)]
pub struct StakeDMT<'info> {
    #[account(mut)]
    pub user: Signer<'info>,
    
    #[account(
        init_if_needed,
        payer = user,
        space = 8 + std::mem::size_of::<DMTStakeAccount>(),
        seeds = [b"dmt_stake", user.key().as_ref()],
        bump
    )]
    pub stake_account: Account<'info, DMTStakeAccount>,
    
    #[account(mut)]
    pub decentramind_pool: Account<'info, DecentraMindPool>,
    
    #[account(mut)]
    pub user_token_account: Account<'info, TokenAccount>,
    
    #[account(mut)]
    pub stake_vault: Account<'info, TokenAccount>,
    
    pub token_program: Program<'info, Token>,
    pub system_program: Program<'info, System>,
}

// Helper functions
fn calculate_ai_power(amount: u64) -> u8 {
    // AI power levels:
    // 1-10: Basic AI capabilities
    // 11-20: Advanced AI features
    // 21-30: Expert AI systems
    match amount {
        0..=1000 => 1,
        1001..=5000 => 5,
        5001..=10000 => 10,
        10001..=50000 => 15,
        50001..=100000 => 20,
        _ => 30,
    }
}

fn calculate_voting_power(amount: u64, ai_power: u8) -> u64 {
    // Voting power = stake amount * AI power multiplier
    amount.checked_mul(ai_power as u64)
        .unwrap_or(u64::MAX)
} 