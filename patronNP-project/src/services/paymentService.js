import apiClient from './apiClient';

export const paymentService = {
  getPaymentMethods: () =>
    apiClient.get('/payments/methods'),
  
  savePaymentMethod: (data) =>
    apiClient.post('/payments/methods', data),
  
  updatePaymentMethod: (id, data) =>
    apiClient.put(`/payments/methods/${id}`, data),
  
  deletePaymentMethod: (id) =>
    apiClient.delete(`/payments/methods/${id}`),
  
  initiatePayment: (creatorId, amount, method) =>
    apiClient.post('/payments/initiate', {
      creatorId,
      amount,
      paymentMethod: method,
    }),
  
  verifyPayment: (paymentId, data) =>
    apiClient.post(`/payments/${paymentId}/verify`, data),
  
  getTransactionHistory: () =>
    apiClient.get('/payments/transactions'),
};

export default paymentService;
