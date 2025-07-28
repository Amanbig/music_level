import { BadRequestException, Injectable, Logger, UnauthorizedException } from '@nestjs/common';
import { Account, Client, Databases, ID, Query, Users, Storage } from "node-appwrite";
import { AppwriteUser, CreateUserDto, LoginDto } from './UserDto';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class AppwriteService {
    private readonly logger = new Logger(AppwriteService.name);
    private client: Client;
    private account: Account;
    public databases: Databases;
    private users: Users;
    private projectId: string;
    public databaseId: string;
    private userCollectionId: string;
    private filesCollectionId: string;
    public bucketId: string;
    public storage: Storage;

    constructor(private configService: ConfigService) {
        this.projectId = this.configService.get<string>('appwrite.projectId') || 'projectId';
        this.databaseId = this.configService.get<string>('appwrite.databaseId') || 'main';
        this.userCollectionId = this.configService.get<string>(
            'appwrite.userCollectionId',
        ) || 'users';
        this.filesCollectionId = this.configService.get<string>(
            'appwrite.filesCollectionId',
        ) || 'files';

        this.bucketId = this.configService.get<string>(
            'appwrite.bucketId',
        ) || ''

        // console.log(this.projectId)

        this.client = new Client()
            .setEndpoint(this.configService.get<string>('appwrite.endpoint') || 'https://cloud.appwrite.io/v1')
            .setProject(this.projectId)
            .setKey(this.configService.get<string>('appwrite.apiKey') || '');

        this.account = new Account(this.client);
        this.databases = new Databases(this.client);
        this.users = new Users(this.client);
        this.storage = new Storage(this.client);

        this.logger.log('Appwrite service initialized');
    }

    async createUser(userData: CreateUserDto):Promise<AppwriteUser>{
        try {
            const user = await this.users.create(
                ID.unique(),
                userData.email,
                undefined,
                userData.password,
                userData.name,
            );

            // Create user profile in database
            await this.createUserProfile(user.$id, {
                user_id: user.$id,
                email: userData.email,
                name: userData.name || 'User',
                created_at: new Date().toISOString(),
                updated_at: new Date().toISOString(),
            });

            this.logger.log(`User created: ${user.$id}`);
            return user;
        } catch (error) {
            this.logger.error('Error creating user:', error);
            throw new BadRequestException('Failed to create user: ' + error.message);
        }
    }

    async createSession(loginData: LoginDto): Promise<any> {
        try {

            // Create email/password session
            const session = await this.account.createEmailPasswordSession(
                loginData.email,
                loginData.password,
            );

            this.logger.log(`Session created for user: ${session.userId}`);
            return session;
        } catch (error) {
            this.logger.error('Error creating session:', error);
            throw new UnauthorizedException('Invalid credentials');
        }
    }

    async getUser(userId: string): Promise<AppwriteUser> {
        try {
            this.logger.debug(`Getting user from Appwrite: ${userId}`);
            const user = await this.users.get(userId);
            this.logger.debug(`User retrieved from Appwrite:`, {
                id: user.$id,
                email: user.email,
                status: user.status,
                name: user.name,
            });
            return user;
        } catch (error) {
            this.logger.error(
                `Error getting user ${userId} from Appwrite:`,
                error.message,
            );
            throw new UnauthorizedException('User not found');
        }
    }

    async getUserByEmail(email: string): Promise<AppwriteUser | null> {
        try {
            const users = await this.users.list([Query.equal('email', email)]);
            return users.users.length > 0 ? users.users[0] : null;
        } catch (error) {
            this.logger.error('Error getting user by email:', error);
            return null;
        }
    }

    async updateUser(
        userId: string,
        updateData: Partial<CreateUserDto>,
    ): Promise<AppwriteUser> {
        try {
            const user = await this.users.updateName(userId, updateData.name!);
            if (updateData.email) {
                await this.users.updateEmail(userId, updateData.email);
            }
            return user;
        } catch (error) {
            this.logger.error('Error updating user:', error);
            throw new BadRequestException('Failed to update user');
        }
    }

    // Confirm password recovery using OTP (Appwrite)
    async confirmPasswordRecovery(
        userId: string,
        otp: string,
        newPassword: string,
    ): Promise<void> {
        try {
            await this.users.updatePassword(userId, newPassword);

            this.logger.log(`Password updated for user: ${userId}`);
        } catch (error) {
            this.logger.error('Failed to confirm password recovery:', error);
            this.logger.error('Error details:', error.message || error);
            throw new BadRequestException(
                'Failed to reset password: ' + (error.message || error),
            );
        }
    }

    async deleteUser(userId: string): Promise<void> {
        try {
            await this.users.delete(userId);
            await this.databases.deleteDocument(
                this.databaseId,
                this.userCollectionId,
                userId,
            );
            this.logger.log(`User deleted: ${userId}`);
        } catch (error) {
            this.logger.error('Error deleting user:', error);
            throw new BadRequestException('Failed to delete user');
        }
    }

    async verifySession(sessionId: string): Promise<any> {
        try {
            // For server-side usage, session verification is handled by JWT tokens
            // This method is kept for compatibility but doesn't perform actual verification
            this.logger.log(`Session verification requested: ${sessionId}`);
            return { valid: true, sessionId };
        } catch (error) {
            this.logger.error('Error verifying session:', error);
            throw new UnauthorizedException('Invalid session');
        }
    }

    async deleteSession(sessionId?: string): Promise<void> {
        try {
            // For server-side usage, session deletion is handled by JWT invalidation
            // No actual session to delete in Appwrite since we're using JWT tokens
            this.account.deleteSession(
                sessionId || 'current',
            );
            this.logger.log(`Session logout requested: ${sessionId || 'current'}`);
        } catch (error) {
            this.logger.error('Error deleting session:', error);
            // Don't throw error on logout - always allow logout to complete
        }
    }

    async createUserProfile(userId: string, profileData: any): Promise<any> {
        try {
            const document = await this.databases.createDocument(
                this.databaseId,
                this.userCollectionId,
                userId,
                profileData,
            );
            return document;
        } catch (error) {
            this.logger.error('Error creating user profile:', error);
            throw new BadRequestException('Failed to create user profile');
        }
    }

    async getUserProfile(userId: string): Promise<any> {
        try {
            const document = await this.databases.getDocument(
                this.databaseId,
                this.userCollectionId,
                userId,
            );
            return document;
        } catch (error) {
            this.logger.error('Error getting user profile:', error);
            return null;
        }
    }

    async updateUserProfile(userId: string, profileData: any): Promise<any> {
        try {
            profileData.updated_at = new Date().toISOString();
            const document = await this.databases.updateDocument(
                this.databaseId,
                this.userCollectionId,
                userId,
                profileData,
            );
            return document;
        } catch (error) {
            this.logger.error('Error updating user profile:', error);
            throw new BadRequestException('Failed to update user profile');
        }
    }

    async uploadFile(file: Express.Multer.File, userId: string) {
        try {
            const fileId = ID.unique();

            // Create a File-like object from the buffer
            const fileBlob = new Blob([file.buffer], { type: file.mimetype });
            const fileObject = new File([fileBlob], file.originalname, {
                type: file.mimetype,
                lastModified: Date.now()
            });

            const uploadedFile = await this.storage.createFile(
                this.bucketId,
                fileId,
                fileObject
            );

            // Store file metadata in database
            await this.createFileRecord(uploadedFile.$id, file, userId);

            return { success: true, fileId: uploadedFile.$id };
        } catch (error) {
            return { success: false, error: error.message };
        }
    }

    private async createFileRecord(fileId: string, file: Express.Multer.File, userId: string) {
        return this.databases.createDocument(
            this.databaseId,
            this.filesCollectionId,
            ID.unique(),
            {
                fileId,
                originalName: file.originalname,
                size: file.size,
                mimeType: file.mimetype,
                userId,
                createdAt: new Date().toISOString()
            }
        );
    }

    async getUserFiles(userId: string) {
        try {
            this.logger.log(`Getting files for userId: ${userId}`);
            const files = await this.databases.listDocuments(
                this.databaseId,
                this.filesCollectionId,
                [Query.equal('userId', userId), Query.orderDesc('createdAt')]
            );
            this.logger.log(`Found ${files.documents.length} files for user ${userId}`);
            return files.documents;
        } catch (error) {
            this.logger.error('Error getting user files:', error);
            this.logger.error('Database ID:', this.databaseId);
            this.logger.error('Files Collection ID:', this.filesCollectionId);
            this.logger.error('User ID:', userId);
            throw new BadRequestException('Failed to get user files: ' + error.message);
        }
    }

    async getFileById(fileId: string) {
        try {
            const files = await this.databases.listDocuments(
                this.databaseId,
                this.filesCollectionId,
                [Query.equal('fileId', fileId)]
            );
            return files.documents.length > 0 ? files.documents[0] : null;
        } catch (error) {
            this.logger.error('Error getting file:', error);
            return null;
        }
    }

    async deleteFile(fileId: string, userId: string) {
        try {
            // First get the file record to verify ownership
            const fileRecord = await this.getFileById(fileId);
            if (!fileRecord || fileRecord.userId !== userId) {
                throw new UnauthorizedException('File not found or access denied');
            }

            // Delete from storage
            await this.storage.deleteFile(this.bucketId, fileId);

            // Delete file record from database
            await this.databases.deleteDocument(
                this.databaseId,
                this.filesCollectionId,
                fileRecord.$id
            );

            this.logger.log(`File deleted: ${fileId}`);
            return true;
        } catch (error) {
            this.logger.error('Error deleting file:', error);
            throw new BadRequestException('Failed to delete file');
        }
    }
}
