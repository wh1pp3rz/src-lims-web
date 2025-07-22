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

    const getRoleBadgeClass = (role) => {
        switch (role?.toLowerCase()) {
            case 'admin':
                return 'bg-primary/10 text-primary border-primary/20';
            case 'manager':
                return 'bg-info/10 text-info border-info/20';
            case 'technician':
                return 'bg-secondary/10 text-secondary-foreground border-border';
            case 'client':
                return 'bg-muted text-muted-foreground border-border';
            default:
                return 'bg-muted text-muted-foreground border-border';
        }
    };

    const getStatusBadgeClass = (isActive) => {
        return isActive ? 'status-active' : 'status-inactive';
    };

    if (loading) {
        return (
            <div className='flex items-center justify-center py-16 animate-fade-in'>
                <LoaderIcon className='h-6 w-6 animate-spin text-primary mr-3' />
                <span className='text-body text-muted'>Loading users...</span>
            </div>
        );
    }

    if (!users || users.length === 0) {
        return (
            <div className='text-center py-16 animate-fade-in'>
                <div className='mx-auto flex items-center justify-center w-16 h-16 bg-muted/50 rounded-full mb-6'>
                    <UserCheckIcon className='w-8 h-8 text-muted-foreground' />
                </div>
                <h3 className='text-heading-3 text-foreground mb-3'>No users found</h3>
                <p className='text-body text-muted max-w-md mx-auto'>No users match your current search criteria. Try adjusting your filters or search terms.</p>
            </div>
        );
    }

    const startIndex = (currentPage - 1) * usersPerPage + 1;
    const endIndex = Math.min(currentPage * usersPerPage, totalUsers);

    return (
        <div className='space-y-6 animate-fade-in'>
            {/* Enhanced Table */}
            <div className='rounded-lg border border-border overflow-hidden'>
                <Table className='table-enhanced'>
                    <TableHeader>
                        <TableRow className='bg-muted/50'>
                            <TableHead className='font-semibold text-foreground'>Name</TableHead>
                            <TableHead className='font-semibold text-foreground'>Email</TableHead>
                            <TableHead className='font-semibold text-foreground'>Role</TableHead>
                            <TableHead className='font-semibold text-foreground'>Status</TableHead>
                            <TableHead className='font-semibold text-foreground'>Created</TableHead>
                            <TableHead className='font-semibold text-foreground'>Last Login</TableHead>
                            <TableHead className='text-right font-semibold text-foreground'>Actions</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {users.map((user, index) => (
                            <TableRow 
                                key={user.id} 
                                className='group'
                                style={{ animationDelay: `${index * 0.05}s` }}
                            >
                                <TableCell className='font-medium'>
                                    <div className='flex items-center gap-3'>
                                        <div className='flex items-center justify-center w-8 h-8 rounded-full bg-primary/10 text-primary font-semibold text-sm'>
                                            {(user.firstName?.[0] || user.name?.[0] || user.username?.[0] || 'U').toUpperCase()}
                                        </div>
                                        <div>
                                            <div className='font-semibold text-foreground text-body'>
                                                {`${user.firstName || ''} ${user.lastName || ''}`.trim() ||
                                                    user.fullName ||
                                                    user.name ||
                                                    user.username}
                                            </div>
                                            {user.username &&
                                                (`${user.firstName || ''} ${user.lastName || ''}`.trim() ||
                                                    user.fullName ||
                                                    user.name) && (
                                                    <div className='text-small text-muted'>
                                                        @{user.username}
                                                    </div>
                                                )}
                                        </div>
                                    </div>
                                </TableCell>
                                <TableCell>
                                    <div className='text-body text-foreground'>{user.email}</div>
                                    {user.emailVerified && (
                                        <div className='text-small text-success font-medium'>Verified</div>
                                    )}
                                </TableCell>
                                <TableCell>
                                    <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium border ${getRoleBadgeClass(user.role)}`}>
                                        {user.role?.charAt(0).toUpperCase() + user.role?.slice(1) || 'N/A'}
                                    </span>
                                </TableCell>
                                <TableCell>
                                    <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium border ${getStatusBadgeClass(user.isActive ?? user.active ?? true)}`}>
                                        {(user.isActive ?? user.active ?? true) ? 'Active' : 'Inactive'}
                                    </span>
                                </TableCell>
                                <TableCell className='text-small text-muted'>
                                    {formatDate(user.createdAt)}
                                </TableCell>
                                <TableCell className='text-small text-muted'>
                                    {user.lastLogin ? formatDate(user.lastLogin) : 'Never'}
                                </TableCell>
                                <TableCell className='text-right'>
                                    <div className='flex items-center justify-end gap-1 opacity-0 group-hover:opacity-100 transition-opacity duration-200'>
                                        {/* Toggle Status Button */}
                                        <Button
                                            variant='outline'
                                            size='sm'
                                            onClick={() =>
                                                onToggleStatus(
                                                    user.id || user._id || user.userId,
                                                    user.isActive ?? user.active ?? true
                                                )
                                            }
                                            className={`h-8 w-8 p-0 btn-enhanced border-border/40 ${
                                                (user.isActive ?? user.active ?? true) 
                                                    ? 'hover:bg-warning/10 hover:border-warning/30' 
                                                    : 'hover:bg-success/10 hover:border-success/30'
                                            }`}
                                            title={
                                                (user.isActive ?? user.active ?? true)
                                                    ? 'Deactivate user'
                                                    : 'Activate user'
                                            }
                                        >
                                            {(user.isActive ?? user.active ?? true) ? (
                                                <UserXIcon className='h-4 w-4 text-warning' />
                                            ) : (
                                                <UserCheckIcon className='h-4 w-4 text-success' />
                                            )}
                                        </Button>

                                        {/* Edit Button */}
                                        {hasEditPermission && (
                                            <Button
                                                variant='outline'
                                                size='sm'
                                                onClick={() => onEdit(user)}
                                                className='h-8 w-8 p-0 btn-enhanced hover:bg-primary/10 border-border/40 hover:border-primary/30'
                                                title='Edit user'
                                            >
                                                <EditIcon className='h-4 w-4 text-primary' />
                                            </Button>
                                        )}

                                        {/* Delete Button */}
                                        {hasDeletePermission && (
                                            <Button
                                                variant='outline'
                                                size='sm'
                                                onClick={() =>
                                                    onDelete(user.id || user._id || user.userId)
                                                }
                                                className='h-8 w-8 p-0 btn-enhanced hover:bg-destructive/10 border-border/40 hover:border-destructive/30'
                                                title='Permanently delete user'
                                            >
                                                <TrashIcon className='h-4 w-4 text-destructive' />
                                            </Button>
                                        )}
                                    </div>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </div>

            {/* Enhanced Pagination */}
            {totalPages > 1 && (
                <div className='flex items-center justify-between pt-4 border-t border-border'>
                    <div className='text-small text-muted'>
                        Showing <span className='font-medium text-foreground'>{startIndex}</span> to{' '}
                        <span className='font-medium text-foreground'>{endIndex}</span> of{' '}
                        <span className='font-medium text-foreground'>{totalUsers}</span> users
                    </div>

                    <div className='flex items-center gap-2'>
                        <Button
                            variant='outline'
                            size='sm'
                            onClick={() => onPageChange(currentPage - 1)}
                            disabled={currentPage === 1}
                            className='h-8 w-8 p-0 btn-enhanced'
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
                                            <span key={page} className='px-2 text-muted-foreground text-small'>
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
                                        className='h-8 w-8 p-0 btn-enhanced'
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
                            className='h-8 w-8 p-0 btn-enhanced'
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
