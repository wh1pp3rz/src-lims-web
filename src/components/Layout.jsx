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
    ShieldCheckIcon,
} from 'lucide-react';
import srcLogo from '../assets/src-logo.webp';
import { Link, useLocation, useNavigate } from 'react-router-dom';

const Layout = ({ children }) => {
    const { user, logout } = useAuth();
    const [sidebarOpen, setSidebarOpen] = useState(false);
    const location = useLocation();
    const navigate = useNavigate();

    const navigation = [
        { name: 'Dashboard', href: '/dashboard', icon: HomeIcon },
        { name: 'Sample Management', href: '/samples', icon: FlaskConicalIcon },
        { name: 'Test Results', href: '/results', icon: ClipboardListIcon },
        { name: 'Reports', href: '/reports', icon: FileTextIcon },
        { name: 'User Management', href: '/users', icon: UsersIcon, permission: 'user_management' },
        { name: 'Audit Logs', href: '/audit-logs', icon: ShieldCheckIcon, permission: 'view_audit_logs' },
        { name: 'Settings', href: '/settings', icon: SettingsIcon },
    ];

    const handleLogout = async () => {
        await logout();
        // Navigate to login with replace to clear history stack
        navigate('/login', { replace: true });
    };

    const hasPermission = (permission) => {
        if (!permission) return true;
        return user?.permissions?.includes(permission) || user?.role?.toLowerCase() === 'admin';
    };

    const filteredNavigation = navigation.filter((item) => hasPermission(item.permission));

    return (
        <div className='min-h-screen bg-background'>
            {/* Mobile sidebar */}
            <div className={`fixed inset-0 flex z-40 md:hidden ${sidebarOpen ? '' : 'hidden'}`}>
                <div
                    className='fixed inset-0 bg-black/50 backdrop-blur-sm'
                    onClick={() => setSidebarOpen(false)}
                />

                <div className='relative flex-1 flex flex-col max-w-xs w-full bg-white shadow-elevated'>
                    <div className='absolute top-0 right-0 -mr-12 pt-2'>
                        <button
                            type='button'
                            className='ml-1 flex items-center justify-center h-10 w-10 rounded-full focus:outline-none focus:ring-2 focus:ring-inset focus:ring-white bg-white/10 hover:bg-white/20 transition-colors'
                            onClick={() => setSidebarOpen(false)}
                        >
                            <XIcon className='h-6 w-6 text-white' />
                        </button>
                    </div>

                    <div className='flex-1 h-0 pt-6 pb-4 overflow-y-auto'>
                        {/* Enhanced Logo Section */}
                        <div className='flex items-center flex-shrink-0 px-6 mb-8'>
                            <div className='flex items-center'>
                                <img src={srcLogo} alt='SRC Logo' className='h-16 w-auto' />
                                <div className='ml-3'>
                                    <h2 className='text-body font-semibold text-foreground'>Laboratory Management</h2>
                                </div>
                            </div>
                        </div>
                        
                        {/* Enhanced Navigation */}
                        <nav className='px-4 space-y-2'>
                            {filteredNavigation.map((item) => {
                                const isActive = location.pathname === item.href;
                                return (
                                    <Link
                                        key={item.name}
                                        to={item.href}
                                        className={`nav-item group flex items-center px-4 py-3 text-body font-medium ${
                                            isActive ? 'active' : 'text-foreground/70 hover:text-foreground'
                                        }`}
                                        onClick={() => setSidebarOpen(false)}
                                    >
                                        <item.icon
                                            className={`mr-4 h-5 w-5 transition-colors ${
                                                isActive ? 'text-current' : 'text-muted-foreground group-hover:text-foreground'
                                            }`}
                                        />
                                        {item.name}
                                    </Link>
                                );
                            })}
                        </nav>
                    </div>

                    {/* Enhanced User Section */}
                    <div className='flex-shrink-0 border-t border-border p-4 bg-muted/30'>
                        <div className='flex items-center'>
                            <div className='flex items-center justify-center w-10 h-10 rounded-full bg-primary text-primary-foreground font-semibold text-sm'>
                                {(user?.firstName?.[0] || user?.name?.[0] || user?.username?.[0] || 'U').toUpperCase()}
                            </div>
                            <div className='ml-3'>
                                <p className='text-body font-medium text-foreground'>
                                    {`${user?.firstName || ''} ${user?.lastName || ''}`.trim() ||
                                        user?.name ||
                                        user?.username}
                                </p>
                                <p className='text-small text-muted'>{user?.role}</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Enhanced Static sidebar for desktop */}
            <div className='hidden md:flex md:w-72 md:flex-col md:fixed md:inset-y-0'>
                <div className='flex-1 flex flex-col min-h-0 border-r border-sidebar-border bg-sidebar-bg shadow-card'>
                    <div className='flex-1 flex flex-col pt-6 pb-4 overflow-y-auto'>
                        {/* Enhanced Logo Section */}
                        <div className='flex items-center flex-shrink-0 px-6 mb-8'>
                            <img src={srcLogo} alt='SRC Logo' className='h-16 w-auto' />
                            <div className='ml-3'>
                                <h2 className='text-body font-semibold text-foreground'>Laboratory Management</h2>
                            </div>
                        </div>
                        
                        {/* Enhanced Navigation */}
                        <nav className='flex-1 px-4 space-y-1'>
                            {filteredNavigation.map((item) => {
                                const isActive = location.pathname === item.href;
                                return (
                                    <Link
                                        key={item.name}
                                        to={item.href}
                                        className={`nav-item group flex items-center px-4 py-3 text-body font-medium ${
                                            isActive ? 'active' : 'text-foreground/70 hover:text-foreground'
                                        }`}
                                    >
                                        <item.icon
                                            className={`mr-4 h-5 w-5 transition-colors ${
                                                isActive ? 'text-current' : 'text-muted-foreground group-hover:text-foreground'
                                            }`}
                                        />
                                        {item.name}
                                    </Link>
                                );
                            })}
                        </nav>
                    </div>

                    {/* Enhanced User Section */}
                    <div className='flex-shrink-0 border-t border-border p-4 bg-muted/20'>
                        <div className='flex items-center w-full'>
                            <div className='flex items-center justify-center w-10 h-10 rounded-full bg-primary text-primary-foreground font-semibold text-sm'>
                                {(user?.firstName?.[0] || user?.name?.[0] || user?.username?.[0] || 'U').toUpperCase()}
                            </div>
                            <div className='flex-1 ml-3'>
                                <p className='text-body font-medium text-foreground'>
                                    {`${user?.firstName || ''} ${user?.lastName || ''}`.trim() ||
                                        user?.name ||
                                        user?.username}
                                </p>
                                <p className='text-small text-muted'>{user?.role}</p>
                            </div>
                            <Button
                                variant='ghost'
                                size='sm'
                                onClick={handleLogout}
                                className='ml-3 btn-enhanced hover:bg-destructive/10 hover:text-destructive'
                                title='Logout'
                            >
                                <LogOutIcon className='h-4 w-4' />
                            </Button>
                        </div>
                    </div>
                </div>
            </div>

            {/* Enhanced Main content */}
            <div className='md:pl-72 flex flex-col flex-1'>
                <div className='sticky top-0 z-10 md:hidden pl-1 pt-1 sm:pl-3 sm:pt-3 bg-background'>
                    <Button
                        variant='ghost'
                        size='icon'
                        className='h-12 w-12 btn-enhanced'
                        onClick={() => setSidebarOpen(true)}
                    >
                        <MenuIcon className='h-6 w-6' />
                    </Button>
                </div>

                <main className='flex-1 animate-fade-in'>
                    <div className='py-8'>
                        <div className='max-w-7xl mx-auto px-6 sm:px-8 lg:px-10'>{children}</div>
                    </div>
                </main>
            </div>
        </div>
    );
};

export default Layout;
