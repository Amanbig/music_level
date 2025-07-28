import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { GeminiModule } from './gemini/gemini.module';
import { SupabaseModule } from './supabase/supabase.module';
import { GenerateModule } from './generate/generate.module';

@Module({
  imports: [AuthModule, GeminiModule, SupabaseModule, GenerateModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
