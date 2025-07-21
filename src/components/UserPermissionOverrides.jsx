import React, { useState } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from './ui/card.jsx';
import { Button } from './ui/button.jsx';
import { Input } from './ui/input.jsx';
import { Badge } from './ui/badge.jsx';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select.jsx';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from './ui/dialog.jsx';
import {
    PlusIcon,
    TrashIcon,
    ShieldCheckIcon,
    ShieldXIcon,
    CalendarIcon,
    ClockIcon,
    AlertCircleIcon,
} from 'lucide-react';

const UserPermissionOverrides = ({
    userId,
    user,
    permissions = [],
    overrides = { granted: [], denied: [] },
    onGrantPermission,
    onDenyPermission,
    onRemoveOverride,
    disabled = false,
}) => {
    const [showAddDialog, setShowAddDialog] = useState(false);
    const [addType, setAddType] = useState('grant'); // 'grant' or 'deny'
    const [selectedPermission, setSelectedPermission] = useState('');
    const [expirationDate, setExpirationDate] = useState('');
    const [reason, setReason] = useState('');
    const [loading, setLoading] = useState(false);

    // Get permissions that are not already overridden
    const availablePermissions = permissions.filter((permission) => {
        const isAlreadyGranted = overrides.granted.some(
            (override) =>
                override.permissionId === permission._id ||
                override.permission?._id === permission._id
        );
        const isAlreadyDenied = overrides.denied.some(
            (override) =>
                override.permissionId === permission._id ||
                override.permission?._id === permission._id
        );
        return !isAlreadyGranted && !isAlreadyDenied;
    });

    const handleAddOverride = async () => {
        if (!selectedPermission || loading) return;

        setLoading(true);
        try {
            const data = {
                permissionId: selectedPermission,
                reason: reason.trim() || null,
                expiresAt: expirationDate || null,
            };

            if (addType === 'grant') {
                await onGrantPermission(userId, data);
            } else {
                await onDenyPermission(userId, data);
            }

            // Reset form
            setSelectedPermission('');
            setReason('');
            setExpirationDate('');
            setShowAddDialog(false);
        } catch (error) {
            console.error('Error adding permission override:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleRemoveOverride = async (permissionId, type) => {
        if (loading) return;
        setLoading(true);
        try {
            await onRemoveOverride(userId, permissionId, type);
        } catch (error) {
            console.error('Error removing permission override:', error);
        } finally {
            setLoading(false);
        }
    };

    const formatDate = (dateString) => {
        if (!dateString) return 'Never';
        return new Date(dateString).toLocaleDateString();
    };

    const isExpired = (expiresAt) => {
        if (!expiresAt) return false;
        return new Date(expiresAt) <= new Date();
    };

    const getPermissionById = (permissionId) => {
        return permissions.find((p) => p._id === permissionId);
    };

    return (
        <div className='space-y-6'>
            {/* Header */}
            <div className='flex items-center justify-between'>
                <div>
                    <h3 className='text-lg font-semibold'>Permission Overrides</h3>
                    <p className='text-sm text-gray-600'>
                        Grant or deny specific permissions for {user?.username || 'this user'}
                    </p>
                </div>

                {!disabled && (
                    <div className='flex gap-2'>
                        <Button
                            onClick={() => {
                                setAddType('grant');
                                setShowAddDialog(true);
                            }}
                            size='sm'
                            className='bg-green-600 hover:bg-green-700'
                            disabled={loading || availablePermissions.length === 0}
                        >
                            <ShieldCheckIcon className='h-4 w-4 mr-2' />
                            Grant Permission
                        </Button>
                        <Button
                            onClick={() => {
                                setAddType('deny');
                                setShowAddDialog(true);
                            }}
                            size='sm'
                            variant='outline'
                            className='border-red-300 text-red-700 hover:bg-red-50'
                            disabled={loading || availablePermissions.length === 0}
                        >
                            <ShieldXIcon className='h-4 w-4 mr-2' />
                            Deny Permission
                        </Button>
                    </div>
                )}
            </div>

            {/* Granted Permissions */}
            <Card>
                <CardHeader>
                    <CardTitle className='flex items-center gap-2 text-green-700'>
                        <ShieldCheckIcon className='h-5 w-5' />
                        Granted Permissions
                        <Badge variant='outline' className='ml-auto'>
                            {overrides.granted.length}
                        </Badge>
                    </CardTitle>
                </CardHeader>
                <CardContent>
                    {overrides.granted.length === 0 ? (
                        <p className='text-sm text-gray-500'>No additional permissions granted.</p>
                    ) : (
                        <div className='space-y-3'>
                            {overrides.granted.map((override) => {
                                const permission =
                                    override.permission || getPermissionById(override.permissionId);
                                const expired = isExpired(override.expiresAt);

                                return (
                                    <div
                                        key={override._id}
                                        className={`p-3 border rounded-lg ${expired ? 'bg-red-50 border-red-200' : 'bg-green-50 border-green-200'}`}
                                    >
                                        <div className='flex items-start justify-between'>
                                            <div className='flex-1'>
                                                <div className='flex items-center gap-2'>
                                                    <span className='font-medium text-sm'>
                                                        {permission?.displayName ||
                                                            'Unknown Permission'}
                                                    </span>
                                                    {expired && (
                                                        <Badge
                                                            variant='destructive'
                                                            className='text-xs'
                                                        >
                                                            <AlertCircleIcon className='h-3 w-3 mr-1' />
                                                            Expired
                                                        </Badge>
                                                    )}
                                                </div>
                                                <p className='text-xs text-gray-600 mt-1'>
                                                    {permission?.description ||
                                                        'No description available'}
                                                </p>

                                                <div className='flex gap-4 mt-2 text-xs text-gray-500'>
                                                    <span className='flex items-center gap-1'>
                                                        <CalendarIcon className='h-3 w-3' />
                                                        Expires: {formatDate(override.expiresAt)}
                                                    </span>
                                                    <span className='flex items-center gap-1'>
                                                        <ClockIcon className='h-3 w-3' />
                                                        Created: {formatDate(override.createdAt)}
                                                    </span>
                                                </div>

                                                {override.reason && (
                                                    <p className='text-xs text-gray-600 mt-1 italic'>
                                                        Reason: {override.reason}
                                                    </p>
                                                )}
                                            </div>

                                            {!disabled && (
                                                <Button
                                                    onClick={() =>
                                                        handleRemoveOverride(override._id, 'grant')
                                                    }
                                                    size='sm'
                                                    variant='ghost'
                                                    className='text-red-600 hover:text-red-700 hover:bg-red-50'
                                                    disabled={loading}
                                                >
                                                    <TrashIcon className='h-4 w-4' />
                                                </Button>
                                            )}
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    )}
                </CardContent>
            </Card>

            {/* Denied Permissions */}
            <Card>
                <CardHeader>
                    <CardTitle className='flex items-center gap-2 text-red-700'>
                        <ShieldXIcon className='h-5 w-5' />
                        Denied Permissions
                        <Badge variant='outline' className='ml-auto'>
                            {overrides.denied.length}
                        </Badge>
                    </CardTitle>
                </CardHeader>
                <CardContent>
                    {overrides.denied.length === 0 ? (
                        <p className='text-sm text-gray-500'>No permissions explicitly denied.</p>
                    ) : (
                        <div className='space-y-3'>
                            {overrides.denied.map((override) => {
                                const permission =
                                    override.permission || getPermissionById(override.permissionId);
                                const expired = isExpired(override.expiresAt);

                                return (
                                    <div
                                        key={override._id}
                                        className={`p-3 border rounded-lg ${expired ? 'bg-gray-50 border-gray-200' : 'bg-red-50 border-red-200'}`}
                                    >
                                        <div className='flex items-start justify-between'>
                                            <div className='flex-1'>
                                                <div className='flex items-center gap-2'>
                                                    <span className='font-medium text-sm'>
                                                        {permission?.displayName ||
                                                            'Unknown Permission'}
                                                    </span>
                                                    {expired && (
                                                        <Badge
                                                            variant='secondary'
                                                            className='text-xs'
                                                        >
                                                            <AlertCircleIcon className='h-3 w-3 mr-1' />
                                                            Expired
                                                        </Badge>
                                                    )}
                                                </div>
                                                <p className='text-xs text-gray-600 mt-1'>
                                                    {permission?.description ||
                                                        'No description available'}
                                                </p>

                                                <div className='flex gap-4 mt-2 text-xs text-gray-500'>
                                                    <span className='flex items-center gap-1'>
                                                        <CalendarIcon className='h-3 w-3' />
                                                        Expires: {formatDate(override.expiresAt)}
                                                    </span>
                                                    <span className='flex items-center gap-1'>
                                                        <ClockIcon className='h-3 w-3' />
                                                        Created: {formatDate(override.createdAt)}
                                                    </span>
                                                </div>

                                                {override.reason && (
                                                    <p className='text-xs text-gray-600 mt-1 italic'>
                                                        Reason: {override.reason}
                                                    </p>
                                                )}
                                            </div>

                                            {!disabled && (
                                                <Button
                                                    onClick={() =>
                                                        handleRemoveOverride(override._id, 'deny')
                                                    }
                                                    size='sm'
                                                    variant='ghost'
                                                    className='text-red-600 hover:text-red-700 hover:bg-red-50'
                                                    disabled={loading}
                                                >
                                                    <TrashIcon className='h-4 w-4' />
                                                </Button>
                                            )}
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    )}
                </CardContent>
            </Card>

            {/* Add Permission Override Dialog */}
            <Dialog open={showAddDialog} onOpenChange={setShowAddDialog}>
                <DialogContent className='max-w-md'>
                    <DialogHeader>
                        <DialogTitle>
                            {addType === 'grant' ? 'Grant Permission' : 'Deny Permission'}
                        </DialogTitle>
                    </DialogHeader>

                    <div className='space-y-4'>
                        <div>
                            <label className='block text-sm font-medium text-gray-700 mb-1'>
                                Permission *
                            </label>
                            <Select
                                value={selectedPermission}
                                onValueChange={setSelectedPermission}
                            >
                                <SelectTrigger>
                                    <SelectValue placeholder='Select a permission' />
                                </SelectTrigger>
                                <SelectContent>
                                    {availablePermissions.map((permission) => (
                                        <SelectItem key={permission._id} value={permission._id}>
                                            {permission.displayName}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>

                        <div>
                            <label className='block text-sm font-medium text-gray-700 mb-1'>
                                Expiration Date (Optional)
                            </label>
                            <Input
                                type='date'
                                value={expirationDate}
                                onChange={(e) => setExpirationDate(e.target.value)}
                                placeholder='Leave empty for permanent'
                            />
                        </div>

                        <div>
                            <label className='block text-sm font-medium text-gray-700 mb-1'>
                                Reason (Optional)
                            </label>
                            <Input
                                value={reason}
                                onChange={(e) => setReason(e.target.value)}
                                placeholder='Explain why this override is needed'
                                maxLength={500}
                            />
                        </div>
                    </div>

                    <DialogFooter>
                        <Button
                            variant='outline'
                            onClick={() => setShowAddDialog(false)}
                            disabled={loading}
                        >
                            Cancel
                        </Button>
                        <Button
                            onClick={handleAddOverride}
                            disabled={!selectedPermission || loading}
                            className={addType === 'grant' ? 'bg-green-600 hover:bg-green-700' : ''}
                        >
                            {loading
                                ? 'Processing...'
                                : addType === 'grant'
                                  ? 'Grant Permission'
                                  : 'Deny Permission'}
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </div>
    );
};

export default UserPermissionOverrides;
