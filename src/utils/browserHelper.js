const { chromium, firefox, webkit } = require('@playwright/test');
const fs = require('fs-extra');
const config = require('../../config/config.json');
const logger = require('./logger');

class BrowserHelper {
  constructor() {
    this.browser = null;
    this.context = null;
    this.page = null;
  }

  async launchBrowser() {
    try {
      const browserConfig = config.browser;
      const isHeaded = process.env.HEADED === 'true' || !browserConfig.headless;

      const launchOptions = {
        headless: !isHeaded,
        slowMo: browserConfig.slowMo || 0,
        args: browserConfig.args || []
      };

      // Launch browser based on configuration
      switch (browserConfig.name.toLowerCase()) {
        case 'firefox':
          this.browser = await firefox.launch(launchOptions);
          break;
        case 'webkit':
          this.browser = await webkit.launch(launchOptions);
          break;
        case 'chromium':
        default:
          this.browser = await chromium.launch(launchOptions);
      }

      logger.info(`Browser launched: ${browserConfig.name} (headless: ${!isHeaded})`);
      return this.browser;
    } catch (error) {
      logger.error(`Failed to launch browser: ${error.message}`);
      throw error;
    }
  }

  async createContext() {
    try {
      if (!this.browser) {
        await this.launchBrowser();
      }

      const contextOptions = {
        viewport: config.browser.viewport || { width: 1920, height: 1080 },
        ignoreHTTPSErrors: true,
        permissions: ['geolocation']
      };

      this.context = await this.browser.newContext(contextOptions);
      
      // Set default timeout
      this.context.setDefaultTimeout(config.timeouts.default);
      
      logger.info('Browser context created');
      return this.context;
    } catch (error) {
      logger.error(`Failed to create context: ${error.message}`);
      throw error;
    }
  }

  async createPage() {
    try {
      if (!this.context) {
        await this.createContext();
      }

      this.page = await this.context.newPage();
      
      // Set viewport
      await this.page.setViewportSize(config.browser.viewport);
      
      logger.info('New page created');
      return this.page;
    } catch (error) {
      logger.error(`Failed to create page: ${error.message}`);
      throw error;
    }
  }

  async takeScreenshot(name) {
    try {
      if (!this.page) {
        logger.warn('No page available for screenshot');
        return null;
      }

      const screenshotDir = config.screenshots.path;
      await fs.ensureDir(screenshotDir);

      const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
      const filename = `${name}_${timestamp}.png`;
      const filepath = `${screenshotDir}/${filename}`;

      await this.page.screenshot({
        path: filepath,
        fullPage: true
      });

      logger.info(`Screenshot saved: ${filepath}`);
      return filepath;
    } catch (error) {
      logger.error(`Failed to take screenshot: ${error.message}`);
      return null;
    }
  }

  async closePage() {
    try {
      if (this.page) {
        await this.page.close();
        this.page = null;
        logger.info('Page closed');
      }
    } catch (error) {
      logger.error(`Failed to close page: ${error.message}`);
    }
  }

  async closeContext() {
    try {
      if (this.context) {
        await this.context.close();
        this.context = null;
        logger.info('Context closed');
      }
    } catch (error) {
      logger.error(`Failed to close context: ${error.message}`);
    }
  }

  async closeBrowser() {
    try {
      await this.closePage();
      await this.closeContext();
      
      if (this.browser) {
        await this.browser.close();
        this.browser = null;
        logger.info('Browser closed');
      }
    } catch (error) {
      logger.error(`Failed to close browser: ${error.message}`);
    }
  }

  getPage() {
    return this.page;
  }

  getBrowser() {
    return this.browser;
  }

  getContext() {
    return this.context;
  }
}

module.exports = BrowserHelper;
