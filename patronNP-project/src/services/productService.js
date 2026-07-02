import apiClient from './apiClient';

const toFormData = (product = {}, { featuredImage, digitalFile, publish } = {}) => {
  const formData = new FormData();

  if (product.productType) formData.append('productType', product.productType);
  if (product.name != null) formData.append('name', product.name);
  if (product.description != null) formData.append('description', product.description);
  if (product.price != null) formData.append('price', product.price);
  if (product.successPageType) formData.append('successPageType', product.successPageType);
  if (product.confirmationMessage != null) formData.append('confirmationMessage', product.confirmationMessage);
  if (product.redirectUrl != null) formData.append('redirectUrl', product.redirectUrl);

  (product.categories || []).forEach((c) => formData.append('categories', c));

  formData.append('askQuestion', !!product.askQuestion);
  if (product.questionText != null) formData.append('questionText', product.questionText);

  formData.append('limitSlots', !!product.limitSlots);
  if (product.slotsAvailable != null) formData.append('slotsAvailable', product.slotsAvailable);

  formData.append('specialPriceForMembers', !!product.specialPriceForMembers);
  if (product.memberPrice != null) formData.append('memberPrice', product.memberPrice);

  formData.append('allowBuyerChooseQuantity', !!product.allowBuyerChooseQuantity);

  if (publish != null) formData.append('publish', publish);
  if (featuredImage) formData.append('featuredImage', featuredImage);
  if (digitalFile) formData.append('digitalFile', digitalFile);

  return formData;
};

export const productService = {
  createProduct: (product, files) =>
    apiClient.post('/creator/products', toFormData(product, { ...files, publish: files?.publish ?? false }), {
      headers: { 'Content-Type': 'multipart/form-data' },
    }),

  updateProduct: (id, product, files) =>
    apiClient.put(`/creator/products/${id}`, toFormData(product, files || {}), {
      headers: { 'Content-Type': 'multipart/form-data' },
    }),

  getProducts: (status = 'ACTIVE') =>
    apiClient.get('/creator/products', { params: { status } }),

  getProduct: (id) => apiClient.get(`/creator/products/${id}`),

  deleteProduct: (id) => apiClient.delete(`/creator/products/${id}`),

  duplicateProduct: (id) => apiClient.post(`/creator/products/${id}/duplicate`),

  activateProduct: (id) => apiClient.post(`/creator/products/${id}/activate`),

  deactivateProduct: (id) => apiClient.post(`/creator/products/${id}/deactivate`),

  getPublicProducts: (username) => apiClient.get(`/creators/${username}/products`),

  getPublicProduct: (username, id) => apiClient.get(`/creators/${username}/products/${id}`),
};

// A DB-backed download URL (from resolveContentUrl on the backend) is a relative path
// under /api and needs the same Authorization header as every other API call — a plain
// window.open() wouldn't carry it. A legacy Cloudinary URL is already absolute/public
// and can just be opened directly. This handles both without the caller needing to know
// which kind of URL it got.
export const openProductContent = async (url) => {
  if (!url) return;
  if (!url.startsWith('/')) {
    window.open(url, '_blank', 'noopener,noreferrer');
    return;
  }
  const res = await apiClient.get(url, { responseType: 'blob' });
  const blobUrl = URL.createObjectURL(res.data);
  window.open(blobUrl, '_blank', 'noopener,noreferrer');
  setTimeout(() => URL.revokeObjectURL(blobUrl), 60000);
};

export default productService;
