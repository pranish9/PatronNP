import apiClient from './apiClient';

export const paymentAccountService = {
  getAccount: () => apiClient.get('/payment/account'),

  sendOtp: (phoneNumber, provider) =>
    apiClient.post('/payment/send-otp', { phoneNumber, provider }),

  verifyOtp: (phoneNumber, otp) =>
    apiClient.post('/payment/verify-otp', { phoneNumber, otp }),
};

export default paymentAccountService;
