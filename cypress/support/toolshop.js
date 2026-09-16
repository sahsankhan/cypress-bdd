const DEFAULT_API_BASE_URL = 'https://api.practicesoftwaretesting.com';

function apiBaseUrl() {
  return (Cypress.env('apiBaseUrl') || DEFAULT_API_BASE_URL).replace(/\/$/, '');
}

function uiBaseUrl() {
  return (Cypress.env('uiBaseUrl') || 'https://practicesoftwaretesting.com').replace(/\/$/, '');
}

function visitApp(pathOrUrl) {
  const base = uiBaseUrl();
  const url = pathOrUrl.startsWith('http') ? pathOrUrl : `${base}${pathOrUrl.startsWith('/') ? pathOrUrl : `/${pathOrUrl}`}`;
  // #region agent log
  cy.request({ url, failOnStatusCode: false, retryOnStatusCodeFailure: false }).then((response) => {
    cy.task(
      'debugLog',
      {
        hypothesisId: 'A,C',
        location: 'cypress/support/toolshop.js:visitApp',
        message: 'cy.request (node-level, no browser) to page url',
        data: {
          url,
          status: response.status,
          server: response.headers && response.headers.server,
          contentType: response.headers && response.headers['content-type'],
          bodySnippet:
            typeof response.body === 'string' ? response.body.replace(/\s+/g, ' ').slice(0, 300) : typeof response.body,
        },
      },
      { log: false },
    );
  });
  // #endregion
  cy.visit(url, {
    failOnStatusCode: true,
    retryOnStatusCodeFailure: true,
    retryOnNetworkFailure: true,
    timeout: 60_000,
  });
  cy.get('body', { timeout: 30_000 }).should('be.visible');
}

function fetchInStockProduct() {
  return cy.request(`${apiBaseUrl()}/products?page=1`).then((response) => {
    expect(response.status).to.eq(200);
    const product = response.body.data.find((item) => item.in_stock);
    expect(product, 'in-stock product from live API').to.exist;
    return cy.wrap(product);
  });
}

module.exports = {
  apiBaseUrl,
  uiBaseUrl,
  fetchInStockProduct,
  visitApp,
};
