import "@testing-library/jest-dom";
import fetchMock from "jest-fetch-mock";
import productStore from "./src/storage/store.js";
import userStore from "./src/storage/user.js";
// import prettyFormat from "pretty-format";

fetchMock.enableMocks();

beforeAll(() => {
  window[Symbol.for("app-config")] = {
    BACKEND_URL: "http://example.com/",
  };
  productStore.init();
  userStore.init();
});

afterAll(() => {
  window[Symbol.for("app-config")] = {};
  productStore.destroy();
  userStore.destroy();
});

// const { DOMElement, DOMCollection } = prettyFormat.plugins;
//
// const prettyDOM = (htmlElement, maxLength = 7000) => {
//   const debugContent = prettyFormat(htmlElement, {
//     plugins: [DOMElement, DOMCollection],
//     printFunctionName: false,
//     highlight: true,
//     min: true,
//   });
//
//   return htmlElement.outerHTML.length > maxLength
//     ? `${debugContent.slice(0, maxLength)}...`
//     : debugContent;
// };
//
// console.log = (...args) => {
//   console.trace(
//     ...args.map((item) => {
//       if (item instanceof HTMLElement) {
//         return prettyDOM(item);
//       }
//
//       return item;
//     }),
//   );
// };
