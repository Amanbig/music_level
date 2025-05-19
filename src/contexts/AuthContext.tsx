'use client';

import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { supabaseAuth, supabase } from '@/lib/supabase';
import { User as SupabaseUser } from '@supabase/supabase-js';

type User = SupabaseUser | null;

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
            console.log('AuthContext - Checking auth status');
            const currentUser = await supabaseAuth.getCurrentUser();
            console.log('AuthContext - Current user:', currentUser);
            setUser(currentUser);
        } catch (error) {
            console.error('Error checking auth status:', error);
            setUser(null);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        // Initial auth check
        checkAuthStatus();

        // Set up auth state listener
        const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
            console.log('AuthContext - Auth state changed:', event);
            console.log('AuthContext - New session:', session);

            if (session?.user) {
                console.log('AuthContext - Setting user from session');
                setUser(session.user);

                // Set cookies with Supabase token names
                document.cookie = `sb-access-token=${session.access_token}; path=/; max-age=${session.expires_in}; secure; samesite=lax`;
                document.cookie = `sb-refresh-token=${session.refresh_token}; path=/; max-age=604800; secure; samesite=lax`;
            } else {
                console.log('AuthContext - No session user, setting null');
                setUser(null);
                // Clear cookies on logout
                document.cookie = 'sb-access-token=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT';
                document.cookie = 'sb-refresh-token=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT';
            }
        });

        // Cleanup subscription
        return () => {
            subscription.unsubscribe();
        };
    }, []);

    const login = async (email: string, password: string) => {
        try {
            setLoading(true);
            console.log('AuthContext - Attempting login for:', email);
            const result = await supabaseAuth.login(email, password);
            if (!result.user) {
                throw new Error('Failed to get user details after login');
            }
            console.log('AuthContext - Login successful, user:', result.user);
            setUser(result.user);
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
            console.log('AuthContext - Creating account for:', email);
            const result = await supabaseAuth.createAccount(email, password, name);
            if (result.user) {
                console.log('AuthContext - Account created, user:', result.user);
                setUser(result.user);
            } else {
                console.log('AuthContext - No user after account creation, checking status');
                await checkAuthStatus();
            }
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
            console.log('AuthContext - Logging out');
            await supabaseAuth.logout();
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