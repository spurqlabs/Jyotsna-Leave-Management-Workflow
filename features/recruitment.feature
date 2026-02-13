@recruitment @regression
Feature: Recruitment - Job Vacancy Management
  As an HR Manager
  I want to manage job vacancies in the recruitment module
  So that I can track and manage hiring processes effectively

  Background:
    Given I am on the OrangeHRM login page
    When I login with valid credentials
    Then I should see the dashboard
    And I navigate to Recruitment module

  @smoke @positive
  Scenario Outline: Add new job vacancy successfully
    Given I am on the Job Vacancies page
    When I click on Add button
    And I fill the job vacancy form with following details:
      | Field              | Value              |
      | Vacancy Name       | <vacancyName>      |
      | Job Title          | <jobTitle>         |
      | Hiring Manager     | <hiringManager>    |
      | Number of Positions| <positions>        |
    And I set the vacancy status to "<status>"
    And I submit the job vacancy form
    Then I should see vacancy created success message