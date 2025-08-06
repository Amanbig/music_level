import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { GeminiModule } from './gemini/gemini.module';
import { GenerateModule } from './generate/generate.module';
import { AppwriteService } from './appwrite/appwrite.service';
import { AppwriteModule } from './appwrite/appwrite.module';
import { FilesService } from './files/files.service';
import { FilesModule } from './files/files.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    JwtModule.registerAsync({
      global: true,
      useFactory: async (configService: ConfigService) => ({
        secret: configService.get<string>('JWT_SECRET') || 'your-secret-key',
        signOptions: {
          expiresIn: configService.get<string>('JWT_EXPIRES_IN') || '24h',
        },
      }),
      inject: [ConfigService],
    }),
    AuthModule, 
    GeminiModule, 
    GenerateModule, 
    AppwriteModule, 
    FilesModule
  ],
  controllers: [AppController],
  providers: [AppService, AppwriteService, FilesService],
})
export class AppModule {}
