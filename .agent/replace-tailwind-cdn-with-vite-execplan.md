# Replace Tailwind CDN With @tailwindcss/vite

This ExecPlan is a living document. The sections `Progress`, `Surprises & Discoveries`, `Decision Log`, and `Outcomes & Retrospective` must be kept up to date as work proceeds.

Follow `.agent/PLANS.md` in this repository when editing or executing this plan; it defines the required structure and maintenance rules.

## Purpose / Big Picture

Today the site relies on a Tailwind CSS browser CDN script that injects utility classes at runtime. Switching to the `@tailwindcss/vite` plugin lets us compile Tailwind styles during the Vite build so the production bundle stays self-contained, loads faster, and works offline. After completing this plan, the app will ship Tailwind styles generated at build time, and the HTML entry point will no longer load Tailwind from an external CDN.

- [x] (2025-10-18 03:12Z) Installed Tailwind build tooling, created `tailwind.config.ts`, updated Vite plugin list, and moved Tailwind layer directives into `src/assets/css/theme.css` while removing the CDN script from `index.html`.
- [x] (2025-10-18 03:18Z) Ran `npm run build` to confirm the production bundle succeeds with compiled Tailwind CSS.
- [x] (2025-10-18 06:55Z) Replaced deprecated `@tailwind` directives with `@import "tailwindcss";`, widened Tailwind content globs, and revalidated via dev server and production build.

## Surprises & Discoveries

- Observation: Local CSS diagnostics report `@tailwind` as an unknown at-rule even though Vite builds successfully.
    Evidence: Editor surfaced "Unknown at rule @tailwind" after inserting the directives; `npm run build` completed without errors.
- Observation: Tailwind CSS v4 expects `@import "tailwindcss";` instead of legacy `@tailwind` directives when used with the Vite plugin; omitting this caused all utilities to be stripped in dev.
    Evidence: Following the Vite installation guide and switching to the new import restored all Tailwind utilities in both dev and build outputs.

## Decision Log

- Decision: Reuse the existing `src/assets/css/theme.css` entry point for Tailwind directives instead of introducing a new stylesheet.
    Rationale: `src/index.tsx` already imports this file, so layering directives above the existing font stack avoids touching additional imports.
    Date/Author: 2025-10-18 / GitHub Copilot
- Decision: Adopt Tailwind v4's `@import "tailwindcss";` syntax and align the config content globs with documentation.
    Rationale: Ensures the dev server and build emit the full utility set and removes IDE errors about unknown at-rules.
    Date/Author: 2025-10-18 / GitHub Copilot

## Outcomes & Retrospective

Build-time Tailwind integration now works: the CDN script is gone, Tailwind utilities compile during `npm run build`, and the plan's acceptance criteria passed. Updating to the Tailwind v4 import syntax resolved both the missing-style issue in dev and the IDE lint warnings.

## Context and Orientation

The entry HTML lives at `index.html`. It currently loads Tailwind via a `<script>` tag that points at `https://cdn.jsdelivr.net/npm/@tailwindcss/browser@4`. React mounts inside the `#react-root` element through `src/index.tsx`, which already imports `src/assets/css/theme.css`. The Vite configuration is in `vite.config.ts`, supplying only the React plugin. There is no Tailwind configuration file yet, and `package.json` does not list Tailwind-related dependencies. All components rely on Tailwind-style utility classes for styling, so the generated CSS must include those utility class definitions.

## Plan of Work

First, add build-time Tailwind support by installing `@tailwindcss/vite` and its `tailwindcss` dependency, then wire the plugin into `vite.config.ts`. Create a `tailwind.config.ts` file that points the Tailwind engine at `index.html` and the entire `src` tree so utility classes in JSX are recognized. Next, expand `src/assets/css/theme.css` (or replace it with a new stylesheet that we import) to include the Tailwind `@tailwind base`, `components`, and `utilities` directives before the existing font rules. With those build pieces in place, remove the Tailwind CDN `<script>` from `index.html` so styles only come from the compiled bundle. Finally, verify the development server and production build both succeed and that tailwind utilities render correctly.

## Concrete Steps

Install the new dependencies and save them to `package.json`:

    npm install -D tailwindcss @tailwindcss/vite

Add `tailwind.config.ts` with content configured for this project, for example:

    import type { Config } from 'tailwindcss';

    const config: Config = {
      content: ['index.html', 'src/**/*.{ts,tsx}'],
      theme: { extend: {} },
      plugins: [],
    };

    export default config;

Update `vite.config.ts` to import `tailwindcss` from `@tailwindcss/vite` and include it in the plugins array alongside `@vitejs/plugin-react`.

Augment `src/assets/css/theme.css` so it begins with `@import "tailwindcss";` (the Tailwind v4 entrypoint) and continues to define the existing font stack.

Edit `index.html` to remove the Tailwind CDN `<script>` tag since styles will now be bundled.

Run the Tailwind initialization command to generate the configuration file if desired instead of manual creation, but ensure the final config matches the snippet above.

After edits, restart the development server if desired:

    npm run dev

Open the app in a browser (default http://localhost:5173/) and confirm Tailwind-powered components still render correctly. Produce a production build to ensure Vite emits CSS assets without errors:

    npm run build

## Validation and Acceptance

Acceptance requires the development server and production build to succeed without Tailwind CDN involvement. While `npm run dev` runs, load the homepage and confirm utility classes (for example, the form layout in `src/components/Form.tsx`) still apply. After running `npm run build`, verify Vite finishes without errors and that the output `dist/assets` folder contains generated CSS that includes Tailwind utilities. Optionally, run `npm run preview` to spot-check the bundled output behaves identically without a network connection to the CDN.

## Idempotence and Recovery

Running `npm install -D tailwindcss @tailwindcss/vite` multiple times is safe; it reuses the existing lockfile entries. Editing the config files is deterministic; if a mistake occurs, reapply the edits following this plan. Removing the CDN script is reversible by reintroducing the tag if necessary while debugging. No destructive migrations are involved.

## Artifacts and Notes

Populate this section with concise diffs or command transcripts while executing the plan. Recorded build confirmation after integration:

    $ npm run build
    vite v6.2.5 building for production...
    ✓ 60 modules transformed.
    dist/assets/index-BkIByIyU.css  12.66 kB │ gzip: 3.33 kB

## Interfaces and Dependencies

`vite.config.ts` must export a plugin array containing the default React plugin and the Tailwind plugin imported from `@tailwindcss/vite`. The Tailwind configuration should be written in TypeScript as `tailwind.config.ts` at the repository root, exporting a default object typed as `Config`. The stylesheet imported by `src/index.tsx` must start with `@import "tailwindcss";` so the Tailwind v4 runtime emits all utilities during dev and build. No other runtime dependencies should be introduced, and the removal of the CDN script must not break the HTML entry point.
