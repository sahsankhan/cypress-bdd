// #region agent log
/* Debug-session probe: determines what the target site rejects from this machine. */
const { debugLog } = require('./debugLog');

const UI = (process.env.UI_BASE_URL || 'https://practicesoftwaretesting.com').replace(/\/$/, '');
const API = (process.env.API_BASE_URL || 'https://api.practicesoftwaretesting.com').replace(/\/$/, '');

const VALID_CHROME_UA =
  'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/140.0.0.0 Safari/537.36';
const HEADLESS_UA =
  'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) HeadlessChrome/140.0.0.0 Safari/537.36';
const CONFIG_UA = require('../../cypress/support/chromeUserAgent');

const BROWSERISH = {
  'user-agent': VALID_CHROME_UA,
  accept: 'text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,*/*;q=0.8',
  'accept-language': 'en-US,en;q=0.9',
  'accept-encoding': 'gzip, deflate, br',
  'sec-ch-ua': '"Chromium";v="140", "Not=A?Brand";v="24", "Google Chrome";v="140"',
  'sec-ch-ua-mobile': '?0',
  'sec-ch-ua-platform': '"Windows"',
  'sec-fetch-dest': 'document',
  'sec-fetch-mode': 'navigate',
  'sec-fetch-site': 'none',
  'sec-fetch-user': '?1',
  'upgrade-insecure-requests': '1',
};

const INTERESTING_HEADERS = [
  'server',
  'cf-ray',
  'cf-mitigated',
  'cf-cache-status',
  'x-powered-by',
  'via',
  'x-served-by',
  'content-type',
  'x-sucuri-id',
  'x-amz-cf-pop',
  'location',
];

async function probe(hypothesisId, label, url, headers) {
  const started = Date.now();
  try {
    const res = await fetch(url, { headers, redirect: 'manual' });
    const body = await res.text();
    const picked = {};
    INTERESTING_HEADERS.forEach((name) => {
      const value = res.headers.get(name);
      if (value) picked[name] = value;
    });
    debugLog({
      hypothesisId,
      location: 'src/utils/probe.js:probe',
      message: `probe ${label}`,
      data: {
        url,
        status: res.status,
        ms: Date.now() - started,
        responseHeaders: picked,
        bodyLength: body.length,
        bodySnippet: body.replace(/\s+/g, ' ').slice(0, 300),
      },
    });
  } catch (error) {
    debugLog({
      hypothesisId,
      location: 'src/utils/probe.js:probe',
      message: `probe ${label} threw`,
      data: { url, error: String(error && error.message ? error.message : error) },
    });
  }
}

(async () => {
  let ip = 'unknown';
  try {
    ip = (await (await fetch('https://api.ipify.org')).text()).trim();
  } catch {
    /* ignore */
  }
  let geo = {};
  try {
    const info = await (await fetch(`https://ipinfo.io/${ip}/json`)).json();
    geo = { org: info.org, country: info.country, region: info.region, city: info.city };
  } catch {
    /* ignore */
  }
  debugLog({
    hypothesisId: 'A,E',
    location: 'src/utils/probe.js:egress',
    message: 'runner egress identity',
    data: { ip, ...geo, platform: process.platform, ci: Boolean(process.env.CI) },
  });

  await probe('A,B,D', 'ui-root-valid-chrome-ua', `${UI}/`, BROWSERISH);
  await probe('B', 'ui-root-config-ua', `${UI}/`, { ...BROWSERISH, 'user-agent': CONFIG_UA });
  await probe('B', 'ui-root-headless-ua', `${UI}/`, { ...BROWSERISH, 'user-agent': HEADLESS_UA });
  await probe('A,B', 'ui-root-no-headers', `${UI}/`, {});
  await probe('A,C', 'ui-register-valid-chrome-ua', `${UI}/auth/register`, BROWSERISH);
  await probe('A', 'api-products-control', `${API}/products?page=1`, { accept: 'application/json' });
})();
// #endregion
