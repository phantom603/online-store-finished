// NOTE: this import needed for bootstrap navigation toaster icon
import { Offcanvas } from "bootstrap";

import Modal from "./components/modal/index.js";
import LoginForm from "./components/login-form/index.js";

import { signOut } from "./api/auth.js";

import "./app.css";

export default class App {
  element;

  constructor() {
    this.render();
    this.getSubElements();
    this.initEventListeners();
  }

  initEventListeners() {
    const { signinBtn, signoutBtn } = this.subElements;

    signinBtn.addEventListener("click", () => {
      const modal = new Modal();

      const loginForm = new LoginForm(() => {
        modal.close();
      });

      modal.addComponent(loginForm);
      modal.open();
    });

    signoutBtn.addEventListener("click", async () => {
      try {
        await signOut();

        this.element.dispatchEvent(
          new CustomEvent("show-success-alert", {
            bubbles: true,
            detail: "Logout success",
          }),
        );
        this.element.dispatchEvent(
          new CustomEvent("logout", {
            bubbles: true,
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
    });
  }

  get template() {
    return `
      <main class="app-main">
        <header class="header">

          <nav class="navbar navbar-expand-lg bg-body-tertiary">
            <div class="container-fluid p-0">

              <button class="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav" aria-controls="navbarNav" aria-expanded="false" aria-label="Toggle navigation">
                <span class="navbar-toggler-icon"></span>
              </button>

              <div class="collapse navbar-collapse" id="navbarNav">
                <ul class="navbar-nav justify-content-end flex-grow-1">
                  <li class="nav-item">
                    <a class="nav-link active" aria-current="page" href="/home">Home</a>
                  </li>

                  <li class="nav-item">
                    <a class="nav-link active" aria-current="page" href="/create-product">Create product</a>
                  </li>

                  <li class="nav-item">
                    <a class="nav-link active" aria-current="page" href="/payment">Payment</a>
                  </li>

                  <li class="nav-item">
                    <a class="nav-link active" aria-current="page" href="/payment-status">Payment Status</a>
                  </li>

                  <li class="nav-item">
                    <a class="nav-link active" aria-current="page" href="/login">Login page</a>
                  </li>

                  <li class="nav-item">
                    <a class="nav-link active" aria-current="page" href="/orders">Orders</a>
                  </li>

                  <li class="nav-item">
                    <button type="button" class="btn btn-link" data-element="signinBtn">Login</button>
                  </li>
                  <li class="nav-item">
                    <button type="button" class="btn btn-link" data-element="signoutBtn">Logout</button>
                  </li>
                </ul>
              </div>
            </div>
          </nav>

        </header>
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
