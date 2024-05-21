import BaseComponent from "../../components/base-component.js";
import productStore from "../../storage/store.js";
import { getPaymentStatus } from "../../api/payments.js";

export default class PaymentStatusPage extends BaseComponent {
  constructor(match, search) {
    super();
    this.productStore = productStore;
    this.getPaymentStatus = getPaymentStatus;
    this.sessionId = new URLSearchParams(search).get("session_id");

    this.init();
    this.update();
  }

  async update() {
    const { paymentStatus } = this.subElements;

    try {
      const result = await this.getPaymentStatus(this.sessionId);

      if (result.status === "complete") {
        // NOTE: clear product cart
        this.productStore.removeAll();
        paymentStatus.innerHTML = this.successTemplate;
      } else {
        paymentStatus.innerHTML = this.errorTemplate;
      }
    } catch (error) {
      paymentStatus.innerHTML = this.errorTemplate;
    }
  }

  get successTemplate() {
    return `
      <div>
        <div class="mb-4 text-center">
          <svg xmlns="http://www.w3.org/2000/svg" class="text-success" width="75" height="75"
            fill="currentColor" class="bi bi-check-circle-fill" viewBox="0 0 16 16">
            <path d="M16 8A8 8 0 1 1 0 8a8 8 0 0 1 16 0zm-3.97-3.03a.75.75 0 0 0-1.08.022L7.477 9.417 5.384 7.323a.75.75 0 0 0-1.06 1.06L6.97 11.03a.75.75 0 0 0 1.079-.02l3.992-4.99a.75.75 0 0 0-.01-1.05z" />
          </svg>
        </div>
        <div class="text-center">
          <h1>Thank You !</h1>
          <p>Payment successfully passed</p>
          <a href="/home"><button class="btn btn-primary">Back Home</button></a>
        </div>
      </div>
    `;
  }

  get errorTemplate() {
    return `
      <div>
        Something went wrong!
      </div>
    `;
  }

  get template() {
    return `<div>
      <h2 class="app-page-title">Payment Status</h2> 
      <div class="d-flex justify-content-center align-items-center" data-element="paymentStatus"></div>
    </div>`;
  }
}
