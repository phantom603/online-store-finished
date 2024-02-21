import productStore from "../../storage/store.js";
import { loadStripe } from "@stripe/stripe-js";
import { getClientSecret } from "../../api/payments.js";

export default class PaymentPage {
  constructor(...props) {
    this.productStore = productStore;
    this.getClientSecret = getClientSecret;

    this.products = this.productStore.getAll();

    this.render();

    if (Object.keys(this.products).length) {
      this.initPaymentForm();
    } else {
      this.showMessageForEmpryCart();
    }
  }

  showMessageForEmpryCart() {
    this.element.append("Cart is empty!");
  }

  async initPaymentForm() {
    try {
      const stripe = await loadStripe(
        window[Symbol.for("app-config")].STRIPE_API_KEY,
      );
      const response = await this.getClientSecret(Object.values(this.products));
      const { clientSecret } = response;

      this.checkout = await stripe.initEmbeddedCheckout({
        clientSecret,
      });

      this.checkout.mount("#checkout");
    } catch (error) {
      this.element.dispatchEvent(
        new CustomEvent("show-error-alert", {
          bubbles: true,
          detail: error.message,
        }),
      );
    }
  }

  get template() {
    return `<div>
      <h2 class="app-page-title">Payment Page</h2>
      <div id="checkout"></div>
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
    if (this.checkout) {
      this.checkout.destroy();
    }
    this.remove();
    this.element = null;
    this.subElements = {};
  }
}
