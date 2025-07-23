import React, { useState, useEffect, useCallback } from 'react';
import useAuth from '@/hooks/useAuth.js';
import auditLogService from '../services/auditLogService.js';
import { Card, CardHeader, CardTitle, CardContent } from '../components/ui/card.jsx';
import { Button } from '../components/ui/button.jsx';
import { ShieldCheckIcon, RefreshCwIcon, AlertTriangleIcon } from 'lucide-react';
import AuditLogFilters from '../components/AuditLogFilters.jsx';
import AuditLogList from '../components/AuditLogList.jsx';

const AuditLogs = () => {
    const { user } = useAuth();
    const [logs, setLogs] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    // Pagination and filtering state
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [totalLogs, setTotalLogs] = useState(0);
    const [filters, setFilters] = useState({
        page: 1,
        limit: 20,
        search: '',
        action: '',
        resource: '',
        userId: '',
        success: undefined,
        startDate: '',
        endDate: ''
    });

    // Check if user has permission to view audit logs
    const hasPermission = useCallback(() => {
        return user?.permissions?.includes('view_audit_logs') || 
               user?.role?.toLowerCase() === 'admin';
    }, [user?.permissions, user?.role]);

    // Load audit logs with current filters
    const loadAuditLogs = useCallback(async (currentFilters = filters) => {
        if (!hasPermission()) {
            setError('You do not have permission to view audit logs.');
            setLoading(false);
            return;
        }

        try {
            setLoading(true);
            setError(null);
            
            const response = await auditLogService.getAuditLogs(currentFilters);
            
            setLogs(response.logs || []);
            setCurrentPage(response.currentPage || 1);
            setTotalPages(response.totalPages || 1);
            setTotalLogs(response.totalLogs || 0);
        } catch (err) {
            console.error('Failed to load audit logs:', err);
            setError(err.response?.data?.message || 'Failed to load audit logs. Please try again.');
            setLogs([]);
        } finally {
            setLoading(false);
        }
    }, [filters, hasPermission]);

    // Initial load
    useEffect(() => {
        loadAuditLogs();
    }, [loadAuditLogs]);

    // Handle filter changes
    const handleFiltersChange = (newFilters) => {
        setFilters(newFilters);
        loadAuditLogs(newFilters);
    };

    // Handle clearing all filters
    const handleClearFilters = () => {
        const clearedFilters = {
            page: 1,
            limit: 20,
            search: '',
            action: '',
            resource: '',
            userId: '',
            success: undefined,
            startDate: '',
            endDate: ''
        };
        setFilters(clearedFilters);
        loadAuditLogs(clearedFilters);
    };

    // Handle page changes
    const handlePageChange = (newPage) => {
        const newFilters = { ...filters, page: newPage };
        setFilters(newFilters);
        loadAuditLogs(newFilters);
    };

    // Refresh logs
    const handleRefresh = () => {
        loadAuditLogs();
    };

    // If user doesn't have permission, show access denied
    if (!hasPermission()) {
        return (
            <div className="container mx-auto px-4 py-8">
                <Card>
                    <CardContent className="p-8">
                        <div className="text-center">
                            <AlertTriangleIcon className="h-12 w-12 text-yellow-500 mx-auto mb-4" />
                            <h2 className="text-xl font-semibold text-gray-900 mb-2">Access Denied</h2>
                            <p className="text-gray-600">
                                You do not have permission to view audit logs. 
                                Please contact your administrator if you need access.
                            </p>
                        </div>
                    </CardContent>
                </Card>
            </div>
        );
    }

    return (
        <div className="container mx-auto px-4 py-8">
            {/* Page Header */}
            <div className="mb-6">
                <div className="flex items-center justify-between">
                    <div className="flex items-center">
                        <ShieldCheckIcon className="h-8 w-8 text-primary mr-3" />
                        <div>
                            <h1 className="text-2xl font-bold text-gray-900">Audit Logs</h1>
                            <p className="text-gray-600">
                                View and monitor system activity and user actions
                            </p>
                        </div>
                    </div>
                    <Button
                        onClick={handleRefresh}
                        disabled={loading}
                        className="flex items-center gap-2"
                    >
                        <RefreshCwIcon className={`h-4 w-4 ${loading ? 'animate-spin' : ''}`} />
                        Refresh
                    </Button>
                </div>
            </div>

            {/* Error Display */}
            {error && (
                <Card className="mb-6 border-red-200">
                    <CardContent className="p-4">
                        <div className="flex items-center">
                            <AlertTriangleIcon className="h-5 w-5 text-red-500 mr-2" />
                            <span className="text-red-700">{error}</span>
                        </div>
                    </CardContent>
                </Card>
            )}

            {/* Filters */}
            <AuditLogFilters
                filters={filters}
                onFiltersChange={handleFiltersChange}
                onClearFilters={handleClearFilters}
            />

            {/* Audit Logs List */}
            <AuditLogList
                logs={logs}
                loading={loading}
                currentPage={currentPage}
                totalPages={totalPages}
                onPageChange={handlePageChange}
                totalLogs={totalLogs}
            />
        </div>
    );
};

export default AuditLogs;