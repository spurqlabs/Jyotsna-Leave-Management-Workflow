@dashboard
Feature: Dashboard Module
  As a user
  I want to access the dashboard
  So that I can view system information and navigate to different modules

  Background:
    Given the user is on the OrangeHRM login page
    When the user logs in with valid credentials

  @smoke @positive
  Scenario: Verify dashboard displays after successful login
    Then I should see the dashboard
    And the dashboard header should display "Dashboard"
    And I should see the main menu with options

  @smoke @positive
  Scenario: Navigate to different modules from dashboard
    Given I am on the dashboard
    When I navigate to Leave module
    Then I should see the Leave menu options
    When I navigate back to dashboard
    Then I should see the dashboard
