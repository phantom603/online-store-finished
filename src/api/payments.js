import { httpRequest } from "../request/index.js";

const getBaseUrl = () => {
  const { PAYMENTS_SERVICE_URL } = window[Symbol.for("app-config")];
  return new URL(PAYMENTS_SERVICE_URL);
};

export const getClientSecret = async () => {
  const result = await httpRequest.post(getBaseUrl(), {
    credentials: "include",
  });

  return result;
};
