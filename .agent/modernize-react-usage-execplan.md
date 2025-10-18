# Modernize React usage to align with React 19 expectations

This ExecPlan is a living document. Maintain it per `.agent/PLANS.md` and keep every section current as work progresses.

## Purpose / Big Picture

Ensure the NAIST bus schedule SPA follows contemporary React 19 patterns so the app remains resilient to server-side rendering, lazy-imported environments, and future framework upgrades. After implementation, the entry point renders immediately without legacy DOM events, the top-level layout receives its title via props instead of hardcoding `document` access, and the share buttons assemble URLs safely inside React with browser guards.

## Progress

- [x] (2025-10-18 04:38Z) Captured current legacy React patterns in `src/index.tsx`, `src/containers/App.tsx`, and `src/components/Share.tsx` and noted them below.
- [x] (2025-10-18 04:55Z) Refactored the entry point, `App` container, and `Share` component to eliminate unsafe browser globals and legacy bootstrapping.
- [x] (2025-10-18 05:02Z) Ran `npm run lint` and `npm run build`; both completed successfully without errors.

## Surprises & Discoveries

- None yet; record new observations with evidence as work proceeds.

## Decision Log

- Decision: Encode the page title when constructing the Twitter share URL while moving the logic into a guarded memoized block.
    Rationale: Encoding prevents malformed query parameters once we centralize share URL creation inside the component and does not regress existing behavior.
    Date/Author: 2025-10-18 04:55Z / Copilot

## Outcomes & Retrospective

Modernized the React bootstrapper and top-level components so they no longer depend on immediate browser globals or legacy lifecycle hooks. The SPA renders as before, share links resolve from guarded runtime data, and build tooling confirms the changes compile cleanly. Remaining risk is minimal; future SSR adoption would need explicit verification but no blockers surfaced here.

## Context and Orientation

The SPA bootstraps from `src/index.tsx`, which currently waits for `DOMContentLoaded`, grabs the `react-root` element, and renders `<App />` from `src/containers/App.tsx` inside `<React.StrictMode>`. The `App` container renders headings and the form/list sub-containers and directly reads `document.title` on every render. The share buttons in `src/components/Share.tsx` compute social URLs at module scope using `window.location` and `document.title`, which breaks when the code executes outside a browser (e.g., SSR, unit tests, or Node-based tooling) and diverges from React's recommendation to keep side effects inside components.

Modern React expects the entry script to call `createRoot` immediately, and components should treat browser APIs as optional to stay environment-safe. Passing data through props keeps components pure, and deferring browser-specific work to effects or guarded computations avoids hydration mismatches.

## Plan of Work

First, update `src/index.tsx` to drop the `DOMContentLoaded` listener, switch to named imports (`StrictMode` and `createRoot`), and compute a `pageTitle` constant that falls back to a sensible default if `document` is unavailable. Render `<App pageTitle={pageTitle} />` immediately after confirming the root element exists, and leave the service-worker behavior untouched.

Next, modify `src/containers/App.tsx` so the `App` function accepts a `pageTitle: string` prop and uses that value in the `<h1>` heading. Remove direct `document` usage from this component, keep the existing layout, and adjust the default export accordingly. This keeps the container presentational while letting the entry point supply the title data.

Finally, refactor `src/components/Share.tsx` to compute social share URLs inside the component. Introduce a small helper (either inline or a dedicated function within the file) that safely reads `window.location` and `document.title` only when they exist, defaulting to empty strings otherwise. Use `useMemo` with `[]` dependencies or equivalent guards to ensure URLs are only built when the browser data is available, and keep the rendered JSX identical aside from referencing the memoized values. Preserve image imports and link semantics.

## Concrete Steps

Work inside `/home/sho_iizuka/workspace/github.com/arosh/naist-bus-schedule`.

    # inspect current files to confirm context while editing
    sed -n '1,120p' src/index.tsx
    sed -n '1,160p' src/containers/App.tsx
    sed -n '1,200p' src/components/Share.tsx

    # after code changes, ensure formatting and linting pass
    npm run lint
    npm run build

Capture command outputs in this plan's `Artifacts` section when available.

## Validation and Acceptance

Successful completion means `npm run lint` and `npm run build` both finish without errors. Optionally run `npm run dev` and load `http://localhost:5173` (or the chosen port) to confirm the heading text matches the document title and the share links still open the expected services.

## Idempotence and Recovery

Edits are isolated to three files and can be reapplied safely; rerunning the commands above is harmless. If an edit introduces regressions, restore the original file from version control (`git checkout -- <file>`) before retrying. No data migrations or persistent side effects occur.

- Collected references: `src/index.tsx` lines 1-17 import `React` default, wait for `DOMContentLoaded`, and access `document.getElementById` before calling `ReactDOM.createRoot`; `src/containers/App.tsx` lines 10-11 read `document.title` directly during render; `src/components/Share.tsx` lines 4-8 compute sharing URLs at module scope using `window.location` and `document.title`.
- Refactor summary: `src/index.tsx` now calls `createRoot` immediately, passes a `pageTitle` prop, and guards for missing DOM; `src/containers/App.tsx` accepts `{ pageTitle }`; `src/components/Share.tsx` builds share URLs inside a memoized block that checks for browser globals.
- Command log: `npm run lint` (eslint --fix src) completed with no reported issues; `npm run build` (tsc -b && vite build) succeeded with vite reporting “✓ built in 878ms”.

## Interfaces and Dependencies

`src/index.tsx` must export no values but should call `createRoot` on the `react-root` element and render `<App pageTitle={...} />` wrapped in `<StrictMode>`. `src/containers/App.tsx` should export a default function accepting `{ pageTitle: string }` props. `src/components/Share.tsx` should expose a default `Share` component that reads browser globals only within guarded logic executed at render time inside the component.
