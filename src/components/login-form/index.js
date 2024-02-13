import { httpRequest } from "../../request";
import "./login-form.css";

export default class LoginForm {
  constructor() {
    this.render();
    this.getSubElements();
    this.initEventListeners();
  }

  get template() {
    return `
    <div class="login-form-wrapper">
      <form class="login-form" data-element="formElement">
        <div class="container mt-5 mb-5">
          <div class="row justify-content-center">
            <div class="col-md-8">
              <h2 class="mb-4">Login</h2>
              <form id="loginForm">
                <div class="mb-3">
                  <label for="username" class="form-label">Username</label>
                  <input type="text" class="form-control" id="username" name="email" required>
                </div>
                <div class="mb-3">
                  <label for="password" class="form-label">Password</label>
                  <input type="password" class="form-control" id="password" name="password" required>
                </div>
                <button type="submit" class="btn btn-primary">Login</button>
              </form>
            </div>
          </div>
        </div>
      </form>
    </div>`;
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

  initEventListeners() {
    const { formElement } = this.subElements;
    const url = window[Symbol.for("app-config")].AUTH_SERVICE_URL;

    formElement.addEventListener("submit", async (event) => {
      event.preventDefault();

      const data = Object.fromEntries(new FormData(formElement));

      try {
        await httpRequest(new URL("signin", url), {
          method: "POST",
          body: JSON.stringify(data),
          headers: {
            "Content-Type": "application/json",
          },
          credentials: "include"
        });
      } catch (error) {
        console.error(`Error: ${error.message}`);
      }

      formElement.reset();
    });
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
