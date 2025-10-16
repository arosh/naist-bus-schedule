# Remove Storybook

This ExecPlan is a living document. The sections `Progress`, `Surprises & Discoveries`, `Decision Log`, and `Outcomes & Retrospective` must be kept up to date as work proceeds. Maintain this plan in accordance with `/.agent/PLANS.md`.

## Purpose / Big Picture


Removing Storybook simplifies the dependency graph and build tooling for contributors who only maintain the production SPA. After completing this plan, developers will no longer find Storybook commands or dependencies, the `src/stories` catalogue is gone, and project scripts focus solely on the Vite application. Verification is as simple as running the documented npm workflows and observing that Storybook commands no longer exist while the main app still builds, lints, and tests successfully.

## Progress


- [x] (2025-10-16 04:20Z) Catalogue existing Storybook usage across `package.json`, `src/stories/index.tsx`, `.storybook/`, and any Storybook-specific config or documentation.
- [x] (2025-10-16 04:30Z) Remove Storybook dependencies, scripts, and source files; ensure no residual imports remain.
- [ ] (2025-10-16 04:40Z) Refresh tooling state (`npm install`) and run project validation commands to confirm the app works without Storybook. `npm install` and `npm run lint` completed; `npm run build` is currently blocked by pre-existing TypeScript module resolution errors detailed below.
- [x] (2025-10-16 04:45Z) Update documentation or contributor guidance that referenced Storybook. No references found outside this ExecPlan, so no edits required.

## Surprises & Discoveries


- Observation: The repository initially contained a `.storybook` directory with `addons.js`, `config.js`, and `preview-head.html`, which has now been deleted.
  Evidence: `#file_search` query `**/*storybook*` returned those files before removal; a follow-up query confirms the directory no longer exists.
- Observation: `npm run build` fails because TypeScript cannot resolve existing asset imports (SVG/PNG, CSS, JS) and strict atom setters. These errors predate Storybook removal and require broader typing updates.
  Evidence: `npm run build` output shows TS2307 for brand assets and TS2345/TS7016 errors in `src/containers/Form.tsx`, `src/index.tsx`, and `src/stores/index.ts` immediately after removing Storybook dependencies.
- Observation: `npm run lint` completes with warnings about anonymous component exports that existed before this change.
  Evidence: ESLint reports `react-refresh/only-export-components` warnings for `src/components/*` and `src/containers/App.tsx` with no accompanying errors.

## Decision Log


- Decision: Remove Storybook entirely instead of upgrading or replacing it, because the repository relies on Vite-only workflows and Storybook 3.x is obsolete.
  Rationale: Eliminates unmaintained tooling and reduces dependency surface without affecting production features.
  Date/Author: 2025-10-16 / GitHub Copilot

## Outcomes & Retrospective


Pending implementation; summarize results here once validation succeeds.

## Context and Orientation


This repository is a Vite-driven React single-page application. Prior to this effort Storybook appeared through npm dependencies (`@storybook/react`, `@storybook/addon-actions`, `@storybook/addons`), scripts (`storybook`, `build-storybook`) defined in the root `package.json`, a `.storybook` configuration directory, and the catalogue at `src/stories/index.tsx`. After completing the initial removal steps these artifacts have been deleted; confirm they remain absent when continuing the plan. The remaining work focuses on finishing validation so the Vite app runs without Storybook.

## Plan of Work


First, audit the repository to confirm Storybook usage is limited to the identified files and note any additional references (for example, in contributor docs). Next, edit `package.json` to remove Storybook dependencies from both `dependencies` and `devDependencies`, delete the `storybook` and `build-storybook` npm scripts, and ensure no other script references Storybook binaries. Remove the now-unused `src/stories/index.tsx` file. If a `.storybook` directory or Storybook-related TypeScript configuration surfaces during the audit, delete those as well. After these edits, run `npm install` to reconcile the dependency tree (and regenerate any lock file if present). Finally, run the standard validation commands (`npm run lint`, `npm run build`, and the existing end-to-end test command, if feasible) to ensure the app operates normally without Storybook. Update documentation to remove instructions for Storybook, noting the simplification for contributors.

## Concrete Steps


From the repository root `/home/sho_iizuka/workspace/github.com/arosh/naist-bus-schedule`, inspect Storybook usage by invoking the `#file_search` tool with the query `**/*storybook*` and note every match it reports.

Edit `package.json` to remove Storybook dependencies and scripts. Delete `@storybook/addon-actions`, `@storybook/addons`, and `@storybook/react` from `dependencies`, and remove the `storybook` and `build-storybook` entries from the `scripts` section. If lock files exist (e.g., `package-lock.json` or `npm-shrinkwrap.json`), regenerate them via `npm install` after the edit.

Delete `src/stories/index.tsx`. If a `.storybook` directory or other Storybook-specific files are discovered, remove them too.

Run `npm install` to ensure the dependency tree reflects the removal. If the project maintains a lock file, confirm the diff removes Storybook packages.

Execute the usual validation commands:
    npm run lint
    npm run build
Optionally run end-to-end tests if the environment allows:
    npm run e2e

Update any documentation referencing Storybook, such as contributor guides or README snippets. Remove instructions describing Storybook commands or usage. Ensure documentation still explains how to run and test the app post-removal.

## Validation and Acceptance


Acceptance requires the absence of Storybook commands and dependencies, successful project builds, and updated documentation. After removing Storybook, run `npm run lint` and expect no errors, run `npm run build` and expect the Vite build to finish successfully, and (optionally) run `npm run e2e` to confirm automated tests still pass. Confirm `npm run` no longer lists Storybook scripts, and `npm ls @storybook/react` fails with an exit code indicating the package is not installed. Verify the deletion of `src/stories/index.tsx` and any other Storybook files via `git status`.

## Idempotence and Recovery


All steps are safe to repeat: editing `package.json` is deterministic, and rerunning `npm install` will converge on the same dependency graph. If validation fails, re-add necessary dependencies by reverting the edits with `git checkout --` on the modified files. Deletion of `src/stories/index.tsx` can likewise be undone via `git restore`. Ensure worktree cleanliness before rerunning commands to maintain predictable results.

## Artifacts and Notes


Capture key command outputs to document success, for example:
    npm install
    removed 910 packages, and audited 918 packages in 9s
    66 vulnerabilities (7 low, 11 moderate, 22 high, 26 critical)

    npm run lint
    ✖ 6 problems (0 errors, 6 warnings) react-refresh/only-export-components

    npm run build
    ❌ Typescript errors for asset imports (`TS2307`), jotai setters (`TS2345`), missing CSS/module declarations (`TS2307`/`TS7016`).

    npm run
    (verify no Storybook-related scripts appear)

Record these results in the `Outcomes & Retrospective` section once achieved.

## Interfaces and Dependencies


After completion, `package.json` must no longer list any `@storybook/*` packages. The npm script interface should expose only Vite-centric commands (`dev`, `build`, `build:json`, `lint`, `preview`, `format`, `start:selenium`, `e2e`). Production components in `src/components` remain unchanged; only the Storybook catalogue is removed. No new external dependencies are introduced. Ensure TypeScript configuration and Vite plugins require no Storybook-specific adjustments.
