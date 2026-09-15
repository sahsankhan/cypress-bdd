const { fetchInStockProduct, uiBaseUrl } = require('../support/toolshop');

class HomePage {
  addFirstProductToCart() {
    fetchInStockProduct().then((product) => {
      cy.wrap(product.name).as('productName');
      cy.visit(`${uiBaseUrl()}/product/${product.id}`);
      cy.get('[data-test="add-to-cart"]').click();
      cy.get('[data-test="nav-cart"]').click();
    });
  }
}

module.exports = { HomePage };
