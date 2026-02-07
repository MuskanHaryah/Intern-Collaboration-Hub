import { motion, AnimatePresence } from 'framer-motion';

/**
 * Loading Spinner - Reusable loading indicator
 */
export function LoadingSpinner({ 
  size = 'md', 
  color = 'purple',
  className = '' 
}) {
  const sizes = {
    xs: 'w-4 h-4 border-2',
    sm: 'w-6 h-6 border-2',
    md: 'w-8 h-8 border-3',
    lg: 'w-12 h-12 border-4',
    xl: 'w-16 h-16 border-4',
  };

  const colors = {
    purple: 'border-purple-500/30 border-t-purple-500',
    pink: 'border-pink-500/30 border-t-pink-500',
    cyan: 'border-cyan-500/30 border-t-cyan-500',
    white: 'border-white/30 border-t-white',
    gray: 'border-gray-500/30 border-t-gray-500',
  };

  return (
    <div 
      className={`${sizes[size]} ${colors[color]} rounded-full animate-spin ${className}`}
    />
  );
}

/**
 * Loading Overlay - Full screen or container loading state
 */
export function LoadingOverlay({ 
  message = 'Loading...', 
  fullScreen = false,
  transparent = false,
}) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className={`${
        fullScreen ? 'fixed inset-0 z-50' : 'absolute inset-0 z-10'
      } flex flex-col items-center justify-center ${
        transparent ? 'bg-black/40' : 'bg-[#0a0a0f]/90'
      } backdrop-blur-sm`}
    >
      <LoadingSpinner size="lg" />
      {message && (
        <p className="mt-4 text-gray-400 text-sm animate-pulse">{message}</p>
      )}
    </motion.div>
  );
}

/**
 * Skeleton Loader - Placeholder for content loading
 */
export function Skeleton({ 
  className = '', 
  variant = 'text', // text, circle, rect, card
  width,
  height,
  count = 1,
}) {
  const variants = {
    text: 'h-4 rounded',
    circle: 'rounded-full',
    rect: 'rounded-lg',
    card: 'h-32 rounded-xl',
  };

  const items = Array.from({ length: count }, (_, i) => i);

  return (
    <div className="space-y-2">
      {items.map((i) => (
        <div
          key={i}
          className={`bg-white/5 animate-pulse ${variants[variant]} ${className}`}
          style={{ width, height }}
        />
      ))}
    </div>
  );
}

/**
 * TaskCardSkeleton - Skeleton for task cards
 */
export function TaskCardSkeleton() {
  return (
    <div className="bg-[#1a1a2e] border border-white/10 rounded-xl p-4 animate-pulse">
      {/* Labels */}
      <div className="flex gap-2 mb-3">
        <div className="h-5 w-16 bg-white/5 rounded-full" />
        <div className="h-5 w-20 bg-white/5 rounded-full" />
      </div>
      
      {/* Title */}
      <div className="h-5 w-3/4 bg-white/10 rounded mb-2" />
      
      {/* Description */}
      <div className="space-y-1.5 mb-3">
        <div className="h-3 w-full bg-white/5 rounded" />
        <div className="h-3 w-2/3 bg-white/5 rounded" />
      </div>
      
      {/* Footer */}
      <div className="flex items-center justify-between pt-3 border-t border-white/5">
        <div className="flex gap-2">
          <div className="h-5 w-16 bg-white/5 rounded" />
          <div className="h-5 w-20 bg-white/5 rounded" />
        </div>
        <div className="flex -space-x-2">
          <div className="w-6 h-6 rounded-full bg-white/10" />
          <div className="w-6 h-6 rounded-full bg-white/10" />
        </div>
      </div>
    </div>
  );
}

/**
 * ProjectCardSkeleton - Skeleton for project cards
 */
export function ProjectCardSkeleton() {
  return (
    <div className="bg-[#12121a]/80 border border-white/10 rounded-2xl p-6 animate-pulse">
      {/* Header */}
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-xl bg-white/10" />
          <div>
            <div className="h-5 w-32 bg-white/10 rounded mb-2" />
            <div className="h-3 w-20 bg-white/5 rounded" />
          </div>
        </div>
        <div className="w-8 h-8 rounded-lg bg-white/5" />
      </div>
      
      {/* Description */}
      <div className="space-y-1.5 mb-4">
        <div className="h-3 w-full bg-white/5 rounded" />
        <div className="h-3 w-4/5 bg-white/5 rounded" />
      </div>
      
      {/* Stats */}
      <div className="flex gap-4 mb-4">
        <div className="h-4 w-20 bg-white/5 rounded" />
        <div className="h-4 w-24 bg-white/5 rounded" />
      </div>
      
      {/* Progress */}
      <div className="h-2 w-full bg-white/5 rounded-full" />
      
      {/* Footer */}
      <div className="flex items-center justify-between mt-4 pt-4 border-t border-white/5">
        <div className="flex -space-x-2">
          <div className="w-8 h-8 rounded-full bg-white/10" />
          <div className="w-8 h-8 rounded-full bg-white/10" />
          <div className="w-8 h-8 rounded-full bg-white/10" />
        </div>
        <div className="h-8 w-24 bg-white/5 rounded-lg" />
      </div>
    </div>
  );
}

/**
 * KanbanColumnSkeleton - Skeleton for kanban columns
 */
export function KanbanColumnSkeleton({ taskCount = 3 }) {
  return (
    <div className="flex-shrink-0 w-80 bg-[#12121a]/50 rounded-2xl border border-white/10">
      {/* Column Header */}
      <div className="p-4 border-b border-white/10">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-3 h-3 rounded-full bg-white/10" />
            <div className="h-5 w-24 bg-white/10 rounded" />
            <div className="h-5 w-8 bg-white/5 rounded-full" />
          </div>
          <div className="w-7 h-7 rounded-lg bg-white/5" />
        </div>
      </div>
      
      {/* Tasks */}
      <div className="p-3 space-y-3">
        {Array.from({ length: taskCount }).map((_, i) => (
          <TaskCardSkeleton key={i} />
        ))}
      </div>
    </div>
  );
}

export default {
  LoadingSpinner,
  LoadingOverlay,
  Skeleton,
  TaskCardSkeleton,
  ProjectCardSkeleton,
  KanbanColumnSkeleton,
};
