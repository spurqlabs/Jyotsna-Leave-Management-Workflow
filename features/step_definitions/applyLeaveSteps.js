const { Given, When, Then } = require('@cucumber/cucumber');
const { expect } = require('@playwright/test');
const ApplyLeavePage = require('../../src/pages/ApplyLeavePage');
const testDataHelper = require('../../src/utils/testDataHelper');
const logger = require('../../src/utils/logger');

Given('I have applied for leave', async function () {
  logger.step('Applying for leave as precondition');
  
  // Navigate to Apply Leave page
  if (!this.dashboardPage) {
    const DashboardPage = require('../../src/pages/DashboardPage');
    this.dashboardPage = new DashboardPage(this.page);
  }
  await this.dashboardPage.navigateToApplyLeave();
  
  // Apply leave
  this.applyLeavePage = new ApplyLeavePage(this.page);
  const leaveData = testDataHelper.getLeaveApplication('casualLeave');
  await this.applyLeavePage.applyLeave(leaveData);
  
  // Store leave data for later verification
  this.appliedLeaveData = leaveData;
  
  logger.info('Leave applied successfully as precondition');
});

When('I apply leave with {string} data', async function (dataKey) {
  logger.step(`Applying leave with ${dataKey} data from testData`);
  if (!this.applyLeavePage) {
    this.applyLeavePage = new ApplyLeavePage(this.page);
  }
  
  const leaveData = testDataHelper.getLeaveApplication(dataKey);
  await this.applyLeavePage.applyLeave(leaveData);
  
  // Store leave data for later verification
  this.appliedLeaveData = leaveData;
  logger.info(`Leave applied with ${dataKey} data`);
});

When('I enter from date as {string}', async function (fromDate) {
  logger.step(`Entering from date: ${fromDate}`);
  if (!this.applyLeavePage) {
    this.applyLeavePage = new ApplyLeavePage(this.page);
  }
  await this.applyLeavePage.enterFromDate(fromDate);
  logger.info(`From date entered: ${fromDate}`);
});

When('I enter to date as {string}', async function (toDate) {
  logger.step(`Entering to date: ${toDate}`);
  if (!this.applyLeavePage) {
    this.applyLeavePage = new ApplyLeavePage(this.page);
  }
  await this.applyLeavePage.enterToDate(toDate);
  logger.info(`To date entered: ${toDate}`);
});

When('I enter comment as {string}', async function (comment) {
  logger.step('Entering comment');
  if (!this.applyLeavePage) {
    this.applyLeavePage = new ApplyLeavePage(this.page);
  }
  await this.applyLeavePage.enterComment(comment);
  logger.info('Comment entered');
});

When('I click on Apply button', async function () {
  logger.step('Clicking Apply button');
  await this.applyLeavePage.clickApplyButton();
  logger.info('Apply button clicked');
});

When('I apply leave with following details', async function (dataTable) {
  logger.step('Applying leave with provided details');
  if (!this.applyLeavePage) {
    this.applyLeavePage = new ApplyLeavePage(this.page);
  }
  
  const leaveDetails = dataTable.hashes()[0];
  await this.applyLeavePage.applyLeave(leaveDetails);
  
  // Store for later verification
  this.appliedLeaveData = leaveDetails;
  
  logger.info('Leave application submitted with custom details');
});

When('I fill the leave application form', async function (dataTable) {
  logger.step('Filling leave application form');
  if (!this.applyLeavePage) {
    this.applyLeavePage = new ApplyLeavePage(this.page);
  }
  
  const formData = {};
  dataTable.hashes().forEach(row => {
    formData[row.Field] = row.Value;
  });
  
  await this.applyLeavePage.selectLeaveType(formData.leaveType);
  await this.applyLeavePage.enterFromDate(formData.fromDate);
  await this.applyLeavePage.enterToDate(formData.toDate);
  await this.applyLeavePage.enterComment(formData.comment);
  
  // Store for verification
  this.appliedLeaveData = formData;
  
  logger.info('Leave application form filled');
});

When('I submit the leave application', async function () {
  logger.step('Submitting leave application');
  await this.applyLeavePage.clickApplyButton();
  logger.info('Leave application submitted');
});

Then('I should see success message {string}', async function (expectedMessage) {
  logger.step(`Verifying success message: ${expectedMessage}`);
  const successMessage = await this.applyLeavePage.getSuccessMessage();
  
  expect(successMessage, `Success message should contain "${expectedMessage}"`).toContain(expectedMessage);
  logger.info('Success message verified');
});

Then('I should see the leave success message', async function () {
  logger.step('Verifying leave success message from testData');
  const expectedMessage = testDataHelper.getExpectedMessage('leaveApplySuccess');
  const isVisible = await this.applyLeavePage.isSuccessMessageVisible();
  expect(isVisible, `Success message should be visible`).toBe(true);
  
  const actualMessage = await this.applyLeavePage.getSuccessMessage();
  expect(actualMessage).toContain(expectedMessage);
  logger.info(`Success message verified: ${actualMessage}`);
});

