import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from './Button';

interface ConfirmModalProps {
    isOpen: boolean;
    onClose: () => void;
    onConfirm: () => Promise<void>;
    title: string;
    message: string;
    itemName: string;
}

export const ConfirmModal: React.FC<ConfirmModalProps> = ({
                                                              isOpen,
                                                              onClose,
                                                              onConfirm,
                                                              title,
                                                              message,
                                                              itemName,
                                                          }) => {
    if (!isOpen) return null;

    return (
        <AnimatePresence>
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="fixed inset-0 bg-black/50 flex items-center justify-center z-50"
            >
                <motion.div
                    initial={{ scale: 0.95, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    exit={{ scale: 0.95, opacity: 0 }}
                    className="bg-white dark:bg-neutral-800 p-6 rounded-lg w-full max-w-md"
                >
                    <h2 className="text-xl font-bold text-neutral-900 dark:text-neutral-100 mb-4">
                        {title}
                    </h2>
                    <p className="text-neutral-600 dark:text-neutral-400 mb-6">
                        {message} <span className="font-medium">"{itemName}"</span>?
                    </p>
                    <div className="flex justify-end gap-2">
                        <Button variant="ghost" onClick={onClose}>
                            Cancel
                        </Button>
                        <Button
                            variant="danger"
                            onClick={async () => {
                                await onConfirm();
                                onClose();
                            }}
                        >
                            Delete
                        </Button>
                    </div>
                </motion.div>
            </motion.div>
        </AnimatePresence>
    );
};