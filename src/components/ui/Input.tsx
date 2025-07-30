import React, { forwardRef } from 'react';
import { clsx } from 'clsx';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  icon?: React.ReactNode;
  helperText?: string;
}

export const Input = forwardRef<HTMLInputElement, InputProps>(({
  label,
  error,
  icon,
  helperText,
  className,
  ...props
}, ref) => {
  return (
    <div className="w-full">
      {label && (
        <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-2">
          {label}
        </label>
      )}
      <div className="relative">
        {icon && (
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <span className="text-neutral-400">{icon}</span>
          </div>
        )}
        <input
          ref={ref}
          className={clsx(
            'block w-full px-3 py-2 border border-neutral-300 rounded-lg shadow-sm placeholder-neutral-400',
            'focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500',
            'dark:bg-neutral-800 dark:border-neutral-600 dark:text-neutral-100 dark:placeholder-neutral-500',
            'transition-colors duration-200',
            icon && 'pl-10',
            error && 'border-error-500 focus:ring-error-500 focus:border-error-500',
            className
          )}
          {...props}
        />
      </div>
      {error && (
        <p className="mt-1 text-sm text-error-600 dark:text-error-400">{error}</p>
      )}
      {helperText && !error && (
        <p className="mt-1 text-sm text-neutral-500 dark:text-neutral-400">{helperText}</p>
      )}
    </div>
  );
});

Input.displayName = 'Input';