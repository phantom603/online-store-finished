import Cart from "./index.js";

describe("Cart component", () => {
  let cart;

  beforeEach(() => {
    cart = new Cart();

    document.body.append(cart.element);
  });

  afterEach(() => {
    cart.destroy();

    document.body.innerHTML = "";
  });

  it("should be rendered correctly", () => {
    expect(cart.element).toBeInTheDocument();
    expect(cart.element).toBeVisible();
  });

  it("should have ability to be destroyed", () => {
    cart.destroy();

    expect(cart.element).not.toBeInTheDocument();
  });
});
