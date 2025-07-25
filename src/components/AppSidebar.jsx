import React from 'react';
import useAuth from '@/hooks/useAuth.js';
import { useLocation, useNavigate } from 'react-router-dom';
import { hasPermission } from '@/utils/permissions.js';
import {
    Sidebar,
    SidebarContent,
    SidebarGroup,
    SidebarGroupContent,
    SidebarGroupLabel,
    SidebarHeader,
    SidebarMenu,
    SidebarMenuButton,
    SidebarMenuItem,
    SidebarRail,
    SidebarFooter,
} from '@/components/ui/sidebar.jsx';
import { Button } from '@/components/ui/button.jsx';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu.jsx';
import {
    HomeIcon,
    FlaskConicalIcon,
    ClipboardListIcon,
    FileTextIcon,
    UsersIcon,
    ShieldCheckIcon,
    SettingsIcon,
    LogOutIcon,
    UserIcon,
    ChevronDown,
    Search,
    PlusIcon,
    BarChart3Icon,
    CalendarIcon,
} from 'lucide-react';
import srcLogo from '../assets/src-logo.webp';

const data = {
    navMain: [
        {
            title: "Overview",
            items: [
                {
                    title: "Dashboard",
                    url: "/dashboard",
                    icon: HomeIcon,
                    isActive: false,
                },
                {
                    title: "Analytics",
                    url: "/analytics",
                    icon: BarChart3Icon,
                    isActive: false,
                },
            ],
        },
        {
            title: "Sample Management",
            items: [
                {
                    title: "Sample Registry",
                    url: "/samples",
                    icon: FlaskConicalIcon,
                    isActive: false,
                },
                {
                    title: "Sample Tracking",
                    url: "/samples/tracking",
                    icon: CalendarIcon,
                    isActive: false,
                },
                {
                    title: "New Sample",
                    url: "/samples/new",
                    icon: PlusIcon,
                    isActive: false,
                },
            ],
        },
        {
            title: "Testing & Results",
            items: [
                {
                    title: "Test Results",
                    url: "/results",
                    icon: ClipboardListIcon,
                    isActive: false,
                },
                {
                    title: "Quality Control",
                    url: "/quality-control",
                    icon: ShieldCheckIcon,
                    isActive: false,
                },
            ],
        },
        {
            title: "Reports & Documents",
            items: [
                {
                    title: "Reports",
                    url: "/reports",
                    icon: FileTextIcon,
                    isActive: false,
                },
                {
                    title: "Templates",
                    url: "/templates",
                    icon: FileTextIcon,
                    isActive: false,
                },
            ],
        },
        {
            title: "Administration",
            items: [
                {
                    title: "User Management",
                    url: "/users",
                    icon: UsersIcon,
                    isActive: false,
                    permission: "user_management",
                },
                {
                    title: "Audit Logs",
                    url: "/audit-logs",
                    icon: ShieldCheckIcon,
                    isActive: false,
                    permission: "audit_logs",
                },
                {
                    title: "Settings",
                    url: "/settings",
                    icon: SettingsIcon,
                    isActive: false,
                },
            ],
        },
    ],
};

export function AppSidebar({ ...props }) {
    const { user, logout } = useAuth();
    const location = useLocation();
    const navigate = useNavigate();

    const handleLogout = async () => {
        await logout();
        navigate('/login', { replace: true });
    };

    // Update active states based on current location
    const updatedNavMain = data.navMain.map(group => ({
        ...group,
        items: group.items
            .filter(item => hasPermission(user, item.permission))
            .map(item => ({
                ...item,
                isActive: location.pathname === item.url
            }))
    })).filter(group => group.items.length > 0);

    return (
        <Sidebar {...props}>
            <SidebarHeader className="border-b border-gray-200 bg-white">
                <div className="flex items-end gap-4 px-6 py-4">
                    <img src={srcLogo} alt="SRC Logo" className="h-16 w-auto object-contain flex-shrink-0" />
                    <div className="flex flex-col justify-end">
                        <span className="text-lg font-semibold text-gray-800">L.I.M.S</span>
                    </div>
                </div>
                
                {/* Quick Search */}
                <div className="px-6 pb-4">
                    <div className="relative">
                        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
                        <input
                            type="text"
                            placeholder="Search samples, tests..."
                            className="w-full rounded-md border border-gray-200 bg-white pl-9 pr-3 py-2 text-sm text-gray-900 placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        />
                    </div>
                </div>
            </SidebarHeader>

            <SidebarContent className="bg-white">
                {updatedNavMain.map((group) => (
                    <SidebarGroup key={group.title}>
                        <SidebarGroupLabel className="text-gray-600 font-medium">
                            {group.title}
                        </SidebarGroupLabel>
                        <SidebarGroupContent>
                            <SidebarMenu>
                                {group.items.map((item) => (
                                    <SidebarMenuItem key={item.title}>
                                        <SidebarMenuButton 
                                            asChild 
                                            isActive={item.isActive}
                                            className="data-[active=true]:bg-blue-600 data-[active=true]:text-white hover:bg-gray-100 hover:text-gray-900"
                                        >
                                            <a href={item.url} className="flex items-center gap-3">
                                                <item.icon className="h-4 w-4" />
                                                <span>{item.title}</span>
                                            </a>
                                        </SidebarMenuButton>
                                    </SidebarMenuItem>
                                ))}
                            </SidebarMenu>
                        </SidebarGroupContent>
                    </SidebarGroup>
                ))}
            </SidebarContent>

            <SidebarFooter className="border-t border-gray-200 bg-white">
                <div className="px-4 py-3">
                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <Button 
                                variant="ghost" 
                                className="w-full justify-start h-auto p-3 hover:bg-gray-100 hover:text-gray-900"
                            >
                                <div className="flex items-center gap-3 w-full">
                                    <div className="flex h-8 w-8 items-center justify-center rounded-full bg-blue-600 text-white text-sm font-medium">
                                        {(user?.firstName?.[0] || user?.name?.[0] || user?.username?.[0] || 'U').toUpperCase()}
                                    </div>
                                    <div className="flex-1 text-left">
                                        <p className="text-sm font-medium text-gray-900">
                                            {`${user?.firstName || ''} ${user?.lastName || ''}`.trim() ||
                                                user?.name ||
                                                user?.username}
                                        </p>
                                        <p className="text-xs text-gray-500">{user?.role}</p>
                                    </div>
                                    <ChevronDown className="h-4 w-4 text-gray-500" />
                                </div>
                            </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end" className="w-56 bg-white border border-gray-200 shadow-lg">
                            <DropdownMenuItem>
                                <UserIcon className="mr-2 h-4 w-4" />
                                Profile Settings
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={handleLogout} className="text-destructive focus:text-destructive">
                                <LogOutIcon className="mr-2 h-4 w-4" />
                                Logout
                            </DropdownMenuItem>
                        </DropdownMenuContent>
                    </DropdownMenu>
                </div>
            </SidebarFooter>

            <SidebarRail />
        </Sidebar>
    );
}