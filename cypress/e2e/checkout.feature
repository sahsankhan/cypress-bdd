@e2e @checkout
Feature: Checkout with cash on delivery

  Scenario: Customer registers, shops, and pays on the UI
    Given the customer registers a unique account
    And the customer signs in
    When they add a product to the cart from the catalog
    Then the cart shows that product
    When they complete checkout with cash on delivery
    Then the order is confirmed
