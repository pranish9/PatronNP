import apiClient from './apiClient';

export const userService = {
  getProfile: () => apiClient.get('/users/profile'),
  
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
    apiClient.get(`/creators/profile/${username}`),
  
  getCreatorStats: () =>
    apiClient.get('/creators/stats'),
  
  getSupporters: () =>
    apiClient.get('/creators/supporters'),
  
  getAnalytics: (range = '30d') =>
    apiClient.get(`/creators/analytics?range=${range}`),
};

export default userService;
