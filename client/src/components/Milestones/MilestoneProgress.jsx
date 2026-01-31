import { motion } from 'framer-motion';

/**
 * MilestoneProgress - Compact progress bar for header display
 */
export default function MilestoneProgress({ 
  milestones = [], 
  showLabel = true,
  size = 'md', // sm, md, lg
}) {
  const total = milestones.length;
  const completed = milestones.filter(m => m.completed).length;
  const progress = total > 0 ? Math.round((completed / total) * 100) : 0;

  const sizeClasses = {
    sm: { bar: 'h-1.5', text: 'text-xs' },
    md: { bar: 'h-2', text: 'text-sm' },
    lg: { bar: 'h-3', text: 'text-base' },
  };

  const sizes = sizeClasses[size] || sizeClasses.md;

  // Get progress color
  const getProgressColor = () => {
    if (progress >= 100) return 'from-green-500 to-emerald-400';
    if (progress >= 75) return 'from-cyan-500 to-green-400';
    if (progress >= 50) return 'from-yellow-500 to-cyan-400';
    if (progress >= 25) return 'from-orange-500 to-yellow-400';
    return 'from-purple-500 to-pink-500';
  };

  // Check for overdue milestones
  const overdue = milestones.filter(m => {
    if (m.completed) return false;
    return new Date(m.dueDate) < new Date();
  }).length;

  if (total === 0) return null;

  return (
    <div className="flex items-center gap-3">
      {/* Progress Bar */}
      <div className={`flex-1 min-w-[80px] bg-white/10 rounded-full overflow-hidden ${sizes.bar}`}>
        <motion.div
          initial={{ width: 0 }}
          animate={{ width: `${progress}%` }}
          transition={{ duration: 0.5, ease: 'easeOut' }}
          className={`h-full bg-gradient-to-r ${getProgressColor()} rounded-full`}
        />
      </div>

      {/* Label */}
      {showLabel && (
        <div className={`flex items-center gap-2 ${sizes.text}`}>
          <span className={`font-medium ${
            progress >= 100 
              ? 'text-green-400' 
              : overdue > 0 
              ? 'text-orange-400' 
              : 'text-gray-400'
          }`}>
            {progress}%
          </span>
          
          {overdue > 0 && (
            <span className="flex items-center gap-1 text-red-400">
              <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              {overdue}
            </span>
          )}
        </div>
      )}
    </div>
  );
}
