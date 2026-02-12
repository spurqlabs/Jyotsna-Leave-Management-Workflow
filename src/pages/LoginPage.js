const BasePage = require('./BasePage');
const logger = require('../utils/logger');

class LoginPage extends BasePage {
  constructor(page) {
    super(page);
    this.loginLocators = this.locators.loginPage;
  }

  async navigateToLoginPage() {
    await this.navigateTo(this.config.baseURL);
    await this.waitForPageLoad();
    logger.info('Navigated to login page');
  }

  async enterUsername(username) {
    await this.fill(this.loginLocators.usernameInput, username);
    logger.info('Entered username');
  }

  async enterPassword(password) {
    await this.fill(this.loginLocators.passwordInput, password);
    logger.info('Entered password');
  }

  async clickLoginButton() {
    await this.click(this.loginLocators.loginButton);
    await this.waitForPageLoad();
    logger.info('Clicked login button');
  }

  async login(username, password) {
    await this.enterUsername(username);
    await this.enterPassword(password);
    await this.clickLoginButton();
    logger.info(`Login attempt with username: ${username}`);
  }

  async isLoginPanelVisible() {
    return await this.isVisible(this.loginLocators.loginPanel);
  }

  async getErrorMessage() {
    try {
      await this.waitForElement(this.loginLocators.errorMessage);
      const errorText = await this.getText(this.loginLocators.errorMessage);
      logger.info(`Login error message: ${errorText}`);
      return errorText;
    } catch (error) {
      logger.error('No error message found');
      return '';
    }
  }

  async isLoginSuccessful() {
    try {
      // Wait for dashboard or any post-login page element
      await this.page.waitForURL(/dashboard/, { timeout: 10000 });
      logger.info('Login successful - Dashboard URL detected');
      return true;
    } catch (error) {
      logger.warn('Login may have failed - Dashboard URL not detected');
      return false;
    }
  }
}

module.exports = LoginPage;
