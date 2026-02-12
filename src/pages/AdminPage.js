const BasePage = require('./BasePage');
const logger = require('../utils/logger');

class AdminPage extends BasePage {
  constructor(page) {
    super(page);
    this.adminLocators = this.locators.adminPage;
  }

  async isAdminPageDisplayed() {
    try {
      await this.waitForElement(this.adminLocators.pageHeader);
      const headerText = await this.getText(this.adminLocators.pageHeader);
      logger.info(`Admin page header: ${headerText}`);
      return headerText.includes('Admin');
    } catch (error) {
      logger.error('Admin page not displayed');
      return false;
    }
  }

  async getPageHeader() {
    return await this.getText(this.adminLocators.pageHeader);
  }

  async isUserManagementVisible() {
    try {
      await this.waitForElement(this.adminLocators.usernameInput);
      logger.info('User management options are visible');
      return true;
    } catch (error) {
      logger.error('User management options not visible');
      return false;
    }
  }

  async isSearchFunctionalityVisible() {
    try {
      await this.waitForElement(this.adminLocators.searchButton);
      logger.info('Search functionality is visible');
      return true;
    } catch (error) {
      logger.error('Search functionality not visible');
      return false;
    }
  }

  async enterUsername(username) {
    try {
      await this.waitForElement(this.adminLocators.usernameInput);
      await this.fill(this.adminLocators.usernameInput, username);
      logger.info(`Entered username: ${username}`);
    } catch (error) {
      logger.error(`Failed to enter username: ${error.message}`);
      throw error;
    }
  }

  async clickSearchButton() {
    try {
      await this.click(this.adminLocators.searchButton);
      await this.page.waitForTimeout(2000); // Wait for search results
      logger.info('Clicked search button');
    } catch (error) {
      logger.error(`Failed to click search button: ${error.message}`);
      throw error;
    }
  }

  async searchUser(username) {
    await this.enterUsername(username);
    await this.clickSearchButton();
    logger.info(`Searched for user: ${username}`);
  }

  async isSearchResultsDisplayed() {
    try {
      await this.waitForElement(this.adminLocators.searchResults, { timeout: 5000 });
      return true;
    } catch (error) {
      logger.warn('Search results not displayed');
      return false;
    }
  }

  async getSearchResults() {
    try {
      if (!await this.isSearchResultsDisplayed()) {
        logger.info('No search results found');
        return [];
      }

      const rows = await this.page.$$(this.adminLocators.tableRows);
      const results = [];

      for (const row of rows) {
        try {
          const usernameCell = await row.$('.oxd-table-cell:nth-child(2)');
          const roleCell = await row.$('.oxd-table-cell:nth-child(3)');

          if (usernameCell && roleCell) {
            const username = await usernameCell.textContent();
            const role = await roleCell.textContent();

            results.push({
              username: username.trim(),
              role: role.trim()
            });
          }
        } catch (error) {
          logger.warn(`Error reading row: ${error.message}`);
        }
      }

      logger.info(`Found ${results.length} search results`);
      return results;
    } catch (error) {
      logger.error(`Failed to get search results: ${error.message}`);
      return [];
    }
  }

  async isUserInResults(username) {
    const results = await this.getSearchResults();
    const found = results.some(result => result.username.toLowerCase() === username.toLowerCase());
    logger.info(`User ${username} in results: ${found}`);
    return found;
  }

  async clickAddButton() {
    try {
      await this.click(this.adminLocators.addButton);
      logger.info('Clicked Add button');
    } catch (error) {
      logger.error(`Failed to click Add button: ${error.message}`);
      throw error;
    }
  }

  async clickResetButton() {
    try {
      await this.click(this.adminLocators.resetButton);
      logger.info('Clicked Reset button');
    } catch (error) {
      logger.error(`Failed to click Reset button: ${error.message}`);
      throw error;
    }
  }
}

module.exports = AdminPage;
