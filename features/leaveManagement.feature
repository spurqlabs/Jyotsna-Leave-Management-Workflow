@leave
Feature: Leave Module
  As an employee
  I want to apply for leave and view my leave requests
  So that I can manage my time off

  Background:
    Given I am on the OrangeHRM login page
    When I login with valid credentials
    Then I should see the dashboard

  @smoke @positive
  Scenario: Apply for leave successfully
    Given I am on the dashboard
    When I navigate to Apply Leave page
    And I apply leave with casualLeave data
    Then I should see the leave success message

  @smoke @positive
  Scenario: View applied leave in My Leave list
    Given I have applied for leave
    When I navigate to My Leave page
    And I search for leave by "dateRange1"
    Then I should see the applied leave in the list

  @regression @positive
  Scenario Outline: Apply leave for different leave types
    Given I navigate to Leave module
    And I click on Apply option
    When I select leave type as "<leaveType>"
    And I select from date as "<fromDate>"
    And I select to date as "<toDate>"
    And I enter comments as "<comments>"
    And I submit the leave request
    Then I should see leave applied success message

    Examples:
      | leaveType      | fromDate   | toDate     | comments               |
      | CAN - Vacation | 2026-03-10 | 2026-03-15 | Spring break vacation  |
      | CAN - Sick     | 2026-02-20 | 2026-02-20 | Medical appointment    |
      | CAN - Vacation | 2026-04-01 | 2026-04-05 | Easter holiday         |