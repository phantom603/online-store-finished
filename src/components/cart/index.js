import BaseComponent from "../base-component.js";
import productStore from "../../storage/store.js";

import "./cart-style.css";

export default class Cart extends BaseComponent {
  emptyCartMessage = "There is no items in the cart";

  constructor() {
    super();
    this.productStore = productStore;

    this.init();
    this.renderItems();
    this.initEventListeners();
  }

  renderItems() {
    const items = this.productStore.getAll();
    const itemsList = Object.values(items);

    if (!itemsList.length) {
      this.subElements.list.innerHTML = this.emptyCartMessage;
      return;
    }

    for (const item of itemsList) {
      const element = this.createItem(item);
      this.subElements.list.append(element);
    }
  }

  get template() {
    const total = this.productStore.getTotal();

    return `
      <div class="cart-container">
        <ul class="cart-list" data-element='list'></ul>
        <div class="footer">
          <div class="cart-total">
            Total: <span data-element="total">${total}</span>
          </div>
          <button class="os-btn-primary" data-element="clearCartBtn">Clear Cart</button>
          <a href="/payment">
            <button class="os-btn-primary" data-element="orderBtn" data-cy="order-btn">Order</button>
          </a>
        </div>
      </div>
    `;
  }

  initEventListeners() {
    // TODO: event "pointerdown" fails tests
    this.element.addEventListener("click", (event) => {
      const countBtn = event.target.closest("[data-counter]");

      if (countBtn) {
        const counterContainer = event.target.closest(
          '[data-element="counterContainer"]',
        );
        const { id } = counterContainer.dataset;
        const { counter } = countBtn.dataset;

        if (counter === "1") {
          this.dispatchEvent("increase-counter", id);
        }

        if (counter === "-1") {
          this.dispatchEvent("decrease-counter", id);
        }

        const productCount = this.productStore.getProductCount(id);

        if (productCount === 0) {
          counterContainer.remove();
        } else {
          this.updatePrice(id);
        }

        this.updateTotal();
      }
    });

    this.subElements.clearCartBtn.addEventListener("click", () => {
      this.productStore.removeAll();
      this.subElements.list.innerHTML = this.emptyCartMessage;
      this.subElements.total.innerHTML = 0;
    });
  }

  updatePrice(id) {
    const product = this.productStore.get(id);
    const counterContainer = this.element.querySelector(`[data-id="${id}"]`);

    if (counterContainer) {
      const price = counterContainer.querySelector('[data-element="price"]');
      const counter = counterContainer.querySelector(`[data-element="${id}"]`);

      price.innerHTML = product.price * product.count;
      counter.innerHTML = product.count;
    }
  }

  updateTotal() {
    const total = this.productStore.getTotal();

    this.subElements.total.innerHTML = total;

    if (total === 0) {
      this.subElements.list.innerHTML = this.emptyCartMessage;
    }
  }

  createItem(item = {}) {
    const wrapper = document.createElement("div");

    const template = `
      <li class="item-row" data-element="counterContainer" data-id="${item.id}">
        <div class="item-preview">
          <img src="${item.images[0]}" alt="${item.title}">
        </div>
        <div class="item-name">
          ${item.title}
        </div>
        <div class="item-counter">
          <button class="count-btn" data-counter="-1">
            <i class="bi bi-dash-circle"></i>
          </button>
          <span data-element="${item.id}">${item.count}</span>
          <button class="count-btn" data-counter="1">
            <i class="bi bi-plus-circle"></i>
          </button>
        </div>
        <div class="item-price" data-element="price">
          ${item.price * item.count}
        </div>
      </li>
    `;

    wrapper.innerHTML = template;

    return wrapper.firstElementChild;
  }
}
