const BasePage = require('./BasePage');
const logger = require('../utils/logger');

class DashboardPage extends BasePage {
  constructor(page) {
    super(page);
    this.dashboardLocators = this.locators.dashboardPage;
    this.leaveMenuLocators = this.locators.leaveMenu;
  }

  async isDashboardDisplayed() {
    try {
      await this.waitForElement(this.dashboardLocators.dashboardHeader);
      const headerText = await this.getText(this.dashboardLocators.dashboardHeader);
      logger.info(`Dashboard header: ${headerText}`);
      return headerText.includes('Dashboard');
    } catch (error) {
      logger.error('Dashboard not displayed');
      return false;
    }
  }

  async getDashboardHeader() {
    return await this.getText(this.dashboardLocators.dashboardHeader);
  }

  async navigateToLeaveModule() {
    await this.click(this.dashboardLocators.leaveMenu);
    await this.waitForPageLoad();
    logger.info('Navigated to Leave module');
  }

  async navigateToAdminModule() {
    await this.click(this.dashboardLocators.adminMenu);
    await this.waitForPageLoad();
    logger.info('Navigated to Admin module');
  }

  async navigateToApplyLeave() {
    await this.navigateToLeaveModule();
    await this.click(this.leaveMenuLocators.applyLink);
    await this.waitForPageLoad();
    logger.info('Navigated to Apply Leave page');
  }

  async navigateToMyLeave() {
    await this.navigateToLeaveModule();
    await this.click(this.leaveMenuLocators.myLeaveLink);
    await this.waitForPageLoad();
    logger.info('Navigated to My Leave page');
  }

  async navigateBackToDashboard() {
    await this.page.goto(this.config.baseURL + 'web/index.php/dashboard/index');
    await this.waitForPageLoad();
    logger.info('Navigated back to Dashboard');
  }

  async isMainMenuVisible() {
    try {
      await this.waitForElement(this.dashboardLocators.mainMenuItems);
      logger.info('Main menu is visible');
      return true;
    } catch (error) {
      logger.error('Main menu not visible');
      return false;
    }
  }

  async logout() {
    try {
      await this.click(this.dashboardLocators.userDropdown);
      await this.page.waitForTimeout(500);
      await this.click(this.dashboardLocators.logoutOption);
      await this.waitForPageLoad();
      logger.info('Logged out successfully');
    } catch (error) {
      logger.error(`Logout failed: ${error.message}`);
      throw error;
    }
  }

  async isLoggedOut() {
    try {
      await this.page.waitForURL(/login/, { timeout: 10000 });
      logger.info('Logout successful - Login page URL detected');
      return true;
    } catch (error) {
      logger.warn('Logout verification failed');
      return false;
    }
  }
}

module.exports = DashboardPage;
