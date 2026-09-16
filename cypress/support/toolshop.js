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
  cy.visit(url, {
    retryOnNetworkFailure: true,
    timeout: 60_000,
  });
  // #region agent log
  const deadline = Date.now() + 40_000;
  const pollForApp = () =>
    cy.document({ log: false }).then((doc) => {
      const title = doc.title;
      const appReady = Boolean(doc.querySelector('app-root nav, [data-test="nav-sign-in"], [data-test="product-name"]'));
      if (appReady || Date.now() > deadline) {
        return cy.task(
          'debugLog',
          {
            hypothesisId: 'F',
            location: 'cypress/support/toolshop.js:visitApp',
            message: 'page state after visit (challenge solved?)',
            data: {
              url,
              title,
              appReady,
              challengePage: /just a moment/i.test(title),
              waitedMs: 40_000 - (deadline - Date.now()),
              bodySnippet: (doc.body ? doc.body.innerText || '' : '').replace(/\s+/g, ' ').slice(0, 200),
            },
          },
          { log: false },
        );
      }
      return cy.wait(2000, { log: false }).then(pollForApp);
    });
  pollForApp();
  // #endregion
  cy.get('app-root', { timeout: 40_000 }).should('exist');
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
