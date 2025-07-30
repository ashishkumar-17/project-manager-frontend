import React from 'react';
import { motion } from 'framer-motion';

interface LoadingPageProps {
    message?: string;
    fullScreen?: boolean;
}

export const LoadingPage: React.FC<LoadingPageProps> = ({
                                                            message = "Loading...",
                                                            fullScreen = true
                                                        }) => {
    const containerClass = fullScreen
        ? "fixed inset-0 bg-white dark:bg-neutral-900 flex items-center justify-center z-50"
        : "flex items-center justify-center p-8";

    return (
        <div className={containerClass}>
            <div className="text-center">
                {/* Animated Logo */}
                <motion.div
                    initial={{ scale: 0.8, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{ duration: 0.5 }}
                    className="mb-8"
                >
                    <div className="relative">
                        {/* Main Logo */}
                        <motion.div
                            animate={{ rotate: 360 }}
                            transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                            className="w-16 h-16 bg-gradient-to-r from-primary-600 to-secondary-600 rounded-2xl flex items-center justify-center mx-auto mb-4"
                        >
                            <span className="text-white font-bold text-2xl">PM</span>
                        </motion.div>

                        {/* Orbiting Dots */}
                        <div className="absolute inset-0 flex items-center justify-center">
                            {[0, 1, 2].map((index) => (
                                <motion.div
                                    key={index}
                                    className="absolute w-2 h-2 bg-primary-400 rounded-full"
                                    animate={{
                                        rotate: 360,
                                        scale: [1, 1.2, 1],
                                    }}
                                    transition={{
                                        rotate: { duration: 3, repeat: Infinity, ease: "linear" },
                                        scale: { duration: 1, repeat: Infinity, delay: index * 0.2 }
                                    }}
                                    style={{
                                        transformOrigin: '0 40px',
                                        transform: `rotate(${index * 120}deg)`,
                                    }}
                                />
                            ))}
                        </div>
                    </div>
                </motion.div>

                {/* Loading Text */}
                <motion.h2
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3 }}
                    className="text-2xl font-bold text-neutral-900 dark:text-neutral-100 mb-2"
                >
                    ProjectManager
                </motion.h2>

                <motion.p
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.5 }}
                    className="text-neutral-600 dark:text-neutral-400 mb-6"
                >
                    {message}
                </motion.p>

                {/* Progress Bar */}
                <div className="w-64 mx-auto">
                    <div className="h-1 bg-neutral-200 dark:bg-neutral-700 rounded-full overflow-hidden">
                        <motion.div
                            className="h-full bg-gradient-to-r from-primary-600 to-secondary-600 rounded-full"
                            initial={{ width: "0%" }}
                            animate={{ width: "100%" }}
                            transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
                        />
                    </div>
                </div>

                {/* Animated Dots */}
                <div className="flex justify-center space-x-1 mt-6">
                    {[0, 1, 2].map((index) => (
                        <motion.div
                            key={index}
                            className="w-2 h-2 bg-primary-600 rounded-full"
                            animate={{
                                scale: [1, 1.5, 1],
                                opacity: [0.5, 1, 0.5],
                            }}
                            transition={{
                                duration: 1.5,
                                repeat: Infinity,
                                delay: index * 0.2,
                            }}
                        />
                    ))}
                </div>
            </div>
        </div>
    );
};

// Smaller loading spinner for inline use
export const LoadingSpinner: React.FC<{ size?: 'sm' | 'md' | 'lg'; className?: string }> = ({
                                                                                                size = 'md',
                                                                                                className = ''
                                                                                            }) => {
    const sizeClasses = {
        sm: 'w-4 h-4',
        md: 'w-6 h-6',
        lg: 'w-8 h-8'
    };

    return (
        <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
            className={`${sizeClasses[size]} ${className}`}
        >
            <div className="w-full h-full border-2 border-primary-200 border-t-primary-600 rounded-full" />
        </motion.div>
    );
};

// Loading overlay for specific sections
export const LoadingOverlay: React.FC<{ isLoading: boolean; children: React.ReactNode; message?: string }> = ({
                                                                                                                  isLoading,
                                                                                                                  children,
                                                                                                                  message = "Loading..."
                                                                                                              }) => {
    return (
        <div className="relative">
            {children}
            {isLoading && (
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="absolute inset-0 bg-white/80 dark:bg-neutral-900/80 backdrop-blur-sm flex items-center justify-center z-10"
                >
                    <div className="text-center">
                        <LoadingSpinner size="lg" className="mx-auto mb-4" />
                        <p className="text-neutral-600 dark:text-neutral-400">{message}</p>
                    </div>
                </motion.div>
            )}
        </div>
    );
};

// Skeleton loader for content
export const SkeletonLoader: React.FC<{ className?: string }> = ({ className = '' }) => {
    return (
        <motion.div
            animate={{ opacity: [0.5, 1, 0.5] }}
            transition={{ duration: 1.5, repeat: Infinity }}
            className={`bg-neutral-200 dark:bg-neutral-700 rounded ${className}`}
        />
    );
};

// Card skeleton for lists
export const CardSkeleton: React.FC = () => {
    return (
        <div className="bg-white dark:bg-neutral-800 rounded-xl border border-neutral-200 dark:border-neutral-700 p-6">
            <div className="flex items-start justify-between mb-4">
                <div className="flex items-center">
                    <SkeletonLoader className="w-4 h-4 rounded-full mr-3" />
                    <SkeletonLoader className="w-32 h-5" />
                </div>
                <SkeletonLoader className="w-16 h-6 rounded-full" />
            </div>
            <SkeletonLoader className="w-full h-4 mb-2" />
            <SkeletonLoader className="w-3/4 h-4 mb-4" />
            <div className="flex items-center justify-between">
                <div className="flex -space-x-2">
                    {[1, 2, 3].map((i) => (
                        <SkeletonLoader key={i} className="w-6 h-6 rounded-full border-2 border-white dark:border-neutral-800" />
                    ))}
                </div>
                <SkeletonLoader className="w-20 h-4" />
            </div>
        </div>
    );
};