# Introduce Playwright E2E tests

This ExecPlan is a living document that must be maintained according to .agent/PLANS.md. Update every section as progress is made so the next contributor can resume the work without rediscovery.

## Purpose / Big Picture

Replace the legacy AVA + WebdriverIO + Selenium stack with Playwright so end-to-end tests run headless without external infrastructure and align with `@playwright/test`, which is already declared in `package.json`. The migration covers introducing Playwright project scaffolding, rewriting `e2e/test.js` assertions, and cleaning up unused dependencies. Successful completion means contributors can run the e2e suite with a single Playwright command against the locally served Vite app.

## Progress

- [x] (2025-10-18 06:08Z) Captured initial Playwright launch failure on this CI-less environment; Chromium needs headless mode because no X server is available.
- [x] (2025-10-18 06:50Z) Added `playwright.config.ts`, ported the timetable assertions to `e2e/bus-schedule.spec.ts`, removed WebdriverIO/AVA dependencies, updated docs/scripts, and verified `npx playwright test` passes headlessly.

## Surprises & Discoveries

- Observation: `package.json` already lists `@playwright/test` in `devDependencies`, but the repo still relies on AVA + WebdriverIO + Selenium with `npm run e2e`. Evidence: `scripts.e2e` invokes `ava --serial "e2e/**/*.js"` and `devDependencies` still include `webdriverio` and `selenium-standalone`.
- Observation: Current tests in `e2e/test.js` spin up a single shared WebdriverIO session and use Japanese / English labels, so the Playwright migration must preserve bilingual strings and dropdown selections. Evidence: test data array enumerates `NAIST行き / To NAIST` etc. and reuses `PageObject` helpers.
- Observation: Attempting to run the Playwright planner without a display launches Chromium in headed mode and fails (`Missing X server or $DISPLAY`). Evidence: Playwright seed run logged the failure when calling `mcp_playwright-te_planner_setup_page`, suggesting the new suite must default to `headless: true` or rely on Playwright's default headless mode.

## Decision Log

- Decision: Adopt `@playwright/test` as the sole e2e runner and drop AVA/WebdriverIO to simplify scripting and leverage Playwright fixtures. Rationale: reduces dependency surface and matches modern tooling already declared in `package.json`. Date/Author: 2025-10-18 GitHub Copilot.
- Decision: Keep tests in `e2e/` but migrate files to `.ts` (or `.tsx` if JSX needed) using ES module syntax to align with project TypeScript usage and Playwright conventions. Rationale: the repo already uses TypeScript; Playwright offers first-class TypeScript support, easing selector typing and helper reuse. Date/Author: 2025-10-18 GitHub Copilot.
- Decision: Spin up the Vite dev server on port 3000 during tests using Playwright's `webServer` configuration rather than manually orchestrating `npm run dev` in each test. Rationale: ensures deterministic startup/teardown and mirrors existing e2e assumptions without bespoke scripts. Date/Author: 2025-10-18 GitHub Copilot.

## Outcomes & Retrospective

Playwright now drives the e2e suite headlessly, bringing the Vite dev server up automatically and exercising the same timetable coverage as the legacy AVA tests with updated schedule expectations. WebdriverIO, Selenium, and AVA dependencies are removed, and contributor docs point to the new workflow. No open follow-ups remain.

## Context and Orientation

The React app runs via Vite (`npm run dev`) and the existing Ava/WebdriverIO suite expects the server at `http://localhost:3000`. WebdriverIO helpers directly select DOM elements by `selectByVisibleText`, so dropdown options rely on fully rendered inner text. `e2e/test.js` enumerates combinations of direction, bus stop, and timetable, asserting that certain times exist or do not exist in the generated list. The project already includes Playwright as a devDependency but lacks configuration files (`playwright.config.ts`) or scripts to execute it. Migrating requires deciding how to host the dev server during tests, translating the assertions into Playwright idioms, and updating CI / npm scripts accordingly.

