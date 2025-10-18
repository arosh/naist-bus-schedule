# Fix npm run build type errors

This ExecPlan is a living document that must be maintained according to .agent/PLANS.md. Update every section as progress is made so a newcomer can resume the work from this file alone.

## Purpose / Big Picture

`npm run build` currently stops with nine TypeScript errors, blocking releases and any downstream automation that depends on a green build. By following this plan we will restore a clean build so contributors can ship schedule updates and ensure the Vite bundle compiles without type failures. Verification happens by running the build command and observing it exit with code 0 and no TypeScript diagnostics.

## Progress

- [x] (2025-10-18 10:20Z) Reproduced `npm run build` failure; captured TypeScript errors for missing asset modules, strict setter types, and an untyped service worker import.
- [x] (2025-10-18 10:28Z) Added `src/types/static-assets.d.ts` to declare SVG, PNG, and CSS modules, then introduced `src/registerServiceWorker.d.ts` after TypeScript still flagged the service worker import.
- [x] (2025-10-18 10:38Z) Tightened `Form` container and component props to use exported literal unions, updating atoms for `direction`, `busStop`, and `scheduleType` to accept only valid values.
- [x] (2025-10-18 10:44Z) Exported `ScheduleKey`, added an `isValidKey` guard in `BusScheduleService`, and updated `timeTableAtom` to validate composed keys before fetching schedules.
- [x] (2025-10-18 10:51Z) Re-ran `npm run build`; TypeScript passed and Vite completed the production build in 0.9s.

## Surprises & Discoveries

- Observation: TypeScript in bundler mode rejects asset imports (`.svg`, `.png`, `.css`) unless ambient module declarations exist, even though Vite handles them at runtime. Evidence: build output lists TS2307 for each asset import in `src/components/Share.tsx` and for `src/assets/css/theme.css`.
- Observation: Jotai setters from `atomWithStorage` preserve the literal type of their initial values, so passing generic strings violates strictness. Evidence: TS2345 errors in `src/containers/Form.tsx` when sending `string` instead of the literal union.
- Observation: Declaring the service worker module inside `src/types/static-assets.d.ts` was ignored because the runtime `.js` file takes precedence; providing a sibling `src/registerServiceWorker.d.ts` resolved TS7016. Evidence: rerunning `npm run build` after the ambient declaration still yielded TS7016 until the dedicated file was added.

## Decision Log

- Decision: Provide ambient type declarations in `src/types/static-assets.d.ts` (new file) rather than downgrading TypeScript strictness or enabling `resolveJsonModule` hacks. Rationale: keeps strict mode benefits while matching Vite's runtime behavior. Date/Author: 2025-10-18 GitHub Copilot.
- Decision: Export a `ScheduleKey` type from `src/services/BusScheduleService.ts` and use it where string keys are composed instead of casting to `any`. Rationale: encourages type-safe key construction and documents the contract between the store and service. Date/Author: 2025-10-18 GitHub Copilot.
- Decision: Freeze direction, bus stop, and schedule constants with `as const` and export union types for reuse across atoms and components. Rationale: ensures all state setters accept only valid literal values without cross-file string duplication. Date/Author: 2025-10-18 GitHub Copilot.
- Decision: Provide a dedicated declaration file `src/registerServiceWorker.d.ts` so TypeScript aligns the namespace import with the existing JavaScript module. Rationale: bundler mode ignored the previous ambient module, but a sibling `.d.ts` reliably augments the JS implementation. Date/Author: 2025-10-18 GitHub Copilot.

## Outcomes & Retrospective

`npm run build` is now green, unblocking dependency updates on `update-dependencies`. The stricter typing on form atoms and container handlers guards against invalid persisted values, while the explicit schedule-key guard will catch mismatches early if new CSVs are introduced. No open issues remain under this plan.

## Context and Orientation

The project is a Vite + React app rooted under `src/`. The failing imports live in `src/components/Share.tsx`, which renders social share buttons with brand images from `src/assets/brands/`. The form state orchestration sits in `src/containers/Form.tsx`, delegating presentation to `src/components/Form.tsx`, and reads atoms defined in `src/stores/index.ts`. `src/services/BusScheduleService.ts` loads timetable data from `src/resources/data.json`. TypeScript is configured via `tsconfig.app.json` with `moduleResolution` set to `bundler`, which requires explicit ambient declarations for non-TypeScript modules. The build command runs `tsc -b` followed by `vite build`, so TypeScript errors must be resolved first.

