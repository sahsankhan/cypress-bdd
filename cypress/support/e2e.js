const chromeUserAgent = require('./chromeUserAgent');

Cypress.on('uncaught:exception', () => false);

beforeEach(() => {
  cy.intercept({ hostname: /practicesoftwaretesting\.com$/ }, (req) => {
    req.headers['user-agent'] = chromeUserAgent;
    req.headers['accept-language'] = 'en-US,en;q=0.9';
  });
});
