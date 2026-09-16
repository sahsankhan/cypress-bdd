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
