// #region agent log
const fs = require('fs');
const path = require('path');

const LOG_PATH = path.join(process.cwd(), 'debug-082df1.log');

function debugLog(entry) {
  const line = JSON.stringify({
    sessionId: '082df1',
    runId: process.env.DEBUG_RUN_ID || (process.env.CI ? 'ci' : 'local'),
    timestamp: Date.now(),
    ...entry,
  });
  try {
    fs.appendFileSync(LOG_PATH, `${line}\n`);
  } catch {
    /* ignore */
  }
  console.log(`##DBG## ${line}`);
}

module.exports = { debugLog, LOG_PATH };
// #endregion
