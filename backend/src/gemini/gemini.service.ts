import { Injectable } from '@nestjs/common';

@Injectable()
export class GeminiService {
    private readonly geminiApiUrl: string;
    private readonly geminiApiKey: string;
    private readonly geminiModel: string;
    constructor() {
        this.geminiApiUrl = process.env.GEMINI_API_URL || 'https://api.gemini.com';
        this.geminiApiKey = process.env.GEMINI_API_KEY || 'your-gemini-api-key';
        this.geminiModel = process.env.GEMINI_MODEL || 'gemini-2.0-flash';
    }

    async generateAI(prompt:string){
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
