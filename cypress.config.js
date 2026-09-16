require('dotenv').config();
const { defineConfig } = require('cypress');
const createBundler = require('@bahmutov/cypress-esbuild-preprocessor');
const { addCucumberPreprocessorPlugin } = require('@badeball/cypress-cucumber-preprocessor');
const { createEsbuildPlugin } = require('@badeball/cypress-cucumber-preprocessor/esbuild');
const chromeUserAgent = require('./cypress/support/chromeUserAgent');

async function setupNodeEvents(on, config) {
  await addCucumberPreprocessorPlugin(on, config);
  // #region agent log
  const { debugLog } = require('./src/utils/debugLog');
  on('task', {
    debugLog(entry) {
      debugLog(entry);
      return null;
    },
  });
  // #endregion
  on(
    'file:preprocessor',
    createBundler({
      plugins: [createEsbuildPlugin(config)],
    }),
  );
  on('before:browser:launch', (browser, launchOptions) => {
    if (browser.family === 'chromium') {
      launchOptions.args.push(
        `--user-agent=${chromeUserAgent}`,
        '--disable-blink-features=AutomationControlled',
        '--disable-dev-shm-usage',
        '--no-sandbox',
        '--disable-gpu',
      );
    }
    return launchOptions;
  });
  return config;
}

module.exports = defineConfig({
  chromeWebSecurity: false,
  viewportWidth: 1280,
  viewportHeight: 720,
  userAgent: chromeUserAgent,
  retries: {
    runMode: 1,
    openMode: 0,
  },
  e2e: {
    baseUrl: (process.env.UI_BASE_URL || 'https://practicesoftwaretesting.com').replace(/\/$/, ''),
    specPattern: 'cypress/e2e/**/*.feature',
    supportFile: 'cypress/support/e2e.js',
    defaultCommandTimeout: Number(process.env.TIMEOUT || 30_000),
    pageLoadTimeout: 60_000,
    video: true,
    screenshotOnRunFailure: true,
    experimentalModifyObstructiveThirdPartyCode: true,
    setupNodeEvents,
    env: {
      tags: process.env.TAGS || '',
      uiBaseUrl: (process.env.UI_BASE_URL || 'https://practicesoftwaretesting.com').replace(/\/$/, ''),
      apiBaseUrl: (process.env.API_BASE_URL || 'https://api.practicesoftwaretesting.com').replace(/\/$/, ''),
    },
  },
});
