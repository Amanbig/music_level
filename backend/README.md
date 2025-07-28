# Music Level Backend

A NestJS backend service that generates music using AI (Google's Gemini), converts it to MIDI, and manages user data with Appwrite.

## Features

- 🎵 AI-powered music generation
- 🎹 MIDI file generation and conversion
- 🔐 User authentication and authorization
- 💾 File storage and management
- 🚀 RESTful API endpoints
- 🎼 Support for multiple instruments
- 📦 Batch operations support

## Prerequisites

- Node.js (v16 or higher)
- Appwrite Instance
- Google Gemini API Key
- npm or yarn

## Setup

1. Clone the repository:
```bash
git clone https://github.com/Amanbig/music_level.git
cd music_level/backend
```

2. Install dependencies:
```bash
npm install
```

3. Set up environment variables in `.env`:
```env
# Appwrite Configuration
APPWRITE_ENDPOINT=https://your-appwrite-instance/v1
APPWRITE_PROJECT_ID=your-project-id
APPWRITE_API_KEY=your-api-key
APPWRITE_DATABASE_ID=your-database-id
APPWRITE_USER_COLLECTION_ID=users
APPWRITE_FILES_COLLECTION_ID=files
APPWRITE_GENERATIONS_COLLECTION_ID=generations
APPWRITE_BUCKET_ID=your-bucket-id

# Gemini AI Configuration
GEMINI_API_URL=https://generativeai.googleapis.com/v1/models/gemini-pro
GEMINI_API_KEY=your-gemini-api-key
GEMINI_MODEL=gemini-pro
```

4. Set up Appwrite:
   - Create a new project in Appwrite
   - Create collections with the following schemas:

   **Users Collection:**
   ```json
   {
     "user_id": "string",
     "email": "string",
     "name": "string",
     "created_at": "string",
     "updated_at": "string"
   }
   ```

   **Generations Collection:**
   ```json
   {
     "name": "string",
     "notes": "array",
     "midiData": "object",
     "fileId": "string",
     "description": "string",
     "userId": "string",
     "instrument": "string",
     "createdAt": "string",
     "updatedAt": "string"
   }
   ```

   **Files Collection:**
   ```json
   {
     "fileId": "string",
     "originalName": "string",
     "size": "number",
     "mimeType": "string",
     "userId": "string",
     "createdAt": "string"
   }
   ```

5. Create a storage bucket in Appwrite for MIDI files

## Running the Application

Development mode:
```bash
npm run start:dev
```

Production mode:
```bash
npm run build
npm run start:prod
```

## API Documentation

### Authentication

All endpoints except those marked with @Public() require JWT authentication.

### Endpoints

#### Music Generation

1. Generate Music
```http
POST /generate/ai-response
{
    "songName": "Happy Birthday",  // optional
    "instrument": "piano",         // optional
    "extra": "Make it upbeat"     // optional
}
```

2. Save Generation
```http
POST /generate/save
{
    "name": "My Song",
    "notes": [...],
    "description": "A happy melody",
    "userId": "user123",
    "instrument": "piano"
}
```

3. Batch Save Generations
```http
POST /generate/batch/save
[
    {
        "name": "Song 1",
        "notes": [...],
        "userId": "user123"
    },
    {
        "name": "Song 2",
        "notes": [...],
        "userId": "user123"
    }
]
```

4. Get User's Generations
```http
GET /generate/user/:userId
```

5. Get Specific Generation
```http
GET /generate/:id
```

6. Download MIDI File
```http
GET /generate/:id/download
```

7. Delete Generation
```http
DELETE /generate/:id
{
    "userId": "user123"
}
```

8. Batch Delete Generations
```http
DELETE /generate/batch
{
    "ids": ["gen1", "gen2"],
    "userId": "user123"
}
```

#### User Management

1. Create User
```http
POST /auth/register
{
    "email": "user@example.com",
    "password": "secure_password",
    "name": "John Doe"
}
```

2. Login
```http
POST /auth/login
{
    "email": "user@example.com",
    "password": "secure_password"
}
```

3. Get User Profile
```http
GET /auth/profile/:userId
```

4. Update User Profile
```http
PUT /auth/profile/:userId
{
    "name": "New Name",
    "email": "new.email@example.com"
}
```

### Supported Instruments

- piano (default)
- guitar
- violin
- flute
- drums
- trumpet
- saxophone
- cello

## Error Handling

The API uses standard HTTP status codes:
- 200: Success
- 201: Created
- 400: Bad Request
- 401: Unauthorized
- 403: Forbidden
- 404: Not Found
- 500: Internal Server Error

All error responses include a message explaining the error.

## Testing

Run tests:
```bash
npm run test
```

Run e2e tests:
```bash
npm run test:e2e
```

## Security

- All endpoints are protected with JWT authentication (except those marked with @Public())
- File access is controlled through user ownership
- API keys and sensitive data are managed through environment variables
- Input validation is implemented for all endpoints

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the LICENSE file for details
