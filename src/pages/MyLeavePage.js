const BasePage = require('./BasePage');
const logger = require('../utils/logger');

class MyLeavePage extends BasePage {
  constructor(page) {
    super(page);
    this.myLeaveLocators = this.locators.myLeavePage;
  }

  async isMyLeavePageDisplayed() {
    try {
      await this.waitForElement(this.myLeaveLocators.pageHeader);
      const headerText = await this.getText(this.myLeaveLocators.pageHeader);
      logger.info(`My Leave page header: ${headerText}`);
      return headerText.includes('My Leave');
    } catch (error) {
      logger.error('My Leave page not displayed');
      return false;
    }
  }

  async enterFromDate(date) {
    try {
      await this.waitForElement(this.myLeaveLocators.fromDateInput);
      await this.page.fill(this.myLeaveLocators.fromDateInput, '');
      await this.page.fill(this.myLeaveLocators.fromDateInput, date);
      await this.page.keyboard.press('Enter');
      logger.info(`Entered from date for search: ${date}`);
    } catch (error) {
      logger.error(`Failed to enter from date: ${error.message}`);
      throw error;
    }
  }

  async enterToDate(date) {
    try {
      await this.waitForElement(this.myLeaveLocators.toDateInput);
      await this.page.fill(this.myLeaveLocators.toDateInput, '');
      await this.page.fill(this.myLeaveLocators.toDateInput, date);
      await this.page.keyboard.press('Enter');
      logger.info(`Entered to date for search: ${date}`);
    } catch (error) {
      logger.error(`Failed to enter to date: ${error.message}`);
      throw error;
    }
  }

  async clickSearchButton() {
    try {
      await this.click(this.myLeaveLocators.searchButton);
      await this.page.waitForTimeout(2000); // Wait for search results
      logger.info('Clicked search button');
    } catch (error) {
      logger.error(`Failed to click search button: ${error.message}`);
      throw error;
    }
  }

  async searchLeaveByDateRange(fromDate, toDate) {
    await this.enterFromDate(fromDate);
    await this.enterToDate(toDate);
    await this.clickSearchButton();
    logger.info(`Searched leave from ${fromDate} to ${toDate}`);
  }

  async isLeaveTableVisible() {
    try {
      await this.waitForElement(this.myLeaveLocators.leaveTable, { timeout: 5000 });
      return true;
    } catch (error) {
      logger.warn('Leave table not visible');
      return false;
    }
  }

  async getLeaveRecords() {
    try {
      if (!await this.isLeaveTableVisible()) {
        logger.info('No leave records found');
        return [];
      }

      const rows = await this.page.$$(this.myLeaveLocators.leaveTableRows);
      const records = [];

      for (const row of rows) {
        try {
          const dateCell = await row.$('.oxd-table-cell:nth-child(2)');
          const typeCell = await row.$('.oxd-table-cell:nth-child(3)');
          const statusCell = await row.$('.oxd-table-cell:nth-child(6) div');

          if (dateCell && typeCell && statusCell) {
            const date = await dateCell.textContent();
            const type = await typeCell.textContent();
            const status = await statusCell.textContent();

            records.push({
              date: date.trim(),
              type: type.trim(),
              status: status.trim()
            });
          }
        } catch (error) {
          logger.warn(`Error reading row: ${error.message}`);
        }
      }

      logger.info(`Found ${records.length} leave records`);
      return records;
    } catch (error) {
      logger.error(`Failed to get leave records: ${error.message}`);
      return [];
    }
  }

  async isLeavePresent(leaveType) {
    const records = await this.getLeaveRecords();
    const found = records.some(record => record.type.includes(leaveType));
    logger.info(`Leave type ${leaveType} present: ${found}`);
    return found;
  }

  async getLeaveStatus(leaveType) {
    const records = await this.getLeaveRecords();
    const record = records.find(r => r.type.includes(leaveType));
    if (record) {
      logger.info(`Status for ${leaveType}: ${record.status}`);
      return record.status;
    }
    logger.warn(`No record found for leave type: ${leaveType}`);
    return null;
  }

  async verifyLeaveStatus(expectedStatus) {
    const records = await this.getLeaveRecords();
    if (records.length === 0) {
      logger.error('No leave records found for status verification');
      return false;
    }

    const latestRecord = records[0];
    const statusMatch = latestRecord.status.includes(expectedStatus);
    logger.info(`Latest leave status: ${latestRecord.status}, Expected: ${expectedStatus}, Match: ${statusMatch}`);
    return statusMatch;
  }

  async getLeaveCount() {
    const records = await this.getLeaveRecords();
    return records.length;
  }
}

module.exports = MyLeavePage;
