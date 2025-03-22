export interface AgentResponse {
    content: string;
    confidence: number;
    metadata: {
        agentType: 'research' | 'creative' | 'strategy';
        analysisTime: number;
        sources?: string[];
        relatedTopics?: string[];
    };
}

export class OpenAIService {
    private apiKey: string;
    private baseUrl = 'https://api.openai.com/v1';

    constructor() {
        this.apiKey = process.env.NEXT_PUBLIC_OPENAI_API_KEY || '';
    }

    private getAgentPrompt(agentType: string, query: string): string {
        const prompts = {
            research: `As a Research Agent specializing in blockchain and AI:
                Analyze the following query with academic rigor and provide detailed insights.
                Focus on technical accuracy, cite relevant research, and provide blockchain/AI specific context.
                Query: ${query}`,
            creative: `As a Creative Agent specializing in blockchain and AI solutions:
                Generate innovative and original ideas for the following query.
                Focus on unique approaches, novel combinations of blockchain and AI, and creative solutions.
                Query: ${query}`,
            strategy: `As a Strategy Agent specializing in blockchain and AI implementation:
                Provide strategic recommendations for the following query.
                Focus on practical implementation, risk assessment, and actionable steps.
                Query: ${query}`
        };
        return prompts[agentType] || prompts.research;
    }

    async getAgentResponse(agentType: string, query: string): Promise<AgentResponse> {
        try {
            const startTime = Date.now();

            const response = await fetch(`${this.baseUrl}/chat/completions`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${this.apiKey}`
                },
                body: JSON.stringify({
                    model: "gpt-4",
                    messages: [
                        {
                            role: "system",
                            content: this.getAgentPrompt(agentType, query)
                        },
                        {
                            role: "user",
                            content: query
                        }
                    ],
                    temperature: agentType === 'creative' ? 0.8 : 0.3,
                    max_tokens: 500
                })
            });

            if (!response.ok) {
                throw new Error(`OpenAI API error: ${response.statusText}`);
            }

            const data = await response.json();
            const content = data.choices[0]?.message?.content || '';
            const confidence = this.calculateConfidence(content);

            return {
                content,
                confidence,
                metadata: {
                    agentType: agentType as 'research' | 'creative' | 'strategy',
                    analysisTime: Date.now() - startTime,
                    sources: this.extractSources(content),
                    relatedTopics: this.extractTopics(content)
                }
            };
        } catch (error) {
            console.error('OpenAI API Error:', error);
            throw new Error(`Agent ${agentType} failed to process query`);
        }
    }

    private calculateConfidence(response: string): number {
        // Add sophisticated confidence calculation based on:
        // - Response length
        // - Keyword relevance
        // - Sentiment analysis
        // For now, using a simplified version
        return Math.min(Math.max(response.length / 500, 0.4), 0.95);
    }

    private extractSources(response: string): string[] {
        // Extract referenced sources from the response
        const sourcePattern = /\[(.*?)\]/g;
        return Array.from(response.matchAll(sourcePattern))
            .map(match => match[1])
            .filter(Boolean);
    }

    private extractTopics(response: string): string[] {
        // Extract key topics from the response
        // This could be enhanced with NLP processing
        const topics = new Set<string>();
        const keywords = ['blockchain', 'AI', 'smart contract', 'neural network', 'DeFi'];
        keywords.forEach(keyword => {
            if (response.toLowerCase().includes(keyword.toLowerCase())) {
                topics.add(keyword);
            }
        });
        return Array.from(topics);
    }
} 