import apiClient from './apiClient';

export const userService = {
  getProfile: () => apiClient.get('/users/profile'),
  updateCreatorPage: (formData) =>
  apiClient.put("/creator/page", formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  }),
  updateProfile: (data) =>
    apiClient.put('/users/profile', data),
  
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
  
  getSupporters: () =>
    apiClient.get('/creator/supporters'),
  
  getAnalytics: (range = '30d') =>
    apiClient.get(`/creator/analytics?range=${range}`),
};

export default userService;
