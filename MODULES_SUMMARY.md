# OrangeHRM Test Automation - Modules Summary

## 📊 Test Modules Overview

This framework covers **3 modules** with **2 scenarios each**, as per requirements.

---

## 🎯 Module 1: Leave Module (2 Scenarios)

### Scenario 1: Apply for leave successfully
**Tag**: @leave @smoke @positive  
**File**: `features/leaveManagement.feature`

**Steps**:
1. Login to application
2. Navigate to Apply Leave page
3. Select leave type
4. Enter from and to dates
5. Enter comment
6. Click Apply button
7. Verify success message

**Test Data**: Configured in `config/testData.json`

---

### Scenario 2: View applied leave in My Leave list
**Tag**: @leave @smoke @positive  
**File**: `features/leaveManagement.feature`

**Steps**:
1. Login and apply leave (precondition)
2. Navigate to My Leave page
3. Search by date range
4. Verify leave appears in list
5. Verify leave status is "Pending Approval"

**Validations**: Leave presence, status verification

---

## 🏠 Module 2: Dashboard Module (2 Scenarios)

### Scenario 1: Verify dashboard displays after successful login
**Tag**: @dashboard @smoke @positive  
**File**: `features/dashboard.feature`

**Steps**:
1. Login with valid credentials
2. Verify dashboard is displayed
3. Verify dashboard header displays "Dashboard"
4. Verify main menu with options is visible

**Page Objects**: `LoginPage.js`, `DashboardPage.js`

---

### Scenario 2: Navigate to different modules from dashboard
**Tag**: @dashboard @smoke @positive  
**File**: `features/dashboard.feature`

**Steps**:
1. Login to application
2. Navigate to Leave module from dashboard
3. Verify Leave menu options
4. Navigate back to dashboard
5. Verify dashboard is displayed

**Locators**: Defined in `config/locators.json` under `dashboardPage`

---

## 👤 Module 3: Admin Module (2 Scenarios)

### Scenario 1: Access Admin module and verify page elements
**Tag**: @admin @smoke @positive  
**File**: `features/admin.feature`

**Steps**:
1. Login to application
2. Navigate to Admin module
3. Verify Admin page header
4. Verify user management options visible
5. Verify search functionality visible

**Page Object**: `AdminPage.js`

---

### Scenario 2: Search for existing user in Admin module
**Tag**: @admin @smoke @positive  
**File**: `features/admin.feature`

**Steps**:
1. Login to application
2. Navigate to Admin module
3. Enter username "Admin" in search
4. Click search button
5. Verify search results displayed
6. Verify "Admin" user appears in results

**Validations**: Search results presence, user in results

---

## 📂 Implementation Files

### Feature Files (3)
```
features/
├── leaveManagement.feature    # 2 scenarios
├── dashboard.feature          # 2 scenarios
└── admin.feature              # 2 scenarios
```

### Page Objects (6)
```
src/pages/
├── BasePage.js               # Base class
├── LoginPage.js              # Login functionality
├── DashboardPage.js          # Dashboard + navigation
├── ApplyLeavePage.js         # Leave application
├── MyLeavePage.js            # Leave viewing
└── AdminPage.js              # Admin functionality
```

### Step Definitions (5)
```
features/step_definitions/
├── loginSteps.js             # Login steps
├── dashboardSteps.js         # Dashboard navigation steps
├── applyLeaveSteps.js        # Leave application steps
├── myLeaveSteps.js           # Leave viewing steps
└── adminSteps.js             # Admin module steps
```

---

## 🔧 Configuration

### Locators (`config/locators.json`)
```json
{
  "loginPage": {...},
  "dashboardPage": {...},
  "adminPage": {...},
  "leaveMenu": {...},
  "applyLeavePage": {...},
  "myLeavePage": {...}
}
```

### Test Data (`config/testData.json`)
```json
{
  "credentials": {
    "valid": {
      "username": "Admin",
      "password": "admin123"
    }
  },
  "leaveApplications": {...}
}
```

