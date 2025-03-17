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
        const { imageUrl } = req.body;

        if (!imageUrl) {
            return res.status(400).json({ message: 'Image URL is required' });
        }

        const analysis = await huggingFaceService.analyzeImage(imageUrl);
        res.status(200).json({ analysis });
    } catch (error) {
        console.error('Error in analyze-image:', error);
        res.status(500).json({
            message: 'Internal server error',
            error: error instanceof Error ? error.message : 'Unknown error'
        });
    }
} 