import BaseComponent from "../base-component";

import "./card-list-style.css";

export default class CardsList extends BaseComponent {
  element;
  subElements = {};

  constructor({ data = [], Component = {} } = {}) {
    super();
    this.data = data;
    this.Component = Component;

    this.init();
    this.update(this.data);
  }

  get template() {
    return `
      <div>
        <div class="os-products-list" data-element="body"></div>
      </div>
    `;
  }

  update(data = []) {
    this.data = data;

    if (this.data.length) {
      const cards = data.map((item) => new this.Component(item).element);

      this.subElements.body.replaceChildren(...cards);
    } else {
      this.subElements.body.innerHTML = "No products found";
    }
  }
}
