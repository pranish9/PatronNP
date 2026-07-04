import apiClient from './apiClient';

const toFormData = (level = {}, { coverImage, publish } = {}) => {
  const formData = new FormData();

  if (level.name != null) formData.append('name', level.name);
  if (level.description != null) formData.append('description', level.description);
  if (level.monthlyPrice != null) formData.append('monthlyPrice', level.monthlyPrice);
  if (level.yearlyPrice != null && level.yearlyPrice !== '') formData.append('yearlyPrice', level.yearlyPrice);
  if (level.welcomeNote != null) formData.append('welcomeNote', level.welcomeNote);
  (level.rewards || []).forEach((r) => formData.append('rewards', r));
  formData.append('limitMembers', !!level.limitMembers);
  if (level.memberLimit != null && level.memberLimit !== '') formData.append('memberLimit', level.memberLimit);

  if (publish != null) formData.append('publish', publish);
  if (coverImage) formData.append('coverImage', coverImage);

  return formData;
};

const membershipService = {
  // Creator: levels
  getLevels: () => apiClient.get('/creator/membership/levels'),

  createLevel: (level, opts) =>
    apiClient.post('/creator/membership/levels', toFormData(level, opts), {
      headers: { 'Content-Type': 'multipart/form-data' },
    }),

  updateLevel: (id, level, opts) =>
    apiClient.put(`/creator/membership/levels/${id}`, toFormData(level, opts), {
      headers: { 'Content-Type': 'multipart/form-data' },
    }),

  deleteLevel: (id) => apiClient.delete(`/creator/membership/levels/${id}`),

  publishLevel: (id) => apiClient.post(`/creator/membership/levels/${id}/publish`),

  unpublishLevel: (id) => apiClient.post(`/creator/membership/levels/${id}/unpublish`),

  // Creator: members / stats / recovery
  getMembers: () => apiClient.get('/creator/membership/members'),

  getStats: () => apiClient.get('/creator/membership/stats'),

  getRecovery: () => apiClient.get('/creator/membership/recovery'),

  resolveRefund: (subscriptionId, approve) =>
    apiClient.post(`/creator/membership/recovery/${subscriptionId}/resolve`, { approve }),

  confirmRefundPayment: (subscriptionId, referenceId, method) =>
    apiClient.post(`/creator/membership/recovery/${subscriptionId}/confirm-payment`, { referenceId, method }),

  // Public
  getPublicLevels: (username) => apiClient.get(`/creators/${username}/membership/levels`),

  getMyMembership: (username) => apiClient.get(`/creators/${username}/membership/mine`),

  // Member
  cancelSubscription: (subscriptionId, { reason, requestRefund, refundPhone, refundMethod }) =>
    apiClient.post(`/membership/subscriptions/${subscriptionId}/cancel`, {
      reason,
      requestRefund,
      refundPhone,
      refundMethod,
    }),
};

export default membershipService;
