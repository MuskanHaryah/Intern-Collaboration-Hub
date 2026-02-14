import api from './api';

const taskService = {
  /**
   * Get all tasks assigned to the current user
   * @returns {Promise} - { success, count, data }
   */
  getMyTasks: async () => {
    const response = await api.get('/tasks/my');
    return response.data;
  },

  /**
   * Get all tasks for a project
   * @param {string} projectId
   * @param {Object} params - { column, priority, assignee, search }
   * @returns {Promise} - { success, count, tasks }
   */
  getByProject: async (projectId, params = {}) => {
    const response = await api.get(`/tasks/project/${projectId}`, { params });
    return response.data;
  },

  /**
   * Get a single task by ID
   * @param {string} taskId
   * @returns {Promise} - { success, task }
   */
  getById: async (taskId) => {
    const response = await api.get(`/tasks/${taskId}`);
    return response.data;
  },

  /**
   * Create a new task
   * @param {Object} taskData - { title, description, project, column, priority, assignees, dueDate, labels }
   * @returns {Promise} - { success, task }
   */
  create: async (taskData) => {
    const response = await api.post('/tasks', taskData);
    return response.data;
  },

  /**
   * Update a task
   * @param {string} taskId
   * @param {Object} updates - task fields to update
   * @returns {Promise} - { success, task }
   */
  update: async (taskId, updates) => {
    const response = await api.put(`/tasks/${taskId}`, updates);
    return response.data;
  },

  /**
   * Delete a task
   * @param {string} taskId
   * @returns {Promise} - { success, message }
   */
  delete: async (taskId) => {
    const response = await api.delete(`/tasks/${taskId}`);
    return response.data;
  },

  /**
   * Move a task to a different column/position
   * @param {string} taskId
   * @param {Object} moveData - { column, order }
   * @returns {Promise} - { success, task }
   */
  move: async (taskId, moveData) => {
    const response = await api.patch(`/tasks/${taskId}/move`, moveData);
    return response.data;
  },

  /**
   * Add a comment to a task
   * @param {string} taskId
   * @param {string} content - comment text
   * @returns {Promise} - { success, task }
   */
  addComment: async (taskId, content) => {
    const response = await api.post(`/tasks/${taskId}/comments`, { content });
    return response.data;
  },

  /**
   * Delete a comment from a task
   * @param {string} taskId
   * @param {string} commentId
   * @returns {Promise} - { success, task }
   */
  deleteComment: async (taskId, commentId) => {
    const response = await api.delete(`/tasks/${taskId}/comments/${commentId}`);
    return response.data;
  },

  /**
   * Add a checklist item to a task
   * @param {string} taskId
   * @param {string} text - checklist item text
   * @returns {Promise} - { success, task }
   */
  addChecklistItem: async (taskId, text) => {
    const response = await api.post(`/tasks/${taskId}/checklist`, { text });
    return response.data;
  },

  /**
   * Toggle a checklist item's completion status
   * @param {string} taskId
   * @param {string} itemId
   * @returns {Promise} - { success, task }
   */
  toggleChecklistItem: async (taskId, itemId) => {
    const response = await api.patch(`/tasks/${taskId}/checklist/${itemId}/toggle`);
    return response.data;
  },

  /**
   * Delete a checklist item
   * @param {string} taskId
   * @param {string} itemId
   * @returns {Promise} - { success, task }
   */
  deleteChecklistItem: async (taskId, itemId) => {
    const response = await api.delete(`/tasks/${taskId}/checklist/${itemId}`);
    return response.data;
  },

  /**
   * Assign a user to a task
   * @param {string} taskId
   * @param {string} userId
   * @returns {Promise} - { success, task }
   */
  assignUser: async (taskId, userId) => {
    const response = await api.post(`/tasks/${taskId}/assignees`, { userId });
    return response.data;
  },

  /**
   * Unassign a user from a task
   * @param {string} taskId
   * @param {string} userId
   * @returns {Promise} - { success, task }
   */
  unassignUser: async (taskId, userId) => {
    const response = await api.delete(`/tasks/${taskId}/assignees/${userId}`);
    return response.data;
  },

  /**
   * Add a label to a task
   * @param {string} taskId
   * @param {Object} label - { name, color }
   * @returns {Promise} - { success, task }
   */
  addLabel: async (taskId, label) => {
    const response = await api.post(`/tasks/${taskId}/labels`, label);
    return response.data;
  },

  /**
   * Remove a label from a task
   * @param {string} taskId
   * @param {string} labelId
   * @returns {Promise} - { success, task }
   */
  removeLabel: async (taskId, labelId) => {
    const response = await api.delete(`/tasks/${taskId}/labels/${labelId}`);
    return response.data;
  },

  /**
   * Upload file attachment to a task
   * @param {string} taskId
   * @param {FormData} formData - FormData containing the file
   * @returns {Promise} - { success, data: attachment }
   */
  uploadAttachment: async (taskId, formData) => {
    const response = await api.post(`/tasks/${taskId}/attachments`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  },

  /**
   * Delete file attachment from a task
   * @param {string} taskId
   * @param {string} attachmentId
   * @returns {Promise} - { success, message }
   */
  deleteAttachment: async (taskId, attachmentId) => {
    const response = await api.delete(`/tasks/${taskId}/attachments/${attachmentId}`);
    return response.data;
  },

  /**
   * Download file attachment
   * @param {string} taskId
   * @param {string} attachmentId
   * @returns {Promise<Blob>} - File blob
   */
  downloadAttachment: async (taskId, attachmentId) => {
    const response = await api.get(`/tasks/${taskId}/attachments/${attachmentId}/download`, {
      responseType: 'blob',
    });
    return response.data;
  },
};

export default taskService;
