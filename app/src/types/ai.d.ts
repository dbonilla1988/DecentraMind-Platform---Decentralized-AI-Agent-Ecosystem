import { PublicKey } from '@solana/web3.js';

export interface AIAgent {
    owner: PublicKey;
    intelligence_level: number;
    training_points: number;
    last_training: number;
    specialization: AISpecialization;
    performance_score: number;
    tasks_completed: number;
    reputation_score: number;
    llm_model_version: string;
    api_endpoint: string;
    visual_capabilities: VisualCapabilities;
    cognitive_abilities: CognitiveAbilities;
    training_history: TrainingHistory[];
    achievements: Achievement[];
}

export interface VisualCapabilities {
    image_recognition: number;
    object_detection: number;
    facial_recognition: number;
    scene_understanding: number;
    visual_generation: number;
    style_transfer: number;
}

export interface CognitiveAbilities {
    reasoning: number;
    learning_speed: number;
    memory_capacity: number;
    problem_solving: number;
    creativity_index: number;
    adaptation_rate: number;
}

export interface TrainingHistory {
    timestamp: number;
    training_type: TrainingType;
    performance_gain: number;
    skills_improved: string[];
    duration: number;
}

export interface Achievement {
    id: string;
    name: string;
    description: string;
    date_achieved: number;
    rarity: AchievementRarity;
    bonus_multiplier: number;
}

export enum AISpecialization {
    TextGeneration = 'TextGeneration',
    CodeAssistant = 'CodeAssistant',
    DataAnalysis = 'DataAnalysis',
    ImageGeneration = 'ImageGeneration',
    TaskAutomation = 'TaskAutomation',
    VisualRecognition = 'VisualRecognition',
    MultiModal = 'MultiModal',
    Custom = 'Custom'
}

export enum TrainingType {
    BasicLLM = 'BasicLLM',
    AdvancedReasoning = 'AdvancedReasoning',
    VisualProcessing = 'VisualProcessing',
    MultiModalFusion = 'MultiModalFusion',
    SpecializedTask = 'SpecializedTask'
}

export enum AchievementRarity {
    Common = 'Common',
    Rare = 'Rare',
    Epic = 'Epic',
    Legendary = 'Legendary'
}

export interface AITask {
    agent: PublicKey;
    creator: PublicKey;
    status: TaskStatus;
    created_at: number;
    completed_at?: number;
    reward: number;
    performance_rating?: number;
    task_data: Uint8Array;
    result_data?: Uint8Array;
}

export enum TaskStatus {
    Pending = 'Pending',
    InProgress = 'InProgress',
    Completed = 'Completed',
    Failed = 'Failed'
} 