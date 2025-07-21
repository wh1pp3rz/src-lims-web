import api from './api.js';

export const userService = {
    // Get all users with optional filters
    async getUsers(params = {}) {
        const searchParams = new URLSearchParams();

        if (params.search) searchParams.append('search', params.search);
        if (params.role) searchParams.append('role', params.role);
        if (params.status) searchParams.append('status', params.status);
        if (params.page) searchParams.append('page', params.page);
        if (params.limit) searchParams.append('limit', params.limit);
        if (params.sortBy) searchParams.append('sortBy', params.sortBy);
        if (params.sortOrder) searchParams.append('sortOrder', params.sortOrder);

        const queryString = searchParams.toString();
        const url = `/users${queryString ? `?${queryString}` : ''}`;

        const response = await api.get(url);

        return response.data;
    },

    // Get a single user by ID
    async getUser(userId) {
        const response = await api.get(`/users/${userId}`);

        return response.data;
    },

    // Create a new user
    async createUser(userData) {
        const response = await api.post('/users', userData);

        return response.data;
    },

    // Update an existing user
    async updateUser(userId, userData) {
        const response = await api.put(`/users/${userId}`, userData);

        return response.data;
    },

    // Delete a user (soft delete)
    async deleteUser(userId) {
        const response = await api.delete(`/users/${userId}`);

        return response.data;
    },

    // Deactivate a user
    async deactivateUser(userId) {
        const response = await api.put(`/users/${userId}/deactivate`);
        return response.data;
    },

    // Activate a user
    async activateUser(userId) {
        const response = await api.put(`/users/${userId}/activate`);

        return response.data;
    },

    // Reset user password
    async resetPassword(userId) {
        const response = await api.post(`/users/${userId}/reset-password`);

        return response.data;
    },

    // Get available roles
    async getRoles() {
        const response = await api.get('/users/roles');
        return response.data;
    },

    // Get user's effective permissions
    async getUserPermissions(userId) {
        const response = await api.get(`/users/${userId}/permissions`);
        return response.data;
    },

    // Get user's effective permissions (detailed)
    async getUserEffectivePermissions(userId) {
        const response = await api.get(`/users/${userId}/effective-permissions`);

        return response.data;
    },

    // Grant permission to user
    async grantUserPermission(userId, permissionData) {
        const response = await api.post(`/users/${userId}/permissions/grant`, permissionData);

        return response.data;
    },

    // Deny permission for user
    async denyUserPermission(userId, permissionData) {
        const response = await api.post(`/users/${userId}/permissions/deny`, permissionData);

        return response.data;
    },

    // Remove permission override
    async removeUserPermissionOverride(userId, permissionId, type) {
        // Use the correct backend API endpoint structure
        const response = await api.delete(
            `/users/${userId}/permissions/${permissionId}?type=${type}`
        );

        return response.data;
    },

    // Set custom role for user
    async setUserCustomRole(userId, customRoleId) {
        const response = await api.put(`/users/${userId}/role/custom`, { customRoleId });

        return response.data;
    },

    // Remove custom role for user
    async removeUserCustomRole(userId) {
        const response = await api.delete(`/users/${userId}/role/custom`);

        return response.data;
    },

    // Bulk operations
    async bulkUpdateUsers(userIds, updates) {
        const response = await api.patch('/users/bulk', { userIds, updates });
        return response.data;
    },

    async bulkDeleteUsers(userIds) {
        const response = await api.delete('/users/bulk', { data: { userIds } });

        return response.data;
    },
};
