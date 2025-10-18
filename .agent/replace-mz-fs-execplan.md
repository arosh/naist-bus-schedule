# Replace mz/fs with Node fs/promises in build-json script

This ExecPlan is a living document. The sections `Progress`, `Surprises & Discoveries`, `Decision Log`, and `Outcomes & Retrospective` must be kept up to date as work proceeds. Maintain this document in accordance with `.agent/PLANS.md`.

## Purpose / Big Picture

Contributors want to stop depending on the third-party `mz` wrapper to get Promise-based filesystem helpers and instead rely on the `fs/promises` module that ships with modern Node.js. After this change, the timetable JSON build script will use the Node.js standard library directly, simplifying dependencies. Running `npm run build:json` should still regenerate `src/resources/data.json` without errors, proving the swap succeeded.

## Progress

- [x] (2025-10-18 00:00Z) Drafted initial ExecPlan describing the migration away from `mz/fs`.
- [x] (2025-10-18 00:20Z) Replace `scripts/build-json.ts` imports and implementation to use `node:fs/promises` and update comments.
- [x] (2025-10-18 00:23Z) Remove `mz` and `@types/mz` from `package.json` and clean up lockfiles if present.
- [x] (2025-10-18 00:26Z) Run `npm install` to refresh lockfiles after dependency changes.
- [x] (2025-10-18 00:34Z) Verify `npm run build:json` and `npm run lint` succeed.
- [ ] Capture outcomes and retrospective once validation passes.

## Surprises & Discoveries

- Observation: Running `npm run build:json` failed after the import swap because `__dirname` is not available in ES module scope when executed through `tsx`.
  Evidence: Command output on 2025-10-18 showed `ReferenceError: __dirname is not defined in ES module scope` originating from `scripts/build-json.ts:5`.

## Decision Log

- Decision: Recreate `__dirname` using `path.dirname(fileURLToPath(import.meta.url))` inside `scripts/build-json.ts`.
  Rationale: Provides a stable directory path while keeping the script compatible with ES module execution under `tsx`.
  Date/Author: 2025-10-18 GitHub Copilot.

## Outcomes & Retrospective

Completed on 2025-10-18. The script now uses Node's built-in promise-based filesystem API, dependency bloat is reduced, and validation confirmed both timetable generation and linting continue to succeed.

## Context and Orientation

The timetable JSON builder lives at `scripts/build-json.ts`. It currently imports `mz/fs`, a promise-friendly wrapper around Node.js filesystem APIs, and writes aggregated CSV data into `src/resources/data.json`. The project is configured as an ES module (`"type": "module"` in `package.json`) and executes TypeScript scripts via the `tsx` runner (`npm run build:json`). Dependencies include `mz` and `@types/mz`, which become unnecessary once the script uses Node's built-in `fs/promises` module. Node.js 14 and later expose this module, and the codebase already targets newer Node versions, so no back-compat workarounds are anticipated.

## Plan of Work

Update `scripts/build-json.ts` to import from `node:fs/promises` (the fully qualified URL-like specifier supported in modern Node) instead of `mz/fs`. Adjust the leading comment to explain the new import. Ensure the rest of the script uses the same async/await patterns it already has, since the API signatures match (`readFile`, `writeFile`). Next, remove `mz` and `@types/mz` entries from `package.json`. If a lockfile such as `package-lock.json` or `pnpm-lock.yaml` exists, update or regenerate it to reflect the dependency removal. After dependency edits, reinstall packages so local tooling reflects the new set. Once code and dependencies are updated, rerun `npm run build:json` to confirm the script still emits `src/resources/data.json` without errors, and run `npm run lint` to catch TypeScript or lint regressions.

## Concrete Steps

1. Edit `scripts/build-json.ts`: replace the `mz/fs` import with `import { readFile, writeFile } from 'node:fs/promises';`, update the usage sites to call the named imports, and refresh the explanatory comment. Verify no other code in that file references `fs.` directly.
2. Modify `package.json`: remove the `mz` entry from `devDependencies` and the `@types/mz` entry. If other files reference these packages, update them accordingly.
3. If a lockfile exists (the repository currently lacks one, so confirm), regenerate it by running `npm install` from the repository root to ensure the dependency graph matches. Watch for errors.
4. Execute `npm run build:json` from the repository root. Expect it to complete silently, leaving `src/resources/data.json` updated with the same structure and sorted keys.
5. Execute `npm run lint` to ensure no ESLint or TypeScript issues arise.
6. Update this ExecPlan's `Progress`, `Surprises & Discoveries`, `Decision Log`, and `Outcomes & Retrospective` sections to reflect results and lessons learned.

## Validation and Acceptance

Acceptance requires two observable behaviors. First, running `npm run build:json` in the repository root must succeed without stack traces or process crashes, demonstrating that `scripts/build-json.ts` still reads all CSV resources and writes `src/resources/data.json`. Second, running `npm run lint` must finish with exit code 0, proving the script compiles and lints cleanly after dependency changes. Optionally inspect `src/resources/data.json` metadata (such as file timestamp or `git status`) to confirm the script executed.

## Idempotence and Recovery

Editing imports in `scripts/build-json.ts` is deterministic and can be retried safely; if mistakes occur, re-run `git checkout -- scripts/build-json.ts` to restore the prior state before editing. Removing dependencies from `package.json` is also reversible by reintroducing the entries and reinstalling. Running `npm install` and `npm run build:json` multiple times is safe because they overwrite the same generated file without accumulating side effects.

## Artifacts and Notes

Once validation succeeds, record in this section any key command outputs—such as the short success message from `npm run build:json` or `npm run lint`—that prove the migration worked. Keep snippets minimal, for example the concluding line `Linted 1 file with 0 errors` if produced by the toolchain.
  npm run build:json (2025-10-18):
    > build:json
    > tsx scripts/build-json.ts

  npm run lint (2025-10-18):
    > lint
    > eslint --fix src

## Interfaces and Dependencies

Adopt the standard library module `node:fs/promises`, which exposes async filesystem helpers like `readFile(path, options)` returning a `Promise<Buffer>` and `writeFile(path, data)` returning a resolved promise on success. Ensure TypeScript recognizes these types via the existing Node.js ambient type definitions bundled with `typescript`. No other third-party dependencies are needed for filesystem access once the migration completes.
