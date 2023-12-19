export default class Cart {
  items = {};

  constructor() {
    this.render();
    this.getSubElements();
    this.initEventListeners();
  }

  get template() {
    return `
      <div class="cart-container">
        <ul class="cart-list" data-element='list'>

        </ul>
        <div class="footer">
          <div class="cart-total">
            Total: <span data-element="total">0</span>
          </div>
          <button class="order-btn os-btn-primary" data-element="orderBtn">Order</button>
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
        const counterBox = counterContainer.querySelector(
          `[data-element="${id}"]`,
        );
        const currentValue = counterBox.innerHTML;

        const value = parseInt(currentValue, 10) + parseInt(counter, 10);

        if (parseInt(counter, 10) > 0) {
          this.element.dispatchEvent(
            new CustomEvent("add-to-cart", {
              detail: this.items[id],
              bubbles: true,
            }),
          );
        } else {
          this.element.dispatchEvent(
            new CustomEvent("remove-from-cart", {
              bubbles: true,
            }),
          );
        }

        if (value === 0) {
          delete this.items[id];
          counterContainer.remove();
        } else {
          this.items[id].count = value;
          counterBox.innerHTML = value;
          this.updatePrice(this.items[id]);
        }

        this.updateTotal();
      }
    });
  }

  updatePrice(item) {
    const counterContainer = this.element.querySelector(
      `[data-id="${item.id}"]`,
    );

    if (counterContainer) {
      const price = counterContainer.querySelector('[data-element="price"]');
      const counter = counterContainer.querySelector(
        `[data-element="${item.id}"]`,
      );

      price.innerHTML = item.price * item.count;
      counter.innerHTML = item.count;
    }
  }

  add(item = {}) {
    const currentItem = this.items[item.id];

    if (currentItem) {
      currentItem.count += 1;
      this.updatePrice(currentItem);
    } else {
      const preparedItem = { ...item, count: 1 };
      this.items[item.id] = preparedItem;
      const element = this.renderItem(preparedItem);
      this.subElements.list.append(element);
    }

    this.updateTotal();
  }

  updateTotal() {
    const total = Object.keys(this.items).reduce((accum, key) => {
      const result = accum + this.items[key].count * this.items[key].price;

      return result;
    }, 0);

    this.subElements.total.innerHTML = total;
  }

  renderItem(item = {}) {
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
