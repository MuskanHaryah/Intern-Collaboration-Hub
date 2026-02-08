import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import FileUpload from './FileUpload';
import AttachmentList from './AttachmentList';
import taskService from '../../services/taskService';
import { useToastStore } from '../../stores';

export default function TaskDetailsModal({ isOpen, onClose, task, onUpdate, projectMembers = [] }) {
  const [activeTab, setActiveTab] = useState('details'); // 'details', 'attachments', 'activity'
  const [localTask, setLocalTask] = useState(task);
  const [isUploading, setIsUploading] = useState(false);
  const { success, error: showError } = useToastStore();

  useEffect(() => {
    setLocalTask(task);
  }, [task]);

  if (!task) return null;

  const handleUploadSuccess = (attachment) => {
    success('File uploaded successfully', { type: 'upload' });
    // Update local task with new attachment
    const updatedTask = {
      ...localTask,
      attachments: [...(localTask.attachments || []), attachment],
    };
    setLocalTask(updatedTask);
    onUpdate?.(updatedTask);
  };

  const handleUploadError = (errorMsg) => {
    showError(errorMsg || 'Failed to upload file');
  };

  const handleDeleteAttachment = async (attachmentId) => {
    try {
      await taskService.deleteAttachment(task._id, attachmentId);
      success('Attachment deleted successfully');
      
      // Update local task by removing the deleted attachment
      const updatedTask = {
        ...localTask,
        attachments: localTask.attachments.filter(a => a._id !== attachmentId),
      };
      setLocalTask(updatedTask);
      onUpdate?.(updatedTask);
    } catch (err) {
      showError(err.message || 'Failed to delete attachment');
    }
  };

  const getPriorityColor = (priority) => {
    const colors = {
      low: 'bg-gray-500',
      medium: 'bg-yellow-500',
      high: 'bg-orange-500',
      urgent: 'bg-red-500',
    };
    return colors[priority] || 'bg-gray-500';
  };

  const formatDate = (date) => {
    if (!date) return 'Not set';
    return new Date(date).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  const getAssigneeInfo = (assigneeId) => {
    if (typeof assigneeId === 'object') return assigneeId;
    return projectMembers.find(m => m.id === assigneeId || m._id === assigneeId);
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
            className="w-full max-w-4xl bg-[#12121a] border border-white/10 rounded-2xl shadow-2xl overflow-hidden max-h-[90vh] flex flex-col"
          >
            {/* Header */}
            <div className="p-6 border-b border-white/10">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <h2 className="text-2xl font-bold text-white mb-2">{localTask.title}</h2>
                  <div className="flex items-center gap-3 flex-wrap">
                    <span className={`px-3 py-1 rounded-full text-xs font-medium text-white ${getPriorityColor(localTask.priority)}`}>
                      {localTask.priority}
                    </span>
                    {localTask.labels?.map((label, index) => (
                      <span
                        key={index}
                        className="px-3 py-1 rounded-full text-xs font-medium"
                        style={{
                          backgroundColor: label.color + '20',
                          color: label.color,
                        }}
                      >
                        {label.name}
                      </span>
                    ))}
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

            {/* Tabs */}
            <div className="border-b border-white/10">
              <div className="flex gap-1 px-6">
                {[
                  { id: 'details', label: 'Details', icon: 'M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z' },
                  { id: 'attachments', label: 'Attachments', icon: 'M15.172 7l-6.586 6.586a2 2 0 102.828 2.828l6.414-6.586a4 4 0 00-5.656-5.656l-6.415 6.585a6 6 0 108.486 8.486L20.5 13', count: localTask.attachments?.length },
                  { id: 'activity', label: 'Activity', icon: 'M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z', count: localTask.activityLog?.length },
                ].map((tab) => (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`flex items-center gap-2 px-4 py-3 text-sm font-medium border-b-2 transition-all ${
                      activeTab === tab.id
                        ? 'text-purple-400 border-purple-500'
                        : 'text-gray-500 border-transparent hover:text-gray-300'
                    }`}
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={tab.icon} />
                    </svg>
                    {tab.label}
                    {tab.count > 0 && (
                      <span className="px-1.5 py-0.5 bg-purple-500/20 text-purple-400 rounded text-xs">
                        {tab.count}
                      </span>
                    )}
                  </button>
                ))}
              </div>
            </div>

            {/* Content */}
            <div className="flex-1 overflow-y-auto p-6">
              <AnimatePresence mode="wait">
                {activeTab === 'details' && (
                  <motion.div
                    key="details"
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: 20 }}
                    className="space-y-6"
                  >
                    {/* Description */}
                    <div>
                      <h3 className="text-gray-400 text-sm font-medium mb-2">Description</h3>
                      <p className="text-white">
                        {localTask.description || 'No description provided'}
                      </p>
                    </div>

                    {/* Dates */}
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <h3 className="text-gray-400 text-sm font-medium mb-2">Due Date</h3>
                        <p className="text-white">{formatDate(localTask.dueDate)}</p>
                      </div>
                      <div>
                        <h3 className="text-gray-400 text-sm font-medium mb-2">Created</h3>
                        <p className="text-white">{formatDate(localTask.createdAt)}</p>
                      </div>
                    </div>

                    {/* Assignees */}
                    {localTask.assignees?.length > 0 && (
                      <div>
                        <h3 className="text-gray-400 text-sm font-medium mb-2">Assigned To</h3>
                        <div className="flex flex-wrap gap-2">
                          {localTask.assignees.map((assigneeId, index) => {
                            const assignee = getAssigneeInfo(assigneeId);
                            return assignee ? (
                              <div
                                key={index}
                                className="flex items-center gap-2 px-3 py-2 bg-white/5 rounded-lg border border-white/10"
                              >
                                <div className="w-8 h-8 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center text-white text-xs font-medium">
                                  {assignee.name?.charAt(0) || 'U'}
                                </div>
                                <div>
                                  <p className="text-white text-sm font-medium">{assignee.name}</p>
                                  <p className="text-gray-500 text-xs">{assignee.email}</p>
                                </div>
                              </div>
                            ) : null;
                          })}
                        </div>
                      </div>
                    )}

                    {/* Checklist */}
                    {localTask.checklist?.length > 0 && (
                      <div>
                        <h3 className="text-gray-400 text-sm font-medium mb-2">Checklist</h3>
                        <div className="space-y-2">
                          {localTask.checklist.map((item, index) => (
                            <div
                              key={index}
                              className="flex items-center gap-3 p-3 bg-white/5 rounded-lg border border-white/10"
                            >
                              <div className={`w-5 h-5 rounded border-2 flex items-center justify-center ${
                                item.isCompleted ? 'bg-purple-500 border-purple-500' : 'border-white/30'
                              }`}>
                                {item.isCompleted && (
                                  <svg className="w-3 h-3 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                                  </svg>
                                )}
                              </div>
                              <span className={`flex-1 text-sm ${item.isCompleted ? 'text-gray-500 line-through' : 'text-white'}`}>
                                {item.text}
                              </span>
                            </div>
                          ))}
                        </div>
                        <div className="mt-3">
                          <div className="h-2 bg-white/10 rounded-full overflow-hidden">
                            <div
                              className="h-full bg-gradient-to-r from-purple-500 to-pink-500 rounded-full transition-all"
                              style={{
                                width: `${(localTask.checklist.filter(i => i.isCompleted).length / localTask.checklist.length) * 100}%`,
                              }}
                            />
                          </div>
                          <p className="text-gray-500 text-xs mt-1">
                            {localTask.checklist.filter(i => i.isCompleted).length} of {localTask.checklist.length} completed
                          </p>
                        </div>
                      </div>
                    )}
                  </motion.div>
                )}

                {activeTab === 'attachments' && (
                  <motion.div
                    key="attachments"
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: 20 }}
                    className="space-y-6"
                  >
                    <div>
                      <h3 className="text-white text-lg font-semibold mb-4">Upload New File</h3>
                      <FileUpload
                        taskId={localTask._id}
                        onUploadSuccess={handleUploadSuccess}
                        onUploadError={handleUploadError}
                      />
                    </div>

                    <div>
                      <h3 className="text-white text-lg font-semibold mb-4">
                        Attachments ({localTask.attachments?.length || 0})
                      </h3>
                      <AttachmentList
                        attachments={localTask.attachments}
                        taskId={localTask._id}
                        onDelete={handleDeleteAttachment}
                      />
                    </div>
                  </motion.div>
                )}

                {activeTab === 'activity' && (
                  <motion.div
                    key="activity"
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: 20 }}
                  >
                    <h3 className="text-white text-lg font-semibold mb-4">Activity Log</h3>
                    {localTask.activityLog && localTask.activityLog.length > 0 ? (
                      <div className="space-y-3">
                        {localTask.activityLog.slice().reverse().map((log, index) => (
                          <div
                            key={index}
                            className="flex gap-3 p-4 bg-white/5 rounded-lg border border-white/10"
                          >
                            <div className="flex-shrink-0 w-8 h-8 rounded-full bg-purple-500/20 flex items-center justify-center">
                              <svg className="w-4 h-4 text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                              </svg>
                            </div>
                            <div className="flex-1">
                              <p className="text-white text-sm">
                                <span className="font-medium">
                                  {log.user?.name || log.user?.email || 'Someone'}
                                </span>
                                {' '}
                                <span className="text-gray-400">{log.action.replace(/_/g, ' ')}</span>
                              </p>
                              <p className="text-gray-500 text-xs mt-1">
                                {new Date(log.timestamp).toLocaleString()}
                              </p>
                              {log.details && (
                                <p className="text-gray-400 text-xs mt-1">
                                  {JSON.stringify(log.details)}
                                </p>
                              )}
                            </div>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="text-center py-8">
                        <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-white/5 mb-3">
                          <svg className="w-8 h-8 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                          </svg>
                        </div>
                        <p className="text-gray-500 text-sm">No activity yet</p>
                      </div>
                    )}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Footer */}
            <div className="p-6 border-t border-white/10 flex gap-3 justify-end">
              <button
                onClick={onClose}
                className="px-6 py-3 bg-white/10 hover:bg-white/20 text-white rounded-xl font-medium transition-all"
              >
                Close
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
