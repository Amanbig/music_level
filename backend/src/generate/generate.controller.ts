import { Body, Controller, Delete, Get, Param, Post, UseGuards, BadRequestException, StreamableFile, Res } from '@nestjs/common';
import { Response } from 'express';
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
        const notes = await this.generateService.getAIResponse(dto);
        return {
            success: true,
            notes: notes,
            message: `Generated ${notes.length} musical notes`
        };
    }

    @Post('save')
    async saveGeneration(@Body() dto: SaveGenerationDto) {
        console.log('Save generation request received:', JSON.stringify(dto, null, 2));
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
    async downloadGeneration(@Param('id') id: string, @Res() res: Response) {
        try {
            console.log(`Download request for generation ID: ${id}`);
            
            const generation = await this.generateService.getGeneration(id);
            console.log(`Generation found: ${generation.name}, fileId: ${generation.fileId}`);
            
            if (!generation.fileId) {
                throw new BadRequestException('No MIDI file associated with this generation');
            }
            
            const fileBuffer = await this.appwriteService.downloadFile(generation.fileId);
            console.log(`File downloaded from Appwrite, type: ${typeof fileBuffer}, length: ${fileBuffer?.length || 'unknown'}`);
            
            // Clean filename for download
            const cleanFileName = generation.name.replace(/[^a-zA-Z0-9\-_\s]/g, '').replace(/\s+/g, '_');
            
            // Set proper headers for binary MIDI file download
            res.set({
                'Content-Type': 'audio/midi',
                'Content-Disposition': `attachment; filename="${cleanFileName}.mid"`,
                'Content-Length': fileBuffer.length.toString(),
                'Cache-Control': 'no-cache',
            });
            
            console.log(`Sending MIDI file: ${cleanFileName}.mid, size: ${fileBuffer.length} bytes`);
            
            // Send the binary data directly
            res.send(fileBuffer);
        } catch (error) {
            console.error('Download error:', error);
            res.status(400).json({ error: 'Failed to download file' });
        }
    }

    @Delete(':id')
    async deleteGeneration(
        @Param('id') id: string,
        @Body('userId') userId: string,
    ) {
        return this.generateService.deleteGeneration(id, userId);
    }
}
