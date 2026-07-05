import apiClient from "./apiClient";

export const submitTicket = async (subject, message) => {
  const { data } = await apiClient.post("/support/tickets", { subject, message });
  return data;
};

export const getMyTickets = async (page = 0, size = 10) => {
  const { data } = await apiClient.get("/support/tickets", { params: { page, size } });
  return data;
};
