Cypress.Commands.add('login', (email, password) => {
  cy.session(
    [email, password],
    () => {
      cy.visit('/');
      cy.get("[data-cy='login-btn']").click();
      cy.get("[data-cy='email']").type(email);
      cy.get("[data-cy='password']").type(password);
      // submit
      cy.get("[data-cy='login-submit-btn']").click();

      // HACK
      // make the cypress wait till login is completed
      // otherwise if we try to visit protected page
      // the frontend may not be able to set up the flag that user was logged in
      cy.get("[data-cy='app-modal']").should('not.exist');
      cy.get("[data-cy='alert']").should('be.visible').and('contain', 'Login success');
    }
  )
});