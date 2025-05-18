import { Client, Storage, ID } from 'appwrite';
import { appwriteConfig } from './appwrite';

// Initialize Appwrite client
const client = new Client()
    .setEndpoint(appwriteConfig.endpoint)
    .setProject(appwriteConfig.projectId);

// Initialize Storage
const storage = new Storage(client);

// Define bucket ID for MIDI files
// You'll need to create this bucket in the Appwrite console
const MIDI_BUCKET_ID = 'midi-files'; // Replace with your actual bucket ID

/**
 * Upload a MIDI file to Appwrite storage
 * @param file The file to upload
 * @param userId The ID of the user who owns the file
 * @param metadata Additional metadata for the file
 * @returns The uploaded file data
 */
export const uploadMidiFile = async (file: File, userId: string, metadata: any = {}) => {
    try {
        // Combine user ID with metadata
        const fileMetadata = {
            userId,
            fileName: file.name,
            fileSize: file.size,
            mimeType: file.type,
            createdAt: new Date().toISOString(),
            ...metadata
        };

        // Upload file to Appwrite storage
        // Ensure userId is properly formatted for permissions
        // Remove 'user:' prefix if it exists, then add it back to ensure proper format
        const formattedUserId = userId.replace(/^user:/, '');
        const result = await storage.createFile(
            MIDI_BUCKET_ID,
            ID.unique(),
            file,
            [`user:${formattedUserId}`],
            fileMetadata
        );

        return result;
    } catch (error) {
        console.error('Error uploading MIDI file:', error);
        throw error;
    }
};

/**
 * Get a list of MIDI files for a specific user
 * @param userId The ID of the user
 * @returns A list of files
 */
export const getUserMidiFiles = async (userId: string) => {
    try {
        // List files with a query to filter by user ID
        const files = await storage.listFiles(
            MIDI_BUCKET_ID,
            [
                // Filter files by user ID in metadata
                `userId=${userId}`
            ]
        );

        return files;
    } catch (error) {
        console.error('Error getting user MIDI files:', error);
        throw error;
    }
};

/**
 * Get a download URL for a MIDI file
 * @param fileId The ID of the file to download
 * @returns A URL to download the file
 */
export const getMidiFileDownloadUrl = (fileId: string) => {
    try {
        return storage.getFileDownload(MIDI_BUCKET_ID, fileId);
    } catch (error) {
        console.error('Error getting MIDI file download URL:', error);
        throw error;
    }
};

/**
 * Delete a MIDI file
 * @param fileId The ID of the file to delete
 * @returns A promise that resolves when the file is deleted
 */
export const deleteMidiFile = async (fileId: string) => {
    try {
        return await storage.deleteFile(MIDI_BUCKET_ID, fileId);
    } catch (error) {
        console.error('Error deleting MIDI file:', error);
        throw error;
    }
};

export default {
    uploadMidiFile,
    getUserMidiFiles,
    getMidiFileDownloadUrl,
    deleteMidiFile
};