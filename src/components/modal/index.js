import BaseComponent from "../base-component.js";

import "./modal-style.css";

export default class Modal extends BaseComponent {
  status = "closed";

  onDocumentClick = (event) => {
    const isModal = event.target.closest('[data-element="modalContainer"]');

    if (!isModal) {
      this.close();
    }
  };

  onDocumentKeyDown = (event) => {
    if (event.code === "Escape") {
      event.preventDefault();
      this.close();
    }
  };

  constructor(component = {}) {
    super();
    this.component = component;
    this.controlSelector = "hidden";
    this.init();
    this.renderComponent();
  }

  addComponent(component = {}) {
    this.component = component;
    this.renderComponent();
  }

  get template() {
    return `<div class="app-modal hidden" data-cy="app-modal">
      <div class="modal__content" data-element="modalContainer">
        <div data-element="content"></div>
      </div>
    </div>`;
  }

  renderComponent() {
    const { content } = this.subElements;

    if (Object.keys(this.component).length) {
      content.append(this.component.element);
    }
  }

  open() {
    document.body.append(this.element);

    this.addEventListeners();
    this.element.classList.remove(this.controlSelector);
  }

  close() {
    this.element.classList.add(this.controlSelector);
    this.remove();
    this.removeEventListeners();
    this.component.destroy();
  }

  addEventListeners() {
    document.addEventListener("keydown", this.onDocumentKeyDown);
    document.addEventListener("pointerdown", this.onDocumentClick, true);
  }

  removeEventListeners() {
    document.removeEventListener("keydown", this.onDocumentKeyDown);
    document.removeEventListener("pointerdown", this.onDocumentClick, true);
  }

  afterDestroy() {
    this.removeEventListeners();
    this.component.destroy();
  }
}
