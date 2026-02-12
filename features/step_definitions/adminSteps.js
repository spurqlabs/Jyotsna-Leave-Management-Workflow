const { Given, When, Then } = require('@cucumber/cucumber');
const { expect } = require('@playwright/test');
const AdminPage = require('../../src/pages/AdminPage');
const logger = require('../../src/utils/logger');

Then('I should see the Admin page header', async function () {
  logger.step('Verifying Admin page header');
  this.adminPage = new AdminPage(this.page);
  const isAdminPage = await this.adminPage.isAdminPageDisplayed();
  
  expect(isAdminPage, 'Admin page should be displayed').toBe(true);
  
  const headerText = await this.adminPage.getPageHeader();
  expect(headerText, 'Admin page header should contain "Admin"').toContain('Admin');
  
  logger.info('Admin page header verified');
});

Then('I should see the user management options', async function () {
  logger.step('Verifying user management options');
  if (!this.adminPage) {
    this.adminPage = new AdminPage(this.page);
  }
  
  const isVisible = await this.adminPage.isUserManagementVisible();
  expect(isVisible, 'User management options should be visible').toBe(true);
  
  logger.info('User management options verified');
});

Then('I should see the search functionality', async function () {
  logger.step('Verifying search functionality');
  if (!this.adminPage) {
    this.adminPage = new AdminPage(this.page);
  }
  
  const isVisible = await this.adminPage.isSearchFunctionalityVisible();
  expect(isVisible, 'Search functionality should be visible').toBe(true);
  
  logger.info('Search functionality verified');
});

When('I search for user with username {string}', async function (username) {
  logger.step(`Searching for user: ${username}`);
  if (!this.adminPage) {
    this.adminPage = new AdminPage(this.page);
  }
  
  await this.adminPage.enterUsername(username);
  
  // Store username for later verification
  this.searchedUsername = username;
  
  logger.info(`Username entered: ${username}`);
});

When('I click on search button in admin', async function () {
  logger.step('Clicking search button in admin');
  await this.adminPage.clickSearchButton();
  logger.info('Search button clicked');
});

Then('I should see search results displayed', async function () {
  logger.step('Verifying search results are displayed');
  if (!this.adminPage) {
    this.adminPage = new AdminPage(this.page);
  }
  
  const isDisplayed = await this.adminPage.isSearchResultsDisplayed();
  expect(isDisplayed, 'Search results should be displayed').toBe(true);
  
  const results = await this.adminPage.getSearchResults();
  expect(results.length, 'At least one search result should be present').toBeGreaterThan(0);
  
  logger.info('Search results verified');
});

Then('the search results should contain user {string}', async function (expectedUsername) {
  logger.step(`Verifying search results contain user: ${expectedUsername}`);
  if (!this.adminPage) {
    this.adminPage = new AdminPage(this.page);
  }
  
  const isUserInResults = await this.adminPage.isUserInResults(expectedUsername);
  expect(isUserInResults, `User "${expectedUsername}" should be in search results`).toBe(true);
  
  logger.info(`User ${expectedUsername} found in search results`);
});

When('I click on Add button in admin', async function () {
  logger.step('Clicking Add button in admin');
  if (!this.adminPage) {
    this.adminPage = new AdminPage(this.page);
  }
  
  await this.adminPage.clickAddButton();
  logger.info('Add button clicked');
});

When('I click on Reset button in admin', async function () {
  logger.step('Clicking Reset button in admin');
  if (!this.adminPage) {
    this.adminPage = new AdminPage(this.page);
  }
  
  await this.adminPage.clickResetButton();
  logger.info('Reset button clicked');
});
