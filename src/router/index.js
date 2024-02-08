import { renderPage } from "./render-page.js";

export class Router {
  static redirectToHome() {
    window.location = "/";
  }

  static redirectTo404() {
    window.location = "/error404";
  }

  routes = [];

  constructor() {
    this.initEventListeners();
  }

  initEventListeners() {
    /*TODO: temporary solution - remove this listener after 
    implementing all navigations via Link component*/
    document.addEventListener("click", (event) => {
      const link = event.target.closest("a");

      if (!link) return;

      const href = link.getAttribute("href");
      const target = link.getAttribute("target");

      if (target === "_blank") {
        return;
      }

      if (href && href.startsWith("/")) {
        event.preventDefault();
        this.navigate(href);
      }
    });
  }

  // NOTE: pattern "Facade"
  redirectTo(path = "") {
    this.navigate(path);
  }

  navigate(path = "") {
    history.pushState(null, null, path);

    this.route();

    window.dispatchEvent(
      new CustomEvent("router-navigate", {
        details: {
          path,
        },
      }),
    );
  }

  changeState(...args) {
    history.pushState(...args);
  }

  addRoute({ pattern, path } = {}) {
    this.routes.push({ pattern, path });
    return this;
  }

  async changePage(path, match, search) {
    if (this.page && this.page.destroy) {
      this.page.destroy();
    }

    return await renderPage(path, match, search);
  }

  get strippedPath() {
    return (
      decodeURI(window.location.pathname)
        // NOTE: clear slashed at the start and at the end: '///foo/bar//' -> 'foo/bar'
        .replace(/^\/+|\/+$/g, "")
        // NOTE: clear slash duplicates inside route: 'foo///bar' -> 'foo/bar'
        .replace(/\/{2,}/g, "/")
    );
  }

  async route() {
    let match;

    for (const route of this.routes) {
      match = this.strippedPath.match(route.pattern);

      if (match) {
        this.page = await this.changePage(
          route.path,
          match,
          window.location.search,
        );
      }
    }

    if (!match) {
      this.page = await this.changePage("error404");
      console.error("Page not found");
    }
  }

  listen() {
    window.addEventListener("popstate", () => {
      this.route();
    });

    this.route();
  }
}

const router = new Router();

export default router;
