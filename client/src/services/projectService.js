import api from './api';

const projectService = {
  /**
   * Get all projects for the current user
   * @param {Object} params - { status, priority, search, page, limit }
   * @returns {Promise} - { success, count, projects }
   */
  getAll: async (params = {}) => {
    const response = await api.get('/projects', { params });
    return response.data;
  },

  /**
   * Get a single project by ID
   * @param {string} projectId
   * @returns {Promise} - { success, project }
   */
  getById: async (projectId) => {
    const response = await api.get(`/projects/${projectId}`);
    return response.data;
  },

  /**
   * Create a new project
   * @param {Object} projectData - { name, description, color, priority, taskColumns }
   * @returns {Promise} - { success, project }
   */
  create: async (projectData) => {
    const response = await api.post('/projects', projectData);
    return response.data;
  },

  /**
   * Update a project
   * @param {string} projectId
   * @param {Object} updates - project fields to update
   * @returns {Promise} - { success, project }
   */
  update: async (projectId, updates) => {
    const response = await api.put(`/projects/${projectId}`, updates);
    return response.data;
  },

  /**
   * Delete a project
   * @param {string} projectId
   * @returns {Promise} - { success, message }
   */
  delete: async (projectId) => {
    const response = await api.delete(`/projects/${projectId}`);
    return response.data;
  },

  /**
   * Add a member to a project
   * @param {string} projectId
   * @param {Object} memberData - { userId, role }
   * @returns {Promise} - { success, project }
   */
  addMember: async (projectId, memberData) => {
    const response = await api.post(`/projects/${projectId}/members`, memberData);
    return response.data;
  },

  /**
   * Remove a member from a project
   * @param {string} projectId
   * @param {string} userId
   * @returns {Promise} - { success, project }
   */
  removeMember: async (projectId, userId) => {
    const response = await api.delete(`/projects/${projectId}/members/${userId}`);
    return response.data;
  },

  /**
   * Add a milestone to a project
   * @param {string} projectId
   * @param {Object} milestone - { title, description, dueDate }
   * @returns {Promise} - { success, project }
   */
  addMilestone: async (projectId, milestone) => {
    const response = await api.post(`/projects/${projectId}/milestones`, milestone);
    return response.data;
  },

  /**
   * Update a milestone
   * @param {string} projectId
   * @param {string} milestoneId
   * @param {Object} updates
   * @returns {Promise} - { success, project }
   */
  updateMilestone: async (projectId, milestoneId, updates) => {
    const response = await api.put(`/projects/${projectId}/milestones/${milestoneId}`, updates);
    return response.data;
  },

  /**
   * Delete a milestone
   * @param {string} projectId
   * @param {string} milestoneId
   * @returns {Promise} - { success, project }
   */
  deleteMilestone: async (projectId, milestoneId) => {
    const response = await api.delete(`/projects/${projectId}/milestones/${milestoneId}`);
    return response.data;
  },

  /**
   * Update task columns
   * @param {string} projectId
   * @param {Array} columns - array of column objects
   * @returns {Promise} - { success, project }
   */
  updateColumns: async (projectId, columns) => {
    const response = await api.put(`/projects/${projectId}/columns`, { columns });
    return response.data;
  },
};

export default projectService;
