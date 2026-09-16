Cypress.on('uncaught:exception', () => false);

// #region agent log
const captured = [];

beforeEach(() => {
  captured.length = 0;
  cy.intercept({ hostname: /practicesoftwaretesting\.com$/ }, (req) => {
    const entry = { url: req.url, resourceType: req.resourceType };
    captured.push(entry);
    req.continue((res) => {
      entry.status = res.statusCode;
      entry.cfMitigated = res.headers['cf-mitigated'];
      entry.server = res.headers.server;
      entry.setCookie = String(res.headers['set-cookie'] || '').slice(0, 120);
    });
  });
});

afterEach(() => {
  cy.task(
    'debugLog',
    {
      hypothesisId: 'F',
      location: 'cypress/support/e2e.js:intercept',
      message: 'browser-proxied requests seen by Cypress',
      data: { count: captured.length, requests: captured.slice(0, 8) },
    },
    { log: false },
  );
});
// #endregion
