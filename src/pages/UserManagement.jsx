import React, { useState, useEffect, useCallback } from 'react';
import useAuth from '@/hooks/useAuth.js';
import { userService } from '../services/userService.js';
import { hasPermission } from '@/utils/permissions.js';
import { Card, CardHeader, CardTitle, CardContent } from '../components/ui/card.jsx';
import { Button } from '../components/ui/button.jsx';
import { Input } from '../components/ui/input.jsx';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '../components/ui/select.jsx';
import { Badge } from '../components/ui/badge.jsx';
import { PlusIcon, SearchIcon, FilterIcon, RefreshCwIcon, UsersIcon } from 'lucide-react';
import UserList from '../components/UserList.jsx';
import UserForm from '../components/UserForm.jsx';

const UserManagement = () => {
    const { user } = useAuth();
    const [users, setUsers] = useState([]);
    const [filteredUsers, setFilteredUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    // Filter states
    const [searchTerm, setSearchTerm] = useState('');
    const [roleFilter, setRoleFilter] = useState('');
    const [statusFilter, setStatusFilter] = useState('');

    // Pagination
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [totalUsers, setTotalUsers] = useState(0);
    const usersPerPage = 10;

    // Modal states
    const [showUserForm, setShowUserForm] = useState(false);
    const [editingUser, setEditingUser] = useState(null);

    // Available roles
    const [roles, setRoles] = useState([]);

    // Check if user has permission - wrapped in useCallback for stability
    const checkPermission = useCallback((permission) => {
        return hasPermission(user, permission);
    }, [user]);

    // Load users - wrapped in useCallback to prevent infinite re-renders
    const loadUsers = useCallback(async (filters = {}) => {
        try {
            setLoading(true);
            setError(null);

            const params = {
                page: currentPage,
                limit: usersPerPage,
                search: searchTerm,
                role: roleFilter,
                status:
                    statusFilter === 'active'
                        ? 'true'
                        : statusFilter === 'inactive'
                          ? 'false'
                          : statusFilter,
                ...filters,
            };

            const response = await userService.getUsers(params);
            // Users API Response received

            // Handle different possible response structures
            let userList = [];
            let totalCount = 0;
            let pages = 1;

            if (Array.isArray(response)) {
                // Response is directly an array
                userList = response;
                totalCount = response.length;
            } else if (response.users && Array.isArray(response.users)) {
                // Response has users array
                userList = response.users;
                totalCount = response.total || response.count || response.users.length;
                pages = response.totalPages || 1;
            } else if (response.data && Array.isArray(response.data)) {
                // Response has data array
                userList = response.data;
                totalCount = response.total || response.count || response.data.length;
                pages = response.totalPages || response.pagination?.totalPages || 1;
            } else {
                // Unexpected API response structure
            }

            // Processed users and total count

            setUsers(userList);
            setFilteredUsers(userList);
            setTotalPages(pages);
            setTotalUsers(totalCount);
        } catch (err) {
            // Error loading users
            setError(
                `Failed to load users: ${err.response?.data?.message || err.message || 'Unknown error'}`
            );
        } finally {
            setLoading(false);
        }
    }, [currentPage, usersPerPage, searchTerm, roleFilter, statusFilter]);

    // Load roles - wrapped in useCallback
    const loadRoles = useCallback(async () => {
        try {
            const response = await userService.getRoles();
            setRoles(response.roles || []);
        } catch {
            // Error loading roles
        }
    }, []);

    // Initial load and load when dependencies change
    useEffect(() => {
        if (checkPermission('user_management')) {
            loadUsers();
        }
    }, [checkPermission, loadUsers]); // Include stable function references

    // Load roles only once on mount
    useEffect(() => {
        if (checkPermission('user_management')) {
            loadRoles();
        }
    }, [checkPermission, loadRoles]); // Include stable function references

    // Handle user creation/edit
    const handleUserSubmit = async (userData) => {
        try {
            if (editingUser) {
                const userId = editingUser.id || editingUser._id || editingUser.userId;
                if (!userId) {
                    throw new Error('User ID is missing - cannot update user');
                }
                await userService.updateUser(userId, userData);
            } else {
                await userService.createUser(userData);
            }

            setShowUserForm(false);
            setEditingUser(null);
            loadUsers();
        } catch (err) {
            throw new Error(
                `Failed to ${editingUser ? 'update' : 'create'} user: ${err.response?.data?.message || err.message}`
            );
        }
    };

    // Handle user edit
    const handleEditUser = (user) => {
        // Editing user
        setEditingUser(user);
        setShowUserForm(true);
    };

    // Handle user delete (permanent soft delete)
    const handleDeleteUser = async (userIdParam) => {
        if (
            !window.confirm(
                'Are you sure you want to permanently delete this user? This action cannot be undone from the application.'
            )
        ) {
            return;
        }

        try {
            if (!userIdParam) {
                throw new Error('User ID is missing - cannot delete user');
            }
            await userService.deleteUser(userIdParam);
            loadUsers();
        } catch (err) {
            alert(`Failed to delete user: ${err.response?.data?.message || err.message}`);
        }
    };

    // Handle user status toggle (activate/deactivate)
    const handleToggleStatus = async (userIdParam, currentStatus) => {
        try {
            if (!userIdParam) {
                throw new Error('User ID is missing - cannot toggle user status');
            }
            if (currentStatus) {
                // User is currently active, so deactivate
                await userService.deactivateUser(userIdParam);
            } else {
                // User is currently inactive, so activate
                await userService.activateUser(userIdParam);
            }
            loadUsers();
        } catch (err) {
            alert(`Failed to update user status: ${err.response?.data?.message || err.message}`);
        }
    };

    // Reset filters
    const resetFilters = () => {
        setSearchTerm('');
        setRoleFilter('');
        setStatusFilter('');
        setCurrentPage(1);
        // Explicitly reload users after clearing filters
        setTimeout(() => {
            loadUsers();
        }, 0);
    };

    // Check permissions
    if (!checkPermission('user_management')) {
        return (
            <div className='text-center py-16 animate-fade-in'>
                <div className='mx-auto flex items-center justify-center w-16 h-16 bg-destructive/10 rounded-full mb-6'>
                    <UsersIcon className='w-8 h-8 text-destructive' />
                </div>
                <h1 className='text-heading-2 text-foreground mb-3'>Access Denied</h1>
                <p className='text-body text-muted max-w-md mx-auto'>
                    You don't have permission to access user management. Please contact your administrator for access.
                </p>
            </div>
        );
    }

    return (
        <div className='space-y-8 animate-fade-in'>
            {/* Enhanced Header */}
            <div className='flex items-center justify-between'>
                <div>
                    <h1 className='text-heading-1 text-foreground'>User Management</h1>
                    <p className='text-body text-muted mt-2'>Manage system users and their permissions</p>
                </div>
                {checkPermission('user_create') && (
                    <Button onClick={() => setShowUserForm(true)} className='gap-2 btn-enhanced'>
                        <PlusIcon className='h-4 w-4' />
                        Add User
                    </Button>
                )}
            </div>

            {/* Enhanced Stats Cards */}
            <div className='grid grid-cols-1 md:grid-cols-4 gap-6'>
                <Card className='card-enhanced group'>
                    <CardContent className='pt-6'>
                        <div className='flex items-center justify-between'>
                            <div>
                                <div className='text-3xl font-bold text-primary'>{totalUsers}</div>
                                <div className='text-small font-semibold text-foreground/80 uppercase tracking-wide mt-1'>Total Users</div>
                            </div>
                            <div className='p-3 bg-primary/10 rounded-lg group-hover:bg-primary/20 transition-colors'>
                                <UsersIcon className='h-6 w-6 text-primary' />
                            </div>
                        </div>
                    </CardContent>
                </Card>
                <Card className='card-enhanced group'>
                    <CardContent className='pt-6'>
                        <div className='flex items-center justify-between'>
                            <div>
                                <div className='text-3xl font-bold text-success'>
                                    {users.filter((u) => u.isActive ?? u.active ?? true).length}
                                </div>
                                <div className='text-small font-semibold text-foreground/80 uppercase tracking-wide mt-1'>Active</div>
                            </div>
                            <div className='p-3 bg-success/10 rounded-lg group-hover:bg-success/20 transition-colors'>
                                <UsersIcon className='h-6 w-6 text-success' />
                            </div>
                        </div>
                    </CardContent>
                </Card>
                <Card className='card-enhanced group'>
                    <CardContent className='pt-6'>
                        <div className='flex items-center justify-between'>
                            <div>
                                <div className='text-3xl font-bold text-destructive'>
                                    {users.filter((u) => !(u.isActive ?? u.active ?? true)).length}
                                </div>
                                <div className='text-small font-semibold text-foreground/80 uppercase tracking-wide mt-1'>Inactive</div>
                            </div>
                            <div className='p-3 bg-destructive/10 rounded-lg group-hover:bg-destructive/20 transition-colors'>
                                <UsersIcon className='h-6 w-6 text-destructive' />
                            </div>
                        </div>
                    </CardContent>
                </Card>
                <Card className='card-enhanced group'>
                    <CardContent className='pt-6'>
                        <div className='flex items-center justify-between'>
                            <div>
                                <div className='text-3xl font-bold text-info'>{roles.length}</div>
                                <div className='text-small font-semibold text-foreground/80 uppercase tracking-wide mt-1'>Roles</div>
                            </div>
                            <div className='p-3 bg-info/10 rounded-lg group-hover:bg-info/20 transition-colors'>
                                <Badge className='w-6 h-6 bg-info text-info-foreground' />
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </div>

            {/* Enhanced Filters */}
            <Card className='card-enhanced'>
                <CardHeader className='pb-4'>
                    <CardTitle className='flex items-center gap-3 text-heading-3'>
                        <div className='p-2 bg-info/10 rounded-lg'>
                            <FilterIcon className='h-5 w-5 text-info' />
                        </div>
                        Filters
                    </CardTitle>
                </CardHeader>
                <CardContent>
                    <div className='grid grid-cols-1 md:grid-cols-4 gap-4'>
                        <div className='relative'>
                            <SearchIcon className='absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4' />
                            <Input
                                placeholder='Search users...'
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className='pl-10 input-enhanced'
                            />
                        </div>

                        <Select value={roleFilter} onValueChange={setRoleFilter}>
                            <SelectTrigger className='input-enhanced'>
                                <SelectValue placeholder='All Roles' />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value=''>All Roles</SelectItem>
                                {roles.map((role) => (
                                    <SelectItem key={role} value={role}>
                                        {typeof role === 'string' ? role.charAt(0).toUpperCase() + role.slice(1) : role}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>

                        <Select value={statusFilter} onValueChange={setStatusFilter}>
                            <SelectTrigger className='input-enhanced'>
                                <SelectValue placeholder='All Status' />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value=''>All Status</SelectItem>
                                <SelectItem value='active'>Active</SelectItem>
                                <SelectItem value='inactive'>Inactive</SelectItem>
                            </SelectContent>
                        </Select>

                        <div className='flex gap-2'>
                            <Button variant='outline' onClick={resetFilters} className='flex-1 btn-enhanced'>
                                Clear Filters
                            </Button>
                            <Button variant='outline' onClick={() => loadUsers()} className='px-3 btn-enhanced'>
                                <RefreshCwIcon className='h-4 w-4' />
                            </Button>
                        </div>
                    </div>
                </CardContent>
            </Card>

            {/* Enhanced Users Table */}
            <Card className='card-enhanced'>
                <CardHeader className='pb-4'>
                    <CardTitle className='text-heading-3'>
                        Users ({loading ? <span className='animate-pulse'>...</span> : totalUsers})
                    </CardTitle>
                </CardHeader>
                <CardContent>
                    {error && (
                        <div className='bg-destructive/10 border border-destructive/20 rounded-lg p-4 mb-6 animate-fade-in'>
                            <p className='text-destructive font-medium'>{error}</p>
                        </div>
                    )}

                    <div className='table-enhanced'>
                        <UserList
                            users={filteredUsers}
                            loading={loading}
                            onEdit={handleEditUser}
                            onDelete={handleDeleteUser}
                            onToggleStatus={handleToggleStatus}
                            hasEditPermission={checkPermission('user_edit')}
                            hasDeletePermission={checkPermission('user_delete')}
                            currentPage={currentPage}
                            totalPages={totalPages}
                            onPageChange={setCurrentPage}
                            usersPerPage={usersPerPage}
                            totalUsers={totalUsers}
                        />
                    </div>
                </CardContent>
            </Card>

            {/* User Form Modal */}
            {showUserForm && (
                <UserForm
                    user={editingUser}
                    roles={roles}
                    onSubmit={handleUserSubmit}
                    onCancel={() => {
                        setShowUserForm(false);
                        setEditingUser(null);
                    }}
                />
            )}
        </div>
    );
};

export default UserManagement;
