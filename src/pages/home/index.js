import BaseComponent from "../../components/base-component.js";
import Pagination from "../../components/pagination/index.js";

import SideBar from "../../components/side-bar/index.js";
import CardsList from "../../components/cards-list/index.js";

import Card from "../../components/card/index.js";
import Search from "../../components/search/index.js";

import { prepareFilters } from "./prepare-filters.js";
import productStore from "../../storage/store.js";
import { getProducts, getCategories, getBrands } from "../../api/products.js";

import "./home.css";

export default class Page extends BaseComponent {
  components = {};
  pageLimit = 9;
  totalPages = 100;
  filters = new URLSearchParams();
  abortController = new AbortController();

  constructor() {
    super();
    this.productStore = productStore;

    this.getProducts = getProducts;
    this.getCategories = getCategories;
    this.getBrands = getBrands;

    this.filters.set("_page", "1");
    this.filters.set("_limit", this.pageLimit);

    this.init();
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
          <h2 class="app-page-title">Home Page</h2>
          <a href="/cart">
            <button class="cart-btn os-btn-primary" data-element="cartBtn" data-cy="cart-btn">
              <i class="bi bi-cart"></i>
              Cart <span class="${cartBtnClass} cart-count" data-element="cartCounter">${totalProducts}</span>
            </button>
          </a>
        </header>

        <main class="os-products">
          <div data-element="sideBar">
          <!-- SideBar -->
          </div>

          <section>
            <div data-element="search">
              <!-- Search -->
            </div>

            <div data-element="cardsList" data-cy="products-list">
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

  async loadData() {
    const categories = this.getCategories();
    const brands = this.getBrands();
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

  initEventListeners() {
    document.addEventListener(
      "added-to-cart",
      () => {
        const productsCount = this.productStore.getProductsCount();
        const { cartCounter } = this.subElements;

        cartCounter.classList.remove("hidden");
        cartCounter.innerText = productsCount;
      },
      { signal: this.abortController.signal },
    );

    document.addEventListener(
      "removed-from-cart",
      () => {
        const { cartCounter } = this.subElements;
        const productsCount = this.productStore.getProductsCount();

        if (productsCount === 0) {
          cartCounter.classList.add("hidden");
          cartCounter.innerText = 0;
        } else {
          cartCounter.innerText = productsCount;
        }
      },
      { signal: this.abortController.signal },
    );

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
    const { products, total } = await this.getProducts(this.filters);

    if (total > this.totalPages) {
      this.totalPages = total;
    }

    this.components.pagination.update({
      totalPages: Math.ceil(total / this.pageLimit),
      page: this.filters.get("_page"),
    });

    // NOTE: sync backend data with local stored data
    const productsFromStore = this.productStore.getAll();

    for (const product of products) {
      if (productsFromStore[product.id]) {
        product.inStore = true;
      }
    }

    return products;
  }

  afterDestroy() {
    this.abortController.abort();
    this.filters = new URLSearchParams();

    for (const component of Object.values(this.components)) {
      component.destroy();
    }

    this.components = {};
  }
}
