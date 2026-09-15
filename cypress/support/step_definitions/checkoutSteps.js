const { Given, When, Then } = require('@badeball/cypress-cucumber-preprocessor');
const { AuthPage } = require('../../pages/AuthPage');
const { HomePage } = require('../../pages/HomePage');
const { CheckoutPage } = require('../../pages/CheckoutPage');

const authPage = new AuthPage();
const homePage = new HomePage();
const checkoutPage = new CheckoutPage();

Given('the customer registers a unique account', () => {
  authPage.registerUnique();
});

Given('the customer signs in', () => {
  cy.get('@account').then((account) => {
    authPage.signIn(account.email, account.password);
  });
});

When('they add a product to the cart from the catalog', () => {
  homePage.addFirstProductToCart();
});

Then('the cart shows that product', () => {
  cy.get('@productName').then((productName) => {
    checkoutPage.expectProductInCart(productName);
  });
});

When('they complete checkout with cash on delivery', () => {
  checkoutPage.proceedFromCart();
  checkoutPage.proceedWhenLoggedIn();
  checkoutPage.fillAddress();
  checkoutPage.proceedFromAddress();
  checkoutPage.payCashOnDelivery();
});

Then('the order is confirmed', () => {
  checkoutPage.expectOrderConfirmed();
});
