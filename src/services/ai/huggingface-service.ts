const HUGGING_FACE_API_KEY = process.env.NEXT_PUBLIC_HF_API_KEY;

// Export the AgentId type so it can be imported
export type AgentId = 'research' | 'nft' | 'smart-contract';

interface ApiResponse {
    text: string;
    confidence: number;
}

const models: Record<AgentId, string> = {
    'research': "gpt2",
    'nft': "EleutherAI/gpt-neo-1.3B",
    'smart-contract': "facebook/bart-large-mnli"
};

const prompts: Record<AgentId, string> = {
    'research': 'Analyze the following topic in the context of blockchain and AI: ',
    'nft': 'Generate an NFT concept for: ',
    'smart-contract': 'Suggest smart contract architecture for: '
};

export const queryHuggingFace = async (
    agentId: AgentId,
    query: string
): Promise<ApiResponse> => {
    try {
        const fullPrompt = prompts[agentId] + query;
        const response = await fetch(
            `https://api-inference.huggingface.co/models/${models[agentId]}`,
            {
                method: "POST",
                headers: {
                    "Authorization": `Bearer ${HUGGING_FACE_API_KEY}`,
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ inputs: fullPrompt }),
            }
        );

        if (!response.ok) {
            throw new Error(`API Error: ${response.statusText}`);
        }

        const data = await response.json();

        return {
            text: data[0]?.generated_text || "No response generated",
            confidence: calculateConfidence(data)
        };
    } catch (error) {
        console.error("API Error:", error);
        throw error;
    }
};

// Calculate confidence based on response properties
const calculateConfidence = (data: any): number => {
    if (!data[0]) return 50; // Default confidence

    // You can implement more sophisticated confidence calculation
    // based on the model's output properties
    const text = data[0].generated_text || "";
    const length = text.length;

    // Simple confidence calculation based on response length
    return Math.min(Math.max(length / 10, 30), 95);
}; 