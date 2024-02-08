import "../config.js";

import App from "./app.js";
import router from "./router/index.js";

const app = new App();
const root = document.getElementById("root");

root.append(app.element);

router
  .addRoute({
    pattern: /^$/,
    path: "home",
  })
  .addRoute({
    pattern: /^payment-status$/,
    path: "payment-status",
  })

  .listen();

root.append(app.element);
