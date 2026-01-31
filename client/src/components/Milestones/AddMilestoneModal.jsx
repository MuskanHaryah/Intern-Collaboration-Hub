import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

/**
 * AddMilestoneModal - Modal for creating/editing milestones
 */
export default function AddMilestoneModal({ 
  isOpen, 
  onClose, 
  onSubmit, 
  milestone = null, // If provided, we're editing
  projectId,
}) {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    dueDate: '',
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const isEditing = !!milestone;

  // Initialize form with milestone data when editing
  useEffect(() => {
    if (milestone) {
      setFormData({
        title: milestone.title || '',
        description: milestone.description || '',
        dueDate: milestone.dueDate 
          ? new Date(milestone.dueDate).toISOString().split('T')[0] 
          : '',
      });
    } else {
      setFormData({
        title: '',
        description: '',
        dueDate: '',
      });
    }
  }, [milestone, isOpen]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.title.trim() || !formData.dueDate) return;

    setIsSubmitting(true);
    try {
      await onSubmit({
        ...formData,
        project: projectId,
        ...(milestone && { _id: milestone._id || milestone.id }),
      });
      onClose();
    } catch (error) {
      console.error('Failed to save milestone:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  // Quick date presets
  const setQuickDate = (days) => {
    const date = new Date();
    date.setDate(date.getDate() + days);
    setFormData({ ...formData, dueDate: date.toISOString().split('T')[0] });
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4"
        onClick={onClose}
      >
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          onClick={(e) => e.stopPropagation()}
          className="w-full max-w-md bg-[#12121a] border border-white/10 rounded-2xl shadow-2xl overflow-hidden"
        >
          {/* Header */}
          <div className="p-6 border-b border-white/10 bg-gradient-to-r from-purple-500/10 to-pink-500/10">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center">
                  <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
                  </svg>
                </div>
                <div>
                  <h2 className="text-lg font-bold text-white">
                    {isEditing ? 'Edit Milestone' : 'New Milestone'}
                  </h2>
                  <p className="text-sm text-gray-500">
                    {isEditing ? 'Update milestone details' : 'Track your project progress'}
                  </p>
                </div>
              </div>
              <button
                onClick={onClose}
                className="p-2 text-gray-400 hover:text-white hover:bg-white/10 rounded-lg transition-all"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="p-6 space-y-5">
            {/* Title */}
            <div>
              <label className="block text-sm font-medium text-gray-400 mb-2">
                Milestone Title <span className="text-red-400">*</span>
              </label>
              <input
                type="text"
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                placeholder="e.g., Beta Release, Phase 1 Complete"
                className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:border-purple-500 focus:ring-1 focus:ring-purple-500/50 transition-all"
                autoFocus
              />
            </div>

            {/* Description */}
            <div>
              <label className="block text-sm font-medium text-gray-400 mb-2">
                Description
              </label>
              <textarea
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                placeholder="What does this milestone represent?"
                rows={3}
                className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:border-purple-500 focus:ring-1 focus:ring-purple-500/50 transition-all resize-none"
              />
            </div>

            {/* Due Date */}
            <div>
              <label className="block text-sm font-medium text-gray-400 mb-2">
                Due Date <span className="text-red-400">*</span>
              </label>
              <input
                type="date"
                value={formData.dueDate}
                onChange={(e) => setFormData({ ...formData, dueDate: e.target.value })}
                className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white focus:outline-none focus:border-purple-500 focus:ring-1 focus:ring-purple-500/50 transition-all [color-scheme:dark]"
              />
              
              {/* Quick Date Buttons */}
              <div className="flex flex-wrap gap-2 mt-2">
                <button
                  type="button"
                  onClick={() => setQuickDate(7)}
                  className="px-3 py-1 text-xs bg-white/5 text-gray-400 rounded-lg hover:bg-white/10 hover:text-white transition-all"
                >
                  1 week
                </button>
                <button
                  type="button"
                  onClick={() => setQuickDate(14)}
                  className="px-3 py-1 text-xs bg-white/5 text-gray-400 rounded-lg hover:bg-white/10 hover:text-white transition-all"
                >
                  2 weeks
                </button>
                <button
                  type="button"
                  onClick={() => setQuickDate(30)}
                  className="px-3 py-1 text-xs bg-white/5 text-gray-400 rounded-lg hover:bg-white/10 hover:text-white transition-all"
                >
                  1 month
                </button>
                <button
                  type="button"
                  onClick={() => setQuickDate(90)}
                  className="px-3 py-1 text-xs bg-white/5 text-gray-400 rounded-lg hover:bg-white/10 hover:text-white transition-all"
                >
                  3 months
                </button>
              </div>
            </div>

            {/* Actions */}
            <div className="flex gap-3 pt-4">
              <button
                type="button"
                onClick={onClose}
                className="flex-1 px-4 py-3 bg-white/5 text-gray-400 rounded-xl font-medium hover:bg-white/10 hover:text-white transition-all"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={isSubmitting || !formData.title.trim() || !formData.dueDate}
                className="flex-1 px-4 py-3 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-xl font-medium hover:shadow-lg hover:shadow-purple-500/25 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                {isSubmitting ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    Saving...
                  </>
                ) : (
                  <>
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    {isEditing ? 'Save Changes' : 'Create Milestone'}
                  </>
                )}
              </button>
            </div>
          </form>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}
