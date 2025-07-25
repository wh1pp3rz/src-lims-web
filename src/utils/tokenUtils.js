/**
 * Token utility functions for JWT handling
 */

/**
 * Decode JWT token without verification (client-side only, for expiry checking)
 * @param {string} token - JWT token to decode
 * @returns {object|null} - Decoded payload or null if invalid
 */
export const decodeJWT = (token) => {
    if (!token) return null;

    try {
        const parts = token.split('.');
        if (parts.length !== 3) return null;

        const payload = parts[1];
        const decoded = JSON.parse(atob(payload));

        return decoded;
    } catch {
        // Failed to decode JWT token

        return null;
    }
};

/**
 * Check if JWT token is expired (client-side only)
 * @param {string} token - JWT token to check
 * @returns {boolean} - true if expired or invalid, false if valid
 */
export const isTokenExpired = (token) => {
    const decoded = decodeJWT(token);
    if (!decoded || !decoded.exp) return true;

    const now = Math.floor(Date.now() / 1000);

    return decoded.exp <= now;
};

/**
 * Check if JWT token will expire soon (within buffer time)
 * @param {string} token - JWT token to check
 * @param {number} bufferSeconds - Buffer time in seconds (default: 300 = 5 minutes)
 * @returns {boolean} - true if will expire soon, false otherwise
 */
export const isTokenExpiringSoon = (token, bufferSeconds = 300) => {
    const decoded = decodeJWT(token);
    if (!decoded || !decoded.exp) return true;

    const now = Math.floor(Date.now() / 1000);

    return decoded.exp <= now + bufferSeconds;
};

/**
 * Get token expiry time
 * @param {string} token - JWT token
 * @returns {Date|null} - Expiry date or null if invalid
 */
export const getTokenExpiry = (token) => {
    const decoded = decodeJWT(token);
    if (!decoded || !decoded.exp) return null;

    return new Date(decoded.exp * 1000);
};

/**
 * Get time until token expires
 * @param {string} token - JWT token
 * @returns {number} - Seconds until expiry, or 0 if expired/invalid
 */
export const getTimeUntilExpiry = (token) => {
    const decoded = decodeJWT(token);
    if (!decoded || !decoded.exp) return 0;

    const now = Math.floor(Date.now() / 1000);
    const timeLeft = decoded.exp - now;

    return Math.max(0, timeLeft);
};

/**
 * Check if both access and refresh tokens are valid
 * @returns {object} - Status of both tokens
 */
export const getTokenStatus = () => {
    const accessToken = localStorage.getItem('accessToken');
    const refreshToken = localStorage.getItem('refreshToken');

    return {
        hasAccessToken: !!accessToken,
        hasRefreshToken: !!refreshToken,
        accessTokenExpired: !accessToken || isTokenExpired(accessToken),
        refreshTokenExpired: !refreshToken || isTokenExpired(refreshToken),
        accessTokenExpiringSoon: accessToken ? isTokenExpiringSoon(accessToken) : true,
        canRefresh: refreshToken && !isTokenExpired(refreshToken),
        shouldLogout: !refreshToken || isTokenExpired(refreshToken),
    };
};
