import { useState } from 'react';
import { motion } from 'framer-motion';
import { EditingIndicator } from '../UI';

export default function TaskCard({ task, onUpdate, onDelete, onView, isDragging = false, editingUsers = [] }) {
  const [showMenu, setShowMenu] = useState(false);
  const [isEditing, setIsEditing] = useState(false);

  const getPriorityColor = (priority) => {
    const colors = {
      low: 'bg-gray-500',
      medium: 'bg-yellow-500',
      high: 'bg-orange-500',
      urgent: 'bg-red-500',
    };
    return colors[priority] || 'bg-gray-500';
  };

  const getPriorityBg = (priority) => {
    const colors = {
      low: 'bg-gray-500/10 text-gray-400 border-gray-500/30',
      medium: 'bg-yellow-500/10 text-yellow-400 border-yellow-500/30',
      high: 'bg-orange-500/10 text-orange-400 border-orange-500/30',
      urgent: 'bg-red-500/10 text-red-400 border-red-500/30',
    };
    return colors[priority] || colors.low;
  };

  const formatDate = (date) => {
    if (!date) return null;
    const d = new Date(date);
    const now = new Date();
    const diff = d - now;
    const days = Math.ceil(diff / (1000 * 60 * 60 * 24));
    
    if (days < 0) return { text: 'Overdue', color: 'text-red-400' };
    if (days === 0) return { text: 'Today', color: 'text-orange-400' };
    if (days === 1) return { text: 'Tomorrow', color: 'text-yellow-400' };
    if (days <= 7) return { text: `${days} days`, color: 'text-gray-400' };
    return { text: d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }), color: 'text-gray-400' };
  };

  const dueInfo = formatDate(task.dueDate);
  const checklistProgress = task.checklist?.length > 0
    ? {
        completed: task.checklist.filter(item => item.isCompleted).length,
        total: task.checklist.length,
      }
    : null;

  return (
    <div
      onClick={() => onView?.(task)}
      className={`bg-[#1a1a2e] border rounded-xl p-4 cursor-pointer hover:shadow-lg transition-all group relative ${
        isDragging 
          ? 'border-purple-500 shadow-lg shadow-purple-500/20 ring-2 ring-purple-500/30' 
          : 'border-white/10 hover:border-purple-500/50'
      } ${editingUsers.length > 0 ? 'ring-2 ring-cyan-500/30' : ''}`}
    >
      {/* Editing Indicator */}
      {editingUsers.length > 0 && (
        <div className="absolute -top-2 right-2 z-10">
          <EditingIndicator users={editingUsers} />
        </div>
      )}

      {/* Labels */}
      {task.labels && task.labels.length > 0 && (
        <div className="flex flex-wrap gap-1.5 mb-3">
          {task.labels.map((label, index) => (
            <span
              key={index}
              className="px-2 py-0.5 rounded-full text-xs font-medium"
              style={{
                backgroundColor: label.color + '20',
                color: label.color,
              }}
            >
              {label.name}
            </span>
          ))}
        </div>
      )}

      {/* Title */}
      <h4 className="text-white font-medium mb-2 group-hover:text-purple-400 transition-colors">
        {task.title}
      </h4>

      {/* Description Preview */}
      {task.description && (
        <p className="text-gray-500 text-sm mb-3 line-clamp-2">
          {task.description}
        </p>
      )}

      {/* Checklist Progress */}
      {checklistProgress && (
        <div className="mb-3">
          <div className="flex items-center justify-between text-xs mb-1">
            <span className="text-gray-500">Checklist</span>
            <span className="text-gray-400">
              {checklistProgress.completed}/{checklistProgress.total}
            </span>
          </div>
          <div className="h-1.5 bg-white/10 rounded-full overflow-hidden">
            <div
              className="h-full bg-purple-500 rounded-full transition-all"
              style={{
                width: `${(checklistProgress.completed / checklistProgress.total) * 100}%`,
              }}
            />
          </div>
        </div>
      )}

      {/* Footer */}
      <div className="flex items-center justify-between mt-3 pt-3 border-t border-white/5">
        <div className="flex items-center gap-2">
          {/* Priority Badge */}
          <span className={`px-2 py-0.5 rounded text-xs font-medium border ${getPriorityBg(task.priority)}`}>
            {task.priority}
          </span>

          {/* Due Date */}
          {dueInfo && (
            <span className={`flex items-center gap-1 text-xs ${dueInfo.color}`}>
              <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
              {dueInfo.text}
            </span>
          )}
        </div>

        <div className="flex items-center gap-2">
          {/* Attachments Count */}
          {task.attachments?.length > 0 && (
            <span className="flex items-center gap-1 text-xs text-gray-500">
              <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.172 7l-6.586 6.586a2 2 0 102.828 2.828l6.414-6.586a4 4 0 00-5.656-5.656l-6.415 6.585a6 6 0 108.486 8.486L20.5 13" />
              </svg>
              {task.attachments.length}
            </span>
          )}
          
          {/* Comments Count */}
          {task.comments?.length > 0 && (
            <span className="flex items-center gap-1 text-xs text-gray-500">
              <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
              </svg>
              {task.comments.length}
            </span>
          )}

          {/* Assignees */}
          {task.assignees && task.assignees.length > 0 && (
            <div className="flex -space-x-2">
              {task.assignees.slice(0, 3).map((assignee, index) => (
                <div
                  key={assignee.id || index}
                  className="w-6 h-6 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 border-2 border-[#1a1a2e] flex items-center justify-center text-white text-xs font-medium"
                  title={assignee.name}
                >
                  {assignee.name?.charAt(0) || assignee.avatar || 'U'}
                </div>
              ))}
              {task.assignees.length > 3 && (
                <div className="w-6 h-6 rounded-full bg-white/10 border-2 border-[#1a1a2e] flex items-center justify-center text-gray-400 text-xs">
                  +{task.assignees.length - 3}
                </div>
              )}
            </div>
          )}

          {/* Menu Button */}
          <div className="relative">
            <button
              onClick={(e) => {
                e.stopPropagation();
                setShowMenu(!showMenu);
              }}
              className="p-1 text-gray-500 hover:text-white opacity-0 group-hover:opacity-100 transition-all"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 5v.01M12 12v.01M12 19v.01M12 6a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2z" />
              </svg>
            </button>

            {/* Dropdown Menu */}
            {showMenu && (
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="absolute right-0 top-full mt-1 w-40 bg-[#1a1a2e] border border-white/10 rounded-xl shadow-xl z-10 overflow-hidden"
              >
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    onView?.(task);
                    setShowMenu(false);
                  }}
                  className="w-full flex items-center gap-2 px-4 py-2 text-gray-400 hover:text-white hover:bg-white/5 transition-all"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                  </svg>
                  View
                </button>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    setIsEditing(true);
                    setShowMenu(false);
                  }}
                  className="w-full flex items-center gap-2 px-4 py-2 text-gray-400 hover:text-white hover:bg-white/5 transition-all"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                  </svg>
                  Edit
                </button>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    onDelete?.(task.id);
                    setShowMenu(false);
                  }}
                  className="w-full flex items-center gap-2 px-4 py-2 text-red-400 hover:text-red-300 hover:bg-red-500/10 transition-all"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                  </svg>
                  Delete
                </button>
              </motion.div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
