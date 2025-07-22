import React, { useState, useEffect } from 'react';
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogFooter,
    DialogClose,
} from './ui/dialog.jsx';
import { Button } from './ui/button.jsx';
import { Input } from './ui/input.jsx';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select.jsx';
import { LoaderIcon, EyeIcon, EyeOffIcon, SettingsIcon, UserIcon } from 'lucide-react';
import { permissionService } from '../services/permissionService.js';
import { roleService } from '../services/roleService.js';
import UserPermissionOverrides from './UserPermissionOverrides.jsx';
import { userService } from '../services/userService.js';

const UserForm = ({ user, roles, onSubmit, onCancel }) => {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [activeTab, setActiveTab] = useState('basic');

    // Permission-related state
    const [permissions, setPermissions] = useState([]);
    const [customRoles, setCustomRoles] = useState([]);
    const [userPermissions, setUserPermissions] = useState({
        effectivePermissions: [],
        overrides: { granted: [], denied: [] },
    });
    const [loadingPermissions, setLoadingPermissions] = useState(false);

    const [formData, setFormData] = useState({
        firstName: '',
        lastName: '',
        email: '',
        username: '',
        password: '',
        confirmPassword: '',
        role: '',
        customRole: '',
        useCustomRole: false,
        isActive: true,
        emailVerified: false,
    });

    const [errors, setErrors] = useState({});

    // Load permissions and roles when component mounts
    useEffect(() => {
        const loadData = async () => {
            try {
                const [permissionsData, rolesData] = await Promise.all([
                    permissionService.getPermissions(),
                    roleService.getRoles({ include_system: false, with_permissions: true }),
                ]);

                setPermissions(permissionsData.permissions || []);
                setCustomRoles(rolesData.roles || []);
            } catch (err) {
                console.error('Error loading permissions and roles:', err);
            }
        };

        loadData();
    }, []);

    // Load user permissions when editing
    useEffect(() => {
        if (user && user._id) {
            const loadUserPermissions = async () => {
                setLoadingPermissions(true);
                try {
                    const userPermData = await userService.getUserPermissions(user._id);
                    setUserPermissions(userPermData);
                } catch (err) {
                    console.error('Error loading user permissions:', err);
                } finally {
                    setLoadingPermissions(false);
                }
            };

            loadUserPermissions();
        }
    }, [user]);

    // Populate form when editing
    useEffect(() => {
        if (user) {
            setFormData({
                firstName: user.firstName || '',
                lastName: user.lastName || '',
                email: user.email || '',
                username: user.username || '',
                password: '',
                confirmPassword: '',
                role: user.role || '',
                customRole: user.customRole || '',
                useCustomRole: user.useCustomRole || false,
                isActive: user.isActive !== undefined ? user.isActive : true,
                emailVerified: user.emailVerified || false,
            });
        }
    }, [user]);

    const validateForm = () => {
        const newErrors = {};

        // Required fields
        if (!formData.firstName.trim()) {
            newErrors.firstName = 'First name is required';
        }
        if (!formData.lastName.trim()) {
            newErrors.lastName = 'Last name is required';
        }
        if (!formData.email.trim()) {
            newErrors.email = 'Email is required';
        } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
            newErrors.email = 'Email is invalid';
        }
        if (!formData.username.trim()) {
            newErrors.username = 'Username is required';
        }
        if (!formData.useCustomRole && !formData.role) {
            newErrors.role = 'Role is required';
        }

        if (formData.useCustomRole && !formData.customRole) {
            newErrors.customRole = 'Custom role is required when using custom role option';
        }

        // Password validation (only for new users or when password is provided)
        if (!user || formData.password) {
            if (!formData.password) {
                newErrors.password = 'Password is required';
            } else {
                if (formData.password.length < 8) {
                    newErrors.password = 'Password must be at least 8 characters';
                }
                if (!/(?=.*[a-z])/.test(formData.password)) {
                    newErrors.password = 'Password must contain at least one lowercase letter';
                }
                if (!/(?=.*[A-Z])/.test(formData.password)) {
                    newErrors.password = 'Password must contain at least one uppercase letter';
                }
                if (!/(?=.*\d)/.test(formData.password)) {
                    newErrors.password = 'Password must contain at least one number';
                }
            }

            if (formData.password !== formData.confirmPassword) {
                newErrors.confirmPassword = 'Passwords do not match';
            }
        }

        // Username validation
        if (formData.username && !/^[a-zA-Z0-9._-]+$/.test(formData.username)) {
            newErrors.username =
                'Username can only contain letters, numbers, dots, underscores, and hyphens';
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!validateForm()) {
            return;
        }

        setLoading(true);
        setError('');

        try {
            const submitData = { ...formData };

            // Remove password fields if not provided for existing user
            if (user && !formData.password) {
                delete submitData.password;
                delete submitData.confirmPassword;
            }

            // Remove confirmPassword from submission
            delete submitData.confirmPassword;

            // Handle custom role logic
            if (submitData.useCustomRole && !submitData.customRole) {
                throw new Error('Custom role must be selected when using custom role option');
            }

            await onSubmit(submitData);
        } catch (err) {
            setError(err.message || 'An error occurred while saving the user');
        } finally {
            setLoading(false);
        }
    };

    const handleInputChange = (field, value) => {
        setFormData((prev) => ({ ...prev, [field]: value }));

        // Clear error for this field
        if (errors[field]) {
            setErrors((prev) => ({ ...prev, [field]: '' }));
        }
    };

    // Permission management functions
    const handleGrantPermission = async (userId, permissionData) => {
        await userService.grantUserPermission(userId, permissionData);
        // Reload user permissions
        const userPermData = await userService.getUserPermissions(userId);
        setUserPermissions(userPermData);
    };

    const handleDenyPermission = async (userId, permissionData) => {
        await userService.denyUserPermission(userId, permissionData);
        // Reload user permissions
        const userPermData = await userService.getUserPermissions(userId);
        setUserPermissions(userPermData);
    };

    const handleRemoveOverride = async (userId, permissionId, type) => {
        await userService.removeUserPermissionOverride(userId, permissionId, type);
        // Reload user permissions
        const userPermData = await userService.getUserPermissions(userId);
        setUserPermissions(userPermData);
    };

    return (
        <Dialog open={true} onOpenChange={(open) => !open && onCancel()}>
            <DialogContent className='max-w-4xl max-h-[90vh] overflow-hidden flex flex-col shadow-elevated'>
                <DialogHeader className='pb-4'>
                    <DialogTitle className='text-heading-2'>{user ? 'Edit User' : 'Create New User'}</DialogTitle>
                    <DialogClose onClick={onCancel} />
                </DialogHeader>

                {/* Enhanced Tab Navigation */}
                <div className='flex border-b border-border bg-muted/30'>
                    <button
                        className={`px-6 py-3 text-body font-medium border-b-2 transition-all duration-200 ${
                            activeTab === 'basic'
                                ? 'border-primary text-primary bg-background'
                                : 'border-transparent text-muted-foreground hover:text-foreground hover:bg-muted/50'
                        }`}
                        onClick={() => setActiveTab('basic')}
                    >
                        <UserIcon className='h-4 w-4 inline mr-2' />
                        Basic Information
                    </button>
                    {user && (
                        <button
                            className={`px-6 py-3 text-body font-medium border-b-2 transition-all duration-200 ${
                                activeTab === 'permissions'
                                    ? 'border-primary text-primary bg-background'
                                    : 'border-transparent text-muted-foreground hover:text-foreground hover:bg-muted/50'
                            }`}
                            onClick={() => setActiveTab('permissions')}
                        >
                            <SettingsIcon className='h-4 w-4 inline mr-2' />
                            Permissions & Roles
                        </button>
                    )}
                </div>

                {/* Enhanced Tab Content Container */}
                <div className='flex-1 overflow-y-auto p-6'>
                    {/* Enhanced Basic Information Tab */}
                    {activeTab === 'basic' && (
                        <form onSubmit={handleSubmit} className='space-y-6 animate-fade-in'>
                            {error && (
                                <div className='bg-destructive/10 border border-destructive/20 rounded-lg p-4 animate-fade-in'>
                                    <p className='text-body text-destructive font-medium'>{error}</p>
                                </div>
                            )}

                            {/* Enhanced Name Fields */}
                            <div className='grid grid-cols-2 gap-4'>
                                <div>
                                    <label className='block text-body font-semibold text-foreground mb-2'>
                                        First Name *
                                    </label>
                                    <Input
                                        type='text'
                                        value={formData.firstName}
                                        onChange={(e) =>
                                            handleInputChange('firstName', e.target.value)
                                        }
                                        className={`input-enhanced ${errors.firstName ? 'border-destructive focus:border-destructive' : ''}`}
                                        placeholder='John'
                                    />
                                    {errors.firstName && (
                                        <p className='text-small text-destructive mt-1 font-medium'>
                                            {errors.firstName}
                                        </p>
                                    )}
                                </div>

                                <div>
                                    <label className='block text-sm font-medium text-gray-700 mb-1'>
                                        Last Name *
                                    </label>
                                    <Input
                                        type='text'
                                        value={formData.lastName}
                                        onChange={(e) =>
                                            handleInputChange('lastName', e.target.value)
                                        }
                                        className={errors.lastName ? 'border-red-500' : ''}
                                        placeholder='Doe'
                                    />
                                    {errors.lastName && (
                                        <p className='text-xs text-red-600 mt-1'>
                                            {errors.lastName}
                                        </p>
                                    )}
                                </div>
                            </div>

                            {/* Email */}
                            <div>
                                <label className='block text-sm font-medium text-gray-700 mb-1'>
                                    Email *
                                </label>
                                <Input
                                    type='email'
                                    value={formData.email}
                                    onChange={(e) => handleInputChange('email', e.target.value)}
                                    className={errors.email ? 'border-red-500' : ''}
                                    placeholder='john.doe@example.com'
                                />
                                {errors.email && (
                                    <p className='text-xs text-red-600 mt-1'>{errors.email}</p>
                                )}
                            </div>

                            {/* Username */}
                            <div>
                                <label className='block text-sm font-medium text-gray-700 mb-1'>
                                    Username *
                                </label>
                                <Input
                                    type='text'
                                    value={formData.username}
                                    onChange={(e) => handleInputChange('username', e.target.value)}
                                    className={errors.username ? 'border-red-500' : ''}
                                    placeholder='johndoe'
                                />
                                {errors.username && (
                                    <p className='text-xs text-red-600 mt-1'>{errors.username}</p>
                                )}
                            </div>

                            {/* Role Selection */}
                            <div className='space-y-4'>
                                {/* Standard Role */}
                                <div>
                                    <label className='block text-sm font-medium text-gray-700 mb-1'>
                                        Standard Role *
                                    </label>
                                    <Select
                                        value={formData.role}
                                        onValueChange={(value) => handleInputChange('role', value)}
                                        disabled={formData.useCustomRole}
                                    >
                                        <SelectTrigger
                                            className={errors.role ? 'border-red-500' : ''}
                                        >
                                            <SelectValue placeholder='Select a role' />
                                        </SelectTrigger>
                                        <SelectContent>
                                            {roles.map((role) => (
                                                <SelectItem key={role} value={role}>
                                                    {role.charAt(0).toUpperCase() + role.slice(1)}
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                    {errors.role && (
                                        <p className='text-xs text-red-600 mt-1'>{errors.role}</p>
                                    )}
                                </div>

                                {/* Custom Role Option */}
                                <div className='flex items-center space-x-2'>
                                    <input
                                        type='checkbox'
                                        id='useCustomRole'
                                        checked={formData.useCustomRole}
                                        onChange={(e) => {
                                            handleInputChange('useCustomRole', e.target.checked);
                                            if (!e.target.checked) {
                                                handleInputChange('customRole', '');
                                            }
                                        }}
                                        className='h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded'
                                    />
                                    <label
                                        htmlFor='useCustomRole'
                                        className='text-sm text-gray-700'
                                    >
                                        Use custom role instead
                                    </label>
                                </div>

                                {/* Custom Role Selection */}
                                {formData.useCustomRole && (
                                    <div>
                                        <label className='block text-sm font-medium text-gray-700 mb-1'>
                                            Custom Role *
                                        </label>
                                        <Select
                                            value={formData.customRole}
                                            onValueChange={(value) =>
                                                handleInputChange('customRole', value)
                                            }
                                        >
                                            <SelectTrigger
                                                className={
                                                    errors.customRole ? 'border-red-500' : ''
                                                }
                                            >
                                                <SelectValue placeholder='Select a custom role' />
                                            </SelectTrigger>
                                            <SelectContent>
                                                {customRoles.map((role) => (
                                                    <SelectItem key={role._id} value={role._id}>
                                                        {role.displayName}
                                                    </SelectItem>
                                                ))}
                                            </SelectContent>
                                        </Select>
                                        {errors.customRole && (
                                            <p className='text-xs text-red-600 mt-1'>
                                                {errors.customRole}
                                            </p>
                                        )}
                                    </div>
                                )}
                            </div>

                            {/* Password Fields */}
                            <div className='space-y-4'>
                                <div>
                                    <label className='block text-sm font-medium text-gray-700 mb-1'>
                                        Password {!user && '*'}
                                        {user && (
                                            <span className='text-xs text-gray-500'>
                                                (leave blank to keep current)
                                            </span>
                                        )}
                                    </label>
                                    <div className='relative'>
                                        <Input
                                            type={showPassword ? 'text' : 'password'}
                                            value={formData.password}
                                            onChange={(e) =>
                                                handleInputChange('password', e.target.value)
                                            }
                                            className={errors.password ? 'border-red-500' : ''}
                                            placeholder='••••••••'
                                        />
                                        <Button
                                            type='button'
                                            variant='ghost'
                                            size='sm'
                                            className='absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent'
                                            onClick={() => setShowPassword(!showPassword)}
                                        >
                                            {showPassword ? (
                                                <EyeOffIcon className='h-4 w-4' />
                                            ) : (
                                                <EyeIcon className='h-4 w-4' />
                                            )}
                                        </Button>
                                    </div>
                                    {errors.password && (
                                        <p className='text-xs text-red-600 mt-1'>
                                            {errors.password}
                                        </p>
                                    )}
                                </div>

                                {(formData.password || !user) && (
                                    <div>
                                        <label className='block text-sm font-medium text-gray-700 mb-1'>
                                            Confirm Password *
                                        </label>
                                        <div className='relative'>
                                            <Input
                                                type={showConfirmPassword ? 'text' : 'password'}
                                                value={formData.confirmPassword}
                                                onChange={(e) =>
                                                    handleInputChange(
                                                        'confirmPassword',
                                                        e.target.value
                                                    )
                                                }
                                                className={
                                                    errors.confirmPassword ? 'border-red-500' : ''
                                                }
                                                placeholder='••••••••'
                                            />
                                            <Button
                                                type='button'
                                                variant='ghost'
                                                size='sm'
                                                className='absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent'
                                                onClick={() =>
                                                    setShowConfirmPassword(!showConfirmPassword)
                                                }
                                            >
                                                {showConfirmPassword ? (
                                                    <EyeOffIcon className='h-4 w-4' />
                                                ) : (
                                                    <EyeIcon className='h-4 w-4' />
                                                )}
                                            </Button>
                                        </div>
                                        {errors.confirmPassword && (
                                            <p className='text-xs text-red-600 mt-1'>
                                                {errors.confirmPassword}
                                            </p>
                                        )}
                                    </div>
                                )}
                            </div>

                            {/* Status */}
                            <div>
                                <label className='block text-sm font-medium text-gray-700 mb-1'>
                                    Status
                                </label>
                                <Select
                                    value={formData.isActive ? 'active' : 'inactive'}
                                    onValueChange={(value) =>
                                        handleInputChange('isActive', value === 'active')
                                    }
                                >
                                    <SelectTrigger>
                                        <SelectValue />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value='active'>Active</SelectItem>
                                        <SelectItem value='inactive'>Inactive</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                        </form>
                    )}

                    {/* Permissions Tab */}
                    {activeTab === 'permissions' && user && (
                        <div className='space-y-6 p-4'>
                            {loadingPermissions ? (
                                <div className='flex items-center justify-center py-8'>
                                    <LoaderIcon className='h-6 w-6 animate-spin mr-2' />
                                    <span>Loading permissions...</span>
                                </div>
                            ) : (
                                <UserPermissionOverrides
                                    userId={user._id}
                                    user={user}
                                    permissions={permissions}
                                    overrides={userPermissions.overrides}
                                    onGrantPermission={handleGrantPermission}
                                    onDenyPermission={handleDenyPermission}
                                    onRemoveOverride={handleRemoveOverride}
                                    disabled={loading}
                                />
                            )}
                        </div>
                    )}
                </div>

                <DialogFooter className='pt-4 border-t border-border bg-muted/20'>
                    <Button variant='outline' onClick={onCancel} disabled={loading} className='btn-enhanced'>
                        Cancel
                    </Button>
                    <Button onClick={handleSubmit} disabled={loading} className='btn-enhanced'>
                        {loading && <LoaderIcon className='w-4 h-4 mr-2 animate-spin' />}
                        {user ? 'Update User' : 'Create User'}
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
};

export default UserForm;
