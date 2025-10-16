# Resolve react-refresh lint warnings

This ExecPlan is a living document. The sections `Progress`, `Surprises & Discoveries`, `Decision Log`, and `Outcomes & Retrospective` must be kept up to date as work proceeds. Maintain this plan in accordance with `.agent/PLANS.md`.

## Purpose / Big Picture

The goal is to eliminate the `react-refresh/only-export-components` warnings emitted by `npm run lint`. After implementation, running the lint command should report zero warnings. Developers will regain full confidence that hot-reload friendly, named React components are exported everywhere, improving DX (developer experience) during Vite fast refresh.

## Progress

- [x] (2025-10-16 07:45Z) Ran `npm run lint` to capture current warnings about anonymous default exports in multiple React components.
- [x] (2025-10-16 07:55Z) Documented per-file conversion instructions so a novice can apply consistent naming fixes.
- [x] (2025-10-16 07:59Z) Converted each anonymous default-exported component to a named function while preserving props and logic.
- [x] (2025-10-16 08:01Z) Re-ran `npm run lint`; command completed with no warnings reported.
- [x] (2025-10-16 08:03Z) Documented outcomes, decision rationale, and confirmations in this plan.

## Surprises & Discoveries

- Observation: TypeScript temporarily flagged missing image module declarations when editing `src/components/Share.tsx`, but the existing build already handles these assets via Vite so no action was required.
  Evidence: ESLint fix attempt surfaced `Cannot find module` messages for the three image imports during edit-time validation on 2025-10-16.

## Decision Log

- Decision: Prefer named function declarations (e.g., `function Footer() { ... }`) over new `React.FC` aliases to satisfy the lint rule without additional imports.
  Rationale: Keeps the code minimal while fulfilling `react-refresh` requirements and avoids altering TypeScript configuration.
  Date/Author: 2025-10-16 / GitHub Copilot

## Outcomes & Retrospective

All targeted components now export named React functions, and `npm run lint` completes without warnings as of 2025-10-16. The work confirmed that the existing Vite asset handling remains sufficient despite editor-time module resolution warnings. Future contributors should continue creating named exports for new components to preserve fast refresh compatibility.

## Context and Orientation

This repository is a Vite-powered React single-page application. Linting uses ESLint with the `react-refresh/only-export-components` rule, which demands that every default export referencing a React component be a named function. The warnings currently flag anonymous functions in the following files:

- `src/components/Arrow.tsx`
- `src/components/Footer.tsx`
- `src/components/Form.tsx`
- `src/components/List.tsx`
- `src/components/Share.tsx`
- `src/containers/App.tsx`

Each file currently exports an anonymous arrow function directly in `export default () => { ... }` or similar form. We must replace these with named exports such as `export default function Arrow(props) { ... }` or `const Arrow: React.FC<Props> = (props) => { ... }; export default Arrow;`. Ensure any existing prop types or hooks remain untouched when converting.

## Plan of Work

For `src/components/Arrow.tsx`, lift the anonymous component into a named function called `Arrow` that returns the same `div` with inline styles, then export it as the default.

For `src/components/Footer.tsx`, introduce a named function `Footer` that returns the existing JSX footer layout before exporting it.

For `src/components/Form.tsx`, keep the existing `Props` type, assign the arrow function to a constant named `Form`, and export that named constant as default.

For `src/components/List.tsx`, keep the sorting logic intact and assign the component to a constant named `List`, exported as default, so the memoization-ready structure remains unchanged.

For `src/components/Share.tsx`, introduce a named function `Share` so the component can still access the computed URLs and default-export that named function.

For `src/containers/App.tsx`, wrap the JSX tree in a named function `App` and export it as default.

After converting every file, run the lint command to confirm the warnings disappear. Update this living document with progress, surprises, or decisions discovered during implementation.

## Concrete Steps

1. From the repository root `/home/sho_iizuka/workspace/github.com/arosh/naist-bus-schedule`, edit each component file and convert anonymous default exports into named exports that match the component purpose (for example, `function Arrow`). Keep any TypeScript types intact.
2. After editing, run the lint command to verify. Executed on 2025-10-16 08:01Z with no warnings reported:

    npm run lint

3. If additional warnings appear, inspect the affected file, adjust the component naming, and rerun the command until clean.
4. Update the `Progress`, `Surprises & Discoveries`, `Decision Log`, and `Outcomes & Retrospective` sections based on the results.

## Validation and Acceptance

Validation succeeds when `npm run lint` completes without warnings. The command output should end with `0 problems` or equivalent. Additionally, spot-check that the Vite dev server still renders the components by running `npm run dev` if desired, though lint cleanliness is the primary acceptance criterion.

## Idempotence and Recovery

Refactoring anonymous exports into named ones is safe to repeat; re-running the edits simply reaffirms the named declarations. If a mistake occurs, revert the specific file with version control (`git checkout -- <file>`), then reapply the change carefully. The lint command can be executed multiple times without side effects.

## Artifacts and Notes

Example of the expected transformation for `src/components/Arrow.tsx`:

    // Before
    export default () => (
      <span className="Arrow">→</span>
    );

    // After
    export default function Arrow() {
      return <span className="Arrow">→</span>;
    }

Record actual diffs in version control once the edits are made and tests pass.

## Interfaces and Dependencies

No new dependencies are required. Continue using the existing React setup. Each component should ultimately export a named function, compatible with React Fast Refresh expectations. If a component requires props, define them via existing TypeScript interfaces or type aliases and ensure the function signature reflects them, for example:

    type ShareProps = { url: string };
    export default function Share(props: ShareProps) { ... }

Notes on future revisions:

- Created 2025-10-16 by GitHub Copilot to eliminate `react-refresh/only-export-components` warnings reported by ESLint.
