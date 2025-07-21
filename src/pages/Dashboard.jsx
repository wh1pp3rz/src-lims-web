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
import {
    FlaskConicalIcon,
    ClipboardListIcon,
    UsersIcon,
    TrendingUpIcon,
    AlertTriangleIcon,
    CheckCircleIcon,
    ClockIcon,
    FileTextIcon,
} from 'lucide-react';

const Dashboard = () => {
    const { user } = useAuth();

    const stats = [
        {
            title: 'Active Samples',
            value: '24',
            change: '+12%',
            changeType: 'positive',
            icon: FlaskConicalIcon,
            description: 'Samples currently in testing',
        },
        {
            title: 'Pending Results',
            value: '8',
            change: '-5%',
            changeType: 'negative',
            icon: ClockIcon,
            description: 'Results awaiting validation',
        },
        {
            title: 'Completed Tests',
            value: '156',
            change: '+23%',
            changeType: 'positive',
            icon: CheckCircleIcon,
            description: 'Tests completed this month',
        },
        {
            title: 'Overdue Items',
            value: '3',
            change: 'Same',
            changeType: 'neutral',
            icon: AlertTriangleIcon,
            description: 'Items requiring attention',
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
                return 'bg-green-100 text-green-800';
            case 'in progress':
                return 'bg-blue-100 text-blue-800';
            case 'pending review':
                return 'bg-yellow-100 text-yellow-800';
            case 'awaiting sample':
                return 'bg-gray-100 text-gray-800';
            default:
                return 'bg-gray-100 text-gray-800';
        }
    };

    const getPriorityColor = (priority) => {
        switch (priority.toLowerCase()) {
            case 'high':
                return 'text-red-600';
            case 'medium':
                return 'text-yellow-600';
            case 'low':
                return 'text-green-600';
            default:
                return 'text-gray-600';
        }
    };

    return (
        <div className='space-y-6'>
            {/* Header */}
            <div className='md:flex md:items-center md:justify-between'>
                <div className='flex-1 min-w-0'>
                    <h2 className='text-2xl font-bold leading-7 text-gray-900 sm:text-3xl sm:truncate'>
                        Welcome back, {user?.firstName || user?.username}!
                    </h2>
                    <p className='mt-1 text-sm text-gray-500'>
                        Here's an overview of your laboratory operations
                    </p>
                </div>
            </div>

            {/* Stats Grid */}
            <div className='grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4'>
                {stats.map((stat) => (
                    <Card key={stat.title}>
                        <CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
                            <CardTitle className='text-sm font-medium'>{stat.title}</CardTitle>
                            <stat.icon className='h-4 w-4 text-muted-foreground' />
                        </CardHeader>
                        <CardContent>
                            <div className='text-2xl font-bold'>{stat.value}</div>
                            <p className='text-xs text-muted-foreground mt-1'>{stat.description}</p>
                            <div
                                className={`text-xs mt-1 ${
                                    stat.changeType === 'positive'
                                        ? 'text-green-600'
                                        : stat.changeType === 'negative'
                                          ? 'text-red-600'
                                          : 'text-gray-600'
                                }`}
                            >
                                {stat.change} from last month
                            </div>
                        </CardContent>
                    </Card>
                ))}
            </div>

            {/* Main Content Grid */}
            <div className='grid grid-cols-1 gap-6 lg:grid-cols-2'>
                {/* Recent Samples */}
                <Card className='lg:col-span-2'>
                    <CardHeader>
                        <CardTitle className='flex items-center gap-2'>
                            <FlaskConicalIcon className='h-5 w-5' />
                            Recent Samples
                        </CardTitle>
                        <CardDescription>
                            Latest samples submitted to the laboratory
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className='space-y-4'>
                            {recentSamples.map((sample) => (
                                <div
                                    key={sample.id}
                                    className='flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50'
                                >
                                    <div className='flex-1'>
                                        <div className='flex items-center gap-3'>
                                            <h4 className='font-semibold text-gray-900'>
                                                {sample.id}
                                            </h4>
                                            <span
                                                className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(sample.status)}`}
                                            >
                                                {sample.status}
                                            </span>
                                            <span
                                                className={`text-xs font-medium ${getPriorityColor(sample.priority)}`}
                                            >
                                                {sample.priority} Priority
                                            </span>
                                        </div>
                                        <p className='text-sm text-gray-600 mt-1'>
                                            {sample.client}
                                        </p>
                                        <p className='text-xs text-gray-500'>
                                            {sample.sampleType} • Submitted {sample.submittedDate}
                                        </p>
                                    </div>
                                    <Button variant='outline' size='sm'>
                                        View Details
                                    </Button>
                                </div>
                            ))}
                        </div>
                        <div className='mt-4'>
                            <Button variant='outline' className='w-full'>
                                View All Samples
                            </Button>
                        </div>
                    </CardContent>
                </Card>
            </div>

            {/* Quick Actions */}
            <Card>
                <CardHeader>
                    <CardTitle>Quick Actions</CardTitle>
                    <CardDescription>Common tasks and shortcuts</CardDescription>
                </CardHeader>
                <CardContent>
                    <div className='grid grid-cols-2 gap-4 sm:grid-cols-4'>
                        <Button className='h-20 flex-col gap-2' variant='outline'>
                            <FlaskConicalIcon className='h-6 w-6' />
                            <span className='text-sm'>New Sample</span>
                        </Button>
                        <Button className='h-20 flex-col gap-2' variant='outline'>
                            <ClipboardListIcon className='h-6 w-6' />
                            <span className='text-sm'>Record Results</span>
                        </Button>
                        <Button className='h-20 flex-col gap-2' variant='outline'>
                            <FileTextIcon className='h-6 w-6' />
                            <span className='text-sm'>Generate Report</span>
                        </Button>
                        <Button className='h-20 flex-col gap-2' variant='outline'>
                            <TrendingUpIcon className='h-6 w-6' />
                            <span className='text-sm'>View Analytics</span>
                        </Button>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
};

export default Dashboard;
