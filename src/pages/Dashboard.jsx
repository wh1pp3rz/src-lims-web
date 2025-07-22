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
        <div className='space-y-8 animate-fade-in'>
            {/* Enhanced Header */}
            <div className='md:flex md:items-center md:justify-between'>
                <div className='flex-1 min-w-0'>
                    <h1 className='text-heading-1 text-foreground'>
                        Welcome back, {user?.firstName || user?.username}!
                    </h1>
                    <p className='mt-2 text-body text-muted'>
                        Here's an overview of your laboratory operations
                    </p>
                </div>
            </div>

            {/* Enhanced Stats Grid */}
            <div className='grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4'>
                {stats.map((stat) => (
                    <Card key={stat.title} className='card-enhanced group'>
                        <CardHeader className='flex flex-row items-center justify-between space-y-0 pb-3'>
                            <CardTitle className='text-small font-semibold text-foreground/80 uppercase tracking-wide'>
                                {stat.title}
                            </CardTitle>
                            <div className='p-2 bg-primary/10 rounded-lg group-hover:bg-primary/20 transition-colors'>
                                <stat.icon className='h-5 w-5 text-primary' />
                            </div>
                        </CardHeader>
                        <CardContent className='space-y-3'>
                            <div className='text-3xl font-bold text-foreground'>{stat.value}</div>
                            <p className='text-small text-muted leading-relaxed'>{stat.description}</p>
                            <div className={`text-small font-medium ${getChangeTypeColor(stat.changeType)}`}>
                                {stat.change} from last month
                            </div>
                        </CardContent>
                    </Card>
                ))}
            </div>

            {/* Enhanced Recent Samples Section */}
            <Card className='card-enhanced'>
                <CardHeader className='pb-4'>
                    <CardTitle className='flex items-center gap-3 text-heading-3'>
                        <div className='p-2 bg-primary/10 rounded-lg'>
                            <FlaskConicalIcon className='h-5 w-5 text-primary' />
                        </div>
                        Recent Samples
                    </CardTitle>
                    <CardDescription className='text-body'>
                        Latest samples submitted to the laboratory
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <div className='space-y-4'>
                        {recentSamples.map((sample, index) => (
                            <div
                                key={sample.id}
                                className='flex items-center justify-between p-4 border border-border rounded-lg hover:bg-muted/30 transition-all duration-200 hover:border-primary/20 group'
                                style={{ animationDelay: `${index * 0.1}s` }}
                            >
                                <div className='flex-1'>
                                    <div className='flex items-center gap-3 mb-2'>
                                        <h4 className='font-semibold text-foreground text-body'>
                                            {sample.id}
                                        </h4>
                                        <span
                                            className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium border ${getStatusColor(sample.status)}`}
                                        >
                                            {sample.status}
                                        </span>
                                        <span
                                            className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium border ${getPriorityColor(sample.priority)}`}
                                        >
                                            {sample.priority} Priority
                                        </span>
                                    </div>
                                    <p className='text-body font-medium text-foreground'>
                                        {sample.client}
                                    </p>
                                    <p className='text-small text-muted'>
                                        {sample.sampleType} • Submitted {sample.submittedDate}
                                    </p>
                                </div>
                                <Button variant='outline' size='sm' className='btn-enhanced'>
                                    View Details
                                </Button>
                            </div>
                        ))}
                    </div>
                    <div className='mt-6 pt-4 border-t border-border'>
                        <Button variant='outline' className='w-full btn-enhanced'>
                            View All Samples
                        </Button>
                    </div>
                </CardContent>
            </Card>

            {/* Enhanced Quick Actions */}
            <Card className='card-enhanced'>
                <CardHeader className='pb-4'>
                    <CardTitle className='text-heading-3'>Quick Actions</CardTitle>
                    <CardDescription className='text-body'>Common tasks and shortcuts</CardDescription>
                </CardHeader>
                <CardContent>
                    <div className='grid grid-cols-2 gap-4 sm:grid-cols-4'>
                        <Button className='h-24 flex-col gap-3 btn-enhanced group' variant='outline'>
                            <div className='p-2 bg-primary/10 rounded-lg group-hover:bg-primary/20 transition-colors'>
                                <FlaskConicalIcon className='h-6 w-6 text-primary' />
                            </div>
                            <span className='text-small font-medium'>New Sample</span>
                        </Button>
                        <Button className='h-24 flex-col gap-3 btn-enhanced group' variant='outline'>
                            <div className='p-2 bg-success/10 rounded-lg group-hover:bg-success/20 transition-colors'>
                                <ClipboardListIcon className='h-6 w-6 text-success' />
                            </div>
                            <span className='text-small font-medium'>Record Results</span>
                        </Button>
                        <Button className='h-24 flex-col gap-3 btn-enhanced group' variant='outline'>
                            <div className='p-2 bg-info/10 rounded-lg group-hover:bg-info/20 transition-colors'>
                                <FileTextIcon className='h-6 w-6 text-info' />
                            </div>
                            <span className='text-small font-medium'>Generate Report</span>
                        </Button>
                        <Button className='h-24 flex-col gap-3 btn-enhanced group' variant='outline'>
                            <div className='p-2 bg-warning/10 rounded-lg group-hover:bg-warning/20 transition-colors'>
                                <TrendingUpIcon className='h-6 w-6 text-warning' />
                            </div>
                            <span className='text-small font-medium'>View Analytics</span>
                        </Button>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
};

export default Dashboard;
