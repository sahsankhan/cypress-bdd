# Cypress BDD

Cypress + Cucumber (Gherkin, POM, tags) against the [Toolshop](https://practicesoftwaretesting.com) UI. 

UI-focused: product detail smoke, register, sign in, checkout. Each checkout run registers a unique user (the shared demo customer is often locked).

## Prerequisites

- Node.js 18+
- npm
- Google Chrome installed locally

## Setup

From this folder:

```powershell
npm install
copy .env.example .env
```

On macOS/Linux use `cp .env.example .env`.

`npm install` pulls `cypress` 13, `@badeball/cypress-cucumber-preprocessor`, `@bahmutov/cypress-esbuild-preprocessor`, `cucumber-html-reporter`, and `dotenv`.

### Cucumber glue (Ctrl+click)

Install the recommended extensions so a step in a `.feature` file jumps to the step definition, then to the page object:

```powershell
cursor --install-extension CucumberOpen.cucumber-official
cursor --install-extension alexkrechik.cucumberautocomplete
```

Or install them when Cursor prompts from `.vscode/extensions.json`.

## Run

```powershell
npm test              # both scenarios, headless Chrome
npm run test:headed   # both scenarios, visible browser
npm run test:open     # Cypress UI (pick a feature)
npm run test:smoke    # @smoke only (product detail)
npm run test:e2e      # @checkout only (full checkout)
```

Tagged runs **filter** scenarios. The HTML report will show the other feature as **skipped/pending** — that is expected, not a failure.

```powershell
# run both tags explicitly
node src/utils/run.js --tags "@smoke or @checkout"

# headed checkout only
node src/utils/run.js --headed --tags @checkout
```

Headed mode sets `HEADLESS=false`. Override env vars:

```powershell
$env:HEADLESS="false"; npm test
$env:BROWSER="edge"; npm test
```

## Report

Every test run writes JSON, builds HTML (`cucumber-html-reporter`, bootstrap theme), then opens the report.

| Output | Path |
|---|---|
| Cucumber JSON | `reports/cucumber-report.json` |
| HTML (KPI cards, pie charts, feature accordions) | `reports/cucumber-report.html` |
| Videos | `cypress/videos/` |
| Failure screenshots | `cypress/screenshots/` |

Rebuild HTML without re-running tests:

```powershell
npm run report
```

Open the report manually:

```powershell
start reports\cucumber-report.html
```

On macOS: `open reports/cucumber-report.html`. On Linux: `xdg-open reports/cucumber-report.html`.

## Tags

| Tag | Feature |
|---|---|
| `@smoke` / `@product` | In-stock product page + add to cart button |
| `@e2e` / `@checkout` | Register, sign in, cart, cash on delivery |

## Env (`.env`)

| Variable | Default | Notes |
|---|---|---|
| `UI_BASE_URL` | `https://practicesoftwaretesting.com` | Toolshop UI |
| `API_BASE_URL` | `https://api.practicesoftwaretesting.com` | Pick an in-stock product for smoke + checkout |
| `BROWSER` | `chrome` | `chrome` or `edge` |
| `HEADLESS` | `true` | `false` for a visible browser |
| `TIMEOUT` | `30000` | Cypress command timeout (ms) |

## CI

GitHub Actions runs `npm test` on push/PR (headless Chrome) and uploads `reports/`, videos, and screenshots as the `cypress-report` artifact.

## Layout

```
cypress/e2e                       Gherkin features
cypress/support/step_definitions  step definitions
cypress/pages                     page objects
cypress/support/toolshop.js       live API helper (in-stock product pick)
src/utils                         run wrapper + HTML reporter
reports/                          generated JSON + HTML (gitignored)
```
