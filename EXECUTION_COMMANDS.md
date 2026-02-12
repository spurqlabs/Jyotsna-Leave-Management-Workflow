# Test Execution Commands Reference

## Basic Execution

### Run All Tests
```bash
npm test
```

### Run Tests in Headed Mode
```bash
npm run test:headed
```

### Run Tests with Environment Variable
```bash
HEADED=true npm test
```

## Tag-Based Execution

### Run Smoke Tests
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

### Run Multiple Tags
```bash
npx cucumber-js --tags "@smoke and @positive"
npx cucumber-js --tags "@smoke or @regression"
npx cucumber-js --tags "not @negative"
```

## Feature-Based Execution

### Run Specific Feature
```bash
npx cucumber-js features/leaveManagement.feature
```

### Run Specific Scenario by Line Number
```bash
npx cucumber-js features/leaveManagement.feature:15
```

## Parallel Execution

### Run Tests in Parallel (2 workers)
```bash
npm run test:parallel
```

### Custom Parallel Configuration
```bash
npx cucumber-js --parallel 3
```

## Reporting

### Generate Reports
Reports are automatically generated after test execution

### View HTML Report
```bash
# macOS
open test-results/reports/cucumber-report.html

# Linux
xdg-open test-results/reports/cucumber-report.html

# Windows
start test-results/reports/cucumber-report.html
```

## Code Quality

### Run Linter
```bash
npm run lint
```

### Format Code
```bash
npm run format
```

## Dry Run

### Check Test Structure (No Execution)
```bash
npx cucumber-js --dry-run
```

## Custom Profiles

### Run with Specific Profile
```bash
npx cucumber-js --profile smoke
npx cucumber-js --profile regression
```

## Debug Mode

### Run with Debug Logs
```bash
DEBUG=* npm test
```

### Run Single Test for Debugging
```bash
npx cucumber-js features/leaveManagement.feature:10 --fail-fast
```

## CI/CD Commands

### Commands for CI Environment
```bash
# Install dependencies
npm ci

# Install Playwright browsers
npx playwright install --with-deps chromium

# Run tests in CI mode
HEADED=false npm test
```

## Clean Up

### Remove Test Results
```bash
rm -rf test-results/
```

### Remove Node Modules
```bash
rm -rf node_modules/
npm install
```

## Advanced Options

### Run with Retry on Failure
```bash
npx cucumber-js --retry 2
```

### Run with Specific Format
```bash
npx cucumber-js --format json:report.json
```

### Run with Name Pattern
```bash
npx cucumber-js --name "Apply for leave"
```

## Environment-Specific Execution

### Development
```bash
HEADED=true npm test
```

### Staging
```bash
npm test -- --profile regression
```

### Production Smoke Test
```bash
npm run test:smoke
```

## Quick Reference Table

| Command | Description | Use Case |
|---------|-------------|----------|
| `npm test` | Run all tests (headless) | CI/CD, regular execution |
| `npm run test:headed` | Run with browser visible | Local development, debugging |
| `npm run test:smoke` | Run smoke tests | Quick validation |
| `npm run test:regression` | Run regression suite | Full validation |
| `npm run test:parallel` | Parallel execution | Faster execution |
| `npm run lint` | Check code quality | Before commit |
| `npm run format` | Format code | Code cleanup |

## Tips

1. **First Run**: Always use `npm run test:headed` to see what's happening
2. **Debugging**: Use line number execution for specific scenarios
3. **CI/CD**: Always use headless mode with `HEADED=false`
4. **Development**: Use smoke tests for quick feedback
5. **Reports**: Check HTML report after each run for detailed results
