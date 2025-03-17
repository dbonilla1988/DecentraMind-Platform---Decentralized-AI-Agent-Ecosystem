import { NextApiRequest, NextApiResponse } from 'next';
import { huggingFaceService } from '../../../services/ai/huggingface-service';

export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse
) {
    if (req.method !== 'POST') {
        return res.status(405).json({ message: 'Method not allowed' });
    }

    try {
        const { prompt } = req.body;

        if (!prompt) {
            return res.status(400).json({ message: 'Prompt is required' });
        }

        const imageUrl = await huggingFaceService.generateImage(prompt);
        res.status(200).json({ imageUrl });
    } catch (error) {
        console.error('Error in generate-image:', error);
        res.status(500).json({
            message: 'Internal server error',
            error: error instanceof Error ? error.message : 'Unknown error'
        });
    }
} 