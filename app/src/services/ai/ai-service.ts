import axios, { AxiosError, AxiosResponse } from 'axios';
import { testConfig } from '../../config/test-config';

interface AIServiceError extends Error {
    code?: string;
    details?: any;
}

class AIServiceError extends Error {
    constructor(message: string, code?: string, details?: any) {
        super(message);
        this.name = 'AIServiceError';
        this.code = code;
        this.details = details;
    }
}

interface TextGenerationResponse {
    result: string;
}

interface ImageGenerationResponse {
    imageUrl: string;
}

interface ImageAnalysisResponse {
    analysis: string;
}

export const aiService = {
    async generateText(prompt: string): Promise<string> {
        try {
            const response: AxiosResponse<TextGenerationResponse> = await axios.post(
                testConfig.apiEndpoints.textGeneration,
                {
                    prompt,
                    max_tokens: 1000,
                    temperature: 0.7
                },
                {
                    timeout: testConfig.timeouts.apiRequest
                }
            );

            if (!response.data.result) {
                throw new AIServiceError('Invalid response format', 'INVALID_RESPONSE');
            }

            return response.data.result;
        } catch (error: unknown) {
            if (axios.isAxiosError(error)) {
                throw new AIServiceError(
                    'Text generation failed',
                    error.response?.status?.toString() || 'NETWORK_ERROR',
                    error.response?.data
                );
            }
            throw new AIServiceError('Unknown error occurred', 'UNKNOWN_ERROR');
        }
    },

    async generateImage(prompt: string): Promise<string> {
        try {
            const response: AxiosResponse<ImageGenerationResponse> = await axios.post(
                testConfig.apiEndpoints.imageGeneration,
                {
                    prompt,
                    size: '512x512',
                    quality: 'standard'
                },
                {
                    timeout: testConfig.timeouts.apiRequest
                }
            );

            if (!response.data.imageUrl) {
                throw new AIServiceError('Invalid response format', 'INVALID_RESPONSE');
            }

            const isValidImage = await fetch(response.data.imageUrl)
                .then(res => {
                    const contentType = res.headers.get('content-type');
                    return res.ok && (contentType?.startsWith('image/') || false);
                })
                .catch(() => false);

            if (!isValidImage) {
                throw new AIServiceError('Invalid image URL', 'INVALID_IMAGE_URL');
            }

            return response.data.imageUrl;
        } catch (error: unknown) {
            if (axios.isAxiosError(error)) {
                throw new AIServiceError(
                    'Image generation failed',
                    error.response?.status?.toString() || 'NETWORK_ERROR',
                    error.response?.data
                );
            }
            throw new AIServiceError('Unknown error occurred', 'UNKNOWN_ERROR');
        }
    },

    async analyzeImage(imageUrl: string): Promise<string> {
        try {
            const isValidImage = await fetch(imageUrl)
                .then(res => {
                    const contentType = res.headers.get('content-type');
                    return res.ok && (contentType?.startsWith('image/') || false);
                })
                .catch(() => false);

            if (!isValidImage) {
                throw new AIServiceError('Invalid image URL provided', 'INVALID_INPUT_URL');
            }

            const response: AxiosResponse<ImageAnalysisResponse> = await axios.post(
                testConfig.apiEndpoints.imageAnalysis,
                {
                    imageUrl,
                    analysisType: 'full'
                },
                {
                    timeout: testConfig.timeouts.apiRequest
                }
            );

            if (!response.data.analysis) {
                throw new AIServiceError('Invalid response format', 'INVALID_RESPONSE');
            }

            return response.data.analysis;
        } catch (error: unknown) {
            if (axios.isAxiosError(error)) {
                throw new AIServiceError(
                    'Image analysis failed',
                    error.response?.status?.toString() || 'NETWORK_ERROR',
                    error.response?.data
                );
            }
            throw new AIServiceError('Unknown error occurred', 'UNKNOWN_ERROR');
        }
    }
}; 