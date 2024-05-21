import BaseComponent from "../../components/base-component.js";
import Cart from "../../components/cart";

export default class CartPage extends BaseComponent {
  components = {};

  constructor() {
    super();
    this.components.cart = new Cart();

    this.init();
    this.element.append(this.components.cart.element);
  }

  get template() {
    return `<div>
      <h2 class="app-page-title">Cart Page</h2> 
    </div>`;
  }
}
