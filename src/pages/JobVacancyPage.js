const BasePage = require('./BasePage');
const logger = require('../utils/logger');

class JobVacancyPage extends BasePage {
  constructor(page) {
    super(page);
    this.recruitmentLocators = require('../config/recruitmentLocators.json');
    this.selectors = this.recruitmentLocators.jobVacancyPage;
  }

  /**
   * Navigate to Recruitment module
   */
  async navigateToRecruitment() {
    const recruitmentMenu = this.recruitmentLocators.recruitmentModule.recruitmentMenuText;
    await this.click(recruitmentMenu);
    await this.waitForLoadingToComplete();
    logger.info('Navigated to Recruitment module');
  }

  /**
   * Verify Job Vacancies page is loaded
   */
  async verifyPageLoaded() {
    await this.waitForElement(this.selectors.addButton);
    logger.info('Job Vacancies page loaded');
  }

  /**
   * Click Add button to create new vacancy
   */
  async clickAddButton() {
    await this.click(this.selectors.addButton);
    await this.waitForLoadingToComplete();
    logger.info('Clicked Add button');
  }

  /**
   * Search for vacancy by job title
   * @param {string} jobTitle - Job title to search
   */
  async searchByJobTitle(jobTitle) {
    try {
      await this.click(this.selectors.searchFilters.jobTitleDropdown);
      await this.page.waitForTimeout(500);
      
      const optionSelector = `${this.recruitmentLocators.commonElements.dropdownOption}:has-text("${jobTitle}")`;
      await this.click(optionSelector);
      logger.info(`Selected job title: ${jobTitle}`);
    } catch (error) {
      logger.error(`Failed to search by job title: ${error.message}`);
      throw error;
    }
  }

  /**
   * Search for vacancy by vacancy name
   * @param {string} vacancyName - Vacancy name to search
   */
  async searchByVacancyName(vacancyName) {
    try {
      const vacancyInputs = await this.page.$$(this.selectors.searchFilters.vacancyInput);
      if (vacancyInputs.length > 0) {
        await vacancyInputs[0].fill(vacancyName);
        await this.page.waitForTimeout(1000); // Wait for autocomplete
        logger.info(`Entered vacancy name: ${vacancyName}`);
      }
    } catch (error) {
      logger.error(`Failed to search by vacancy name: ${error.message}`);
      throw error;
    }
  }

  /**
   * Search for vacancy by hiring manager
   * @param {string} hiringManager - Hiring manager name
   */
  async searchByHiringManager(hiringManager) {
    try {
      const managerInputs = await this.page.$$(this.selectors.searchFilters.hiringManagerInput);
      if (managerInputs.length > 1) {
        await managerInputs[1].fill(hiringManager);
        await this.page.waitForTimeout(1000);
        
        // Select from autocomplete
        const optionSelector = `${this.recruitmentLocators.commonElements.autocompleteOption}:has-text("${hiringManager}")`;
        await this.click(optionSelector);
        logger.info(`Selected hiring manager: ${hiringManager}`);
      }
    } catch (error) {
      logger.error(`Failed to search by hiring manager: ${error.message}`);
    }
  }

  /**
   * Search for vacancy by status
   * @param {string} status - Status to search (Active/Closed)
   */
  async searchByStatus(status) {
    try {
      const statusDropdowns = await this.page.$$(this.selectors.searchFilters.statusDropdown);
      if (statusDropdowns.length > 0) {
        await statusDropdowns[statusDropdowns.length - 1].click();
        await this.page.waitForTimeout(500);
        
        const optionSelector = `${this.recruitmentLocators.commonElements.dropdownOption}:has-text("${status}")`;
        await this.click(optionSelector);
        logger.info(`Selected status: ${status}`);
      }
    } catch (error) {
      logger.error(`Failed to search by status: ${error.message}`);
    }
  }

  /**
   * Click search button
   */
  async clickSearchButton() {
    await this.click(this.selectors.searchButton);
    await this.waitForLoadingToComplete();
    logger.info('Clicked search button');
  }

  /**
   * Click reset button
   */
  async clickResetButton() {
    await this.click(this.selectors.resetButton);
    await this.waitForLoadingToComplete();
    logger.info('Clicked reset button');
  }

  /**
   * Get all vacancy records from the table
   * @returns {Promise<Array>} Array of vacancy records
   */
  async getVacancyRecords() {
    try {
      await this.waitForElement(this.selectors.vacancyTable.tableBody);
      const records = await this.page.$$(this.selectors.vacancyTable.tableRow);
      logger.info(`Found ${records.length} vacancy records`);
      return records;
    } catch (error) {
      logger.warn('No vacancy records found');
      return [];
    }
  }

  /**
   * Check if vacancy exists in the list
   * @param {string} vacancyName - Vacancy name to check
   * @returns {Promise<boolean>} True if vacancy exists
   */
  async isVacancyInList(vacancyName) {
    try {
      const records = await this.getVacancyRecords();
      for (const record of records) {
        const nameElement = await record.$(this.selectors.vacancyTable.vacancyName);
        if (nameElement) {
          const text = await nameElement.textContent();
          if (text.trim().includes(vacancyName)) {
            logger.info(`Vacancy found: ${vacancyName}`);
            return true;
          }
        }
      }
      logger.info(`Vacancy not found: ${vacancyName}`);
      return false;
    } catch (error) {
      logger.error('Error checking vacancy in list');
      return false;
    }
  }

