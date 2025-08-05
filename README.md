# Music Level 🎵

An AI-powered music generation platform that allows users to create unique musical compositions using artificial intelligence. Built with a modern tech stack featuring NestJS backend and Next.js frontend.

## 🌟 Features

- **AI Music Generation**: Create unique music compositions using advanced AI algorithms
- **Multi-Instrument Support**: Generate music for piano, guitar, violin, flute, and drums
- **User Authentication**: Secure registration and login system with JWT tokens
- **Music Library**: Save, organize, and manage your generated compositions
- **MIDI Export**: Download compositions as standard MIDI files
- **Responsive Design**: Works seamlessly across desktop and mobile devices
- **Real-time Generation**: Live feedback during music creation process

## 🏗️ Architecture

This project follows a secure three-tier architecture with Next.js API routes acting as a proxy layer:

```
Frontend (React) → Next.js API Routes → NestJS Backend
```

```
music_level/
├── backend/          # NestJS API server
├── frontend/         # Next.js web application with API routes
└── README.md        # This file
```

### Security Benefits
- **Hidden Backend**: The NestJS backend URL is never exposed to the client
- **HTTP-Only Cookies**: JWT tokens are stored in secure HTTP-only cookies
- **Server-Side Validation**: Authentication is validated on the server side
- **Request Proxy**: All API requests go through Next.js API routes for additional security

### Backend (NestJS)
- **Framework**: NestJS with TypeScript
- **Database**: Appwrite for user management and file storage
- **AI Integration**: Google Gemini API for music generation
- **Authentication**: JWT with Passport.js
- **File Processing**: MIDI file generation and management
- **Security**: CORS configured to only allow Next.js frontend

### Frontend (Next.js)
- **Framework**: Next.js 15 with App Router
- **UI Library**: React 19 with Tailwind CSS
- **API Layer**: Next.js API routes proxy all backend requests
- **Authentication**: HTTP-only cookies with server-side validation
- **State Management**: React hooks and context
- **Form Handling**: React Hook Form
- **HTTP Client**: Axios (client-side only communicates with Next.js API routes)

## 🚀 Quick Start

### Prerequisites

- Node.js 18+
- npm or yarn
- Appwrite instance (for backend database)
- Google Gemini API key (for AI music generation)

### 1. Clone the Repository

```bash
git clone https://github.com/Amanbig/music_level.git
cd music_level
```

### 2. Backend Setup

```bash
cd backend

# Install dependencies
npm install

# Configure environment variables
cp .env.example .env
# Edit .env with your configuration

# Start the backend server
npm run start:dev
```

The backend will be available at `http://localhost:8000`

### 3. Frontend Setup

```bash
cd frontend

# Install dependencies
npm install

# Configure environment variables
cp .env.local.example .env.local
# Edit .env.local with your configuration

# Start the frontend development server
npm run dev
```

The frontend will be available at `http://localhost:3000`

## 🔧 Configuration

### Backend Environment Variables

```bash
# Server Configuration
PORT=8000
NODE_ENV=development

# Frontend URL for CORS
FRONTEND_URL=http://localhost:3000
CORS_ORIGIN=http://localhost:3000
CORS_CREDENTIALS=true

# Appwrite Configuration
APPWRITE_ENDPOINT=https://your-appwrite-endpoint
APPWRITE_PROJECT_ID=your-project-id
APPWRITE_API_KEY=your-api-key
APPWRITE_DATABASE_ID=your-database-id
APPWRITE_USER_COLLECTION_ID=your-user-collection-id
APPWRITE_GENERATION_COLLECTION_ID=your-generation-collection-id
APPWRITE_BUCKET_ID=your-bucket-id

# Google Gemini API
GEMINI_API_URL=https://generativeai.googleapis.com/v1/models/gemini-pro
GEMINI_API_KEY=your-gemini-api-key
GEMINI_MODEL=gemini-pro

# JWT Configuration
JWT_SECRET=your-jwt-secret
JWT_EXPIRES_IN=7d
```

### Frontend Environment Variables

```bash
# Backend API Configuration (Server-side only)
BACKEND_API_URL=http://localhost:8000  # NestJS backend URL for Next.js API routes
```

**Note**: The frontend uses Next.js API routes as a secure proxy layer. The `BACKEND_API_URL` is only used server-side and never exposed to the client.

## 📚 API Documentation

### Authentication Endpoints

- `POST /auth/signup` - User registration
- `POST /auth/login` - User login
- `POST /auth/logout` - User logout
- `GET /auth/me` - Get current user
- `GET /auth/profile` - Get user profile
- `PUT /auth/profile` - Update user profile

### Music Generation Endpoints

- `POST /generate/ai-response` - Generate music with AI
- `POST /generate/save` - Save generated music
- `GET /generate/user/:userId` - Get user's saved music
- `GET /generate/:id` - Get specific generation
- `GET /generate/:id/download` - Download MIDI file
- `DELETE /generate/:id` - Delete generation

## 🎯 Usage

### 1. User Registration
- Visit the landing page at `http://localhost:3000`
- Click "Get Started" to create a new account
- Fill in your details and verify your email

### 2. Generate Music
- Navigate to the "Generate" page
- Specify your preferences:
  - Song name (optional)
  - Instrument (piano, guitar, violin, flute, drums)
  - Additional instructions for the AI
- Click "Generate Music" and wait for the AI to create your composition

### 3. Manage Your Library
- View all your saved compositions on the Dashboard
- Download MIDI files for use in other music software
- Delete compositions you no longer need
- Add descriptions to organize your music

## 🛠️ Development

### Backend Development

```bash
cd backend

# Development with hot reload
npm run start:dev

# Build for production
npm run build

# Run tests
npm run test

# Run linting
npm run lint
```

### Frontend Development

```bash
cd frontend

# Development server with Turbopack
npm run dev

# Build for production
npm run build

# Start production server
npm run start

# Run linting
npm run lint
```

## 🚀 Deployment

### Backend Deployment

1. **Environment Setup**: Configure production environment variables
2. **Build**: Run `npm run build`
3. **Deploy**: Use platforms like Railway, Heroku, or DigitalOcean
4. **Database**: Ensure Appwrite is configured for production

### Frontend Deployment

1. **Vercel (Recommended)**:
   - Connect your GitHub repository
   - Set environment variables in Vercel dashboard
   - Deploy automatically on push to main branch

2. **Manual Deployment**:
   - Build: `npm run build`
   - Deploy the `.next` folder to your hosting provider

## 🤝 Contributing

We welcome contributions! Please follow these steps:

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/amazing-feature`
3. Commit your changes: `git commit -m 'Add amazing feature'`
4. Push to the branch: `git push origin feature/amazing-feature`
5. Open a Pull Request

### Development Guidelines

- Follow TypeScript best practices
- Write tests for new features
- Use conventional commit messages
- Ensure code passes linting checks
- Update documentation as needed

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- **Google Gemini API** for AI music generation capabilities
- **Appwrite** for backend-as-a-service infrastructure
- **NestJS** and **Next.js** communities for excellent frameworks
- **Tone.js** for MIDI processing and audio capabilities

## 📞 Support

If you encounter any issues or have questions:

1. Check the [Issues](https://github.com/Amanbig/music_level/issues) page
2. Create a new issue with detailed information
3. Join our community discussions

## 🗺️ Roadmap

- [ ] Real-time MIDI playback in browser
- [ ] Advanced music theory integration
- [ ] Collaborative composition features
- [ ] Mobile app development
- [ ] Integration with popular DAWs
- [ ] AI model fine-tuning for better results

---

**Music Level** - Empowering creativity through AI-powered music generation 🎵
