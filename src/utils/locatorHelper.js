const fs = require('fs');
const path = require('path');

/**
 * Loads locators from a given JSON file in the config directory.
 * @param {string} locatorFileName - The name of the locator JSON file (e.g., 'locators_login.json')
 * @returns {object} The locator object
 */
function getLocators(locatorFileName) {
  const locatorsPath = path.join(__dirname, '../../config', locatorFileName);
  if (!fs.existsSync(locatorsPath)) {
    throw new Error(`Locator file not found: ${locatorsPath}`);
  }
  return JSON.parse(fs.readFileSync(locatorsPath, 'utf8'));
}

module.exports = { getLocators };
