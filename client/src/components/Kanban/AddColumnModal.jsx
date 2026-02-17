import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import useThemeStore from '../../stores/themeStore';

const PRESET_COLORS = [
  { name: 'Blue', value: '#3b82f6' },
  { name: 'Purple', value: '#8b5cf6' },
  { name: 'Pink', value: '#ec4899' },
  { name: 'Orange', value: '#f59e0b' },
  { name: 'Green', value: '#10b981' },
  { name: 'Red', value: '#ef4444' },
  { name: 'Gray', value: '#6b7280' },
  { name: 'Teal', value: '#14b8a6' },
];

export default function AddColumnModal({ isOpen, onClose, onSubmit }) {
  const isDark = useThemeStore((s) => s.theme) === 'dark';
  const [columnName, setColumnName] = useState('');
  const [selectedColor, setSelectedColor] = useState(PRESET_COLORS[0].value);

  useEffect(() => {
    if (!isOpen) {
      setColumnName('');
      setSelectedColor(PRESET_COLORS[0].value);
    }
  }, [isOpen]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!columnName.trim()) return;
    
    onSubmit({
      name: columnName.trim(),
      color: selectedColor,
    });
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
      />

      {/* Modal */}
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 20 }}
        className={`relative w-full max-w-md rounded-2xl shadow-2xl overflow-hidden ${
          isDark ? 'bg-[#1a1a2e]' : 'bg-white'
        }`}
      >
        {/* Header */}
        <div className={`px-6 py-4 border-b ${isDark ? 'border-white/10' : 'border-gray-200'}`}>
          <div className="flex items-center justify-between">
            <h2 className={`text-xl font-bold ${isDark ? 'text-white' : 'text-gray-900'}`}>
              Add New Column
            </h2>
            <button
              onClick={onClose}
              className={`p-2 rounded-lg transition-colors ${
                isDark
                  ? 'hover:bg-white/10 text-gray-400 hover:text-white'
                  : 'hover:bg-gray-100 text-gray-500 hover:text-gray-700'
              }`}
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
          <p className={`mt-1 text-sm ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>
            Create a workflow stage for your tasks
          </p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {/* Column Name */}
          <div>
            <label className={`block text-sm font-medium mb-2 ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
              Column Name *
            </label>
            <input
              type="text"
              value={columnName}
              onChange={(e) => setColumnName(e.target.value)}
              placeholder="e.g., In Progress, Review, Testing..."
              className={`w-full px-4 py-2.5 rounded-xl border transition-all focus:outline-none focus:ring-2 focus:ring-purple-500 ${
                isDark
                  ? 'bg-white/5 border-white/10 text-white placeholder-gray-500'
                  : 'bg-gray-50 border-gray-200 text-gray-900 placeholder-gray-400'
              }`}
              maxLength={30}
              autoFocus
              required
            />
            <p className={`mt-1.5 text-xs ${isDark ? 'text-gray-500' : 'text-gray-400'}`}>
              Max 30 characters
            </p>
          </div>

          {/* Color Picker */}
          <div>
            <label className={`block text-sm font-medium mb-3 ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
              Column Color
            </label>
            <div className="grid grid-cols-4 gap-3">
              {PRESET_COLORS.map((color) => (
                <button
                  key={color.value}
                  type="button"
                  onClick={() => setSelectedColor(color.value)}
                  className={`relative flex flex-col items-center gap-2 p-3 rounded-xl transition-all ${
                    selectedColor === color.value
                      ? 'ring-2 ring-purple-500 ring-offset-2 ' + (isDark ? 'ring-offset-[#1a1a2e]' : 'ring-offset-white')
                      : isDark ? 'hover:bg-white/5' : 'hover:bg-gray-50'
                  }`}
                >
                  <div
                    className="w-8 h-8 rounded-full shadow-lg"
                    style={{ 
                      backgroundColor: color.value,
                      boxShadow: `0 0 20px ${color.value}50`
                    }}
                  />
                  <span className={`text-xs font-medium ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                    {color.name}
                  </span>
                  {selectedColor === color.value && (
                    <div className="absolute -top-1 -right-1 w-5 h-5 bg-purple-500 rounded-full flex items-center justify-center">
                      <svg className="w-3 h-3 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                      </svg>
                    </div>
                  )}
                </button>
              ))}
            </div>
          </div>

          {/* Preview */}
          <div className={`p-4 rounded-xl border ${isDark ? 'bg-white/5 border-white/10' : 'bg-gray-50 border-gray-200'}`}>
            <p className={`text-xs font-medium mb-2 ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>
              Preview
            </p>
            <div className="flex items-center gap-3">
              <div
                className="w-3 h-3 rounded-full shadow-lg"
                style={{ 
                  backgroundColor: selectedColor,
                  boxShadow: `0 0 10px ${selectedColor}50`
                }}
              />
              <span className={`font-semibold ${isDark ? 'text-white' : 'text-gray-900'}`}>
                {columnName || 'Column Name'}
              </span>
            </div>
          </div>

          {/* Actions */}
          <div className="flex gap-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              className={`flex-1 px-4 py-2.5 rounded-xl font-medium transition-all ${
                isDark
                  ? 'bg-white/5 text-gray-300 hover:bg-white/10'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={!columnName.trim()}
              className="flex-1 px-4 py-2.5 rounded-xl font-medium text-white bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-lg shadow-purple-500/30"
            >
              Create Column
            </button>
          </div>
        </form>
      </motion.div>
    </div>
  );
}
