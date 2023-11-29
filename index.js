// TODO: change from index.js to solution/index.js
import Modal from "./src/modal/index.js";

// import Cart from '../../../module-3/cart/index.js';
import Cart from "./src/cart/index.js";
import Pagination from "./src/pagination/index.js";

import SideBar from "./src/side-bar/index.js";
import CardsList from "./src/cards-list-v1/index.js";

// import Card from '../../../module-2/card/solution/index.js';
import Card from "./src/card/index.js";
// import Search from '../../search/solution/index.js';
import Search from "./src/search/index.js";

import { request } from "./request/index.js";
import { prepareFilters } from "./prepare-filters/index.js";

// const BACKEND_URL = process.env.BACKEND_URL || `${window.location.href}api/`
const BACKEND_URL = "http://localhost:3001/";

export default class Page {
  element;
  subElements = {};
  components = {};
  pageLimit = 9;
  totalPages = 100;
  filters = new URLSearchParams();

  constructor() {
    this.filters.set("_page", "1");
    this.filters.set("_limit", this.pageLimit);

    this.render();
    this.getSubElements();
    this.initializeComponents();
    this.renderComponents();
    this.initEventListeners();

    this.loadData();
  }

  get template() {
    return `
      <div class="os-container">
        <header class="os-header">
          <span class="os-logo-text">Online Store</span>
          <button class="cart-btn os-btn-primary" data-element="cartBtn">
            <i class="bi bi-cart"></i>
            Cart <span class="hidden cart-count" data-element="cartCounter">0</span>
          </button>
        </header>

        <main class="os-products">
          <div data-element="sideBar">
          <!-- SideBar -->
          </div>

          <section>
            <div data-element="search">
              <!-- Search -->
            </div>

            <div data-element="cardsList">
              <!-- CardsList -->
            </div>

            <footer data-element="pagination" class="os-products-footer">
              <!-- Pagination -->
            </footer>
          </section>
        </main>
      </div>
    `;
  }

  async makeRequest(path = "") {
    const url = new URL(path, BACKEND_URL);

    const [data, error] = await request(url);

    if (data) {
      return Promise.resolve(data);
    }

    return Promise.reject(error);
  }

  async loadData() {
    const categories = this.makeRequest("categories");
    const brands = this.makeRequest("brands");
    const products = this.loadProducts();

    const [categoriesData, brandsData, productsData] = await Promise.all([
      categories,
      brands,
      products,
    ]);

    const categoriesFilter = prepareFilters(categoriesData, "category");
    const brandsFilter = prepareFilters(brandsData, "brand");

    this.components.sideBar.update(categoriesFilter, brandsFilter);
    this.components.cardsList.update(productsData);
  }

  render() {
    const wrapper = document.createElement("div");

    wrapper.innerHTML = this.template;

    this.element = wrapper.firstElementChild;
  }

  initializeComponents() {
    const search = new Search();
    const cardsList = new CardsList({ Component: Card });
    const sideBar = new SideBar();
    const pagination = new Pagination();

    const cart = new Cart();
    const modal = new Modal(cart);

    this.modal = modal;
    this.cart = cart;

    this.components = {
      search,
      cardsList,
      sideBar,
      pagination,
    };
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

  getSubElements() {
    const result = {};
    const elements = this.element.querySelectorAll("[data-element]");

    for (const subElement of elements) {
      const name = subElement.dataset.element;

      result[name] = subElement;
    }

    this.subElements = result;
  }

  initEventListeners() {
    this.subElements.cartBtn.addEventListener("pointerdown", () => {
      this.modal.open();
    });

    document.addEventListener("add-to-cart", (event) => {
      this.cart.add(event.detail);

      const { cartCounter } = this.subElements;
      const value = cartCounter.innerText;

      cartCounter.classList.remove("hidden");
      cartCounter.innerText = parseInt(value, 10) + 1;
    });

    document.addEventListener("remove-from-cart", () => {
      const { cartCounter } = this.subElements;
      const value = cartCounter.innerText;
      const total = parseInt(value, 10) - 1;

      if (total === 0) {
        cartCounter.classList.add("hidden");
      }

      cartCounter.innerText = total;
    });
    this.components.search.element.addEventListener(
      "search-filter",
      (event) => {
        this.filters.set("_page", "1");
        this.filters.set("q", event.detail);

        this.updateProductsList();
      },
    );

    this.components.sideBar.element.addEventListener(
      "range-selected",
      (event) => {
        const { filterName, value } = event.detail;

        this.filters.set("_page", "1");

        const gte = `${filterName}_gte`;
        const lte = `${filterName}_lte`;

        this.filters.set(gte, value.from);
        this.filters.set(lte, value.to);

        this.updateProductsList();
      },
    );

    this.components.sideBar.element.addEventListener("add-filter", (event) => {
      this.filters.set("_page", "1");

      for (const [key, prop] of new URLSearchParams(event.detail)) {
        this.filters.append(key, prop);
      }

      this.updateProductsList();
    });

    this.components.sideBar.element.addEventListener(
      "remove-filter",
      (event) => {
        const [key, prop] = event.detail.split("=");
        const filters = this.filters
          .getAll(key)
          .filter((item) => item !== prop);

        this.filters.set("_page", "1");
        this.filters.delete(key);

        for (const filter of filters) {
          this.filters.append(key, filter);
        }

        this.updateProductsList();
      },
    );

    this.components.sideBar.element.addEventListener("clear-filters", () => {
      this.resetFilters();
      this.components.search.clear();

      this.updateProductsList();
    });

    this.components.pagination.element.addEventListener(
      "page-changed",
      (event) => {
        this.filters.set("_page", event.detail + 1);

        this.updateProductsList();
      },
    );
  }

  resetFilters() {
    this.filters = new URLSearchParams();
    this.filters.set("_page", "1");
    this.filters.set("_limit", this.pageLimit);
  }

  async updateProductsList() {
    const products = await this.loadProducts();

    this.components.cardsList.update(products);
  }

  async loadProducts() {
    const url = new URL("products", BACKEND_URL);

    url.search = this.filters;

    const response = await fetch(url);
    const totalPages = parseInt(response.headers.get("X-Total-Count"), 10);

    if (totalPages > this.totalPages) {
      this.totalPages = totalPages;
    }

    this.components.pagination.update({
      totalPages: Math.ceil(totalPages / this.pageLimit),
      page: this.filters.get("_page"),
    });

    return await response.json();
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
    this.filters = new URLSearchParams();

    for (const component of Object.values(this.components)) {
      component.destroy();
    }

    this.components = {};
  }
}
