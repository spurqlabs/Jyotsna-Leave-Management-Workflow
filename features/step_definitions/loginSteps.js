const { Given, When, Then } = require('@cucumber/cucumber');
const { expect } = require('@playwright/test');
const LoginPage = require('../../src/pages/LoginPage');
const DashboardPage = require('../../src/pages/DashboardPage');
const testDataHelper = require('../../src/utils/testDataHelper');
const logger = require('../../src/utils/logger');

Given('I am on the OrangeHRM login page', async function () {
  logger.step('Navigating to OrangeHRM login page');
  this.loginPage = new LoginPage(this.page);
  await this.loginPage.navigateToLoginPage();
  
  const isVisible = await this.loginPage.isLoginPanelVisible();
  expect(isVisible, 'Login page should be visible').toBe(true);
  logger.info('Login page loaded successfully');
});

When('I login with valid credentials', async function () {
  logger.step('Logging in with valid credentials');
  const credentials = testDataHelper.getValidCredentials();
  await this.loginPage.login(credentials.username, credentials.password);
});

When('I login with username {string} and password {string}', async function (username, password) {
  logger.step(`Logging in with username: ${username}`);
  this.loginPage = new LoginPage(this.page);
  await this.loginPage.login(username, password);
});

When('I enter username as {string}', async function (username) {
  logger.step(`Entering username: ${username}`);
  this.loginPage = new LoginPage(this.page);
  await this.loginPage.enterUsername(username);
});

When('I enter password as {string}', async function (password) {
  logger.step('Entering password');
  await this.loginPage.enterPassword(password);
});

When('I click on login button', async function () {
  logger.step('Clicking login button');
  await this.loginPage.clickLoginButton();
});

Then('I should see the dashboard', async function () {
  logger.step('Verifying dashboard is displayed');
  this.dashboardPage = new DashboardPage(this.page);
  const isDashboardDisplayed = await this.dashboardPage.isDashboardDisplayed();
  
  expect(isDashboardDisplayed, 'Dashboard should be displayed after successful login').toBe(true);
  
  const headerText = await this.dashboardPage.getDashboardHeader();
  expect(headerText, 'Dashboard header should contain "Dashboard"').toContain('Dashboard');
  
  logger.info('Dashboard verified successfully');
});

Then('I should see login error message', async function () {
  logger.step('Verifying login error message');
  const errorMessage = await this.loginPage.getErrorMessage();
  expect(errorMessage.length, 'Error message should be displayed').toBeGreaterThan(0);
  logger.info(`Login error message displayed: ${errorMessage}`);
});

Then('I should see error message {string}', async function (expectedMessage) {
  logger.step(`Verifying error message: ${expectedMessage}`);
  const errorMessage = await this.loginPage.getErrorMessage();
  expect(errorMessage, `Error message should contain "${expectedMessage}"`).toContain(expectedMessage);
  logger.info('Error message verified');
});

Then('I should remain on login page', async function () {
  logger.step('Verifying user remains on login page');
  const isLoginPage = await this.loginPage.isLoginPanelVisible();
  expect(isLoginPage, 'User should remain on login page').toBe(true);
  logger.info('User remained on login page');
});
