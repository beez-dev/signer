'use client';

import { useState, useEffect } from 'react';
import { AuthForm } from '@/components/AuthForm';
import { FileInput } from '@/components/FileInput';
import { Button } from '@/components/ui/button';
import { LogOut, FileText, Upload, CheckCircle, Clock } from 'lucide-react';
import { AuthResponse } from '@/lib/services/auth';

export default function Home() {
    const [authData, setAuthData] = useState<AuthResponse | null>(null);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        // Check for existing token in localStorage
        const token = localStorage.getItem('authToken');
        const userData = localStorage.getItem('userData');

        if (token && userData) {
            try {
                setAuthData({
                    token,
                    user: JSON.parse(userData),
                });
            } catch {
                localStorage.removeItem('authToken');
                localStorage.removeItem('userData');
            }
        }
        setIsLoading(false);
    }, []);

    const handleAuthSuccess = (data: AuthResponse) => {
        setAuthData(data);
        localStorage.setItem('authToken', data.token);
        localStorage.setItem('userData', JSON.stringify(data.user));
    };

    const handleLogout = () => {
        setAuthData(null);
        localStorage.removeItem('authToken');
        localStorage.removeItem('userData');
    };

    if (isLoading) {
        return (
            <div className="h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 flex items-center justify-center overflow-hidden">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-16 w-16 border-4 border-blue-500 border-t-transparent mx-auto mb-4"></div>
                    <p className="text-gray-300 text-lg">Loading...</p>
                </div>
            </div>
        );
    }

    if (!authData) {
        return <AuthForm onAuthSuccess={handleAuthSuccess} />;
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900">
            {/* Modern Header */}
            <header className="bg-white/5 backdrop-blur-xl border-b border-white/10 shadow-2xl">
                <div className="max-w-7xl mx-auto px-6 py-4">
                    <div className="flex justify-between items-center">
                        <div className="flex items-center space-x-4">
                            <div className="h-10 w-10 bg-gradient-to-r from-blue-500 to-blue-600 rounded-xl flex items-center justify-center shadow-lg">
                                <FileText className="h-6 w-6 text-white" />
                            </div>
                            <div>
                                <h1 className="text-2xl font-bold bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent">
                                    Signer
                                </h1>
                                <p className="text-gray-400 text-sm">
                                    Professional Signing Platform
                                </p>
                            </div>
                        </div>

                        <div className="flex items-center space-x-6">
                            <div className="text-right">
                                <p className="text-white font-medium">
                                    {authData.user.name}
                                </p>
                                <p className="text-gray-400 text-sm">
                                    {authData.user.email}
                                </p>
                            </div>
                            <Button
                                onClick={handleLogout}
                                variant="outline"
                                size="sm"
                                className="border-white/40 text-white bg-white/10 hover:bg-white/20 hover:border-white/60 transition-all duration-200 font-medium"
                            >
                                <LogOut className="h-4 w-4 mr-2" />
                                Logout
                            </Button>
                        </div>
                    </div>
                </div>
            </header>

            {/* Main Content */}
            <main className="max-w-7xl mx-auto px-6 py-8">
                {/* Welcome Section */}
                <div className="mb-8">
                    <div className="bg-gradient-to-r from-blue-500/10 to-purple-500/10 rounded-2xl p-8 border border-white/10 backdrop-blur-sm">
                        <h2 className="text-4xl font-bold text-white mb-3">
                            Welcome back, {authData.user.name}! 👋
                        </h2>
                        <p className="text-xl text-gray-300 leading-relaxed">
                            Manage your documents and send signature invitations
                            with our secure platform.
                        </p>
                        <div className="flex items-center space-x-6 mt-6">
                            <div className="flex items-center space-x-2 text-blue-400">
                                <CheckCircle className="h-5 w-5" />
                                <span className="text-sm font-medium">
                                    Secure & Encrypted
                                </span>
                            </div>
                            <div className="flex items-center space-x-2 text-purple-400">
                                <Clock className="h-5 w-5" />
                                <span className="text-sm font-medium">
                                    Real-time Updates
                                </span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* File Upload Section */}
                <div className="mb-8">
                    <div className="bg-white/5 backdrop-blur-xl rounded-2xl p-8 border border-white/10 shadow-2xl">
                        <div className="flex items-center justify-between mb-6">
                            <h3 className="text-2xl font-bold text-white">
                                Document Upload
                            </h3>
                            <div className="flex items-center space-x-2 text-gray-400">
                                <Upload className="h-5 w-5" />
                                <span className="text-sm">File Upload</span>
                            </div>
                        </div>
                        <FileInput ownerEmail={authData.user.email} />
                    </div>
                </div>
            </main>
        </div>
    );
}
