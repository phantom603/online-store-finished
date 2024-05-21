import BaseComponent from "../base-component.js";
import { debounce } from "./debounce/index.js";

import "./search-style.css";

export default class Search extends BaseComponent {
  onKeyUp = debounce((event) => {
    const title = event.target.value.trim();

    this.dispatchEvent("search-filter", title);
  }, 300);

  constructor() {
    super();
    this.init();
    this.addEventListeners();
  }

  get template() {
    return `
      <form>
        <div class="os-form-input use-icon">
          <input id="search-input"
                 type="text"
                 data-element="search"
                 placeholder="Search">
          <label class="bi bi-search input-icon"
                 for="search-input"></label>
        </div>
      </form>
    `;
  }

  addEventListeners() {
    this.subElements.search.addEventListener("input", this.onKeyUp);
  }

  clear() {
    this.element.reset();
  }
}
