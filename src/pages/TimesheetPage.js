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
    await this.page.click(this.locators.timesheet.add_row_button);
    await this.page.waitForTimeout(500);
  }

  async selectProject(projectName) {
    // Click on project input to open dropdown
    await this.page.click(this.locators.timesheet.project_dropdown);
    await this.page.waitForTimeout(300);
    
    // Type project name to filter
    await this.page.fill(this.locators.timesheet.project_dropdown, projectName);
    await this.page.waitForTimeout(500);
    
    // Select from dropdown
    const projectOption = `${this.locators.timesheet.project_option}:has-text("${projectName}")`;
    await this.page.click(projectOption);
    await this.page.waitForTimeout(300);
  }

  async selectActivity(activityName) {
    // Click activity dropdown
    await this.page.click(this.locators.timesheet.activity_dropdown);
    await this.page.waitForTimeout(300);
    
    // Select activity from dropdown
    const activityOption = `${this.locators.timesheet.activity_option}:has-text("${activityName}")`;
    await this.page.click(activityOption);
    await this.page.waitForTimeout(300);
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

    const totalElement = await this.page.$(totalSelector);
    return await totalElement.textContent();
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
