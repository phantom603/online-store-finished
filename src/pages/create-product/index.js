import { createProduct, getBrands, getCategories } from "../../api/products.js";

import "./create-product.css";

export default class CreateProductPage {
  subElements = {};

  constructor() {
    this.createProduct = createProduct;
    this.getCategories = getCategories;
    this.getBrands = getBrands;

    this.render();
    this.getSubElements();
    this.loadData();
    this.initEventListeners();
  }

  initEventListeners() {
    const formElement = this.subElements.form;

    formElement.addEventListener("submit", async (event) => {
      event.preventDefault();

      const data = new FormData(formElement);

      const result = await this.createProduct({
        body: JSON.stringify(Object.fromEntries(data)),
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
      });

      console.log("result", result);

      formElement.reset();
    });
  }

  async loadData() {
    const result = Promise.all([this.getCategories(), this.getBrands()]);

    console.log("result", result);

    return result;
  }

  // async loadCategories() { }
  //
  // async loadBrands() { }

  update() {
    // TODO: update form
  }

  get template() {
    return `<div>
      <h2 class="app-page-title">Create Product</h2> 

      <form data-element="form">
        <div class="mb-3">
          <label for="productTitle" class="form-label">Product title</label>
          <input type="text" name="title" required class="form-control" id="productTitle" placeholder="title">
        </div>

        <div class="mb-3">
          <label for="productPrice" class="form-label">Product price</label>
          <input type="number" name="price" required value="100" min="0" max="85000" step="100" class="form-control" id="productPrice">
        </div>

        <div class="mb-3">
          <label for="productBrand" class="form-label">Product brand</label>
          <select name="brand" id="productBrand" class="form-select">
            <option value="1">One</option>
            <option value="2">Two</option>
            <option value="3">Three</option>
          </select>
        </div>

        <div class="mb-3">
          <label for="productRating" class="form-label">
            Product rating
            <span>0</span>
          </label>
          <div class="w-100">
            <input type="range" name="rating" min="1" max="5" step="1" value="5" class="w-100" id="productRating" list="ratingMarkers">
            <datalist id="ratingMarkers" class="w-100">
              <option value="1" label="1"></option>
              <option value="2" label="2"></option>
              <option value="3" label="3"></option>
              <option value="4" label="4"></option>
              <option value="5" label="5"></option>
            </datalist>
          </div>
        </div>

        <div class="mb-3">
          <label for="productCategory" class="form-label">Product category</label>
          <select name="category" id="productCategory" class="form-select">
            <option value="1">One</option>
            <option value="2">Two</option>
            <option value="3">Three</option>
          </select>
        </div>

        <div class="mb-3">
          <label for="productImage" class="form-label">Product image</label>
          <input class="form-control" type="file" accept=".jpg, .jpeg, .png" id="productImage">
        </div>

        <button class="btn btn-primary" type="submit">Submit</button>
      </form>

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
