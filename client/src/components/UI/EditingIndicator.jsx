import { motion } from 'framer-motion';

/**
 * Editing indicator component
 * Shows when another user is editing a task
 */
export default function EditingIndicator({ editors = [], size = 'sm' }) {
  if (editors.length === 0) return null;

  const sizeClasses = {
    sm: 'text-xs px-2 py-1',
    md: 'text-sm px-3 py-1.5',
  };

  const dotSizeClasses = {
    sm: 'w-1.5 h-1.5',
    md: 'w-2 h-2',
  };

  const typingEditors = editors.filter((e) => e.isTyping);
  const activeEditors = editors.filter((e) => !e.isTyping);

  return (
    <motion.div
      initial={{ opacity: 0, y: -5 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -5 }}
      className={`flex items-center gap-2 bg-yellow-500/10 border border-yellow-500/30 rounded-lg ${sizeClasses[size]}`}
    >
      {/* Animated dots */}
      <div className="flex items-center gap-0.5">
        {[0, 1, 2].map((i) => (
          <motion.div
            key={i}
            className={`${dotSizeClasses[size]} rounded-full bg-yellow-400`}
            animate={{
              scale: [1, 1.2, 1],
              opacity: [0.5, 1, 0.5],
            }}
            transition={{
              duration: 1,
              repeat: Infinity,
              delay: i * 0.2,
            }}
          />
        ))}
      </div>

      {/* Editor names */}
      <span className="text-yellow-400">
        {typingEditors.length > 0 ? (
          <>
            {typingEditors.map((e) => e.name).join(', ')} typing...
          </>
        ) : (
          <>
            {activeEditors.map((e) => e.name).join(', ')} editing
          </>
        )}
      </span>
    </motion.div>
  );
}
