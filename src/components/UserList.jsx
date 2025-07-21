import React from 'react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from './ui/table.jsx';
import { Button } from './ui/button.jsx';
import { Badge } from './ui/badge.jsx';
import {
    EditIcon,
    TrashIcon,
    UserCheckIcon,
    UserXIcon,
    ChevronLeftIcon,
    ChevronRightIcon,
    LoaderIcon,
} from 'lucide-react';

const UserList = ({
    users,
    loading,
    onEdit,
    onDelete,
    onToggleStatus,
    hasEditPermission,
    hasDeletePermission,
    currentPage,
    totalPages,
    onPageChange,
    usersPerPage,
    totalUsers,
}) => {
    const formatDate = (dateString) => {
        if (!dateString) return 'N/A';
        return new Date(dateString).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
        });
    };

    const getRoleBadgeColor = (role) => {
        switch (role?.toLowerCase()) {
            case 'admin':
                return 'default';
            case 'manager':
                return 'default';
            case 'technician':
                return 'secondary';
            case 'client':
                return 'secondary';
            default:
                return 'secondary';
        }
    };

    const getStatusBadgeColor = (isActive) => {
        return isActive ? 'success' : 'warning';
    };

    if (loading) {
        return (
            <div className='flex items-center justify-center py-12'>
                <LoaderIcon className='h-6 w-6 animate-spin text-gray-400' />
                <span className='ml-2 text-gray-600'>Loading users...</span>
            </div>
        );
    }

    if (!users || users.length === 0) {
        return (
            <div className='text-center py-12'>
                <div className='mx-auto flex items-center justify-center w-12 h-12 bg-gray-100 rounded-full mb-4'>
                    <UserCheckIcon className='w-6 h-6 text-gray-400' />
                </div>
                <h3 className='text-lg font-medium text-gray-900 mb-2'>No users found</h3>
                <p className='text-gray-600'>No users match your current search criteria.</p>
            </div>
        );
    }

    const startIndex = (currentPage - 1) * usersPerPage + 1;
    const endIndex = Math.min(currentPage * usersPerPage, totalUsers);

    return (
        <div className='space-y-4'>
            {/* Table */}
            <div className='rounded-md border'>
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>Name</TableHead>
                            <TableHead>Email</TableHead>
                            <TableHead>Role</TableHead>
                            <TableHead>Status</TableHead>
                            <TableHead>Created</TableHead>
                            <TableHead>Last Login</TableHead>
                            <TableHead className='text-right'>Actions</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {users.map((user) => (
                            <TableRow key={user.id}>
                                <TableCell className='font-medium'>
                                    <div>
                                        <div className='font-semibold text-gray-900'>
                                            {`${user.firstName || ''} ${user.lastName || ''}`.trim() ||
                                                user.fullName ||
                                                user.name ||
                                                user.username}
                                        </div>
                                        {user.username &&
                                            (`${user.firstName || ''} ${user.lastName || ''}`.trim() ||
                                                user.fullName ||
                                                user.name) && (
                                                <div className='text-sm text-gray-500'>
                                                    @{user.username}
                                                </div>
                                            )}
                                    </div>
                                </TableCell>
                                <TableCell>
                                    <div className='text-sm text-gray-900'>{user.email}</div>
                                    {user.emailVerified && (
                                        <div className='text-xs text-green-600'>Verified</div>
                                    )}
                                </TableCell>
                                <TableCell>
                                    <Badge variant={getRoleBadgeColor(user.role)}>
                                        {user.role?.charAt(0).toUpperCase() + user.role?.slice(1) ||
                                            'N/A'}
                                    </Badge>
                                </TableCell>
                                <TableCell>
                                    <Badge
                                        variant={getStatusBadgeColor(
                                            user.isActive ?? user.active ?? true
                                        )}
                                    >
                                        {(user.isActive ?? user.active ?? true)
                                            ? 'Active'
                                            : 'Inactive'}
                                    </Badge>
                                </TableCell>
                                <TableCell className='text-sm text-gray-600'>
                                    {formatDate(user.createdAt)}
                                </TableCell>
                                <TableCell className='text-sm text-gray-600'>
                                    {user.lastLogin ? formatDate(user.lastLogin) : 'Never'}
                                </TableCell>
                                <TableCell className='text-right'>
                                    <div className='flex items-center justify-end gap-2'>
                                        {/* Toggle Status Button */}
                                        <Button
                                            variant='ghost'
                                            size='sm'
                                            onClick={() =>
                                                onToggleStatus(
                                                    user.id || user._id || user.userId,
                                                    user.isActive ?? user.active ?? true
                                                )
                                            }
                                            className='h-8 w-8 p-0'
                                            title={
                                                (user.isActive ?? user.active ?? true)
                                                    ? 'Deactivate user'
                                                    : 'Activate user'
                                            }
                                        >
                                            {(user.isActive ?? user.active ?? true) ? (
                                                <UserXIcon className='h-4 w-4 text-orange-600' />
                                            ) : (
                                                <UserCheckIcon className='h-4 w-4 text-green-600' />
                                            )}
                                        </Button>

                                        {/* Edit Button */}
                                        {hasEditPermission && (
                                            <Button
                                                variant='ghost'
                                                size='sm'
                                                onClick={() => onEdit(user)}
                                                className='h-8 w-8 p-0'
                                                title='Edit user'
                                            >
                                                <EditIcon className='h-4 w-4 text-blue-600' />
                                            </Button>
                                        )}

                                        {/* Delete Button (permanent soft delete) */}
                                        {hasDeletePermission && (
                                            <Button
                                                variant='ghost'
                                                size='sm'
                                                onClick={() =>
                                                    onDelete(user.id || user._id || user.userId)
                                                }
                                                className='h-8 w-8 p-0'
                                                title='Permanently delete user'
                                            >
                                                <TrashIcon className='h-4 w-4 text-red-600' />
                                            </Button>
                                        )}
                                    </div>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
                <div className='flex items-center justify-between'>
                    <div className='text-sm text-gray-700'>
                        Showing {startIndex} to {endIndex} of {totalUsers} users
                    </div>

                    <div className='flex items-center gap-2'>
                        <Button
                            variant='outline'
                            size='sm'
                            onClick={() => onPageChange(currentPage - 1)}
                            disabled={currentPage === 1}
                            className='h-8 w-8 p-0'
                        >
                            <ChevronLeftIcon className='h-4 w-4' />
                        </Button>

                        <div className='flex items-center gap-1'>
                            {[...Array(totalPages)].map((_, index) => {
                                const page = index + 1;
                                const isCurrentPage = page === currentPage;
                                const shouldShow =
                                    page === 1 ||
                                    page === totalPages ||
                                    (page >= currentPage - 1 && page <= currentPage + 1);

                                if (!shouldShow) {
                                    if (page === currentPage - 2 || page === currentPage + 2) {
                                        return (
                                            <span key={page} className='px-2 text-gray-400'>
                                                ...
                                            </span>
                                        );
                                    }
                                    return null;
                                }

                                return (
                                    <Button
                                        key={page}
                                        variant={isCurrentPage ? 'default' : 'outline'}
                                        size='sm'
                                        onClick={() => onPageChange(page)}
                                        className='h-8 w-8 p-0'
                                    >
                                        {page}
                                    </Button>
                                );
                            })}
                        </div>

                        <Button
                            variant='outline'
                            size='sm'
                            onClick={() => onPageChange(currentPage + 1)}
                            disabled={currentPage === totalPages}
                            className='h-8 w-8 p-0'
                        >
                            <ChevronRightIcon className='h-4 w-4' />
                        </Button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default UserList;
