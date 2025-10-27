/**
 * Agent AI Previews
 * Mock AI responses for agent previews
 */

export interface AgentPreview {
  agentId: string;
  previewText: string;
  capabilities: string[];
  exampleInteraction: string;
}

export const agentPreviews: Record<string, AgentPreview> = {
  "sleep-ai": {
    agentId: "sleep-ai",
    previewText: "Here's a personalized sleep analysis based on your patterns...",
    capabilities: [
      "Sleep pattern analysis",
      "Personalized sleep coaching",
      "Journal entry processing",
      "Rest optimization recommendations"
    ],
    exampleInteraction: "Based on your sleep journal, I recommend winding down 30 minutes earlier and avoiding screens 1 hour before bed. Your optimal sleep window appears to be 10:30 PM - 6:30 AM."
  },
  "nutrition-coach": {
    agentId: "nutrition-coach",
    previewText: "Let's build a high-protein meal plan around your fitness goals...",
    capabilities: [
      "Personalized meal planning",
      "Macro and micronutrient tracking",
      "Dietary restriction management",
      "Grocery list generation"
    ],
    exampleInteraction: "For your goal of building muscle, I suggest 1.6g protein per kg bodyweight. Here's today's meal plan: Breakfast - Greek yogurt with berries (25g protein), Lunch - Grilled chicken salad (35g protein), Dinner - Salmon with quinoa (40g protein)."
  },
  "meditation-guide": {
    agentId: "meditation-guide",
    previewText: "I'll guide you through a 10-minute mindfulness session...",
    capabilities: [
      "Guided meditation sessions",
      "Progress tracking and analytics",
      "Mindfulness insights",
      "Stress level monitoring"
    ],
    exampleInteraction: "Let's start with a breathing exercise. Inhale for 4 counts, hold for 4, exhale for 6. Focus on the sensation of air entering and leaving your nostrils. If your mind wanders, gently return to your breath without judgment."
  },
  "fitness-tracker": {
    agentId: "fitness-tracker",
    previewText: "Analyzing your workout data to optimize your training...",
    capabilities: [
      "Workout optimization algorithms",
      "Recovery time tracking",
      "Performance analytics",
      "Injury prevention insights"
    ],
    exampleInteraction: "Your heart rate variability suggests you're ready for a high-intensity workout today. I recommend focusing on compound movements: 3 sets of squats, 3 sets of deadlifts, and 2 sets of pull-ups. Rest 2-3 minutes between sets."
  },
  "breathwork-tracker": {
    agentId: "breathwork-tracker",
    previewText: "Let's sync your breathing patterns with your wellness goals...",
    capabilities: [
      "Wearable device integration",
      "Breathing pattern analysis",
      "Session logging and tracking",
      "Wellness insights dashboard"
    ],
    exampleInteraction: "Your breathing rate is optimal at 6 breaths per minute. Try the 4-7-8 technique: inhale for 4, hold for 7, exhale for 8. This activates your parasympathetic nervous system and reduces stress."
  },
  "cold-plunge-coach": {
    agentId: "cold-plunge-coach",
    previewText: "Here's your personalized cold therapy protocol...",
    capabilities: [
      "Personalized cold therapy protocols",
      "Temperature and duration tracking",
      "Recovery optimization",
      "Calendar integration"
    ],
    exampleInteraction: "Start with 2 minutes at 15°C, then gradually work down to 10°C for 3 minutes. Focus on controlled breathing and mental resilience. After your session, do 5 minutes of light movement to restore circulation."
  }
};

// Helper function to get agent preview
export const getAgentPreview = (agentId: string): AgentPreview | null => {
  return agentPreviews[agentId] || null;
};

// Mock AI preview function (replace with actual AI integration)
export const generateAgentPreview = async (agentId: string, userContext?: string): Promise<string> => {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 1000));
  
  const preview = getAgentPreview(agentId);
  if (!preview) {
    return "Agent preview not available.";
  }

  // In production, this would call OpenAI, Ollama, or another AI service
  return preview.exampleInteraction;
};

// Mock function for testing AI previews
export const testAgentPreview = (agentId: string): string => {
  const preview = getAgentPreview(agentId);
  return preview ? preview.exampleInteraction : "Preview not available for this agent.";
};
