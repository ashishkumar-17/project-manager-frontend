import React from 'react';
import { LoadingPage } from './LoadingPage';
import {clsx} from "clsx";

interface LoaderProps {
    isLoading?: boolean;
    loadingMessage?: string;
    absolute?: boolean;
}

export const Loader: React.FC<LoaderProps> = ({
                                                          isLoading,
                                                          loadingMessage = "Loading...",
                                                          absolute = false
                                                      }) => {
    if(!isLoading) return null;

    return (
        <div className={clsx(
            absolute ? 'absolute inset-0 z-50' : 'fixed inset-0 z-50',
            'flex items-center justify-center bg-white/70 dark:bg-neutral-900/70 backdrop-blur-sm'
        )}
             >
            <LoadingPage message={loadingMessage} />
        </div>
    );
};