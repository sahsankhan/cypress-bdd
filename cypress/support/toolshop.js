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
    failOnStatusCode: false,
    retryOnStatusCodeFailure: true,
    retryOnNetworkFailure: true,
    timeout: 60_000,
    headers: {
      'Accept-Language': 'en-US,en;q=0.9',
    },
  });
  cy.get('body', { timeout: 30_000 }).should('be.visible');
  cy.get('body').should(($body) => {
    const blocked = /403|access denied|just a moment/i.test($body.text());
    const hasApp = $body.find('[data-test], nav, app-root').length > 0;
    expect(blocked && !hasApp, 'Toolshop UI loaded (not a 403/WAF page)').to.eq(false);
  });
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
