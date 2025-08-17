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
        console.log('Form submitted:', { isSignup, email, password, name }); // Debug log
        setIsLoading(true);

        try {
            let authData: AuthResponse;

            if (isSignup) {
                console.log('Attempting signup...'); // Debug log
                authData = await signup(email, password, name);
                showToast('Account created successfully!', 'success');
            } else {
                console.log('Attempting signin...'); // Debug log
                authData = await signin(email, password);
                showToast('Signed in successfully!', 'success');
            }

            console.log('Auth successful:', authData); // Debug log
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
        <div className="h-screen bg-gray-900 flex overflow-hidden">
            {/* Left Section - Promotional Content */}
            <div className="hidden lg:flex lg:w-1/2 bg-gray-900 p-12 flex-col justify-between relative">
                {/* Background 3D Elements */}
                <div className="absolute inset-0 opacity-10">
                    <div className="absolute top-1/4 left-1/4 text-9xl font-bold text-gray-700 transform -rotate-12">
                        3D
                    </div>
                    <div className="absolute bottom-1/4 right-1/4 w-32 h-32 border-2 border-dashed border-gray-600 rounded-lg transform rotate-45">
                        <div className="absolute top-0 left-0 w-2 h-2 bg-white rounded-full"></div>
                        <div className="absolute top-0 right-0 w-2 h-2 bg-white rounded-full"></div>
                        <div className="absolute bottom-0 left-0 w-2 h-2 bg-white rounded-full"></div>
                        <div className="absolute bottom-0 right-0 w-2 h-2 bg-white rounded-full"></div>
                    </div>
                </div>

                {/* Top Content */}
                <div className="relative z-10 flex flex-col justify-center h-full">
                    <div className="flex-1 flex items-center justify-center">
                        <div className="space-y-6 text-center">
                            {/* Logo */}
                            <div className="flex items-center justify-center space-x-3 mb-4">
                                <div className="h-12 w-12 bg-gradient-to-r from-blue-500 to-blue-600 rounded-lg flex items-center justify-center">
                                    <FileText className="h-7 w-7 text-white" />
                                </div>
                                <span className="text-3xl font-bold text-white">
                                    Signer
                                </span>
                            </div>

                            {/* Main Text */}
                            <div className="text-4xl font-bold text-white leading-tight">
                                Professional
                                <br />
                                Signing Application
                            </div>
                            <div className="text-xl text-gray-300">
                                Secure and efficient signing platform
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Right Section - Auth Form */}
            <div className="w-full lg:w-1/2 bg-gray-900 p-8 lg:p-12 flex items-center justify-center">
                <div className="w-full max-w-md space-y-6">
                    {/* Mobile Logo - Only visible on mobile */}
                    <div className="lg:hidden text-center mb-6">
                        <div className="flex items-center justify-center space-x-3 mb-4">
                            <div className="h-12 w-12 bg-gradient-to-r from-blue-500 to-blue-600 rounded-lg flex items-center justify-center">
                                <FileText className="h-7 w-7 text-white" />
                            </div>
                            <span className="text-2xl font-bold text-white">
                                Signer
                            </span>
                        </div>
                    </div>

                    {/* Form Header */}
                    <div className="text-center lg:text-left">
                        <h1 className="text-3xl lg:text-4xl font-bold text-white mb-2">
                            {isSignup ? 'Create Account' : 'Welcome Back!'}
                        </h1>
                        <p className="text-gray-400 text-lg">
                            {isSignup
                                ? 'Sign up to start managing your documents securely'
                                : 'Log in to continue to Signer'}
                        </p>
                    </div>

                    {/* Auth Form */}
                    <form onSubmit={handleSubmit} className="space-y-4">
                        {isSignup && (
                            <div>
                                <Label
                                    htmlFor="name"
                                    className="text-sm font-medium text-gray-300"
                                >
                                    Full Name
                                </Label>
                                <div className="relative mt-2">
                                    <User className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                                    <Input
                                        id="name"
                                        type="text"
                                        value={name}
                                        onChange={(e) =>
                                            setName(e.target.value)
                                        }
                                        className="pl-10 bg-gray-800 border-gray-700 text-white placeholder-gray-400 focus:border-blue-500 focus:ring-blue-500"
                                        placeholder="Enter your full name"
                                        required={isSignup}
                                    />
                                </div>
                            </div>
                        )}

                        <div>
                            <Label
                                htmlFor="email"
                                className="text-sm font-medium text-gray-300"
                            >
                                Email Address
                            </Label>
                            <div className="relative mt-2">
                                <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                                <Input
                                    id="email"
                                    type="email"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    className="pl-10 bg-gray-800 border-gray-700 text-white placeholder-gray-400 focus:border-blue-500 focus:ring-blue-500"
                                    placeholder="Your email address"
                                    required
                                />
                            </div>
                        </div>

                        <div>
                            <Label
                                htmlFor="password"
                                className="text-sm font-medium text-gray-300"
                            >
                                Password
                            </Label>
                            <div className="relative mt-2">
                                <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                                <Input
                                    id="password"
                                    type={showPassword ? 'text' : 'password'}
                                    value={password}
                                    onChange={(e) =>
                                        setPassword(e.target.value)
                                    }
                                    className="pl-10 pr-10 bg-gray-800 border-gray-700 text-white placeholder-gray-400 focus:border-blue-500 focus:ring-blue-500"
                                    placeholder="Your password"
                                    required
                                />
                                <button
                                    type="button"
                                    onClick={() =>
                                        setShowPassword(!showPassword)
                                    }
                                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-300"
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
                            onClick={() => console.log('Button clicked!')} // Debug backup
                            className="w-full h-12 text-lg font-semibold bg-blue-600 hover:bg-blue-700 text-white"
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
                                'Log In'
                            )}
                        </Button>
                    </form>

                    {/* Toggle Mode */}
                    <div className="flex items-center justify-center space-x-2">
                        <span className="text-gray-400">
                            {isSignup
                                ? 'Already have an account?'
                                : "Don't have an account?"}
                        </span>
                        <Button
                            onClick={toggleMode}
                            variant="link"
                            className="text-blue-400 hover:text-blue-300 p-0 h-auto"
                        >
                            {isSignup ? 'Sign in' : 'Sign up'}
                        </Button>
                    </div>

                    {/* Mobile Features - Only visible on mobile */}
                    <div className="lg:hidden bg-gray-800/50 backdrop-blur-sm rounded-lg p-4 border border-gray-700">
                        <h3 className="font-medium text-white mb-3">
                            What you can do:
                        </h3>
                        <ul className="text-sm text-gray-300 space-y-2">
                            <li className="flex items-center space-x-2">
                                <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                                <span>Upload and share documents securely</span>
                            </li>
                            <li className="flex items-center space-x-2">
                                <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                                <span>Send digital signature invitations</span>
                            </li>
                            <li className="flex items-center space-x-2">
                                <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                                <span>Track document acceptance status</span>
                            </li>
                            <li className="flex items-center space-x-2">
                                <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                                <span>Manage your document workflow</span>
                            </li>
                        </ul>
                    </div>
                </div>
            </div>
        </div>
    );
}
