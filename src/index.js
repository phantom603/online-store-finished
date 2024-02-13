import "../config.js";

import App from "./app.js";
import router from "./router/index.js";

// NOTE: validate...
const validateEnv = () => {
  const config = window[Symbol.for("app-config")];

  for (const [key, value] of Object.entries(config)) {
    if (!value) {
      throw new Error(`Env variable ${key} must be defined`);
    }
  }
};

validateEnv();

const app = new App();
const root = document.getElementById("root");

router
  .addRoute({
    pattern: /^$/,
    path: "home",
  })
  .addRoute({
    pattern: /^home$/,
    path: "home",
  })
  .addRoute({
    pattern: /^cart$/,
    path: "cart",
  })
  .addRoute({
    pattern: /^payment-status$/,
    path: "payment-status",
  })
  .addRoute({
    pattern: /^create-product$/,
    path: "create-product",
  })
  .listen();

root.append(app.element);
