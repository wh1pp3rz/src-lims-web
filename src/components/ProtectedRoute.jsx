import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import useAuth from '@/hooks/useAuth.js';

const ProtectedRoute = ({ children, requiredPermissions = [] }) => {
    const { user, loading } = useAuth();
    const location = useLocation();

    if (loading) {
        return (
            <div className='flex items-center justify-center min-h-screen'>
                <div className='animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600'></div>
            </div>
        );
    }

    if (!user) {
        return <Navigate to='/login' state={{ from: location }} replace />;
    }

    // Check permissions if required
    if (requiredPermissions.length > 0) {
        const hasPermission = requiredPermissions.some(
            (permission) =>
                user.permissions?.includes(permission) || user.role?.toLowerCase() === 'admin'
        );

        if (!hasPermission) {
            return (
                <div className='flex items-center justify-center min-h-screen'>
                    <div className='text-center'>
                        <h1 className='text-2xl font-bold text-red-600 mb-4'>Access Denied</h1>
                        <p className='text-gray-600'>
                            You don't have permission to access this resource.
                        </p>
                    </div>
                </div>
            );
        }
    }

    return children;
};

export default ProtectedRoute;
