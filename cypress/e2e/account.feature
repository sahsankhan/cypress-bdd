@smoke @auth
Feature: Account

  Scenario: New customer can register
    When the customer registers a unique account
    Then the login page is shown

  Scenario: Registered customer can sign in
    Given the customer registers a unique account
    And the customer signs in
    Then the account menu is visible

  Scenario: Wrong password is rejected
    When the customer signs in with a wrong password
    Then the login is rejected
