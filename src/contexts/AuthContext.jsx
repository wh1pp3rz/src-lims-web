import React, { createContext, useState, useEffect, useMemo, useCallback } from 'react';
import authService from '../services/authService.js';
import { getTokenStatus } from '../utils/tokenUtils.js';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    // Force logout when tokens are expired
    const forceLogout = useCallback(async () => {
        console.log('Forcing logout due to expired tokens');
        setUser(null);
        setError(null);
        
        // Clean up localStorage
        localStorage.removeItem('accessToken');
        localStorage.removeItem('refreshToken');
        localStorage.removeItem('user');
    }, []);

    // Check token validity and handle expiry
    const checkTokenValidity = useCallback(async () => {
        const tokenStatus = getTokenStatus();
        
        // If we should logout (no refresh token or refresh token expired)
        if (tokenStatus.shouldLogout) {
            if (user) {
                await forceLogout();
            }
            return false;
        }
        
        return true;
    }, [user, forceLogout]);

    // Update user context when tokens are refreshed (called from api interceptor indirectly)
    const updateAuthState = useCallback(() => {
        const storedUser = authService.getStoredUser();
        if (storedUser && authService.isAuthenticated()) {
            setUser(storedUser);
        }
    }, []);

    useEffect(() => {
        const initializeAuth = async () => {
            try {
                const storedUser = authService.getStoredUser();

                if (storedUser && authService.isAuthenticated()) {
                    // Check if tokens are still valid (inline to avoid dependency issues)
                    const tokenStatus = getTokenStatus();
                    
                    // If we should logout (no refresh token or refresh token expired)
                    if (tokenStatus.shouldLogout) {
                        // Clean up localStorage
                        localStorage.removeItem('accessToken');
                        localStorage.removeItem('refreshToken');
                        localStorage.removeItem('user');
                    } else {
                        setUser(storedUser);
                    }
                }
            } catch (error) {
                console.error('Auth initialization error:', error);
                setError(error);
            } finally {
                setLoading(false);
            }
        };

        initializeAuth();
    }, []); // Empty dependency array - only run on mount

    // Periodic token validity check
    useEffect(() => {
        if (!user) return;

        const interval = setInterval(() => {
            checkTokenValidity();
        }, 60000); // Check every minute

        return () => clearInterval(interval);
    }, [user, checkTokenValidity]);

    const login = async (credentials) => {
        try {
            setLoading(true);
            setError(null);
            const { user } = await authService.login(credentials);
            setUser(user);

            return { success: true };
        } catch (error) {
            setError(error);

            return { success: false, error };
        } finally {
            setLoading(false);
        }
    };

    const logout = async () => {
        try {
            setLoading(true);
            await authService.logout();
            setUser(null);
            setError(null);
        } catch (error) {
            console.error('Logout error:', error);
        } finally {
            setLoading(false);
        }
    };

    const value = useMemo(
        () => ({
            user,
            loading,
            error,
            login,
            logout,
            checkTokenValidity,
            updateAuthState,
            isAuthenticated: !!user,
        }),
        [user, loading, error, checkTokenValidity, updateAuthState]
    );

    return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export default AuthContext;
