# Introduce vite-plugin-pwa to ship offline support

This ExecPlan is a living document. The sections `Progress`, `Surprises & Discoveries`, `Decision Log`, and `Outcomes & Retrospective` must be kept current as work proceeds. Maintain this plan in accordance with `.agent/PLANS.md`.

## Purpose / Big Picture

After completing this plan, visitors can install the NAIST Bus Schedule as a Progressive Web App (PWA). A PWA is a web application that can be installed on a device and keep working offline by caching assets through a service worker. Once the work is done, a user loading the production build should see the browser prompt to install the app and the timetable should stay visible even after disconnecting from the network.

## Progress

- [x] (2025-10-18 00:20Z) Catalogue the current build pipeline by reviewing `vite.config.ts` and attempting the documented build dry run (Vite rejected `--dryRun`; see Surprises).
- [x] (2025-10-18 00:45Z) Configure `vite-plugin-pwa` in the build, including manifest and asset caching rules in `vite.config.ts`.
- [x] (2025-10-18 00:52Z) Replace the legacy `registerServiceWorker.js` wiring with the plugin-provided registration helper and verify runtime behavior (preview server started successfully; offline inspection still recommended manually).
- [x] (2025-10-18 00:58Z) Document validation steps and update any automated tests or scripts that rely on the build outputs.

## Surprises & Discoveries

- Observation: Vite's CLI does not accept the `--dryRun` flag, so `npm run build -- --dryRun` fails before any compilation starts.
  Evidence: `vite build --dryRun` threw `CACError: Unknown option \\`--dryRun\\`` on 2025-10-18 while running from the repository root.
- Observation: TypeScript flagged the new PWA helper because the project lacked references to the plugin's client types.
  Evidence: `Cannot find module 'virtual:pwa-register'` appeared until `src/vite-env.d.ts` referenced both `vite/client` and `vite-plugin-pwa/client`.

## Decision Log

- Decision: Replace the attempted dry-run build with the standard `npm run build` for subsequent steps since Vite lacks a dry-run option.
  Rationale: Ensures plan remains actionable and avoids repeating a known failure.
  Date/Author: 2025-10-18 / GitHub Copilot.
- Decision: Favor the base `virtual:pwa-register` helper with explicit type references over the React-specific wrapper.
  Rationale: The React entry point only exposes hooks, while the base helper provides the updater function and works once `src/vite-env.d.ts` references the plugin's client types.
  Date/Author: 2025-10-18 / GitHub Copilot.

## Outcomes & Retrospective

The build now produces a precached service worker via `vite-plugin-pwa`, and the React entry point registers it through `registerPWA`. Production builds succeed, and the preview server starts with the generated manifest and `sw.js`. Manual browser verification of offline behavior remains recommended, but all repository-side tasks are complete.

## Context and Orientation

The project is a Vite-powered React single-page application. Before this effort, the entry point `src/index.tsx` disabled offline support by importing `registerServiceWorker` from a Create React App helper and calling `unregister()`. That helper expected `process.env.PUBLIC_URL`, which Vite does not provide, so no service worker ever registered. Static assets live in `public/`, including `manifest.json`, icons under `src/assets/`, and production bundles in `dist/` come from `npm run build`. This plan introduces `vite-plugin-pwa`, configuring it to generate a service worker and wiring `src/index.tsx` to call a new `registerPWA` helper built atop `virtual:pwa-register`.

## Plan of Work

Begin by examining `vite.config.ts` to understand the existing plugin array and the `defineConfig` options so we can insert the PWA plugin without disrupting Tailwind, React, or TypeScript settings. Next, install `vite-plugin-pwa` as a development dependency via npm and update `package.json` to capture the exact version so builds remain deterministic. Prepare the plugin configuration inside `vite.config.ts` by importing `VitePWA` and enabling `registerType: "autoUpdate"`, pre-caching the `index.html`, JSON schedule bundle, and CSS/JS chunks. Mirror the existing `public/manifest.json` contents inside the plugin configuration to avoid divergence, and ensure icon paths reference the files under `public/` or generate them if missing.

With the build generating a service worker, create a small TypeScript module such as `src/pwaRegistration.ts` that calls `registerSW` from `virtual:pwa-register`, returning an updater function we can hook into UI if needed. Replace the old `registerServiceWorker.js` usage in `src/index.tsx` with the new helper and remove any dead code that referenced Create React App environment variables. While making these edits, add lightweight comments only where the intent is not obvious.

