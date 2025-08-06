import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import axios from 'axios';

// Type definitions for Gemini API response
interface GeminiPart {
    text: string;
}

interface GeminiContent {
    parts: GeminiPart[];
}

interface GeminiCandidate {
    content: GeminiContent;
}

interface GeminiResponse {
    candidates?: GeminiCandidate[];
}

@Injectable()
export class GeminiService {
    private readonly logger = new Logger(GeminiService.name);
    private readonly geminiApiUrl: string;
    private readonly geminiApiKey: string;
    private readonly geminiModel: string;

    constructor(private configService: ConfigService) {
        this.geminiApiUrl = this.configService.get<string>('GEMINI_API_URL') || 'https://generativeai.googleapis.com/v1';
        this.geminiApiKey = this.configService.get<string>('GEMINI_API_KEY') || 'your-gemini-api-key';
        this.geminiModel = this.configService.get<string>('GEMINI_MODEL') || 'gemini-2.0-flash';

        this.logger.log('Gemini Configuration:', {
            apiUrl: this.geminiApiUrl,
            model: this.geminiModel,
            hasApiKey: !!this.geminiApiKey
        });
    }

    async generateAI(prompt: string) {
        try {
            // Google Gemini API format
            const url = `${this.geminiApiUrl}/models/${this.geminiModel}:generateContent?key=${this.geminiApiKey}`;

            const response = await axios.post<GeminiResponse>(
                url,
                {
                    contents: [
                        {
                            parts: [
                                {
                                    text: prompt
                                }
                            ]
                        }
                    ]
                },
                {
                    headers: {
                        'Content-Type': 'application/json',
                    },
                }
            );

            this.logger.debug('Gemini API Response:', JSON.stringify(response.data, null, 2));

            // Extract text from Gemini response format with proper typing
            const geminiData = response.data as GeminiResponse;
            if (geminiData?.candidates?.[0]?.content?.parts?.[0]?.text) {
                return {
                    data: {
                        text: geminiData.candidates[0].content.parts[0].text
                    }
                };
            } else {
                this.logger.error('Unexpected Gemini response format:', geminiData);
                throw new Error('Invalid response format from Gemini API');
            }
        } catch (error: any) {
            this.logger.error('Gemini API Error:', error.response?.data || error.message);
            throw error;
        }
    }
}
