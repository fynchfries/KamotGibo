# Artisan Booking Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Complete the same-browser artisan application, publishing, booking, and session-management demo.

**Architecture:** Extend the existing localStorage store with validated submissions, drafts, and per-session marks. Central selectors supply live workshops and rosters to the existing routes; reuse current shadcn controls and styling.

**Tech Stack:** React 19, TanStack Router, TypeScript, Tailwind, shadcn/Radix, Zod, React Hook Form, Vitest/Testing Library.

**Spec:** `docs/superpowers/specs/2026-11-18-artisan-booking-design.md`

## Global Constraints

- Frontend only: no server functions, database, authentication, payments, or dependencies.
- Seed content remains in `src/data/sample.ts`; form submissions and progress stay in the existing browser-local demo store.
- Preserve the shared chrome, Discover URL filters, existing routes, learner progress, and single sample shellcraft badge.
- Do not edit generated files or unrelated work. Leave changes uncommitted; do not push.

## Review Focus

1. Last available seat and repeated confirmation navigation must not reject an already-booked learner or consume extra seats.
2. Pending providers and drafts must never bypass publish/booking guards through direct actions or URLs.
3. Old, malformed, or stale browser storage must not crash screens or erase valid legacy progress.
4. Client-created workshop links must survive reload without static-only loader 404s.
5. Attendance, skill results, and badge effects must stay scoped to the correct workshop and learner.

---

### Task 1: Validated local artisan lifecycle

**Files:** Modify `src/data/sample.ts`, `src/lib/demo-store.ts`; create `src/lib/artisan-forms.ts`, `src/lib/demo-store.test.ts`.

**Interfaces:** Produce `applicationSchema`, `workshopSchema`, `ApplicationInput`, `WorkshopInput`; extend `DemoState` with applications, workshop drafts, active provider ID, and per-session marks. Produce `getProviders`, `getWorkshops`, `getProviderWorkshops`, `getRoster`, `getRosterMark`, and actions `submitApplication`, `selectProvider`, `createWorkshop`, `publishWorkshop`, `markLearner`. Preserve `book`, `approveProvider`, `issueBadge`, `reset`, `useDemoProgress` with stronger guards.

- [x] Write store tests: pending publication rejected, approved publication visible, invalid form data rejected, first booking consumes one seat, duplicate booking stays idempotent, full/unknown/draft bookings fail, session marks are isolated, badge requires shellcraft attendance/pass, storage reload and corrupt/legacy fields are safe.
- [x] Run `npm test -- src/lib/demo-store.test.ts`; expect missing lifecycle behavior to fail.
- [x] Add provider ownership and seed rosters/defaults in sample data; implement shared validation, selectors, and guarded/persisted store actions.
- [x] Run `npm test`; expect all store and existing tests to pass.

### Task 2: Connected learner routes

**Files:** Modify `src/routes/discover.tsx`, `src/routes/workshops.$id.tsx`, `src/routes/book.$id.tsx`, `src/routes/learning.tsx`; create `src/test/artisan-booking.test.tsx` and a test-only router helper if useful.

**Interfaces:** Consume Task 1 selectors/store. Keep existing route paths; resolve dynamic workshops in components from the store, retain static head metadata where available.

- [x] Write route tests proving published custom workshop discovery, live seats/detail, a final-seat booking confirmation that remains confirmed on revisits, unavailable draft links, My learning custom bookings and stale IDs.
- [x] Run focused tests; expect missing client-workshop rendering and seat updates to fail.
- [x] Replace static-only catalog/booking lookups with shared selectors and safe fallbacks. Keep one reservation effect guarded by existing booking state.
- [x] Run `npm test`; expect all tests to pass.

### Task 3: Artisan tabs, admin applications, and session roster

**Files:** Modify `src/routes/teach.index.tsx`, `src/routes/admin.tsx`, `src/routes/teach.session.tsx`; create `src/components/kg/ArtisanApplicationForm.tsx`, `src/components/kg/ArtisanWorkshopForm.tsx`; extend `src/test/artisan-booking.test.tsx`.

**Interfaces:** Consume Task 1 schemas/actions and Task 2 learner flow. Session route accepts optional `workshopId` search parameter. Forms use installed React Hook Form/Zod and existing UI primitives.

- [x] Write integration tests for submit application → approve → save draft → publish → Discover/book → artisan bookings; cover required-field errors and session attendance/skill persistence.
- [x] Run focused tests; expect missing artisan tabs/forms and dynamic admin/roster behavior to fail.
- [x] Build responsive tabs and forms, live application statuses, provider/session switching, draft publishing guards, bookings, and parameterized/persisted session controls. Label sample-only badges and browser-only limitations.
- [x] Run `npm test`; expect the complete flow and regression suite to pass.

### Task 4: Verification and review

- [x] Run `npm test`, `npx tsc --noEmit`, targeted ESLint, and `npm run build`; inspect every result and report any pre-existing failures.
- [x] Review the whole diff separately against the spec and five failure modes, using self-review because no subagent tool is available. Any important fix gets a failing regression test first.
- [x] Record exact proof and material omissions here, mark tasks complete, and leave changes uncommitted for the user.

## Execution record

- Baseline: `npm test` — 8 files, 40 tests passed.
- Task 1 complete: observed missing lifecycle/guard/storage failures, then full suite 51/51 passed.
- Task 2 complete: observed static-only lookup/stale-ID failures, then full suite 55/55 passed. Corrected a test query to account for intentionally duplicated desktop/mobile seat labels.
- Task 3 complete: observed missing tabs/forms failures, then full suite 57/57 passed. Integration test waits for the session page before selecting its roster.
- Final review: self-review (no subagent tool). Checked all changed production files and the five Review Focus cases. No unresolved critical/important findings.
- Final fix: custom workshop details incorrectly promised badge issuance; a failing integration assertion now pins the sample-only limitation (RED→GREEN). Added a full shellcraft booking → instructor → issued badge → learner regression test; suite 58/58 passed.
- Final proof: TypeScript and changed-file ESLint passed; production build passed with a non-blocking bundler `inlineDynamicImports`/`codeSplitting` warning. Chrome smoke passed at 1280px desktop, 375px mobile, and 812px landscape, with functioning tabs/forms and no horizontal overflow/runtime exceptions. Direct navigation and reload of a browser-created final-seat booking preserved a single reservation; reduced-motion emulation also checked.
- Omissions: no independent reviewer, real authentication/payments/reservations, cross-device synchronization, cancellations, editing/deleting workshops, or new badge definitions. Changes remain uncommitted and unpushed.
- Working in the existing checkout, without moving or committing the user's unrelated `.gitignore`, lockfile, or earlier design/plan changes. No subagent tool is available; execution and final review are inline.
- Pre-flight: Tasks 2/3 share Task 1 `DemoState`, schemas, selectors, and action interfaces. Both must derive seats from original capacity/seed reservations plus a single Mika booking, not decrement stored seats. Task 3 session search must be optional so old `/teach/session` links continue working.
