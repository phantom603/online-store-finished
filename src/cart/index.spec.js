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

  test("should render with correct structure", () => {
    expect(cart.element).toBeInTheDocument();
    expect(cart.subElements.list).toBeInTheDocument();
    expect(cart.subElements.total).toBeInTheDocument();
    expect(cart.subElements.orderBtn).toBeInTheDocument();
  });

  it("should have ability to be destroyed", () => {
    cart.destroy();

    expect(cart.element).not.toBeInTheDocument();
  });
});
