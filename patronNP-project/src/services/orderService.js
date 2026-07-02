import apiClient from './apiClient';

export const orderService = {
  getOrders: (page = 0, size = 10) =>
    apiClient.get('/creator/orders', { params: { page, size } }),
};

export default orderService;
