import { Injectable, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { AppwriteService } from '../appwrite/appwrite.service';

export interface JwtPayload {
    sub: string; // user ID
    email: string;
    name: string;
    iat?: number;
    exp?: number;
}

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
    constructor(
        private configService: ConfigService,
        private appwriteService: AppwriteService
    ) {
        super({
            jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
            ignoreExpiration: false,
            secretOrKey: configService.get<string>('JWT_SECRET') || 'your-secret-key',
        });
    }

    async validate(payload: JwtPayload) {
        try {
            // Verify user still exists in Appwrite
            const user = await this.appwriteService.getUser(payload.sub);
            if (!user) {
                throw new UnauthorizedException('User not found');
            }

            return {
                userId: payload.sub,
                email: payload.email,
                name: payload.name,
                user: user
            };
        } catch (error) {
            throw new UnauthorizedException('Invalid token');
        }
    }
}