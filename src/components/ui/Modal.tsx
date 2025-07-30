import React, { useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X } from 'lucide-react';
import { clsx } from 'clsx';

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  size?: 'sm' | 'md' | 'lg' | 'xl' | 'full';
  children: React.ReactNode;
  className?: string;
}

export const Modal: React.FC<ModalProps> = ({
  isOpen,
  onClose,
  title,
  size = 'md',
  children,
  className
}) => {
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener('keydown', handleEscape);
      document.body.style.overflow = 'hidden';
    }

    return () => {
      document.removeEventListener('keydown', handleEscape);
      document.body.style.overflow = 'unset';
    };
  }, [isOpen, onClose]);

  const sizeClasses = {
    sm: 'max-w-md',
    md: 'max-w-lg',
    lg: 'max-w-2xl',
    xl: 'max-w-4xl',
    full: 'max-w-full m-4'
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 overflow-y-auto">
          <div className="flex min-h-full items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/50 backdrop-blur-sm"
              onClick={onClose}
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              transition={{ type: 'spring', duration: 0.3 }}
              className={clsx(
                'relative w-full bg-white dark:bg-neutral-800 rounded-xl shadow-xl',
                sizeClasses[size],
                className
              )}
            >
              {title && (
                <div className="flex items-center justify-between p-6 border-b border-neutral-200 dark:border-neutral-700">
                  <h2 className="text-lg font-semibold text-neutral-900 dark:text-neutral-100">
                    {title}
                  </h2>
                  <button
                    onClick={onClose}
                    className="p-1 rounded-lg hover:bg-neutral-100 dark:hover:bg-neutral-700 transition-colors"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>
              )}
              <div className={title ? 'p-6' : 'p-6'}>
                {children}
              </div>
            </motion.div>
          </div>
        </div>
      )}
    </AnimatePresence>
  );
};