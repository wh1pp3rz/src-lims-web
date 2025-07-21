import React, { useState, useEffect } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from './ui/card.jsx';
import { Button } from './ui/button.jsx';
import { Input } from './ui/input.jsx';
import { Badge } from './ui/badge.jsx';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select.jsx';
import { SearchIcon, CheckIcon, XIcon, FilterIcon } from 'lucide-react';

const PermissionSelector = ({
    permissions = [],
    selectedPermissions = [],
    onSelectionChange,
    title = 'Select Permissions',
    description = 'Choose permissions to assign',
    disabled = false,
    showCategories = true,
    showSearch = true,
    maxHeight = '400px',
}) => {
    const [searchTerm, setSearchTerm] = useState('');
    const [categoryFilter, setCategoryFilter] = useState('');
    const [filteredPermissions, setFilteredPermissions] = useState(permissions);

    // Extract unique categories
    const categories = [...new Set(permissions.map((p) => p.category))].sort();

    // Filter permissions based on search and category
    useEffect(() => {
        let filtered = permissions;

        // Apply search filter
        if (searchTerm) {
            filtered = filtered.filter(
                (permission) =>
                    permission.displayName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                    permission.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                    permission.name.toLowerCase().includes(searchTerm.toLowerCase())
            );
        }

        // Apply category filter
        if (categoryFilter) {
            filtered = filtered.filter((permission) => permission.category === categoryFilter);
        }

        setFilteredPermissions(filtered);
    }, [permissions, searchTerm, categoryFilter]);

    // Group permissions by category
    const groupedPermissions = filteredPermissions.reduce((groups, permission) => {
        const category = permission.category || 'uncategorized';
        if (!groups[category]) {
            groups[category] = [];
        }
        groups[category].push(permission);
        return groups;
    }, {});

    const handlePermissionToggle = (permissionId) => {
        if (disabled) return;

        const isCurrentlySelected = selectedPermissions.includes(permissionId);
        let newSelection;

        if (isCurrentlySelected) {
            newSelection = selectedPermissions.filter((id) => id !== permissionId);
        } else {
            newSelection = [...selectedPermissions, permissionId];
        }

        onSelectionChange(newSelection);
    };

    const handleSelectAll = () => {
        if (disabled) return;
        const allFilteredIds = filteredPermissions.map((p) => p._id);
        const allSelected = allFilteredIds.every((id) => selectedPermissions.includes(id));

        if (allSelected) {
            // Deselect all filtered permissions
            const newSelection = selectedPermissions.filter((id) => !allFilteredIds.includes(id));
            onSelectionChange(newSelection);
        } else {
            // Select all filtered permissions
            const newSelection = [...new Set([...selectedPermissions, ...allFilteredIds])];
            onSelectionChange(newSelection);
        }
    };

    const handleSelectByCategory = (category) => {
        if (disabled) return;
        const categoryPermissions = groupedPermissions[category] || [];
        const categoryIds = categoryPermissions.map((p) => p._id);
        const allCategorySelected = categoryIds.every((id) => selectedPermissions.includes(id));

        if (allCategorySelected) {
            // Deselect all permissions in this category
            const newSelection = selectedPermissions.filter((id) => !categoryIds.includes(id));
            onSelectionChange(newSelection);
        } else {
            // Select all permissions in this category
            const newSelection = [...new Set([...selectedPermissions, ...categoryIds])];
            onSelectionChange(newSelection);
        }
    };

    const formatCategoryName = (category) => {
        return category
            .split('_')
            .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
            .join(' ');
    };

    const getActionColor = (action) => {
        const colors = {
            create: 'bg-green-100 text-green-800',
            read: 'bg-blue-100 text-blue-800',
            update: 'bg-yellow-100 text-yellow-800',
            delete: 'bg-red-100 text-red-800',
            manage: 'bg-purple-100 text-purple-800',
            access: 'bg-gray-100 text-gray-800',
        };
        return colors[action] || colors.access;
    };

    return (
        <Card className='w-full'>
            <CardHeader>
                <CardTitle className='flex items-center justify-between'>
                    <span>{title}</span>
                    <Badge variant='outline'>{selectedPermissions.length} selected</Badge>
                </CardTitle>
                {description && <p className='text-sm text-gray-600'>{description}</p>}
            </CardHeader>

            <CardContent>
                {/* Search and Filter Controls */}
                {(showSearch || showCategories) && (
                    <div className='space-y-4 mb-4'>
                        {showSearch && (
                            <div className='relative'>
                                <SearchIcon className='absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4' />
                                <Input
                                    placeholder='Search permissions...'
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                    className='pl-10'
                                    disabled={disabled}
                                />
                            </div>
                        )}

                        {showCategories && categories.length > 0 && (
                            <div className='flex gap-2 items-center'>
                                <FilterIcon className='h-4 w-4 text-gray-500' />
                                <Select
                                    value={categoryFilter}
                                    onValueChange={setCategoryFilter}
                                    disabled={disabled}
                                >
                                    <SelectTrigger className='w-48'>
                                        <SelectValue placeholder='Filter by category' />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value=''>All Categories</SelectItem>
                                        {categories.map((category) => (
                                            <SelectItem key={category} value={category}>
                                                {formatCategoryName(category)}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>

                                <Button
                                    variant='outline'
                                    size='sm'
                                    onClick={handleSelectAll}
                                    disabled={disabled || filteredPermissions.length === 0}
                                >
                                    {filteredPermissions.length > 0 &&
                                    filteredPermissions.every((p) =>
                                        selectedPermissions.includes(p._id)
                                    )
                                        ? 'Deselect All'
                                        : 'Select All'}
                                </Button>
                            </div>
                        )}
                    </div>
                )}

                {/* Permission Groups */}
                <div style={{ maxHeight, overflowY: 'auto' }} className='space-y-4'>
                    {Object.entries(groupedPermissions).map(([category, categoryPermissions]) => (
                        <div key={category} className='border rounded-lg p-4'>
                            <div className='flex items-center justify-between mb-3'>
                                <h4 className='font-medium text-sm text-gray-900'>
                                    {formatCategoryName(category)}
                                </h4>
                                <Button
                                    variant='ghost'
                                    size='sm'
                                    onClick={() => handleSelectByCategory(category)}
                                    disabled={disabled}
                                    className='text-xs'
                                >
                                    {categoryPermissions.every((p) =>
                                        selectedPermissions.includes(p._id)
                                    )
                                        ? 'Deselect All'
                                        : 'Select All'}
                                </Button>
                            </div>

                            <div className='grid grid-cols-1 gap-2'>
                                {categoryPermissions.map((permission) => {
                                    const isSelected = selectedPermissions.includes(permission._id);

                                    return (
                                        <div
                                            key={permission._id}
                                            className={`
                        p-3 rounded-md border cursor-pointer transition-colors
                        ${
                            isSelected
                                ? 'bg-blue-50 border-blue-200'
                                : 'bg-gray-50 border-gray-200 hover:bg-gray-100'
                        }
                        ${disabled ? 'cursor-not-allowed opacity-50' : ''}
                      `}
                                            onClick={() => handlePermissionToggle(permission._id)}
                                        >
                                            <div className='flex items-start justify-between'>
                                                <div className='flex-1'>
                                                    <div className='flex items-center gap-2'>
                                                        <span className='font-medium text-sm'>
                                                            {permission.displayName}
                                                        </span>
                                                        <Badge
                                                            className={`text-xs ${getActionColor(permission.action)}`}
                                                        >
                                                            {permission.action}
                                                        </Badge>
                                                    </div>
                                                    <p className='text-xs text-gray-600 mt-1'>
                                                        {permission.description}
                                                    </p>
                                                    <p className='text-xs text-gray-400 mt-1'>
                                                        Resource: {permission.resource}
                                                    </p>
                                                </div>

                                                <div
                                                    className={`
                          w-5 h-5 rounded border-2 flex items-center justify-center
                          ${isSelected ? 'bg-blue-500 border-blue-500' : 'border-gray-300'}
                        `}
                                                >
                                                    {isSelected && (
                                                        <CheckIcon className='w-3 h-3 text-white' />
                                                    )}
                                                </div>
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                        </div>
                    ))}

                    {filteredPermissions.length === 0 && (
                        <div className='text-center py-8 text-gray-500'>
                            <p>No permissions found matching your criteria.</p>
                        </div>
                    )}
                </div>
            </CardContent>
        </Card>
    );
};

export default PermissionSelector;
