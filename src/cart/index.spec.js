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

  test("should add item to cart", () => {
    const item = {
      id: "1",
      title: "Test Product",
      images: ["test-image.jpg"],
      price: 19.99,
      count: 1,
    };

    cart.add(item);

    const listItem = cart.element.querySelector(".item-row");
    expect(listItem).toBeInTheDocument();
    expect(listItem.textContent).toContain("Test Product");
    expect(listItem.textContent).toContain("1"); // Initial count
    expect(listItem.textContent).toContain("19.99"); // Initial price

    const total = cart.subElements.total.textContent;
    expect(total).toBe("19.99");
  });

  test("should update count and price when adding the same item again", () => {
    const item = {
      id: "1",
      title: "Test Product",
      images: ["test-image.jpg"],
      price: 19.99,
      count: 1,
    };

    cart.add(item); // Initial addition
    cart.add(item); // Adding the same item again

    const listItem = cart.element.querySelector(".item-row");

    expect(listItem).toBeInTheDocument();

    expect(listItem).toHaveTextContent("Test Product");
    expect(listItem).toHaveTextContent("Test Product");
    expect(listItem).toHaveTextContent("2"); // Updated count
    expect(listItem).toHaveTextContent("39.98"); // Updated price (19.99 * 2)

    const total = cart.subElements.total.textContent;

    expect(total).toBe("39.98");
  });

  it("should remove item when count reaches 0", () => {
    const item = {
      id: "1",
      title: "Test Product",
      images: ["test-image.jpg"],
      price: 19.99,
      count: 1,
    };

    cart.add(item);
    cart.add(item); // Increment count to 2
    cart.add(item); // Increment count to 3
    cart.add(item); // Increment count to 4

    const listItem = cart.element.querySelector(".item-row");

    expect(listItem).toBeInTheDocument();
    expect(listItem.textContent).toContain("4"); // Updated count

    const decreaseCountBtn = cart.element.querySelector('[data-counter="-1"]'); // Decrement count to 3

    decreaseCountBtn.click();
    expect(listItem.textContent).toContain("3"); // Updated count

    decreaseCountBtn.click();
    expect(listItem.textContent).toContain("2"); // Updated count

    decreaseCountBtn.click();
    expect(listItem.textContent).toContain("1"); // Updated count

    decreaseCountBtn.click();

    const updatedListItem = cart.element.querySelector(".item-row");
    expect(updatedListItem).toBeNull();

    const total = cart.subElements.total.textContent;
    expect(total).toBe("0");
  });

  test("should update total when adding and removing items", () => {
    const item1 = {
      id: "1",
      title: "Test Product 1",
      images: ["test-image-1.jpg"],
      price: 10,
      count: 1,
    };

    const item2 = {
      id: "2",
      title: "Test Product 2",
      images: ["test-image-2.jpg"],
      price: 20,
      count: 1,
    };

    cart.add(item1);
    expect(cart.subElements.total.textContent).toBe("10"); // Total for item1

    cart.add(item2);
    expect(cart.subElements.total.textContent).toBe("30"); // Total for item1 + item2

    cart.element.querySelector('[data-counter="-1"]').click();
    expect(cart.subElements.total.textContent).toBe("20"); // Total for item2

    cart.element.querySelector('[data-counter="1"]').click();
    expect(cart.subElements.total.textContent).toBe("40"); // Total for item1 + item3
  });
});
