import { httpRequest } from "../request/index.js";

const getBaseUrl = () => {
  const { PRODUCTS_SERVICE_URL } = window[Symbol.for("app-config")];
  return new URL(PRODUCTS_SERVICE_URL);
};

export const getProducts = async (search = {}) => {
  const url = new URL("products", getBaseUrl());

  url.search = search;

  const response = await httpRequest.request(url);
  const total = parseInt(response.headers.get("X-Total-Count"), 10);
  const products = await response.json();

  return {
    products,
    total,
  };
};

const IMGUR_CLIENT_ID = "b73c45aa9239cb4";

export const createProduct = async (options = {}) => {
  const url = new URL("products", getBaseUrl());

  const result = await httpRequest.post(url, {
    ...options,
  });

  return result;
};

export const getCategories = async () => {
  const result = await httpRequest.get(new URL("categories", getBaseUrl()));

  return result;
};

export const getBrands = async () => {
  const result = await httpRequest.get(new URL("brands", getBaseUrl()));

  return result;
};
