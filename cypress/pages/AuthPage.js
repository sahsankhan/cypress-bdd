class AuthPage {
  uniqueAccount() {
    const stamp = `${Date.now()}${Math.floor(Math.random() * 1000)}`;
    return {
      email: `qa.cypress.${stamp}@example.com`,
      password: `Hyb!${stamp}Qa#9`,
    };
  }

  registerUnique() {
    const account = this.uniqueAccount();
    cy.intercept('POST', '**/users/register').as('register');
    cy.visit(`${Cypress.env('uiBaseUrl')}/auth/register`);
    cy.get('[data-test="first-name"]').clear().type('Bdd');
    cy.get('[data-test="last-name"]').clear().type('Tester');
    cy.get('[data-test="dob"]').clear({ force: true }).type('1990-01-15', { force: true });
    cy.get('[data-test="country"]').select('NL');
    cy.get('[data-test="postal_code"]').clear().type('3511AB');
    cy.get('[data-test="house_number"]').clear().type('12');
    cy.get('[data-test="street"]').clear().type('Test Street');
    cy.get('[data-test="city"]').clear().type('Utrecht');
    cy.get('[data-test="state"]').clear().type('Utrecht');
    cy.get('[data-test="phone"]').clear().type('5550100123');
    cy.get('[data-test="email"]').clear().type(account.email);
    cy.get('[data-test="password"]').clear().type(account.password, { parseSpecialCharSequences: false });
    cy.get('[data-test="register-submit"]').should('be.enabled').click();
    cy.wait('@register').its('response.statusCode').should('eq', 201);
    cy.url().should('match', /login/i);
    cy.wrap(account).as('account');
    return account;
  }

  signIn(email, password) {
    cy.visit(`${Cypress.env('uiBaseUrl')}/auth/login`);
    cy.get('[data-test="email"]').clear().type(email);
    cy.get('[data-test="password"]').clear().type(password, { parseSpecialCharSequences: false });
    cy.get('[data-test="login-submit"]').click();
    cy.get('[data-test="nav-menu"]').should('be.visible');
  }
}

module.exports = { AuthPage };
