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

        // For testing purposes, we'll return a placeholder image URL
        const mockImageUrl = 'https://via.placeholder.com/512x512.png?text=AI+Generated+Image';

        res.status(200).json({ imageUrl: mockImageUrl });
    } catch (error) {
        console.error('Error in generate-image:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
} 