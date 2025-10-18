# Harden Jotai schedule atoms for synchronous reads

This ExecPlan is a living document. The sections `Progress`, `Surprises & Discoveries`, `Decision Log`, and `Outcomes & Retrospective` must be kept up to date as work proceeds. Maintain this document in accordance with `.agent/PLANS.md`.

## Purpose / Big Picture

The timetable UI depends on Jotai atoms to populate the countdown component and the grouped schedule list. Today those atoms resolve promises and therefore require React Suspense, but the app renders without any Suspense boundaries. This plan reworks the stores so every read is synchronous and validated, eliminating the runtime suspension risk while hardening persisted state against corrupted `localStorage` values.

## Progress

- [x] (2025-10-18 05:45Z) Add sanitised storage-backed atoms for direction and bus stop.
- [x] (2025-10-18 05:46Z) Introduce `scheduleKeyAtom` and align downstream atoms to use it.
- [x] (2025-10-18 05:47Z) Make timetable-related atoms synchronous by updating `BusScheduleService` and derived atoms.
- [x] (2025-10-18 05:55Z) Verify UI behaviour, run lint/build, and update this plan with outcomes (automated lint/build complete; flagged manual dev-server verification and persistence check for on-device follow-up).

## Surprises & Discoveries

- Observation: `timeTableAtom`, `nextTimeAtom`, and `timeTableMapAtom` currently return promises. Components such as `src/containers/Next.tsx` call `useAtom(nextTimeAtom)` outside any `<Suspense>` boundary, so React will throw when these atoms suspend. Evidence: the component tree in `src/containers/App.tsx` has no Suspense wrapper, and Jotai 2.x enables Suspense by default for async atoms.
- Observation: persisted atoms rely on raw `localStorage` values. If a stale or malformed entry exists (for example, an old value from a removed bus stop), the atoms will feed invalid keys into the timetable lookup and crash. Evidence: `directionAtom` and `busStopAtom` return whatever is stored without validation before `timeTableAtom` builds the `ScheduleKey` string.

## Decision Log

- Decision: eliminate the async atoms by reading timetable data synchronously via `BusScheduleService` instead of introducing Suspense boundaries. Rationale: the data is bundled locally in `src/resources/data.json`, so synchronous reads are cheaper and keep components simple. Date/Author: 2025-10-18 / GitHub Copilot.
- Decision: validate persisted direction and bus stop selections using helper storage wrappers rather than sprinkling guards at each read site. Rationale: central validation keeps `timeTableAtom` lean and ensures every consumer gets a safe value. Date/Author: 2025-10-18 / GitHub Copilot.

## Outcomes & Retrospective

- Final (2025-10-18 05:55Z): Store refactor landed, lint/build pipelines pass, and atoms now deliver synchronous data with validated persistence. Manual browser verification of the dev server and explicit `localStorage` tampering still need to be carried out by a human operator.

## Context and Orientation

`src/stores/index.ts` defines top-level constants for direction (`DIRECTION`), bus stop (`BUS_STOP`), and schedule type (`SCHEDULE`). It also instantiates service singletons and exposes Jotai atoms. `directionAtom` and `busStopAtom` use `atomWithStorage` to persist values under the `direction` and `busStop` keys. `timeTableAtom` concatenates the selected values into a `ScheduleKey` and calls `BusScheduleService.fetch`, which returns a promise wrapping schedule arrays from `src/resources/data.json`. `nextTimeAtom` awaits `timeDiffService.getNext`, and `timeTableMapAtom` awaits `SplitScheduleService.split`. Containers in `src/containers/Next.tsx` and `src/containers/List.tsx` call these atoms without Suspense. Any invalid persisted value propagates into the schedule key, leading to runtime errors.

## Plan of Work

First, create helper factories that wrap `atomWithStorage` so any persisted value is checked against the allowed literals before exposure. Keep those helpers in `src/stores/index.ts` to avoid scattering logic. Integrate the helpers into new internal atoms (`directionStorageAtom`, `busStopStorageAtom`) and expose sanitized read/write atoms that clamp to defaults.

Next, introduce a derived `scheduleKeyAtom` that composes the canonical direction (`from` selections map to the `"to"` dataset and vice versa), the bus stop, and the schedule type. This atom should always return a valid `ScheduleKey` and becomes the single source for timetable lookups.

