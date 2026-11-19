# Learner Profile Editor Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add a round top-right learner profile button with a working browser-local editor.

**Architecture:** Shared chrome renders a learner-only avatar/dialog. A separate validated local profile store follows the demo store's subscription pattern without changing its schema. Existing learner pages consume saved profile fields; public badge data stays independent.

**Tech Stack:** Existing React, TanStack Router, shadcn/Radix, Tailwind, react-hook-form, Zod, Vitest.

**Spec:** `docs/superpowers/specs/2026-11-19-learner-profile-editor-design.md`

## Global Constraints

- Frontend only: no server, authentication, backend, dependencies, or real privacy guarantee.
- Preserve existing URLs, unrelated work, generated files, and neutral public landing. No commits or pushes.
- Existing bookings, attendance, assessments, badge eligibility, and demo-store schema remain unchanged.
- Use fictional profile defaults and explicitly warn against sensitive real information.

## Review Focus

1. Cancel/Escape/reopening must not save or retain unsaved drafts.
2. Malformed stored data and storage write failure must not erase a previously saved profile or demo progress.
3. Editable identity must never replace public badge recipient/metadata or appear on public Home/artisan/admin pages.
4. Keyboard focus must enter the dialog, reach errors, and return to the round button after closing.
5. Phone/landscape dialogs must scroll within the viewport; large images and unsupported types must be rejected without dropping other edits.

### Task 1: Validated browser-local profile

**Files:** Create `src/lib/learner-profile.ts` and `src/lib/learner-profile.test.ts`; add fictional defaults in `src/data/sample.ts`.

**Interfaces:** Export `learnerProfileSchema`, `LearnerProfile`, `useLearnerProfile(): LearnerProfile`, and `saveLearnerProfile(input: LearnerProfile): void`. Store at `kamotgibo-learner-profile-v1`, not `kamotgibo-demo-v1`.

- [x] Write tests for normalization, invalid name/town/craft/photo, malformed storage fallback, save/reload, and storage failure preserving old profile and demo data.
- [x] Run `npm test -- src/lib/learner-profile.test.ts`; observe RED before implementation.
- [x] Implement the schema, subscription hook, and atomic save (only publish after storage succeeds).
- [x] Run the focused tests; expect all pass.

### Task 2: Header circle and editing flow

**Files:** Create `src/components/kg/LearnerProfileButton.tsx` and `src/test/learner-profile.test.tsx`; modify `src/components/kg/SiteChrome.tsx`, `src/components/kg/PortalPage.tsx`, `src/routes/learn.tsx`, and `src/routes/learning.tsx`.

**Interfaces:** Consume Task 1 exports; export `LearnerProfileButton()` and a shared `LearnerAvatar` component. Existing page and router interfaces remain unchanged.

- [x] Write integration tests for learner-only entry, save/cancel/reopen, saved field rendering, required-name validation/focus, valid photo upload/removal, rejected SVG/oversize photos, storage-error draft retention, and public badge identity isolation.
- [x] Run `npm test -- src/test/learner-profile.test.tsx`; observe RED before implementing the UI.
- [x] Implement accessible dialog/form using existing house components. Keep dialog scrollable, use a round 44px trigger, and remove misleading privacy text.
- [x] Run profile tests and the whole suite; expect all pass.

### Task 3: Review and completion

- [x] Run `npm test`, `npx tsc --noEmit`, changed-file ESLint, `npm run build`, and `git diff --check`.
- [x] Check native Chrome at 375px phone, landscape, tablet, and desktop: round button at upper-right, usable scrollable dialog, save/reload/cancel, keyboard focus, no overflow/runtime exceptions, public/other-role isolation, unchanged booking storage.
- [x] Self-review (no subagent tool) against the spec and Review Focus.
- [x] Record actual results; leave work uncommitted and unpushed.

## Execution record

- Narrow scope follows the user's explicit top-right editing request. Larger profile expansion remains separate; no claim that it is complete.
- Continue in the existing working directory to preserve prior uncommitted work; do not move, reset, or commit it. Execution is inline because no subagent tool is available.
- Task 1: profile-store tests initially failed to load because the new module did not exist; after implementation all 12 focused tests pass. No demo-store schema/action changes.
- Task 2: observed 8 UI tests fail on the missing Edit learner profile button (4 isolation tests already passed). Implemented the editor and profile consumers. Native Radix checkbox inputs need ResizeObserver, absent in jsdom; a test-local observer shim fixes this environment limitation without mocking the UI.
- Additional photo boundary proof: an empty PNG produced no visible error; observed the new regression fail, then validated FileReader results before updating the photo (RED→GREEN).
- First whole-suite run: 14 files / 115 tests pass.
- Native Chrome review confirmed save/reload, focus, real photo upload, municipality selection, interest toggles, and responsive dialogs. It also caught an 80-character unbroken name clipped in the dashboard identity. The native assertion failed (`right: 814px`, container right `335px` at 375px). Added word wrapping to the shared identity paragraph; the identical native assertion now passes (RED→GREEN).
- Final review: self-review (no subagent tool). Checked the new store, editor, consumers, isolation, and all five Review Focus cases. The house dialog's 16px close control failed the native touch-target assertion; enlarged only this dialog's close hit area to 44px and repeated the same assertion successfully (RED→GREEN).
- Review also found that eagerly importing the editor into global chrome increased the main client bundle from 380.27 kB to 522.57 kB, introducing the >500 kB warning. Lazy-load the learner-only control using React's existing Suspense/lazy API; the final build's main entry is 392.09 kB and the chunk-size warning is gone. No dependencies added.
- Final automated gates pass: 14 files / 115 tests; TypeScript; ESLint on all nine touched source/test files; production build; diff whitespace. One earlier full-suite run while build/typecheck/Chrome also ran exceeded the default 5-second timeout in `opens from the header and cancels edits without saving`; the isolated whole-suite rerun and final post-change whole-suite run both passed 115/115. Final heavy gates were run sequentially.
- Final native proof: `/tmp/kamotgibo-profile-check.mjs` passes at 375px, 768px, 812px landscape, and 1440px, including 44px circle/close targets, save/reload/cancel/Escape, required-name focus and focus restoration, real PNG upload, municipality/interests, 80-character names, 300-character bios, larger text, reduced motion, and public/other-role isolation. Booking storage remains byte-for-byte unchanged; no page/dialog overflow or runtime exceptions. Desktop/mobile/landscape screenshots inspected.
- Browser harness waits for React hydration, completed dropdown exit animation, and settled layout before physical clicks. These are test-driver fixes, not application workarounds.
- Known non-blocking diagnostics: existing inlineDynamicImports/codeSplitting build warning; development SSR emits an unchanged BadgeMedal SVG floating-point hydration warning (Node/Chrome differ in the final decimal of a circle coordinate). No unrelated BadgeMedal changes made.
- The broader complete profile/modules/history/statistics/gallery feature remains separate. This delivers the requested circle and identity editor only. No commits or pushes; unrelated prior work remains intact.
