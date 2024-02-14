import LoginForm from "../../components/login-form";

export default class LoginPage {
  components = {};

  onLoginSuccess = () => {
    this.element.dispatchEvent(
      new CustomEvent("redirect", {
        bubbles: true,
        detail: "home",
      }),
    );
  };

  onLoginError = () => {
    console.error("Login failed");
  };

  constructor() {
    this.components.loginForm = new LoginForm(
      this.onLoginSuccess,
      this.onLoginError,
    );
    this.render();
    this.getSubElements();
    this.renderComponents();
  }

  get template() {
    return `<div>
      <div data-element="loginForm"></div>
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

  renderComponents() {
    Object.keys(this.components).forEach((component) => {
      const root = this.subElements[component];
      const { element } = this.components[component];

      if (element) {
        root.append(element);
      }
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

    for (const component of Object.values(this.components)) {
      component.destroy();
    }

    this.components = {};
  }
}
