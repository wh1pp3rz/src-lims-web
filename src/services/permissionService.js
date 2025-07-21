import api from './api.js';

export const permissionService = {
    // Get all permissions
    async getPermissions(params = {}) {
        const searchParams = new URLSearchParams();

        if (params.category) searchParams.append('category', params.category);
        if (params.resource) searchParams.append('resource', params.resource);
        if (params.include_inactive)
            searchParams.append('include_inactive', params.include_inactive);

        const queryString = searchParams.toString();
        const url = `/permissions${queryString ? `?${queryString}` : ''}`;

        const response = await api.get(url);

        return response.data;
    },

    // Get permission categories
    async getPermissionCategories() {
        const response = await api.get('/permissions/categories');

        return response.data;
    },

    // Get a single permission by ID
    async getPermission(permissionId) {
        const response = await api.get(`/permissions/${permissionId}`);

        return response.data;
    },

    // Create a new permission
    async createPermission(permissionData) {
        const response = await api.post('/permissions', permissionData);
        return response.data;
    },

    // Update an existing permission
    async updatePermission(permissionId, permissionData) {
        const response = await api.put(`/permissions/${permissionId}`, permissionData);

        return response.data;
    },

    // Delete a permission
    async deletePermission(permissionId) {
        const response = await api.delete(`/permissions/${permissionId}`);

        return response.data;
    },
};
