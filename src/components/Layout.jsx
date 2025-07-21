import React, { useState } from 'react';
import useAuth from '@/hooks/useAuth.js';
import { Button } from '@/components/ui/button.jsx';
import {
    MenuIcon,
    HomeIcon,
    UsersIcon,
    ClipboardListIcon,
    FlaskConicalIcon,
    FileTextIcon,
    SettingsIcon,
    LogOutIcon,
    XIcon,
} from 'lucide-react';
import srcLogo from '../assets/src-logo.webp';
import { Link, useLocation } from 'react-router-dom';

const Layout = ({ children }) => {
    const { user, logout } = useAuth();
    const [sidebarOpen, setSidebarOpen] = useState(false);
    const location = useLocation();

    const navigation = [
        { name: 'Dashboard', href: '/dashboard', icon: HomeIcon },
        { name: 'Sample Management', href: '/samples', icon: FlaskConicalIcon },
        { name: 'Test Results', href: '/results', icon: ClipboardListIcon },
        { name: 'Reports', href: '/reports', icon: FileTextIcon },
        { name: 'User Management', href: '/users', icon: UsersIcon, permission: 'user_management' },
        { name: 'Settings', href: '/settings', icon: SettingsIcon },
    ];

    const handleLogout = async () => {
        await logout();
    };

    const hasPermission = (permission) => {
        if (!permission) return true;
        return user?.permissions?.includes(permission) || user?.role?.toLowerCase() === 'admin';
    };

    const filteredNavigation = navigation.filter((item) => hasPermission(item.permission));

    return (
        <div className='min-h-screen bg-gray-50'>
            {/* Mobile sidebar */}
            <div className={`fixed inset-0 flex z-40 md:hidden ${sidebarOpen ? '' : 'hidden'}`}>
                <div
                    className='fixed inset-0 bg-gray-600 bg-opacity-75'
                    onClick={() => setSidebarOpen(false)}
                />

                <div className='relative flex-1 flex flex-col max-w-xs w-full bg-white'>
                    <div className='absolute top-0 right-0 -mr-12 pt-2'>
                        <button
                            type='button'
                            className='ml-1 flex items-center justify-center h-10 w-10 rounded-full focus:outline-none focus:ring-2 focus:ring-inset focus:ring-white'
                            onClick={() => setSidebarOpen(false)}
                        >
                            <XIcon className='h-6 w-6 text-white' />
                        </button>
                    </div>

                    <div className='flex-1 h-0 pt-5 pb-4 overflow-y-auto'>
                        <div className='flex items-center flex-shrink-0 px-4'>
                            <div className='flex items-center'>
                                <img src={srcLogo} alt='SRC Logo' className='h-20 w-auto' />
                            </div>
                        </div>
                        <nav className='mt-5 px-2 space-y-1'>
                            {filteredNavigation.map((item) => {
                                const isActive = location.pathname === item.href;
                                return (
                                    <Link
                                        key={item.name}
                                        to={item.href}
                                        className={`group flex items-center px-2 py-2 text-base font-medium rounded-md ${
                                            isActive
                                                ? 'bg-blue-100 text-blue-900'
                                                : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                                        }`}
                                        onClick={() => setSidebarOpen(false)}
                                    >
                                        <item.icon
                                            className={`mr-4 h-6 w-6 ${isActive ? 'text-blue-500' : 'text-gray-400'}`}
                                        />
                                        {item.name}
                                    </Link>
                                );
                            })}
                        </nav>
                    </div>

                    <div className='flex-shrink-0 flex border-t border-gray-200 p-4'>
                        <div className='flex items-center'>
                            <div className='ml-3'>
                                <p className='text-base font-medium text-gray-700'>
                                    {`${user?.firstName || ''} ${user?.lastName || ''}`.trim() ||
                                        user?.name ||
                                        user?.username}
                                </p>
                                <p className='text-sm font-medium text-gray-500'>{user?.role}</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Static sidebar for desktop */}
            <div className='hidden md:flex md:w-64 md:flex-col md:fixed md:inset-y-0'>
                <div className='flex-1 flex flex-col min-h-0 border-r border-gray-200 bg-white'>
                    <div className='flex-1 flex flex-col pt-5 pb-4 overflow-y-auto'>
                        <div className='flex items-center flex-shrink-0 px-4'>
                            <img src={srcLogo} alt='SRC Logo' className='h-20 w-auto' />
                        </div>
                        <nav className='mt-5 flex-1 px-2 bg-white space-y-1'>
                            {filteredNavigation.map((item) => {
                                const isActive = location.pathname === item.href;
                                return (
                                    <Link
                                        key={item.name}
                                        to={item.href}
                                        className={`group flex items-center px-2 py-2 text-sm font-medium rounded-md ${
                                            isActive
                                                ? 'bg-blue-100 text-blue-900'
                                                : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                                        }`}
                                    >
                                        <item.icon
                                            className={`mr-3 h-5 w-5 ${isActive ? 'text-blue-500' : 'text-gray-400'}`}
                                        />
                                        {item.name}
                                    </Link>
                                );
                            })}
                        </nav>
                    </div>

                    <div className='flex-shrink-0 flex border-t border-gray-200 p-4'>
                        <div className='flex items-center w-full'>
                            <div className='flex-1'>
                                <p className='text-sm font-medium text-gray-700'>
                                    {`${user?.firstName || ''} ${user?.lastName || ''}`.trim() ||
                                        user?.name ||
                                        user?.username}
                                </p>
                                <p className='text-xs font-medium text-gray-500'>{user?.role}</p>
                            </div>
                            <Button
                                variant='ghost'
                                size='sm'
                                onClick={handleLogout}
                                className='ml-3'
                            >
                                <LogOutIcon className='h-4 w-4' />
                            </Button>
                        </div>
                    </div>
                </div>
            </div>

            {/* Main content */}
            <div className='md:pl-64 flex flex-col flex-1'>
                <div className='sticky top-0 z-10 md:hidden pl-1 pt-1 sm:pl-3 sm:pt-3 bg-gray-50'>
                    <button
                        type='button'
                        className='-ml-0.5 -mt-0.5 h-12 w-12 inline-flex items-center justify-center rounded-md text-gray-500 hover:text-gray-900 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-blue-500'
                        onClick={() => setSidebarOpen(true)}
                    >
                        <MenuIcon className='h-6 w-6' />
                    </button>
                </div>

                <main className='flex-1'>
                    <div className='py-6'>
                        <div className='max-w-7xl mx-auto px-4 sm:px-6 md:px-8'>{children}</div>
                    </div>
                </main>
            </div>
        </div>
    );
};

export default Layout;
