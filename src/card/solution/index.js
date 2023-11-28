export default class Card {
  element;

  defaultData = {
    id: '',
    images: [],
    title: '',
    rating: 0,
    price: 0,
    category: '',
    brand: ''
  };

  constructor (data = {}) {
    this.data = {...this.defaultData, ...data};

    this.render();
    this.getSubElements();
    this.addEventListeners();
  }

  get template () {
    return `
      <div class="os-product-card">
        <div class="os-product-img" style="background-image: url(${this.data.images[0]});"></div>

        <div class="os-product-content">
          <div class="os-product-price-wrapper">
            <div class="os-product-rating">
              <span>${this.data.rating}</span>
              <i class="bi bi-star"></i>
            </div>

            <div class="os-product-price">${this.data.price}</div>
          </div>

          <h5 class="os-product-title">${this.data.title}</h5>
          <p class="os-product-description">${this.data.category}</p>
        </div>

        <footer class="os-product-footer">
          <button class="os-btn-primary" data-element="addToCartBtn">
            Add To Cart
          </button>
        </footer>
      </div>
    `;
  }

  render () {
    const wrapper = document.createElement('div');

    wrapper.innerHTML = this.template;

    this.element = wrapper.firstElementChild;
  }

  addEventListeners () {
    this.subElements.addToCartBtn.addEventListener('pointerdown', () => {
      this.dispatchEvent('add-to-cart', this.data);
    });
  }

  dispatchEvent (type = '', payload = {}) {
    this.element.dispatchEvent(new CustomEvent(type, {
      detail: payload,
      bubbles: true
    }));
  }

  getSubElements () {
    const result = {};
    const subElements = this.element.querySelectorAll('[data-element]')

    for (const item of subElements) {
      result[item.dataset.element] = item;
    }

    this.subElements = result;
  }

  remove () {
    if (this.element) {
      this.element.remove();
    }
  }

  destroy () {
    this.remove();
    this.element = null;
    this.subElements = {};
  }
}
