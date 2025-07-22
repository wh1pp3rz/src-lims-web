import React, { useState } from 'react';
import { Navigate, useNavigate, Link } from 'react-router-dom';
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
import { Eye, EyeOff, Loader2 } from 'lucide-react';
import srcLogo from '../assets/src-logo.webp';

const Login = () => {
    const [formData, setFormData] = useState({
        username: '',
        password: '',
    });
    const [showPassword, setShowPassword] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);

    const { login, isAuthenticated, error } = useAuth();
    const navigate = useNavigate();

    // Redirect if already authenticated - always go to dashboard
    if (isAuthenticated) {
        return <Navigate to="/dashboard" replace />;
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
                // Always redirect to dashboard on successful login
                navigate('/dashboard', { replace: true });
            }
        } catch (err) {
            console.error('Login error:', err);
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className='min-h-screen flex items-center justify-center bg-background py-12 px-4 sm:px-6 lg:px-8'>
            <div className='max-w-md w-full space-y-8 animate-fade-in'>
                <div className='text-center'>
                    <div className='mx-auto mb-8'>
                        <img src={srcLogo} alt='SRC Logo' className='h-20 w-auto mx-auto' />
                    </div>
                    <p className='text-body text-muted'>Sign in to your account</p>
                </div>

                <Card className='w-full card-enhanced shadow-elevated'>
                    <form onSubmit={handleSubmit}>
                        <CardHeader>
                            <CardTitle>Welcome Back</CardTitle>
                            <CardDescription>
                                Enter your credentials to access the LIMS system
                            </CardDescription>
                        </CardHeader>

                        <CardContent className='space-y-6'>
                            {error && (
                                <div className='bg-destructive/10 border border-destructive/20 rounded-lg p-4 animate-fade-in'>
                                    <p className='text-body text-destructive font-medium'>
                                        {error.message || 'Invalid username or password'}
                                    </p>
                                </div>
                            )}

                            <div className='space-y-2'>
                                <label
                                    htmlFor='username'
                                    className='block text-body font-semibold text-foreground'
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
                                    className='input-enhanced'
                                />
                            </div>

                            <div className='space-y-2'>
                                <label
                                    htmlFor='password'
                                    className='block text-body font-semibold text-foreground'
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
                                        className='input-enhanced pr-10'
                                    />
                                    <button
                                        type='button'
                                        className='absolute inset-y-0 right-0 flex items-center pr-3 text-muted-foreground hover:text-foreground transition-colors'
                                        onClick={() => setShowPassword(!showPassword)}
                                    >
                                        {showPassword ? (
                                            <EyeOff className='h-4 w-4' />
                                        ) : (
                                            <Eye className='h-4 w-4' />
                                        )}
                                    </button>
                                </div>
                            </div>
                        </CardContent>

                        <CardFooter className='flex flex-col space-y-4'>
                            <Button
                                type='submit'
                                className='w-full btn-enhanced'
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
                                <p className='text-small text-muted'>
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
