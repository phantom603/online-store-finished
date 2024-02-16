import { httpRequest } from "../request/index.js";

const getBaseUrl = () => {
  const { PAYMENTS_SERVICE_URL } = window[Symbol.for("app-config")];
  return new URL(PAYMENTS_SERVICE_URL);
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
