import { Module } from '@nestjs/common';
import { GenerateController } from './generate.controller';
import { GenerateService } from './generate.service';
import { GeminiModule } from 'src/gemini/gemini.module';
import { AppwriteModule } from 'src/appwrite/appwrite.module';

@Module({
  imports: [GeminiModule, AppwriteModule],
  controllers: [GenerateController],
  providers: [GenerateService]
})
export class GenerateModule {}
