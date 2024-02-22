const { defineConfig } = require("cypress");

module.exports = defineConfig({
  e2e: {
    baseUrl: 'http://localhost:1234',
    env: {
      api_login_url: 'http://localhost:3000/api/auth/signin',
      create_product_url: '/create-product',
    },
    setupNodeEvents(on, config) {
      // implement node event listeners here
    },
  },
});
