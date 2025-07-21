import React, { createContext, useState, useEffect, useMemo } from 'react';
import authService from '../services/authService.js';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const initializeAuth = async () => {
            try {
                const storedUser = authService.getStoredUser();

                if (storedUser && authService.isAuthenticated()) {
                    // Use stored user data for immediate authentication
                    // This prevents logout on navigation
                    setUser(storedUser);
                }
            } catch (error) {
                console.error('Auth initialization error:', error);
                setError(error);
            } finally {
                setLoading(false);
            }
        };

        initializeAuth();
    }, []);

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
            isAuthenticated: !!user,
        }),
        [user, loading, error]
    );

    return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export default AuthContext;
