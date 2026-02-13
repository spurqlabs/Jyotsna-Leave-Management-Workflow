const BasePage = require('./BasePage');
const logger = require('../utils/logger');

class AddVacancyPage extends BasePage {
  constructor(page) {
    super(page);
    this.recruitmentLocators = require('../config/recruitmentLocators.json');
    this.selectors = this.recruitmentLocators.addVacancyPage;
  }

  /**
   * Verify Add Vacancy page is loaded
   */
  async verifyPageLoaded() {
    await this.waitForElement(this.selectors.pageTitle);
    logger.info('Add Job Vacancy page loaded');
  }

  /**
   * Enter vacancy name
   * @param {string} vacancyName - Vacancy name
   */
  async enterVacancyName(vacancyName) {
    try {
      const inputs = await this.page.$$('input.oxd-input');
      if (inputs.length > 0) {
        // Vacancy name is typically the second input (first is in filter/search)
        const vacancyInput = inputs[1];
        await vacancyInput.fill(vacancyName);
        logger.info(`Entered vacancy name: ${vacancyName}`);
      }
    } catch (error) {
      logger.error(`Failed to enter vacancy name: ${error.message}`);
      throw error;
    }
  }

  /**
   * Select job title from dropdown
   * @param {string} jobTitle - Job title to select
   */
  async selectJobTitle(jobTitle) {
    try {
      const dropdowns = await this.page.$$(this.selectors.formFields.jobTitleDropdown);
      if (dropdowns.length > 0) {
        await dropdowns[0].click();
        await this.page.waitForTimeout(500);
        
        const optionSelector = `${this.selectors.formFields.jobTitleOption}:has-text("${jobTitle}")`;
        await this.click(optionSelector);
        logger.info(`Selected job title: ${jobTitle}`);
      }
    } catch (error) {
      logger.error(`Failed to select job title: ${error.message}`);
      throw error;
    }
  }

  /**
   * Enter job description
   * @param {string} description - Job description
   */
  async enterDescription(description) {
    try {
      await this.fill(this.selectors.formFields.descriptionTextarea, description);
      logger.info('Entered job description');
    } catch (error) {
      logger.warn('Description field may be optional');
    }
  }

  /**
   * Select hiring manager
   * @param {string} hiringManager - Hiring manager name
   */
  async selectHiringManager(hiringManager) {
    try {
      const managerInputs = await this.page.$$(this.selectors.formFields.hiringManagerInput);
      if (managerInputs.length > 0) {
        await managerInputs[0].fill(hiringManager);
        await this.page.waitForTimeout(1500); // Wait for autocomplete
        
        // Select from autocomplete dropdown
        const optionSelector = `${this.selectors.formFields.hiringManagerOption}:has-text("${hiringManager}")`;
        await this.page.waitForSelector(optionSelector, { timeout: 5000 });
        await this.click(optionSelector);
        logger.info(`Selected hiring manager: ${hiringManager}`);
      }
    } catch (error) {
      logger.error(`Failed to select hiring manager: ${error.message}`);
      throw error;
    }
  }

  /**
   * Enter number of positions
   * @param {string|number} positions - Number of positions
   */
  async enterNumberOfPositions(positions) {
    try {
      const inputs = await this.page.$$('input.oxd-input');
      // Number of positions is usually the last input field
      if (inputs.length > 0) {
        const positionsInput = inputs[inputs.length - 1];
        await positionsInput.fill(positions.toString());
        logger.info(`Entered number of positions: ${positions}`);
      }
    } catch (error) {
      logger.error(`Failed to enter number of positions: ${error.message}`);
      throw error;
    }
  }

  /**
   * Set vacancy status (Active/Inactive)
   * @param {string} status - Status to set (Active/Closed)
   */
  async setVacancyStatus(status) {
    try {
      const checkboxes = await this.page.$$('input[type="checkbox"]');
      const isActive = status.toLowerCase() === 'active';
      
      if (checkboxes.length > 0) {
        const activeCheckbox = checkboxes[0]; // First checkbox is usually Active status
        const isChecked = await activeCheckbox.isChecked();
        
        if ((isActive && !isChecked) || (!isActive && isChecked)) {
          await activeCheckbox.click();
          logger.info(`Set vacancy status to: ${status}`);
        }
      }
    } catch (error) {
      logger.warn('Status toggle may have different implementation');
    }
  }

