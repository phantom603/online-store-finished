import CustomAlert from "./index.js";

describe("Alert component", () => {
  let alert;

  beforeEach(() => {
    alert = new CustomAlert();

    document.body.append(alert.element);
  });

  afterEach(() => {
    alert.destroy();
    alert = null;
    document.body.innerHTML = "";
  });

  it("should be rendered correctly", () => {
    expect(alert.element).toBeInTheDocument();
    expect(alert.element).toBeVisible();
  });

  it("should have ability to be destroyed", () => {
    alert.destroy();

    expect(alert.element).not.toBeInTheDocument();
  });
});
