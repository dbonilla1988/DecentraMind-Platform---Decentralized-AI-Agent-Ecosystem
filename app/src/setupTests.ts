// Mock fetch globally
global.fetch = jest.fn(() =>
    Promise.resolve({
        ok: true,
        headers: {
            get: jest.fn().mockReturnValue('image/jpeg'),
        },
    } as any)
);

// Mock axios
jest.mock('axios', () => ({
    post: jest.fn().mockImplementation((url) => {
        switch (url) {
            case '/api/generate-text':
                return Promise.resolve({
                    data: { result: 'Mock text response' },
                });
            case '/api/generate-image':
                return Promise.resolve({
                    data: { imageUrl: 'https://example.com/mock-image.jpg' },
                });
            case '/api/analyze-image':
                return Promise.resolve({
                    data: { analysis: 'Mock image analysis' },
                });
            default:
                return Promise.reject(new Error('Invalid endpoint'));
        }
    }),
    isAxiosError: jest.fn().mockReturnValue(true),
})); 