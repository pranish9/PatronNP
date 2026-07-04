import apiClient from "./apiClient";

export const initiateKhaltiPayment = async ({ creatorUsername, amount, buyerEmail, buyerPhone, items, discountCode }) => {
  const { data } = await apiClient.post("/payment/khalti/initiate", {
    creatorUsername,
    amount,
    buyerEmail,
    buyerPhone,
    items,
    discountCode,
    frontendOrigin: window.location.origin,
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
    frontendOrigin: window.location.origin,
  });
  return data;
};

export const initiateKhaltiMembership = async ({ creatorUsername, levelId, billingCycle, buyerEmail, buyerPhone }) => {
  const { data } = await apiClient.post("/payment/khalti/membership/initiate", {
    creatorUsername,
    levelId,
    billingCycle,
    buyerEmail,
    buyerPhone,
    frontendOrigin: window.location.origin,
  });
  return data;
};

export const redirectToKhalti = (paymentUrl) => {
  window.location.href = paymentUrl;
};
