/**
 * Utility function to test navigation functionality
 * This can be called from the browser console to test navigation
 */

import { navigateTo, canNavigate } from '../services/navigationService.js';

export const testNavigation = () => {
    console.log('Navigation service status:', {
        canNavigate: canNavigate(),
        message: canNavigate() 
            ? 'React Router navigation is available' 
            : 'React Router navigation not available, will fall back to window.location'
    });

    // Test navigation to dashboard
    if (canNavigate()) {
        console.log('Testing React Router navigation to /dashboard...');
        navigateTo('/dashboard');
    } else {
        console.log('Cannot test React Router navigation - navigate function not available');
    }
};

// Make available on window for console testing
if (typeof window !== 'undefined') {
    window.testNavigation = testNavigation;
}

export default testNavigation;