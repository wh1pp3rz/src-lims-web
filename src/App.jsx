import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext.jsx';
import NavigationProvider from './components/NavigationProvider.jsx';
import ProtectedRoute from './components/ProtectedRoute.jsx';
import Layout from './components/Layout.jsx';
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
                                    <Layout>
                                        <Dashboard />
                                    </Layout>
                                </ProtectedRoute>
                            }
                        />
                        {/* Placeholder routes for future pages */}
                        <Route
                            path='/samples'
                            element={
                                <ProtectedRoute>
                                    <Layout>
                                        <div className='text-center py-12'>
                                            <h1 className='text-2xl font-bold text-gray-900'>
                                                Sample Management
                                            </h1>
                                            <p className='mt-2 text-gray-600'>Coming soon...</p>
                                        </div>
                                    </Layout>
                                </ProtectedRoute>
                            }
                        />
                        <Route
                            path='/results'
                            element={
                                <ProtectedRoute>
                                    <Layout>
                                        <div className='text-center py-12'>
                                            <h1 className='text-2xl font-bold text-gray-900'>
                                                Test Results
                                            </h1>
                                            <p className='mt-2 text-gray-600'>Coming soon...</p>
                                        </div>
                                    </Layout>
                                </ProtectedRoute>
                            }
                        />
                        <Route
                            path='/reports'
                            element={
                                <ProtectedRoute>
                                    <Layout>
                                        <div className='text-center py-12'>
                                            <h1 className='text-2xl font-bold text-gray-900'>
                                                Reports
                                            </h1>
                                            <p className='mt-2 text-gray-600'>Coming soon...</p>
                                        </div>
                                    </Layout>
                                </ProtectedRoute>
                            }
                        />
                        <Route
                            path='/users'
                            element={
                                <ProtectedRoute requiredPermissions={['user_management']}>
                                    <Layout>
                                        <UserManagement />
                                    </Layout>
                                </ProtectedRoute>
                            }
                        />
                        <Route
                            path='/audit-logs'
                            element={
                                <ProtectedRoute requiredPermissions={['view_audit_logs']}>
                                    <Layout>
                                        <AuditLogs />
                                    </Layout>
                                </ProtectedRoute>
                            }
                        />
                        <Route
                            path='/settings'
                            element={
                                <ProtectedRoute>
                                    <Layout>
                                        <div className='text-center py-12'>
                                            <h1 className='text-2xl font-bold text-gray-900'>
                                                Settings
                                            </h1>
                                            <p className='mt-2 text-gray-600'>Coming soon...</p>
                                        </div>
                                    </Layout>
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
