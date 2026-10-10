@smoke @catalog
Feature: Catalog

  Scenario: Home page lists products
    When the customer opens the catalog
    Then product cards are visible
