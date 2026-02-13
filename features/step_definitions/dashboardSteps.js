const { Given, When, Then } = require('@cucumber/cucumber');
const { expect } = require('@playwright/test');
const DashboardPage = require('../../src/pages/DashboardPage');
const logger = require('../../src/utils/logger');

Given('I am on the dashboard', async function () {
  logger.step('Verifying user is on dashboard');
  if (!this.dashboardPage) {
    this.dashboardPage = new DashboardPage(this.page);
  }
  
  const isDashboardDisplayed = await this.dashboardPage.isDashboardDisplayed();
  expect(isDashboardDisplayed, 'Dashboard should be displayed').toBe(true);
  logger.info('User is on dashboard');
});

When('I navigate to Leave module', async function () {
  logger.step('Navigating to Leave module');
  if (!this.dashboardPage) {
    this.dashboardPage = new DashboardPage(this.page);
  }
  await this.dashboardPage.navigateToLeaveModule();
  logger.info('Navigated to Leave module');
});

When('I navigate to Admin module', async function () {
  logger.step('Navigating to Admin module');
  if (!this.dashboardPage) {
    this.dashboardPage = new DashboardPage(this.page);
  }
  await this.dashboardPage.navigateToAdminModule();
  logger.info('Navigated to Admin module');
});

When('I navigate to Apply Leave page', async function () {
  logger.step('Navigating to Apply Leave page');
  if (!this.dashboardPage) {
    this.dashboardPage = new DashboardPage(this.page);
  }
  await this.dashboardPage.navigateToApplyLeave();
  logger.info('Navigated to Apply Leave page');
});

When('I navigate to My Leave page', async function () {
  logger.step('Navigating to My Leave page');
  if (!this.dashboardPage) {
    this.dashboardPage = new DashboardPage(this.page);
  }
  await this.dashboardPage.navigateToMyLeave();
  logger.info('Navigated to My Leave page');
});

When('I navigate back to dashboard', async function () {
  logger.step('Navigating back to dashboard');
  if (!this.dashboardPage) {
    this.dashboardPage = new DashboardPage(this.page);
  }
  await this.dashboardPage.navigateBackToDashboard();
  logger.info('Navigated back to dashboard');
});

Then('the dashboard header should display {string}', async function (expectedHeader) {
  logger.step(`Verifying dashboard header displays: ${expectedHeader}`);
  if (!this.dashboardPage) {
    this.dashboardPage = new DashboardPage(this.page);
  }
  const headerText = await this.dashboardPage.getDashboardHeader();
  expect(headerText, `Dashboard header should contain "${expectedHeader}"`).toContain(expectedHeader);
  logger.info('Dashboard header verified');
});

Then('I should see the main menu with options', async function () {
  logger.step('Verifying main menu is visible');
  if (!this.dashboardPage) {
    this.dashboardPage = new DashboardPage(this.page);
  }
  const isMenuVisible = await this.dashboardPage.isMainMenuVisible();
  expect(isMenuVisible, 'Main menu should be visible').toBe(true);
  logger.info('Main menu verified');
});

Then('I should see the Leave menu options', async function () {
  logger.step('Verifying Leave menu options are displayed');
  // Wait for leave page to load
  await this.page.waitForTimeout(1000);
  const currentURL = this.page.url();
  expect(currentURL, 'URL should contain leave module').toContain('leave');
  logger.info('Leave menu options verified');
});

When('I click on user dropdown', async function () {
  logger.step('Clicking on user dropdown');
  if (!this.dashboardPage) {
    this.dashboardPage = new DashboardPage(this.page);
  }
  await this.page.click(this.dashboardPage.dashboardLocators.userDropdown);
  await this.page.waitForTimeout(500);
  logger.info('Clicked on user dropdown');
});

When('I click on Logout option', async function () {
  logger.step('Clicking on Logout option');
  await this.dashboardPage.logout();
  logger.info('Logged out successfully');
});

Then('I should be redirected to login page', async function () {
  logger.step('Verifying redirection to login page');
  const isLoggedOut = await this.dashboardPage.isLoggedOut();
  expect(isLoggedOut, 'User should be redirected to login page').toBe(true);
  logger.info('User redirected to login page');
});

Then('the session should be terminated', async function () {
  logger.step('Verifying session termination');
  const currentURL = this.page.url();
  expect(currentURL, 'URL should contain login after logout').toContain('login');
  logger.info('Session terminated successfully');
});

