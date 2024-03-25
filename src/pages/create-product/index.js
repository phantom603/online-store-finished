import BaseComponent from "../../components/base-component.js";
import { createProduct, getBrands, getCategories } from "../../api/products.js";

import "./create-product.css";

export default class CreateProductPage extends BaseComponent {
  constructor() {
    super();
    this.createProduct = createProduct;
    this.getCategories = getCategories;
    this.getBrands = getBrands;

    this.init();
    this.initEventListeners();
    this.loadData();
  }

  async loadData() {
    try {
      const [categories, brands] = await Promise.all([
        this.getCategories(),
        this.getBrands(),
      ]);

      this.update(categories, brands);
    } catch (error) {
      this.showAlert("error", error.message);
    }
  }

  update(categories = [], brands = []) {
    this.updateOptions("brandsSelect", brands);
    this.updateOptions("categoriesSelect", categories);

    this.subElements.fieldset.removeAttribute("disabled");
  }

  updateOptions(name = "", data = []) {
    const fragment = new DocumentFragment();

    for (const brand of data) {
      const key = brand.toLowerCase().split(" ").join("_");
      const option = new Option(brand, key);
      fragment.append(option);
    }

    this.subElements[name].replaceChildren(fragment);
  }

  startLoading() {
    this.subElements.fieldset.setAttribute("disabled", "true");
    this.subElements.submitBtn.innerHTML = `
      <span class="spinner-border spinner-border-sm" aria-hidden="true"></span>
      <span role="status">Loading...</span>
    `;
  }

  stopLoading() {
    this.subElements.fieldset.removeAttribute("disabled");
    this.subElements.submitBtn.innerHTML = "Submit";
  }

  initEventListeners() {
    const formElement = this.subElements.form;

    formElement.addEventListener("submit", async (event) => {
      event.preventDefault();

      if (!formElement.checkValidity()) {
        formElement.classList.add("was-validated");
        return;
      }

      const formData = new FormData(formElement);

      try {
        this.startLoading();
        await this.createProduct(formData);

        this.showAlert("success", "Product was successfully created.");
        formElement.reset();
      } catch (error) {
        this.showAlert("error", "Error during product creation.");
        this.showValidationErrors(error);
      } finally {
        formElement.classList.remove("was-validated");
        this.stopLoading();
      }
    });
  }

  showAlert(type = "", message = "") {
    this.element.dispatchEvent(
      new CustomEvent(`show-${type}-alert`, { bubbles: true, detail: message }),
    );
  }

  // TODO: need to implement
  showValidationErrors(error = {}) {
    if (error.data) {
      for (const item of error.data.errors) {
        console.log(item);
      }
    } else {
      console.log(error.message);
    }
  }

  get template() {
    return `<div>
      <h2 class="app-page-title">Create Product</h2> 

      <form class="w-50" data-element="form" novalidate data-cy="create-product-form">
        <fieldset data-element="fieldset" disabled>
          <div class="mb-3">
            <label for="productTitle" class="form-label">Product title</label>
            <input type="text" name="title" required class="form-control" id="productTitle" placeholder="title" data-cy="title">
            <div class="invalid-feedback">Please fill title</div>
          </div>

          <div class="mb-3">
            <label for="productPrice" class="form-label">Product price</label>
            <input type="number" name="price" required value="100" min="0" max="85000" step="100" class="form-control" id="productPrice" data-cy="price">
            <div class="invalid-feedback">Please set price</div>
          </div>

          <div class="mb-3">
            <label for="productBrand" class="form-label">Product brand</label>
            <select name="brand" data-element="brandsSelect" id="productBrand" class="form-select" data-cy="brand">
              <option>...</option>
            </select>
          </div>

          <div class="mb-3">
            <label for="productRating" class="form-label">
              Product rating
            </label>
            <div class="w-100">
              <input type="range" name="rating" min="1" max="5" step="1" value="5" class="w-100" id="productRating" list="ratingMarkers" data-cy="rating">
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
            <select name="category" data-element="categoriesSelect" id="productCategory" class="form-select" data-cy="category">
              <option>...</option>
            </select>
          </div>

          <div class="mb-3">
            <label for="productImage" class="form-label">Product image</label>
            <input class="form-control" name="image" required type="file" accept=".jpg, .jpeg, .png" id="productImage" data-cy="image">
            <div class="invalid-feedback">Please choose product image</div>
          </div>

          <button class="btn btn-primary" data-element="submitBtn" type="submit" data-cy="create-product-submit-btn">
            Submit
          </button>
        </fieldset>
      </form>
    </div>`;
  }
}
