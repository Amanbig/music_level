# Music Level Frontend

A modern, responsive web application for AI-powered music generation built with Next.js 15, React 19, and Tailwind CSS.

## Features

- **User Authentication**: Secure login and registration system
- **AI Music Generation**: Generate unique music compositions using AI
- **Music Library**: Save, organize, and manage your generated music
- **MIDI Export**: Download compositions as MIDI files
- **Responsive Design**: Works seamlessly on desktop and mobile devices
- **Real-time Updates**: Dynamic UI updates and loading states

## Tech Stack

- **Framework**: Next.js 15 with App Router
- **UI Library**: React 19
- **Styling**: Tailwind CSS 4
- **Form Handling**: React Hook Form
- **HTTP Client**: Axios
- **Icons**: Lucide React
- **Authentication**: JWT with HTTP-only cookies
- **TypeScript**: Full type safety

## Project Structure

```
frontend/
├── src/
│   ├── app/                    # Next.js App Router pages
│   │   ├── auth/              # Authentication pages
│   │   │   ├── login/         # Login page
│   │   │   └── signup/        # Registration page
│   │   ├── dashboard/         # User dashboard
│   │   ├── generate/          # Music generation interface
│   │   ├── landing/           # Landing page for unauthenticated users
│   │   ├── globals.css        # Global styles
│   │   ├── layout.tsx         # Root layout
│   │   └── page.tsx           # Home page (redirects)
│   ├── components/            # Reusable UI components
│   │   ├── ui/               # Base UI components
│   │   │   ├── Alert.tsx     # Alert/notification component
│   │   │   ├── Button.tsx    # Button component
│   │   │   ├── Card.tsx      # Card components
│   │   │   ├── Input.tsx     # Input component
│   │   │   └── Textarea.tsx  # Textarea component
│   │   └── Layout.tsx        # Main app layout with navigation
│   └── lib/                  # Utility libraries
│       ├── api.ts           # Axios configuration and interceptors
│       ├── auth.ts          # Authentication service
│       └── music.ts         # Music generation service
├── .env.local               # Environment variables
├── package.json            # Dependencies and scripts
└── README.md              # This file
```

## Getting Started

### Prerequisites

- Node.js 18+ 
- npm or yarn
- Backend API running on port 8000

### Installation

1. Install dependencies:
```bash
npm install
```

2. Set up environment variables:
```bash
# Copy the example environment file
cp .env.local.example .env.local

# Edit .env.local with your configuration
BACKEND_API_URL=http://localhost:8000
```

3. Start the development server:
```bash
npm run dev
```

4. Open [http://localhost:3000](http://localhost:3000) in your browser.

## Available Scripts

- `npm run dev` - Start development server with Turbopack
- `npm run build` - Build the application for production
- `npm run start` - Start the production server
- `npm run lint` - Run ESLint for code quality

## Architecture

This frontend uses a secure three-tier architecture:

```
Frontend (React) → Next.js API Routes → NestJS Backend
```

### Security Benefits
- **Hidden Backend**: The actual NestJS backend URL is never exposed to the client
- **HTTP-Only Cookies**: JWT tokens are stored in secure HTTP-only cookies
- **Server-Side Validation**: Authentication is validated on the server side
- **Request Proxy**: All API requests go through Next.js API routes for additional security

### API Integration

The frontend communicates with the backend through Next.js API routes:

#### Next.js API Routes (`/api/*`)
- `/api/auth/*` - Authentication endpoints (login, signup, logout, me)
- `/api/generate/*` - Music generation and management endpoints
- All routes handle authentication and forward requests to NestJS backend

#### Frontend Services
- **Authentication Service (`lib/auth.ts`)**: User management and session handling
- **Music Service (`lib/music.ts`)**: Music generation and library management
- **Backend API (`lib/backend-api.ts`)**: Server-side HTTP client for NestJS communication

## Key Features

### 1. Authentication Flow
- Landing page for new users
- Registration with email validation
- Secure login with JWT tokens
- Automatic token refresh
- Protected routes

### 2. Music Generation
- Customizable generation parameters:
  - Song name (optional)
  - Instrument selection (piano, guitar, violin, flute, drums)
  - Additional instructions for AI
- Real-time generation status
- Preview and save generated music

### 3. User Dashboard
- View all saved compositions
- Download MIDI files
- Delete unwanted compositions
- Quick access to generate new music

### 4. Responsive Design
- Mobile-first approach
- Adaptive layouts for all screen sizes
- Touch-friendly interface
- Optimized performance

## Environment Variables

```bash
# Backend API Configuration (Server-side only)
BACKEND_API_URL=http://localhost:8000  # NestJS backend URL for Next.js API routes
```

**Note**: The `BACKEND_API_URL` is only used by Next.js API routes on the server side. The frontend never directly communicates with the NestJS backend, ensuring better security.

## Deployment

### Vercel (Recommended)
1. Connect your GitHub repository to Vercel
2. Set environment variables in Vercel dashboard
3. Deploy automatically on push to main branch

### Manual Deployment
1. Build the application:
```bash
npm run build
```

2. Start the production server:
```bash
npm run start
```

## Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/new-feature`
3. Commit changes: `git commit -am 'Add new feature'`
4. Push to branch: `git push origin feature/new-feature`
5. Submit a pull request

## Troubleshooting

### Common Issues

1. **API Connection Issues**
   - Verify NestJS backend is running on port 8000
   - Check `BACKEND_API_URL` environment variable is set correctly
   - Ensure CORS configuration in NestJS backend allows Next.js origin
   - Check Next.js API routes are working: visit `/api/auth/me` in browser

2. **Authentication Problems**
   - Clear browser cookies (JWT tokens are stored in HTTP-only cookies)
   - Check if Next.js API routes are properly forwarding auth headers
   - Verify NestJS backend authentication endpoints are working
   - Check browser Network tab for API route responses

3. **Build Errors**
   - Clear `.next` directory: `rm -rf .next`
   - Reinstall dependencies: `rm -rf node_modules && npm install`
   - Check TypeScript errors: `npm run lint`
   - Verify all API route files are properly structured

4. **Next.js API Route Issues**
   - Check server logs for API route errors
   - Verify `BACKEND_API_URL` is accessible from the Next.js server
   - Test backend endpoints directly with tools like Postman
   - Ensure proper error handling in API routes

## License

This project is part of the Music Level application suite.
