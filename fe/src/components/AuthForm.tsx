'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { signin, signup, AuthResponse } from '@/lib/services/auth';
import { FileText, Lock, Mail, User, Eye, EyeOff } from 'lucide-react';
import { useToast } from '@/components/ui/toast';

interface AuthFormProps {
    onAuthSuccess: (authData: AuthResponse) => void;
}

export function AuthForm({ onAuthSuccess }: AuthFormProps) {
    const [isSignup, setIsSignup] = useState(false);
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [name, setName] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const { showToast } = useToast();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);

        try {
            let authData: AuthResponse;

            if (isSignup) {
                authData = await signup(email, password, name);
                showToast('Account created successfully!', 'success');
            } else {
                authData = await signin(email, password);
                showToast('Signed in successfully!', 'success');
            }

            onAuthSuccess(authData);
        } catch (err) {
            console.log('AuthForm error caught:', err); // Debug log
            const errorMessage =
                err instanceof Error ? err.message : 'Authentication failed';
            console.log('Showing error toast:', errorMessage); // Debug log
            showToast(errorMessage, 'error');
        } finally {
            setIsLoading(false);
        }
    };

    const toggleMode = () => {
        setIsSignup(!isSignup);
        setEmail('');
        setPassword('');
        setName('');
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50 flex items-center justify-center p-4">
            <div className="max-w-md w-full space-y-8">
                {/* Header */}
                <div className="text-center">
                    <div className="mx-auto h-16 w-16 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-full flex items-center justify-center mb-4">
                        <FileText className="h-8 w-8 text-white" />
                    </div>
                    <h2 className="text-3xl font-bold text-gray-900 mb-2">
                        {isSignup ? 'Create Account' : 'Welcome Back'}
                    </h2>
                    <p className="text-gray-600">
                        {isSignup
                            ? 'Sign up to start managing your documents'
                            : 'Sign in to your account'}
                    </p>
                </div>

                {/* Form */}
                <form onSubmit={handleSubmit} className="space-y-6">
                    {isSignup && (
                        <div>
                            <Label
                                htmlFor="name"
                                className="text-sm font-medium text-gray-700"
                            >
                                Full Name
                            </Label>
                            <div className="relative mt-1">
                                <User className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                                <Input
                                    id="name"
                                    type="text"
                                    value={name}
                                    onChange={(e) => setName(e.target.value)}
                                    className="pl-10"
                                    placeholder="Enter your full name"
                                    required={isSignup}
                                />
                            </div>
                        </div>
                    )}

                    <div>
                        <Label
                            htmlFor="email"
                            className="text-sm font-medium text-gray-700"
                        >
                            Email Address
                        </Label>
                        <div className="relative mt-1">
                            <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                            <Input
                                id="email"
                                type="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                className="pl-10"
                                placeholder="Enter your email"
                                required
                            />
                        </div>
                    </div>

                    <div>
                        <Label
                            htmlFor="password"
                            className="text-sm font-medium text-gray-700"
                        >
                            Password
                        </Label>
                        <div className="relative mt-1">
                            <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                            <Input
                                id="password"
                                type={showPassword ? 'text' : 'password'}
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                className="pl-10 pr-10"
                                placeholder="Enter your password"
                                required
                            />
                            <button
                                type="button"
                                onClick={() => setShowPassword(!showPassword)}
                                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                            >
                                {showPassword ? (
                                    <EyeOff className="h-5 w-5" />
                                ) : (
                                    <Eye className="h-5 w-5" />
                                )}
                            </button>
                        </div>
                    </div>

                    <Button
                        type="submit"
                        disabled={isLoading}
                        className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-medium py-3 px-4 rounded-lg transition-all duration-200 transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        {isLoading ? (
                            <div className="flex items-center justify-center">
                                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                                {isSignup
                                    ? 'Creating Account...'
                                    : 'Signing In...'}
                            </div>
                        ) : isSignup ? (
                            'Create Account'
                        ) : (
                            'Sign In'
                        )}
                    </Button>
                </form>

                {/* Toggle Mode */}
                <div className="text-center">
                    <button
                        onClick={toggleMode}
                        className="text-blue-600 hover:text-blue-800 font-medium transition-colors duration-200"
                    >
                        {isSignup
                            ? 'Already have an account? Sign in'
                            : "Don't have an account? Sign up"}
                    </button>
                </div>

                {/* Features */}
                <div className="bg-white/50 backdrop-blur-sm rounded-lg p-4 border border-gray-200">
                    <h3 className="font-medium text-gray-900 mb-2">
                        What you can do:
                    </h3>
                    <ul className="text-sm text-gray-600 space-y-1">
                        <li>• Upload and share documents securely</li>
                        <li>• Send digital signature invitations</li>
                        <li>• Track document acceptance status</li>
                        <li>• Manage your document workflow</li>
                    </ul>
                </div>
            </div>
        </div>
    );
}
