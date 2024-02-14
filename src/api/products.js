import { httpRequest } from "../request/index.js";
import { uploadToImgur } from "./imgur-img-upload.js";

const getBaseUrl = () => {
  const { PRODUCTS_SERVICE_URL } = window[Symbol.for("app-config")];
  return new URL(PRODUCTS_SERVICE_URL);
};

export const getProducts = async (search = {}) => {
  const url = new URL("products", getBaseUrl());

  url.search = search;

  const { data, response } = await httpRequest.request(url);

  const total = parseInt(response.headers.get("X-Total-Count"), 10);

  return {
    products: data,
    total,
  };
};

export const createProduct = async (body = {}, options = {}) => {
  const url = new URL("products", getBaseUrl());
  const obj = Object.fromEntries(body);

  if (obj.image.size > 0) {
    const response = await uploadToImgur(obj.image);
    const { link } = response.data;

    obj.images = [link];
  }

  // NOTE: cleare image filed because backend expects imageS field
  delete obj.image;

  const result = await httpRequest.post(url, {
    credentials: "include",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(obj),
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