  /**
   * Verify vacancy appears in the list
   * @param {string} vacancyName - Vacancy name to verify
   */
  async verifyVacancyInList(vacancyName) {
    const exists = await this.isVacancyInList(vacancyName);
    if (!exists) {
      throw new Error(`Vacancy "${vacancyName}" not found in the list`);
    }
    logger.info(`Verified vacancy in list: ${vacancyName}`);
  }

  /**
   * Click on a vacancy to view details
   * @param {string} vacancyName - Vacancy name to click
   */
  async clickVacancy(vacancyName) {
    try {
      const records = await this.getVacancyRecords();
      for (const record of records) {
        const nameElement = await record.$(this.selectors.vacancyTable.vacancyName);
        if (nameElement) {
          const text = await nameElement.textContent();
          if (text.trim().includes(vacancyName)) {
            await nameElement.click();
            await this.waitForLoadingToComplete();
            logger.info(`Clicked on vacancy: ${vacancyName}`);
            return;
          }
        }
      }
      throw new Error(`Vacancy "${vacancyName}" not found to click`);
    } catch (error) {
      logger.error(`Failed to click vacancy: ${error.message}`);
      throw error;
    }
  }

  /**
   * Click edit icon for a vacancy
   * @param {number} index - Index of vacancy (0-based)
   */
  async clickEditVacancy(index = 0) {
    try {
      const records = await this.getVacancyRecords();
      if (records.length > index) {
        const actionButtons = await records[index].$$(this.selectors.vacancyTable.actionButton);
        if (actionButtons.length > 0) {
          // Edit is usually the first action button
          await actionButtons[0].click();
          await this.waitForLoadingToComplete();
          logger.info(`Clicked edit for vacancy at index ${index}`);
        }
      }
    } catch (error) {
      logger.error(`Failed to edit vacancy: ${error.message}`);
      throw error;
    }
  }

  /**
   * Click delete icon for a vacancy
   * @param {number} index - Index of vacancy (0-based)
   */
  async clickDeleteVacancy(index = 0) {
    try {
      const records = await this.getVacancyRecords();
      if (records.length > index) {
        const actionButtons = await records[index].$$(this.selectors.vacancyTable.actionButton);
        if (actionButtons.length > 1) {
          // Delete is usually the second action button
          await actionButtons[1].click();
          await this.page.waitForTimeout(500);
          logger.info(`Clicked delete for vacancy at index ${index}`);
        }
      }
    } catch (error) {
      logger.error(`Failed to delete vacancy: ${error.message}`);
      throw error;
    }
  }

  /**
   * Confirm deletion in the modal
   */
  async confirmDeletion() {
    const confirmButton = this.recruitmentLocators.deleteConfirmation.confirmButton;
    await this.click(confirmButton);
    await this.waitForLoadingToComplete();
    logger.info('Confirmed deletion');
  }

  /**
   * Cancel deletion in the modal
   */
  async cancelDeletion() {
    const cancelButton = this.recruitmentLocators.deleteConfirmation.cancelButton;
    await this.click(cancelButton);
    logger.info('Cancelled deletion');
  }

  /**
   * Get success message from toast
   * @returns {Promise<string>} Success message text
   */
  async getSuccessMessage() {
    try {
      const toastContent = this.recruitmentLocators.successMessages.toastContent;
      await this.waitForElement(toastContent, 10000);
      const message = await this.getText(toastContent);
      logger.info(`Success message: ${message}`);
      return message;
    } catch (error) {
      logger.warn('Success message not found');
      return '';
    }
  }

  /**
   * Verify success message
   * @param {string} expectedMessage - Expected message text
   */
  async verifySuccessMessage(expectedMessage) {
    const actualMessage = await this.getSuccessMessage();
    if (!actualMessage.includes(expectedMessage)) {
      throw new Error(
        `Expected success message "${expectedMessage}" but got "${actualMessage}"`
      );
    }
    logger.info('Success message verification passed');
  }

  /**
   * Check if filtered results are displayed
   * @returns {Promise<boolean>} True if results exist
   */
  async hasFilteredResults() {
    const records = await this.getVacancyRecords();
    return records.length > 0;
  }

  /**
   * Verify filtered results contain expected value
   * @param {string} field - Field name to check
   * @param {string} expectedValue - Expected value
   */
  async verifyFilteredResults(field, expectedValue) {
    const records = await this.getVacancyRecords();
    if (records.length === 0) {
      throw new Error('No filtered results found');
    }

    let selectorKey;
    switch (field.toLowerCase()) {
      case 'vacancy name':
        selectorKey = 'vacancyName';
        break;
      case 'job title':
        selectorKey = 'jobTitle';
        break;
      case 'hiring manager':
        selectorKey = 'hiringManager';
        break;
      case 'status':
        selectorKey = 'status';
        break;
      default:
        throw new Error(`Unknown field: ${field}`);
    }

    const selector = this.selectors.vacancyTable[selectorKey];
    const firstRecord = records[0];
    const fieldElement = await firstRecord.$(selector);
    
    if (fieldElement) {
      const actualValue = await fieldElement.textContent();
      if (!actualValue.trim().includes(expectedValue)) {
        throw new Error(
          `Expected ${field} to contain "${expectedValue}" but got "${actualValue.trim()}"`
        );
      }
      logger.info(`Verified filtered result: ${field} = ${expectedValue}`);
    }
  }
}

module.exports = JobVacancyPage;
