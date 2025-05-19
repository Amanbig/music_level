import { supabase } from './supabase';

// Define storage bucket for MIDI files
const MIDI_BUCKET_NAME = 'midi-files';

// Ensure bucket exists and is properly configured
const ensureBucketExists = async () => {
    try {
        const { data: buckets } = await supabase.storage.listBuckets();
        const bucketExists = buckets?.some(b => b.name === MIDI_BUCKET_NAME);

        // if (!bucketExists) {
        //     throw new Error('Bucket "midi-files" does not exist. Please create it in the Supabase dashboard.');
        // }
    } catch (error) {
        console.error('Error checking bucket:', error);
        throw error;
    }
};

/**
 * Upload a MIDI file to Supabase storage
 * @param midiBuffer The MIDI file data as a Buffer or ArrayBuffer
 * @param userId The ID of the user who owns the file
 * @param fileName The desired file name (without path)
 * @param metadata Additional metadata for the file
 * @returns The uploaded file data
 */
export const uploadMidiFile = async (
    midiBuffer: Buffer | ArrayBuffer,
    userId: string,
    fileName: string,
    metadata: any = {}
) => {
    try {
        // Ensure bucket exists before upload
        await ensureBucketExists();

        // Create a unique file name
        const uniqueFileName = `${Date.now()}_${fileName}.mid`;

        // Combine user ID with metadata
        const fileMetadata = {
            userId,
            fileName,
            fileSize: midiBuffer.byteLength,
            mimeType: 'audio/midi',
            createdAt: new Date().toISOString(),
            ...metadata,
        };

        // Create a path that includes the user ID
        const filePath = `${userId}/${uniqueFileName}`;

        console.log('Attempting to upload file:', {
            fileName: uniqueFileName,
            fileSize: midiBuffer.byteLength,
            userId,
            bucket: MIDI_BUCKET_NAME,
        });

        // Verify authenticated user
        const { data: { user } } = await supabase.auth.getUser();
        if (!user || user.id !== userId) {
            throw new Error('User authentication mismatch');
        }

        // Basic validation: Check if the buffer starts with MIDI header (MThd)
        const bufferView = new Uint8Array(midiBuffer);
        const midiHeader = String.fromCharCode(...bufferView.slice(0, 4));
        if (midiHeader !== 'MThd') {
            throw new Error('Invalid MIDI file: Missing MThd header');
        }

        // Upload file to Supabase storage
        const { data, error } = await supabase.storage
            .from(MIDI_BUCKET_NAME)
            .upload(filePath, midiBuffer, {
                upsert: true,
                contentType: 'audio/midi',
                cacheControl: '3600',
                metadata: fileMetadata,
            });

        if (error) {
            console.error('Storage upload error:', {
                message: error.message,
                filePath,
                userId,
            });
            throw error;
        }

        console.log('File uploaded successfully:', {
            path: data?.path,
            userId,
            fileName: uniqueFileName,
        });

        return {
            ...data,
            metadata: fileMetadata,
        };
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
        console.log('Attempting to list files for:', { bucket: MIDI_BUCKET_NAME, userId });

        // Verify authenticated user
        const { data: { user } } = await supabase.auth.getUser();
        if (!user || user.id !== userId) {
            throw new Error('User authentication mismatch');
        }

        // List files in the user's directory
        const { data, error } = await supabase.storage
            .from(MIDI_BUCKET_NAME)
            .list(userId, {
                sortBy: { column: 'created_at', order: 'desc' },
            });

        if (error) {
            console.error('Storage list error:', {
                message: error.message,
                userId,
            });
            throw error;
        }

        console.log('Files retrieved successfully:', {
            userId,
            fileCount: data.length,
            files: data.map((f) => ({ name: f.name, id: f.id, created_at: f.created_at })),
        });

        return {
            total: data.length,
            files: data,
        };
    } catch (error) {
        console.error('Error getting user MIDI files:', error);
        throw error;
    }
};

/**
 * Get a download URL for a MIDI file
 * @param userId The ID of the user who owns the file
 * @param fileName The name of the file to download
 * @returns A URL to download the file
 */
export const getMidiFileDownloadUrl = async (userId: string, fileName: string) => {
    try {
        const filePath = `${userId}/${fileName}`;
        console.log('Generating download URL:', { bucket: MIDI_BUCKET_NAME, filePath, userId });

        // Verify authenticated user
        const { data: { user } } = await supabase.auth.getUser();
        if (!user || user.id !== userId) {
            throw new Error('User authentication mismatch');
        }

        const { data, error } = await supabase.storage
            .from(MIDI_BUCKET_NAME)
            .createSignedUrl(filePath, 3600);

        if (error) {
            console.error('Storage signed URL error:', {
                message: error.message,
                filePath,
                userId,
            });
            throw error;
        }

        console.log('Signed URL generated:', data.signedUrl);
        return data.signedUrl;
    } catch (error) {
        console.error('Error getting MIDI file download URL:', error);
        throw error;
    }
};

/**
 * Delete a MIDI file
 * @param userId The ID of the user who owns the file
 * @param fileName The name of the file to delete
 * @returns A promise that resolves when the file is deleted
 */
export const deleteMidiFile = async (userId: string, fileName: string) => {
    try {
        const filePath = `${userId}/${fileName}`;
        console.log('Attempting to delete file:', { bucket: MIDI_BUCKET_NAME, filePath, userId });

        // Verify authenticated user
        const { data: { user } } = await supabase.auth.getUser();
        if (!user || user.id !== userId) {
            throw new Error('User authentication mismatch');
        }

        const { error } = await supabase.storage
            .from(MIDI_BUCKET_NAME)
            .remove([filePath]);

        if (error) {
            console.error('Storage delete error:', {
                message: error.message,
                filePath,
                userId,
            });
            throw error;
        }

        console.log('File deleted successfully:', { filePath, userId });
        return true;
    } catch (error) {
        console.error('Error deleting MIDI file:', error);
        throw error;
    }
};

export default {
    uploadMidiFile,
    getUserMidiFiles,
    getMidiFileDownloadUrl,
    deleteMidiFile,
};