import React, { useState, useEffect } from 'react';
import useAuth from '@/hooks/useAuth.js';
import { userService } from '../services/userService.js';
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

    // Check if user has permission
    const hasPermission = (permission) => {
        return user?.permissions?.includes(permission) || user?.role?.toLowerCase() === 'admin';
    };

    // Load users
    const loadUsers = async (filters = {}) => {
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
            console.log('Users API Response:', response);

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
                console.warn('Unexpected API response structure:', response);
            }

            console.log('Processed users:', userList);
            console.log('Total count:', totalCount);

            setUsers(userList);
            setFilteredUsers(userList);
            setTotalPages(pages);
            setTotalUsers(totalCount);
        } catch (err) {
            console.error('Error loading users:', err);
            console.error('Error details:', err.response?.data || err.message);
            setError(
                `Failed to load users: ${err.response?.data?.message || err.message || 'Unknown error'}`
            );
        } finally {
            setLoading(false);
        }
    };

    // Load roles
    const loadRoles = async () => {
        try {
            const response = await userService.getRoles();
            setRoles(response.roles || []);
        } catch (err) {
            console.error('Error loading roles:', err);
        }
    };

    // Initial load
    useEffect(() => {
        if (hasPermission('user_management')) {
            loadUsers();
            loadRoles();
        }
    }, [currentPage]); // eslint-disable-line react-hooks/exhaustive-deps

    // Filter users when filters change
    useEffect(() => {
        if (searchTerm || roleFilter || statusFilter) {
            loadUsers();
        } else if (!searchTerm && !roleFilter && !statusFilter) {
            loadUsers();
        }
    }, [searchTerm, roleFilter, statusFilter]); // eslint-disable-line react-hooks/exhaustive-deps

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
        console.log('Editing user:', user);
        console.log('User ID fields:', { id: user.id, _id: user._id, userId: user.userId });
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
    if (!hasPermission('user_management')) {
        return (
            <div className='text-center py-12'>
                <div className='mx-auto flex items-center justify-center w-12 h-12 bg-red-100 rounded-full mb-4'>
                    <UsersIcon className='w-6 h-6 text-red-600' />
                </div>
                <h1 className='text-xl font-semibold text-gray-900 mb-2'>Access Denied</h1>
                <p className='text-gray-600'>
                    You don't have permission to access user management.
                </p>
            </div>
        );
    }

    return (
        <div className='space-y-6'>
            {/* Header */}
            <div className='flex items-center justify-between'>
                <div>
                    <h1 className='text-2xl font-bold text-gray-900'>User Management</h1>
                    <p className='text-gray-600 mt-1'>Manage system users and their permissions</p>
                </div>
                {hasPermission('user_create') && (
                    <Button onClick={() => setShowUserForm(true)} className='gap-2'>
                        <PlusIcon className='h-4 w-4' />
                        Add User
                    </Button>
                )}
            </div>

            {/* Stats Cards */}
            <div className='grid grid-cols-1 md:grid-cols-4 gap-4'>
                <Card>
                    <CardContent className='pt-6'>
                        <div className='flex items-center'>
                            <div className='text-2xl font-bold text-blue-600'>{totalUsers}</div>
                            <div className='ml-2 text-sm text-gray-600'>Total Users</div>
                        </div>
                    </CardContent>
                </Card>
                <Card>
                    <CardContent className='pt-6'>
                        <div className='flex items-center'>
                            <div className='text-2xl font-bold text-green-600'>
                                {users.filter((u) => u.isActive ?? u.active ?? true).length}
                            </div>
                            <div className='ml-2 text-sm text-gray-600'>Active</div>
                        </div>
                    </CardContent>
                </Card>
                <Card>
                    <CardContent className='pt-6'>
                        <div className='flex items-center'>
                            <div className='text-2xl font-bold text-red-600'>
                                {users.filter((u) => !(u.isActive ?? u.active ?? true)).length}
                            </div>
                            <div className='ml-2 text-sm text-gray-600'>Inactive</div>
                        </div>
                    </CardContent>
                </Card>
                <Card>
                    <CardContent className='pt-6'>
                        <div className='flex items-center'>
                            <div className='text-2xl font-bold text-purple-600'>{roles.length}</div>
                            <div className='ml-2 text-sm text-gray-600'>Roles</div>
                        </div>
                    </CardContent>
                </Card>
            </div>

            {/* Filters */}
            <Card>
                <CardHeader>
                    <CardTitle className='flex items-center gap-2'>
                        <FilterIcon className='h-5 w-5' />
                        Filters
                    </CardTitle>
                </CardHeader>
                <CardContent>
                    <div className='grid grid-cols-1 md:grid-cols-4 gap-4'>
                        <div className='relative'>
                            <SearchIcon className='absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4' />
                            <Input
                                placeholder='Search users...'
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className='pl-10'
                            />
                        </div>

                        <Select value={roleFilter} onValueChange={setRoleFilter}>
                            <SelectTrigger>
                                <SelectValue placeholder='Filter by role' />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value=''>All Roles</SelectItem>
                                {roles.map((role) => (
                                    <SelectItem key={role} value={role}>
                                        {role.charAt(0).toUpperCase() + role.slice(1)}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>

                        <Select value={statusFilter} onValueChange={setStatusFilter}>
                            <SelectTrigger>
                                <SelectValue placeholder='Filter by status' />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value=''>All Status</SelectItem>
                                <SelectItem value='active'>Active</SelectItem>
                                <SelectItem value='inactive'>Inactive</SelectItem>
                            </SelectContent>
                        </Select>

                        <div className='flex gap-2'>
                            <Button variant='outline' onClick={resetFilters} className='flex-1'>
                                Clear Filters
                            </Button>
                            <Button variant='outline' onClick={() => loadUsers()} className='px-3'>
                                <RefreshCwIcon className='h-4 w-4' />
                            </Button>
                        </div>
                    </div>
                </CardContent>
            </Card>

            {/* Users Table */}
            <Card>
                <CardHeader>
                    <CardTitle>Users ({loading ? '...' : totalUsers})</CardTitle>
                </CardHeader>
                <CardContent>
                    {error && (
                        <div className='bg-red-50 border border-red-200 rounded-md p-4 mb-4'>
                            <p className='text-red-800'>{error}</p>
                        </div>
                    )}

                    <UserList
                        users={filteredUsers}
                        loading={loading}
                        onEdit={handleEditUser}
                        onDelete={handleDeleteUser}
                        onToggleStatus={handleToggleStatus}
                        hasEditPermission={hasPermission('user_edit')}
                        hasDeletePermission={hasPermission('user_delete')}
                        currentPage={currentPage}
                        totalPages={totalPages}
                        onPageChange={setCurrentPage}
                        usersPerPage={usersPerPage}
                        totalUsers={totalUsers}
                    />
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
