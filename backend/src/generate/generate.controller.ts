import { Body, Controller, Delete, Get, Param, Post, UseGuards, BadRequestException, StreamableFile } from '@nestjs/common';
import { GenerateService } from './generate.service';
import { GenerationRequestDto, SaveGenerationDto } from './dto/generation.dto';
import { JwtAuthGuard } from '../guards/jwt-auth.guard';
import { Public } from '../guards/public.decorator';
import { AppwriteService } from 'src/appwrite/appwrite.service';

@Controller('generate')
@UseGuards(JwtAuthGuard)
export class GenerateController {
    constructor(
        private readonly generateService: GenerateService,
        private readonly appwriteService: AppwriteService
    ) {}

    @Post('ai-response')
    async getAIResponse(@Body() dto: GenerationRequestDto) {
        return this.generateService.getAIResponse(dto);
    }

    @Post('save')
    async saveGeneration(@Body() dto: SaveGenerationDto) {
        return this.generateService.saveGeneration(dto);
    }

    @Post('batch/save')
    async saveBatchGenerations(@Body() dtos: SaveGenerationDto[]) {
        if (!Array.isArray(dtos) || dtos.length === 0) {
            throw new BadRequestException('Invalid batch save request');
        }
        return this.generateService.saveBatchGenerations(dtos);
    }

    @Delete('batch')
    async deleteBatchGenerations(
        @Body('ids') ids: string[],
        @Body('userId') userId: string,
    ) {
        if (!Array.isArray(ids) || ids.length === 0) {
            throw new BadRequestException('Invalid batch delete request');
        }
        return this.generateService.deleteBatchGenerations(ids, userId);
    }

    @Get('user/:userId')
    async getUserGenerations(@Param('userId') userId: string) {
        return this.generateService.getUserGenerations(userId);
    }

    @Get(':id')
    async getGeneration(@Param('id') id: string) {
        return this.generateService.getGeneration(id);
    }

    @Get(':id/download')
    async downloadGeneration(@Param('id') id: string): Promise<StreamableFile> {
        const generation = await this.generateService.getGeneration(id);
        if (!generation.fileId) {
            throw new BadRequestException('No MIDI file associated with this generation');
        }
        
        const file = await this.appwriteService.downloadFile(generation.fileId);
        return new StreamableFile(file);
    }

    @Delete(':id')
    async deleteGeneration(
        @Param('id') id: string,
        @Body('userId') userId: string,
    ) {
        return this.generateService.deleteGeneration(id, userId);
    }
}
