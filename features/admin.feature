@admin
Feature: Admin Module
  As an admin user
  I want to access the admin module
  So that I can manage users and system configuration

  Background:
    Given I am on the OrangeHRM login page
    When I login with valid credentials
    Then I should see the dashboard

  @smoke @positive
  Scenario: Access Admin module and verify page elements
    Given I am on the dashboard
    When I navigate to Admin module
    Then I should see the Admin page header
    And I should see the user management options
    And I should see the search functionality

  @smoke @positive
  Scenario: Search for existing user in Admin module
    Given I am on the dashboard
    When I navigate to Admin module
    And I search for user with username "Admin"
    And I click on search button in admin
    Then I should see search results displayed
    And the search results should contain user "Admin"