Refactor `BusScheduleService.fetch` to return a plain array synchronously (remove the `async` keyword and `Promise` return). Update the atoms so `timeTableAtom` simply returns the array from `busScheduleService` synchronously, `nextTimeAtom` uses synchronous reads of the timetable, and `timeTableMapAtom` likewise computes synchronously. Comment the canonical direction mapping to aid future extensions.

Finally, adjust consumers as needed (they should now receive plain objects instead of awaiting promises). Run linting and a production build, launch the dev server, and manually verify that changing direction or bus stop still updates the layout and that invalid localStorage entries reset to defaults instead of crashing.

## Concrete Steps

1. Open `src/stores/index.ts` and define helper functions around `atomWithStorage` to validate stored string values. Replace direct exports of `directionAtom` and `busStopAtom` with sanitized wrapper atoms built on top of storage-backed internals. Update imports to include any new utilities such as `createJSONStorage` if used.
2. Still in `src/stores/index.ts`, add `scheduleKeyAtom` that derives the canonical timetable key using only validated atoms. Update `timeTableAtom`, `nextTimeAtom`, and `timeTableMapAtom` to pull from this key and operate synchronously.
3. Modify `src/services/BusScheduleService.ts` so `fetch` becomes synchronous (`fetch(key: ScheduleKey): string[]`). Remove unnecessary `async`/`await` in store atoms.
4. Audit other modules (`src/containers/Next.tsx`, `src/containers/List.tsx`, and any others) to ensure they import the updated atoms and no longer expect promises.
5. In `/home/sho_iizuka/workspace/github.com/arosh/naist-bus-schedule`, run the following commands:

  npm run lint

  npm run build

  npm run dev -- --port 3000

   Confirm the dev server starts without runtime warnings, and manually verify direction/bus stop toggles.

   Progress note: as of 2025-10-18 05:48Z, `npm run lint` and `npm run build` have been executed successfully; the dev server smoke test is still pending.

## Validation and Acceptance

Successful completion means `npm run lint` and `npm run build` pass cleanly. While the dev server runs, toggling between every direction and bus stop combination should update the list immediately without console errors. To demonstrate persistence hardening, manually write an invalid value into `localStorage.direction` (e.g. `window.localStorage.setItem('direction', 'invalid')` in dev tools), refresh the page, and confirm the UI falls back to the default selection without crashing. The countdown component should continue to update once per second.

## Idempotence and Recovery

The helper functions and synchronous atoms are pure transformations, so re-running the steps or reloading the app will not introduce drift. If the refactor causes issues, revert the changes in `src/stores/index.ts` and `src/services/BusScheduleService.ts` while keeping the new validation helpers isolated, then re-run lint and build to confirm recovery.

## Artifacts and Notes

- Build output (2025-10-18 05:49Z):

  npm run build
  > tsc -b && vite build
  vite v6.2.5 building for production...
  ✓ 60 modules transformed.
  dist/index.html                                      1.00 kB │ gzip:  0.58 kB
  dist/assets/LINE_SOCIAL_Square_typeA-CyMkzYUt.png    4.14 kB
  dist/assets/index-7APUpYyh.css                      12.18 kB │ gzip:  3.28 kB
  dist/assets/index-BXST4pGv.js                      367.39 kB │ gzip: 83.00 kB
  ✓ built in 912ms
- Lint output (2025-10-18 05:48Z):

  npm run lint
  > eslint --fix src
- After introducing the sanitized storage helpers, capture a console log from dev tools showing that an invalid `localStorage` value resets to the default selection to include in this section once available (pending).

## Interfaces and Dependencies

In `src/stores/index.ts`, define helper functions similar to:

    const createPersistedAtom = <T extends string>(key: string, defaultValue: T, allowed: readonly T[]) => {
      const storage = createJSONStorage<T>(() => localStorage);
      return atomWithStorage(key, defaultValue, {
        getItem: (k, initialValue) => {
          const raw = storage.getItem?.(k, initialValue) ?? initialValue;
          return allowed.includes(raw) ? raw : defaultValue;
        },
        setItem: storage.setItem,
        removeItem: storage.removeItem,
      });
    };

Expose `directionAtom` and `busStopAtom` as writable atoms that delegate to these storage-backed atoms while ensuring only allowed strings are persisted. Ensure `timeTableAtom`, `nextTimeAtom`, and `timeTableMapAtom` all perform synchronous reads so consumers receive ready-to-render values.
