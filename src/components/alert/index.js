import { Alert } from "bootstrap";

export default class CustomAlert {
  timerId;
  type = "success";
  constructor(type = "", message = "") {
    this.type = type;
    this.message = message;
    this.render();

    // NOTE: register alert for closing
    new Alert(this.element);

    this.timerId = setTimeout(() => {
      this.close();
    }, 2000);
  }

  close() {
    clearTimeout(this.timerId);

    const alert = Alert.getInstance(this.element);

    if (alert) {
      alert.close();
    }
  }

  get template() {
    return `
      <div class="alert alert-${this.type} alert-dismissible fade show fixed-top w-100" role="alert" data-cy="alert">
        ${this.message}
        <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>
      </div>
    `;
  }

  render() {
    const wrapper = document.createElement("div");

    wrapper.innerHTML = this.template;

    this.element = wrapper.firstElementChild;
  }

  destroy() {
    this.close();
    this.element = {};
  }
}
