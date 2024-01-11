import "./config.js";

import Modal from "./src/modal/index.js";

import Cart from "./src/cart/index.js";
import Pagination from "./src/pagination/index.js";

import SideBar from "./src/side-bar/index.js";
import CardsList from "./src/cards-list/index.js";

import Card from "./src/card/index.js";
import Search from "./src/search/index.js";

import { request } from "./request/index.js";
import { prepareFilters } from "./prepare-filters/index.js";
import productStore from "./storage/store.js";

export default class Page {
  element;
  subElements = {};
  components = {};
  pageLimit = 9;
  totalPages = 100;
  filters = new URLSearchParams();
  BACKEND_URL = "";

  constructor(url = "") {
    this.BACKEND_URL = url;
    this.filters.set("_page", "1");
    this.filters.set("_limit", this.pageLimit);

    this.productStore = productStore;

    this.render();
    this.getSubElements();
    this.initializeComponents();
    this.renderComponents();
    this.initEventListeners();

    this.loadData();
  }

  get template() {
    const totalProducts = this.productStore.getProductsCount();
    const cartBtnClass = totalProducts > 0 ? "" : "hidden";

    return `
      <div class="os-container">
        <header class="os-header">
          <span class="os-logo-text">Online Store</span>
          <button class="cart-btn os-btn-primary" data-element="cartBtn">
            <i class="bi bi-cart"></i>
            Cart <span class="${cartBtnClass} cart-count" data-element="cartCounter">${totalProducts}</span>
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
    const url = new URL(path, this.BACKEND_URL);

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
      const cart = new Cart();
      this.modal = new Modal(cart);

      this.modal.open();
    });

    document.addEventListener("added-to-cart", () => {
      const productsCount = this.productStore.getProductsCount();
      const { cartCounter } = this.subElements;

      cartCounter.classList.remove("hidden");
      cartCounter.innerText = productsCount;
    });

    document.addEventListener("removed-from-cart", () => {
      const { cartCounter } = this.subElements;
      const productsCount = this.productStore.getProductsCount();

      if (productsCount === 0) {
        cartCounter.classList.add("hidden");
        cartCounter.innerText = 0;
      } else {
        cartCounter.innerText = productsCount;
      }
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
    const url = new URL("products", this.BACKEND_URL);

    url.search = this.filters;

    const response = await fetch(url.toString());
    const totalPages = parseInt(response.headers.get("X-Total-Count"), 10);

    if (totalPages > this.totalPages) {
      this.totalPages = totalPages;
    }

    this.components.pagination.update({
      totalPages: Math.ceil(totalPages / this.pageLimit),
      page: this.filters.get("_page"),
    });

    const products = await response.json();
    // NOTE: sync backend data with local stored data
    const productsFromStore = this.productStore.getAll();

    for (const product of products) {
      if (productsFromStore[product.id]) {
        product.inStore = true;
      }
    }

    return products;
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
