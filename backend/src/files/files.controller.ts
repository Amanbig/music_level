import {
    Controller,
    Post,
    Get,
    Delete,
    Param,
    Body,
    UseInterceptors,
    UploadedFile,
    UseGuards,
    Request
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { FilesService } from './files.service';
import { JwtAuthGuard } from '../guards/jwt-auth.guard';
import { Public } from '../guards/public.decorator';

@Controller('files')
@UseGuards(JwtAuthGuard)
export class FilesController {
    constructor(private filesService: FilesService) { }

    @Post('upload')
    @UseInterceptors(FileInterceptor('file'))
    async uploadFile(
        @UploadedFile() file: Express.Multer.File,
        @Request() req: any
    ) {
        if (!file) {
            return {
                success: false,
                message: 'No file provided'
            };
        }
        return this.filesService.uploadFile(file, req.user.userId);
    }

    @Get('my-files')
    async getUserFiles(@Request() req: any) {
        console.log('getUserFiles controller - user:', req.user);
        console.log('getUserFiles controller - userId:', req.user?.userId);
        return this.filesService.getUserFiles(req.user.userId);
    }


    @Get(':fileId')
    async getFileInfo(@Param('fileId') fileId: string) {
        return this.filesService.getFileInfo(fileId);
    }

    @Delete(':fileId')
    async deleteFile(
        @Param('fileId') fileId: string,
        @Request() req: any
    ) {
        return this.filesService.deleteFile(fileId, req.user.userId);
    }


}