import axios from 'axios';

const BACKEND_API_URL = process.env.BACKEND_API_URL || 'http://localhost:8000';

// Server-side API client for communicating with NestJS backend
export const backendApi = axios.create({
  baseURL: BACKEND_API_URL,
  timeout: 30000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add request interceptor for logging (server-side only)
backendApi.interceptors.request.use(
  (config) => {
    console.log(`[Backend API] ${config.method?.toUpperCase()} ${config.url}`);
    return config;
  },
  (error) => {
    console.error('[Backend API] Request error:', error);
    return Promise.reject(error);
  }
);

// Add response interceptor for error handling
backendApi.interceptors.response.use(
  (response) => response,
  (error) => {
    console.error('[Backend API] Response error:', error.response?.data || error.message);
    return Promise.reject(error);
  }
);

export default backendApi;