import { Controller, Post, Body, Get, Param, Put, Delete, Query, UseGuards, Request } from '@nestjs/common';
import { AuthService } from './auth.service';
import { JwtAuthGuard } from '../guards/jwt-auth.guard';
import { Public } from '../guards/public.decorator';
import { CreateUserDto, LoginDto } from 'src/appwrite/UserDto';

@Controller('auth')
@UseGuards(JwtAuthGuard)
export class AuthController {
    constructor(private authService: AuthService) { }

    @Public()
    @Post('signup')
    async signup(@Body() userData: CreateUserDto) {
        return this.authService.signup(userData);
    }

    @Public()
    @Post('login')
    async login(@Body() loginData: LoginDto) {
        return this.authService.login(loginData);
    }

    @Post('logout')
    async logout(@Request() req: any) {
        return this.authService.logout();
    }

    @Get('profile')
    async getUserProfile(@Request() req: any) {
        return this.authService.getUserProfile(req.user.userId);
    }

    @Put('profile')
    async updateUserProfile(
        @Request() req: any,
        @Body() profileData: any
    ) {
        return this.authService.updateUserProfile(req.user.userId, profileData);
    }

    @Get('me')
    async getCurrentUser(@Request() req: any) {
        return {
            success: true,
            user: req.user
        };
    }

    @Post('refresh')
    async refreshToken(@Request() req: any) {
        return this.authService.refreshToken(req.user.userId);
    }

    @Get('user/email')
    async getUserByEmail(@Query('email') email: string) {
        return this.authService.getUserByEmail(email);
    }

    @Get('user/:userId')
    async getUser(@Param('userId') userId: string) {
        return this.authService.getUser(userId);
    }

    @Put('user/:userId')
    async updateUser(
        @Param('userId') userId: string,
        @Body() updateData: Partial<CreateUserDto>
    ) {
        return this.authService.updateUser(userId, updateData);
    }

    @Delete('user/:userId')
    async deleteUser(@Param('userId') userId: string) {
        return this.authService.deleteUser(userId);
    }

    @Post('password/reset')
    async resetPassword(
        @Body() resetData: { userId: string; otp: string; newPassword: string }
    ) {
        return this.authService.resetPassword(resetData.userId, resetData.otp, resetData.newPassword);
    }

    @Post('session/verify')
    async verifySession(@Body() body: { sessionId: string }) {
        return this.authService.verifySession(body.sessionId);
    }
}