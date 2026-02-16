const { Given, When, Then } = require('@cucumber/cucumber');
const { expect } = require('@playwright/test');
const JobVacancyPage = require('../../src/pages/JobVacancyPage');
const AddVacancyPage = require('../../src/pages/AddVacancyPage');
// const EditVacancyPage = require('../../pages/EditVacancyPage');
// EditVacancyPage.js does not exist in src/pages. Commenting out import to prevent error. Please add the file if needed.
// const ViewVacancyPage = require('../../src/pages/ViewVacancyPage');
// ViewVacancyPage.js does not exist in src/pages. Commented out to prevent error. Please add the file if needed.
const logger = require('../../src/utils/logger');

// Page object instances
let jobVacancyPage, addVacancyPage, editVacancyPage, viewVacancyPage;

// Storage for test data
let currentVacancyData = {};

// Navigation Steps
Given('I navigate to Recruitment module', async function () {
  jobVacancyPage = new JobVacancyPage(this.page);
  await jobVacancyPage.navigateToRecruitment();
  logger.info('Navigated to Recruitment module');
});

Given('I am on the Job Vacancies page', async function () {
  if (!jobVacancyPage) {
    jobVacancyPage = new JobVacancyPage(this.page);
  }
  await jobVacancyPage.verifyPageLoaded();
  logger.info('On Job Vacancies page');
});

// Add Vacancy Steps
When('I click on Add button', async function () {
  jobVacancyPage = jobVacancyPage || new JobVacancyPage(this.page);
  await jobVacancyPage.clickAddButton();
  addVacancyPage = new AddVacancyPage(this.page);
  await addVacancyPage.verifyPageLoaded();
});

When('I fill the job vacancy form with following details:', async function (dataTable) {
  addVacancyPage = addVacancyPage || new AddVacancyPage(this.page);
  const data = dataTable.rowsHash();
  
  currentVacancyData = {
    vacancyName: data['Vacancy Name'],
    jobTitle: data['Job Title'],
    hiringManager: data['Hiring Manager'],
    numberOfPositions: data['Number of Positions']
  };
  
  if (currentVacancyData.vacancyName) {
    await addVacancyPage.enterVacancyName(currentVacancyData.vacancyName);
  }
  
  if (currentVacancyData.jobTitle) {
    await addVacancyPage.selectJobTitle(currentVacancyData.jobTitle);
  }
  
  if (currentVacancyData.hiringManager) {
    await addVacancyPage.selectHiringManager(currentVacancyData.hiringManager);
  }
  
  if (currentVacancyData.numberOfPositions) {
    await addVacancyPage.enterNumberOfPositions(currentVacancyData.numberOfPositions);
  }
  
  logger.info('Filled job vacancy form with data');
});

When('I set the vacancy status to {string}', async function (status) {
  addVacancyPage = addVacancyPage || new AddVacancyPage(this.page);
  await addVacancyPage.setVacancyStatus(status);
  currentVacancyData.status = status;
});

When('I submit the job vacancy form', async function () {
  addVacancyPage = addVacancyPage || new AddVacancyPage(this.page);
  await addVacancyPage.submitForm();
});

Then('I should see vacancy created success message', async function () {
  jobVacancyPage = jobVacancyPage || new JobVacancyPage(this.page);
  await jobVacancyPage.verifySuccessMessage('Success');
  logger.info('Vacancy created success message verified');
});
