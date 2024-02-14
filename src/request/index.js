export const httpRequest = {
  async request(url = "", options = {}) {
    const urlString = url.toString();
    const response = await fetch(urlString, options);

    if (response.status === 401) {
      throw new UnauthorizedError();
    }

    if (response.status !== 200) {
      throw new FetchError();
    }

    return response;
  },

  async get(url = "", options = {}) {
    try {
      const response = await this.request(url, {
        credentials: "include",
        method: "GET",
        ...options,
      });

      return response.json();
    } catch (error) {
      throw new FetchError(error.message);
    }
  },

  async post(url = "", options = {}) {
    try {
      const response = await this.request(url, {
        credentials: "include",
        method: "POST",
        ...options,
      });

      return response.json();
    } catch (error) {
      throw new FetchError(error.message);
    }
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
  statusCode = 400;

  constructor(message = "") {
    super(`Bad request`, message);
  }
}

export class UnauthorizedError extends CustomError {
  name = "UnauthorizedError";
  statusCode = 401;

  constructor(message = "") {
    super(`Unauthorized`, message);
  }
}

// handle uncaught failed fetch through
window.addEventListener("unhandledrejection", (event) => {
  if (event.reason instanceof CustomError) {
    console.error("unhandledrejection", event.reason);
  }
});
