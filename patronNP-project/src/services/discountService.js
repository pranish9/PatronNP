import apiClient from './apiClient';

export const discountService = {
  createDiscount: (discount) => apiClient.post('/creator/discounts', discount),

  getDiscounts: () => apiClient.get('/creator/discounts'),

  deleteDiscount: (id) => apiClient.delete(`/creator/discounts/${id}`),

  applyDiscount: (username, { code, productIds, subtotal }) =>
    apiClient.post(`/creators/${username}/discounts/apply`, { code, productIds, subtotal }),
};

export default discountService;
