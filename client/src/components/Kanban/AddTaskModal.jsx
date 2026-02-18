import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import useThemeStore from '../../stores/themeStore';
import useAuthStore from '../../stores/authStore';

export default function AddTaskModal({ isOpen, onClose, onSubmit, columnId, projectMembers = [] }) {
  const isDark = useThemeStore((s) => s.theme) === 'dark';
  const currentUser = useAuthStore((s) => s.user);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    priority: 'medium',
    dueDate: '',
    assignees: [],
    labels: [],
    checklist: [],
  });
  const [newChecklistItem, setNewChecklistItem] = useState('');
  const [newLabel, setNewLabel] = useState({ name: '', color: '#b026ff' });
  const [showLabelForm, setShowLabelForm] = useState(false);

  const labelColors = [
    '#b026ff', '#ff2d95', '#00d4ff', '#00ff88', '#ffaa00', '#ff5555',
  ];

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.title.trim()) return;

    onSubmit({
      ...formData,
      column: columnId,
    });

    // Reset form
    setFormData({
      title: '',
      description: '',
      priority: 'medium',
      dueDate: '',
      assignees: [],
      labels: [],
      checklist: [],
    });
    onClose();
  };

  const addChecklistItem = () => {
    if (!newChecklistItem.trim()) return;
    setFormData({
      ...formData,
      checklist: [
        ...formData.checklist,
        { text: newChecklistItem, isCompleted: false },
      ],
    });
    setNewChecklistItem('');
  };

  const removeChecklistItem = (index) => {
    setFormData({
      ...formData,
      checklist: formData.checklist.filter((_, i) => i !== index),
    });
  };

  const addLabel = () => {
    if (!newLabel.name.trim()) return;
    setFormData({
      ...formData,
      labels: [...formData.labels, { ...newLabel }],
    });
    setNewLabel({ name: '', color: '#b026ff' });
    setShowLabelForm(false);
  };

  const removeLabel = (index) => {
    setFormData({
      ...formData,
      labels: formData.labels.filter((_, i) => i !== index),
    });
  };

  const toggleAssignee = (memberId) => {
    setFormData({
      ...formData,
      assignees: formData.assignees.includes(memberId)
        ? formData.assignees.filter((id) => id !== memberId)
        : [...formData.assignees, memberId],
    });
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4"
          onClick={onClose}
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            onClick={(e) => e.stopPropagation()}
            className={`w-full max-w-2xl rounded-2xl shadow-2xl overflow-hidden max-h-[90vh] flex flex-col ${
              isDark ? 'bg-[#12121a] border border-white/10' : 'bg-white border border-gray-200'
            }`}
          >
            {/* Header */}
            <div className={`p-6 border-b ${isDark ? 'border-white/10' : 'border-gray-200'}`}>
              <div className="flex items-center justify-between">
                <h2 className={`text-2xl font-bold ${isDark ? 'text-white' : 'text-gray-900'}`}>Create New Task</h2>
                <button
                  onClick={onClose}
                  className={`p-2 rounded-lg transition-all ${isDark ? 'text-gray-400 hover:text-white hover:bg-white/10' : 'text-gray-400 hover:text-gray-600 hover:bg-gray-100'}`}
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-6 space-y-6">
              {/* Title */}
              <div>
                <label className={`block text-sm font-medium mb-2 ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                  Task Title <span className="text-red-400">*</span>
                </label>
                <input
                  type="text"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  placeholder="Enter task title..."
                  className={`w-full px-4 py-3 border rounded-xl focus:outline-none focus:border-purple-500 focus:ring-1 focus:ring-purple-500 transition-all ${
                    isDark ? 'bg-white/5 border-white/10 text-white placeholder-gray-500' : 'bg-gray-50 border-gray-200 text-gray-900 placeholder-gray-400'
                  }`}
                  required
                />
              </div>

              {/* Description */}
              <div>
                <label className={`block text-sm font-medium mb-2 ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                  Description
                </label>
                <textarea
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  placeholder="Describe the task..."
                  rows={3}
                  className={`w-full px-4 py-3 border rounded-xl focus:outline-none focus:border-purple-500 focus:ring-1 focus:ring-purple-500 transition-all resize-none ${
                    isDark ? 'bg-white/5 border-white/10 text-white placeholder-gray-500' : 'bg-gray-50 border-gray-200 text-gray-900 placeholder-gray-400'
                  }`}
                />
              </div>

              {/* Assignees — moved up for visibility */}
              <div className={`rounded-xl p-4 border ${
                isDark ? 'bg-purple-500/5 border-purple-500/20' : 'bg-purple-50/50 border-purple-200'
              }`}>
                <label className={`flex items-center gap-2 text-sm font-medium mb-3 ${isDark ? 'text-purple-300' : 'text-purple-700'}`}>
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                  Assign To
                  {formData.assignees.length > 0 && (
                    <span className="ml-auto text-xs px-2 py-0.5 rounded-full bg-purple-500/20 text-purple-400">
                      {formData.assignees.length} selected
                    </span>
                  )}
                </label>
                {projectMembers.length > 0 ? (
                  <div className="flex flex-wrap gap-2">
                    {/* Assign to Me button */}
                    {currentUser && !projectMembers.some(m => m.id === currentUser.id || m.id === currentUser._id) && (
                      <button
                        type="button"
                        onClick={() => toggleAssignee(currentUser.id || currentUser._id)}
                        className={`flex items-center gap-2 px-3 py-2 rounded-lg transition-all border-dashed ${
                          formData.assignees.includes(currentUser.id || currentUser._id)
                            ? 'bg-purple-500/20 border border-purple-500/50 text-purple-400'
                            : isDark
                              ? 'bg-white/5 border border-white/10 text-gray-400 hover:bg-white/10'
                              : 'bg-white border border-gray-200 text-gray-500 hover:bg-gray-50'
                        }`}
                      >
                        <div className="w-6 h-6 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center text-white text-xs font-medium">
                          {currentUser.name?.charAt(0) || 'U'}
                        </div>
                        <span className="text-sm">{currentUser.name} (Me)</span>
                        {formData.assignees.includes(currentUser.id || currentUser._id) && (
                          <svg className="w-4 h-4 text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                          </svg>
                        )}
                      </button>
                    )}
                    {projectMembers.map((member) => {
                      const isMe = currentUser && (member.id === currentUser.id || member.id === currentUser._id);
                      return (
                      <button
                        key={member.id}
                        type="button"
                        onClick={() => toggleAssignee(member.id)}
                        className={`flex items-center gap-2 px-3 py-2 rounded-lg transition-all ${
                          formData.assignees.includes(member.id)
                            ? 'bg-purple-500/20 border border-purple-500/50 text-purple-400'
                            : isDark
                              ? 'bg-white/5 border border-white/10 text-gray-400 hover:bg-white/10'
                              : 'bg-white border border-gray-200 text-gray-500 hover:bg-gray-50'
                        }`}
                      >
                        <div className="w-6 h-6 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center text-white text-xs font-medium">
                          {member.name?.charAt(0) || 'U'}
                        </div>
                        <span className="text-sm">{member.name}{isMe ? ' (Me)' : ''}</span>
                        {formData.assignees.includes(member.id) && (
                          <svg className="w-4 h-4 text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                          </svg>
                        )}
                      </button>
                    );
                    })}
                  </div>
                ) : (
                  <div>
                    {currentUser && (
                      <div className="flex flex-wrap gap-2 mb-2">
                        <button
                          type="button"
                          onClick={() => toggleAssignee(currentUser.id || currentUser._id)}
                          className={`flex items-center gap-2 px-3 py-2 rounded-lg transition-all ${
                            formData.assignees.includes(currentUser.id || currentUser._id)
                              ? 'bg-purple-500/20 border border-purple-500/50 text-purple-400'
                              : isDark
                                ? 'bg-white/5 border border-white/10 text-gray-400 hover:bg-white/10'
                                : 'bg-white border border-gray-200 text-gray-500 hover:bg-gray-50'
                          }`}
                        >
                          <div className="w-6 h-6 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center text-white text-xs font-medium">
                            {currentUser.name?.charAt(0) || 'U'}
                          </div>
                          <span className="text-sm">{currentUser.name} (Me)</span>
                          {formData.assignees.includes(currentUser.id || currentUser._id) && (
                            <svg className="w-4 h-4 text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                            </svg>
                          )}
                        </button>
                      </div>
                    )}
                    <p className={`text-sm italic ${isDark ? 'text-gray-500' : 'text-gray-400'}`}>
                      Invite members to the project to assign tasks to them.
                    </p>
                  </div>
                )}
              </div>

              {/* Priority & Due Date */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className={`block text-sm font-medium mb-2 ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                    Priority
                  </label>
                  <select
                    value={formData.priority}
                    onChange={(e) => setFormData({ ...formData, priority: e.target.value })}
                    className={`w-full px-4 py-3 border rounded-xl focus:outline-none focus:border-purple-500 focus:ring-1 focus:ring-purple-500 transition-all appearance-none cursor-pointer ${
                      isDark ? 'bg-white/5 border-white/10 text-white' : 'bg-gray-50 border-gray-200 text-gray-900'
                    }`}
                  >
                    <option value="low" className={isDark ? 'bg-[#1a1a2e]' : ''}>Low</option>
                    <option value="medium" className={isDark ? 'bg-[#1a1a2e]' : ''}>Medium</option>
                    <option value="high" className={isDark ? 'bg-[#1a1a2e]' : ''}>High</option>
                    <option value="urgent" className={isDark ? 'bg-[#1a1a2e]' : ''}>Urgent</option>
                  </select>
                </div>
                <div>
                  <label className={`block text-sm font-medium mb-2 ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                    Due Date
                  </label>
                  <input
                    type="date"
                    value={formData.dueDate}
                    onChange={(e) => setFormData({ ...formData, dueDate: e.target.value })}
                    className={`w-full px-4 py-3 border rounded-xl focus:outline-none focus:border-purple-500 focus:ring-1 focus:ring-purple-500 transition-all ${
                      isDark ? 'bg-white/5 border-white/10 text-white [color-scheme:dark]' : 'bg-gray-50 border-gray-200 text-gray-900'
                    }`}
                  />
                </div>
              </div>

              {/* Labels */}
              <div>
                <label className={`block text-sm font-medium mb-2 ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                  Labels
                </label>
                <div className="flex flex-wrap gap-2 mb-2">
                  {formData.labels.map((label, index) => (
                    <span
                      key={index}
                      className="flex items-center gap-1 px-3 py-1 rounded-full text-sm font-medium"
                      style={{
                        backgroundColor: label.color + '20',
                        color: label.color,
                      }}
                    >
                      {label.name}
                      <button
                        type="button"
                        onClick={() => removeLabel(index)}
                        className="ml-1 hover:opacity-70"
                      >
                        ×
                      </button>
                    </span>
                  ))}
                </div>
                {showLabelForm ? (
                  <div className="flex gap-2 items-end">
                    <input
                      type="text"
                      value={newLabel.name}
                      onChange={(e) => setNewLabel({ ...newLabel, name: e.target.value })}
                      placeholder="Label name"
                      className={`flex-1 px-3 py-2 border rounded-lg focus:outline-none focus:border-purple-500 text-sm ${
                        isDark ? 'bg-white/5 border-white/10 text-white placeholder-gray-500' : 'bg-gray-50 border-gray-200 text-gray-900 placeholder-gray-400'
                      }`}
                    />
                    <div className="flex gap-1">
                      {labelColors.map((color) => (
                        <button
                          key={color}
                          type="button"
                          onClick={() => setNewLabel({ ...newLabel, color })}
                          className={`w-6 h-6 rounded-full transition-all ${newLabel.color === color ? `ring-2 ring-offset-2 ${isDark ? 'ring-white ring-offset-[#12121a]' : 'ring-purple-500 ring-offset-white'}` : ''}`}
                          style={{ backgroundColor: color }}
                        />
                      ))}
                    </div>
                    <button
                      type="button"
                      onClick={addLabel}
                      className="px-3 py-2 bg-purple-500 hover:bg-purple-600 text-white rounded-lg text-sm transition-all"
                    >
                      Add
                    </button>
                    <button
                      type="button"
                      onClick={() => setShowLabelForm(false)}
                      className={`px-3 py-2 rounded-lg text-sm transition-all ${
                        isDark ? 'bg-white/10 hover:bg-white/20 text-white' : 'bg-gray-100 hover:bg-gray-200 text-gray-600'
                      }`}
                    >
                      Cancel
                    </button>
                  </div>
                ) : (
                  <button
                    type="button"
                    onClick={() => setShowLabelForm(true)}
                    className="text-purple-400 hover:text-purple-300 text-sm flex items-center gap-1"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                    </svg>
                    Add Label
                  </button>
                )}
              </div>

              {/* Checklist */}
              <div>
                <label className={`block text-sm font-medium mb-2 ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                  Checklist
                </label>
                <div className="space-y-2 mb-2">
                  {formData.checklist.map((item, index) => (
                    <div
                      key={index}
                      className={`flex items-center gap-2 p-2 rounded-lg ${isDark ? 'bg-white/5' : 'bg-gray-50'}`}
                    >
                      <div className={`w-4 h-4 rounded border ${isDark ? 'border-white/30' : 'border-gray-300'}`} />
                      <span className={`flex-1 text-sm ${isDark ? 'text-gray-300' : 'text-gray-600'}`}>{item.text}</span>
                      <button
                        type="button"
                        onClick={() => removeChecklistItem(index)}
                        className="text-gray-500 hover:text-red-400 transition-all"
                      >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                      </button>
                    </div>
                  ))}
                </div>
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={newChecklistItem}
                    onChange={(e) => setNewChecklistItem(e.target.value)}
                    placeholder="Add checklist item..."
                    onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addChecklistItem())}
                    className={`flex-1 px-3 py-2 border rounded-lg focus:outline-none focus:border-purple-500 text-sm ${
                      isDark ? 'bg-white/5 border-white/10 text-white placeholder-gray-500' : 'bg-gray-50 border-gray-200 text-gray-900 placeholder-gray-400'
                    }`}
                  />
                  <button
                    type="button"
                    onClick={addChecklistItem}
                    className={`px-4 py-2 rounded-lg text-sm transition-all ${
                      isDark ? 'bg-white/10 hover:bg-white/20 text-white' : 'bg-gray-100 hover:bg-gray-200 text-gray-600'
                    }`}
                  >
                    Add
                  </button>
                </div>
              </div>
            </form>

            {/* Footer */}
            <div className={`p-6 border-t flex gap-3 justify-end ${isDark ? 'border-white/10' : 'border-gray-200'}`}>
              <button
                type="button"
                onClick={onClose}
                className={`px-6 py-3 rounded-xl font-medium transition-all ${
                  isDark ? 'bg-white/10 hover:bg-white/20 text-white' : 'bg-gray-100 hover:bg-gray-200 text-gray-600'
                }`}
              >
                Cancel
              </button>
              <button
                onClick={handleSubmit}
                className="px-6 py-3 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-500 hover:to-pink-500 text-white rounded-xl font-medium shadow-lg shadow-purple-500/25 transition-all"
              >
                Create Task
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
