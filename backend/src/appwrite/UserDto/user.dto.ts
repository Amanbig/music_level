export interface AppwriteUser {
    $id: string;
    name: string;
    email: string;
    emailVerification: boolean;
    phone?: string;
    prefs: any;
    registration: string;
    status: boolean;
}

export interface CreateUserDto{
    email: string;
    password: string;
    name: string;
}

export interface LoginDto {
    email: string;
    password: string;
}