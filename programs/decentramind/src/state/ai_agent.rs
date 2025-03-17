use anchor_lang::prelude::*;

#[account]
pub struct AIAgent {
    pub owner: Pubkey,
    pub intelligence_level: u8,
    pub training_points: u64,
    pub last_training: i64,
    pub specialization: AISpecialization,
    pub performance_score: u64,
    pub tasks_completed: u64,
    pub reputation_score: u64,
    pub llm_model_version: String,  // Version of LLM being used
    pub api_endpoint: String,       // AI service endpoint
}

#[derive(AnchorSerialize, AnchorDeserialize, Clone, PartialEq, Eq)]
pub enum AISpecialization {
    TextGeneration,
    CodeAssistant,
    DataAnalysis,
    ImageGeneration,
    TaskAutomation,
    Custom(String),
}

#[account]
pub struct AITask {
    pub agent: Pubkey,
    pub creator: Pubkey,
    pub status: TaskStatus,
    pub created_at: i64,
    pub completed_at: Option<i64>,
    pub reward: u64,
    pub performance_rating: Option<u8>,
    pub task_data: Vec<u8>,        // IPFS hash or direct data
    pub result_data: Option<Vec<u8>>,
}

#[derive(AnchorSerialize, AnchorDeserialize, Clone, PartialEq, Eq)]
pub enum TaskStatus {
    Created,
    InProgress,
    Completed,
    Failed,
}