Then('I should see success message', async function () {
  logger.step('Verifying success message appears');
  const isSuccessful = await this.applyLeavePage.isLeaveApplicationSuccessful();
  
  expect(isSuccessful, 'Leave application should be successful').toBe(true);
  logger.info('Success message verified');
});

Then('I should see validation error', async function () {
  logger.step('Verifying validation error appears');
  // Wait a moment for validation to trigger
  await this.page.waitForTimeout(1000);
  
  // Check if we're still on the apply leave page (didn't proceed)
  const isStillOnPage = await this.applyLeavePage.isApplyLeavePageDisplayed();
  expect(isStillOnPage, 'Should remain on Apply Leave page due to validation error').toBe(true);
  
  logger.info('Validation error verified');
});

When('I apply leave with casualLeave data', async function() {
  logger.step('Applying leave with casualleave data from testData');
  if (!this.applyLeavePage){
    this.applyLeavePage =  new ApplyLeavePage(this.page);
    const leaveDropdown = await $("div.oxd-select-text");
     await leaveDropdown.click();
    const leaveData = testDataHelper.getLeaveApplication('casualLeave');
    await this.applyLeavePage.applyLeave(leaveData);
    this.appliedLeaveData = leaveData;
    logger.info('Leave applied with casualLeave data');
  }

});

Given('I click on Apply option', async function () {
  await dashboardPage.clickApplyOption();
  applyLeavePage = new ApplyLeavePage(this.page);
  await ApplyLeavePage.verifyPageLoaded();
});

Given('I click on My Leave option', async function () {
  await dashboardPage.clickMyLeaveOption();
  myLeavePage = new MyLeavePage(this.page);
  await myLeavePage.verifyPageLoaded();
});

// Apply Leave Form Steps
When('I fill the leave application form with valid data', async function () {
  applyLeavePage = new ApplyLeavePage(this.page);
  const leaveData = testData.leave.applyLeave;
  await applyLeavePage.fillLeaveApplicationForm(leaveData);
  
  // Store applied leave data for later verification
  this.appliedLeaveData = leaveData;
  logger.info('Filled leave application form');
});

When('I select leave type as {string}', async function (leaveType) {
  applyLeavePage = applyLeavePage || new ApplyLeavePage(this.page);
  await ApplyLeavePage.selectLeaveType(leaveType);
  
  // Store for verification
  if (!this.appliedLeaveData) this.appliedLeaveData = {};
  this.appliedLeaveData.leaveType = leaveType;
});

When('I select from date as {string}', async function (fromDate) {
  applyLeavePage = applyLeavePage || new ApplyLeavePage(this.page);
  await applyLeavePage.enterFromDate(fromDate);
  
  // Store for verification
  if (!this.appliedLeaveData) this.appliedLeaveData = {};
  this.appliedLeaveData.fromDate = fromDate;
});

When('I select to date as {string}', async function (toDate) {
  applyLeavePage = applyLeavePage || new ApplyLeavePage(this.page);
  await applyLeavePage.enterToDate(toDate);
  
  // Store for verification
  if (!this.appliedLeaveData) this.appliedLeaveData = {};
  this.appliedLeaveData.toDate = toDate;
});

When('I enter comments as {string}', async function (comments) {
  applyLeavePage = applyLeavePage || new ApplyLeavePage(this.page);
  await applyLeavePage.enterComments(comments);
});

When('I submit the leave request', async function () {
  applyLeavePage = applyLeavePage || new ApplyLeavePage(this.page);
  await applyLeavePage.submitLeaveRequest();
});

When('I click on apply button without selecting leave type', async function () {
  applyLeavePage = applyLeavePage || new ApplyLeavePage(this.page);
  await applyLeavePage.clickApplyButton();
});

// Success Message Steps
Then('I should see leave applied success message', async function () {
  applyLeavePage = applyLeavePage || new ApplyLeavePage(this.page);
  const expectedMessage = testData.validation.successMessages.leaveApplied;
  await applyLeavePage.verifySuccessMessage(expectedMessage);
  logger.info('Leave applied success message verified');
});




// And('I apply leave with casualLeave data',async function() {
//   logger.step('Applying leave with casualleave data from testData');
//   if (!this.applyLeavePage){
//     this.applyLeavePage =  new ApplyLeavePage(this.page);
//     const leaveData = testDataHelper.getLeaveApplication('casualLeave');
//     await this.applyLeavePage.applyLeave(leaveData);
//     this.appliedLeaveData = leaveData;
//     logger.info('Leave applied with casualLeave data');
//   }
  
// }); 
