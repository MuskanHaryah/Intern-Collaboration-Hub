import { motion, AnimatePresence } from 'framer-motion';
import { useSocket } from '../../socket';

/**
 * Online Users indicator component
 * Shows avatars of users currently viewing the project
 */
export default function OnlineUsers({ maxDisplay = 5, showCount = true }) {
  const { onlineUsers, isConnected } = useSocket();

  if (!isConnected) {
    return (
      <div className="flex items-center gap-2">
        <div className="w-2 h-2 rounded-full bg-gray-500 animate-pulse" />
        <span className="text-xs text-gray-500">Connecting...</span>
      </div>
    );
  }

  const displayUsers = onlineUsers.slice(0, maxDisplay);
  const remainingCount = onlineUsers.length - maxDisplay;

  return (
    <div className="flex items-center gap-3">
      {/* Connection status */}
      <div className="flex items-center gap-1.5">
        <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
      </div>

      {/* User avatars */}
      <div className="flex -space-x-2">
        <AnimatePresence mode="popLayout">
          {displayUsers.map((user) => (
            <motion.div
              key={user.id}
              initial={{ scale: 0, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0, opacity: 0 }}
              transition={{ type: 'spring', stiffness: 500, damping: 30 }}
              className="relative group"
            >
              <div 
                className="w-8 h-8 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 border-2 border-[#0a0a0f] flex items-center justify-center text-white text-xs font-medium cursor-pointer hover:scale-110 transition-transform"
                title={user.name}
              >
                {user.avatar ? (
                  <img 
                    src={user.avatar} 
                    alt={user.name}
                    className="w-full h-full rounded-full object-cover"
                  />
                ) : (
                  user.name?.charAt(0).toUpperCase() || 'U'
                )}
              </div>
              
              {/* Online indicator */}
              <div className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-green-500 border-2 border-[#0a0a0f] rounded-full" />
              
              {/* Tooltip */}
              <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-2 py-1 bg-gray-900 text-white text-xs rounded whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
                {user.name}
                <div className="absolute top-full left-1/2 -translate-x-1/2 border-4 border-transparent border-t-gray-900" />
              </div>
            </motion.div>
          ))}
        </AnimatePresence>

        {/* Remaining users count */}
        {remainingCount > 0 && (
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            className="w-8 h-8 rounded-full bg-white/10 border-2 border-[#0a0a0f] flex items-center justify-center text-gray-400 text-xs font-medium"
          >
            +{remainingCount}
          </motion.div>
        )}
      </div>

      {/* User count */}
      {showCount && onlineUsers.length > 0 && (
        <span className="text-xs text-gray-500">
          {onlineUsers.length} online
        </span>
      )}
    </div>
  );
}
