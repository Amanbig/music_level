'use client';

import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { appwriteAuth } from '@/lib/appwrite';

type User = {
    $id: string;
    name: string;
    email: string;
} | null;

type AuthContextType = {
    user: User;
    loading: boolean;
    login: (email: string, password: string) => Promise<void>;
    signup: (email: string, password: string, name: string) => Promise<void>;
    logout: () => Promise<void>;
    checkAuthStatus: () => Promise<void>;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
    const [user, setUser] = useState<User>(null);
    const [loading, setLoading] = useState(true);

    const checkAuthStatus = async () => {
        try {
            setLoading(true);
            const currentUser = await appwriteAuth.getCurrentUser();
            setUser(currentUser);
        } catch (error) {
            console.error('Error checking auth status:', error);
            setUser(null);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        checkAuthStatus();
    }, []);

    const login = async (email: string, password: string) => {
        try {
            setLoading(true);
            await appwriteAuth.login(email, password);
            // Make sure we get the current user and set the state
            const currentUser = await appwriteAuth.getCurrentUser();
            if (!currentUser) {
                throw new Error('Failed to get user details after login');
            }
            setUser(currentUser);
        } catch (error) {
            console.error('Login error:', error);
            throw error;
        } finally {
            setLoading(false);
        }
    };

    const signup = async (email: string, password: string, name: string) => {
        try {
            setLoading(true);
            await appwriteAuth.createAccount(email, password, name);
            await checkAuthStatus();
        } catch (error) {
            console.error('Signup error:', error);
            throw error;
        } finally {
            setLoading(false);
        }
    };

    const logout = async () => {
        try {
            setLoading(true);
            await appwriteAuth.logout();
            setUser(null);
        } catch (error) {
            console.error('Logout error:', error);
            throw error;
        } finally {
            setLoading(false);
        }
    };

    return (
        <AuthContext.Provider
            value={{
                user,
                loading,
                login,
                signup,
                logout,
                checkAuthStatus,
            }}
        >
            {children}
        </AuthContext.Provider>
    );
}

export function useAuth() {
    const context = useContext(AuthContext);
    if (context === undefined) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
}