  /**
   * Toggle publish in RSS feed
   */
  async togglePublishInRSS() {
    try {
      const checkboxes = await this.page.$$('input[type="checkbox"]');
      if (checkboxes.length > 1) {
        await checkboxes[1].click();
        logger.info('Toggled Publish in RSS Feed');
      }
    } catch (error) {
      logger.warn('RSS feed toggle not found');
    }
  }

  /**
   * Toggle publish in web
   */
  async togglePublishInWeb() {
    try {
      const checkboxes = await this.page.$$('input[type="checkbox"]');
      if (checkboxes.length > 2) {
        await checkboxes[2].click();
        logger.info('Toggled Publish in Web');
      }
    } catch (error) {
      logger.warn('Web publish toggle not found');
    }
  }

  /**
   * Click Save button
   */
  async clickSaveButton() {
    await this.click(this.selectors.buttons.saveButton);
    await this.waitForLoadingToComplete();
    logger.info('Clicked Save button');
  }

  /**
   * Click Cancel button
   */
  async clickCancelButton() {
    await this.click(this.selectors.buttons.cancelButton);
    await this.waitForLoadingToComplete();
    logger.info('Clicked Cancel button');
  }

  /**
   * Fill complete job vacancy form
   * @param {object} vacancyData - Vacancy data object
   */
  async fillJobVacancyForm(vacancyData) {
    await this.verifyPageLoaded();
    
    if (vacancyData.vacancyName) {
      await this.enterVacancyName(vacancyData.vacancyName);
    }
    
    if (vacancyData.jobTitle) {
      await this.selectJobTitle(vacancyData.jobTitle);
    }
    
    if (vacancyData.description) {
      await this.enterDescription(vacancyData.description);
    }
    
    if (vacancyData.hiringManager) {
      await this.selectHiringManager(vacancyData.hiringManager);
    }
    
    if (vacancyData.numberOfPositions) {
      await this.enterNumberOfPositions(vacancyData.numberOfPositions);
    }
    
    if (vacancyData.status) {
      await this.setVacancyStatus(vacancyData.status);
    }
    
    logger.info('Filled job vacancy form');
  }

  /**
   * Submit job vacancy form
   */
  async submitForm() {
    await this.clickSaveButton();
    logger.info('Submitted job vacancy form');
  }

  /**
   * Create new job vacancy
   * @param {object} vacancyData - Complete vacancy data
   */
  async createJobVacancy(vacancyData) {
    await this.fillJobVacancyForm(vacancyData);
    await this.submitForm();
    logger.info('Job vacancy creation completed');
  }

  /**
   * Get validation error message
   * @returns {Promise<string>} Error message text
   */
  async getValidationError() {
    try {
      await this.waitForElement(this.selectors.validation.requiredFieldError, 5000);
      const error = await this.getText(this.selectors.validation.requiredFieldError);
      logger.info(`Validation error: ${error}`);
      return error;
    } catch (error) {
      logger.warn('No validation error found');
      return '';
    }
  }

  /**
   * Verify required field error is displayed
   * @param {string} fieldName - Field name that has error
   */
  async verifyRequiredFieldError(fieldName) {
    const errorMessages = await this.page.$$(this.selectors.validation.requiredFieldError);
    if (errorMessages.length === 0) {
      throw new Error(`Expected required field error for "${fieldName}" but none found`);
    }
    logger.info(`Verified required field error for: ${fieldName}`);
  }

  /**
   * Get all validation errors
   * @returns {Promise<Array>} Array of error messages
   */
  async getAllValidationErrors() {
    try {
      const errorElements = await this.page.$$(this.selectors.validation.requiredFieldError);
      const errors = [];
      
      for (const element of errorElements) {
        const text = await element.textContent();
        errors.push(text.trim());
      }
      
      logger.info(`Found ${errors.length} validation errors`);
      return errors;
    } catch (error) {
      return [];
    }
  }
}

module.exports = AddVacancyPage;
