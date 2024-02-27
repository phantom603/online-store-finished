import "../config.js";

import App from "./app.js";
import router from "./router/index.js";
import { isAuthorized } from "./router/guards/index.js";

import productStore from "./storage/store.js";
import userStore from "./storage/user.js";

import alertsService from "./alerts-service/index.js";

// TODO: add tests for this module

const validateEnv = () => {
  const config = window[Symbol.for("app-config")];

  for (const [key, value] of Object.entries(config)) {
    if (!value) {
      throw new Error(`Env variable ${key} must be defined`);
    }
  }
};

validateEnv();

productStore.init();
userStore.init();
alertsService.init();

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
    pattern: /^payment$/,
    path: "payment",
    guards: [isAuthorized],
  })
  .addRoute({
    pattern: /^payment-status$/,
    path: "payment-status",
    guards: [isAuthorized],
  })
  .addRoute({
    pattern: /^orders$/,
    path: "orders",
    guards: [isAuthorized],
  })
  .addRoute({
    pattern: /^create-product$/,
    path: "create-product",
    guards: [isAuthorized],
  })
  .addRoute({
    pattern: /^login$/,
    path: "login",
    guards: [() => !isAuthorized()],
  })
  .listen();

root.append(app.element);
