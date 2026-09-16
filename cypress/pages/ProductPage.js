const { fetchInStockProduct, visitApp } = require('../support/toolshop');

class ProductPage {
  openInStockProduct() {
    fetchInStockProduct().then((product) => {
      cy.wrap(product.name).as('productName');
      visitApp(`/product/${product.id}`);
    });
  }

  expectAddToCart() {
    cy.get('[data-test="add-to-cart"]', { timeout: 30_000 }).should('be.visible');
    cy.get('@productName').then((productName) => {
      cy.get('[data-test="product-title"], h1').should('contain.text', productName);
    });
  }
}

module.exports = { ProductPage };
