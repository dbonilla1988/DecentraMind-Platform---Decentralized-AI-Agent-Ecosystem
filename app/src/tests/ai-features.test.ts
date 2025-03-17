import { aiService } from '../services/ai/ai-service';
import { testUtils } from '../utils/test-utils';
import { testConfig } from '../config/test-config';

describe('AI Features Integration Tests', () => {
    jest.setTimeout(30000); // 30 seconds timeout for AI operations

    describe('Text Generation', () => {
        it('should generate text from a prompt', async () => {
            const prompt = testUtils.getRandomTestPrompt('text');
            const result = await aiService.generateText(prompt);
            expect(await testUtils.validateApiResponse(result, 'text')).toBe(true);
        });

        it('should handle empty prompts', async () => {
            await expect(aiService.generateText('')).rejects.toThrow();
        });
    });

    describe('Image Generation', () => {
        it('should generate an image from a prompt', async () => {
            const prompt = testUtils.getRandomTestPrompt('image');
            const result = await aiService.generateImage(prompt);
            expect(await testUtils.validateApiResponse(result, 'image')).toBe(true);
        });

        it('should return a valid image URL', async () => {
            const prompt = testUtils.getRandomTestPrompt('image');
            const imageUrl = await aiService.generateImage(prompt);
            expect(await testUtils.validateImageUrl(imageUrl)).toBe(true);
        });
    });

    describe('Image Analysis', () => {
        it('should analyze a valid image URL', async () => {
            const imageUrl = testConfig.mockData.imageUrls[0];
            const result = await aiService.analyzeImage(imageUrl);
            expect(await testUtils.validateApiResponse(result, 'analysis')).toBe(true);
        });

        it('should reject invalid image URLs', async () => {
            await expect(aiService.analyzeImage('invalid-url')).rejects.toThrow();
        });
    });
}); 