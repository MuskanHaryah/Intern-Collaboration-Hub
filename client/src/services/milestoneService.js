/**
 * Milestone Service - API calls for milestone management
 */

import api from './api';

/**
 * Get all milestones for a project
 */
export const getMilestones = async (projectId) => {
  const response = await api.get(`/milestones/${projectId}`);
  return response.data;
};

/**
 * Create a new milestone
 */
export const createMilestone = async (milestoneData) => {
  const response = await api.post('/milestones', milestoneData);
  return response.data;
};

/**
 * Update a milestone
 */
export const updateMilestone = async (milestoneId, updates) => {
  const response = await api.put(`/milestones/${milestoneId}`, updates);
  return response.data;
};

/**
 * Delete a milestone
 */
export const deleteMilestone = async (milestoneId) => {
  const response = await api.delete(`/milestones/${milestoneId}`);
  return response.data;
};

/**
 * Toggle milestone completion
 */
export const toggleMilestoneComplete = async (milestoneId, completed) => {
  const response = await api.patch(`/milestones/${milestoneId}/toggle`, { completed });
  return response.data;
};

/**
 * Reorder milestones
 */
export const reorderMilestones = async (projectId, milestoneIds) => {
  const response = await api.patch(`/milestones/${projectId}/reorder`, { milestoneIds });
  return response.data;
};

export default {
  getMilestones,
  createMilestone,
  updateMilestone,
  deleteMilestone,
  toggleMilestoneComplete,
  reorderMilestones,
};
