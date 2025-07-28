import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { GeminiModule } from './gemini/gemini.module';
import { GenerateModule } from './generate/generate.module';
import { AppwriteService } from './appwrite/appwrite.service';
import { AppwriteModule } from './appwrite/appwrite.module';

@Module({
  imports: [AuthModule, GeminiModule, GenerateModule, AppwriteModule],
  controllers: [AppController],
  providers: [AppService, AppwriteService],
})
export class AppModule {}
