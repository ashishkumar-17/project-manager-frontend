import React, { useState, useEffect, useRef } from 'react';
import { LoadingPage } from './LoadingPage';

interface PageLoaderProps {
    children: React.ReactNode;
    isLoading?: boolean;
    loadingMessage?: string;
    minLoadingTime?: number;
    absolute?: boolean;
}

export const PageLoader: React.FC<PageLoaderProps> = ({
                                                          children,
                                                          isLoading = false,
                                                          loadingMessage = "Loading...",
                                                          minLoadingTime = 500
                                                      }) => {
    const [showLoading, setShowLoading] = useState(isLoading);
    const startTimeRef = useRef<number | null>(null);

    useEffect(() => {
        if (isLoading) {
            startTimeRef.current = Date.now();
            setShowLoading(true);
        } else if (startTimeRef.current) {
            const elapsed = Date.now() - startTimeRef.current;
            const remaining = Math.max(0, minLoadingTime - elapsed);

            setTimeout(() => {
                setShowLoading(false);
                startTimeRef.current = null;
            }, remaining);
        }
    }, [isLoading, minLoadingTime]);

    if (showLoading) {
        return <LoadingPage message={loadingMessage} />;
    }

    return <>{children}</>;
};