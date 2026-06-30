import apiClient from "./apiClient";

export const getStreamAlertSettings = async () => {
  const { data } = await apiClient.get("/stream-alerts/settings");
  return data;
};

export const updateStreamAlertSettings = async (settings) => {
  const { data } = await apiClient.put("/stream-alerts/settings", settings);
  return data;
};

export const getPublicStreamAlertSettings = async (userKey) => {
  const { data } = await apiClient.get(`/stream-alerts/public/${userKey}`);
  return data;
};

export const sendTestStreamAlert = async () => {
  await apiClient.post("/stream-alerts/test");
};
