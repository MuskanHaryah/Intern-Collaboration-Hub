import { motion, AnimatePresence } from 'framer-motion';
import useThemeStore from '../../stores/themeStore';

export default function ConfirmModal({ 
  isOpen, 
  onClose, 
  onConfirm, 
  title = 'Confirm Action',
  message = 'Are you sure you want to proceed?',
  confirmText = 'Confirm',
  cancelText = 'Cancel',
  type = 'danger' // 'danger' or 'warning'
}) {
  const theme = useThemeStore((s) => s.theme);
  const isDark = theme === 'dark';

  const handleConfirm = () => {
    onConfirm();
    onClose();
  };

  const getButtonColors = () => {
    if (type === 'danger') {
      return 'bg-red-500 hover:bg-red-600 text-white';
    }
    return 'bg-yellow-500 hover:bg-yellow-600 text-white';
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
          >
            {/* Modal */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              onClick={(e) => e.stopPropagation()}
              className={`w-full max-w-md rounded-2xl p-6 shadow-2xl ${
                isDark ? 'bg-[#1a1a2e] border border-white/10' : 'bg-white border border-gray-200'
              }`}
            >
              {/* Icon */}
              <div className={`w-12 h-12 rounded-full flex items-center justify-center mb-4 ${
                type === 'danger' 
                  ? 'bg-red-500/10' 
                  : 'bg-yellow-500/10'
              }`}>
                <svg 
                  className={`w-6 h-6 ${type === 'danger' ? 'text-red-500' : 'text-yellow-500'}`} 
                  fill="none" 
                  stroke="currentColor" 
                  viewBox="0 0 24 24"
                >
                  <path 
                    strokeLinecap="round" 
                    strokeLinejoin="round" 
                    strokeWidth={2} 
                    d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" 
                  />
                </svg>
              </div>

              {/* Title */}
              <h3 className={`text-xl font-bold mb-2 ${isDark ? 'text-white' : 'text-gray-900'}`}>
                {title}
              </h3>

              {/* Message */}
              <p className={`mb-6 ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                {message}
              </p>

              {/* Action Buttons */}
              <div className="flex gap-3">
                <button
                  onClick={onClose}
                  className={`flex-1 px-4 py-2.5 rounded-xl font-medium transition-colors ${
                    isDark 
                      ? 'bg-white/5 hover:bg-white/10 text-white border border-white/10' 
                      : 'bg-gray-100 hover:bg-gray-200 text-gray-700 border border-gray-200'
                  }`}
                >
                  {cancelText}
                </button>
                <button
                  onClick={handleConfirm}
                  className={`flex-1 px-4 py-2.5 rounded-xl font-medium transition-colors ${getButtonColors()}`}
                >
                  {confirmText}
                </button>
              </div>
            </motion.div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
