import { httpRequest } from "../request/index.js";

const getBaseUrl = () => {
  const { BACKEND_URL } = window[Symbol.for("app-config")];

  return new URL("payments/", BACKEND_URL);
};

export const getClientSecret = async (data = []) => {
  const result = await httpRequest.post(getBaseUrl(), {
    body: JSON.stringify({
      products: data.map((item) => {
        item.quantity = item.count;
        delete item.count;
        delete item.inStore;
        delete item.id;
        return item;
      }),
    }),
    headers: {
      "Content-Type": "application/json",
    },
  });

  return result;
};

export const getOrders = async () => {
  const orders = await httpRequest.get(new URL("orders", getBaseUrl()));

  return orders;
};

export const getPaymentStatus = async (sessionId = "") => {
  const url = new URL("payment-status", getBaseUrl());

  url.search = new URLSearchParams(`session_id=${sessionId}`);

  const status = await httpRequest.get(url);

  return status;
};
