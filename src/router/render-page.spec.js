jest.mock("../pages/home/index.js");

import { renderPage } from "./render-page.js";

describe("init", () => {
  beforeAll(() => {
    document.body.innerHTML = "<div id='content'></div>";
  });

  afterEach(() => {
    document.body.innerHTML = "";
  });

  it("should be rendered correctly", async () => {
    const page = await renderPage("home", "match", "search");

    expect(page).toBeDefined();
    expect(page.constructor).toHaveBeenCalledWith("match", "search");
  });
});
