const { When, Then } = require('@badeball/cypress-cucumber-preprocessor');
const { ProductPage } = require('../../pages/ProductPage');

const productPage = new ProductPage();

When('the customer opens an in-stock product', () => {
  productPage.openInStockProduct();
});

Then('the add to cart button is visible', () => {
  productPage.expectAddToCart();
});
