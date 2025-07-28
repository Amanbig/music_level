import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { AppwriteService } from '../appwrite/appwrite.service';
import { JwtPayload } from '../guards/jwt.strategy';
import { CreateUserDto, LoginDto } from 'src/appwrite/UserDto';

@Injectable()
export class AuthService {
    constructor(
        private appwriteService: AppwriteService,
        private jwtService: JwtService
    ) {}

    async signup(userData: CreateUserDto) {
        try {
            const user = await this.appwriteService.createUser(userData);
            return {
                success: true,
                message: 'User created successfully',
                user: {
                    id: user.$id,
                    email: user.email,
                    name: user.name,
                    emailVerification: user.emailVerification
                }
            };
        } catch (error) {
            return {
                success: false,
                message: error.message || 'Failed to create user'
            };
        }
    }

    async login(loginData: LoginDto) {
        try {
            const session = await this.appwriteService.createSession(loginData);
            const user = await this.appwriteService.getUser(session.userId);
            
            // Generate JWT token
            const payload: JwtPayload = {
                sub: user.$id,
                email: user.email,
                name: user.name
            };
            const accessToken = this.jwtService.sign(payload);
            
            return {
                success: true,
                message: 'Login successful',
                accessToken,
                user: {
                    id: user.$id,
                    email: user.email,
                    name: user.name,
                    emailVerification: user.emailVerification
                }
            };
        } catch (error) {
            return {
                success: false,
                message: error.message || 'Login failed'
            };
        }
    }

    async logout(sessionId?: string) {
        try {
            await this.appwriteService.deleteSession(sessionId);
            return {
                success: true,
                message: 'Logout successful'
            };
        } catch (error) {
            return {
                success: false,
                message: error.message || 'Logout failed'
            };
        }
    }

    async getUserProfile(userId: string) {
        try {
            const profile = await this.appwriteService.getUserProfile(userId);
            return {
                success: true,
                profile
            };
        } catch (error) {
            return {
                success: false,
                message: error.message || 'Failed to get user profile'
            };
        }
    }

    async updateUserProfile(userId: string, profileData: any) {
        try {
            const updatedProfile = await this.appwriteService.updateUserProfile(userId, profileData);
            return {
                success: true,
                message: 'Profile updated successfully',
                profile: updatedProfile
            };
        } catch (error) {
            return {
                success: false,
                message: error.message || 'Failed to update profile'
            };
        }
    }

    async getUserByEmail(email: string) {
        try {
            const user = await this.appwriteService.getUserByEmail(email);
            if (!user) {
                return {
                    success: false,
                    message: 'User not found'
                };
            }
            return {
                success: true,
                user: {
                    id: user.$id,
                    email: user.email,
                    name: user.name,
                    emailVerification: user.emailVerification
                }
            };
        } catch (error) {
            return {
                success: false,
                message: error.message || 'Failed to get user'
            };
        }
    }

    async getUser(userId: string) {
        try {
            const user = await this.appwriteService.getUser(userId);
            return {
                success: true,
                user: {
                    id: user.$id,
                    email: user.email,
                    name: user.name,
                    emailVerification: user.emailVerification,
                    status: user.status,
                    registration: user.registration
                }
            };
        } catch (error) {
            return {
                success: false,
                message: error.message || 'Failed to get user'
            };
        }
    }

    async updateUser(userId: string, updateData: Partial<CreateUserDto>) {
        try {
            const updatedUser = await this.appwriteService.updateUser(userId, updateData);
            return {
                success: true,
                message: 'User updated successfully',
                user: {
                    id: updatedUser.$id,
                    email: updatedUser.email,
                    name: updatedUser.name,
                    emailVerification: updatedUser.emailVerification
                }
            };
        } catch (error) {
            return {
                success: false,
                message: error.message || 'Failed to update user'
            };
        }
    }

    async deleteUser(userId: string) {
        try {
            await this.appwriteService.deleteUser(userId);
            return {
                success: true,
                message: 'User deleted successfully'
            };
        } catch (error) {
            return {
                success: false,
                message: error.message || 'Failed to delete user'
            };
        }
    }

    async resetPassword(userId: string, otp: string, newPassword: string) {
        try {
            await this.appwriteService.confirmPasswordRecovery(userId, otp, newPassword);
            return {
                success: true,
                message: 'Password reset successfully'
            };
        } catch (error) {
            return {
                success: false,
                message: error.message || 'Failed to reset password'
            };
        }
    }

    async verifySession(sessionId: string) {
        try {
            const verification = await this.appwriteService.verifySession(sessionId);
            return {
                success: true,
                message: 'Session is valid',
                verification
            };
        } catch (error) {
            return {
                success: false,
                message: error.message || 'Invalid session'
            };
        }
    }

    async refreshToken(userId: string) {
        try {
            const user = await this.appwriteService.getUser(userId);
            
            const payload: JwtPayload = {
                sub: user.$id,
                email: user.email,
                name: user.name
            };
            const accessToken = this.jwtService.sign(payload);
            
            return {
                success: true,
                message: 'Token refreshed successfully',
                accessToken,
                user: {
                    id: user.$id,
                    email: user.email,
                    name: user.name,
                    emailVerification: user.emailVerification
                }
            };
        } catch (error) {
            return {
                success: false,
                message: error.message || 'Failed to refresh token'
            };
        }
    }
}