/**
 * Utility function to test navigation functionality
 * This can be called from the browser console to test navigation
 */

import { navigateTo, canNavigate } from '../services/navigationService.js';

export const testNavigation = () => {
    // Navigation service status check

    // Test navigation to dashboard
    if (canNavigate()) {
        // Testing React Router navigation to /dashboard
        navigateTo('/dashboard');
    } else {
        // Cannot test React Router navigation - navigate function not available
    }
};

// Make available on window for console testing
if (typeof window !== 'undefined') {
    window.testNavigation = testNavigation;
}

export default testNavigation;