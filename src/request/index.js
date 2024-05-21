export const httpRequest = {
  async request(url = "", options = {}) {
    const urlString = url.toString();
    const response = await fetch(urlString, options);
    const data = await response.json();

    if (response.status === 401) {
      throw new UnauthorizedError(data, response);
    }

    if (response.status === 400) {
      throw new BadRequestError(data, response);
    }

    return { data, response };
  },

  async get(url = "", options = {}) {
    const { data } = await this.request(url, {
      credentials: "include",
      method: "GET",
      ...options,
    });

    return data;
  },

  async post(url = "", options = {}) {
    const { data } = await this.request(url, {
      credentials: "include",
      method: "POST",
      ...options,
    });
    return data;
  },
};

class CustomError extends Error {
  name = "CustomError";

  constructor(message) {
    super(message);
  }
}

export class FetchError extends CustomError {
  name = "FetchError";

  constructor(data, response = {}, message = "") {
    super(`Bad request ${message}`.trim());

    this.response = response;
    this.data = data;
    this.statusCode = response.status;
  }
}

export class UnauthorizedError extends CustomError {
  name = "UnauthorizedError";
  statusCode = 401;

  constructor(data, response = {}, message = "") {
    super(`Unauthorized ${message}`.trim());

    this.response = response;
    this.data = data;
  }
}

export class BadRequestError extends CustomError {
  name = "BadRequestError";
  statusCode = 400;

  constructor(data, response = {}, message = "") {
    super(`Bad request ${message}`);

    this.response = response;
    this.data = data;
  }
}

// handle uncaught failed fetch through
window.addEventListener("unhandledrejection", (event) => {
  if (event.reason instanceof CustomError) {
    console.error("unhandledrejection", event.reason);
  }
});
