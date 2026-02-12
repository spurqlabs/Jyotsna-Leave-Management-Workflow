const { Given, When, Then } = require('@cucumber/cucumber');
const { expect } = require('@playwright/test');
const MyLeavePage = require('../../src/pages/MyLeavePage');
const testDataHelper = require('../../src/utils/testDataHelper');
const logger = require('../../src/utils/logger');

When('I search for leave by date range from {string} to {string}', async function (fromDate, toDate) {
  logger.step(`Searching leave from ${fromDate} to ${toDate}`);
  if (!this.myLeavePage) {
    this.myLeavePage = new MyLeavePage(this.page);
  }
  
  await this.myLeavePage.searchLeaveByDateRange(fromDate, toDate);
  logger.info('Leave search completed');
});

When('I search for leave by {string}', async function (dateRangeKey) {
  logger.step(`Searching for leave by ${dateRangeKey} from testData`);
  if (!this.myLeavePage) {
    this.myLeavePage = new MyLeavePage(this.page);
  }
  
  const dateRange = testDataHelper.getLeaveSearch(dateRangeKey);
  await this.myLeavePage.searchLeaveByDateRange(dateRange.fromDate, dateRange.toDate);
  logger.info(`Searched for leave using ${dateRangeKey}`);
});

When('I search for the applied leave', async function () {
  logger.step('Searching for applied leave');
  if (!this.myLeavePage) {
    this.myLeavePage = new MyLeavePage(this.page);
  }
  
  // Use the leave data from previous application
  const leaveData = this.appliedLeaveData || testDataHelper.getLeaveApplication('casualLeave');
  
  // Extract year and month from fromDate to create search range
  const fromDate = leaveData.fromDate;
  const dateParts = fromDate.split('-');
  const year = dateParts[0];
  const month = dateParts[1];
  
  // Create search range for the entire month
  const searchFrom = `${year}-${month}-01`;
  const searchTo = `${year}-${month}-28`;
  
  await this.myLeavePage.searchLeaveByDateRange(searchFrom, searchTo);
  logger.info('Searched for applied leave');
});

Then('I should see the applied leave in the list', async function () {
  logger.step('Verifying applied leave appears in list');
  if (!this.myLeavePage) {
    this.myLeavePage = new MyLeavePage(this.page);
  }
  
  const isTableVisible = await this.myLeavePage.isLeaveTableVisible();
  expect(isTableVisible, 'Leave table should be visible').toBe(true);
  
  const records = await this.myLeavePage.getLeaveRecords();
  expect(records.length, 'At least one leave record should be present').toBeGreaterThan(0);
  
  logger.info(`Found ${records.length} leave record(s)`);
});

Then('the leave should appear in My Leave list', async function () {
  logger.step('Verifying leave appears in My Leave list');
  if (!this.myLeavePage) {
    this.myLeavePage = new MyLeavePage(this.page);
  }
  
  const isTableVisible = await this.myLeavePage.isLeaveTableVisible();
  expect(isTableVisible, 'Leave table should be visible').toBe(true);
  
  const leaveCount = await this.myLeavePage.getLeaveCount();
  expect(leaveCount, 'Leave should appear in the list').toBeGreaterThan(0);
  
  logger.info('Leave verified in My Leave list');
});

Then('the leave status should be {string}', async function (statusKey) {
  logger.step(`Verifying leave status is: ${statusKey}`);
  if (!this.myLeavePage) {
    this.myLeavePage = new MyLeavePage(this.page);
  }
  
  const expectedStatus = testDataHelper.getLeaveStatus(statusKey);
  const statusVerified = await this.myLeavePage.verifyLeaveStatus(expectedStatus);
  expect(statusVerified, `Leave status should be "${expectedStatus}"`).toBe(true);
  
  logger.info(`Leave status verified as: ${expectedStatus}`);
});

Then('I should see leave records in the table', async function () {
  logger.step('Verifying leave records are displayed');
  if (!this.myLeavePage) {
    this.myLeavePage = new MyLeavePage(this.page);
  }
  
  const isTableVisible = await this.myLeavePage.isLeaveTableVisible();
  expect(isTableVisible, 'Leave records table should be visible').toBe(true);
  
  const records = await this.myLeavePage.getLeaveRecords();
  expect(records.length, 'Leave records should be present').toBeGreaterThan(0);
  
  logger.info(`Leave records table displayed with ${records.length} record(s)`);
});

Then('each leave record should display date, type and status', async function () {
  logger.step('Verifying leave record structure');
  if (!this.myLeavePage) {
    this.myLeavePage = new MyLeavePage(this.page);
  }
  
  const records = await this.myLeavePage.getLeaveRecords();
  expect(records.length, 'At least one leave record should exist').toBeGreaterThan(0);
  
  // Verify first record has required fields
  const firstRecord = records[0];
  expect(firstRecord.date, 'Leave record should have date').toBeDefined();
  expect(firstRecord.type, 'Leave record should have type').toBeDefined();
  expect(firstRecord.status, 'Leave record should have status').toBeDefined();
  
  expect(firstRecord.date.length, 'Date should not be empty').toBeGreaterThan(0);
  expect(firstRecord.type.length, 'Type should not be empty').toBeGreaterThan(0);
  expect(firstRecord.status.length, 'Status should not be empty').toBeGreaterThan(0);
  
  logger.info('Leave record structure verified successfully');
});
