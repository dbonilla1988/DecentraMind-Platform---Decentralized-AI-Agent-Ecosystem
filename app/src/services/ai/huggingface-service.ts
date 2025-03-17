import axios from 'axios';

const HF_API_URL = 'https://api-inference.huggingface.co/models';
const HF_API_KEY = process.env.REACT_APP_HF_API_KEY || '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';

// Default models
const TEXT_MODEL = 'gpt2';
const IMAGE_MODEL = 'stabilityai/stable-diffusion-2';
const IMAGE_ANALYSIS_MODEL = 'google/vit-base-patch16-224';

export const huggingFaceService = {
    async generateText(prompt: string): Promise<string> {
        try {
            console.log('Generating text with prompt:', prompt);
            const response = await axios.post(
                `${HF_API_URL}/${TEXT_MODEL}`,
                { inputs: prompt },
                {
                    headers: {
                        'Authorization': `Bearer ${HF_API_KEY}`,
                        'Content-Type': 'application/json'
                    }
                }
            );
            console.log('Text generation response:', response.data);
            return response.data[0]?.generated_text || '';
        } catch (error) {
            console.error('Hugging Face text generation error:', error);
            throw new Error('Failed to generate text');
        }
    },

    async generateImage(prompt: string): Promise<string> {
        try {
            console.log('Generating image with prompt:', prompt);
            const response = await axios.post(
                `${HF_API_URL}/${IMAGE_MODEL}`,
                { inputs: prompt },
                {
                    headers: {
                        'Authorization': `Bearer ${HF_API_KEY}`,
                        'Content-Type': 'application/json'
                    },
                    responseType: 'arraybuffer'
                }
            );

            // Convert the image buffer to base64
            const base64Image = Buffer.from(response.data).toString('base64');
            return `data:image/jpeg;base64,${base64Image}`;
        } catch (error) {
            console.error('Hugging Face image generation error:', error);
            throw new Error('Failed to generate image');
        }
    },

    async analyzeImage(imageUrl: string): Promise<string> {
        try {
            console.log('Analyzing image:', imageUrl);
            // First, fetch the image and convert it to base64
            const imageResponse = await axios.get(imageUrl, { responseType: 'arraybuffer' });
            const base64Image = Buffer.from(imageResponse.data).toString('base64');

            const response = await axios.post(
                `${HF_API_URL}/${IMAGE_ANALYSIS_MODEL}`,
                { inputs: base64Image },
                {
                    headers: {
                        'Authorization': `Bearer ${HF_API_KEY}`,
                        'Content-Type': 'application/json'
                    }
                }
            );
            console.log('Image analysis response:', response.data);
            return JSON.stringify(response.data);
        } catch (error) {
            console.error('Hugging Face image analysis error:', error);
            throw new Error('Failed to analyze image');
        }
    }
}; 