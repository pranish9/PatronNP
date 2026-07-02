import apiClient from './apiClient';

export const userService = {
  getProfile: () => apiClient.get('/users/profile'),
  updateCreatorPage: (formData) =>
  apiClient.put("/creator/page", formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  }),
  updateProfile: ({ name, country, timezone, photo }) => {
    const formData = new FormData();
    if (name != null) formData.append('name', name);
    if (country != null) formData.append('country', country);
    if (timezone != null) formData.append('timezone', timezone);
    if (photo) formData.append('photo', photo);
    return apiClient.put('/users/profile', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
  },

  changePassword: (newPassword, confirmPassword) =>
    apiClient.put('/users/password', { newPassword, confirmPassword }),

  deleteAccount: () => apiClient.delete('/users/account'),


  completeOnboarding: (data) =>
    apiClient.post('/users/onboarding/complete', data),
  
  getOnboardingStatus: () =>
    apiClient.get('/users/onboarding/status'),
  
  uploadProfilePicture: (file) => {
    const formData = new FormData();
    formData.append('file', file);
    return apiClient.post('/users/profile-picture', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
  },
  
  getCreatorPage: (username) =>
    apiClient.get(`/creators/${username}`),
  
  getCreatorStats: () =>
    apiClient.get('/creator/stats'),

  getCreatorSettings: () =>
    apiClient.get('/creator/settings'),

  updateCreatorSettings: (settings) =>
    apiClient.put('/creator/settings', settings),

  getSupporters: () =>
    apiClient.get('/creator/supporters'),

  getAnalytics: (range = '30d') =>
    apiClient.get(`/creator/analytics?range=${range}`),
};

export default userService;
