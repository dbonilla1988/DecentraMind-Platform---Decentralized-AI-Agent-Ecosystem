import { SubAgent } from '../utils/subAgentTypes';

export const careSubAgents: SubAgent[] = [
  {
    id: 'breathwork-tracker',
    name: 'Breathwork Tracker',
    description: 'Logs breathing sessions and syncs with wearables for comprehensive wellness tracking',
    parent: 'Care',
    model: 'NFT',
    price: 120,
    status: 'Available',
    features: [
      'Wearable device integration',
      'Breathing pattern analysis',
      'Session logging and tracking',
      'Wellness insights dashboard'
    ],
    icon: '🫁',
    category: 'Breathwork',
    metadataURI: 'ipfs://QmBreathworkTracker123'
  },
  {
    id: 'cold-plunge-coach',
    name: 'Cold Plunge Coach',
    description: 'Suggests optimal cold therapy protocols and maintains your wellness calendar',
    parent: 'Care',
    model: 'Subscription',
    subscriptionMonthly: 20,
    status: 'Available',
    features: [
      'Personalized cold therapy protocols',
      'Temperature and duration tracking',
      'Recovery optimization',
      'Calendar integration'
    ],
    icon: '🧊',
    category: 'Cold Therapy',
    metadataURI: 'ipfs://QmColdPlungeCoach456'
  },
  {
    id: 'sleep-ai',
    name: 'Sleep AI',
    description: 'Monitors sleep patterns via journal entries and AI analysis for optimal rest',
    parent: 'Care',
    model: 'TokenUnlock',
    tokenRequirement: 3000,
    status: 'ComingSoon',
    features: [
      'Sleep pattern analysis',
      'AI-powered sleep coaching',
      'Journal entry processing',
      'Rest optimization recommendations'
    ],
    icon: '😴',
    category: 'Sleep Optimization',
    metadataURI: 'ipfs://QmSleepAI789'
  },
  {
    id: 'nutrition-coach',
    name: 'Nutrition Coach',
    description: 'AI-powered nutrition guidance with meal planning and macro tracking',
    parent: 'Care',
    model: 'Subscription',
    subscriptionMonthly: 30,
    status: 'Available',
    features: [
      'Personalized meal planning',
      'Macro and micronutrient tracking',
      'Dietary restriction management',
      'Grocery list generation'
    ],
    icon: '🥗',
    category: 'Nutrition',
    metadataURI: 'ipfs://QmNutritionCoach101'
  },
  {
    id: 'meditation-guide',
    name: 'Meditation Guide',
    description: 'Personalized meditation sessions with progress tracking and mindfulness insights',
    parent: 'Care',
    model: 'NFT',
    price: 150,
    status: 'Available',
    features: [
      'Guided meditation sessions',
      'Progress tracking and analytics',
      'Mindfulness insights',
      'Stress level monitoring'
    ],
    icon: '🧘',
    category: 'Meditation',
    metadataURI: 'ipfs://QmMeditationGuide202'
  },
  {
    id: 'fitness-tracker',
    name: 'Fitness Tracker',
    description: 'Comprehensive fitness monitoring with workout optimization and recovery tracking',
    parent: 'Care',
    model: 'TokenUnlock',
    tokenRequirement: 4000,
    status: 'ComingSoon',
    features: [
      'Workout optimization algorithms',
      'Recovery time tracking',
      'Performance analytics',
      'Injury prevention insights'
    ],
    icon: '💪',
    category: 'Fitness',
    metadataURI: 'ipfs://QmFitnessTracker303'
  }
];

export const careConfig = {
  masterAgentId: 'care-orchestrator',
  masterAgentName: 'Care Orchestrator',
  subAgents: careSubAgents
};

















