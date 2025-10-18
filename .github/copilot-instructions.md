# NAIST Bus Schedule – Copilot Guide
## ExecPlans
When writing complex features or significant refactors, use an ExecPlan (as described in `.agent/PLANS.md`) from design to implementation.
## Architecture & State
- SPA built with Vite + React 19; `src/index.tsx` renders `containers/App` after DOM ready and keeps service workers disabled via `registerServiceWorker.js`.
- Containers in `src/containers/*` subscribe to jotai atoms from `src/stores/index.ts`, then pass plain props to stateless components under `src/components/*`.
- `src/stores/index.ts` owns jotai atoms plus singleton service instances; `directionAtom`/`busStopAtom` persist to `localStorage` keys `direction`/`busStop`, so keep those string values stable.
- `timeTableAtom` normalizes `direction` (`from` → `'to'`) before calling `BusScheduleService.fetch`; extend that mapping if new directions are introduced.
## Data Pipeline
- Canonical timetables live in `resources/*.csv`; first column is the hour, remaining cells are minutes. File names must remain `to|from-<stop>-<weekday|weekend>` to match lookup keys.
- Run `npm run build:json` (via `scripts/build-json.ts`) to regenerate `src/resources/data.json`; CI executes the same step, but run it locally when touching CSVs.
- `SplitScheduleService.split` groups `HH:mm` strings into `HH:00 − HH:59`; retain the en dash and zero padding so grouping keys stay sorted and match existing UI expectations.
- `TimeDiffService.getNext` expects sorted `HH:mm` entries with implied seconds; feeding unsorted or malformed data breaks the countdown logic.
## UI & Behavior
- Tailwind-like utility classes are baked into JSX; prefer reusing them over introducing new styling systems.
- `Share.tsx` assembles social URLs from `window.location` and `document.title`; guard new code against non-browser invocation.
- `Footer.tsx` exposes a human-readable “Last modified” string; update deliberately alongside schedule changes.
- `Next` consumption relies on `nextTimeAtom` returning `{-1,-1,-1}` after the last bus; preserve that contract if you refactor countdown behavior.
## Developer Workflow
- Install deps with `npm install`; start dev server via `npm run dev` (port 5173) or `npm run dev -- --port 3000` to mirror Playwright’s expectations.
- For CI parity run `npm run build:json && npm run build`; the build script runs `tsc -b` before `vite build` and places assets under `dist/`.
- Lint with `npm run lint` (auto-fixes `src/`) and format with `npm run format` covering `src/`, `scripts/`, and `e2e/`.
- Execute end-to-end tests with `npm run e2e`; install browsers first via `npx playwright install`. The script bootstraps Vite on port 3000 and runs `e2e/bus-schedule.spec.ts` headlessly.
## Testing Tips
- Override `HolidayService.getToday` when simulating weekdays, weekends, or holidays in tests.
- `nowAtom` refreshes every second through `atomWithRefresh` + `onMount`; avoid heavy work in derived atoms to keep the UI responsive.
- When adding stops or routes, update CSVs, regenerate JSON, and extend `e2e/bus-schedule.spec.ts` expectations for the new direction/stop pair.
