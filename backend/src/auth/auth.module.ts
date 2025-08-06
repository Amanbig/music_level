import { Module } from '@nestjs/common';
import { PassportModule } from '@nestjs/passport';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { AppwriteModule } from '../appwrite/appwrite.module';
import { JwtStrategy } from '../guards/jwt.strategy';
import { JwtAuthGuard } from '../guards/jwt-auth.guard';

@Module({
  imports: [
    AppwriteModule,
    PassportModule,
  ],
  controllers: [AuthController],
  providers: [AuthService, JwtStrategy, JwtAuthGuard],
  exports: [AuthService, JwtAuthGuard]
})
export class AuthModule { }