Finally, document the new behavior by updating `README.md` or relevant docs if they mention offline support, and capture the commands needed to rebuild the static JSON when verifying the PWA build. Ensure the plan keeps a record of any deviations in the decision log.

## Concrete Steps

Work from the repository root `/home/sho_iizuka/workspace/github.com/arosh/naist-bus-schedule`.

1. Inspect the current Vite setup by running the normal production build and noting the existing plugin list:

    npm run build

    This command runs `tsc -b` followed by `vite build`, confirming the baseline build succeeds before adding the PWA plugin.

2. Add the dependency:

    npm install --save-dev vite-plugin-pwa

3. Update `vite.config.ts` to import and configure `VitePWA` with manifest details, caching rules for `src/resources/data.json`, and sensible workbox defaults (such as `globPatterns: ["**/*.{js,css,html,json,ico,png,svg}"]`).

4. Create `src/pwaRegistration.ts` that imports `registerSW` from `virtual:pwa-register`, calls it with `{ immediate: true, onNeedRefresh, onOfflineReady }`, and exposes a way to prompt the user when updates are available. Update `src/index.tsx` to invoke this module. Add `src/vite-env.d.ts` with references to `vite/client` and `vite-plugin-pwa/client` if TypeScript reports missing types for `import.meta` or the virtual module.

5. Remove unused functions from `src/registerServiceWorker.js` and either delete the file or convert it into a thin wrapper that re-exports the new registration helper. Update TypeScript declarations if necessary.

6. Regenerate production assets and preview the site:

    npm run build
    npm run preview -- --host 0.0.0.0 --port 4173

7. While the preview is running, open `http://localhost:4173` in a Chromium-based browser, open DevTools, and confirm the application installs a service worker. Use the "Offline" checkbox to verify cached content.

8. Update documentation noting the new offline capability and how to clear cached data during development.

## Validation and Acceptance

Acceptance requires two manual checks. First, `npm run build` must complete without errors or warnings related to the PWA plugin, producing a `dist/` folder that now includes `manifest.webmanifest` and `sw.js` (or equivalent files generated by the plugin). Second, after running `npm run preview` and loading the site, the browser’s Application panel must show an active service worker and the bus timetable should remain visible when the network tab is set to offline. Optionally, run `npm run lint` afterward to confirm the codebase still conforms to linting rules.

## Idempotence and Recovery

Installing the plugin and adjusting configuration is safe to redo; running `npm install --save-dev vite-plugin-pwa` multiple times only ensures the dependency is present. If the plugin configuration breaks the build, revert changes in `vite.config.ts` and the new registration module, reinstall dependencies to reset the lockfile, and rerun `npm run build` to confirm the baseline works before trying again. Clearing cached service workers during development can be done by calling `navigator.serviceWorker.getRegistrations()` from the browser console and unregistering them manually.

## Artifacts and Notes

- Build log excerpt showing the generated service worker:

  vite v6.2.5 building for production...
  dist/manifest.webmanifest                            0.27 kB
  PWA v1.1.0
  mode      generateSW
  files generated
    dist/sw.js
    dist/workbox-5ffe50d4.js

- Preview server output confirming the app serves from port 4173:

  ➜  Local:   http://localhost:4173/
  ➜  Network: http://172.26.7.213:4173/

## Interfaces and Dependencies

Add `vite-plugin-pwa` version 0.20.x (or the latest stable) as a development dependency in `package.json`. The Vite configuration must call `VitePWA({ registerType: "autoUpdate", manifest: { name: "NAIST バス時刻表", short_name: "NAIST バス時刻表", start_url: ".", display: "standalone", background_color: "#ffffff", theme_color: "#000000", icons: [{ src: "favicon.ico", sizes: "64x64 32x32 24x24 16x16", type: "image/x-icon" }] }, workbox: { globPatterns: ["**/*.{js,css,html,json,ico,png,svg}"] } })`. In `src/pwaRegistration.ts`, import `registerSW` from `virtual:pwa-register` and export the returned updater for potential UI prompts.

---
Initial version authored 2025-10-18.
Updated 2025-10-18: Executed plan through PWA integration, recorded discoveries, and added validation artifacts.
