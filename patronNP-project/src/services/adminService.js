import apiClient from "./apiClient";

const adminService = {
  getOverview: () => apiClient.get("/admin/overview"),

  getCommissionStats: () => apiClient.get("/admin/stats/commission"),

  getTransactions: (category, page = 0, size = 20) =>
    apiClient.get("/admin/transactions", { params: { category: category || undefined, page, size } }),
};

export default adminService;
