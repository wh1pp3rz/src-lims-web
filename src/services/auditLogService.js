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

    // Get unique values for filter dropdowns based on user permissions
    async getFilterOptions() {
        try {
            const response = await api.get(`${AUDIT_LOGS_ENDPOINT}/filter-options`);
            return response.data;
        } catch {
            // Error fetching filter options, using fallback
            // Fallback to basic options if API fails
            return {
                actions: ['CREATE', 'READ', 'UPDATE', 'DELETE'],
                resources: ['SAMPLE', 'TEST', 'REPORT'],
                sensitivityLevels: ['basic'],
                userAuditLevel: 'basic'
            };
        }
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