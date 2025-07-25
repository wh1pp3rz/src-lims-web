import React, { useState } from 'react';
import { Navigate, useNavigate } from 'react-router-dom';
import useAuth from '@/hooks/useAuth.js';
import { Button } from '@/components/ui/button.jsx';
import { Input } from '@/components/ui/input.jsx';
import { Label } from '@/components/ui/label.jsx';
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from '@/components/ui/card.jsx';
import { Eye, EyeOff, Loader2 } from 'lucide-react';

export function LoginForm({ className, ...props }) {
    const [formData, setFormData] = useState({
        username: '',
        password: '',
    });
    const [showPassword, setShowPassword] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);

    const { login, isAuthenticated, error } = useAuth();
    const navigate = useNavigate();

    // Redirect if already authenticated
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
                navigate('/dashboard', { replace: true });
            }
        } catch {
            // Login error
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className={`flex flex-col gap-6 ${className || ''}`} {...props}>
            <Card className="shadow-lg border-0 bg-white/80 backdrop-blur-sm">
                <CardHeader className="space-y-2 text-center pb-4">
                    <CardTitle className="text-2xl font-bold text-gray-900">
                        Login to your account
                    </CardTitle>
                    <CardDescription className="text-gray-600">
                        Enter your credentials to access the LIMS system
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <form onSubmit={handleSubmit} className="space-y-6">
                        {error && (
                            <div className="bg-red-50 border border-red-200 rounded-lg p-4 animate-fade-in">
                                <p className="text-sm text-red-800 font-medium">
                                    {error.message || 'Invalid username or password'}
                                </p>
                            </div>
                        )}

                        <div className="space-y-3">
                            <Label htmlFor="username" className="text-sm font-semibold text-gray-700">
                                Username or Email
                            </Label>
                            <Input
                                id="username"
                                name="username"
                                type="text"
                                autoComplete="username"
                                required
                                value={formData.username}
                                onChange={handleChange}
                                placeholder="Enter your username or email"
                                className="h-11 px-4 border-gray-300 focus:border-blue-500 focus:ring-blue-500"
                            />
                        </div>

                        <div className="space-y-3">
                            <div className="flex items-center justify-between">
                                <Label htmlFor="password" className="text-sm font-semibold text-gray-700">
                                    Password
                                </Label>
                                <button
                                    type="button"
                                    className="text-sm text-blue-600 hover:text-blue-500 font-medium"
                                    onClick={() => {/* TODO: Implement forgot password */}}
                                >
                                    Forgot your password?
                                </button>
                            </div>
                            <div className="relative">
                                <Input
                                    id="password"
                                    name="password"
                                    type={showPassword ? 'text' : 'password'}
                                    autoComplete="current-password"
                                    required
                                    value={formData.password}
                                    onChange={handleChange}
                                    placeholder="Enter your password"
                                    className="h-11 px-4 pr-12 border-gray-300 focus:border-blue-500 focus:ring-blue-500"
                                />
                                <button
                                    type="button"
                                    className="absolute inset-y-0 right-0 flex items-center pr-3 text-gray-400 hover:text-gray-600 transition-colors"
                                    onClick={() => setShowPassword(!showPassword)}
                                >
                                    {showPassword ? (
                                        <EyeOff className="h-5 w-5" />
                                    ) : (
                                        <Eye className="h-5 w-5" />
                                    )}
                                </button>
                            </div>
                        </div>

                        <div className="space-y-4">
                            <Button
                                type="submit"
                                className="w-full h-11 bg-blue-600 hover:bg-blue-700 text-white font-medium transition-colors duration-200"
                                disabled={isSubmitting || !formData.username || !formData.password}
                            >
                                {isSubmitting ? (
                                    <>
                                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                        Signing in...
                                    </>
                                ) : (
                                    'Login'
                                )}
                            </Button>
                        </div>

                        <div className="text-center">
                            <p className="text-sm text-gray-600">
                                Need help? Contact your system administrator
                            </p>
                        </div>
                    </form>
                </CardContent>
            </Card>
        </div>
    );
}