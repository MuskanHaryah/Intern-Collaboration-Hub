import api from './api';

const userService = {
  /**
   * Search users by email or name
   * @param {string} query - search term (min 2 chars)
   * @returns {Promise} - { success, data: [users] }
   */
  search: async (query) => {
    const response = await api.get('/users/search', { params: { q: query } });
    return response.data;
  },

  /**
   * Get all users
   * @returns {Promise} - { success, data: [users] }
   */
  getAll: async () => {
    const response = await api.get('/users');
    return response.data;
  },
};

export default userService;
