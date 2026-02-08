import { motion } from 'framer-motion';
import useToastStore from '../../stores/toastStore'; 

/**
 * NotificationSettings - Component to manage toast notification preferences
 */
export default function NotificationSettings({ onClose }) {
  const {
    preferences,
    toggleSound,
    toggleDesktopNotifications,
    setPosition,
    updatePreferences,
  } = useToastStore();

  const positions = [
    { value: 'top-left', label: 'Top Left' },
    { value: 'top-right', label: 'Top Right' },
    { value: 'top-center', label: 'Top Center' },
    { value: 'bottom-left', label: 'Bottom Left' },
    { value: 'bottom-right', label: 'Bottom Right' },
    { value: 'bottom-center', label: 'Bottom Center' },
  ];

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-[10000] flex items-center justify-center bg-black/50 backdrop-blur-sm"
      onClick={onClose}
    >
      <motion.div
        initial={{ scale: 0.9, y: 20 }}
        animate={{ scale: 1, y: 0 }}
        exit={{ scale: 0.9, y: 20 }}
        onClick={(e) => e.stopPropagation()}
        className="bg-[#12121a] border border-white/10 rounded-2xl p-6 w-full max-w-md shadow-2xl"
      >
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-bold text-white">Notification Settings</h2>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-lg bg-white/5 hover:bg-white/10 flex items-center justify-center text-gray-400 hover:text-white transition-all"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Settings */}
        <div className="space-y-6">
          {/* Sound */}
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-sm font-medium text-white mb-1">Sound Notifications</h3>
              <p className="text-xs text-gray-500">Play a sound when notifications appear</p>
            </div>
            <button
              onClick={toggleSound}
              className={`relative w-12 h-6 rounded-full transition-colors ${
                preferences.soundEnabled ? 'bg-purple-500' : 'bg-white/10'
              }`}
            >
              <div
                className={`absolute top-1 left-1 w-4 h-4 rounded-full bg-white transition-transform ${
                  preferences.soundEnabled ? 'translate-x-6' : ''
                }`}
              />
            </button>
          </div>

          {/* Desktop Notifications */}
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-sm font-medium text-white mb-1">Desktop Notifications</h3>
              <p className="text-xs text-gray-500">Show browser notifications</p>
            </div>
            <button
              onClick={toggleDesktopNotifications}
              className={`relative w-12 h-6 rounded-full transition-colors ${
                preferences.desktopNotifications ? 'bg-purple-500' : 'bg-white/10'
              }`}
            >
              <div
                className={`absolute top-1 left-1 w-4 h-4 rounded-full bg-white transition-transform ${
                  preferences.desktopNotifications ? 'translate-x-6' : ''
                }`}
              />
            </button>
          </div>

          {/* Position */}
          <div>
            <h3 className="text-sm font-medium text-white mb-3">Notification Position</h3>
            <div className="grid grid-cols-2 gap-2">
              {positions.map((pos) => (
                <button
                  key={pos.value}
                  onClick={() => setPosition(pos.value)}
                  className={`px-3 py-2 rounded-lg text-xs font-medium transition-all ${
                    preferences.position === pos.value
                      ? 'bg-purple-500 text-white'
                      : 'bg-white/5 text-gray-400 hover:bg-white/10 hover:text-white'
                  }`}
                >
                  {pos.label}
                </button>
              ))}
            </div>
          </div>

          {/* Max Toasts */}
          <div>
            <h3 className="text-sm font-medium text-white mb-3">
              Maximum Toasts: {preferences.maxToasts}
            </h3>
            <input
              type="range"
              min="1"
              max="10"
              value={preferences.maxToasts}
              onChange={(e) =>
                updatePreferences({ maxToasts: parseInt(e.target.value) })
              }
              className="w-full h-2 bg-white/10 rounded-lg appearance-none cursor-pointer slider"
              style={{
                background: `linear-gradient(to right, rgb(168, 85, 247) 0%, rgb(168, 85, 247) ${
                  (preferences.maxToasts / 10) * 100
                }%, rgba(255,255,255,0.1) ${(preferences.maxToasts / 10) * 100}%, rgba(255,255,255,0.1) 100%)`,
              }}
            />
            <div className="flex justify-between text-xs text-gray-500 mt-1">
              <span>1</span>
              <span>10</span>
            </div>
          </div>
        </div>

        {/* Test Button */}
        <button
          onClick={() => {
            useToastStore.getState().success('Test notification!', {
              actionLabel: 'Undo',
              onAction: () => console.log('Undo clicked'),
            });
          }}
          className="mt-6 w-full py-2.5 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-xl font-medium hover:shadow-lg hover:shadow-purple-500/25 transition-all"
        >
          Test Notification
        </button>
      </motion.div>
    </motion.div>
  );
}
