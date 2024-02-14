import { httpRequest } from "../request/index.js";

const getBaseUrl = () => {
  const { AUTH_SERVICE_URL } = window[Symbol.for("app-config")];
  return new URL(AUTH_SERVICE_URL);
};

export const signin = async (options = {}) => {
  const url = new URL("signin", getBaseUrl());

  const result = await httpRequest.post(url, {
    headers: {
      "Content-Type": "application/json",
    },
    credentials: "include",
    ...options,
  });

  return result;
};
