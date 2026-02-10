import api from './api';

const authService = {
  /**
   * Register a new user
   * @param {Object} userData - { name, email, password, role }
   * @returns {Promise} - { success, token, user }
   */
  register: async (userData) => {
    const response = await api.post('/auth/register', userData);
    // Backend returns { success, data: { user, token } }
    const result = response.data;
    const token = result.data?.token || result.token;
    const user = result.data?.user || result.user;
    if (token) {
      localStorage.setItem('token', token);
      localStorage.setItem('user', JSON.stringify(user));
    }
    return { ...result, user, token };
  },

  /**
   * Login user
   * @param {Object} credentials - { email, password }
   * @returns {Promise} - { success, token, user }
   */
  login: async (credentials) => {
    const response = await api.post('/auth/login', credentials);
    // Backend returns { success, data: { user, token } }
    const result = response.data;
    const token = result.data?.token || result.token;
    const user = result.data?.user || result.user;
    if (token) {
      localStorage.setItem('token', token);
      localStorage.setItem('user', JSON.stringify(user));
    }
    return { ...result, user, token };
  },

  /**
   * Logout user
   */
  logout: () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
  },

  /**
   * Get current user profile
   * @returns {Promise} - { success, user }
   */
  getMe: async () => {
    const response = await api.get('/auth/me');
    // Backend returns { success, data: userProfile }
    const result = response.data;
    return { ...result, user: result.data || result.user };
  },

  /**
   * Update user profile
   * @param {Object} updates - { name, email, avatar }
   * @returns {Promise} - { success, user }
   */
  updateProfile: async (updates) => {
    const response = await api.put('/auth/profile', updates);
    // Backend returns { success, data: userProfile }
    const result = response.data;
    const user = result.data || result.user;
    if (user) {
      localStorage.setItem('user', JSON.stringify(user));
    }
    return { ...result, user };
  },

  /**
   * Change password
   * @param {Object} passwords - { currentPassword, newPassword }
   * @returns {Promise} - { success, message }
   */
  changePassword: async (passwords) => {
    const response = await api.put('/auth/password', passwords);
    return response.data;
  },

  /**
   * Get stored user from localStorage
   * @returns {Object|null} - user object or null
   */
  getStoredUser: () => {
    const user = localStorage.getItem('user');
    return user ? JSON.parse(user) : null;
  },

  /**
   * Check if user is authenticated
   * @returns {boolean}
   */
  isAuthenticated: () => {
    return !!localStorage.getItem('token');
  },

  /**
   * Get stored token
   * @returns {string|null}
   */
  getToken: () => {
    return localStorage.getItem('token');
  },

  /**
   * Request password reset email
   * @param {string} email
   * @returns {Promise} - { success, message }
   */
  forgotPassword: async (email) => {
    const response = await api.post('/auth/forgot-password', { email });
    return response.data;
  },

  /**
   * Reset password using token
   * @param {string} token - Reset token from email link
   * @param {string} password - New password
   * @returns {Promise} - { success, message, data: { user, token } }
   */
  resetPassword: async (token, password) => {
    const response = await api.put(`/auth/reset-password/${token}`, { password });
    const result = response.data;
    const jwtToken = result.data?.token || result.token;
    const user = result.data?.user || result.user;
    if (jwtToken) {
      localStorage.setItem('token', jwtToken);
      localStorage.setItem('user', JSON.stringify(user));
    }
    return { ...result, user, token: jwtToken };
  },
};

export default authService;
