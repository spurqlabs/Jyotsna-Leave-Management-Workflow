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
    ],
    formatOptions: {
      snippetInterface: 'async-await'
    },
    dryRun: false,
    failFast: false,
    strict: true,
    parallel: 1,
    timeout: 120000
  },
  smoke: {
    require: [
      'features/step_definitions/**/*.js',
      'features/support/**/*.js'
    ],
    format: [
      'progress-bar',
      'html:test-results/reports/smoke-report.html',
      'json:test-results/reports/smoke-report.json'
    ],
    tags: '@smoke',
    timeout: 120000
  },
  regression: {
    require: [
      'features/step_definitions/**/*.js',
      'features/support/**/*.js'
    ],
    format: [
      'progress-bar',
      'html:test-results/reports/regression-report.html',
      'json:test-results/reports/regression-report.json'
    ],
    tags: '@regression',
    timeout: 120000
  }
};
