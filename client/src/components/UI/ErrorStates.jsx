import { motion, AnimatePresence } from 'framer-motion';

/**
 * ErrorMessage - Inline error message component
 */
export function ErrorMessage({ 
  message, 
  onRetry,
  className = '' 
}) {
  if (!message) return null;

  return (
    <motion.div
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      className={`flex items-center gap-2 p-3 bg-red-500/10 border border-red-500/30 rounded-xl text-red-400 text-sm ${className}`}
    >
      <svg className="w-4 h-4 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
      <span className="flex-1">{message}</span>
      {onRetry && (
        <button 
          onClick={onRetry}
          className="px-2 py-1 bg-red-500/20 hover:bg-red-500/30 rounded text-xs font-medium transition-all"
        >
          Retry
        </button>
      )}
    </motion.div>
  );
}

/**
 * ErrorBoundaryFallback - Fallback UI for error boundaries
 */
export function ErrorBoundaryFallback({ 
  error, 
  resetErrorBoundary,
  title = 'Something went wrong'
}) {
  return (
    <div className="min-h-[400px] flex items-center justify-center p-8">
      <div className="max-w-md text-center">
        {/* Error Icon */}
        <div className="w-20 h-20 mx-auto mb-6 rounded-full bg-red-500/10 border border-red-500/30 flex items-center justify-center">
          <svg className="w-10 h-10 text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
          </svg>
        </div>

        {/* Title */}
        <h2 className="text-xl font-bold text-white mb-2">{title}</h2>
        
        {/* Error message */}
        <p className="text-gray-400 mb-6">
          {error?.message || 'An unexpected error occurred. Please try again.'}
        </p>

        {/* Actions */}
        <div className="flex gap-3 justify-center">
          <button
            onClick={() => window.location.reload()}
            className="px-4 py-2 bg-white/5 text-gray-400 rounded-xl hover:bg-white/10 hover:text-white transition-all"
          >
            Refresh Page
          </button>
          {resetErrorBoundary && (
            <button
              onClick={resetErrorBoundary}
              className="px-4 py-2 bg-purple-500 text-white rounded-xl hover:bg-purple-600 transition-all"
            >
              Try Again
            </button>
          )}
        </div>

        {/* Technical details (collapsible) */}
        {error?.stack && (
          <details className="mt-6 text-left">
            <summary className="text-xs text-gray-500 cursor-pointer hover:text-gray-400">
              Technical details
            </summary>
            <pre className="mt-2 p-3 bg-white/5 rounded-lg text-xs text-gray-500 overflow-auto max-h-32">
              {error.stack}
            </pre>
          </details>
        )}
      </div>
    </div>
  );
}

/**
 * EmptyState - Generic empty state component
 */
export function EmptyState({
  icon,
  title,
  description,
  action,
  actionLabel,
  className = '',
}) {
  return (
    <div className={`text-center py-12 ${className}`}>
      {/* Icon */}
      {icon && (
        <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-gray-500">
          {icon}
        </div>
      )}

      {/* Title */}
      {title && (
        <h3 className="text-lg font-semibold text-white mb-2">{title}</h3>
      )}

      {/* Description */}
      {description && (
        <p className="text-gray-500 mb-6 max-w-sm mx-auto">{description}</p>
      )}

      {/* Action */}
      {action && actionLabel && (
        <button
          onClick={action}
          className="px-4 py-2 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-xl font-medium hover:shadow-lg hover:shadow-purple-500/25 transition-all"
        >
          {actionLabel}
        </button>
      )}
    </div>
  );
}

/**
 * NotFound - 404 style component
 */
export function NotFound({
  title = 'Not Found',
  description = "The page you're looking for doesn't exist.",
  backLink = '/dashboard',
  backLabel = 'Go Back',
}) {
  return (
    <div className="min-h-screen bg-[#0a0a0f] flex items-center justify-center p-4">
      <div className="text-center">
        {/* 404 */}
        <div className="text-8xl font-black text-transparent bg-clip-text bg-gradient-to-r from-purple-500 to-pink-500 mb-4">
          404
        </div>

        {/* Title */}
        <h1 className="text-2xl font-bold text-white mb-2">{title}</h1>

        {/* Description */}
        <p className="text-gray-400 mb-8">{description}</p>

        {/* Back Link */}
        <a
          href={backLink}
          className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-xl font-medium hover:shadow-lg hover:shadow-purple-500/25 transition-all"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
          </svg>
          {backLabel}
        </a>
      </div>
    </div>
  );
}

/**
 * OfflineIndicator - Shows when user is offline
 */
export function OfflineIndicator() {
  return (
    <AnimatePresence>
      <motion.div
        initial={{ y: -100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        exit={{ y: -100, opacity: 0 }}
        className="fixed top-0 left-0 right-0 z-50 bg-orange-500 text-white py-2 px-4 text-center text-sm font-medium"
      >
        <div className="flex items-center justify-center gap-2">
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18.364 5.636a9 9 0 010 12.728m0 0l-2.829-2.829m2.829 2.829L21 21M15.536 8.464a5 5 0 010 7.072m0 0l-2.829-2.829m-4.243 2.829a4.978 4.978 0 01-1.414-2.83m-1.414 5.658a9 9 0 01-2.167-9.238m7.824 2.167a1 1 0 111.414 1.414m-1.414-1.414L3 3m8.293 8.293l1.414 1.414" />
          </svg>
          You're offline. Some features may not be available.
        </div>
      </motion.div>
    </AnimatePresence>
  );
}

export default {
  ErrorMessage,
  ErrorBoundaryFallback,
  EmptyState,
  NotFound,
  OfflineIndicator,
};
