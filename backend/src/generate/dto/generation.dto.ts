import { IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class GenerationRequestDto {
    @IsOptional()
    @IsString()
    songName?: string;

    @IsOptional()
    @IsString()
    extra?: string;

    @IsOptional()
    @IsString()
    instrument?: string = 'piano';
}

export class SaveGenerationDto {
    @IsNotEmpty()
    @IsString()
    name: string;

    @IsNotEmpty()
    notes: any[];

    @IsOptional()
    @IsString()
    description?: string;

    @IsString()
    @IsNotEmpty()
    userId: string;

    @IsOptional()
    @IsString()
    instrument?: string;
}

export interface GenerationResponse {
    id: string;
    name: string;
    notes: any[];
    midiData?: any;
    fileId?: string;
    description?: string;
    userId: string;
    instrument?: string;
    createdAt: string;
    updatedAt: string;
}
