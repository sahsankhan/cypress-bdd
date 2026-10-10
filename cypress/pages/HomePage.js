const { fetchInStockProduct, visitApp } = require('../support/toolshop');

class HomePage {
  open() {
    visitApp('/');
  }

  expectProductCards() {
    cy.get('[data-test="product-name"]', { timeout: 60_000 }).should('be.visible');
  }

  searchForInStockProduct() {
    fetchInStockProduct().then((product) => {
      cy.wrap(product.name).as('productName');
      visitApp('/');
      cy.get('[data-test="search-query"]').clear().type(product.name, { parseSpecialCharSequences: false });
      cy.get('[data-test="search-submit"]').click();
    });
  }

  expectSearchListed() {
    cy.get('@productName').then((productName) => {
      cy.get('[data-test="search-term"]').should('contain.text', productName);
      cy.get('[data-test="product-name"]').should('contain.text', productName);
    });
  }

  addFirstProductToCart() {
    fetchInStockProduct().then((product) => {
      cy.wrap(product.name).as('productName');
      visitApp(`/product/${product.id}`);
      cy.get('[data-test="add-to-cart"]').click();
      cy.get('[data-test="nav-cart"]').click();
    });
  }
}

module.exports = { HomePage };
