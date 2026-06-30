import apiClient from "./apiClient";

export const getMyTransactions = async (page = 0, size = 10) => {
  const { data } = await apiClient.get("/payment/transactions", {
    params: { page, size },
  });
  return data;
};
