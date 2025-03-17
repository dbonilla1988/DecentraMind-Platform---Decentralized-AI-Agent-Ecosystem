export const aiConfig = {
    openai: {
        modelVersion: 'gpt-3.5-turbo-instruct',
        imageSize: '512x512',
        maxTokens: 1000,
        temperature: 0.7,
    },
    endpoints: {
        textGeneration: '/api/ai/generate-text',
        imageGeneration: '/api/ai/generate-image',
        imageAnalysis: '/api/ai/analyze-image',
    },
    rateLimit: {
        requestsPerMinute: 60,
        tokensPerMinute: 10000,
    }
}; 