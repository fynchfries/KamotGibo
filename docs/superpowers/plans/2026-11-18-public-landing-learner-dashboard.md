# Public Landing and Learner Dashboard Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Make Home a neutral, balanced role chooser and give learners the same portal layout as artisans.

**Architecture:** Add a public workspace and `/learn` route, generalize the existing sidebar/frame styling to both portals, and extract the artisan banner into shared presentation. Keep all business state and existing page URLs intact.

**Tech Stack:** Existing React, TanStack Router, TypeScript, Tailwind/shadcn/Lucide, Vitest/Testing Library.

**Spec:** `docs/superpowers/specs/2026-11-18-public-landing-learner-dashboard-design.md`

## Global Constraints

- Frontend only; no authentication, authorization, database, server functions, new dependencies, or real reservations.
- Seed content remains in `src/data/sample.ts`; existing demo-store schema and saved progress remain unchanged.
- Shared header/navigation/footer stay in `SiteChrome.tsx` and wrap routes from `__root.tsx`.
- Preserve Discover search filters, legacy artisan redirects, forms, attendance, bookings, and badges.
- Generate route-tree changes with existing tooling only; never edit generated files manually.
- Leave unrelated/prior work intact and changes uncommitted/unpushed.

## Review Focus

1. Home must never inherit learner/artisan navigation, portal branding, or mobile-menu padding, including after Back from a portal.
2. Both portal entrances must work without stale role state; public copy/cards should not privilege the learner flow.
3. Existing learner URLs and filtered Discover views must keep working inside the shared shell.
4. Dashboard counts/bookings/badge states must use stored progress, ignore unknown IDs, and remain non-destructive.
5. Both desktop sidebars and mobile menus must show exactly one appropriate current destination without overflow or hidden controls.

---

### Task 1: Public landing and shared shell

**Files:** Modify `src/data/sample.ts`, `src/routes/index.tsx`, `src/components/kg/SiteChrome.tsx`, `Logo.tsx`, `src/routes/__root.tsx`, `src/test/home.test.tsx`, `src/test/role-workspaces.test.tsx`.

**Interfaces:** `SiteFrame({ children: ReactNode })` owns shared frame/padding. Existing workspace layout supports both roles. `Logo.to` also accepts `/learn`. Public Home has For learners / For artisans regions; only their entrance buttons navigate into user flows.

- [x] Write failing public-layout, balanced-role-card, entrance, portal-menu, logo, active-state, and history-return assertions.
- [x] Run focused tests and confirm old learner-oriented Home/shared-shell behavior fails.
- [x] Implement the public workspace, balanced sample copy/cards, shared portal sidebar/mobile styling, correct logos/footer, and root frame ownership.

### Task 2: Learner dashboard and shared page banner

**Files:** Add `src/routes/learn.tsx`, `src/components/kg/PortalPage.tsx`; modify `src/components/kg/ArtisanPortal.tsx`, `src/test/render-demo.tsx`; add `src/test/learner-dashboard.test.tsx`.

**Interfaces:** `PortalPage({ eyebrow, title, description, identity, children })` supplies the existing artisan banner/container. `ArtisanPage` delegates to it without changing callers. `/learn` uses existing `useDemoProgress`, `getWorkshops`, and `milestones`.

- [x] Add failing dashboard tests for empty bookings, saved booking/issued badge, stale IDs, and shared learner-shell navigation.
- [x] Build `/learn`, preserve artisan wrapper behavior, register it in the test helper, and regenerate the real route tree using Vite tooling.
- [x] Run the full test suite and TypeScript; fix regressions without expanding scope.

### Task 3: Verification and stop

- [x] Run all tests, TypeScript, changed-file ESLint, production build, and diff whitespace checks.
- [x] Check Chrome desktop/375px mobile/landscape: neutral public header, equally prominent roles, correct entry/back behavior, shared portal sidebar/mobile menus, no overflow/runtime exceptions, and saved data continuity.
- [x] Self-review against the spec and Review Focus (no subagent tool is available); important fixes get a failing regression test first.
- [x] Record proof, leave prior work intact, and keep changes uncommitted/unpushed.

## Execution record

- Baseline: 11 files, 79 tests passed. Existing dirty/untracked work remains in place.
- Tasks 1/2 implemented: 17 focused assertions failed before implementation; the full suite then passed 12 files / 90 tests. TypeScript, changed-file ESLint, and production build also passed before responsive review.
- Public Home, balanced role cards, `/learn`, shared portal frame/banner, role-local logos, current navigation, and learner progress states are implemented. The store/schema were not changed.
- Resumed at Task 3 after user interruption without redoing Tasks 1/2.
- Responsive review found that existing My learning and workshop-detail fixed two-column grids expanded the tablet viewport beside the new sidebar. Corrected the browser assertion to use the requested width (not already-expanded innerWidth), observed four failures at 768px/812px, then moved just these two grids' split-column breakpoint from md to xl. Repeating the same native check returned no overflow (RED→GREEN); the suite stayed 90/90.
- Final Chrome proof covers public Home and all learner pages at 375px, 768px, 812px landscape, and 1440px: no overflow/runtime exceptions; Home has no role navigation, portal label, or bottom-menu padding; role cards/buttons have equal dimensions; entry and public-return links work; both portals have matching sidebar widths; active menus and a stored booking are correct. Enlarged text and reduced-motion emulation were also checked. Desktop/mobile screenshots inspected.
- Final review: self-review (no subagent tool). Read the changed production code against the spec and all five Review Focus cases; no unresolved important findings. Responsive compatibility edits were confined to `src/routes/learning.tsx` and `src/routes/workshops.$id.tsx`.
- Final gates passed: `npm test` (12 files / 90 tests), `npx tsc --noEmit`, changed-file ESLint, `git diff --check`, and `npm run build`. The build emits a non-blocking inlineDynamicImports/codeSplitting warning. Route-tree changes were generated by Vite tooling, never edited manually.
- The demo store/schema, saved data, Discover filters, artisan forms/approval/rosters, and badge rules remain unchanged. No dependencies, backend, or authentication added. Existing unrelated changes remain intact; work is uncommitted and unpushed.
- Inline execution follows the approved design without further design questions; no subagent tool is available.
- Pre-flight: public role classification, root padding, learner navigation, logo destinations, role-card destinations, and the test router all need to agree on `/learn`; existing `/discover` and `/learning` remain unchanged.
