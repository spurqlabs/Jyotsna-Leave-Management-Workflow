const fs = require('fs');
const path = require('path');

class TimesheetPage {
  constructor(page) {
    this.page = page;
    this.locators = JSON.parse(
      fs.readFileSync(path.join(__dirname, '../../config/locators.json'), 'utf8')
    );
  }

  // Navigation methods
  async navigateToTimesheets() {
    await this.page.click(this.locators.navigation.time_menu);
    await this.page.click(this.locators.navigation.timesheets_submenu);
    await this.page.waitForTimeout(500);
    await this.page.click(this.locators.navigation.my_timesheets);
    await this.waitForPageLoad();
  }

  async waitForPageLoad() {
    await this.page.waitForSelector(this.locators.timesheet.timesheet_header);
    await this.waitForLoadingToComplete();
  }

  async waitForLoadingToComplete() {
    try {
      await this.page.waitForSelector(this.locators.common.loading_spinner, {
        state: 'hidden',
        timeout: 5000
      });
    } catch (error) {
      // Loading spinner might not appear for fast operations
    }
  }

  // Timesheet entry methods
  async clickEditButton() {
    await this.page.click(this.locators.timesheet.edit_button);
    await this.waitForPageLoad();
  }

  async addNewRow() {
    await this.page.click(this.locators.timesheet.add_new);
    await this.page.waitForTimeout(500);
  }

  async selectProject(projectName) {
    // Click on project input to open dropdown
    await this.page.click(this.locators.timesheet.project_dropdown);
    // Type project name to filter
    await this.page.fill(this.locators.timesheet.project_dropdown, projectName);
    // Wait for dropdown container and retry until real options appear
    try {
      await this.page.waitForSelector(this.locators.timesheet.project_dropdown_container, { state: 'visible', timeout: 10000 });
      let options = [];
      let retries = 0;
      while (retries < 10) {
        options = await this.page.$$eval(this.locators.timesheet.project_option, els => els.map(e => e.textContent.trim()));
        console.log('Available project options:', options);
        if (options.length > 0 && !options.includes('Searching....')) break;
        await this.page.waitForTimeout(500);
        retries++;
      }
      if (!options.includes(projectName)) {
        throw new Error(`Project option '${projectName}' not found in options: ${options}`);
      }
      const projectOption = `${this.locators.timesheet.project_option}:has-text("${projectName}")`;
      await this.page.waitForSelector(projectOption, { state: 'visible', timeout: 10000 });
      await this.page.click(projectOption);
    } catch (e) {
      // Take a screenshot for debugging
      if (this.page.screenshot) {
        await this.page.screenshot({ path: `test-results/screenshots/FAILED_ProjectOption_${projectName}_${Date.now()}.png` });
      }
      throw new Error(`Project option '${projectName}' not found or not clickable: ${e.message}`);
    }
  }

  async selectActivity(activityName) {
    // Click activity dropdown
    await this.page.click(this.locators.timesheet.activity_dropdown);
    // Debug: print all available activity options
    await this.page.waitForTimeout(500); // Give time for dropdown to open
    const options = await this.page.$$eval(this.locators.timesheet.activity_option, els => els.map(e => e.textContent.trim()));
    console.log('Available activity options:', options);
    const activityOption = `${this.locators.timesheet.activity_option}:has-text("${activityName}")`;
    await this.page.waitForSelector(activityOption, { state: 'visible', timeout: 5000 });
    await this.page.click(activityOption);
  }

  async enterHoursForDay(day, hours) {
    const dayInputMap = {
      'Monday': this.locators.timesheet.monday_input,
      'Tuesday': this.locators.timesheet.tuesday_input,
      'Wednesday': this.locators.timesheet.wednesday_input,
      'Thursday': this.locators.timesheet.thursday_input,
      'Friday': this.locators.timesheet.friday_input,
      'Saturday': this.locators.timesheet.saturday_input,
      'Sunday': this.locators.timesheet.sunday_input
    };

    const inputSelector = dayInputMap[day];
    if (!inputSelector) {
      throw new Error(`Invalid day: ${day}`);
    }

    // Get the last added row's input for the specified day
    const inputs = await this.page.$$(inputSelector);
    const lastInput = inputs[inputs.length - 1];
    await lastInput.fill(hours);
    await this.page.waitForTimeout(200);
  }

