import { Injectable, Logger, NotFoundException } from '@nestjs/common';
import { Midi } from '@tonejs/midi';
import { Note } from './noteDto';
import { GeminiService } from 'src/gemini/gemini.service';
import { AppwriteService } from 'src/appwrite/appwrite.service';
import { GenerationRequestDto, SaveGenerationDto, GenerationResponse } from './dto/generation.dto';
import { ID, Query } from 'node-appwrite';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class GenerateService {
    private readonly logger = new Logger(GenerateService.name);
    private readonly generationsCollectionId: string;

    constructor(
        private geminiService: GeminiService,
        private appwriteService: AppwriteService,
        private configService: ConfigService,
    ) {
        this.generationsCollectionId = this.configService.get<string>('APPWRITE_GENERATIONS_COLLECTION_ID') || 'generations';
    }

    // Batch save multiple generations
    async saveBatchGenerations(saveDtos: SaveGenerationDto[]): Promise<GenerationResponse[]> {
        const results: GenerationResponse[] = [];
        const errors: any[] = [];

        for (const dto of saveDtos) {
            try {
                const result = await this.saveGeneration(dto);
                results.push(result);
            } catch (error) {
                errors.push({ dto, error: error.message });
                this.logger.error(`Error saving generation ${dto.name}:`, error);
            }
        }

        if (errors.length > 0) {
            this.logger.warn(`Batch save completed with ${errors.length} errors:`, errors);
        }

        return results;
    }

    // Batch delete multiple generations
    async deleteBatchGenerations(generationIds: string[], userId: string): Promise<{ success: string[]; failed: string[] }> {
        const success: string[] = [];
        const failed: string[] = [];

        for (const id of generationIds) {
            try {
                await this.deleteGeneration(id, userId);
                success.push(id);
            } catch (error) {
                failed.push(id);
                this.logger.error(`Error deleting generation ${id}:`, error);
            }
        }

        return { success, failed };
    }

    // Function to save a generation with MIDI to Appwrite
    async saveGeneration(saveDto: SaveGenerationDto): Promise<GenerationResponse> {
        try {
            // Generate MIDI file
            const { buffer, midiData } = await this.saveNotesAsMidi(saveDto.notes, saveDto.instrument || 'piano');

            // Create file in Appwrite Storage
            const fileId = ID.unique();
            const fileName = `${saveDto.name.replace(/[^a-zA-Z0-9]/g, '_')}.mid`;

            // Create a File-like object from the buffer
            this.logger.log(`Creating file object: ${fileName}, size: ${buffer.length} bytes`);
            const fileBlob = new Blob([buffer], { type: 'audio/midi' });
            const fileObject = new File([fileBlob], fileName, {
                type: 'audio/midi',
                lastModified: Date.now()
            });

            this.logger.log(`File object created: ${fileObject.name}, size: ${fileObject.size}, type: ${fileObject.type}`);

            // Upload MIDI file
            this.logger.log(`Uploading file to Appwrite storage with ID: ${fileId}`);
            const uploadResult = await this.appwriteService.storage.createFile(
                this.appwriteService.bucketId,
                fileId,
                fileObject
            );
            this.logger.log(`File uploaded successfully: ${uploadResult.$id}, size: ${uploadResult.sizeOriginal} bytes`);

            // Create document in database
            const document = await this.appwriteService.databases.createDocument(
                this.appwriteService.databaseId,
                this.generationsCollectionId,
                ID.unique(),
                {
                    name: saveDto.name,
                    notes: JSON.stringify(saveDto.notes), // Convert array to JSON string
                    midiData: JSON.stringify(midiData),   // Convert object to JSON string
                    fileId: fileId,
                    description: saveDto.description || '',
                    userId: saveDto.userId,
                    instrument: saveDto.instrument || 'piano',
                    createdAt: new Date().toISOString(),
                    updatedAt: new Date().toISOString(),
                }
            );

            return {
                id: document.$id,
                name: document.name,
                notes: JSON.parse(document.notes), // Parse JSON string back to array
                description: document.description,
                userId: document.userId,
                fileId: document.fileId, // Include fileId for download functionality
                instrument: document.instrument,
                createdAt: document.createdAt,
                updatedAt: document.updatedAt,
            };
        } catch (error) {
            this.logger.error('Error saving generation:', error);
            throw new Error('Failed to save generation');
        }
    }

    // Function to get a user's generations
    async getUserGenerations(userId: string): Promise<GenerationResponse[]> {
        try {
            const response = await this.appwriteService.databases.listDocuments(
                this.appwriteService.databaseId,
                this.generationsCollectionId,
                [Query.equal('userId', userId), Query.orderDesc('createdAt')]
            );

            return response.documents.map(doc => ({
                id: doc.$id,
                name: doc.name,
                notes: JSON.parse(doc.notes), // Parse JSON string back to array
                description: doc.description,
                userId: doc.userId,
                fileId: doc.fileId, // Include fileId for download functionality
                instrument: doc.instrument,
                createdAt: doc.createdAt,
                updatedAt: doc.updatedAt,
            }));
        } catch (error) {
            this.logger.error('Error getting user generations:', error);
            throw new Error('Failed to get user generations');
        }
    }

    // Function to get a specific generation
    async getGeneration(generationId: string): Promise<GenerationResponse> {
        try {
            const document = await this.appwriteService.databases.getDocument(
                this.appwriteService.databaseId,
                this.generationsCollectionId,
                generationId
            );

            return {
                id: document.$id,
                name: document.name,
                notes: JSON.parse(document.notes), // Parse JSON string back to array
                description: document.description,
                userId: document.userId,
                fileId: document.fileId, // Include fileId for download functionality
                instrument: document.instrument,
                createdAt: document.createdAt,
                updatedAt: document.updatedAt,
            };
        } catch (error) {
            this.logger.error(`Error getting generation ${generationId}:`, error);
            throw new NotFoundException('Generation not found');
        }
    }

    // Function to delete a generation
    async deleteGeneration(generationId: string, userId: string): Promise<void> {
        try {
            const document = await this.appwriteService.databases.getDocument(
                this.appwriteService.databaseId,
                this.generationsCollectionId,
                generationId
            );

            if (document.userId !== userId) {
                throw new Error('Unauthorized');
            }

            await this.appwriteService.databases.deleteDocument(
                this.appwriteService.databaseId,
                this.generationsCollectionId,
                generationId
            );
        } catch (error) {
            this.logger.error(`Error deleting generation ${generationId}:`, error);
            throw new Error('Failed to delete generation');
        }
    }

    // Function to get structured note data from Gemini with song reference
    async getAIResponse(dto: GenerationRequestDto): Promise<Note[]> {
        let prompt;
        const instrument = dto.instrument || 'piano';

        if (dto.songName) {
            // Prompt for recreating an existing song
            prompt = `
        Generate a JSON array of objects representing ${instrument} notes for an accurate ${instrument} transcription of "${dto.songName}".
        Focus on the main melody and basic chord structure of the song.

        Each object must include:
        - "note": scientific pitch notation (e.g., "C4", "G#5")
        - "time": start time in seconds (non-negative, sequential, e.g., 0, 0.5, 1.0)
        - "duration": note length in seconds (0.1 to 2.0, typically 0.25, 0.5, or 1.0 for rhythmic coherence)
        - "velocity": volume (0.5 to 1.0)

        Requirements:
        - Match the actual notes, key signature, and tempo of "${dto.songName}" as accurately as possible
        - Include both melody and basic accompaniment/chords
        - Start at time 0 and increment times sequentially
        - Aim for at least 16 bars of music to capture the recognizable part of the song
        ${dto.extra ? `- ${dto.extra}` : ''}

        Return only a valid JSON array of note objects, no additional text or code blocks.
        `;
        } else {
            // Original prompt for generating a new melody
            prompt = `
        Generate a JSON array of objects representing ${instrument} notes for a musically coherent melody.
        Each object must include:
        - "note": scientific pitch notation (e.g., "C4", "G#5")
        - "time": start time in seconds (non-negative, sequential, e.g., 0, 0.5, 1.0)
        - "duration": note length in seconds (0.1 to 2.0, typically 0.25, 0.5, or 1.0 for rhythmic coherence)
        - "velocity": volume (0.5 to 1.0)

        Requirements:
        - Ensure rhythmic coherence (use common note durations: quarter=0.5s, eighth=0.25s, half=1.0s)
        - Maintain musical flow (avoid large pitch jumps, use stepwise motion or small intervals)
        - Start at time 0 and increment times sequentially
        ${dto.extra ? `- ${dto.extra}` : ''}

        Return only a valid JSON array of note objects, no additional text or code blocks.
        `;
        }

        try {
            this.logger.log('Sending prompt to Gemini AI...');
            const response = await this.geminiService.generateAI(prompt) as { data?: { text?: string } };

            this.logger.log('Gemini AI response received:', JSON.stringify(response, null, 2));

            // Parse the response safely
            let content = response.data?.text || '';
            this.logger.log('AI response content:', content);

            if (!content) {
                throw new Error('No content in AI response');
            }

            // Strip markdown code fences if present
            content = content.replace(/```json\n|\n```/g, '').trim();
            this.logger.log('Cleaned content:', content);

            let notes;
            try {
                notes = JSON.parse(content);
                this.logger.log('Parsed notes:', notes);
            } catch (e) {
                this.logger.error(`Failed to parse JSON: ${content}`);
                throw new Error(`Failed to parse JSON: ${content}`);
            }

            // Validate notes
            if (!Array.isArray(notes)) {
                this.logger.error('Response is not an array:', notes);
                throw new Error('Response is not an array');
            }

            // Validate each note
            const validNotes = notes.filter((note: any): note is Note => {
                const isValid = typeof note.note === 'string' &&
                    typeof note.time === 'number' && note.time >= 0 &&
                    typeof note.duration === 'number' && note.duration > 0 &&
                    typeof note.velocity === 'number' && note.velocity >= 0 && note.velocity <= 1;

                if (!isValid) {
                    this.logger.warn('Invalid note filtered out:', note);
                }
                return isValid;
            });

            this.logger.log(`Generated ${validNotes.length} valid notes out of ${notes.length} total notes`);

            if (validNotes.length === 0) {
                this.logger.error('No valid notes generated. Original notes:', notes);
                // Return a simple fallback melody if no valid notes are generated
                return [
                    { note: 'C4', time: 0, duration: 0.5, velocity: 0.8 },
                    { note: 'D4', time: 0.5, duration: 0.5, velocity: 0.8 },
                    { note: 'E4', time: 1.0, duration: 0.5, velocity: 0.8 },
                    { note: 'F4', time: 1.5, duration: 0.5, velocity: 0.8 },
                    { note: 'G4', time: 2.0, duration: 1.0, velocity: 0.8 }
                ];
            }

            return validNotes;
        } catch (error: any) {
            this.logger.error('AI generation error:', error);
            throw new Error(`Failed to get valid AI response: ${error.message}`);
        }
    }

    // Function to generate MIDI buffer from notes
    async saveNotesAsMidi(notes: Note[], instrument: string = 'piano'): Promise<{ buffer: Buffer; midiData: any }> {
        try {
            this.logger.log(`Creating MIDI file with ${notes.length} notes for instrument: ${instrument}`);

            const midi = new Midi();
            const track = midi.addTrack();

            const instrumentNumbers: Record<string, number> = {
                piano: 0, // Acoustic Grand Piano
                guitar: 24, // Acoustic Guitar (nylon)
                violin: 40, // Violin
                flute: 73, // Flute
                drums: 118, // Synth Drum
                trumpet: 56, // Trumpet
                saxophone: 66, // Alto Sax
                cello: 42, // Cello
                // Add more instruments as needed
            };

            // Set the instrument using the instrument property
            const instrumentNumber = instrumentNumbers[instrument.toLowerCase()] || 0;
            track.instrument.number = instrumentNumber;
            this.logger.log(`Set instrument number: ${instrumentNumber} for ${instrument}`);

            // Add notes to track with validation
            let addedNotes = 0;
            notes.forEach((note, index) => {
                try {
                    this.logger.debug(`Adding note ${index + 1}: ${note.note} at time ${note.time}, duration ${note.duration}, velocity ${note.velocity}`);
                    track.addNote({
                        name: note.note,
                        time: note.time,
                        duration: note.duration,
                        velocity: note.velocity
                    });
                    addedNotes++;
                } catch (noteError) {
                    this.logger.error(`Error adding note ${index + 1}:`, noteError);
                }
            });

            this.logger.log(`Successfully added ${addedNotes} out of ${notes.length} notes to MIDI track`);

            // Log MIDI track information
            this.logger.log(`MIDI track created with ${track.notes.length} notes`);
            this.logger.log(`MIDI duration: ${midi.duration} seconds`);
            this.logger.log(`MIDI tracks count: ${midi.tracks.length}`);

            // Get MIDI data for storage
            const midiData = {
                duration: midi.duration,
                instrument: instrument,
                notes: notes,
                tracks: midi.tracks.map(track => ({
                    instrument: track.instrument.number,
                    notes: track.notes.map(note => ({
                        name: note.name,
                        time: note.time,
                        duration: note.duration,
                        velocity: note.velocity
                    }))
                }))
            };

            // Create MIDI buffer
            const midiArray = midi.toArray();
            const buffer = Buffer.from(midiArray);

            this.logger.log(`MIDI array length: ${midiArray.length} bytes`);
            this.logger.log(`MIDI buffer length: ${buffer.length} bytes`);
            this.logger.log(`First 20 bytes of MIDI: ${Array.from(midiArray.slice(0, 20)).map(b => b.toString(16).padStart(2, '0')).join(' ')}`);

            return {
                buffer,
                midiData
            };
        } catch (error) {
            this.logger.error('Error generating MIDI:', error);
            throw new Error('Failed to generate MIDI file: ' + error.message);
        }
    }
}
