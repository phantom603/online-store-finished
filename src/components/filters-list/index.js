import BaseComponent from "../base-component.js";

import "./filter-list-style.css";

export default class FiltersList extends BaseComponent {
  constructor({ title = "", list = [] } = {}) {
    super();
    this.title = title;
    this.list = list;

    this.init();
    this.addEventListeners();
  }

  get template() {
    return `
      <form class="os-form-group divider">
        <h3 class="os-form-title">${this.title}</h3>

        <div data-element="body">${this.body}</div>
      </form>
    `;
  }

  get body() {
    const result = this.list.map((item) => {
      return `<div class="os-filters-panel-item">
        <div class="os-form-checkbox">
          <input id="${item.value}"
            type="checkbox" name="filter" value="${item.value}" ${item.checked ? "checked" : ""
        }>
          <label for="${item.value}">${item.title}</label>
        </div>
      </div>`;
    });

    return result.join("");
  }

  update(list) {
    this.list = list;

    this.subElements.body.innerHTML = this.body;
  }

  reset() {
    this.element.reset();
  }

  addEventListeners() {
    this.element.addEventListener("change", (event) => {
      const { target } = event;
      const eventName = target.checked ? "add-filter" : "remove-filter";

      this.dispatchEvent(eventName, target.value);
    });
  }
}
