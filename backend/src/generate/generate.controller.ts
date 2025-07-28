import { Body, Controller, Delete, Get, Param, Post, UseGuards } from '@nestjs/common';
import { GenerateService } from './generate.service';
import { GenerationRequestDto, SaveGenerationDto } from './dto/generation.dto';
import { JwtAuthGuard } from '../guards/jwt-auth.guard';
import { Public } from '../guards/public.decorator';

@Controller('generate')
@UseGuards(JwtAuthGuard)
export class GenerateController {
    constructor(private readonly generateService: GenerateService) {}

    @Post('ai-response')
    async getAIResponse(@Body() dto: GenerationRequestDto) {
        return this.generateService.getAIResponse(dto);
    }

    @Post('save')
    async saveGeneration(@Body() dto: SaveGenerationDto) {
        return this.generateService.saveGeneration(dto);
    }

    @Get('user/:userId')
    async getUserGenerations(@Param('userId') userId: string) {
        return this.generateService.getUserGenerations(userId);
    }

    @Get(':id')
    async getGeneration(@Param('id') id: string) {
        return this.generateService.getGeneration(id);
    }

    @Delete(':id')
    async deleteGeneration(
        @Param('id') id: string,
        @Body('userId') userId: string,
    ) {
        return this.generateService.deleteGeneration(id, userId);
    }
}
