import api from './api';

const invitationService = {
  // Send an invitation
  send: (data) => api.post('/invitations', data),

  // Get invitations received by current user
  getReceived: () => api.get('/invitations/received'),

  // Get invitations sent by current user
  getSent: () => api.get('/invitations/sent'),

  // Accept an invitation
  accept: (invitationId) => api.put(`/invitations/${invitationId}/accept`),

  // Decline an invitation
  decline: (invitationId) => api.put(`/invitations/${invitationId}/decline`),
};

export default invitationService;
