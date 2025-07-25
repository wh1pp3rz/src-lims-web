import React from 'react';
import useAuth from '@/hooks/useAuth.js';
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from '@/components/ui/card.jsx';
import { Button } from '@/components/ui/button.jsx';
import { Progress } from '@/components/ui/progress.jsx';
import {
    FlaskConicalIcon,
    ClipboardListIcon,
    UsersIcon,
    TrendingUpIcon,
    AlertTriangleIcon,
    CheckCircleIcon,
    ClockIcon,
    FileTextIcon,
    ArrowUpIcon,
    ArrowDownIcon,
    BarChart3Icon,
    CalendarIcon,
    ActivityIcon,
    TestTubeIcon,
    Users2Icon,
} from 'lucide-react';

const Dashboard = () => {
    const { user } = useAuth();

    const stats = [
        {
            title: 'Active Samples',
            value: '127',
            change: '+18%',
            changeType: 'positive',
            icon: FlaskConicalIcon,
            description: 'Samples currently in testing',
            progress: 65,
            progressLabel: '65% of monthly target',
        },
        {
            title: 'Pending Results',
            value: '23',
            change: '-12%',
            changeType: 'negative',
            icon: ClockIcon,
            description: 'Results awaiting validation',
            progress: 23,
            progressLabel: '23 awaiting approval',
        },
        {
            title: 'Completed Tests',
            value: '1,247',
            change: '+31%',
            changeType: 'positive',
            icon: CheckCircleIcon,
            description: 'Tests completed this month',
            progress: 87,
            progressLabel: '87% monthly completion',
        },
        {
            title: 'Quality Score',
            value: '98.2%',
            change: '+2.1%',
            changeType: 'positive',
            icon: ActivityIcon,
            description: 'Average quality rating',
            progress: 98,
            progressLabel: 'Excellent quality standard',
        },
    ];

    const quickStats = [
        {
            label: 'Today\'s Tests',
            value: '42',
            icon: TestTubeIcon,
            color: 'text-blue-600',
            bgColor: 'bg-blue-50',
        },
        {
            label: 'Active Analysts',
            value: '8',
            icon: Users2Icon,
            color: 'text-green-600',
            bgColor: 'bg-green-50',
        },
        {
            label: 'Avg. Turnaround',
            value: '2.3 days',
            icon: ClockIcon,
            color: 'text-orange-600',
            bgColor: 'bg-orange-50',
        },
        {
            label: 'Reports Generated',
            value: '156',
            icon: FileTextIcon,
            color: 'text-purple-600',
            bgColor: 'bg-purple-50',
        },
    ];

    const recentSamples = [
        {
            id: 'SMP-2025-001',
            client: 'Jamaica Broilers',
            sampleType: 'Water Analysis',
            status: 'In Progress',
            priority: 'High',
            submittedDate: '2025-01-18',
        },
        {
            id: 'SMP-2025-002',
            client: 'Caribbean Cement',
            sampleType: 'Soil Testing',
            status: 'Completed',
            priority: 'Medium',
            submittedDate: '2025-01-17',
        },
        {
            id: 'SMP-2025-003',
            client: 'Grace Foods',
            sampleType: 'Food Safety',
            status: 'Pending Review',
            priority: 'High',
            submittedDate: '2025-01-16',
        },
        {
            id: 'SMP-2025-004',
            client: 'National Water Commission',
            sampleType: 'Water Quality',
            status: 'Awaiting Sample',
            priority: 'Low',
            submittedDate: '2025-01-15',
        },
    ];

    const getStatusColor = (status) => {
        switch (status.toLowerCase()) {
            case 'completed':
                return 'status-active';
            case 'in progress':
                return 'bg-blue-50 text-blue-700 border-blue-200';
            case 'pending review':
                return 'status-pending';
            case 'awaiting sample':
                return 'status-inactive';
            default:
                return 'status-inactive';
        }
    };

    const getPriorityColor = (priority) => {
        switch (priority.toLowerCase()) {
            case 'high':
                return 'priority-high';
            case 'medium':
                return 'priority-medium';
            case 'low':
                return 'priority-low';
            default:
                return 'text-muted-foreground';
        }
    };

    const getChangeTypeColor = (changeType) => {
        switch (changeType) {
            case 'positive':
                return 'text-green-600';
            case 'negative':
                return 'text-red-600';
            default:
                return 'text-muted-foreground';
        }
    };

    return (
        <div className="max-w-7xl mx-auto">
            {/* Enhanced Header */}
            <div className="mb-8">
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-3xl font-bold text-gray-900">
                            Welcome back, {user?.firstName || user?.username}!
                        </h1>
                        <p className="mt-2 text-gray-600">
                            Here's an overview of your laboratory operations for {new Date().toLocaleDateString('en-US', { 
                                weekday: 'long', 
                                year: 'numeric', 
                                month: 'long', 
                                day: 'numeric' 
                            })}
                        </p>
                    </div>
                    <div className="hidden md:flex space-x-3">
                        <Button variant="outline" size="sm">
                            <CalendarIcon className="h-4 w-4 mr-2" />
                            Schedule
                        </Button>
                        <Button variant="outline" size="sm">
                            <BarChart3Icon className="h-4 w-4 mr-2" />
                            Reports
                        </Button>
                    </div>
                </div>
            </div>

            {/* Quick Stats Bar */}
            <div className="grid grid-cols-2 gap-4 md:grid-cols-4 mb-8">
                {quickStats.map((stat) => (
                    <div key={stat.label} className="bg-white rounded-lg border border-gray-200 p-4">
                        <div className="flex items-center">
                            <div className={`p-2 rounded-lg ${stat.bgColor}`}>
                                <stat.icon className={`h-5 w-5 ${stat.color}`} />
                            </div>
                            <div className="ml-3">
                                <p className="text-sm font-medium text-gray-600">{stat.label}</p>
                                <p className="text-lg font-bold text-gray-900">{stat.value}</p>
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            {/* Enhanced Stats Grid */}
            <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4 mb-8">
                {stats.map((stat) => (
                    <Card key={stat.title} className="border-0 shadow-lg hover:shadow-xl transition-shadow duration-300">
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-3">
                            <CardTitle className="text-sm font-medium text-gray-600 uppercase tracking-wide">
                                {stat.title}
                            </CardTitle>
                            <div className="p-2 bg-blue-50 rounded-lg">
                                <stat.icon className="h-5 w-5 text-blue-600" />
                            </div>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="flex items-center justify-between">
                                <div className="text-3xl font-bold text-gray-900">{stat.value}</div>
                                <div className={`flex items-center text-sm font-medium ${getChangeTypeColor(stat.changeType)}`}>
                                    {stat.changeType === 'positive' && <ArrowUpIcon className="h-4 w-4 mr-1" />}
                                    {stat.changeType === 'negative' && <ArrowDownIcon className="h-4 w-4 mr-1" />}
                                    {stat.change}
                                </div>
                            </div>
                            <p className="text-sm text-gray-600">{stat.description}</p>
                            {stat.progress && (
                                <div className="space-y-2">
                                    <Progress value={stat.progress} className="h-2" />
                                    <p className="text-xs text-gray-500">{stat.progressLabel}</p>
                                </div>
                            )}
                        </CardContent>
                    </Card>
                ))}
            </div>

            {/* Dashboard Content Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Recent Samples - Takes 2 columns */}
                <div className="lg:col-span-2">
                    <Card className="shadow-lg border-0">
                        <CardHeader className="pb-4">
                            <div className="flex items-center justify-between">
                                <div className="flex items-center space-x-3">
                                    <div className="p-2 bg-blue-50 rounded-lg">
                                        <FlaskConicalIcon className="h-5 w-5 text-blue-600" />
                                    </div>
                                    <div>
                                        <CardTitle className="text-xl font-bold">Recent Samples</CardTitle>
                                        <CardDescription>Latest samples submitted to the laboratory</CardDescription>
                                    </div>
                                </div>
                                <Button variant="outline" size="sm">View All</Button>
                            </div>
                        </CardHeader>
                        <CardContent>
                            <div className="space-y-4">
                                {recentSamples.map((sample) => (
                                    <div
                                        key={sample.id}
                                        className="flex items-center justify-between p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
                                    >
                                        <div className="flex-1">
                                            <div className="flex items-center gap-3 mb-2">
                                                <h4 className="font-semibold text-gray-900">{sample.id}</h4>
                                                <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium ${getStatusColor(sample.status)}`}>
                                                    {sample.status}
                                                </span>
                                                <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium ${getPriorityColor(sample.priority)}`}>
                                                    {sample.priority} Priority
                                                </span>
                                            </div>
                                            <p className="font-medium text-gray-900">{sample.client}</p>
                                            <p className="text-sm text-gray-600">
                                                {sample.sampleType} • Submitted {sample.submittedDate}
                                            </p>
                                        </div>
                                        <Button variant="outline" size="sm">
                                            View Details
                                        </Button>
                                    </div>
                                ))}
                            </div>
                        </CardContent>
                    </Card>
                </div>

                {/* Quick Actions Sidebar */}
                <div className="space-y-6">
                    <Card className="shadow-lg border-0">
                        <CardHeader>
                            <CardTitle className="text-lg font-bold">Quick Actions</CardTitle>
                            <CardDescription>Common tasks and shortcuts</CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-3">
                            <Button className="w-full justify-start h-12" variant="outline">
                                <FlaskConicalIcon className="h-5 w-5 mr-3" />
                                New Sample Registration
                            </Button>
                            <Button className="w-full justify-start h-12" variant="outline">
                                <ClipboardListIcon className="h-5 w-5 mr-3" />
                                Record Test Results
                            </Button>
                            <Button className="w-full justify-start h-12" variant="outline">
                                <FileTextIcon className="h-5 w-5 mr-3" />
                                Generate Report
                            </Button>
                            <Button className="w-full justify-start h-12" variant="outline">
                                <BarChart3Icon className="h-5 w-5 mr-3" />
                                View Analytics
                            </Button>
                        </CardContent>
                    </Card>

                    {/* Alerts/Notifications */}
                    <Card className="shadow-lg border-0">
                        <CardHeader>
                            <CardTitle className="text-lg font-bold">System Alerts</CardTitle>
                            <CardDescription>Important notifications</CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-3">
                            <div className="flex items-start space-x-3 p-3 bg-yellow-50 rounded-lg border border-yellow-200">
                                <AlertTriangleIcon className="h-5 w-5 text-yellow-600 mt-0.5" />
                                <div>
                                    <p className="text-sm font-medium text-yellow-800">3 samples overdue</p>
                                    <p className="text-xs text-yellow-700">Require immediate attention</p>
                                </div>
                            </div>
                            <div className="flex items-start space-x-3 p-3 bg-blue-50 rounded-lg border border-blue-200">
                                <CheckCircleIcon className="h-5 w-5 text-blue-600 mt-0.5" />
                                <div>
                                    <p className="text-sm font-medium text-blue-800">QC batch approved</p>
                                    <p className="text-xs text-blue-700">Ready for reporting</p>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </div>
    );
};

export default Dashboard;
