import { motion, AnimatePresence } from 'framer-motion';
import useThemeStore from '../../stores/themeStore';

export default function ThemeToggle({ className = '' }) {
  const theme = useThemeStore((s) => s.theme);
  const toggleTheme = useThemeStore((s) => s.toggleTheme);
  const isDark = theme === 'dark';

  return (
    <motion.button
      onClick={toggleTheme}
      className={`relative w-16 h-8 rounded-full p-1 transition-colors duration-500 focus:outline-none focus:ring-2 focus:ring-purple-500/50 ${
        isDark 
          ? 'bg-gradient-to-r from-indigo-900 to-purple-900 border border-purple-500/30' 
          : 'bg-gradient-to-r from-amber-200 to-orange-300 border border-amber-400/50'
      } ${className}`}
      whileTap={{ scale: 0.95 }}
      aria-label={`Switch to ${isDark ? 'light' : 'dark'} mode`}
    >
      {/* Stars (dark mode) */}
      <AnimatePresence>
        {isDark && (
          <>
            <motion.div
              initial={{ opacity: 0, scale: 0 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0 }}
              className="absolute top-1.5 left-2 w-1 h-1 bg-white rounded-full"
            />
            <motion.div
              initial={{ opacity: 0, scale: 0 }}
              animate={{ opacity: 0.7, scale: 1 }}
              exit={{ opacity: 0, scale: 0 }}
              transition={{ delay: 0.1 }}
              className="absolute top-3 left-4 w-0.5 h-0.5 bg-white rounded-full"
            />
            <motion.div
              initial={{ opacity: 0, scale: 0 }}
              animate={{ opacity: 0.5, scale: 1 }}
              exit={{ opacity: 0, scale: 0 }}
              transition={{ delay: 0.2 }}
              className="absolute bottom-2 left-3 w-0.5 h-0.5 bg-white rounded-full"
            />
          </>
        )}
      </AnimatePresence>

      {/* Clouds (light mode) */}
      <AnimatePresence>
        {!isDark && (
          <>
            <motion.div
              initial={{ opacity: 0, x: 5 }}
              animate={{ opacity: 0.6, x: 0 }}
              exit={{ opacity: 0, x: 5 }}
              className="absolute top-1 right-3 w-3 h-1.5 bg-white rounded-full"
            />
            <motion.div
              initial={{ opacity: 0, x: 5 }}
              animate={{ opacity: 0.4, x: 0 }}
              exit={{ opacity: 0, x: 5 }}
              transition={{ delay: 0.1 }}
              className="absolute bottom-1.5 right-5 w-2 h-1 bg-white rounded-full"
            />
          </>
        )}
      </AnimatePresence>

      {/* Toggle Circle (Sun/Moon) */}
      <motion.div
        layout
        transition={{ type: 'spring', stiffness: 500, damping: 30 }}
        className={`w-6 h-6 rounded-full shadow-lg flex items-center justify-center ${
          isDark 
            ? 'bg-gray-200 ml-auto' 
            : 'bg-yellow-400 ml-0'
        }`}
      >
        <AnimatePresence mode="wait">
          {isDark ? (
            <motion.svg
              key="moon"
              initial={{ rotate: -90, opacity: 0 }}
              animate={{ rotate: 0, opacity: 1 }}
              exit={{ rotate: 90, opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="w-3.5 h-3.5 text-indigo-900"
              fill="currentColor"
              viewBox="0 0 24 24"
            >
              <path d="M21.752 15.002A9.718 9.718 0 0118 15.75c-5.385 0-9.75-4.365-9.75-9.75 0-1.33.266-2.597.748-3.752A9.753 9.753 0 003 11.25C3 16.635 7.365 21 12.75 21a9.753 9.753 0 009.002-5.998z" />
            </motion.svg>
          ) : (
            <motion.svg
              key="sun"
              initial={{ rotate: 90, opacity: 0 }}
              animate={{ rotate: 0, opacity: 1 }}
              exit={{ rotate: -90, opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="w-3.5 h-3.5 text-amber-700"
              fill="currentColor"
              viewBox="0 0 24 24"
            >
              <path d="M12 2.25a.75.75 0 01.75.75v2.25a.75.75 0 01-1.5 0V3a.75.75 0 01.75-.75zM7.5 12a4.5 4.5 0 119 0 4.5 4.5 0 01-9 0zM18.894 6.166a.75.75 0 00-1.06-1.06l-1.591 1.59a.75.75 0 101.06 1.061l1.591-1.59zM21.75 12a.75.75 0 01-.75.75h-2.25a.75.75 0 010-1.5H21a.75.75 0 01.75.75zM17.834 18.894a.75.75 0 001.06-1.06l-1.59-1.591a.75.75 0 10-1.061 1.06l1.59 1.591zM12 18a.75.75 0 01.75.75V21a.75.75 0 01-1.5 0v-2.25A.75.75 0 0112 18zM7.758 17.303a.75.75 0 00-1.061-1.06l-1.591 1.59a.75.75 0 001.06 1.061l1.591-1.59zM6 12a.75.75 0 01-.75.75H3a.75.75 0 010-1.5h2.25A.75.75 0 016 12zM6.697 7.757a.75.75 0 001.06-1.06l-1.59-1.591a.75.75 0 00-1.061 1.06l1.59 1.591z" />
            </motion.svg>
          )}
        </AnimatePresence>
      </motion.div>
    </motion.button>
  );
}
