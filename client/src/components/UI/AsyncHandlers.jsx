import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

/**
 * NetworkStatusMonitor - Monitors online/offline status and displays notifications
 */
export function NetworkStatusMonitor() {
  const [isOnline, setIsOnline] = useState(navigator.onLine);
  const [showOffline, setShowOffline] = useState(false);
  const [showBackOnline, setShowBackOnline] = useState(false);

  useEffect(() => {
    const handleOnline = () => {
      console.log('🌐 [NetworkStatus] Back online');
      setIsOnline(true);
      setShowOffline(false);
      setShowBackOnline(true);
      
      // Hide "back online" message after 3 seconds
      setTimeout(() => setShowBackOnline(false), 3000);
    };

    const handleOffline = () => {
      console.log('📡 [NetworkStatus] Gone offline');
      setIsOnline(false);
      setShowOffline(true);
      setShowBackOnline(false);
    };

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    // Set initial offline state if offline on mount
    if (!navigator.onLine) {
      setShowOffline(true);
    }

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  return (
    <>
      {/* Offline Banner */}
      <AnimatePresence>
        {showOffline && (
          <motion.div
            initial={{ y: -100, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: -100, opacity: 0 }}
            transition={{ type: 'spring', stiffness: 300, damping: 30 }}
            className="fixed top-0 left-0 right-0 z-[9999] bg-orange-500 text-white py-3 px-4 shadow-lg"
          >
            <div className="container mx-auto flex items-center justify-center gap-3">
              <svg className="w-5 h-5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18.364 5.636a9 9 0 010 12.728m0 0l-2.829-2.829m2.829 2.829L21 21M15.536 8.464a5 5 0 010 7.072m0 0l-2.829-2.829m-4.243 2.829a4.978 4.978 0 01-1.414-2.83m-1.414 5.658a9 9 0 01-2.167-9.238m7.824 2.167a1 1 0 111.414 1.414m-1.414-1.414L3 3m8.293 8.293l1.414 1.414" />
              </svg>
              <span className="font-medium text-sm">
                You're offline. Some features may not be available.
              </span>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Back Online Notification */}
      <AnimatePresence>
        {showBackOnline && (
          <motion.div
            initial={{ y: -100, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: -100, opacity: 0 }}
            transition={{ type: 'spring', stiffness: 300, damping: 30 }}
            className="fixed top-0 left-0 right-0 z-[9999] bg-green-500 text-white py-3 px-4 shadow-lg"
          >
            <div className="container mx-auto flex items-center justify-center gap-3">
              <svg className="w-5 h-5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <span className="font-medium text-sm">
                Back online! Your connection has been restored.
              </span>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}

/**
 * AsyncOperationHandler - Wraps async operations with loading/error states
 * Usage: <AsyncOperationHandler operation={fetchData} renderData={(data) => <YourComponent data={data} />} />
 */
export function AsyncOperationHandler({
  operation,
  renderData,
  renderLoading,
  renderError,
  onRetry,
  loadingMessage = 'Loading...',
  errorTitle = 'Something went wrong',
}) {
  const [state, setState] = useState({
    loading: true,
    error: null,
    data: null,
  });

  useEffect(() => {
    let mounted = true;

    const executeOperation = async () => {
      try {
        setState({ loading: true, error: null, data: null });
        const result = await operation();
        if (mounted) {
          setState({ loading: false, error: null, data: result });
        }
      } catch (error) {
        console.error('❌ [AsyncOperationHandler] Operation failed:', error);
        if (mounted) {
          setState({ loading: false, error, data: null });
        }
      }
    };

    executeOperation();

    return () => {
      mounted = false;
    };
  }, [operation]);

  const handleRetry = () => {
    setState({ loading: true, error: null, data: null });
    if (onRetry) {
      onRetry();
    }
  };

  if (state.loading) {
    if (renderLoading) {
      return renderLoading();
    }
    return (
      <div className="flex items-center justify-center min-h-[200px]">
        <div className="text-center">
          <div className="w-12 h-12 mx-auto mb-4 border-4 border-purple-500/20 border-t-purple-500 rounded-full animate-spin" />
          <p className="text-gray-400 text-sm">{loadingMessage}</p>
        </div>
      </div>
    );
  }

  if (state.error) {
    if (renderError) {
      return renderError(state.error, handleRetry);
    }
    return (
      <div className="flex items-center justify-center min-h-[200px]">
        <div className="text-center max-w-md">
          <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-red-500/10 border border-red-500/30 flex items-center justify-center">
            <svg className="w-8 h-8 text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
          </div>
          <h3 className="text-lg font-semibold text-white mb-2">{errorTitle}</h3>
          <p className="text-gray-400 text-sm mb-4">
            {state.error.message || 'An unexpected error occurred'}
          </p>
          <button
            onClick={handleRetry}
            className="px-4 py-2 bg-purple-500 text-white rounded-xl hover:bg-purple-600 transition-all"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return renderData(state.data);
}

/**
 * ProgressBar - Simple animated progress bar
 */
export function ProgressBar({ progress = 0, className = '', showPercentage = true }) {
  return (
    <div className={`w-full ${className}`}>
      <div className="flex items-center justify-between mb-2">
        {showPercentage && (
          <span className="text-sm text-gray-400">{Math.round(progress)}%</span>
        )}
      </div>
      <div className="h-2 bg-white/5 rounded-full overflow-hidden">
        <motion.div
          initial={{ width: 0 }}
          animate={{ width: `${progress}%` }}
          transition={{ duration: 0.3, ease: 'easeOut' }}
          className="h-full bg-gradient-to-r from-purple-500 to-pink-500 rounded-full"
        />
      </div>
    </div>
  );
}

/**
 * RetryButton - Reusable retry button component
 */
export function RetryButton({ onClick, children = 'Retry', className = '' }) {
  return (
    <button
      onClick={onClick}
      className={`px-4 py-2 bg-purple-500 text-white rounded-xl hover:bg-purple-600 transition-all flex items-center gap-2 ${className}`}
    >
      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
      </svg>
      {children}
    </button>
  );
}

export default {
  NetworkStatusMonitor,
  AsyncOperationHandler,
  ProgressBar,
  RetryButton,
};
