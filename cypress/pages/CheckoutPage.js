class CheckoutPage {
  expectProductInCart(productName) {
    cy.get('[data-test="product-title"]').first().should('contain.text', productName);
  }

  proceedFromCart() {
    cy.get('[data-test="proceed-1"]').click();
  }

  proceedWhenLoggedIn() {
    cy.get('[data-test="proceed-2"]').click();
  }

  fillAddress() {
    cy.get('[data-test="country"]').select('NL');
    cy.get('[data-test="postal_code"]').clear().type('3511AB');
    cy.get('[data-test="house_number"]').clear().type('12');
    cy.get('[data-test="street"]').clear().type('Test Street');
    cy.get('[data-test="city"]').clear().type('Utrecht');
    cy.get('[data-test="state"]').clear().type('Utrecht');
  }

  proceedFromAddress() {
    cy.get('[data-test="proceed-3"]').should('be.enabled').click();
  }

  payCashOnDelivery() {
    cy.get('[data-test="payment-method"]').select('cash-on-delivery');
    cy.get('[data-test="finish"]').should('be.enabled').click();
  }

  expectOrderConfirmed() {
    cy.get('[data-test="payment-success-message"], #order-confirmation').first().should('be.visible');
  }
}

module.exports = { CheckoutPage };
