export const testConfig = {
    // API Endpoints
    apiEndpoints: {
        textGeneration: process.env.NEXT_PUBLIC_TEXT_GENERATION_API || '/api/generate-text',
        imageGeneration: process.env.NEXT_PUBLIC_IMAGE_GENERATION_API || '/api/generate-image',
        imageAnalysis: process.env.NEXT_PUBLIC_IMAGE_ANALYSIS_API || '/api/analyze-image'
    },

    // Test Data
    mockData: {
        textPrompts: [
            "Explain blockchain technology",
            "How does AI work?",
            "What is DecentraMind?"
        ],
        imagePrompts: [
            "A futuristic city with blockchain visualization",
            "Neural network abstract art",
            "Decentralized AI concept art"
        ],
        imageUrls: [
            "https://example.com/test-image-1.jpg",
            "https://example.com/test-image-2.jpg"
        ]
    },

    // Test Timeouts
    timeouts: {
        apiRequest: 5000, // 5 seconds
        renderWait: 1000  // 1 second
    }
}; 