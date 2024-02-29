import NavigationBar from "../components/navigation-bar/index.js";
import routes from "./routes.js";

import { signOut } from "../api/auth.js";

import "./app.css";

export default class App {
  element;
  components = {};

  constructor({ router = {} } = {}) {
    this.router = router;

    this.initRouter();
    this.initComponents();

    this.render();
    this.getSubElements();
    this.renderComponents();
    this.initEventListeners();
  }

  initComponents() {
    this.components.navigationBar = new NavigationBar();
  }

  initRouter() {
    for (const route of routes) {
      this.router.addRoute(route);
    }

    this.router.listen();
  }

  renderComponents() {
    Object.keys(this.components).forEach((component) => {
      const root = this.subElements[component];
      const { element } = this.components[component];

      if (element) {
        root.append(element);
      }
    });
  }

  initEventListeners() {
    document.addEventListener("login", () => {
      this.components.navigationBar.update();
    });

    document.addEventListener("logout", async () => {
      try {
        await signOut();

        this.element.dispatchEvent(
          new CustomEvent("show-success-alert", {
            bubbles: true,
            detail: "Logout success",
          }),
        );
      } catch (error) {
        this.element.dispatchEvent(
          new CustomEvent("show-error-alert", {
            bubbles: true,
            detail: error.message,
          }),
        );
      }
      this.components.navigationBar.update();
    });
  }

  get template() {
    return `
      <main class="app-main">
        <header class="header" data-element="navigationBar"></header>
        <div id="content" class="content"></div>
      </main>
    `;
  }

  render() {
    const wrapper = document.createElement("div");

    wrapper.innerHTML = this.template;

    this.element = wrapper.firstElementChild;
  }

  getSubElements() {
    const result = {};
    const subElements = this.element.querySelectorAll("[data-element]");

    for (const item of subElements) {
      result[item.dataset.element] = item;
    }

    this.subElements = result;
  }

  remove() {
    if (this.element) {
      this.element.remove();
    }
  }

  destroy() {
    this.remove();
    this.element = null;
    this.subElements = {};
  }
}
