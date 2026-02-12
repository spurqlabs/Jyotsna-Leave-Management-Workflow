# Jyotsna-Leave-Management-Workflow-

# OrangeHRM Leave Management Test Automation Framework

[![Tests](https://github.com/yourusername/orangehrm-automation/actions/workflows/test.yml/badge.svg)](https://github.com/yourusername/orangehrm-automation/actions)
[![Node.js Version](https://img.shields.io/badge/node-%3E%3D18.0.0-brightgreen)](https://nodejs.org/)
[![License](https://img.shields.io/badge/license-MIT-blue.svg)](LICENSE)

A comprehensive BDD test automation framework for OrangeHRM Leave Management module using Playwright, Cucumber, and Node.js.

## 📋 Table of Contents
- [Features](#features)
- [Technology Stack](#technology-stack)
- [Project Structure](#project-structure)
- [Prerequisites](#prerequisites)
- [Installation](#installation)
- [Configuration](#configuration)
- [Running Tests](#running-tests)
- [Test Reports](#test-reports)
- [CI/CD Integration](#cicd-integration)
- [Best Practices](#best-practices)
- [Contributing](#contributing)

## ✨ Features

### Must Have Features (70 points)
- ✅ **Cucumber BDD Framework** - Behavior-driven development with Gherkin syntax
- ✅ **Step Definitions** - Properly mapped Gherkin steps to code
- ✅ **Page Object Model** - Clean, maintainable page object architecture
- ✅ **Locators in JSON** - Centralized locator management in `locators.json`
- ✅ **Test Data in JSON** - Externalized test data in `testData.json`
- ✅ **Configuration Management** - Environment config in `config.json`
- ✅ **Before/After Hooks** - Setup and teardown with proper lifecycle management
- ✅ **Explicit Waits** - No hard-coded delays, only intelligent waits
- ✅ **Proper Assertions** - Meaningful assertions with descriptive messages
- ✅ **Exception Handling** - Comprehensive error handling and logging
- ✅ **Clean Code** - Follows best practices and naming conventions
- ✅ **Comprehensive README** - Complete setup and execution instructions

### Good to Have Features (30 points)
- ⭐ **Screenshot on Failure** - Automatic screenshot capture for failed tests
- ⭐ **Logging Framework** - Winston logger with multiple log levels
- ⭐ **Enhanced Reporting** - HTML, JSON, and XML reports
- ⭐ **Tag-based Execution** - @smoke, @regression, @negative tags
- ⭐ **Scenario Outline** - Data-driven testing support
- ⭐ **Parallel Execution** - Configurable parallel test execution
- ⭐ **CI/CD Pipeline** - GitHub Actions workflow configuration
- ⭐ **Code Quality Tools** - ESLint and Prettier integration

## 🛠️ Technology Stack

| Technology | Purpose | Version |
|------------|---------|---------|
| Node.js | Runtime environment | >= 18.x |
| Playwright | Browser automation | ^1.40.1 |
| Cucumber | BDD framework | ^10.3.1 |
| JavaScript | Programming language | ES2021 |
| Winston | Logging framework | ^3.11.0 |
| ESLint | Code linting | ^8.56.0 |
| Prettier | Code formatting | ^3.1.1 |

## 📁 Project Structure

```
orangehrm-automation/
├── config/
│   ├── config.json              # Application configuration
│   ├── locators.json            # Element locators by page
│   └── testData.json            # Test data for scenarios
├── features/
│   ├── leaveManagement.feature  # Leave module scenarios (2)
│   ├── dashboard.feature        # Dashboard module scenarios (2)
│   ├── admin.feature            # Admin module scenarios (2)
│   ├── step_definitions/        # Step definition implementations
│   │   ├── loginSteps.js
│   │   ├── dashboardSteps.js
│   │   ├── applyLeaveSteps.js
│   │   ├── myLeaveSteps.js
│   │   └── adminSteps.js
│   └── support/
│       └── hooks.js             # Before/After hooks
├── src/
│   ├── pages/                   # Page Object Model classes
│   │   ├── BasePage.js
│   │   ├── LoginPage.js
│   │   ├── DashboardPage.js
│   │   ├── ApplyLeavePage.js
│   │   ├── MyLeavePage.js
│   │   └── AdminPage.js
│   └── utils/                   # Utility classes
│       ├── logger.js
│       ├── browserHelper.js
│       └── testDataHelper.js
├── test-results/                # Test execution results
│   ├── reports/
│   ├── screenshots/
│   └── logs/
├── .github/
│   └── workflows/
│       └── test.yml             # CI/CD pipeline
├── cucumber.js                  # Cucumber configuration
├── package.json                 # Project dependencies
├── .eslintrc.js                 # ESLint configuration
├── .prettierrc                  # Prettier configuration
├── .gitignore                   # Git ignore rules
└── README.md                    # This file
```

## 📋 Prerequisites

Before you begin, ensure you have the following installed:

1. **Node.js** (>= 18.x)
   ```bash
   node --version  # Should show v18.x or higher
   ```

2. **npm** (comes with Node.js)
   ```bash
   npm --version
   ```

3. **Git** (for version control)
   ```bash
   git --version
   ```

## 🚀 Installation

### Step 1: Clone the Repository
```bash
git clone https://github.com/yourusername/orangehrm-automation.git
cd orangehrm-automation
```

### Step 2: Install Dependencies
```bash
npm install
```

### Step 3: Install Playwright Browsers
```bash
npx playwright install chromium
```

### Step 4: Verify Installation
```bash
npm test -- --dry-run
```

## ⚙️ Configuration

### 1. Application Configuration (`config/config.json`)

Configure browser, timeouts, and execution settings:

```json
{
  "baseURL": "https://opensource-demo.orangehrmlive.com/",
  "browser": {
    "name": "chromium",
    "headless": false
  },
  "timeouts": {
    "default": 30000,
    "navigation": 60000
  }
}
```

### 2. Test Data (`config/testData.json`)

Manage credentials and test data:

```json
{
  "credentials": {
    "valid": {
      "username": "Admin",
      "password": "admin123"
    }
  },
  "leaveApplications": {
    "casualLeave": {
      "leaveType": "CAN - FMLA",
      "fromDate": "2025-02-20",
      "toDate": "2025-02-21"
    }
  }
}
```

### 3. Locators (`config/locators.json`)

Element locators organized by page:

```json
{
  "loginPage": {
    "usernameInput": "input[name='username']",
    "passwordInput": "input[name='password']"
  }
}
```

## 🎯 Running Tests

### Run All Tests
```bash
npm test
```

### Run in Headed Mode (See Browser)
```bash
npm run test:headed
```

### Run Smoke Tests Only
```bash
npm run test:smoke
```

### Run Regression Tests
```bash
npm run test:regression
```

### Run Negative Tests
```bash
npm run test:negative
```

### Run Tests in Parallel
```bash
npm run test:parallel
```

### Run Specific Feature File
```bash
npx cucumber-js features/leaveManagement.feature
```

### Run Specific Scenario by Line Number
```bash
npx cucumber-js features/leaveManagement.feature:10
```

### Run with Specific Tag
```bash
npx cucumber-js --tags "@smoke and @positive"
```

## 📊 Test Reports

### Generated Reports

After test execution, reports are generated in `test-results/reports/`:

1. **HTML Report** - `cucumber-report.html`
   - Interactive HTML report with scenarios and steps
   - Open in browser: `test-results/reports/cucumber-report.html`

2. **JSON Report** - `cucumber-report.json`
   - Machine-readable format for CI/CD integration

3. **JUnit XML** - `cucumber-report.xml`
   - Standard format for test reporting tools

### View Reports

```bash
# Open HTML report in default browser (macOS)
open test-results/reports/cucumber-report.html

# Linux
xdg-open test-results/reports/cucumber-report.html

# Windows
start test-results/reports/cucumber-report.html
```

### Logs

Execution logs are stored in `test-results/logs/`:
- `test-execution.log` - All logs
- `errors.log` - Error logs only

### Screenshots

Screenshots (on failure) are saved in `test-results/screenshots/`

## 🔄 CI/CD Integration

### GitHub Actions

The project includes a GitHub Actions workflow (`.github/workflows/test.yml`) that:

1. Runs on push to main/develop branches
2. Runs on pull requests
3. Scheduled daily execution at 2 AM UTC
4. Manual trigger option
5. Uploads test results and screenshots as artifacts
6. Supports multiple Node.js versions

### Trigger Manual Run

Go to Actions tab → Select workflow → Click "Run workflow"

### View Results

Navigate to Actions tab → Select workflow run → Download artifacts

## 📝 Best Practices Implemented

### 1. Page Object Model
- Each page has a dedicated class
- Locators are externalized
- Reusable methods for page interactions

### 2. Data-Driven Testing
- Test data separated from test logic
- JSON-based data management
- Easy to maintain and update

### 3. Explicit Waits
- No `Thread.sleep()` or `waitForTimeout()` in production code
- Intelligent waiting for elements
- Timeout configurations

### 4. Logging
- Comprehensive logging at each step
- Log levels: info, warn, error
- Separate error logs for debugging

### 5. Error Handling
- Try-catch blocks for robust error handling
- Meaningful error messages
- Screenshot on failure

### 6. Code Quality
- ESLint for code linting
- Prettier for code formatting
- Consistent coding standards

## 🎓 Understanding the Framework

### Writing New Test Scenarios

1. **Add Feature File** (`features/yourFeature.feature`)
```gherkin
Feature: Your Feature Name
  Scenario: Your scenario
    Given precondition
    When action
    Then expected result
```

2. **Implement Step Definitions** (`features/step_definitions/yourSteps.js`)
```javascript
const { Given, When, Then } = require('@cucumber/cucumber');

Given('precondition', async function () {
  // Implementation
});
```

3. **Create Page Objects** (if needed) (`src/pages/YourPage.js`)
```javascript
const BasePage = require('./BasePage');

class YourPage extends BasePage {
  async performAction() {
    // Implementation
  }
}
```

### Adding New Locators

Update `config/locators.json`:
```json
{
  "yourPage": {
    "elementName": "selector"
  }
}
```

### Adding Test Data

Update `config/testData.json`:
```json
{
  "yourData": {
    "field": "value"
  }
}
```

## 🐛 Troubleshooting

### Common Issues

**Issue: Tests fail with timeout**
- Solution: Increase timeout in `config/config.json`

**Issue: Browser not launching**
- Solution: Run `npx playwright install chromium`

**Issue: Element not found**
- Solution: Verify locators in `config/locators.json`

**Issue: Test data not loading**
- Solution: Check `config/testData.json` syntax

## 📈 Test Coverage

Current test coverage:

### Module Coverage
- **Leave Module** ✅
  - Apply for leave
  - View applied leaves
- **Dashboard Module** ✅  
  - Dashboard display verification
  - Module navigation
- **Admin Module** ✅
  - Access admin page
  - Search users

**Total Features: 3**  
**Total Scenarios: 6 (2 per module)**

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 👤 Author

**Jyotsna**
- Assignment: Leave Management Workflow Automation
- Framework: Playwright + JavaScript + Cucumber + Node.js

## 📞 Support

For support, create an issue in the GitHub repository or contact the team.

## 🙏 Acknowledgments

- OrangeHRM for providing the demo application
- Playwright team for the excellent automation framework
- Cucumber team for BDD framework
- Open source community

---

**Note**: This framework is created as part of an automation assignment for OrangeHRM Leave Management module. It demonstrates industry best practices and comprehensive test automation capabilities.

## 📚 Additional Resources

- [Playwright Documentation](https://playwright.dev/)
- [Cucumber Documentation](https://cucumber.io/docs/cucumber/)
- [Node.js Documentation](https://nodejs.org/docs/)
- [OrangeHRM Demo](https://opensource-demo.orangehrmlive.com/)

---

**Happy Testing! 🚀**