  async updateHoursForDay(projectName, day, newHours) {
    // Find the row with the specific project
    const rows = await this.page.$$(this.locators.timesheet.timesheet_row);
    
    for (let i = 0; i < rows.length; i++) {
      const row = rows[i];
      const projectCell = await row.$(this.locators.timesheet.project_cell);
      const projectText = await projectCell.textContent();
      
      if (projectText.trim() === projectName) {
        const dayInputMap = {
          'Monday': 3,
          'Tuesday': 4,
          'Wednesday': 5,
          'Thursday': 6,
          'Friday': 7,
          'Saturday': 8,
          'Sunday': 9
        };
        
        const cellIndex = dayInputMap[day];
        const dayCell = await row.$(`td:nth-child(${cellIndex})`);
        const input = await dayCell.$('input');
        await input.fill(newHours);
        await this.page.waitForTimeout(200);
        break;
      }
    }
  }

  async getTotalHoursForDay(day) {
    const totalHoursMap = {
      'Monday': this.locators.timesheet.total_hours_monday,
      'Tuesday': this.locators.timesheet.total_hours_tuesday,
      'Wednesday': this.locators.timesheet.total_hours_wednesday,
      'Thursday': this.locators.timesheet.total_hours_thursday,
      'Friday': this.locators.timesheet.total_hours_friday,
      'Saturday': this.locators.timesheet.total_hours_saturday,
      'Sunday': this.locators.timesheet.total_hours_sunday
    };

    const totalSelector = totalHoursMap[day];
    if (!totalSelector) {
      throw new Error(`Invalid day: ${day}`);
    }

    // Wait for the total hours cell to be visible
    try {
      await this.page.waitForSelector(totalSelector, { state: 'visible', timeout: 7000 });
    } catch (e) {
      throw new Error(`Total hours cell for ${day} not found or not visible: ${e.message}`);
    }
    const totalElement = await this.page.$(totalSelector);
    if (!totalElement) {
      throw new Error(`Total hours element for ${day} is null`);
    }
    const text = await totalElement.textContent();
    if (!text) {
      throw new Error(`Total hours text for ${day} is empty or null`);
    }
    return text;
  }

  async clickSaveButton() {
    await this.page.click(this.locators.timesheet.save_button);
    await this.waitForLoadingToComplete();
    await this.page.waitForTimeout(1000);
  }

  async clickSubmitButton() {
    await this.page.click(this.locators.timesheet.submit_button);
    await this.waitForLoadingToComplete();
    await this.page.waitForTimeout(1000);
  }

  async addComment(comment) {
    // Wait for the comment textarea to be visible before filling
    await this.page.waitForSelector(this.locators.timesheet.comment_textarea, { state: 'visible', timeout: 10000 });
    await this.page.fill(this.locators.timesheet.comment_textarea, comment);
    await this.page.waitForTimeout(200);
  }

  // Verification methods
  async isSuccessMessageDisplayed() {
    try {
      await this.page.waitForSelector(this.locators.timesheet.success_message, {
        timeout: 5000
      });
      return true;
    } catch (error) {
      return false;
    }
  }

  async getSuccessMessage() {
    const element = await this.page.$(this.locators.timesheet.success_message);
    return await element.textContent();
  }

  async getTimesheetStatus() {
    const statusElement = await this.page.$(this.locators.timesheet.status_label);
    return await statusElement.textContent();
  }

  async isTimesheetEntryPresent(projectName) {
    const rows = await this.page.$$(this.locators.timesheet.timesheet_row);
    
    for (let row of rows) {
      const projectCell = await row.$(this.locators.timesheet.project_cell);
      const projectText = await projectCell.textContent();
      
      if (projectText.trim() === projectName) {
        return true;
      }
    }
    return false;
  }

  async getHoursForProjectAndDay(projectName, day) {
    const rows = await this.page.$$(this.locators.timesheet.timesheet_row);
    
    for (let row of rows) {
      const projectCell = await row.$(this.locators.timesheet.project_cell);
      const projectText = await projectCell.textContent();
      
      if (projectText.trim() === projectName) {
        const dayInputMap = {
          'Monday': 3,
          'Tuesday': 4,
          'Wednesday': 5,
          'Thursday': 6,
          'Friday': 7,
          'Saturday': 8,
          'Sunday': 9
        };
        
        const cellIndex = dayInputMap[day];
        const dayCell = await row.$(`td:nth-child(${cellIndex})`);
        const input = await dayCell.$('input');
        return await input.inputValue();
      }
    }
    return null;
  }

  async closeToastMessage() {
    try {
      await this.page.click(this.locators.timesheet.toast_close);
    } catch (error) {
      // Toast might auto-close
    }
  }
}

module.exports = TimesheetPage;
