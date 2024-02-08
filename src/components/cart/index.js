import productStore from "../../../storage/store.js";

export default class Cart {
  constructor() {
    this.productStore = productStore;

    this.render();
    this.getSubElements();
    this.renderItems();
    this.initEventListeners();
  }

  renderItems() {
    const items = this.productStore.getAll();

    for (const item of Object.values(items)) {
      const element = this.createItem(item);
      this.subElements.list.append(element);
    }
  }

  get template() {
    const total = this.productStore.getTotal();

    return `
      <div class="cart-container">
        <ul class="cart-list" data-element='list'>

        </ul>
        <div class="footer">
          <div class="cart-total">
            Total: <span data-element="total">${total}</span>
          </div>
          <button class="order-btn os-btn-primary" data-element="clearCartBtn">Clear Cart</button>
          <!--<button class="" data-element="orderBtn">Order</button>-->
        </div>
      </div>
    `;
  }

  render() {
    const element = document.createElement("div");

    element.innerHTML = this.template;

    this.element = element.firstElementChild;
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
          this.element.dispatchEvent(
            new CustomEvent("increase-counter", {
              detail: id,
              bubbles: true,
            }),
          );
        }

        if (counter === "-1") {
          this.element.dispatchEvent(
            new CustomEvent("decrease-counter", {
              detail: id,
              bubbles: true,
            }),
          );
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
      this.subElements.list.innerHTML = "";
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

  remove() {
    if (this.element) {
      this.element.remove();
    }
  }

  destroy() {
    this.remove();
    this.element = null;
    this.subElements = {};
  }
}
