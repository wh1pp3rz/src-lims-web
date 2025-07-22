import axios from 'axios';
import { navigateTo } from './navigationService.js';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'https://src-lims-api.code.orb.local/api';

// Create axios instance
export const api = axios.create({
    baseURL: API_BASE_URL,
    headers: {
        'Content-Type': 'application/json',
    },
});

// Request interceptor to add auth token
api.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem('accessToken');
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

// Response interceptor to handle token refresh
api.interceptors.response.use(
    (response) => response,
    async (error) => {
        const originalRequest = error.config;

        // Only handle 401 errors that haven't been retried and aren't auth endpoints
        if (error.response?.status === 401 && 
            !originalRequest._retry && 
            !originalRequest.url?.includes('/auth/')) {
            
            originalRequest._retry = true;

            try {
                const refreshToken = localStorage.getItem('refreshToken');
                if (!refreshToken) {
                    throw new Error('No refresh token available');
                }

                console.log('Attempting token refresh...');
                
                // Use a separate axios instance to avoid interceptor loops
                const response = await axios.post(`${API_BASE_URL}/auth/refresh`, {
                    refreshToken,
                }, {
                    timeout: 10000, // 10 second timeout
                });

                const { tokens } = response.data;
                if (!tokens || !tokens.accessToken || !tokens.refreshToken) {
                    throw new Error('Invalid token response');
                }

                localStorage.setItem('accessToken', tokens.accessToken);
                localStorage.setItem('refreshToken', tokens.refreshToken);

                console.log('Token refresh successful');

                // Update the authorization header and retry
                originalRequest.headers.Authorization = `Bearer ${tokens.accessToken}`;
                return api(originalRequest);

            } catch (refreshError) {
                console.error('Token refresh failed:', refreshError);
                
                // Clear all auth data
                localStorage.removeItem('accessToken');
                localStorage.removeItem('refreshToken');
                localStorage.removeItem('user');
                
                // Navigate to login
                try {
                    navigateTo('/login', { replace: true });
                } catch (navError) {
                    // Fallback if navigation service fails
                    console.error('Navigation failed, using window.location:', navError);
                    window.location.href = '/login';
                }
                
                // Return a rejected promise with clear error
                return Promise.reject(new Error('Session expired. Please log in again.'));
            }
        }

        return Promise.reject(error);
    }
);

export default api;
