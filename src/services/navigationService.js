/**
 * Navigation service to provide React Router navigation to non-component contexts
 * This allows services like API interceptors to use proper navigation instead of window.location
 * 
 * Based on React Router v7 best practices using useNavigate hook
 */

let globalNavigate = null;

/**
 * Set the navigate function from useNavigate hook
 * This should be called once in the App component after Router initialization
 */
export const setNavigate = (navigate) => {
    globalNavigate = navigate;
};

/**
 * Navigate programmatically using React Router
 * Falls back to window.location if navigate is not available
 * 
 * @param {string|number} path - The path to navigate to, or a number for history navigation
 * @param {object} options - Navigation options (replace, state, etc.)
 */
export const navigateTo = (path, options = {}) => {
    if (globalNavigate) {
        try {
            globalNavigate(path, options);
        } catch {
            // Navigation error handled silently
            // Fall back to window.location for string paths
            if (typeof path === 'string') {
                window.location.href = path;
            }
        }
    } else {
        // Fallback to window.location if navigate is not available
        // Fallback to window.location when React Router navigate not available
        if (typeof path === 'string') {
            window.location.href = path;
        } else {
            // For numeric navigation (back/forward), use history API
            window.history.go(path);
        }
    }
};

/**
 * Check if React Router navigation is available
 * @returns {boolean} True if navigate function is available
 */
export const canNavigate = () => {
    return globalNavigate !== null;
};

export default {
    setNavigate,
    navigateTo,
    canNavigate,
};