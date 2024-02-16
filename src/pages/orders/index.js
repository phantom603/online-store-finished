import productStore from "../../storage/store.js";
// TODO: uncomment after backend implementation
// import { getOrders } from "../../api/payments.js";

import "./orders.css";

export default class OrdersPage {
  constructor() {
    this.productStore = productStore;
    this.products = this.productStore.getAll();

    this.render();
    this.getSubElements();
    this.loadData();
  }

  async loadData() {
    // TODO: just temporary mocked
    const products = await Promise.resolve(this.products);
    const productsList = Object.values(products);

    this.update(productsList);
  }

  update(productsList = []) {
    const { tbody } = this.subElements;

    tbody.innerHTML = this.getOrdersList(productsList);
  }

  get template() {
    return `<div>
      <h2 class="app-page-title">Orders</h2> 

      <table class="table">
        <thead>
          <tr>
            <th scope="col">#</th>
            <th scope="col">Image</th>
            <th scope="col">Title</th>
            <th scope="col">Count</th>
            <th scope="col">Price</th>
            <th scope="col">Total</th>
            <th scope="col">Status</th>
          </tr>
        </thead>
        <tbody data-element="tbody"></tbody>
      </table>
    </div>`;
  }

  getOrdersList(products = []) {
    if (!products.length) {
      return `<td colspan="7" class="text-center">There is no orders</td>`;
    }

    return products
      .map((product, index) => {
        return `
          <tr>
            <th scope="row">${index + 1}</th>
            <td>
             <div class="item-preview">
               <img src="${product.images[0]}" alt="${product.title}">
             </div>
            </td>
            <td class="w-25">${product.title}</td>
            <td>${product.count}</td>
            <td>${product.price}</td>
            <td>${product.count * product.price}</td>
            <td>Status</td>
          </tr>
      `;
      })
      .join("");
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
