import apiClient from "./apiClient";

export const reportContent = async (contentType, contentId, reason) => {
  const { data } = await apiClient.post("/reports", { contentType, contentId, reason });
  return data;
};
