import Card from "./index.js";
import { products } from "../../fixtures/products.js";

describe("Card component", () => {
  let card;

  beforeEach(() => {
    card = new Card(products[0]);

    document.body.append(card.element);
  });

  afterEach(() => {
    card.destroy();
    card = null;
    document.body.innerHTML = "";
  });

  it("should be rendered correctly", () => {
    expect(card.element).toBeInTheDocument();
    expect(card.element).toBeVisible();
  });

  it("should have default data", () => {
    const { id, images, title, rating, price, category, brand } =
      card.defaultData;

    // Check if the rendered content contains the correct data
    expect(typeof id).toBe("string");
    expect(Array.isArray(images)).toBe(true);
    expect(typeof title).toBe("string");
    expect(typeof rating).toBe("number");
    expect(typeof price).toBe("number");
    expect(typeof category).toBe("string");
    expect(typeof brand).toBe("string");
  });

  it("should call dispatchEvent on addToCartBtn click", () => {
    const { addToCartBtn } = card.subElements;
    const mockDispatchEvent = jest.spyOn(card, "dispatchEvent");

    addToCartBtn.dispatchEvent(new CustomEvent("pointerdown"));

    expect(mockDispatchEvent).toHaveBeenCalledWith("add-to-cart", card.data);
  });

  it("should render data correctly", () => {
    const testData = {
      id: "1",
      images: ["image-url"],
      title: "Test Product",
      rating: 4,
      price: 19.99,
      category: "Test Category",
      brand: "Test Brand",
    };

    card = new Card(testData);

    document.body.append(card.element);

    const ratingElement = card.element.querySelector(".os-product-rating span");
    const priceElement = card.element.querySelector(".os-product-price");
    const titleElement = card.element.querySelector(".os-product-title");
    const descriptionElement = card.element.querySelector(
      ".os-product-description",
    );

    expect(card.element).toBeInTheDocument();

    expect(titleElement.textContent).toBe("Test Product");
    expect(ratingElement.textContent).toBe("4");
    expect(priceElement.textContent).toBe("19.99");
    expect(descriptionElement.textContent).toBe("Test Brand Test Category");
  });

  it("should have ability to be destroyed", () => {
    card.destroy();

    expect(card.element).not.toBeInTheDocument();
  });
});
