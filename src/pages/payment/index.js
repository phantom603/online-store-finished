import BaseComponent from "../../components/base-component.js";
import productStore from "../../storage/store.js";
import { loadStripe } from "@stripe/stripe-js";
import { getClientSecret } from "../../api/payments.js";

export default class PaymentPage extends BaseComponent {
  constructor() {
    super();
    this.productStore = productStore;
    this.getClientSecret = getClientSecret;

    this.products = this.productStore.getAll();

    this.init();

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

  beferDestroy() {
    if (this.checkout) {
      this.checkout.destroy();
    }
  }
}
