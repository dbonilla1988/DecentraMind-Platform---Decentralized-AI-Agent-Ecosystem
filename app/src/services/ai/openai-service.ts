import { Configuration, OpenAIApi } from 'openai';

const configuration = new Configuration({
    apiKey: process.env.NEXT_PUBLIC_OPENAI_API_KEY,
});

const openai = new OpenAIApi(configuration);

export const openAIService = {
    async generateText(prompt: string): Promise<string> {
        try {
            const response = await openai.createCompletion({
                model: "gpt-3.5-turbo-instruct",
                prompt: prompt,
                max_tokens: 1000,
                temperature: 0.7,
            });

            return response.data.choices[0]?.text || '';
        } catch (error) {
            console.error('OpenAI text generation error:', error);
            throw new Error('Failed to generate text');
        }
    },

    async generateImage(prompt: string): Promise<string> {
        try {
            const response = await openai.createImage({
                prompt: prompt,
                n: 1,
                size: "512x512",
            });

            return response.data.data[0]?.url || '';
        } catch (error) {
            console.error('OpenAI image generation error:', error);
            throw new Error('Failed to generate image');
        }
    }
}; 