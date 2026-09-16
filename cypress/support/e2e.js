const chromeUserAgent = require('./chromeUserAgent');

Cypress.on('uncaught:exception', () => false);

// #region agent log
const captured = [];
// #endregion

beforeEach(() => {
  // #region agent log
  captured.length = 0;
  // #endregion
  cy.intercept({ hostname: /practicesoftwaretesting\.com$/ }, (req) => {
    req.headers['user-agent'] = chromeUserAgent;
    req.headers['accept-language'] = 'en-US,en;q=0.9';
    // #region agent log
    const entry = { url: req.url, resourceType: req.resourceType, requestHeaders: { ...req.headers } };
    captured.push(entry);
    req.continue((res) => {
      entry.status = res.statusCode;
      entry.responseHeaders = {
        server: res.headers.server,
        'cf-ray': res.headers['cf-ray'],
        'cf-mitigated': res.headers['cf-mitigated'],
        'content-type': res.headers['content-type'],
        via: res.headers.via,
        'x-powered-by': res.headers['x-powered-by'],
      };
      entry.bodySnippet =
        typeof res.body === 'string' ? res.body.replace(/\s+/g, ' ').slice(0, 300) : typeof res.body;
    });
    // #endregion
  });
});

// #region agent log
afterEach(() => {
  cy.task(
    'debugLog',
    {
      hypothesisId: 'B,C,D',
      location: 'cypress/support/e2e.js:intercept',
      message: 'browser-proxied requests seen by Cypress',
      data: { count: captured.length, requests: captured.slice(0, 4) },
    },
    { log: false },
  );
});
// #endregion
