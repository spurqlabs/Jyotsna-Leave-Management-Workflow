// Unified Cucumber config: use CLI --tags to filter scenarios (e.g. --tags "@smoke")
module.exports = {
  default: {
    require: [
      'features/step_definitions/**/*.js',
      'features/support/**/*.js'
    ],
    requireModule: [],
    format: [
      'progress-bar',
      'html:test-results/reports/cucumber-report.html',
      'json:test-results/reports/cucumber-report.json',
      'junit:test-results/reports/cucumber-report.xml'
      // To use Allure reporting, run with:
      // npx cucumber-js --format @reportportal/agent-js-cucumber
    ],
    formatOptions: {
      snippetInterface: 'async-await'
    },
    dryRun: false,
    failFast: false,
    strict: true,
    parallel: 1,
    timeout: 120000
  }
};
