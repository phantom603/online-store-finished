const login = (email, password) => {
  cy.session(
    [email, password],
    () => {
      cy.visit('/');
      cy.get("[data-cy='login-btn']").click();
      cy.get("[data-cy='email']").type(email);
      cy.get("[data-cy='password']").type(password);
      // submit
      cy.get("[data-cy='login-submit-btn']").click();

      cy.get("[data-cy='alert']").should('be.visible').and('contain', 'Login success');
    }
  )
}

describe('Create Product Flow', () => {
  beforeEach(() => {
    login('foo@bar.com', 'Qwerty123');

    //cy.wait(1000);

  })

  it('should display errors on create-product form', () => {
    cy.visit(Cypress.env('create_product_url'))
    // cy.visit('/');
    // cy.get("[data-cy='login-btn']").click();
    // cy.get("[data-cy='email']").type(email);
    // cy.get("[data-cy='password']").type(password);
    // // submit
    // cy.get("[data-cy='login-submit-btn']").click();

    // cy.visit(Cypress.env('create_product_url'))
    // cy.url().should('include', Cypress.env('create_product_url'))
  })
})