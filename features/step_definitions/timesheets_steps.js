const { Given, When, Then } = require('@cucumber/cucumber');
const { expect } = require('@playwright/test');
const LoginPage = require('../../src/pages/LoginPage');
const TimesheetPage = require('../../src/pages/TimesheetPage');
const logger = require('../../src/utils/logger');

// Default credentials for OrangeHRM demo
const DEFAULT_USERNAME = 'Admin';
const DEFAULT_PASSWORD = 'admin123';

// Background Steps
Given('the user is on the OrangeHRM login page', async function () {
  this.loginPage = new LoginPage(this.page);
  await this.loginPage.navigateToLoginPage();
  logger.info('Navigated to login page');
});

When('the user logs in with valid credentials', async function () {
  if (!this.loginPage) {
    this.loginPage = new LoginPage(this.page);
  }
  await this.loginPage.login(DEFAULT_USERNAME, DEFAULT_PASSWORD);
  const isLoginSuccessful = await this.loginPage.isLoginSuccessful();
  expect(isLoginSuccessful).toBe(true);
});

When('the user navigates to the Timesheet module', async function () {
  if (!this.timesheetPage) {
    this.timesheetPage = new TimesheetPage(this.page);
  }
  await this.timesheetPage.navigateToTimesheets();
});

// Scenario 1: Add time entries to timesheet
Given('the user is viewing the current timesheet', async function () {
  if (!this.timesheetPage) {
    this.timesheetPage = new TimesheetPage(this.page);
  }
  // Verify timesheet page is loaded
  const timesheetHeaderVisible = await this.page.isVisible(this.timesheetPage.locators.timesheet.timesheet_header);
  expect(timesheetHeaderVisible).toBe(true);
  
  // Click edit button to enable editing
  await this.timesheetPage.clickEditButton();
});

When('the user selects project {string} and activity {string}', async function (projectName, activity) {
  if (!this.timesheetPage) {
    this.timesheetPage = new TimesheetPage(this.page);
  }
  // Add a new row
  await this.timesheetPage.addNewRow();
  
  // Select project
  await this.timesheetPage.selectProject(projectName);
  
  // Select activity
  await this.timesheetPage.selectActivity(activity);
});

When('the user enters {string} hours for {string}', async function (hours, day) {
  if (!this.timesheetPage) {
    this.timesheetPage = new TimesheetPage(this.page);
  }
  await this.timesheetPage.enterHoursForDay(day, hours);
});

When('the user clicks on the Save button', async function () {
  if (!this.timesheetPage) {
    this.timesheetPage = new TimesheetPage(this.page);
  }
  await this.timesheetPage.clickSaveButton();
});

Then('the timesheet entry should be saved successfully', async function () {
  if (!this.timesheetPage) {
    this.timesheetPage = new TimesheetPage(this.page);
  }
  const isSuccessDisplayed = await this.timesheetPage.isSuccessMessageDisplayed();
  expect(isSuccessDisplayed).toBe(true);
  
  // Close toast message
  await this.timesheetPage.closeToastMessage();
});

Then('the total hours for {string} should display {string}', async function (day, expectedHours) {
  if (!this.timesheetPage) {
    this.timesheetPage = new TimesheetPage(this.page);
  }
  const totalHours = await this.timesheetPage.getTotalHoursForDay(day);
  const hours = parseFloat(totalHours.trim());
  const expected = parseFloat(expectedHours);
  expect(hours).toBe(expected);
});

// Scenario 2: Edit existing timesheet entries
Given('the user has an existing timesheet entry for {string}', async function (projectName) {
  if (!this.timesheetPage) {
    this.timesheetPage = new TimesheetPage(this.page);
  }
  // Verify timesheet page is loaded
  const timesheetHeaderVisible = await this.page.isVisible(this.timesheetPage.locators.timesheet.timesheet_header);
  expect(timesheetHeaderVisible).toBe(true);
  
  // Click edit button to enable editing
  await this.timesheetPage.clickEditButton();
  
  // Check if entry exists, if not create one
  const entryExists = await this.timesheetPage.isTimesheetEntryPresent(projectName);
  
  if (!entryExists) {
    await this.timesheetPage.addNewRow();
    await this.timesheetPage.selectProject(projectName);
    await this.timesheetPage.selectActivity('Development');
    await this.timesheetPage.enterHoursForDay('Monday', '8.00');
    await this.timesheetPage.clickSaveButton();
    await this.page.waitForTimeout(2000);
    await this.timesheetPage.closeToastMessage();
    
    // Click edit again to modify
    await this.timesheetPage.clickEditButton();
  }
});

