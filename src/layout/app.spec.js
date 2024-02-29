import App from "./app.js";

describe("App", () => {
  let app;

  beforeAll(() => {
    app = new App({
      router: {
        addRoute: () => { },
        listen: () => { },
      },
    });
  });

  it("should be rendered correctly", async () => {
    expect(app.element).toBeDefined();
  });
});
