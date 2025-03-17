import type { NextApiRequest, NextApiResponse } from 'next';

export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse
) {
    if (req.method !== 'POST') {
        return res.status(405).json({ message: 'Method not allowed' });
    }

    try {
        const { prompt } = req.body;

        // For testing purposes, we'll return a mock response
        const mockResponse = `This is a test response for the prompt: "${prompt}". 
            In a production environment, this would be connected to the actual AI model.`;

        res.status(200).json({ result: mockResponse });
    } catch (error) {
        console.error('Error in generate-text:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
} 