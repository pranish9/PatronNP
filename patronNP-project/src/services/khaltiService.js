import apiClient from "./apiClient";

export const initiateKhaltiPayment = async ({ creatorUsername, amount, buyerEmail, buyerPhone }) => {
  const { data } = await apiClient.post("/payment/khalti/initiate", {
    creatorUsername,
    amount,
    buyerEmail,
    buyerPhone,
  });
  return data;
};

export const initiateKhaltiTip = async ({
  creatorUsername,
  amount,
  supporterName,
  message,
  isPrivate,
  isMonthly,
  buyerEmail,
  buyerPhone,
}) => {
  const { data } = await apiClient.post("/payment/khalti/tip/initiate", {
    creatorUsername,
    amount,
    supporterName,
    message,
    isPrivate,
    isMonthly,
    buyerEmail,
    buyerPhone,
  });
  return data;
};

export const redirectToKhalti = (paymentUrl) => {
  window.location.href = paymentUrl;
};
