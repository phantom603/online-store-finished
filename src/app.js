import { Offcanvas } from "bootstrap";

import Modal from "./components/modal/index.js";
import LoginForm from "./components/login-form/index.js";

import "./app.css";

export default class App {
  element;

  constructor() {
    this.render();
    this.getSubElements();
    this.initEventListeners();
  }

  initEventListeners() {
    const { loginBtn } = this.subElements;

    loginBtn.addEventListener("click", () => {
      const loginForm = new LoginForm();
      this.modal = new Modal(loginForm);

      this.modal.open();
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
                    <button type="button" class="btn btn-link" data-element="loginBtn">Login</button>
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
