/**
 * Unified permission checking utilities for the frontend
 * This replaces the scattered permission logic across components
 */

// Audit permission groups for special handling
const AUDIT_PERMISSIONS = ['audit_logs_basic', 'audit_logs_security', 'audit_logs_system'];

/**
 * Check if user has a specific permission
 * @param {Object} user - The user object with permissions array and role
 * @param {string} permission - The permission name to check
 * @returns {boolean} True if user has the permission
 */
export const hasPermission = (user, permission) => {
    if (!user) return false;
    
    // If no permission is required, allow access
    if (!permission) return true;
    
    // Admin role has all permissions
    if (user.role?.toLowerCase() === 'admin') return true;
    
    // Special handling for audit logs - check for any audit permission
    if (permission === 'audit_logs') {
        return hasAuditPermission(user);
    }
    
    // Check if user has the specific permission
    return user.permissions?.includes(permission) || false;
};

/**
 * Check if user has any of the provided permissions
 * @param {Object} user - The user object with permissions array and role
 * @param {string[]} permissions - Array of permission names to check
 * @returns {boolean} True if user has any of the permissions
 */
export const hasAnyPermission = (user, permissions) => {
    if (!user) return false;
    
    // If no permissions required, allow access
    if (!permissions || permissions.length === 0) return true;
    
    // Admin role has all permissions
    if (user.role?.toLowerCase() === 'admin') return true;
    
    return permissions.some(permission => user.permissions?.includes(permission));
};

/**
 * Check if user has all of the provided permissions
 * @param {Object} user - The user object with permissions array and role
 * @param {string[]} permissions - Array of permission names to check
 * @returns {boolean} True if user has all permissions
 */
export const hasAllPermissions = (user, permissions) => {
    if (!user) return false;
    
    // Admin role has all permissions
    if (user.role?.toLowerCase() === 'admin') return true;
    
    return permissions.every(permission => user.permissions?.includes(permission));
};

/**
 * Special check for audit log permissions
 * Returns true if user has any level of audit log access
 * @param {Object} user - The user object with permissions array and role
 * @returns {boolean} True if user has any audit permission
 */
export const hasAuditPermission = (user) => {
    return hasAnyPermission(user, AUDIT_PERMISSIONS);
};

/**
 * Check if user has specific audit permission level
 * @param {Object} user - The user object with permissions array and role
 * @param {string} level - The audit level ('basic', 'security', 'system')
 * @returns {boolean} True if user has that audit permission level or higher
 */
export const hasAuditPermissionLevel = (user, level) => {
    if (!user) return false;
    
    // Admin has all permissions
    if (user.role?.toLowerCase() === 'admin') return true;
    
    const levelMap = {
        'basic': ['audit_logs_basic', 'audit_logs_security', 'audit_logs_system'],
        'security': ['audit_logs_security', 'audit_logs_system'], 
        'system': ['audit_logs_system']
    };
    
    const allowedPermissions = levelMap[level] || [];
    return allowedPermissions.some(permission => user.permissions?.includes(permission));
};

/**
 * Check if user has a specific role
 * @param {Object} user - The user object with role
 * @param {string} role - The role name to check
 * @returns {boolean} True if user has the role
 */
export const hasRole = (user, role) => {
    if (!user) return false;
    return user.role?.toLowerCase() === role.toLowerCase();
};

/**
 * Check if user has any of the provided roles
 * @param {Object} user - The user object with role
 * @param {string[]} roles - Array of role names to check
 * @returns {boolean} True if user has any of the roles
 */
export const hasAnyRole = (user, roles) => {
    if (!user) return false;
    return roles.some(role => hasRole(user, role));
};

/**
 * Get the highest audit permission level for the user
 * @param {Object} user - The user object with permissions array and role
 * @returns {string|null} The highest audit permission level or null
 */
export const getAuditPermissionLevel = (user) => {
    if (!user) return null;
    
    // Admin has all permissions
    if (user.role?.toLowerCase() === 'admin') return 'audit_logs_system';
    
    // Check in order of privilege (system > security > basic)
    if (user.permissions?.includes('audit_logs_system')) return 'audit_logs_system';
    if (user.permissions?.includes('audit_logs_security')) return 'audit_logs_security';
    if (user.permissions?.includes('audit_logs_basic')) return 'audit_logs_basic';
    
    return null;
};

/**
 * Check if user can perform a specific action on a resource
 * Useful for more complex permission checking
 * @param {Object} user - The user object
 * @param {string} action - The action (create, read, update, delete, manage)
 * @param {string} resource - The resource (user, sample, test, etc.)
 * @returns {boolean} True if user can perform the action
 */
export const canPerformAction = (user, action, resource) => {
    if (!user) return false;
    
    // Admin can do everything
    if (user.role?.toLowerCase() === 'admin') return true;
    
    // Check for specific permission patterns
    const permissionPatterns = [
        `${resource}_${action}`,
        `${resource}_management`,
    ];
    
    return permissionPatterns.some(pattern => user.permissions?.includes(pattern));
};

/**
 * Filter an array of items based on permission requirements
 * @param {Array} items - Array of items with permission property
 * @param {Object} user - The user object
 * @returns {Array} Filtered array of items user has permission to access
 */
export const filterByPermissions = (items, user) => {
    if (!user) return [];
    
    return items.filter(item => {
        if (!item.permission) return true; // No permission required
        
        // Handle special cases
        if (item.permission === 'audit_logs') {
            return hasAuditPermission(user);
        }
        
        return hasPermission(user, item.permission);
    });
};

// Export the AUDIT_PERMISSIONS constant for use in components
export { AUDIT_PERMISSIONS };