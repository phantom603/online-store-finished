import { isAuthorized } from "../../router/guards/index.js";

jest.mock("../../router/guards/index.js");

import NavigationBar from "./index";

describe("NavigationBar", () => {
  let navigationBar;

  beforeAll(() => {
    navigationBar = new NavigationBar();

    document.body.append(navigationBar.element);
  });

  it("should have a method createLinks", () => {
    expect(navigationBar.element).toBeInTheDocument();
    expect(navigationBar.element).toBeVisible();
  });

  it("should dispatch login event", () => {
    isAuthorized.mockReturnValue(false);

    const nav = new NavigationBar();
    const { loginBtn } = nav.subElements;

    loginBtn.click();

    const loginForm = document.body.querySelector(".login-form");

    expect(loginForm).toBeInTheDocument();
    expect(loginForm).toBeVisible();
  });

  it("should dispatch logout event", async () => {
    isAuthorized.mockReturnValue(true);

    const nav = new NavigationBar();
    const { logoutBtn } = nav.subElements;

    jest
      .spyOn(global, "CustomEvent")
      .mockImplementation((type, payload) => ({ type, payload }));

    const mockDispatchEvent = jest
      .spyOn(nav.element, "dispatchEvent")
      .mockImplementation(() => true);

    logoutBtn.click();

    expect(mockDispatchEvent).toHaveBeenCalledWith({
      type: "logout",
      payload: { bubbles: true },
    });
  });
});
