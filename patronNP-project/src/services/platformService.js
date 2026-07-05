import apiClient from "./apiClient";

export const getPublicSettings = async () => {
  const { data } = await apiClient.get("/platform/settings");
  return data;
};
