import { Controller, Post } from '@nestjs/common';
import { GenerateService } from './generate.service';

@Controller('generate')
export class GenerateController {
    constructor(private readonly generateService: GenerateService) {}

    @Post('ai-response')
    async getAIResponse(songName: string, extra: string, instrument: string = 'piano') {
        return this.generateService.getAIResponse(songName, extra, instrument);
    }
}
