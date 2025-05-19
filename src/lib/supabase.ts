import { createClient } from '@supabase/supabase-js';

// Supabase configuration
export const supabaseConfig = {
    url: process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://xiuuccecjanwiomdlmmg.supabase.co',
    anonKey: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InhpdXVjY2VjamFud2lvbWRsbW1nIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDc2MjkxNDEsImV4cCI6MjA2MzIwNTE0MX0.GRhgp3JOMp4qwdU4qLx9hZn_1h7pej5sOV5SZ7D3Aqg',
};

// Initialize the Supabase client with session persistence
export const supabase = createClient(
    supabaseConfig.url,
    supabaseConfig.anonKey,
    {
        auth: {
            persistSession: true,
            storageKey: 'sb-auth-token',
            storage: typeof window !== 'undefined' ? window.localStorage : undefined,
        }
    }
);

// Authentication helper functions
export const supabaseAuth = {
    // Create a new user account
    createAccount: async (email: string, password: string, name: string) => {
        try {
            console.log('supabaseAuth.createAccount - Creating account for:', email);

            // Create the user account with email redirect for confirmation
            const { data, error } = await supabase.auth.signUp({
                email,
                password,
                options: {
                    data: {
                        name,
                    },
                    // Redirect after email confirmation
                    emailRedirectTo: `${window.location.origin}/auth/callback`,
                },
            });

            if (error) {
                console.error('supabaseAuth.createAccount - Error:', error);
                throw error;
            }

            console.log('supabaseAuth.createAccount - Account created:', data);

            // Return user and session data
            return {
                user: data.user,
                session: data.session,
            };
        } catch (error) {
            console.error('supabaseAuth.createAccount - Error:', error);
            throw error;
        }
    },

    // Login user
    login: async (email: string, password: string) => {
        try {
            console.log('supabaseAuth.login - Attempting login with email:', email);

            // Sign in with email and password
            let { data, error } = await supabase.auth.signInWithPassword({
                email,
                password,
            });

            if (error) {
                console.error('supabaseAuth.login - Login error:', error);
                throw error;
            }

            console.log('supabaseAuth.login - Login successful:', data);

            // Return user and session data
            return {
                user: data.user,
                session: data.session,
            };
        } catch (error) {
            console.error('supabaseAuth.login - Error:', error);
            throw error;
        }
    },

    // Get current user
    getCurrentUser: async () => {
        try {
            console.log('supabaseAuth.getCurrentUser - Getting current user');
            const { data: { user }, error } = await supabase.auth.getUser();

            if (error) {
                console.error('supabaseAuth.getCurrentUser - Error:', error);
                throw error;
            }

            console.log('supabaseAuth.getCurrentUser - Current user:', user);
            return user;
        } catch (error) {
            console.error('supabaseAuth.getCurrentUser - Error:', error);
            return null;
        }
    },

    // Get current session
    getSession: async () => {
        try {
            console.log('supabaseAuth.getSession - Getting current session');
            const { data: { session }, error } = await supabase.auth.getSession();

            if (error) {
                console.error('supabaseAuth.getSession - Error:', error);
                throw error;
            }

            console.log('supabaseAuth.getSession - Current session:', session);
            return session;
        } catch (error) {
            console.error('supabaseAuth.getSession - Error:', error);
            return null;
        }
    },

    // Logout user
    logout: async () => {
        try {
            console.log('supabaseAuth.logout - Logging out');
            const { error } = await supabase.auth.signOut();

            if (error) {
                console.error('supabaseAuth.logout - Error:', error);
                throw error;
            }

            console.log('supabaseAuth.logout - Logout successful');
        } catch (error) {
            console.error('supabaseAuth.logout - Error:', error);
            throw error;
        }
    },

    // Check if user is logged in
    isLoggedIn: async () => {
        try {
            console.log('supabaseAuth.isLoggedIn - Checking login status');
            const session = await supabaseAuth.getSession();
            const isLoggedIn = !!session;
            console.log('supabaseAuth.isLoggedIn - Login status:', isLoggedIn);
            return isLoggedIn;
        } catch (error) {
            console.error('supabaseAuth.isLoggedIn - Error:', error);
            return false;
        }
    },
};