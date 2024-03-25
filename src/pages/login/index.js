import BaseComponent from "../../components/base-component.js";
import LoginForm from "../../components/login-form";

export default class LoginPage extends BaseComponent {
  components = {};

  onLoginSuccess = () => {
    this.dispatchEvent("redirect", "home");
  };

  onLoginError = () => {
    console.error("Login failed");
  };

  constructor() {
    super();
    this.components.loginForm = new LoginForm(
      this.onLoginSuccess,
      this.onLoginError,
    );
    this.init();
    this.renderComponents();
  }

  get template() {
    return `<div>
      <div data-element="loginForm"></div>
    </div>`;
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

  afterDestroy() {
    for (const component of Object.values(this.components)) {
      component.destroy();
    }

    this.components = {};
  }
}
