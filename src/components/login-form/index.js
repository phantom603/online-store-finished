import { signin } from "../../api/auth.js";

import "./login-form.css";

export default class LoginForm {
  constructor(onSuccessCallback = () => {}, onErrorCallback = () => {}) {
    this.signin = signin;

    this.onSuccessCallback = onSuccessCallback;
    this.onErrorCallback = onErrorCallback;

    this.render();
    this.getSubElements();
    this.initEventListeners();
  }

  get template() {
    return `<div class="login-form-wrapper">
      <form class="login-form" data-element="formElement" novalidate>
        <div class="container mt-5 mb-5">
          <div class="row justify-content-center">
            <div class="col-md-8">
              <h2 class="mb-4">Login</h2>
              <form id="loginForm">
                <div class="mb-3">
                  <label for="username" class="form-label">Username</label>
                  <input
                    type="email"
                    class="form-control"
                    id="username"
                    name="email"
                    required
                  />
                  <div class="invalid-feedback">Please fill email</div>
                </div>
                <div class="mb-3">
                  <label for="password" class="form-label">Password</label>
                  <input
                    type="password"
                    class="form-control"
                    id="password"
                    name="password"
                    required
                  />
                  <div class="invalid-feedback">Please fill password</div>
                </div>
                <button type="submit" class="btn btn-primary">Login</button>

                <div class="invalid-feedback">Invalid Credentials</div>
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

  onSuccess() {
    this.element.dispatchEvent(new CustomEvent("login", { bubbles: true }));
    this.onSuccessCallback();
  }

  onError() {
    this.onErrorCallback();
  }

  initEventListeners() {
    const { formElement } = this.subElements;

    formElement.addEventListener("submit", async (event) => {
      event.preventDefault();

      if (!formElement.checkValidity()) {
        formElement.classList.add("was-validated");
        return;
      }

      const formData = Object.fromEntries(new FormData(formElement));

      try {
        const user = await this.signin({
          body: JSON.stringify(formData),
        });
        this.showAlert("success", "Login success");
        this.onSuccess();
      } catch (error) {
        this.showAlert("error", "Login error");
        formElement.classList.remove("was-validated");
        this.showValidationErrors(error);
        this.onError();
      }
    });
  }

  showAlert(type = "", message = "") {
    this.element.dispatchEvent(
      new CustomEvent(`show-${type}-alert`, { bubbles: true, detail: message }),
    );
  }

  showValidationErrors(error = {}) {
    const errorMsgElement = this.element.querySelector("button");

    errorMsgElement.classList.add("is-invalid");
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
