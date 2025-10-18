# NAIST Bus Schedule – Copilot Guide
## ExecPlans
When writing complex features or significant refactors, use an ExecPlan (as described in .agent/PLANS.md) from design to implementation.
## Architecture
- Single-page React app served by Vite; entry `src/index.tsx` renders `containers/App` after DOM ready and opts out of service workers via `serviceWorker.unregister()`.
- UI follows container/presentational split: containers in `src/containers` read jotai atoms from `src/stores/index.ts`, while components in `src/components` stay stateless and rely on props.
- Global state lives in `src/stores/index.ts`; atoms coordinate user selections, fetch schedule data, compute next bus countdown, and expose grouped timetables for rendering.
- Schedule data flows from `resources/*.csv` → `scripts/build-json.ts` → `src/resources/data.json` → `BusScheduleService.fetch()`, so keep CSV names aligned with fetch keys like `to-gakuemmae-weekday`.
## State & Data
- `directionAtom` and `busStopAtom` persist to `localStorage` keys `direction` and `busStop`; keep values stable or migrate stored data explicitly.
- `scheduleTypeAtom` derives from `HolidayService`, which uses `@holiday-jp/holiday_jp`; override `getToday()` in tests when simulating specific calendar dates.
- `timeTableAtom` normalizes `direction` (`from` → `to`) before querying JSON; when adding routes, update the CSV, regenerate JSON, and ensure the canonical key matches.
- `nowAtom` refreshes every second through `onMount`; avoid heavy logic inside it to keep the countdown smooth.
- `SplitScheduleService.split()` groups `HH:mm` strings into `HH:00 − HH:59` buckets; maintain the en dash and zero padding so UI keys sort correctly.
- `TimeDiffService.getNext()` assumes schedules are ascending; the CSV parser sorts times, so do not resort data manually downstream.
## UI Patterns
- Styling mixes Tailwind-style utility classes with plain CSS; reuse the existing class patterns instead of introducing new frameworks.
- `Share.tsx` builds social URLs from `window.location` and `document.title`; guard new code against SSR assumptions.
- `Footer.tsx` exposes a visible "Last modified" string; update it intentionally when schedule data changes.
## Developer Workflow
- Install deps with `npm install`; run the app via `npm run dev` (default 5173) or `npm run dev -- --port 3000` to satisfy the e2e tests that hit `http://localhost:3000`.
- Build with `npm run build` (TypeScript project references followed by `vite build`); production assets live under `dist/`.
- Regenerate timetable JSON after editing CSVs using `npm run build:json`; commit the CSV changes and the derived `src/resources/data.json` together.
- Run linting with `npm run lint`; `npm run format` now covers both JavaScript and TypeScript under `src/`, `scripts/`, and `e2e/`.
- Storybook uses v3.4 commands (`npm run storybook` / `npm run build-storybook`) and expects the static assets under `public/`.
- End-to-end tests (`npm run e2e`) run with Playwright; the command starts the Vite dev server automatically and executes in headless Chromium.
## Files To Know
- `src/stores/index.ts` orchestrates atoms, timers, and schedule queries; changes ripple through the entire UI.
- `src/services/*.ts` encapsulate data access and transformations—modify here when JSON structure changes.
- `scripts/build-json.ts` defines the CSV parsing rules (fixed 5–24 hour rows, zero padded times); keep format-compatible.
- `resources/*.csv` are the canonical timetables supplied by contributors; ensure new rows stay in the existing hour-first layout.
- `e2e/bus-schedule.spec.ts` encodes critical regression checks for each stop/direction; update vectors alongside schedule changes.
