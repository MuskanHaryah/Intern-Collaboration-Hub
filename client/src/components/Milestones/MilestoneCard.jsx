import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import useThemeStore from '../../stores/themeStore';

/**
 * MilestoneCard - Individual milestone display with progress
 */
export default function MilestoneCard({ 
  milestone, 
  onToggleComplete, 
  onEdit, 
  onDelete,
  tasksCompleted = 0,
  totalTasks = 0,
}) {
  const isDark = useThemeStore((s) => s.theme) === 'dark';
  const [showMenu, setShowMenu] = useState(false);
  const [isHovered, setIsHovered] = useState(false);

  const getStatusInfo = () => {
    if (milestone.completed) {
      return { 
        label: 'Completed', 
        color: 'text-green-400', 
        bg: 'bg-green-500/20 border-green-500/30',
        icon: '✓'
      };
    }
    
    const dueDate = new Date(milestone.dueDate);
    const now = new Date();
    const diff = dueDate - now;
    const days = Math.ceil(diff / (1000 * 60 * 60 * 24));

    if (days < 0) {
      return { 
        label: 'Overdue', 
        color: 'text-red-400', 
        bg: 'bg-red-500/20 border-red-500/30',
        icon: '!'
      };
    }
    if (days === 0) {
      return { 
        label: 'Due Today', 
        color: 'text-orange-400', 
        bg: 'bg-orange-500/20 border-orange-500/30',
        icon: '⏰'
      };
    }
    if (days <= 3) {
      return { 
        label: `${days} days left`, 
        color: 'text-yellow-400', 
        bg: 'bg-yellow-500/20 border-yellow-500/30',
        icon: '⚡'
      };
    }
    if (days <= 7) {
      return { 
        label: `${days} days left`, 
        color: 'text-cyan-400', 
        bg: 'bg-cyan-500/20 border-cyan-500/30',
        icon: '📅'
      };
    }
    return { 
      label: `${days} days left`, 
      color: 'text-gray-400', 
      bg: 'bg-white/5 border-white/10',
      icon: '📅'
    };
  };

  const statusInfo = getStatusInfo();
  const progress = totalTasks > 0 ? Math.round((tasksCompleted / totalTasks) * 100) : 0;

  const formatDate = (dateString) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      month: 'short', 
      day: 'numeric',
      year: date.getFullYear() !== new Date().getFullYear() ? 'numeric' : undefined
    });
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      className={`relative p-4 rounded-xl border transition-all ${
        milestone.completed
          ? 'bg-green-500/5 border-green-500/20'
          : isDark ? 'bg-[#1a1a2e] border-white/10 hover:border-purple-500/30' : 'bg-white border-gray-200 hover:border-purple-300'
      }`}
    >
      {/* Glow effect on hover */}
      {isHovered && !milestone.completed && (
        <div className="absolute inset-0 rounded-xl bg-gradient-to-r from-purple-500/5 to-pink-500/5 pointer-events-none" />
      )}

      <div className="relative flex items-start gap-4">
        {/* Checkbox */}
        <button
          onClick={() => onToggleComplete?.(milestone._id || milestone.id, !milestone.completed)}
          className={`flex-shrink-0 w-6 h-6 rounded-lg border-2 transition-all flex items-center justify-center ${
            milestone.completed
              ? 'bg-green-500 border-green-500 text-white'
              : 'border-white/20 hover:border-purple-500 text-transparent hover:text-purple-500/50'
          }`}
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
          </svg>
        </button>

        {/* Content */}
        <div className="flex-1 min-w-0">
          {/* Title & Status */}
          <div className="flex items-center gap-3 mb-2">
            <h4 className={`font-medium truncate ${
              milestone.completed ? 'text-gray-500 line-through' : isDark ? 'text-white' : 'text-gray-900'
            }`}>
              {milestone.title}
            </h4>
            <span className={`flex-shrink-0 px-2 py-0.5 rounded-full text-xs font-medium border ${statusInfo.bg} ${statusInfo.color}`}>
              {statusInfo.icon} {statusInfo.label}
            </span>
          </div>

          {/* Description */}
          {milestone.description && (
            <p className={`text-sm mb-3 line-clamp-2 ${
              milestone.completed ? 'text-gray-600' : 'text-gray-500'
            }`}>
              {milestone.description}
            </p>
          )}

          {/* Progress Bar */}
          {totalTasks > 0 && (
            <div className="mb-3">
              <div className="flex items-center justify-between text-xs mb-1">
                <span className="text-gray-500">Progress</span>
                <span className={milestone.completed ? 'text-green-400' : 'text-gray-400'}>
                  {tasksCompleted}/{totalTasks} tasks
                </span>
              </div>
              <div className={`h-1.5 rounded-full overflow-hidden ${isDark ? 'bg-white/10' : 'bg-gray-200'}`}>
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${progress}%` }}
                  transition={{ duration: 0.5, ease: 'easeOut' }}
                  className={`h-full rounded-full ${
                    milestone.completed
                      ? 'bg-green-500'
                      : progress >= 75
                      ? 'bg-gradient-to-r from-green-500 to-emerald-400'
                      : progress >= 50
                      ? 'bg-gradient-to-r from-yellow-500 to-amber-400'
                      : 'bg-gradient-to-r from-purple-500 to-pink-500'
                  }`}
                />
              </div>
            </div>
          )}

          {/* Footer */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4 text-xs text-gray-500">
              {/* Due Date */}
              <span className="flex items-center gap-1">
                <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
                {formatDate(milestone.dueDate)}
              </span>

              {/* Progress percentage */}
              {totalTasks > 0 && (
                <span className={`font-medium ${
                  milestone.completed 
                    ? 'text-green-400' 
                    : progress >= 75 
                    ? 'text-green-400' 
                    : 'text-purple-400'
                }`}>
                  {progress}%
                </span>
              )}
            </div>

            {/* Actions */}
            <div className="relative">
              <button
                onClick={() => setShowMenu(!showMenu)}
                className={`p-1.5 rounded-lg transition-all ${
                  isHovered ? 'opacity-100' : 'opacity-0'
                } text-gray-400 hover:text-white hover:bg-white/10`}
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 5v.01M12 12v.01M12 19v.01M12 6a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2z" />
                </svg>
              </button>

              {/* Dropdown Menu */}
              <AnimatePresence>
                {showMenu && (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.95, y: -10 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.95, y: -10 }}
                    className={`absolute right-0 bottom-full mb-1 w-36 rounded-xl shadow-xl z-20 overflow-hidden ${isDark ? 'bg-[#1a1a2e] border border-white/10' : 'bg-white border border-gray-200'}`}
                  >
                    <button
                      onClick={() => {
                        onEdit?.(milestone);
                        setShowMenu(false);
                      }}
                      className={`w-full flex items-center gap-2 px-3 py-2 text-sm transition-all ${isDark ? 'text-gray-400 hover:text-white hover:bg-white/5' : 'text-gray-500 hover:text-gray-900 hover:bg-gray-50'}`}
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                      </svg>
                      Edit
                    </button>
                    <button
                      onClick={() => {
                        onDelete?.(milestone._id || milestone.id);
                        setShowMenu(false);
                      }}
                      className="w-full flex items-center gap-2 px-3 py-2 text-sm text-red-400 hover:text-red-300 hover:bg-red-500/10 transition-all"
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                      </svg>
                      Delete
                    </button>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
