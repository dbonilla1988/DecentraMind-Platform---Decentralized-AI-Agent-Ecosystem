import { aiService } from '../services/ai/ai-service';

describe('AI Service Tests', () => {
    describe('Text Generation', () => {
        it('should generate text successfully', async () => {
            const result = await aiService.generateText('Test prompt');
            expect(result).toBeTruthy();
            expect(typeof result).toBe('string');
        });
    });

    describe('Image Generation', () => {
        it('should generate image URL successfully', async () => {
            const result = await aiService.generateImage('Test image prompt');
            expect(result).toBeTruthy();
            expect(result).toMatch(/^https?:\/\//);
        });
    });

    describe('Image Analysis', () => {
        it('should analyze image successfully', async () => {
            const result = await aiService.analyzeImage('https://example.com/test-image.jpg');
            expect(result).toBeTruthy();
            expect(typeof result).toBe('string');
        });
    });
}); 