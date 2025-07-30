import React from 'react';
import {clsx} from 'clsx';

interface CardProps {
    children: React.ReactNode,
    className?: string,
    padding?: 'none' | 'sm' | 'md' | 'lg',
    hover?: boolean,
    onClick?: (e: React.MouseEvent<HTMLDivElement>) => void;
}

export const Card: React.FC<CardProps> = ({
                                              children,
                                              className,
                                              padding = 'md',
                                              hover = false,
                                              onClick,
                                          }) => {
    const paddingClasses = {
        none: '',
        sm: 'p-4',
        md: 'p-6',
        lg: 'p-8'
    };

    return (
        <div
            className={clsx(
                'bg-white dark:bg-neutral-800 rounded-xl border border-neutral-200 dark:border-neutral-700 shadow-sm',
                hover && 'hover:shadow-md transition-shadow duration-200',
                paddingClasses[padding],
                className
            )}
            onClick={onClick}
        >
            {children}
        </div>
    );
};