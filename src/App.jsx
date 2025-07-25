import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext.jsx';
import NavigationProvider from './components/NavigationProvider.jsx';
import ProtectedRoute from './components/ProtectedRoute.jsx';
import ModernLayout from './components/ModernLayout.jsx';
import Login from './pages/Login.jsx';
import Dashboard from './pages/Dashboard.jsx';
import UserManagement from './pages/UserManagement.jsx';
import AuditLogs from './pages/AuditLogs.jsx';

function App() {
    return (
        <AuthProvider>
            <Router>
                <NavigationProvider>
                    <div className='App'>
                        <Routes>
                        <Route path='/login' element={<Login />} />
                        <Route path='/' element={<Navigate to='/dashboard' replace />} />
                        <Route
                            path='/dashboard'
                            element={
                                <ProtectedRoute>
                                    <ModernLayout>
                                        <Dashboard />
                                    </ModernLayout>
                                </ProtectedRoute>
                            }
                        />
                        
                        {/* Sample Management Routes */}
                        <Route
                            path='/samples'
                            element={
                                <ProtectedRoute>
                                    <ModernLayout>
                                        <div className="max-w-7xl mx-auto">
                                            <div className="mb-8">
                                                <h1 className="text-3xl font-bold text-gray-900">Sample Registry</h1>
                                                <p className="mt-2 text-gray-600">Manage and track laboratory samples</p>
                                            </div>
                                            <div className="bg-white rounded-lg shadow p-8 text-center">
                                                <p className="text-gray-500">Sample management interface coming soon...</p>
                                            </div>
                                        </div>
                                    </ModernLayout>
                                </ProtectedRoute>
                            }
                        />
                        <Route
                            path='/samples/tracking'
                            element={
                                <ProtectedRoute>
                                    <ModernLayout>
                                        <div className="max-w-7xl mx-auto">
                                            <div className="mb-8">
                                                <h1 className="text-3xl font-bold text-gray-900">Sample Tracking</h1>
                                                <p className="mt-2 text-gray-600">Track sample status and progress</p>
                                            </div>
                                            <div className="bg-white rounded-lg shadow p-8 text-center">
                                                <p className="text-gray-500">Sample tracking interface coming soon...</p>
                                            </div>
                                        </div>
                                    </ModernLayout>
                                </ProtectedRoute>
                            }
                        />
                        <Route
                            path='/samples/new'
                            element={
                                <ProtectedRoute>
                                    <ModernLayout>
                                        <div className="max-w-7xl mx-auto">
                                            <div className="mb-8">
                                                <h1 className="text-3xl font-bold text-gray-900">New Sample Registration</h1>
                                                <p className="mt-2 text-gray-600">Register a new sample for testing</p>
                                            </div>
                                            <div className="bg-white rounded-lg shadow p-8 text-center">
                                                <p className="text-gray-500">Sample registration form coming soon...</p>
                                            </div>
                                        </div>
                                    </ModernLayout>
                                </ProtectedRoute>
                            }
                        />
                        
                        {/* Testing & Results Routes */}
                        <Route
                            path='/results'
                            element={
                                <ProtectedRoute>
                                    <ModernLayout>
                                        <div className="max-w-7xl mx-auto">
                                            <div className="mb-8">
                                                <h1 className="text-3xl font-bold text-gray-900">Test Results</h1>
                                                <p className="mt-2 text-gray-600">View and manage test results</p>
                                            </div>
                                            <div className="bg-white rounded-lg shadow p-8 text-center">
                                                <p className="text-gray-500">Test results interface coming soon...</p>
                                            </div>
                                        </div>
                                    </ModernLayout>
                                </ProtectedRoute>
                            }
                        />
                        <Route
                            path='/quality-control'
                            element={
                                <ProtectedRoute>
                                    <ModernLayout>
                                        <div className="max-w-7xl mx-auto">
                                            <div className="mb-8">
                                                <h1 className="text-3xl font-bold text-gray-900">Quality Control</h1>
                                                <p className="mt-2 text-gray-600">Quality assurance and validation</p>
                                            </div>
                                            <div className="bg-white rounded-lg shadow p-8 text-center">
                                                <p className="text-gray-500">Quality control interface coming soon...</p>
                                            </div>
                                        </div>
                                    </ModernLayout>
                                </ProtectedRoute>
                            }
                        />
                        
                        {/* Reports Routes */}
                        <Route
                            path='/reports'
                            element={
                                <ProtectedRoute>
                                    <ModernLayout>
                                        <div className="max-w-7xl mx-auto">
                                            <div className="mb-8">
                                                <h1 className="text-3xl font-bold text-gray-900">Reports</h1>
                                                <p className="mt-2 text-gray-600">Generate and manage laboratory reports</p>
                                            </div>
                                            <div className="bg-white rounded-lg shadow p-8 text-center">
                                                <p className="text-gray-500">Reports interface coming soon...</p>
                                            </div>
                                        </div>
                                    </ModernLayout>
                                </ProtectedRoute>
                            }
                        />
                        <Route
                            path='/templates'
                            element={
                                <ProtectedRoute>
                                    <ModernLayout>
                                        <div className="max-w-7xl mx-auto">
                                            <div className="mb-8">
                                                <h1 className="text-3xl font-bold text-gray-900">Report Templates</h1>
                                                <p className="mt-2 text-gray-600">Manage report templates and formats</p>
                                            </div>
                                            <div className="bg-white rounded-lg shadow p-8 text-center">
                                                <p className="text-gray-500">Template management coming soon...</p>
                                            </div>
                                        </div>
                                    </ModernLayout>
                                </ProtectedRoute>
                            }
                        />
                        <Route
                            path='/analytics'
                            element={
                                <ProtectedRoute>
                                    <ModernLayout>
                                        <div className="max-w-7xl mx-auto">
                                            <div className="mb-8">
                                                <h1 className="text-3xl font-bold text-gray-900">Analytics</h1>
                                                <p className="mt-2 text-gray-600">Laboratory performance analytics and insights</p>
                                            </div>
                                            <div className="bg-white rounded-lg shadow p-8 text-center">
                                                <p className="text-gray-500">Analytics dashboard coming soon...</p>
                                            </div>
                                        </div>
                                    </ModernLayout>
                                </ProtectedRoute>
                            }
                        />
                        
                        {/* Administration Routes */}
                        <Route
                            path='/users'
                            element={
                                <ProtectedRoute requiredPermissions={['user_management']}>
                                    <ModernLayout>
                                        <UserManagement />
                                    </ModernLayout>
                                </ProtectedRoute>
                            }
                        />
                        <Route
                            path='/audit-logs'
                            element={
                                <ProtectedRoute requiredPermissions={['audit_logs_basic', 'audit_logs_security', 'audit_logs_system']}>
                                    <ModernLayout>
                                        <AuditLogs />
                                    </ModernLayout>
                                </ProtectedRoute>
                            }
                        />
                        <Route
                            path='/settings'
                            element={
                                <ProtectedRoute>
                                    <ModernLayout>
                                        <div className="max-w-7xl mx-auto">
                                            <div className="mb-8">
                                                <h1 className="text-3xl font-bold text-gray-900">Settings</h1>
                                                <p className="mt-2 text-gray-600">System configuration and preferences</p>
                                            </div>
                                            <div className="bg-white rounded-lg shadow p-8 text-center">
                                                <p className="text-gray-500">Settings interface coming soon...</p>
                                            </div>
                                        </div>
                                    </ModernLayout>
                                </ProtectedRoute>
                            }
                        />
                        </Routes>
                    </div>
                </NavigationProvider>
            </Router>
        </AuthProvider>
    );
}

export default App;
