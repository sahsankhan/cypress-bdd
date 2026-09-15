const fs = require('fs');
const reporter = require('cucumber-html-reporter');

const jsonFile = 'reports/cucumber-report.json';
if (!fs.existsSync(jsonFile)) {
  throw new Error(`Missing ${jsonFile}. Run the suite first.`);
}

reporter.generate({
  theme: 'bootstrap',
  jsonFile,
  output: 'reports/cucumber-report.html',
  reportSuiteAsScenarios: true,
  scenarioTimestamp: true,
  launchReport: false,
  brandTitle: 'Toolshop - Test Automation Report',
  name: 'cypress-bdd',
  metadata: {
    'Test Environment': process.env.UI_BASE_URL || 'https://practicesoftwaretesting.com',
    Browser: process.env.BROWSER || 'chrome',
    Platform: process.platform,
    Executed: process.env.HEADLESS === 'false' ? 'Headed' : 'Headless',
  },
});

console.log('HTML report: reports/cucumber-report.html');
