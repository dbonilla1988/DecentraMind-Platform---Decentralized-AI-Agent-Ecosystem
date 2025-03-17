import { testConfig } from '../config/test-config';

export const testUtils = {
    async validateApiResponse(response: any, type: 'text' | 'image' | 'analysis'): Promise<boolean> {
        switch (type) {
            case 'text':
                return typeof response === 'string' && response.length > 0;
            case 'image':
                return typeof response === 'string' && response.startsWith('http');
            case 'analysis':
                return typeof response === 'string' && response.length > 0;
            default:
                return false;
        }
    },

    async simulateUserInput(input: string): Promise<void> {
        // Simulate user typing with a small delay
        return new Promise(resolve => setTimeout(resolve, 100));
    },

    async validateImageUrl(url: string): Promise<boolean> {
        try {
            const response = await fetch(url);
            const contentType = response.headers.get('content-type');
            return response.ok && (contentType?.startsWith('image/') || false);
        } catch {
            return false;
        }
    },

    getRandomTestPrompt(type: 'text' | 'image'): string {
        const prompts = type === 'text' ? testConfig.mockData.textPrompts : testConfig.mockData.imagePrompts;
        return prompts[Math.floor(Math.random() * prompts.length)];
    }
}; 