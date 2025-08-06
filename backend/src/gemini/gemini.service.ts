import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import axios from 'axios';

@Injectable()
export class GeminiService {
    private readonly geminiApiUrl: string;
    private readonly geminiApiKey: string;
    private readonly geminiModel: string;

    constructor(private configService: ConfigService) {
        this.geminiApiUrl = this.configService.get<string>('GEMINI_API_URL') || 'https://api.gemini.com';
        this.geminiApiKey = this.configService.get<string>('GEMINI_API_KEY') || 'your-gemini-api-key';
        this.geminiModel = this.configService.get<string>('GEMINI_MODEL') || 'gemini-2.0-flash';

        console.log('Gemini Configuration:', {
            apiUrl: this.geminiApiUrl,
            model: this.geminiModel,
            hasApiKey: !!this.geminiApiKey
        });
    }

    async generateAI(prompt: string) {
        const response = await axios.post(
            this.geminiApiUrl,
            {
                model: this.geminiModel,
                messages: [
                    {
                        role: 'user',
                        content: prompt,
                    },
                ],
            },
            {
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${this.geminiApiKey}`,
                },
            }
        );

        return response.data;
    }
}