## Plan of Work

Introduce a central ambient declaration file under `src/types/` that covers `.svg`, `.png`, and `.css` imports and add a sibling `src/registerServiceWorker.d.ts` so the namespace import receives first-class types. Next, tighten the type contracts between the container and form components by defining local `Direction`, `BusStop`, and `ScheduleType` aliases derived from the constants in `src/stores/index.ts`. Update event handlers in both `src/containers/Form.tsx` and `src/components/Form.tsx` to use these unions so the Jotai setters receive values of the correct literal type. Finally, in `src/services/BusScheduleService.ts`, export a `ScheduleKey` type and adjust `src/stores/index.ts` to declare the computed `query` as that type before calling `fetch`, optionally adding a runtime guard to surface configuration mistakes early. Each change is additive and should maintain existing behavior while satisfying the type checker.

## Concrete Steps

1. From the repository root (`/home/sho_iizuka/workspace/github.com/arosh/naist-bus-schedule`), create `src/types/static-assets.d.ts` defining modules for `*.svg`, `*.png`, and `*.css`, and add `src/registerServiceWorker.d.ts` so TypeScript understands the namespace import.
2. Modify `src/components/Share.tsx` only if necessary to keep imports intact; the ambient declarations should make the file type-safe without code changes.
3. Update `src/containers/Form.tsx` to import `DIRECTION`, `BUS_STOP`, and `SCHEDULE` types, derive literal unions, and type handler parameters accordingly so `setDirection`, `setBusStop`, and `setScheduleType` receive correctly typed values.
4. Update `src/components/Form.tsx` to mirror the stricter prop typings, ensuring the component remains compatible with the container and restricts callers to the allowed option values.
5. In `src/services/BusScheduleService.ts`, export the `ScheduleKey` type and use it in the `fetch` signature; in `src/stores/index.ts`, import `ScheduleKey`, annotate `query`, and optionally throw a descriptive error if the composed key is not included in the JSON data.
6. Run the build locally with `npm run build` and ensure the command exits successfully with no TypeScript errors.

Expected command transcript after fixes:

    $ npm run build
    ...
    ✓ built in <time>

## Validation and Acceptance

Acceptance criterion: executing `npm run build` in the repository root completes with exit code 0, and the TypeScript compiler no longer reports TS2307, TS2345, TS7016, or TS2345 errors related to the share assets, form handlers, or service worker import. Optionally verify the app still renders the share icons by running `npm run dev` and loading the homepage to confirm assets load correctly in the browser.

## Idempotence and Recovery

Adding ambient declarations and type annotations is safe to repeat; re-running the steps will overwrite the same files without side effects. If a new declaration file introduces build regression, deleting it restores the prior state. Updating TypeScript types does not mutate runtime data. Should the build still fail, re-check the new type definitions for typos in module specifiers and ensure the constants used in union types match the actual option values.

## Artifacts and Notes

Current failing build excerpt for reference:

    src/components/Share.tsx:1:25 - error TS2307: Cannot find module '../assets/brands/Twitter_Social_Icon_Square_Color.svg'
    src/containers/Form.tsx:13:20 - error TS2345: Argument of type 'string' is not assignable to parameter of type 'SetStateActionWithReset<"from">'
    src/index.tsx:3:32 - error TS7016: Could not find a declaration file for module './registerServiceWorker'

Latest successful build snippet:

  $ npm run build
  ...
  ✓ built in 902ms

## Interfaces and Dependencies

Define the following ambient typings in `src/types/static-assets.d.ts`:

    declare module '*.svg' {
      const url: string;
      export default url;
    }
    declare module '*.png' {
      const url: string;
      export default url;
    }
    declare module '*.css' {
      const url: string;
      export default url;
    }

Provide `src/registerServiceWorker.d.ts` with:

    export type ServiceWorkerConfig = {
      onUpdate?: (registration: ServiceWorkerRegistration) => void;
      onSuccess?: (registration: ServiceWorkerRegistration) => void;
    };
    export function register(config?: ServiceWorkerConfig): void;
    export function unregister(): void;

Expose and reuse these TypeScript aliases:

    export type ScheduleKey = keyof typeof schedule;  // src/services/BusScheduleService.ts

In `src/stores/index.ts`, ensure the computed query conforms to that type before calling `busScheduleService.fetch`.

---
Initial version created 2025-10-18 by GitHub Copilot.
