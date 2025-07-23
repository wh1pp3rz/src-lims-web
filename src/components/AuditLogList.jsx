import React, { useState } from 'react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from './ui/table.jsx';
import { Button } from './ui/button.jsx';
import { Badge } from './ui/badge.jsx';
import { Card } from './ui/card.jsx';
import {
    ChevronLeftIcon,
    ChevronRightIcon,
    LoaderIcon,
    EyeIcon,
    CheckCircleIcon,
    XCircleIcon,
    AlertCircleIcon,
    UserIcon,
    ShieldIcon,
    DatabaseIcon,
    FileTextIcon,
    TestTubeIcon,
    FileIcon
} from 'lucide-react';

const AuditLogList = ({
    logs,
    loading,
    currentPage,
    totalPages,
    onPageChange,
    totalLogs,
}) => {
    const [expandedLog, setExpandedLog] = useState(null);

    const formatDate = (dateString) => {
        if (!dateString) return 'N/A';
        return new Date(dateString).toLocaleString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
            second: '2-digit',
        });
    };

    const getActionBadgeClass = (action) => {
        if (action?.includes('LOGIN') || action?.includes('AUTH')) {
            return 'bg-blue-100 text-blue-800 border-blue-200';
        }
        if (action?.includes('CREATE')) {
            return 'bg-green-100 text-green-800 border-green-200';
        }
        if (action?.includes('UPDATE') || action?.includes('CHANGED')) {
            return 'bg-yellow-100 text-yellow-800 border-yellow-200';
        }
        if (action?.includes('DELETE') || action?.includes('DENIED')) {
            return 'bg-red-100 text-red-800 border-red-200';
        }
        return 'bg-gray-100 text-gray-800 border-gray-200';
    };

    const getResourceIcon = (resource) => {
        switch (resource) {
            case 'USER': return <UserIcon className="h-4 w-4" />;
            case 'AUTH': return <ShieldIcon className="h-4 w-4" />;
            case 'SYSTEM': return <DatabaseIcon className="h-4 w-4" />;
            case 'SAMPLE': return <TestTubeIcon className="h-4 w-4" />;
            case 'TEST': return <FileTextIcon className="h-4 w-4" />;
            case 'REPORT': return <FileIcon className="h-4 w-4" />;
            default: return <AlertCircleIcon className="h-4 w-4" />;
        }
    };

    const toggleLogDetails = (logId) => {
        setExpandedLog(expandedLog === logId ? null : logId);
    };

    const renderLogDetails = (log) => {
        return (
            <div className="bg-gray-50 p-4 rounded-lg space-y-3">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                        <h4 className="font-medium text-gray-900 mb-2">Request Details</h4>
                        <div className="space-y-1 text-sm">
                            <div><strong>IP Address:</strong> {log.ipAddress || 'N/A'}</div>
                            <div><strong>Resource ID:</strong> {log.resourceId || 'N/A'}</div>
                            <div><strong>User Agent:</strong> {log.userAgent ? (
                                <span className="break-all">{log.userAgent}</span>
                            ) : 'N/A'}</div>
                        </div>
                    </div>
                    <div>
                        <h4 className="font-medium text-gray-900 mb-2">Additional Details</h4>
                        <div className="space-y-1 text-sm">
                            {log.details && typeof log.details === 'object' ? (
                                Object.entries(log.details).map(([key, value]) => (
                                    <div key={key}>
                                        <strong>{key}:</strong> {JSON.stringify(value)}
                                    </div>
                                ))
                            ) : (
                                <div>No additional details</div>
                            )}
                            {log.errorMessage && (
                                <div className="text-red-600">
                                    <strong>Error:</strong> {log.errorMessage}
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        );
    };

    if (loading) {
        return (
            <Card className="p-8">
                <div className="flex items-center justify-center">
                    <LoaderIcon className="h-6 w-6 animate-spin mr-2" />
                    Loading audit logs...
                </div>
            </Card>
        );
    }

    if (!logs || logs.length === 0) {
        return (
            <Card className="p-8">
                <div className="text-center text-gray-500">
                    No audit logs found matching your criteria.
                </div>
            </Card>
        );
    }

    return (
        <Card>
            <div className="p-4 border-b">
                <div className="flex justify-between items-center">
                    <h3 className="text-lg font-semibold text-gray-900">
                        Audit Logs ({totalLogs} total)
                    </h3>
                    <div className="text-sm text-gray-500">
                        Page {currentPage} of {totalPages}
                    </div>
                </div>
            </div>

            <div className="overflow-x-auto">
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead className="w-32">Timestamp</TableHead>
                            <TableHead className="w-24">Status</TableHead>
                            <TableHead className="w-28">Action</TableHead>
                            <TableHead className="w-24">Resource</TableHead>
                            <TableHead>User</TableHead>
                            <TableHead className="w-32">IP Address</TableHead>
                            <TableHead className="w-16">Details</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {logs.map((log) => (
                            <React.Fragment key={log._id}>
                                <TableRow className="hover:bg-gray-50">
                                    <TableCell className="text-sm">
                                        {formatDate(log.timestamp)}
                                    </TableCell>
                                    <TableCell>
                                        <div className="flex items-center">
                                            {log.success ? (
                                                <CheckCircleIcon className="h-4 w-4 text-green-500 mr-1" />
                                            ) : (
                                                <XCircleIcon className="h-4 w-4 text-red-500 mr-1" />
                                            )}
                                            <span className={`text-xs font-medium ${
                                                log.success ? 'text-green-700' : 'text-red-700'
                                            }`}>
                                                {log.success ? 'Success' : 'Failed'}
                                            </span>
                                        </div>
                                    </TableCell>
                                    <TableCell>
                                        <Badge 
                                            className={`text-xs ${getActionBadgeClass(log.action)}`}
                                        >
                                            {log.action}
                                        </Badge>
                                    </TableCell>
                                    <TableCell>
                                        <div className="flex items-center">
                                            {getResourceIcon(log.resource)}
                                            <span className="ml-2 text-sm">{log.resource}</span>
                                        </div>
                                    </TableCell>
                                    <TableCell>
                                        <div className="text-sm">
                                            {log.userId ? (
                                                <div>
                                                    <div className="font-medium">
                                                        {log.userId.firstName} {log.userId.lastName}
                                                    </div>
                                                    <div className="text-gray-500 text-xs">
                                                        {log.userId.username || log.userId.email}
                                                    </div>
                                                </div>
                                            ) : (
                                                <span className="text-gray-400">System</span>
                                            )}
                                        </div>
                                    </TableCell>
                                    <TableCell className="text-sm font-mono">
                                        {log.ipAddress}
                                    </TableCell>
                                    <TableCell>
                                        <Button
                                            variant="ghost"
                                            size="sm"
                                            onClick={() => toggleLogDetails(log._id)}
                                            className="h-8 w-8 p-0"
                                        >
                                            <EyeIcon className="h-4 w-4" />
                                        </Button>
                                    </TableCell>
                                </TableRow>
                                {expandedLog === log._id && (
                                    <TableRow>
                                        <TableCell colSpan={7} className="p-0">
                                            <div className="p-4 border-t">
                                                {renderLogDetails(log)}
                                            </div>
                                        </TableCell>
                                    </TableRow>
                                )}
                            </React.Fragment>
                        ))}
                    </TableBody>
                </Table>
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
                <div className="flex items-center justify-between px-4 py-3 border-t">
                    <div className="text-sm text-gray-700">
                        Showing {((currentPage - 1) * 20) + 1} to {Math.min(currentPage * 20, totalLogs)} of {totalLogs} results
                    </div>
                    <div className="flex items-center space-x-2">
                        <Button
                            variant="outline"
                            size="sm"
                            onClick={() => onPageChange(currentPage - 1)}
                            disabled={currentPage <= 1}
                            className="flex items-center"
                        >
                            <ChevronLeftIcon className="h-4 w-4 mr-1" />
                            Previous
                        </Button>
                        
                        <span className="text-sm text-gray-700">
                            Page {currentPage} of {totalPages}
                        </span>
                        
                        <Button
                            variant="outline"
                            size="sm"
                            onClick={() => onPageChange(currentPage + 1)}
                            disabled={currentPage >= totalPages}
                            className="flex items-center"
                        >
                            Next
                            <ChevronRightIcon className="h-4 w-4 ml-1" />
                        </Button>
                    </div>
                </div>
            )}
        </Card>
    );
};

export default AuditLogList;