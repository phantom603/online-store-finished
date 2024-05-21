describe('Login Flow', () => {
  beforeEach(() => {
    cy.visit('/');
    cy.get("[data-cy='login-btn']").click();
  })

  it('Displays errors on login', () => {
    // incorrect username on purpose
    cy.get("[data-cy='email']").type("foo@bar1.com");
    cy.get("[data-cy='password']").type("foobar");
    // submit
    cy.get("[data-cy='login-submit-btn']").click();

    // check errors
    cy.get("[data-cy='app-modal']").should('exist');
    cy.get("[data-cy='invalid-credentials']").should('be.visible');
    cy.get("[data-cy='alert']").should('be.visible').and('contain', 'Login error');

    // and our cookie should not be set
    cy.getCookie('session').should('not.exist');

    // check if we can access protected resource
    cy.visit(Cypress.env('create_product_url'));
    cy.url().should('not.include', Cypress.env('create_product_url'));
  });

  it('Successfully logs user in', () => {
    // correct email and password
    cy.get("[data-cy='email']").type("foo@bar.com");
    cy.get("[data-cy='password']").type("Qwerty123");
    // submit
    cy.get("[data-cy='login-submit-btn']").click();

    // check everything is correct
    cy.get("[data-cy='app-modal']").should('not.exist');
    cy.get("[data-cy='alert']").should('be.visible').and('contain', 'Login success');

    // and our cookie should be set to 'session'
    cy.getCookie('session').should('exist');

    // check if we can access protected resource
    cy.visit(Cypress.env('create_product_url'));
    cy.url().should('include', Cypress.env('create_product_url'));
  })
})