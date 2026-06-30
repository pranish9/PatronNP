import apiClient from "./apiClient";

export const getRecentSupporters = async (username, page = 0, size = 10) => {
  const { data } = await apiClient.get(`/creators/${username}/recent-supporters`, {
    params: { page, size },
  });
  return data;
};
