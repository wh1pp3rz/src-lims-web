import api from './api.js';
import { getTokenStatus, isTokenExpired } from '../utils/tokenUtils.js';

export const authService = {
    async login(credentials) {
        try {
            const response = await api.post('/auth/login', credentials);
            const { user, tokens } = response.data;
            const { accessToken, refreshToken } = tokens;

            localStorage.setItem('accessToken', accessToken);
            localStorage.setItem('refreshToken', refreshToken);
            localStorage.setItem('user', JSON.stringify(user));

            return { user, accessToken, refreshToken };
        } catch (error) {
            throw error.response?.data || error;
        }
    },

    async logout() {
        try {
            const refreshToken = localStorage.getItem('refreshToken');
            if (refreshToken) {
                await api.post('/auth/logout', { refreshToken });
            }
        } catch (error) {
            console.error('Logout error:', error);
        } finally {
            localStorage.removeItem('accessToken');
            localStorage.removeItem('refreshToken');
            localStorage.removeItem('user');
        }
    },

    async getCurrentUser() {
        try {
            const response = await api.get('/auth/me');
            return response.data.user;
        } catch (error) {
            throw error.response?.data || error;
        }
    },

    getStoredUser() {
        const user = localStorage.getItem('user');

        return user ? JSON.parse(user) : null;
    },

    getAccessToken() {
        return localStorage.getItem('accessToken');
    },

    isAuthenticated() {
        const token = this.getAccessToken();
        const user = this.getStoredUser();
        const tokenStatus = getTokenStatus();

        // Check if we have basic requirements AND at least one valid token
        return !!(token && user && !tokenStatus.shouldLogout);
    },

    // Enhanced method to check token validity
    getTokenValidityStatus() {
        return getTokenStatus();
    },

    // Method to refresh tokens manually
    async refreshTokens() {
        try {
            const refreshToken = localStorage.getItem('refreshToken');
            if (!refreshToken || isTokenExpired(refreshToken)) {
                throw new Error('No valid refresh token available');
            }

            const response = await api.post('/auth/refresh', { refreshToken });
            const { tokens } = response.data;
            
            localStorage.setItem('accessToken', tokens.accessToken);
            localStorage.setItem('refreshToken', tokens.refreshToken);
            
            return tokens;
        } catch (error) {
            // Clean up on failure
            this.clearTokens();
            throw error;
        }
    },

    // Helper to clear all stored auth data
    clearTokens() {
        localStorage.removeItem('accessToken');
        localStorage.removeItem('refreshToken');
        localStorage.removeItem('user');
    },
};

export default authService;
