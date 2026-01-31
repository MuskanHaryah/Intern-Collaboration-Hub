import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

export default function AddTaskModal({ isOpen, onClose, onSubmit, columnId, projectMembers = [] }) {
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
            className="w-full max-w-2xl bg-[#12121a] border border-white/10 rounded-2xl shadow-2xl overflow-hidden max-h-[90vh] flex flex-col"
          >
            {/* Header */}
            <div className="p-6 border-b border-white/10">
              <div className="flex items-center justify-between">
                <h2 className="text-2xl font-bold text-white">Create New Task</h2>
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
            <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-6 space-y-6">
              {/* Title */}
              <div>
                <label className="block text-gray-400 text-sm font-medium mb-2">
                  Task Title <span className="text-red-400">*</span>
                </label>
                <input
                  type="text"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  placeholder="Enter task title..."
                  className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:border-purple-500 focus:ring-1 focus:ring-purple-500 transition-all"
                  required
                />
              </div>

              {/* Description */}
              <div>
                <label className="block text-gray-400 text-sm font-medium mb-2">
                  Description
                </label>
                <textarea
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  placeholder="Describe the task..."
                  rows={3}
                  className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:border-purple-500 focus:ring-1 focus:ring-purple-500 transition-all resize-none"
                />
              </div>

              {/* Priority & Due Date */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-gray-400 text-sm font-medium mb-2">
                    Priority
                  </label>
                  <select
                    value={formData.priority}
                    onChange={(e) => setFormData({ ...formData, priority: e.target.value })}
                    className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white focus:outline-none focus:border-purple-500 focus:ring-1 focus:ring-purple-500 transition-all appearance-none cursor-pointer"
                  >
                    <option value="low" className="bg-[#1a1a2e]">Low</option>
                    <option value="medium" className="bg-[#1a1a2e]">Medium</option>
                    <option value="high" className="bg-[#1a1a2e]">High</option>
                    <option value="urgent" className="bg-[#1a1a2e]">Urgent</option>
                  </select>
                </div>
                <div>
                  <label className="block text-gray-400 text-sm font-medium mb-2">
                    Due Date
                  </label>
                  <input
                    type="date"
                    value={formData.dueDate}
                    onChange={(e) => setFormData({ ...formData, dueDate: e.target.value })}
                    className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white focus:outline-none focus:border-purple-500 focus:ring-1 focus:ring-purple-500 transition-all"
                  />
                </div>
              </div>

              {/* Labels */}
              <div>
                <label className="block text-gray-400 text-sm font-medium mb-2">
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
                      className="flex-1 px-3 py-2 bg-white/5 border border-white/10 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-purple-500 text-sm"
                    />
                    <div className="flex gap-1">
                      {labelColors.map((color) => (
                        <button
                          key={color}
                          type="button"
                          onClick={() => setNewLabel({ ...newLabel, color })}
                          className={`w-6 h-6 rounded-full transition-all ${newLabel.color === color ? 'ring-2 ring-white ring-offset-2 ring-offset-[#12121a]' : ''}`}
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
                      className="px-3 py-2 bg-white/10 hover:bg-white/20 text-white rounded-lg text-sm transition-all"
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
                <label className="block text-gray-400 text-sm font-medium mb-2">
                  Checklist
                </label>
                <div className="space-y-2 mb-2">
                  {formData.checklist.map((item, index) => (
                    <div
                      key={index}
                      className="flex items-center gap-2 p-2 bg-white/5 rounded-lg"
                    >
                      <div className="w-4 h-4 rounded border border-white/30" />
                      <span className="flex-1 text-gray-300 text-sm">{item.text}</span>
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
                    className="flex-1 px-3 py-2 bg-white/5 border border-white/10 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-purple-500 text-sm"
                  />
                  <button
                    type="button"
                    onClick={addChecklistItem}
                    className="px-4 py-2 bg-white/10 hover:bg-white/20 text-white rounded-lg text-sm transition-all"
                  >
                    Add
                  </button>
                </div>
              </div>

              {/* Assignees */}
              {projectMembers.length > 0 && (
                <div>
                  <label className="block text-gray-400 text-sm font-medium mb-2">
                    Assignees
                  </label>
                  <div className="flex flex-wrap gap-2">
                    {projectMembers.map((member) => (
                      <button
                        key={member.id}
                        type="button"
                        onClick={() => toggleAssignee(member.id)}
                        className={`flex items-center gap-2 px-3 py-2 rounded-lg transition-all ${
                          formData.assignees.includes(member.id)
                            ? 'bg-purple-500/20 border border-purple-500/50 text-purple-400'
                            : 'bg-white/5 border border-white/10 text-gray-400 hover:bg-white/10'
                        }`}
                      >
                        <div className="w-6 h-6 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center text-white text-xs font-medium">
                          {member.name?.charAt(0) || 'U'}
                        </div>
                        <span className="text-sm">{member.name}</span>
                        {formData.assignees.includes(member.id) && (
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                          </svg>
                        )}
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </form>

            {/* Footer */}
            <div className="p-6 border-t border-white/10 flex gap-3 justify-end">
              <button
                type="button"
                onClick={onClose}
                className="px-6 py-3 bg-white/10 hover:bg-white/20 text-white rounded-xl font-medium transition-all"
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
