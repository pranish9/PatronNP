import apiClient from "./apiClient";

const downloadCsv = async (path, params, filename) => {
  const res = await apiClient.get(path, { params, responseType: "blob" });
  const url = window.URL.createObjectURL(new Blob([res.data]));
  const link = document.createElement("a");
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  link.remove();
  window.URL.revokeObjectURL(url);
};

const adminService = {
  getOverview: () => apiClient.get("/admin/overview"),

  getCommissionStats: () => apiClient.get("/admin/stats/commission"),

  getTransactions: (category, page = 0, size = 20) =>
    apiClient.get("/admin/transactions", { params: { category: category || undefined, page, size } }),

  getRevenueTrend: (days = 30) => apiClient.get("/admin/stats/revenue-trend", { params: { days } }),

  getGrowth: (days = 30) => apiClient.get("/admin/stats/growth", { params: { days } }),

  searchUsers: ({ search, role, status, joinedAfter, joinedBefore, page = 0, size = 20 }) =>
    apiClient.get("/admin/users", {
      params: {
        search: search || undefined,
        role: role || undefined,
        status: status || undefined,
        joinedAfter: joinedAfter || undefined,
        joinedBefore: joinedBefore || undefined,
        page,
        size,
      },
    }),

  updateUserStatus: (id, status) => apiClient.patch(`/admin/users/${id}/status`, { status }),

  getCreatorDetail: (id) => apiClient.get(`/admin/creators/${id}`),

  searchPayouts: (status, page = 0, size = 20) =>
    apiClient.get("/admin/payouts", { params: { status: status || undefined, page, size } }),

  markPayoutPaid: (id, reference) => apiClient.patch(`/admin/payouts/${id}/pay`, { reference }),

  rejectPayout: (id, reason) => apiClient.patch(`/admin/payouts/${id}/reject`, { reason }),

  searchRefunds: (status, page = 0, size = 20) =>
    apiClient.get("/admin/refunds", { params: { status: status || undefined, page, size } }),

  resolveRefund: (subscriptionId, approve, reason) =>
    apiClient.post(`/admin/refunds/${subscriptionId}/resolve`, { approve, reason }),

  confirmRefundPayment: (subscriptionId, referenceId, method) =>
    apiClient.post(`/admin/refunds/${subscriptionId}/confirm-payment`, { referenceId, method }),

  searchReports: (status, contentType, page = 0, size = 20) =>
    apiClient.get("/admin/reports", {
      params: { status: status || undefined, contentType: contentType || undefined, page, size },
    }),

  dismissReport: (id, note) => apiClient.post(`/admin/reports/${id}/dismiss`, { note }),

  removeReportedContent: (id, note) => apiClient.post(`/admin/reports/${id}/remove-content`, { note }),

  removeContent: (contentType, contentId) =>
    apiClient.post("/admin/content/remove", { contentType, contentId }),

  restoreContent: (contentType, contentId) =>
    apiClient.post("/admin/content/restore", { contentType, contentId }),

  getSettings: () => apiClient.get("/admin/settings"),

  updateSettings: (updates) => apiClient.patch("/admin/settings", updates),

  exportTransactions: (category) =>
    downloadCsv("/admin/transactions/export", { category: category || undefined }, "transactions.csv"),

  exportPayouts: (status) =>
    downloadCsv("/admin/payouts/export", { status: status || undefined }, "payouts.csv"),

  searchAuditLog: (adminUsername, action, page = 0, size = 20) =>
    apiClient.get("/admin/audit-log", {
      params: { adminUsername: adminUsername || undefined, action: action || undefined, page, size },
    }),

  searchTickets: (status, page = 0, size = 20) =>
    apiClient.get("/admin/support/tickets", { params: { status: status || undefined, page, size } }),

  replyToTicket: (id, reply) => apiClient.post(`/admin/support/tickets/${id}/reply`, { reply }),

  broadcast: (payload) => apiClient.post("/admin/broadcast", payload),
};

export default adminService;
