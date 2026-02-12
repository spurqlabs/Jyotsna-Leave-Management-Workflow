const BasePage = require('./BasePage');
const logger = require('../utils/logger');

class ApplyLeavePage extends BasePage {
  constructor(page) {
    super(page);
    this.applyLeaveLocators = this.locators.applyLeavePage;
  }

  async isApplyLeavePageDisplayed() {
    try {
      await this.waitForElement(this.applyLeaveLocators.pageHeader);
      const headerText = await this.getText(this.applyLeaveLocators.pageHeader);
      logger.info(`Apply Leave page header: ${headerText}`);
      return headerText.includes('Apply Leave');
    } catch (error) {
      logger.error('Apply Leave page not displayed');
      return false;
    }
  }

  async selectLeaveType(leaveType) {
    try {
      await this.click(this.applyLeaveLocators.leaveTypeDropdown);
      await this.page.waitForTimeout(500);
      const optionSelector = `//div[@role='option']//span[contains(text(), '${leaveType}')]`;
      await this.click(optionSelector);
      logger.info(`Selected leave type: ${leaveType}`);
    } catch (error) {
      logger.error(`Failed to select leave type: ${leaveType} - ${error.message}`);
      throw error;
    }
  }

  async enterFromDate(date) {
    try {
      await this.waitForElement(this.applyLeaveLocators.fromDateInput);
      // Clear existing date and enter new one
      await this.page.fill(this.applyLeaveLocators.fromDateInput, '');
      await this.page.fill(this.applyLeaveLocators.fromDateInput, date);
      await this.page.keyboard.press('Enter');
      logger.info(`Entered from date: ${date}`);
    } catch (error) {
      logger.error(`Failed to enter from date: ${error.message}`);
      throw error;
    }
  }

  async enterToDate(date) {
    try {
      await this.waitForElement(this.applyLeaveLocators.toDateInput);
      // Clear existing date and enter new one
      await this.page.fill(this.applyLeaveLocators.toDateInput, '');
      await this.page.fill(this.applyLeaveLocators.toDateInput, date);
      await this.page.keyboard.press('Enter');
      logger.info(`Entered to date: ${date}`);
    } catch (error) {
      logger.error(`Failed to enter to date: ${error.message}`);
      throw error;
    }
  }

  async enterComment(comment) {
    try {
      await this.waitForElement(this.applyLeaveLocators.commentsTextarea);
      await this.fill(this.applyLeaveLocators.commentsTextarea, comment);
      logger.info('Entered comment');
    } catch (error) {
      logger.error(`Failed to enter comment: ${error.message}`);
      throw error;
    }
  }

  async clickApplyButton() {
    try {
      await this.click(this.applyLeaveLocators.applyButton);
      await this.waitForToastMessage();
      logger.info('Clicked apply button');
    } catch (error) {
      logger.error(`Failed to click apply button: ${error.message}`);
      throw error;
    }
  }

  async applyLeave(leaveData) {
    await this.selectLeaveType(leaveData.leaveType);
    await this.enterFromDate(leaveData.fromDate);
    await this.enterToDate(leaveData.toDate);
    if (leaveData.comment) {
      await this.enterComment(leaveData.comment);
    }
    await this.clickApplyButton();
    logger.info('Leave application submitted');
  }

  async getSuccessMessage() {
    try {
      await this.waitForElement(this.applyLeaveLocators.successMessage, { timeout: 10000 });
      const message = await this.getText(this.applyLeaveLocators.successMessage);
      logger.info(`Success message: ${message}`);
      return message;
    } catch (error) {
      logger.error('Success message not found');
      return '';
    }
  }

  async isLeaveApplicationSuccessful() {
    const message = await this.getSuccessMessage();
    return message.includes('Success');
  }

  async closeToastMessage() {
    try {
      const toastClose = this.locators.common.toastClose;
      if (await this.isVisible(toastClose)) {
        await this.click(toastClose);
        logger.info('Toast message closed');
      }
    } catch (error) {
      logger.warn('Could not close toast message');
    }
  }
}

module.exports = ApplyLeavePage;
