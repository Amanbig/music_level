import { Client, Account, ID } from 'appwrite';

// Appwrite configuration
export const appwriteConfig = {
    endpoint: 'https://cloud.appwrite.io/v1', // Your Appwrite endpoint
    projectId: '682a11d0003a25850112', // Your Appwrite project ID
    databaseId: '682a12620002896be20d', // Your Appwrite database ID
    storageBucketId: 'midi-files', // Your Appwrite storage bucket ID
};

// Initialize the Appwrite client
export const client = new Client()
    .setEndpoint(appwriteConfig.endpoint)
    .setProject(appwriteConfig.projectId);

// Initialize Appwrite account
export const account = new Account(client);

// Authentication helper functions
export const appwriteAuth = {
    // Create a new user account
    createAccount: async (email: string, password: string, name: string) => {
        try {
            const newAccount = await account.create(
                ID.unique(),
                email,
                password,
                name
            );

            if (newAccount) {
                // Log in the user immediately after account creation
                return await appwriteAuth.login(email, password);
            }

            return newAccount;
        } catch (error) {
            console.error('Appwrite service :: createAccount :: error', error);
            throw error;
        }
    },

    // Login user
    login: async (email: string, password: string) => {
        try {
            console.log('appwriteAuth.login - Attempting login with email:', email);
            console.log('appwriteAuth.login - Password length:', password.length);
            const session = await account.createEmailPasswordSession(email, password);
            console.log('appwriteAuth.login - Session created:', session);
            // Verify current user immediately after login
            const currentUser = await account.get();
            console.log('appwriteAuth.login - Current user after login:', currentUser);
            return session;
        } catch (error) {
            console.error('appwriteAuth.login - Error:', error);
            throw error;
        }
    },

    // Get current user
    getCurrentUser: async () => {
        try {
            return await account.get();
        } catch (error) {
            console.error('Appwrite service :: getCurrentUser :: error', error);
            return null;
        }
    },

    // Logout user
    logout: async () => {
        try {
            return await account.deleteSession('current');
        } catch (error) {
            console.error('Appwrite service :: logout :: error', error);
            throw error;
        }
    },

    // Check if user is logged in
    isLoggedIn: async () => {
        try {
            const currentAccount = await appwriteAuth.getCurrentUser();
            return Boolean(currentAccount);
        } catch (error) {
            return false;
        }
    }
};