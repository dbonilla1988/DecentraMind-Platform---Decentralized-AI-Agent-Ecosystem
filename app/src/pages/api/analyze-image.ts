import type { NextApiRequest, NextApiResponse } from 'next';

export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse
) {
    if (req.method !== 'POST') {
        return res.status(405).json({ message: 'Method not allowed' });
    }

    try {
        const { imageUrl } = req.body;

        // For testing purposes, we'll return a mock analysis
        const mockAnalysis = `Test analysis for image at ${imageUrl}: 
            This image appears to contain [mock analysis content]. 
            In a production environment, this would be connected to the actual AI model.`;

        res.status(200).json({ analysis: mockAnalysis });
    } catch (error) {
        console.error('Error in analyze-image:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
} 