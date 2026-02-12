const fs = require('fs');
const path = require('path');
const logger = require('../utils/logger');

class BasePage {
  constructor(page) {
    this.page = page;
    this.locators = this.loadLocators();
    this.config = this.loadConfig();
    this.timeout = this.config.timeouts.default;
  }

  loadLocators() {
    const locatorsPath = path.join(__dirname, '../../config/locators.json');
    return JSON.parse(fs.readFileSync(locatorsPath, 'utf8'));
  }

  loadConfig() {
    const configPath = path.join(__dirname, '../../config/config.json');
    return JSON.parse(fs.readFileSync(configPath, 'utf8'));
  }

  async waitForPageLoad() {
    try {
      await this.page.waitForLoadState('domcontentloaded', { timeout: this.config.timeouts.navigation });
      logger.info('Page loaded successfully');
    } catch (error) {
      logger.error(`Page load timeout: ${error.message}`);
      throw error;
    }
  }

  async waitForElement(selector, options = {}) {
    try {
      const timeout = options.timeout || this.timeout;
      await this.page.waitForSelector(selector, { 
        state: options.state || 'visible', 
        timeout 
      });
      logger.info(`Element found: ${selector}`);
      return true;
    } catch (error) {
      logger.error(`Element not found: ${selector} - ${error.message}`);
      throw new Error(`Element not found: ${selector}`);
    }
  }

  async click(selector, options = {}) {
    try {
      await this.waitForElement(selector);
      await this.page.click(selector, options);
      logger.info(`Clicked on: ${selector}`);
    } catch (error) {
      logger.error(`Failed to click: ${selector} - ${error.message}`);
      throw error;
    }
  }

  async fill(selector, text, options = {}) {
    try {
      await this.waitForElement(selector);
      await this.page.fill(selector, text, options);
      logger.info(`Filled text in: ${selector}`);
    } catch (error) {
      logger.error(`Failed to fill: ${selector} - ${error.message}`);
      throw error;
    }
  }

  async getText(selector) {
    try {
      await this.waitForElement(selector);
      const text = await this.page.textContent(selector);
      logger.info(`Got text from: ${selector}`);
      return text.trim();
    } catch (error) {
      logger.error(`Failed to get text: ${selector} - ${error.message}`);
      throw error;
    }
  }

  async isVisible(selector) {
    try {
      const isVisible = await this.page.isVisible(selector);
      logger.info(`Element visibility check for ${selector}: ${isVisible}`);
      return isVisible;
    } catch (error) {
      logger.error(`Failed to check visibility: ${selector}`);
      return false;
    }
  }

  async selectDropdownOption(dropdownSelector, optionText) {
    try {
      await this.click(dropdownSelector);
      await this.page.waitForTimeout(500); // Small wait for dropdown to open
      const optionSelector = `//div[@role='option']//span[text()='${optionText}']`;
      await this.click(optionSelector);
      logger.info(`Selected dropdown option: ${optionText}`);
    } catch (error) {
      logger.error(`Failed to select dropdown option: ${optionText} - ${error.message}`);
      throw error;
    }
  }

  async waitForToastMessage() {
    try {
      const toastSelector = this.locators.common.toast;
      await this.waitForElement(toastSelector, { timeout: 10000 });
      await this.page.waitForTimeout(500);
      logger.info('Toast message appeared');
    } catch (error) {
      logger.warn('No toast message appeared');
    }
  }

  async takeScreenshot(name) {
    try {
      const screenshotPath = path.join(
        this.config.screenshots.path,
        `${name}-${Date.now()}.png`
      );
      await this.page.screenshot({ path: screenshotPath, fullPage: true });
      logger.info(`Screenshot saved: ${screenshotPath}`);
      return screenshotPath;
    } catch (error) {
      logger.error(`Failed to take screenshot: ${error.message}`);
    }
  }

  async navigateTo(url) {
    try {
      await this.page.goto(url, { 
        waitUntil: 'networkidle',
        timeout: this.config.timeouts.navigation 
      });
      logger.info(`Navigated to: ${url}`);
    } catch (error) {
      logger.error(`Failed to navigate: ${url} - ${error.message}`);
      throw error;
    }
  }
}

module.exports = BasePage;
