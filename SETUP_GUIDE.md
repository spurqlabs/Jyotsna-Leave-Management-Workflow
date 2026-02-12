# Quick Setup Guide

## Prerequisites
- Node.js >= 18.x
- npm >= 9.x
- Git

## Installation Steps

### 1. Install Node.js
Download and install from: https://nodejs.org/

Verify installation:
```bash
node --version
npm --version
```

### 2. Clone Repository
```bash
git clone <your-repo-url>
cd orangehrm-automation
```

### 3. Install Dependencies
```bash
npm install
```

### 4. Install Playwright Browser
```bash
npx playwright install chromium
```

### 5. Verify Setup
```bash
npm test -- --dry-run
```

## First Test Run

### Run in Headed Mode (Recommended for first run)
```bash
npm run test:headed
```

### Run Smoke Tests
```bash
npm run test:smoke
```

## Configuration

### Change Browser Settings
Edit `config/config.json`:
```json
{
  "browser": {
    "name": "chromium",
    "headless": false
  }
}
```

### Update Test Data
Edit `config/testData.json` to modify credentials or test data

## Common Commands

| Command | Description |
|---------|-------------|
| `npm test` | Run all tests (headless) |
| `npm run test:headed` | Run with visible browser |
| `npm run test:smoke` | Run smoke tests only |
| `npm run test:regression` | Run regression tests |
| `npm run lint` | Check code quality |

## Viewing Reports

After test execution:
```bash
# Open HTML report
open test-results/reports/cucumber-report.html
```

## Troubleshooting

### Tests timeout
- Increase timeout in `config/config.json`
- Check network connectivity

### Browser not launching
- Run: `npx playwright install chromium --force`

### Dependencies issues
- Delete `node_modules` and `package-lock.json`
- Run: `npm install`

## Need Help?

- Check logs in `test-results/logs/`
- View screenshots in `test-results/screenshots/`
- Refer to main README.md for detailed documentation
