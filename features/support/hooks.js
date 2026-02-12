const { Before, After, BeforeAll, AfterAll, Status, setDefaultTimeout } = require('@cucumber/cucumber');
const BrowserHelper = require('../../src/utils/browserHelper');
const logger = require('../../src/utils/logger');
const fs = require('fs-extra');
const config = require('../../config/config.json');

// Set default timeout for all steps to 2 minutes
setDefaultTimeout(120000);

// Initialize browser helper
const browserHelper = new BrowserHelper();

BeforeAll(async function () {
  logger.info('='.repeat(100));
  logger.info('TEST EXECUTION STARTED');
  logger.info('='.repeat(100));
  
  // Ensure required directories exist
  await fs.ensureDir(config.screenshots.path);
  await fs.ensureDir(config.logging.path);
  await fs.ensureDir('test-results/reports');
  
  logger.info('Test environment setup completed');
});

Before(async function (scenario) {
  try {
    logger.scenario(scenario.pickle.name);
    logger.info(`Tags: ${scenario.pickle.tags.map(tag => tag.name).join(', ')}`);
    
    // Launch browser and create page
    await browserHelper.launchBrowser();
    await browserHelper.createContext();
    const page = await browserHelper.createPage();
    
    // Attach page to scenario context
    this.page = page;
    this.browserHelper = browserHelper;
    
    logger.info('Browser initialized for scenario');
  } catch (error) {
    logger.error(`Failed to initialize browser: ${error.message}`);
    throw error;
  }
});

After(async function (scenario) {
  try {
    // Take screenshot on failure
    if (scenario.result.status === Status.FAILED && config.screenshots.onFailure) {
      const screenshotName = scenario.pickle.name.replace(/\s+/g, '_');
      await browserHelper.takeScreenshot(`FAILED_${screenshotName}`);
      logger.error(`Scenario failed: ${scenario.pickle.name}`);
    } else if (scenario.result.status === Status.PASSED) {
      logger.info(`Scenario passed: ${scenario.pickle.name}`);
    }
    
    // Close browser
    await browserHelper.closeBrowser();
    logger.info('Browser closed after scenario');
    
  } catch (error) {
    logger.error(`Error in After hook: ${error.message}`);
  }
});

AfterAll(async function () {
  logger.info('='.repeat(100));
  logger.info('TEST EXECUTION COMPLETED');
  logger.info('='.repeat(100));
});

module.exports = { browserHelper };
