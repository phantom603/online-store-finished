import Cart from "../../components/cart";

export default class CartPage {
  components = {};

  constructor() {
    this.components.cart = new Cart();

    this.render();

    this.element.append(this.components.cart.element);
  }

  get template() {
    return `<div>
      <h2 class="app-page-title">Cart Page</h2> 
    </div>`;
  }

  render() {
    const wrapper = document.createElement("div");

    wrapper.innerHTML = this.template;

    this.element = wrapper.firstElementChild;
  }

  getSubElements() {
    const result = {};
    const subElements = this.element.querySelectorAll("[data-element]");

    for (const item of subElements) {
      result[item.dataset.element] = item;
    }

    this.subElements = result;
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
