export default class App {
  element;

  constructor() {
    this.render();
  }

  get template() {
    return `
      <div id="content"></div>
    `;
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
