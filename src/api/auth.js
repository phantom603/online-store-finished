import { httpRequest } from "../request/index.js";

const getBaseUrl = () => {
  const { BACKEND_URL } = window[Symbol.for("app-config")];

  return new URL("auth/", BACKEND_URL);
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

export const signOut = async () => {
  const url = new URL("signout", getBaseUrl());

  return await httpRequest.post(url, {
    headers: {
      "Content-Type": "application/json",
    },
    credentials: "include",
  });
};
