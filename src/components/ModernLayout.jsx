import React from 'react';
import { AppSidebar } from '@/components/AppSidebar.jsx';
import {
    Breadcrumb,
    BreadcrumbItem,
    BreadcrumbLink,
    BreadcrumbList,
    BreadcrumbPage,
    BreadcrumbSeparator,
} from '@/components/ui/breadcrumb.jsx';
import { Separator } from '@/components/ui/separator.jsx';
import {
    SidebarInset,
    SidebarProvider,
    SidebarTrigger,
} from '@/components/ui/sidebar.jsx';
import { useLocation } from 'react-router-dom';

const ModernLayout = ({ children }) => {
    const location = useLocation();

    // Generate breadcrumbs based on current path
    const getBreadcrumbs = () => {
        const pathSegments = location.pathname.split('/').filter(Boolean);
        const breadcrumbs = [];

        if (pathSegments.length === 0 || (pathSegments.length === 1 && pathSegments[0] === 'dashboard')) {
            return [{ title: 'Dashboard', href: '/dashboard', isActive: true }];
        }

        // Map common paths to readable names
        const pathNames = {
            'dashboard': 'Dashboard',
            'samples': 'Sample Management',
            'results': 'Test Results',
            'reports': 'Reports',
            'users': 'User Management',
            'audit-logs': 'Audit Logs',
            'settings': 'Settings',
            'quality-control': 'Quality Control',
            'templates': 'Templates',
            'analytics': 'Analytics',
            'tracking': 'Sample Tracking',
            'new': 'New Sample',
        };

        // Always start with Dashboard
        breadcrumbs.push({ title: 'Dashboard', href: '/dashboard', isActive: false });

        // Add path segments
        let currentPath = '';
        pathSegments.forEach((segment, index) => {
            currentPath += `/${segment}`;
            const isLast = index === pathSegments.length - 1;
            
            breadcrumbs.push({
                title: pathNames[segment] || segment.charAt(0).toUpperCase() + segment.slice(1),
                href: currentPath,
                isActive: isLast
            });
        });

        return breadcrumbs;
    };

    const breadcrumbs = getBreadcrumbs();

    return (
        <SidebarProvider>
            <AppSidebar />
            <SidebarInset>
                <header className="flex h-16 shrink-0 items-center gap-2 border-b border-gray-200 bg-white px-4">
                    <SidebarTrigger className="-ml-1" />
                    <Separator
                        orientation="vertical"
                        className="mr-2 h-4"
                    />
                    <Breadcrumb>
                        <BreadcrumbList>
                            {breadcrumbs.map((crumb, index) => (
                                <React.Fragment key={crumb.href}>
                                    <BreadcrumbItem>
                                        {crumb.isActive ? (
                                            <BreadcrumbPage className="font-medium">
                                                {crumb.title}
                                            </BreadcrumbPage>
                                        ) : (
                                            <BreadcrumbLink 
                                                href={crumb.href}
                                                className="text-muted-foreground hover:text-foreground transition-colors"
                                            >
                                                {crumb.title}
                                            </BreadcrumbLink>
                                        )}
                                    </BreadcrumbItem>
                                    {index < breadcrumbs.length - 1 && (
                                        <BreadcrumbSeparator />
                                    )}
                                </React.Fragment>
                            ))}
                        </BreadcrumbList>
                    </Breadcrumb>
                </header>
                
                <main className="flex flex-1 flex-col">
                    <div className="flex-1 p-6">
                        {children}
                    </div>
                </main>
            </SidebarInset>
        </SidebarProvider>
    );
};

export default ModernLayout;