@smoke @product
Feature: Product detail

  Scenario: In-stock product page is ready to buy
    When the customer opens an in-stock product
    Then the add to cart button is visible
