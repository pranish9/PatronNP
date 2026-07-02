import apiClient from './apiClient';

export const purchaseService = {
  getMyPurchases: (page = 0, size = 10) =>
    apiClient.get('/users/purchases', { params: { page, size } }),

  getReceipt: (txn) => apiClient.get(`/users/purchases/${txn}`),
};

export default purchaseService;
