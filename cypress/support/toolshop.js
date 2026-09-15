const DEFAULT_API_BASE_URL = 'https://api.practicesoftwaretesting.com';

function apiBaseUrl() {
  return (Cypress.env('apiBaseUrl') || DEFAULT_API_BASE_URL).replace(/\/$/, '');
}

function uiBaseUrl() {
  return (Cypress.env('uiBaseUrl') || 'https://practicesoftwaretesting.com').replace(/\/$/, '');
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
};
