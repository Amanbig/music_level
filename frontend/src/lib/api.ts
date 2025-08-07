import axios from 'axios';

// Client-side API that communicates with Next.js API routes
const api = axios.create({
  baseURL: '/api', // Use Next.js API routes
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Response interceptor to handle errors (without automatic redirects)
api.interceptors.response.use(
  (response) => response,
  (error) => {
    // Log auth errors but don't redirect automatically
    // Let components handle authentication state themselves
    if (error.response?.status === 401) {
      console.log('API: Authentication required');
    }
    return Promise.reject(error);
  }
);

export default api;