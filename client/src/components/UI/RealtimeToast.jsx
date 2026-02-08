import { motion, AnimatePresence } from 'framer-motion';
import { useState, useEffect } from 'react';
import useToastStore from '../../stores/toastStore';

/**
 * Enhanced Toast notification component with actions, progress, and avatars
 */
function Toast({ toast, onClose }) {
  const {
    id,
    message,
    type = 'info',
    duration,
    persistent,
    action,
    actionLabel,
    onAction,
    icon,
    avatar,
    showProgress,
  } = toast;

  const [isVisible, setIsVisible] = useState(true);
  const [progress, setProgress] = useState(100);

  useEffect(() => {
    if (!persistent && duration) {
      const timer = setTimeout(() => {
        setIsVisible(false);
        setTimeout(() => onClose?.(), 300);
      }, duration);

      // Animate progress bar
      if (showProgress) {
        const progressInterval = setInterval(() => {
          setProgress((prev) => {
            const decrement = (100 / duration) * 50; // Update every 50ms
            return Math.max(0, prev - decrement);
          });
        }, 50);

        return () => {
          clearTimeout(timer);
          clearInterval(progressInterval);
        };
      }

      return () => clearTimeout(timer);
    }
  }, [duration, persistent, showProgress, onClose]);

  const typeStyles = {
    info: {
      bg: 'bg-blue-500/20',
      border: 'border-blue-500/50',
      text: 'text-blue-400',
      progressBg: 'bg-blue-500',
    },
    success: {
      bg: 'bg-green-500/20',
      border: 'border-green-500/50',
      text: 'text-green-400',
      progressBg: 'bg-green-500',
    },
    warning: {
      bg: 'bg-yellow-500/20',
      border: 'border-yellow-500/50',
      text: 'text-yellow-400',
      progressBg: 'bg-yellow-500',
    },
    error: {
      bg: 'bg-red-500/20',
      border: 'border-red-500/50',
      text: 'text-red-400',
      progressBg: 'bg-red-500',
    },
    task: {
      bg: 'bg-purple-500/20',
      border: 'border-purple-500/50',
      text: 'text-purple-400',
      progressBg: 'bg-purple-500',
    },
    loading: {
      bg: 'bg-cyan-500/20',
      border: 'border-cyan-500/50',
      text: 'text-cyan-400',
      progressBg: 'bg-cyan-500',
    },
    milestone: {
      bg: 'bg-pink-500/20',
      border: 'border-pink-500/50',
      text: 'text-pink-400',
      progressBg: 'bg-pink-500',
    },
    upload: {
      bg: 'bg-indigo-500/20',
      border: 'border-indigo-500/50',
      text: 'text-indigo-400',
      progressBg: 'bg-indigo-500',
    },
  };

  const icons = {
    info: (
      <svg className="w-5 h-5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
    ),
    success: (
      <svg className="w-5 h-5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
    ),
    warning: (
      <svg className="w-5 h-5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
      </svg>
    ),
    error: (
      <svg className="w-5 h-5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
    ),
    task: (
      <svg className="w-5 h-5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
      </svg>
    ),
    loading: (
      <svg className="w-5 h-5 flex-shrink-0 animate-spin" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
      </svg>
    ),
    milestone: (
      <svg className="w-5 h-5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />
      </svg>
    ),
    upload: (
      <svg className="w-5 h-5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
      </svg>
    ),
  };

  const style = typeStyles[type] || typeStyles.info;
  const handleClose = () => {
    setIsVisible(false);
    setTimeout(() => onClose?.(), 300);
  };

  const handleAction = () => {
    onAction?.();
    handleClose();
  };

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ opacity: 0, x: 400, scale: 0.9 }}
          animate={{ opacity: 1, x: 0, scale: 1 }}
          exit={{ opacity: 0, x: 400, scale: 0.9 }}
          transition={{ type: 'spring', stiffness: 300, damping: 30 }}
          className={`relative overflow-hidden flex flex-col min-w-[320px] max-w-md px-4 py-3 rounded-xl border backdrop-blur-sm shadow-lg ${style.bg} ${style.border}`}
        >
          {/* Main content */}
          <div className="flex items-start gap-3">
            {/* Avatar or Icon */}
            {avatar ? (
              <img
                src={avatar}
                alt=""
                className="w-8 h-8 rounded-full flex-shrink-0"
              />
            ) : icon ? (
              <div className={style.text}>{icon}</div>
            ) : (
              <div className={style.text}>{icons[type]}</div>
            )}

            {/* Message */}
            <div className="flex-1 min-w-0">
              <p className={`text-sm font-medium ${style.text}`}>{message}</p>
            </div>

            {/* Action button */}
            {action && actionLabel && (
              <button
                onClick={handleAction}
                className={`px-3 py-1 text-xs font-medium rounded-lg ${style.text} bg-white/10 hover:bg-white/20 transition-colors flex-shrink-0`}
              >
                {actionLabel}
              </button>
            )}

            {/* Close button */}
            <button
              onClick={handleClose}
              className={`opacity-60 hover:opacity-100 transition-opacity flex-shrink-0 ${style.text}`}
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          {/* Progress bar */}
          {showProgress && !persistent && (
            <div className="absolute bottom-0 left-0 right-0 h-1">
              <motion.div
                initial={{ width: '100%' }}
                animate={{ width: `${progress}%` }}
                className={`h-full ${style.progressBg} opacity-50`}
              />
            </div>
          )}
        </motion.div>
      )}
    </AnimatePresence>
  );
}

/**
 * Toast container with positioning support
 */
export function ToastContainer() {
  const { toasts, removeToast, preferences } = useToastStore();
  const { position } = preferences;

  const positionClasses = {
    'top-left': 'top-4 left-4',
    'top-right': 'top-4 right-4',
    'top-center': 'top-4 left-1/2 -translate-x-1/2',
    'bottom-left': 'bottom-4 left-4',
    'bottom-right': 'bottom-4 right-4',
    'bottom-center': 'bottom-4 left-1/2 -translate-x-1/2',
  };

  return (
    <div className={`fixed ${positionClasses[position] || positionClasses['bottom-right']} z-[9999] flex flex-col gap-2`}>
      <AnimatePresence mode="popLayout">
        {toasts.map((toast) => (
          <Toast
            key={toast.id}
            toast={toast}
            onClose={() => removeToast(toast.id)}
          />
        ))}
      </AnimatePresence>
    </div>
  );
}

/**
 * Legacy component for backward compatibility
 */
export default function RealtimeToast({ 
  message, 
  type = 'info', 
  duration = 3000,
  onClose 
}) {
  const toast = {
    id: Date.now(),
    message,
    type,
    duration,
    persistent: false,
  };

  return <Toast toast={toast} onClose={onClose} />;
}
