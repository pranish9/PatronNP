import apiClient from "./apiClient";

export const initiateEsewaPayment = async ({ creatorUsername, amount, buyerEmail, buyerPhone, items, discountCode }) => {
  const { data } = await apiClient.post("/payment/esewa/initiate", {
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

export const initiateEsewaTip = async ({
  creatorUsername,
  amount,
  supporterName,
  message,
  isPrivate,
  isMonthly,
  buyerEmail,
  buyerPhone,
}) => {
  const { data } = await apiClient.post("/payment/esewa/tip/initiate", {
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

export const initiateEsewaMembership = async ({ creatorUsername, levelId, billingCycle, buyerEmail, buyerPhone }) => {
  const { data } = await apiClient.post("/payment/esewa/membership/initiate", {
    creatorUsername,
    levelId,
    billingCycle,
    buyerEmail,
    buyerPhone,
    frontendOrigin: window.location.origin,
  });
  return data;
};

export const initiateEsewaRefundPayout = async ({ subscriptionId, buyerEmail, buyerPhone }) => {
  const { data } = await apiClient.post("/payment/esewa/refund/initiate", {
    subscriptionId,
    buyerEmail,
    buyerPhone,
    frontendOrigin: window.location.origin,
  });
  return data;
};

export const redirectToEsewa = ({ formUrl, fields }) => {
  const form = document.createElement("form");
  form.method = "POST";
  form.action = formUrl;

  Object.entries(fields).forEach(([key, value]) => {
    const input = document.createElement("input");
    input.type = "hidden";
    input.name = key;
    input.value = value;
    form.appendChild(input);
  });

  document.body.appendChild(form);
  form.submit();
};
