require('dotenv').config();
const { spawnSync } = require('child_process');
const fs = require('fs');
const path = require('path');
const cypress = require('cypress');
const chromeUserAgent = require('../../cypress/support/chromeUserAgent');

const args = process.argv.slice(2);
const headed = args.includes('--headed');
const open = args.includes('--open');
const tagIndex = args.indexOf('--tags');
const tags = tagIndex >= 0 ? args[tagIndex + 1] : undefined;

if (headed) {
  process.env.HEADLESS = 'false';
}

const browser = process.env.BROWSER || 'chrome';
const env = {};
if (tags) {
  env.tags = tags;
}

async function generateAndOpenReport() {
  const jsonReport = path.join('reports', 'cucumber-report.json');
  if (!fs.existsSync(jsonReport)) {
    return;
  }
  require('./reporter');
  const cucumberHtml = path.resolve('reports', 'cucumber-report.html');
  if (!fs.existsSync(cucumberHtml)) {
    return;
  }
  if (process.env.CI) {
    return;
  }
  if (process.platform === 'win32') {
    spawnSync('cmd', ['/c', 'start', '', cucumberHtml], { stdio: 'ignore' });
  } else if (process.platform === 'darwin') {
    spawnSync('open', [cucumberHtml], { stdio: 'ignore' });
  } else {
    spawnSync('xdg-open', [cucumberHtml], { stdio: 'ignore' });
  }
}

async function main() {
  fs.mkdirSync('reports', { recursive: true });

  if (open) {
    await cypress.open({
      browser,
      env,
    });
    return;
  }

  const result = await cypress.run({
    browser,
    headed: headed || process.env.HEADLESS === 'false',
    env,
    config: {
      userAgent: chromeUserAgent,
    },
  });

  await generateAndOpenReport();

  const failed = result.totalFailed > 0 || result.status === 'failed';
  process.exit(failed ? 1 : 0);
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
