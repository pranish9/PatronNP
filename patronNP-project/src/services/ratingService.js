import apiClient from './apiClient';

export const ratingService = {
  submitRating: (productId, stars) =>
    apiClient.post(`/products/${productId}/ratings`, { stars }),
};

export default ratingService;
