import Card from "../card/index.js";
import CardsList from "./index.js";

const products = [
  { title: "product 1", rating: 4, price: 100, category: "laptop" },
  { title: "product 2", rating: 5, price: 200, category: "laptop" },
];

describe("CardsList component", () => {
  let cardsList;

  beforeEach(() => {
    cardsList = new CardsList({
      data: products,
      Component: Card,
    });

    document.body.append(cardsList.element);
  });

  afterEach(() => {
    cardsList.destroy();
    cardsList = null;
    document.body.innerHTML = "";
  });

  it("should be rendered correctly", () => {
    expect(cardsList.element).toBeInTheDocument();
    expect(cardsList.element).toBeVisible();
  });

  it("should have appropriate items amount in list", () => {
    const { body } = cardsList.subElements;

    expect(body.childNodes.length).toEqual(products.length);
  });

  it("should have ability to be updated", () => {
    const [firstProduct, secondProduct] = products;
    const cardsList = new CardsList({
      data: [firstProduct],
      Component: Card,
    });

    cardsList.update([secondProduct]);

    const body = cardsList.element.querySelector('[data-element="body"]');

    expect(cardsList.data).toEqual([secondProduct]);
    expect(body).toHaveTextContent(secondProduct.title);
    expect(body).toHaveTextContent(secondProduct.rating);
    expect(body).toHaveTextContent(secondProduct.price);
    expect(body).toHaveTextContent(secondProduct.category);
  });

  it("should show warning message if products list is empty ", () => {
    cardsList.update([]);

    expect(cardsList.subElements.body).toHaveTextContent("No products found");
  });

  it("should have ability to be destroyed", () => {
    cardsList.destroy();

    expect(cardsList.element).not.toBeInTheDocument();
  });
});
