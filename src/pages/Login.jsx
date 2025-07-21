import React, { useState } from 'react';
import { Navigate, useLocation, Link } from 'react-router-dom';
import useAuth from '@/hooks/useAuth.js';
import { Button } from '@/components/ui/button.jsx';
import { Input } from '@/components/ui/input.jsx';
import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from '@/components/ui/card.jsx';
import { Eye, EyeOff, Loader2, BeakerIcon } from 'lucide-react';

const Login = () => {
    const [formData, setFormData] = useState({
        username: '',
        password: '',
    });
    const [showPassword, setShowPassword] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);

    const { login, isAuthenticated, error } = useAuth();
    const location = useLocation();

    // Redirect if already authenticated
    if (isAuthenticated) {
        const from = location.state?.from?.pathname || '/dashboard';
        return <Navigate to={from} replace />;
    }

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({
            ...prev,
            [name]: value,
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsSubmitting(true);

        try {
            const result = await login(formData);
            if (result.success) {
                // Navigation will happen automatically due to auth state change
            }
        } catch (err) {
            console.error('Login error:', err);
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className='min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8'>
            <div className='max-w-md w-full space-y-8'>
                <div className='text-center'>
                    <div className='mx-auto h-12 w-12 flex items-center justify-center bg-blue-600 rounded-lg'>
                        <BeakerIcon className='h-8 w-8 text-white' />
                    </div>
                    <h2 className='mt-6 text-3xl font-bold text-gray-900'>SRC LIMS</h2>
                    <p className='mt-2 text-sm text-gray-600'>Sign in to your account</p>
                </div>

                <Card className='w-full'>
                    <form onSubmit={handleSubmit}>
                        <CardHeader>
                            <CardTitle>Welcome Back</CardTitle>
                            <CardDescription>
                                Enter your credentials to access the LIMS system
                            </CardDescription>
                        </CardHeader>

                        <CardContent className='space-y-4'>
                            {error && (
                                <div className='bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-md'>
                                    <p className='text-sm'>
                                        {error.message || 'Invalid username or password'}
                                    </p>
                                </div>
                            )}

                            <div className='space-y-2'>
                                <label
                                    htmlFor='username'
                                    className='text-sm font-medium text-gray-700'
                                >
                                    Username or Email
                                </label>
                                <Input
                                    id='username'
                                    name='username'
                                    type='text'
                                    autoComplete='username'
                                    required
                                    value={formData.username}
                                    onChange={handleChange}
                                    placeholder='Enter your username or email'
                                    className='w-full'
                                />
                            </div>

                            <div className='space-y-2'>
                                <label
                                    htmlFor='password'
                                    className='text-sm font-medium text-gray-700'
                                >
                                    Password
                                </label>
                                <div className='relative'>
                                    <Input
                                        id='password'
                                        name='password'
                                        type={showPassword ? 'text' : 'password'}
                                        autoComplete='current-password'
                                        required
                                        value={formData.password}
                                        onChange={handleChange}
                                        placeholder='Enter your password'
                                        className='w-full pr-10'
                                    />
                                    <button
                                        type='button'
                                        className='absolute inset-y-0 right-0 flex items-center pr-3'
                                        onClick={() => setShowPassword(!showPassword)}
                                    >
                                        {showPassword ? (
                                            <EyeOff className='h-4 w-4 text-gray-400' />
                                        ) : (
                                            <Eye className='h-4 w-4 text-gray-400' />
                                        )}
                                    </button>
                                </div>
                            </div>
                        </CardContent>

                        <CardFooter className='flex flex-col space-y-4'>
                            <Button
                                type='submit'
                                className='w-full'
                                disabled={isSubmitting || !formData.username || !formData.password}
                            >
                                {isSubmitting ? (
                                    <>
                                        <Loader2 className='mr-2 h-4 w-4 animate-spin' />
                                        Signing in...
                                    </>
                                ) : (
                                    'Sign in'
                                )}
                            </Button>

                            <div className='text-center'>
                                <p className='text-xs text-gray-500'>
                                    Need help? Contact your system administrator
                                </p>
                            </div>
                        </CardFooter>
                    </form>
                </Card>
            </div>
        </div>
    );
};

export default Login;
