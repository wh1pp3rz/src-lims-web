import api from './api.js';

const AUDIT_LOGS_ENDPOINT = '/audit-logs';

export const auditLogService = {
    // Get audit logs with filtering and pagination
    async getAuditLogs(filters = {}) {
        const params = new URLSearchParams();
        
        // Add pagination parameters
        if (filters.page) params.append('page', filters.page);
        if (filters.limit) params.append('limit', filters.limit);
        
        // Add filter parameters
        if (filters.search) params.append('search', filters.search);
        if (filters.action) params.append('action', filters.action);
        if (filters.resource) params.append('resource', filters.resource);
        if (filters.userId) params.append('userId', filters.userId);
        if (filters.success !== undefined) params.append('success', filters.success);
        if (filters.startDate) params.append('startDate', filters.startDate);
        if (filters.endDate) params.append('endDate', filters.endDate);

        const response = await api.get(`${AUDIT_LOGS_ENDPOINT}?${params.toString()}`);
        return response.data;
    },

    // Get unique values for filter dropdowns
    async getFilterOptions() {
        // This would typically be separate endpoints, but we can derive from the model
        // For now, we'll return static options based on the AuditLog model
        return {
            actions: [
                'LOGIN', 'LOGOUT', 'LOGIN_FAILED',
                'USER_CREATED', 'USER_UPDATED', 'USER_DELETED',
                'ROLE_CHANGED', 'PERMISSION_GRANTED', 'PERMISSION_REVOKED',
                'ACCESS_DENIED', 'CREATE', 'READ', 'UPDATE', 'DELETE',
                'SYSTEM_BACKUP', 'SYSTEM_RESTORE', 'UNKNOWN'
            ],
            resources: [
                'USER', 'AUTH', 'SYSTEM', 'SAMPLE', 'TEST', 'REPORT'
            ]
        };
    },

    // Helper method to get date presets for filtering
    getDatePresets() {
        const now = new Date();
        const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
        const yesterday = new Date(today);
        yesterday.setDate(yesterday.getDate() - 1);
        const lastWeek = new Date(today);
        lastWeek.setDate(lastWeek.getDate() - 7);
        const lastMonth = new Date(today);
        lastMonth.setMonth(lastMonth.getMonth() - 1);

        return {
            today: {
                label: 'Today',
                startDate: today.toISOString().split('T')[0],
                endDate: today.toISOString().split('T')[0]
            },
            yesterday: {
                label: 'Yesterday',
                startDate: yesterday.toISOString().split('T')[0],
                endDate: yesterday.toISOString().split('T')[0]
            },
            lastWeek: {
                label: 'Last 7 days',
                startDate: lastWeek.toISOString().split('T')[0],
                endDate: today.toISOString().split('T')[0]
            },
            lastMonth: {
                label: 'Last 30 days',
                startDate: lastMonth.toISOString().split('T')[0],
                endDate: today.toISOString().split('T')[0]
            }
        };
    }
};

export default auditLogService;