# Troubleshooting Guide

## Common Issues and Fixes

### ✅ Issue 1: "cucumber-js is not recognized"

**Problem**: Dependencies not installed

**Fix**:
```bash
npm install
```

---

### ✅ Issue 2: "Cannot find module" errors

**Problem**: Module paths were incorrect (FIXED in latest version)

**Status**: ✅ All import paths have been corrected to use `../../src/pages/` and `../../src/utils/`

---

### ✅ Issue 3: Node.js version warning

**Warning**: "This Node.js version (v24.13.0) has not been tested..."

**Fix**: This is just a warning, not an error. Your tests will work fine. You can ignore it.

If you want to suppress it, use Node.js v20.x or v18.x:
```bash
# Check your version
node --version

# If needed, install Node.js LTS from: https://nodejs.org/
```

---

## 🚀 Complete Setup (Start Here)

### Step 1: Extract Archive
```bash
unzip orangehrm-automation.zip
cd orangehrm-automation
```

### Step 2: Install Dependencies
```bash
npm install
```

This will install:
- @cucumber/cucumber
- @playwright/test
- winston (logger)
- All other dependencies

### Step 3: Install Browser
```bash
npx playwright install chromium
```

### Step 4: Verify Setup
```bash
npm test -- --dry-run
```

You should see:
```
✔ All step definitions found
✔ No errors
```

### Step 5: Run Tests
```bash
# With visible browser (recommended first time)
npm run test:headed

# Or headless
npm test
```

---

## 🔍 Verification Commands

### Check if everything is installed correctly:

```bash
# 1. Check Node.js
node --version
# Should show: v18.x, v20.x, or v24.x

# 2. Check npm
npm --version
# Should show: 9.x or 10.x

# 3. Check if cucumber is installed
npx cucumber-js --version
# Should show: 10.3.1 or similar

# 4. Dry run (no execution)
npm test -- --dry-run
# Should show all scenarios found

# 5. List installed packages
npm list --depth=0
# Should show all dependencies
```

---

## 📝 Expected Output After Setup

### After `npm install`:
```
added 150+ packages in 30s
```

### After `npx playwright install chromium`:
```
Downloading Chromium...
✔ Chromium downloaded
```

### After `npm test -- --dry-run`:
```
6 scenarios (6 skipped)
40 steps (40 skipped)
```

---

## ⚠️ If Problems Persist

### Clean Install:
```bash
# Delete node_modules and package-lock.json
rm -rf node_modules package-lock.json

# Reinstall everything
npm install
npx playwright install chromium
```

### Windows Users:
```cmd
# Use PowerShell or Command Prompt
rmdir /s node_modules
del package-lock.json

npm install
npx playwright install chromium
```

---

## 🐛 Common Error Messages & Fixes

### Error: "ENOENT: no such file or directory"
**Fix**: Make sure you're in the `orangehrm-automation` directory
```bash
cd orangehrm-automation
ls
# You should see: package.json, features/, src/, etc.
```

### Error: "Cannot find module '@cucumber/cucumber'"
**Fix**: Dependencies not installed
```bash
npm install
```

### Error: "Cannot find module '../../pages/AdminPage'"
**Fix**: ✅ ALREADY FIXED in latest version
- All paths now correctly point to `../../src/pages/`

### Error: "Executable doesn't exist at ..."
**Fix**: Playwright browser not installed
```bash
npx playwright install chromium
```

---

## ✅ Quick Test Commands

```bash
# After setup is complete:

# Run all tests with browser visible
npm run test:headed

# Run specific module
npx cucumber-js --tags @leave
npx cucumber-js --tags @dashboard  
npx cucumber-js --tags @admin

# Run smoke tests
npm run test:smoke

# Run single feature file
npx cucumber-js features/leaveManagement.feature
```

---

## 📞 Need Help?

1. Check logs in `test-results/logs/`
2. Review screenshots in `test-results/screenshots/`
3. Read README.md for detailed documentation
4. Check SETUP_GUIDE.md for installation steps

---

## 🎯 Success Checklist

- [x] Node.js installed (v18+ or v20+)
- [x] `npm install` completed successfully
- [x] `npx playwright install chromium` completed
- [x] `npm test -- --dry-run` shows no errors
- [x] Tests run with `npm run test:headed`

If all items are checked, you're ready to go! 🚀
