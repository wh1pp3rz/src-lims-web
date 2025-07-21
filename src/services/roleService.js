import api from './api.js';

export const roleService = {
    // Get all roles
    async getRoles(params = {}) {
        const searchParams = new URLSearchParams();

        if (params.include_inactive)
            searchParams.append('include_inactive', params.include_inactive);
        if (params.include_system) searchParams.append('include_system', params.include_system);
        if (params.with_permissions)
            searchParams.append('with_permissions', params.with_permissions);

        const queryString = searchParams.toString();
        const url = `/roles${queryString ? `?${queryString}` : ''}`;

        const response = await api.get(url);

        return response.data;
    },

    // Get a single role by ID
    async getRole(roleId) {
        const response = await api.get(`/roles/${roleId}`);

        return response.data;
    },

    // Create a new role
    async createRole(roleData) {
        const response = await api.post('/roles', roleData);

        return response.data;
    },

    // Update an existing role
    async updateRole(roleId, roleData) {
        const response = await api.put(`/roles/${roleId}`, roleData);

        return response.data;
    },

    // Delete a role
    async deleteRole(roleId) {
        const response = await api.delete(`/roles/${roleId}`);

        return response.data;
    },

    // Update role permissions
    async updateRolePermissions(roleId, permissions) {
        const response = await api.put(`/roles/${roleId}/permissions`, { permissions });

        return response.data;
    },
};
