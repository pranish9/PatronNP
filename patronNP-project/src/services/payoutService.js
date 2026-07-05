import apiClient from "./apiClient";

export const getPayoutBalance = async () => {
  const { data } = await apiClient.get("/payment/payouts/balance");
  return data;
};

export const requestPayout = async (amount) => {
  const { data } = await apiClient.post("/payment/payouts", amount ? { amount } : {});
  return data;
};

export const getMyPayouts = async (page = 0, size = 10) => {
  const { data } = await apiClient.get("/payment/payouts", { params: { page, size } });
  return data;
};
