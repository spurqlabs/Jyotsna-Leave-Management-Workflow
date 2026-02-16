Feature: Employee Timesheet Management
  As an employee
  I want to manage my timesheet entries
  So that I can track my work hours accurately

  Background:
    Given the user is on the OrangeHRM login page
    When the user logs in with valid credentials
    And the user navigates to the Timesheet module

  @timesheet @add-time
  Scenario Outline: Add time entries to timesheet for different projects
    Given the user is viewing the current timesheet
    When the user selects project "ap " and activity "ad "
    # When the user selects project "<project_name>" and activity "<activity>"
    And the user enters "<hours>" hours for "<day>"
    And the user clicks on the Save button
    Then the timesheet entry should be saved successfully
    And the total hours for "<day>" should display "<hours>"

    # Examples:
    #   | project_name          | activity                | hours | day       |
    #   | Apache Software       | Feature Development     | 8.00  | Monday    |
    #   | Internal - Recruitment| Job Analysis            | 6.00  | Tuesday   |
    #   | Apache Software       | Testing         | 7.50  | Wednesday |
    #   | Internal - Orangehrm  | Documentation   | 5.00  | Thursday  |

  # @timesheet @edit-time
  # Scenario Outline: Edit existing timesheet entries
  #   Given the user has an existing timesheet entry for "<project_name>"
  #   When the user selects the timesheet row for "<project_name>"
  #   And the user updates the hours from "<old_hours>" to "<new_hours>" for "<day>"
  #   And the user clicks on the Save button
  #   Then the timesheet entry should be updated successfully
  #   And the updated hours "<new_hours>" should be displayed for "<day>"
  #   And a success message should be displayed

  #   Examples:
  #     | project_name                                   | old_hours | new_hours | day       |
  #     | ACME Ltd - ACME Ltd                            | 8.00      | 6.50      | Monday    |
  #     | Global Corp and Co - Global Software phase - 1 | 7.50      | 8.00      | Wednesday |

  # @timesheet @submit-timesheet
  # Scenario Outline: Submit timesheet for approval with different statuses
  #   Given the user has timesheet entries for the week
  #   And the timesheet status is "<initial_status>"
  #   When the user fills in all required time entries
  #   And the user adds a comment "<comment>"
  #   And the user clicks on the Submit button
  #   Then the timesheet should be submitted successfully
  #   And the timesheet status should change to "<expected_status>"
  #   And a confirmation message "<message>" should be displayed

  #   Examples:
  #     | initial_status | comment                           | expected_status | message                           |
  #     | Not Submitted  | Completed all assigned tasks      | Submitted       | Successfully Submitted            |
  #     | Not Submitted  | Work in progress this week        | Submitted       | Successfully Submitted            |
  #     | Rejected       | Corrected and resubmitting        | Submitted       | Successfully Submitted            |
  #     | Approved       | Resubmitting for record-keeping   | Submitted       | Successfully Submitted            |