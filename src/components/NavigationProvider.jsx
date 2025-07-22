import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { setNavigate } from '../services/navigationService.js';

/**
 * NavigationProvider component that initializes global navigation
 * This component should wrap the app content inside the Router but outside individual routes
 * It sets up the navigate function for use in non-component contexts like API interceptors
 */
export const NavigationProvider = ({ children }) => {
    const navigate = useNavigate();

    useEffect(() => {
        // Set the navigate function globally for use in services
        setNavigate(navigate);
        
        // Cleanup function to reset navigate when component unmounts
        return () => {
            setNavigate(null);
        };
    }, [navigate]);

    return children;
};

export default NavigationProvider;