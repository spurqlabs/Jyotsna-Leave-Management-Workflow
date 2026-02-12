const fs = require('fs');
const path = require('path');

class TestDataHelper {
  constructor() {
    this.testDataPath = path.join(__dirname, '../../config/testData.json');
    this.testData = this.loadTestData();
  }

  loadTestData() {
    try {
      const data = fs.readFileSync(this.testDataPath, 'utf8');
      return JSON.parse(data);
    } catch (error) {
      console.error(`Failed to load test data: ${error.message}`);
      throw error;
    }
  }

  getValidCredentials() {
    return this.testData.credentials.valid;
  }

  getInvalidCredentials() {
    return this.testData.credentials.invalid;
  }

  getLeaveApplication(type) {
    return this.testData.leaveApplications[type];
  }

  getAllLeaveApplications() {
    return this.testData.leaveApplications;
  }

  getLeaveSearchData(key) {
    return this.testData.leaveSearch[key];
  }

  getLeaveSearch(key) {
    return this.getLeaveSearchData(key);
  }

  getExpectedMessage(key) {
    const keys = key.split('.');
    let value = this.testData.expectedMessages;
    
    for (const k of keys) {
      value = value[k];
      if (value === undefined) {
        throw new Error(`Expected message not found for key: ${key}`);
      }
    }
    
    return value;
  }

  getLeaveStatus(statusType) {
    return this.testData.expectedMessages.leaveStatus[statusType];
  }
}

module.exports = new TestDataHelper();