## Plan of Work

Establish a Playwright configuration that launches the Vite dev server in headless mode, rewrite the legacy test into equivalent Playwright tests (likely parameterized via `test.describe` and `test.step`), and excise WebdriverIO-era dependencies and scripts. Ensure selectors remain stable by targeting form controls via `role`/`label` or `data-testid` if necessary. Update project scripts and documentation so contributors use Playwright going forward.

## Concrete Steps

1. Initialize Playwright project files (`playwright.config.ts`, `e2e/playwright.d.ts`) with `@playwright/test`, configuring `webServer` to run `npm run dev -- --port 3000`, `baseURL: 'http://localhost:3000'`, default `headless: true`, and extend timeouts if startup is slow.
2. Translate `e2e/test.js` into a Playwright test (e.g., `e2e/bus-schedule.spec.ts`) using `test.describe` with `test.step` or parameterized `test` calls over the existing matrix. Replace WebdriverIO-specific helpers with Playwright interactions (`page.selectOption`, `page.getByRole`, etc.) and replicate the positive/negative timetable assertions.
3. Add any necessary helper utilities (e.g., arrays of dropdown values) under `e2e/fixtures.ts` or inline constant definitions to avoid duplication.
4. Update `package.json` scripts: replace `npm run e2e` with `playwright test`, add `playwright install --with-deps` instructions if needed, and remove obsolete scripts (`start:selenium`).
5. Remove unused dependencies (`ava`, `webdriverio`, `selenium-standalone`) and their transitive config files (`e2e/test.js`, any WebdriverIO configs) once the new suite passes.
6. Update documentation (README.md or contributing notes) to describe the new Playwright workflow and mention prerequisites (e.g., `npx playwright install` for browsers).
7. Run the new Playwright suite locally (`npx playwright test`) and ensure it passes headlessly; capture evidence in this plan. Optionally add an HTML reporter artifact path for CI.

## Validation and Acceptance

Acceptance criteria:

- `npx playwright test` (or `npm run e2e` after script update) starts the Vite dev server automatically, executes the migrated timetable assertions, and exits with code 0 in headless mode.
- `package.json` no longer references WebdriverIO, AVA, or Selenium, and Playwright is the only e2e tooling dependency.
- README (or other contributor docs) explains how to run the Playwright tests, including any required `playwright install` step.

## Idempotence and Recovery

Playwright config and tests are deterministic; re-running `npx playwright test` is safe. If the new suite flakes, rerun with `DEBUG=pw:api` to capture logs. Removing WebdriverIO dependencies should be done in a single commit so reverting is straightforward if issues arise. Keep the legacy test file until Playwright migration is verified, then delete it in the same change set to avoid divergence.

## Artifacts and Notes

- `e2e/bus-schedule.spec.ts` contains the timetable scenario matrix; update it alongside CSV changes to keep assertions aligned.
- Playwright suite expects timetable times that match `src/resources/data.json`; adjust `scenarios` in `e2e/bus-schedule.spec.ts` when the CSV schedules change.
- Playwright launch attempt on 2025-10-18 failed due to missing display: configure tests to run headless or set `use: { headless: true }` to avoid the same failure.
- The app relies on dropdowns with Japanese labels; consider using `page.getByLabel` with the localized strings to avoid brittle CSS selectors.

## Interfaces and Dependencies

- Vite dev server command: `npm run dev -- --port 3000` (must be invoked by Playwright `webServer`).
- Playwright config snippet to target the app:

```ts
import { defineConfig } from '@playwright/test';

export default defineConfig({
	timeout: 30_000,
	use: {
		baseURL: 'http://localhost:3000',
		headless: true,
	},
	webServer: {
		command: 'npm run dev -- --port 3000',
		port: 3000,
		reuseExistingServer: !process.env.CI,
		timeout: 120_000,
	},
});
```

---
Initial version created 2025-10-18 by GitHub Copilot.
