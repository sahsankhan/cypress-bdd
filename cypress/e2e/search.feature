@smoke @search
Feature: Search

  Scenario: Search finds an in-stock product
    When the customer searches for an in-stock product
    Then that product is listed
