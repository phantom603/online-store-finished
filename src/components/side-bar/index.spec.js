import SideBar from "./index.js";
import { categoryFilterConfig, brandFilterConfig } from "./config.js";

describe("SideBar", () => {
  let sideBar;

  beforeEach(() => {
    sideBar = new SideBar(categoryFilterConfig, brandFilterConfig);

    document.body.append(sideBar.element);
  });

  afterEach(() => {
    sideBar.destroy();
    sideBar = null;
  });

  it("should be rendered correctly", () => {
    expect(sideBar.element).toBeInTheDocument();
    expect(sideBar.element).toBeVisible();
  });

  it("should call 'add-filter' event with selected category value", () => {
    const { categoriesFilter } = sideBar.subElements;
    const [firsFilter] = categoryFilterConfig;

    const filterElement = categoriesFilter.querySelector(
      `[value='${firsFilter.value}']`,
    );

    const mockDispatchEvent = jest.spyOn(
      sideBar.components.categoriesFilter,
      "dispatchEvent",
    );

    filterElement.click();

    expect(mockDispatchEvent).toHaveBeenCalled();
    expect(mockDispatchEvent).toHaveBeenCalledWith(
      "add-filter",
      firsFilter.value,
    );
  });

  it("should call 'add-filter' event with selected brand value", () => {
    const { brandFilter } = sideBar.subElements;
    const [firsFilter] = brandFilterConfig;

    const filterElement = brandFilter.querySelector(
      `[value='${firsFilter.value}']`,
    );

    const mockDispatchEvent = jest.spyOn(
      sideBar.components.brandFilter,
      "dispatchEvent",
    );

    filterElement.click();

    expect(mockDispatchEvent).toHaveBeenCalled();
    expect(mockDispatchEvent).toHaveBeenCalledWith(
      "add-filter",
      firsFilter.value,
    );
  });

  it("should call event 'clear-filters'", () => {
    const { clearFilters } = sideBar.subElements;
    const mockDispatchEvent = jest.spyOn(sideBar, "dispatchEvent");

    clearFilters.dispatchEvent(new CustomEvent("pointerdown"));

    expect(mockDispatchEvent).toHaveBeenCalledWith("clear-filters");
  });

  it("should have ability to be destroyed", () => {
    sideBar.destroy();

    expect(sideBar.element).not.toBeInTheDocument();
  });
});
