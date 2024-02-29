import { isAuthorized } from "../router/guards/index.js";

const routes = [
  {
    pattern: /^$/,
    path: "home",
  },
  {
    pattern: /^home$/,
    path: "home",
  },
  {
    pattern: /^cart$/,
    path: "cart",
  },
  {
    pattern: /^payment$/,
    path: "payment",
    guards: [isAuthorized],
  },
  {
    pattern: /^payment-status$/,
    path: "payment-status",
    guards: [isAuthorized],
  },
  {
    pattern: /^orders$/,
    path: "orders",
    guards: [isAuthorized],
  },
  {
    pattern: /^create-product$/,
    path: "create-product",
    guards: [isAuthorized],
  },
  {
    pattern: /^login$/,
    path: "login",
    guards: [() => !isAuthorized()],
  },
];

export default routes;
