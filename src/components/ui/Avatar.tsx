import React from 'react';
import { clsx } from 'clsx';

interface AvatarProps {
  src?: string;
  alt?: string;
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl';
  name?: string;
  status?: 'online' | 'offline' | 'away';
  className?: string;
}

export const Avatar: React.FC<AvatarProps> = ({
  src,
  alt,
  size = 'md',
  name,
  status,
  className
}) => {
  const sizeClasses = {
    xs: 'w-6 h-6 text-xs',
    sm: 'w-8 h-8 text-sm',
    md: 'w-10 h-10 text-base',
    lg: 'w-12 h-12 text-lg',
    xl: 'w-16 h-16 text-xl'
  };

  const statusClasses = {
    online: 'bg-success-500',
    offline: 'bg-neutral-400',
    away: 'bg-warning-500'
  };

  const getInitials = (name?: string) => {
    if (!name) return '?';
    return name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);
  };

  return (
    <div className={clsx('relative inline-block', className)}>
      <div
        className={clsx(
          'flex items-center justify-center rounded-full overflow-hidden',
          'bg-neutral-100 dark:bg-neutral-700',
          sizeClasses[size]
        )}
      >
        {src ? (
          <img src={src} alt={alt || name} className="w-full h-full object-cover" />
        ) : (
          <span className="font-medium text-neutral-600 dark:text-neutral-300">
            {getInitials(name)}
          </span>
        )}
      </div>
      {status && (
        <div
          className={clsx(
            'absolute bottom-0 right-0 w-3 h-3 rounded-full border-2 border-white dark:border-neutral-800',
            statusClasses[status]
          )}
        />
      )}
    </div>
  );
};