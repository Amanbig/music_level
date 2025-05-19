import Error from 'next/error';
import { supabase } from './supabase';

// Define storage bucket for MIDI files
const MIDI_BUCKET_NAME = 'midi-files';

// SQL for required storage policies:
/*
-- Allow authenticated users to upload files
CREATE POLICY "Users can upload files"
ON storage.objects
FOR INSERT
TO authenticated
WITH CHECK (bucket_id = 'midi-files' AND auth.uid()::text = (storage.foldername(name))[1]);

-- Allow users to read their own files
CREATE POLICY "Users can read own files"
ON storage.objects
FOR SELECT
TO authenticated
USING (bucket_id = 'midi-files' AND auth.uid()::text = (storage.foldername(name))[1]);

-- Allow users to update their own files
CREATE POLICY "Users can update own files"
ON storage.objects
FOR UPDATE
TO authenticated
USING (bucket_id = 'midi-files' AND auth.uid()::text = (storage.foldername(name))[1]);

-- Allow users to delete their own files
CREATE POLICY "Users can delete own files"
ON storage.objects
FOR DELETE
TO authenticated
USING (bucket_id = 'midi-files' AND auth.uid()::text = (storage.foldername(name))[1]);
*/

// Ensure bucket exists and is properly configured
const ensureBucketExists = async () => {
    try {
        const { data: buckets } = await supabase.storage.listBuckets();
        const bucketExists = buckets?.some(b => b.name === MIDI_BUCKET_NAME);

        if (!bucketExists) {
            const { error } = await supabase.storage.createBucket(MIDI_BUCKET_NAME, {
                public: false,
                fileSizeLimit: 10485760, // 10MB
                allowedMimeTypes: ['audio/midi', 'audio/x-midi']
            });
            if (error) throw error;
        }
    } catch (error) {
        console.error('Error ensuring bucket exists:', error);
        throw error;
    }
}

/**
 * Upload a MIDI file to Supabase storage
 * @param file The file to upload
 * @param userId The ID of the user who owns the file
 * @param metadata Additional metadata for the file
 * @returns The uploaded file data
 */
export const uploadMidiFile = async (file: File, userId: string, metadata: any = {}) => {
    try {
        // Ensure bucket exists before upload
        await ensureBucketExists();

        // Validate file type and size
        // if (!file.type.includes('midi')) {
        //     throw new Error('Invalid file type. Only MIDI files are allowed.');
        // }

        // if (file.size > 10485760) { // 10MB
        //     throw new Error('File size exceeds limit of 10MB.');
        // }
        // Create a unique file name
        const fileName = `${Date.now()}_${file.name}`;

        // Combine user ID with metadata
        const fileMetadata = {
            userId,
            fileName: file.name,
            fileSize: file.size,
            mimeType: file.type,
            createdAt: new Date().toISOString(),
            ...metadata
        };

        // Create a path that includes the user ID for better organization and permissions
        const filePath = `${userId}/${fileName}`;

        console.log('Attempting to upload file:', {
            fileName: file.name,
            fileSize: file.size,
            fileType: file.type,
            userId,
            bucket: MIDI_BUCKET_NAME
        });

        // Upload file to Supabase storage
        const { data, error } = await supabase.storage
            .from(MIDI_BUCKET_NAME)
            .upload(filePath, file, {
                upsert: true, // Allow overwriting existing files
                contentType: 'audio/midi',
                cacheControl: '3600',
                metadata: fileMetadata
            });

        if (error) {
            console.error('Storage upload error:', {
                // status: error.status,
                message: error.message,
                // details: error.details,
                filePath,
                userId
            });
            throw error;
        }

        console.log('File uploaded successfully:', {
            path: data?.path,
            userId,
            fileName: file.name
        });

        // Return the file data with metadata
        return {
            ...data,
            metadata: fileMetadata
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
        // List files in the user's directory
        const { data, error } = await supabase.storage
            .from(MIDI_BUCKET_NAME)
            .list(userId, {
                sortBy: { column: 'created_at', order: 'desc' }
            });

        if (error) {
            console.error('Storage upload error:', {
                // status: error.status,
                message: error.message,
                // details: error.details,
                // filePath,
                userId
            });
            throw error;
        }

        console.log('File uploaded successfully:', {
            // path: data?.path,
            userId,
            // fileName: file.name
        });

        return {
            total: data.length,
            files: data
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
export const getMidiFileDownloadUrl = (userId: string, fileName: string) => {
    try {
        const filePath = `${userId}/${fileName}`;
        const { data } = supabase.storage
            .from(MIDI_BUCKET_NAME)
            .getPublicUrl(filePath);

        return data.publicUrl;
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
        const { error } = await supabase.storage
            .from(MIDI_BUCKET_NAME)
            .remove([filePath]);

        if (error) {
            console.error('Storage upload error:', {
                // status: error.status,
                message: error.message,
                // details: error.details,
                filePath,
                userId
            });
            throw error;
        }

        console.log('File uploaded successfully:', {
            // path: data?.path,
            userId,
            // fileName: file.name
        });

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
    deleteMidiFile
};