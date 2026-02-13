import api from './api';

const notificationService = {
  // Get all notifications
  getAll: () => api.get('/notifications'),

  // Get unread count
  getUnreadCount: () => api.get('/notifications/unread-count'),

  // Mark single notification as read
  markRead: (id) => api.put(`/notifications/${id}/read`),

  // Mark all notifications as read
  markAllRead: () => api.put('/notifications/read-all'),

  // Delete a notification
  delete: (id) => api.delete(`/notifications/${id}`),
};

export default notificationService;
