'use client';

import {
    createContext,
    useContext,
    useEffect,
    useState,
    ReactNode,
} from 'react';
import { CheckCircle, XCircle, X } from 'lucide-react';
import { cn } from '@/lib/utils/css';

interface ToastProps {
    message: string;
    type: 'success' | 'error';
    onClose: () => void;
    duration?: number;
}

export function Toast({ message, type, onClose, duration = 5000 }: ToastProps) {
    const [isVisible, setIsVisible] = useState(true);

    useEffect(() => {
        console.log(`Toast displayed: ${message} (${type})`); // Debug log
        const timer = setTimeout(() => {
            setIsVisible(false);
            setTimeout(onClose, 300); // Wait for fade out animation
        }, duration);

        return () => clearTimeout(timer);
    }, [duration, onClose, message, type]);

    const handleClose = () => {
        setIsVisible(false);
        setTimeout(onClose, 300);
    };

    return (
        <div
            className={cn(
                'fixed top-4 right-4 z-[9999] max-w-sm w-full bg-white rounded-lg shadow-lg border-l-4 transition-all duration-300 transform',
                type === 'success' ? 'border-green-500' : 'border-red-500',
                isVisible
                    ? 'translate-x-0 opacity-100'
                    : 'translate-x-full opacity-0',
            )}
            style={{ zIndex: 9999 }}
        >
            <div className="flex items-start p-4">
                <div className="flex-shrink-0">
                    {type === 'success' ? (
                        <CheckCircle className="h-5 w-5 text-green-500" />
                    ) : (
                        <XCircle className="h-5 w-5 text-red-500" />
                    )}
                </div>
                <div className="ml-3 flex-1">
                    <p
                        className={cn(
                            'text-sm font-medium',
                            type === 'success'
                                ? 'text-green-800'
                                : 'text-red-800',
                        )}
                    >
                        {message}
                    </p>
                </div>
                <div className="ml-4 flex-shrink-0">
                    <button
                        onClick={handleClose}
                        className={cn(
                            'inline-flex rounded-md p-1.5 focus:outline-none focus:ring-2 focus:ring-offset-2',
                            type === 'success'
                                ? 'text-green-400 hover:text-green-600 focus:ring-green-500'
                                : 'text-red-400 hover:text-red-600 focus:ring-red-500',
                        )}
                    >
                        <X className="h-4 w-4" />
                    </button>
                </div>
            </div>
        </div>
    );
}

interface ToastContextType {
    showToast: (message: string, type: 'success' | 'error') => void;
}

const ToastContext = createContext<ToastContextType | undefined>(undefined);

export const useToast = (): ToastContextType => {
    const context = useContext(ToastContext);
    if (!context) {
        throw new Error('useToast must be used within a ToastProvider');
    }
    return context;
};

interface ToastProviderProps {
    children: ReactNode;
}

export function ToastProvider({ children }: ToastProviderProps) {
    const [toasts, setToasts] = useState<
        Array<{ id: string; message: string; type: 'success' | 'error' }>
    >([]);

    const showToast = (message: string, type: 'success' | 'error') => {
        console.log(`showToast called: ${message} (${type})`); // Debug log
        const id = Math.random().toString(36).substr(2, 9);
        setToasts((prev) => {
            console.log(`Adding toast: ${message} (${type})`); // Debug log
            return [...prev, { id, message, type }];
        });
    };

    const removeToast = (id: string) => {
        setToasts((prev) => prev.filter((toast) => toast.id !== id));
    };

    console.log(`ToastProvider render - current toasts:`, toasts); // Debug log

    return (
        <ToastContext.Provider value={{ showToast }}>
            {children}
            {toasts.map((toast) => (
                <Toast
                    key={toast.id}
                    message={toast.message}
                    type={toast.type}
                    onClose={() => removeToast(toast.id)}
                />
            ))}
        </ToastContext.Provider>
    );
}
