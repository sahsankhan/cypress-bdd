const { When, Then } = require('@badeball/cypress-cucumber-preprocessor');
const { AuthPage } = require('../../pages/AuthPage');
const { HomePage } = require('../../pages/HomePage');

const authPage = new AuthPage();
const homePage = new HomePage();

When('the customer opens the catalog', () => {
  homePage.open();
});

Then('product cards are visible', () => {
  homePage.expectProductCards();
});

When('the customer searches for an in-stock product', () => {
  homePage.searchForInStockProduct();
});

Then('that product is listed', () => {
  homePage.expectSearchListed();
});

Then('the login page is shown', () => {
  authPage.expectLoginPage();
});

Then('the account menu is visible', () => {
  authPage.expectAccountMenu();
});

When('the customer signs in with a wrong password', () => {
  authPage.rejectBadLogin();
});

Then('the login is rejected', () => {
  cy.get('[data-test="login-error"]').should('be.visible');
  cy.get('[data-test="nav-menu"]').should('not.exist');
});
