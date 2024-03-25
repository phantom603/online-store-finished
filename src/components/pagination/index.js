import BaseComponent from "../base-component.js";

import "./pagination-style.css";

export default class Pagination extends BaseComponent {
  start = 0;
  pageIndex = 0;
  subElements = {};

  constructor({ totalPages = 10, page = 1 } = {}) {
    super();
    this.totalPages = totalPages;
    this.pageIndex = page - 1;
    this.init();
    this.addEventListeners();
    this.update();
  }

  get template() {
    return `
      <nav class="os-pagination">
        <a href="#" class="page-link previous" data-element="nav-prev">
          <i class="bi bi-chevron-left"></i>
        </a>

        <ul class="page-list" data-element="pagination">

        </ul>

        <a href="#" class="page-link next" data-element="nav-next">
          <i class="bi bi-chevron-right"></i>
        </a>
      </nav>
    `;
  }

  goToPrevPage() {
    if (this.pageIndex - 1 >= 0) {
      this.dispatchEvent("page-changed", this.pageIndex - 1);
    }
  }

  goToNextPage() {
    if (this.pageIndex + 1 < this.totalPages) {
      this.dispatchEvent("page-changed", this.pageIndex + 1);
    }
  }

  addEventListeners() {
    this.element.addEventListener("pointerdown", (event) => {
      const navElement = event.target.closest('[data-element^="nav-"]');

      if (navElement) {
        const type = navElement.dataset.element;

        if (type === "nav-prev") {
          this.goToPrevPage();
        }

        if (type === "nav-next") {
          this.goToNextPage();
        }
      }
    });

    this.element.addEventListener("pointerdown", (event) => {
      const pageIndex = parseInt(event.target.dataset.pageIndex, 10);

      if (!isNaN(pageIndex) && this.pageIndex !== pageIndex) {
        this.pageIndex = pageIndex;

        this.dispatchEvent("page-changed", pageIndex);
      }
    });

    document.addEventListener("page-changed", this.onPageChanged);
  }

  onPageChanged = (event) => {
    const pageIndex = parseInt(event.detail, 10);
    const pageItems = this.element.querySelectorAll(
      '[data-element="page-link"]',
    );

    this.pageIndex = pageIndex;

    pageItems.forEach((item) => item.classList.remove("active"));
    pageItems[pageIndex].classList.add("active");
  };

  update({ totalPages = this.totalPages, page = this.pageIndex + 1 } = {}) {
    this.totalPages = totalPages;
    this.pageIndex = page - 1;

    if (this.totalPages < 1) {
      this.subElements.pagination.innerHTML = "No pagination";
      return;
    }

    this.subElements.pagination.innerHTML = this.getPages();
  }

  getPages() {
    const pages = new Array(this.totalPages).fill(true);

    return pages
      .map((item, index) => {
        const isActive = index === this.pageIndex ? "active" : "";

        return `<li>
          <button href="#" 
            data-element="page-link" 
            class="page-link ${isActive}" data-page-index="${index}">${index + 1
          }</button>
        </li>`;
      })
      .join("");
  }

  afterDestroy() {
    document.removeEventListener("page-changed", this.onPageChanged);
  }
}
