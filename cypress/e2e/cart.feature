@smoke @cart
Feature: Cart

  Scenario: Signed-in customer sees the product in the cart
    Given the customer registers a unique account
    And the customer signs in
    When they add a product to the cart from the catalog
    Then the cart shows that product