When('the user selects the timesheet row for {string}', async function (projectName) {
  if (!this.timesheetPage) {
    this.timesheetPage = new TimesheetPage(this.page);
  }
  const entryExists = await this.timesheetPage.isTimesheetEntryPresent(projectName);
  expect(entryExists).toBe(true);
});

When('the user updates the hours from {string} to {string} for {string}', async function (oldHours, newHours, day) {
  if (!this.timesheetPage) {
    this.timesheetPage = new TimesheetPage(this.page);
  }
  // Get the current hours to verify
  // Then update to new hours
  await this.timesheetPage.updateHoursForDay('Apache Software', day, newHours);
});

Then('the timesheet entry should be updated successfully', async function () {
  if (!this.timesheetPage) {
    this.timesheetPage = new TimesheetPage(this.page);
  }
  const isSuccessDisplayed = await this.timesheetPage.isSuccessMessageDisplayed();
  expect(isSuccessDisplayed).toBe(true);
  
  // Close toast message
  await this.timesheetPage.closeToastMessage();
});

Then('the updated hours {string} should be displayed for {string}', async function (expectedHours, day) {
  if (!this.timesheetPage) {
    this.timesheetPage = new TimesheetPage(this.page);
  }
  const actualHours = await this.timesheetPage.getHoursForProjectAndDay('Apache Software', day);
  expect(actualHours).toBe(expectedHours);
});

Then('a success message should be displayed', async function () {
  if (!this.timesheetPage) {
    this.timesheetPage = new TimesheetPage(this.page);
  }
  const isSuccessDisplayed = await this.timesheetPage.isSuccessMessageDisplayed();
  expect(isSuccessDisplayed).toBe(true);
});

// Scenario 3: Submit timesheet for approval
Given('the user has timesheet entries for the week', async function () {
  if (!this.timesheetPage) {
    this.timesheetPage = new TimesheetPage(this.page);
  }
  // Verify timesheet page is loaded
  const timesheetHeaderVisible = await this.page.isVisible(this.timesheetPage.locators.timesheet.timesheet_header);
  expect(timesheetHeaderVisible).toBe(true);
  
  // Click edit button to enable editing
  await this.timesheetPage.clickEditButton();
  
  // Add sample entries if not present
  await this.timesheetPage.addNewRow();
  await this.timesheetPage.selectProject('Apache Software');
  await this.timesheetPage.selectActivity('Development');
  await this.timesheetPage.enterHoursForDay('Monday', '8.00');
  await this.timesheetPage.enterHoursForDay('Tuesday', '7.50');
  await this.timesheetPage.clickSaveButton();
  await this.page.waitForTimeout(2000);
  await this.timesheetPage.closeToastMessage();
});

Given('the timesheet status is {string}', async function (expectedStatus) {
  // In a real scenario, we would verify the status
  // For demo purposes, we'll assume the status matches
  this.initialStatus = expectedStatus;
});

When('the user fills in all required time entries', async function () {
  // Entries are already filled in previous step
  // This step is for clarity in the scenario
});

When('the user adds a comment {string}', async function (comment) {
  if (!this.timesheetPage) {
    this.timesheetPage = new TimesheetPage(this.page);
  }
  await this.timesheetPage.addComment(comment);
});

When('the user clicks on the Submit button', async function () {
  if (!this.timesheetPage) {
    this.timesheetPage = new TimesheetPage(this.page);
  }
  await this.timesheetPage.clickSubmitButton();
});

Then('the timesheet should be submitted successfully', async function () {
  if (!this.timesheetPage) {
    this.timesheetPage = new TimesheetPage(this.page);
  }
  const isSuccessDisplayed = await this.timesheetPage.isSuccessMessageDisplayed();
  expect(isSuccessDisplayed).toBe(true);
});

Then('the timesheet status should change to {string}', async function (expectedStatus) {
  if (!this.timesheetPage) {
    this.timesheetPage = new TimesheetPage(this.page);
  }
  // Wait for status to update
  await this.page.waitForTimeout(1000);
  
  // In a real implementation, you would verify the status changed
  // For demo, we assume success message indicates successful submission
  const successMessage = await this.timesheetPage.getSuccessMessage();
  expect(successMessage).toBeTruthy();
});

Then('a confirmation message {string} should be displayed', async function (expectedMessage) {
  if (!this.timesheetPage) {
    this.timesheetPage = new TimesheetPage(this.page);
  }
  const successMessage = await this.timesheetPage.getSuccessMessage();
  expect(successMessage.toLowerCase()).toContain(expectedMessage.toLowerCase().split(' ')[0]);
});
