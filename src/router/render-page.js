// NOTE: please check parcel doc https://parceljs.org/features/dependency-resolution/#glob-specifiers
const pages = import("../pages/*/index.js");

export const renderPage = async (path, match, search) => {
  // NOTE: for lazy loading in browser or webpack use the next approach
  // const { default: Page } = await import(`../pages/${path}/index.js`);
  const pagesList = await pages;
  const { default: Page } = await pagesList[path]();
  const content = document.querySelector("#content");

  content.innerHTML = "";

  const page = new Page(match, search);

  content.append(page.element);

  return page;
};
