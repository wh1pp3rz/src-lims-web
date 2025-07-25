import React from 'react';
import { LoginForm } from '@/components/LoginForm.jsx';
import srcLogo from '../assets/src-logo.webp';

const Login = () => {
    return (
        <div className="min-h-screen flex items-center justify-center p-6 md:p-10 relative">
            {/* Background with gradient and subtle pattern */}
            <div className="absolute inset-0 bg-gradient-to-br from-blue-50 via-white to-blue-50">
                <div className="absolute inset-0 opacity-30" style={{
                    backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%239C92AC' fill-opacity='0.02'%3E%3Ccircle cx='30' cy='30' r='6'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`
                }}></div>
            </div>
            
            {/* Content */}
            <div className="relative w-full max-w-md space-y-8 animate-fade-in">
                {/* Enhanced Header with SRC Branding */}
                <div className="text-center space-y-6">
                    <div className="flex flex-col items-center space-y-4">
                        <div className="p-4 bg-white rounded-2xl shadow-lg border border-gray-100">
                            <img 
                                src={srcLogo} 
                                alt="Scientific Research Council Logo" 
                                className="h-16 w-auto" 
                            />
                        </div>
                        <div className="space-y-2">
                            <h1 className="text-2xl font-bold text-gray-900">
                                Scientific Research Council
                            </h1>
                            <p className="text-gray-600 font-medium">
                                Laboratory Information Management System
                            </p>
                        </div>
                    </div>
                </div>

                {/* Login Form */}
                <LoginForm />

                {/* Footer */}
                <div className="text-center space-y-2">
                    <p className="text-xs text-gray-500">
                        © 2025 Scientific Research Council, Jamaica. All rights reserved.
                    </p>
                    <div className="flex justify-center space-x-4 text-xs text-gray-400">
                        <span>Version 1.0</span>
                        <span>•</span>
                        <span>Secure Login</span>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Login;
