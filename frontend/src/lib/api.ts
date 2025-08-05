import axios from 'axios';

// Client-side API that communicates with Next.js API routes
const api = axios.create({
  baseURL: '/api', // Use Next.js API routes
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Response interceptor to handle auth errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Redirect to login on authentication errors
      window.location.href = '/auth/login';
    }
    return Promise.reject(error);
  }
);

export default api;