---

## 🚀 Running Module Tests

### Run All Tests (6 scenarios)
```bash
npm test
```

### Run Specific Module

#### Leave Module
```bash
npx cucumber-js --tags @leave
```

#### Dashboard Module
```bash
npx cucumber-js --tags @dashboard
```

#### Admin Module
```bash
npx cucumber-js --tags @admin
```

### Run Smoke Tests (all 6 scenarios)
```bash
npm run test:smoke
```

---

## ✅ Test Execution Summary

| Module | Scenarios | Tags | Status |
|--------|-----------|------|--------|
| Leave | 2 | @leave @smoke @positive | ✅ Ready |
| Dashboard | 2 | @dashboard @smoke @positive | ✅ Ready |
| Admin | 2 | @admin @smoke @positive | ✅ Ready |
| **Total** | **6** | - | **✅ Complete** |

---

## 📊 Coverage Matrix

| Module | Feature | Page Object | Step Definitions | Locators |
|--------|---------|-------------|------------------|----------|
| Leave | ✅ | ✅ | ✅ | ✅ |
| Dashboard | ✅ | ✅ | ✅ | ✅ |
| Admin | ✅ | ✅ | ✅ | ✅ |

---

## 🎯 Key Features Per Module

### Leave Module
- Apply leave workflow
- Leave verification
- Date range filtering
- Status validation

### Dashboard Module
- Login verification
- Dashboard display
- Module navigation
- Menu visibility

### Admin Module
- Admin access
- User search
- Search results validation
- Page element verification

---

## 📝 Test Data Management

Each module uses:
- **Centralized locators** in `locators.json`
- **Externalized test data** in `testData.json`
- **Page Object Model** for maintainability
- **Reusable step definitions** for efficiency

---

## 🔍 Scenario Details

### Leave Module Scenarios

**Scenario 1: Apply Leave**
- **Given**: User is on dashboard
- **When**: User applies leave with details
- **Then**: Success message displayed

**Scenario 2: View Leave**
- **Given**: Leave is applied
- **When**: User searches in My Leave
- **Then**: Leave appears with correct status

### Dashboard Module Scenarios

**Scenario 1: Dashboard Display**
- **Given**: User logs in
- **Then**: Dashboard displayed with header and menu

**Scenario 2: Module Navigation**
- **Given**: User is on dashboard
- **When**: User navigates to Leave module
- **Then**: Leave module displayed

### Admin Module Scenarios

**Scenario 1: Admin Access**
- **Given**: User is on dashboard
- **When**: User navigates to Admin
- **Then**: Admin page with management options displayed

**Scenario 2: User Search**
- **Given**: User is in Admin module
- **When**: User searches for "Admin"
- **Then**: Search results contain "Admin" user

---

## 🎓 Learning Points

This implementation demonstrates:
1. **BDD approach** with Gherkin syntax
2. **Modular test design** - 2 scenarios per module
3. **Page Object Model** architecture
4. **Configuration management** via JSON
5. **Reusable components** and utilities
6. **Clean code principles**

---

## ✨ Quick Reference

### Execute Specific Scenarios
```bash
# Leave module only
npx cucumber-js features/leaveManagement.feature

# Dashboard module only
npx cucumber-js features/dashboard.feature

# Admin module only
npx cucumber-js features/admin.feature
```

### View Reports
```bash
open test-results/reports/cucumber-report.html
```

---

**Total Modules**: 3  
**Total Scenarios**: 6 (2 per module)  
**Total Feature Files**: 3  
**Total Page Objects**: 6  
**Status**: ✅ Complete and Ready for Execution

---

**Framework**: Playwright + Cucumber + JavaScript + Node.js  
**Pattern**: Page Object Model + BDD  
**Configuration**: JSON-based  
**Reporting**: HTML + JSON + XML
