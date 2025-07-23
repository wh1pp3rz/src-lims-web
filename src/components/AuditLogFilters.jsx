import React, { useState, useEffect } from 'react';
import { Button } from './ui/button.jsx';
import { Input } from './ui/input.jsx';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select.jsx';
import { Card } from './ui/card.jsx';
import { 
    SearchIcon, 
    FilterIcon, 
    RotateCcwIcon,
    CalendarIcon,
    ChevronDownIcon,
    ChevronUpIcon
} from 'lucide-react';
import auditLogService from '../services/auditLogService.js';

const AuditLogFilters = ({ filters, onFiltersChange, onClearFilters }) => {
    const [showAdvanced, setShowAdvanced] = useState(false);
    const [filterOptions, setFilterOptions] = useState({ actions: [], resources: [] });
    const [datePresets] = useState(auditLogService.getDatePresets());

    useEffect(() => {
        const loadFilterOptions = async () => {
            try {
                const options = await auditLogService.getFilterOptions();
                setFilterOptions(options);
            } catch (error) {
                console.error('Failed to load filter options:', error);
            }
        };
        loadFilterOptions();
    }, []);

    const handleInputChange = (field, value) => {
        onFiltersChange({
            ...filters,
            [field]: value,
            page: 1 // Reset to first page when filters change
        });
    };

    const handleDatePresetClick = (preset) => {
        onFiltersChange({
            ...filters,
            startDate: preset.startDate,
            endDate: preset.endDate,
            page: 1
        });
    };

    const clearAllFilters = () => {
        onClearFilters();
    };

    const hasActiveFilters = () => {
        return filters.search || filters.action || filters.resource || 
               filters.userId || filters.success !== undefined || 
               filters.startDate || filters.endDate;
    };

    return (
        <Card className="p-4 mb-6">
            <div className="space-y-4">
                {/* Basic Filters Row */}
                <div className="flex flex-wrap gap-4 items-end">
                    {/* Search Input */}
                    <div className="flex-1 min-w-64">
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Search
                        </label>
                        <div className="relative">
                            <SearchIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                            <Input
                                type="text"
                                placeholder="Search logs..."
                                value={filters.search || ''}
                                onChange={(e) => handleInputChange('search', e.target.value)}
                                className="pl-10"
                            />
                        </div>
                    </div>

                    {/* Action Filter */}
                    <div className="min-w-40">
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Action
                        </label>
                        <Select
                            value={filters.action || ''}
                            onValueChange={(value) => handleInputChange('action', value)}
                        >
                            <SelectTrigger>
                                <SelectValue placeholder="All Actions" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="">All Actions</SelectItem>
                                {filterOptions.actions.map(action => (
                                    <SelectItem key={action} value={action}>{action}</SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>

                    {/* Resource Filter */}
                    <div className="min-w-40">
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Resource
                        </label>
                        <Select
                            value={filters.resource || ''}
                            onValueChange={(value) => handleInputChange('resource', value)}
                        >
                            <SelectTrigger>
                                <SelectValue placeholder="All Resources" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="">All Resources</SelectItem>
                                {filterOptions.resources.map(resource => (
                                    <SelectItem key={resource} value={resource}>{resource}</SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>

                    {/* Advanced Filters Toggle */}
                    <Button
                        variant="outline"
                        onClick={() => setShowAdvanced(!showAdvanced)}
                        className="flex items-center gap-2"
                    >
                        <FilterIcon className="h-4 w-4" />
                        Advanced
                        {showAdvanced ? 
                            <ChevronUpIcon className="h-4 w-4" /> : 
                            <ChevronDownIcon className="h-4 w-4" />
                        }
                    </Button>

                    {/* Clear Filters */}
                    {hasActiveFilters() && (
                        <Button
                            variant="outline"
                            onClick={clearAllFilters}
                            className="flex items-center gap-2"
                        >
                            <RotateCcwIcon className="h-4 w-4" />
                            Clear
                        </Button>
                    )}
                </div>

                {/* Advanced Filters */}
                {showAdvanced && (
                    <div className="border-t pt-4 space-y-4">
                        {/* Date Range Row */}
                        <div className="flex flex-wrap gap-4 items-end">
                            <div className="min-w-40">
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Start Date
                                </label>
                                <Input
                                    type="date"
                                    value={filters.startDate || ''}
                                    onChange={(e) => handleInputChange('startDate', e.target.value)}
                                />
                            </div>

                            <div className="min-w-40">
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    End Date
                                </label>
                                <Input
                                    type="date"
                                    value={filters.endDate || ''}
                                    onChange={(e) => handleInputChange('endDate', e.target.value)}
                                />
                            </div>

                            <div className="min-w-40">
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Status
                                </label>
                                <Select
                                    value={filters.success === undefined ? '' : String(filters.success)}
                                    onValueChange={(value) => 
                                        handleInputChange('success', value === '' ? undefined : value === 'true')
                                    }
                                >
                                    <SelectTrigger>
                                        <SelectValue placeholder="All" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="">All</SelectItem>
                                        <SelectItem value="true">Success</SelectItem>
                                        <SelectItem value="false">Failed</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                        </div>

                        {/* Date Presets */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Quick Date Filters
                            </label>
                            <div className="flex flex-wrap gap-2">
                                {Object.entries(datePresets).map(([key, preset]) => (
                                    <Button
                                        key={key}
                                        variant="outline"
                                        size="sm"
                                        onClick={() => handleDatePresetClick(preset)}
                                        className="text-xs"
                                    >
                                        <CalendarIcon className="h-3 w-3 mr-1" />
                                        {preset.label}
                                    </Button>
                                ))}
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </Card>
    );
};

export default AuditLogFilters;