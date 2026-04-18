import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { AlertTriangle, X } from 'lucide-react';
import { Card } from './Card';
import { cn } from '../lib/utils';

interface ConfirmDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  message: string;
  confirmText?: string;
  cancelText?: string;
  variant?: 'danger' | 'warning' | 'info';
}

export const ConfirmDialog: React.FC<ConfirmDialogProps> = ({
  isOpen,
  onClose,
  onConfirm,
  title,
  message,
  confirmText = 'Confirm',
  cancelText = 'Cancel',
  variant = 'danger'
}) => {
  if (!isOpen) return null;

  const colorClasses = {
    danger: 'bg-rose-500 hover:bg-rose-600 shadow-rose-500/20 text-white',
    warning: 'bg-amber-500 hover:bg-amber-600 shadow-amber-500/20 text-white',
    info: 'bg-blue-500 hover:bg-blue-600 shadow-blue-500/20 text-white'
  };

  const iconClasses = {
    danger: 'bg-rose-100 text-rose-600 dark:bg-rose-900/30 dark:text-rose-400',
    warning: 'bg-amber-100 text-amber-600 dark:bg-amber-900/30 dark:text-amber-400',
    info: 'bg-blue-100 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400'
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm"
        />
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 10 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 10 }}
          className="relative w-full max-w-sm pointer-events-none"
        >
          <Card className="p-6 pointer-events-auto shadow-2xl overflow-visible dark:bg-slate-800 dark:border-slate-700">
            <div className="absolute -top-6 left-1/2 -translate-x-1/2">
              <div className={cn("w-12 h-12 rounded-2xl flex items-center justify-center shadow-lg", iconClasses[variant])}>
                <AlertTriangle size={24} />
              </div>
            </div>

            <div className="mt-6 text-center">
              <h3 className="text-xl font-bold text-slate-900 dark:text-white">{title}</h3>
              <p className="mt-2 text-slate-600 dark:text-slate-400 text-sm leading-relaxed">
                {message}
              </p>
            </div>

            <div className="mt-8 flex gap-3">
              <button
                onClick={onClose}
                className="flex-1 px-4 py-2.5 bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-200 font-bold rounded-xl hover:bg-slate-200 dark:hover:bg-slate-600 transition-all text-sm"
              >
                {cancelText}
              </button>
              <button
                onClick={() => {
                  onConfirm();
                  onClose();
                }}
                className={cn(
                  "flex-1 px-4 py-2.5 font-bold rounded-xl transition-all shadow-lg text-sm",
                  colorClasses[variant]
                )}
              >
                {confirmText}
              </button>
            </div>
          </Card>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
