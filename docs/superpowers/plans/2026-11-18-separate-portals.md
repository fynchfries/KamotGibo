# Separate Portals Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Separate learner and artisan page flows while retaining their connected demo data.

**Architecture:** Extract the current Teach panels into real nested pages beneath an artisan layout. Shared chrome stops offering role-switch controls; a small public footer link remains. Reuse the demo store and preserve transient form input in the artisan layout across child-page navigation.

**Tech Stack:** Existing React/TanStack Router/TypeScript/Tailwind/shadcn/RHF/Vitest tooling only.

**Spec:** `docs/superpowers/specs/2026-11-18-separate-portals-design.md`

## Global Constraints

- No backend, authentication, authorization, database, new dependencies, or real reservations.
- Preserve existing validation, publishing gates, capacity/idempotency checks, demo storage, Discover filters, and badge rules.
- Generate route-tree changes using existing tooling only; never edit generated files manually.
- Preserve unrelated/prior changes; do not commit or push.

## Review Focus

1. Direct/reloaded artisan pages and old `?view=` bookmarks must resolve correctly, including selected booking IDs and invalid view values.
2. Header, booking, and badge-success screens must not retain role-switch shortcuts; the learner footer must still expose the public artisan entrance.
3. Moving actual pages must not lose form input, existing guards, or stored progress.
4. Admin/session returns and sidebar/mobile active states must target the correct new page.
5. Data must still flow from publication to discovery, reservation to roster, and badge issuance to My learning without a navigation shortcut.

---

### Task 1: Separate navigation and page regressions

**Files:** Update `src/test/role-workspaces.test.tsx`, `src/test/artisan-booking.test.tsx`, `src/test/home.test.tsx`.

- [x] Write failing tests for genuine page paths, legacy redirect destinations, separate menus without role switches, footer entry, absent instructor/Mika shortcuts, form retention across pages, and connected business data.
- [x] Run focused tests and confirm failures are caused by the missing page/portal behavior.

### Task 2: Extract artisan pages without changing business rules

**Files:** Add `src/routes/teach.tsx`, `teach.workshops.tsx`, `teach.bookings.tsx`, `teach.application.tsx`, `src/components/kg/ArtisanPortal.tsx`, `src/lib/artisan-portal.ts`; rewrite dashboard-only `src/routes/teach.index.tsx`; modify `src/lib/artisan-workspace.ts`, existing artisan forms, and the test-only router helper.

**Interfaces:** `ARTISAN_PATHS` maps section IDs to real paths; legacy `validateArtisanSearch` stays compatible. `validateBookingSearch` validates optional `workshopId`. `useArtisanPortal()` exposes `progress`, `provider`, and an in-memory draft ref owned by the parent layout. Existing schemas/store/actions remain unchanged.

- [x] Move the shared provider/demo-control frame to the parent, and extract dashboard, workshops, bookings, and application content into actual child-route components.
- [x] Preserve form drafts with existing RHF values and a parent-owned in-memory ref; clear submitted/saved/cancelled drafts.
- [x] Add redirects for old view URLs and regenerate route types using Vite tooling; update the test router to mirror nested route ownership.

### Task 3: Remove cross-role controls and update callers

**Files:** Modify `src/components/kg/SiteChrome.tsx`, `Logo.tsx`, `src/routes/index.tsx`, `book.$id.tsx`, `teach.session.tsx`, `admin.tsx`, and `src/data/sample.ts`.

- [x] Replace query-panel navigation with real page links, retaining current-state accessibility and workspace-local logos.
- [x] Remove header switches and learner/instructor demo jump links; add only the small public `For artisans` footer link and label public listing previews.
- [x] Update management return links and existing business integration tests without weakening their data assertions.
- [x] Run the complete suite and TypeScript; investigate any regression before continuing.

### Task 4: Verify and stop

- [x] Run all tests, TypeScript, changed-file ESLint, production build, and `git diff --check`.
- [x] Check Chrome desktop/mobile/landscape, actual page navigation, direct reloads, old bookmarks, and absence of role switches/runtime errors/overflow.
- [x] Self-review the complete change against the spec (no subagent tool is available); important fixes require a failing regression test.
- [x] Record results and leave changes uncommitted.

## Execution record

- Baseline: 11 files, 76 tests passed. Existing work and unrelated dirty files remain intact.
- RED: focused checks failed in 20 places for missing real routes, retained role shortcuts, legacy URLs, and missing footer entry.
- GREEN: all 11 files / 77 tests passed after extraction and caller updates. Existing publication, booking, capacity, attendance, and badge assertions remain intact. Added explicit cancellation/draft-cache clearing coverage.
- TypeScript: the test-only route clone could not copy the file-route-specific beforeLoad generic directly. Legacy redirect logic now has one shared semantic helper called by both the real route and the test clone; TypeScript passes without casts or duplicated redirect rules.
- Route-tree source changes were generated by `npm run build`, never edited manually. The demo store and its schema were unchanged by this task.
- Review: self-review (no subagent tool). Inspected changed production files and desktop/mobile screenshots against all five Review Focus cases; no unresolved important findings.
- Browser proof: real pages and direct reloads, legacy booking redirect preserving the workshop ID, unmounted application-page input restored on Back, learner reservation visible in artisan roster, artisan attendance/pass/badge visible in My learning, no role shortcuts, no horizontal overflow at 1440px/375px/812px or enlarged text, reduced-motion emulation, and no runtime exceptions.
- Chrome harness waits for document load plus paint and for hydrated roster state; early SSR content is not treated as a finished client render. This required no product-code changes.
- Gates: full suite, TypeScript, changed-file ESLint, diff whitespace checks, and production build passed. Build has a non-blocking inlineDynamicImports/codeSplitting warning.
- Remaining limits: browser-local demo, no authentication/access control or real multi-user synchronization. Unsaved inputs are retained within the mounted artisan portal, not across reload/portal exit; explicitly saved drafts still persist in localStorage. Changes are uncommitted and unpushed.
- Execution is inline in the existing checkout, following the user's approval without additional design questions.
- Pre-flight: generated route relationships and the test router must both use a `/teach` parent. Page paths are shared by chrome, legacy redirects, return links, and tests. The store schema must not change.
