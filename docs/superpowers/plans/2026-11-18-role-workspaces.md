# Role Workspaces Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Give learners and artisans distinct navigation and landing views without losing existing demo functionality.

**Architecture:** Derive the workspace from the route. Shared chrome owns learner menus, artisan sidebar/mobile menus, role switching, and an admin shell; validated Teach search parameters own artisan view/session selection. Reuse existing panels, forms, and local storage.

**Tech Stack:** React, TanStack Router, TypeScript, existing Tailwind/shadcn/Lucide, Vitest/Testing Library.

**Spec:** `docs/superpowers/specs/2026-11-18-role-workspaces-design.md`

## Global Constraints

- Frontend only; no database, server functions, authentication, authorization, payments, or dependencies.
- Shared header, navigation, and footer remain in `src/components/kg/SiteChrome.tsx` and wrap pages from `__root.tsx`.
- Keep existing routes and generated files intact. Preserve Discover filters and all saved demo progress.
- Reuse current components, colors, typography, and icons. Use semantic links, visible active state, keyboard focus, and mobile-safe layout.
- Leave unrelated and prior work intact; do not commit or push.

## Review Focus

1. Direct links and Back/Forward must select the correct workspace and artisan view, including malformed view parameters.
2. Each desktop/mobile menu must contain only that role's destinations and exactly one current destination.
3. Role switching must not clear stored bookings/drafts or strand the user in the other role's navigation.
4. Session/admin return links must restore the correct management view/session.
5. Moving between artisan views must not discard partially entered forms; mobile layouts must not obscure controls.

---

### Task 1: Route-backed artisan views and dashboard

**Files:** Add `src/lib/artisan-workspace.ts`; modify `src/data/sample.ts`, `src/routes/teach.index.tsx`, `src/routes/teach.session.tsx`, `src/routes/admin.tsx`, `src/test/render-demo.tsx`, `src/test/artisan-booking.test.tsx`; add `src/test/role-workspaces.test.tsx`.

**Interfaces:** `ArtisanView = "dashboard" | "workshops" | "bookings" | "application"`; `validateArtisanSearch(Record<string, unknown>) -> { view?: ArtisanView; workshopId?: string }`. `ARTISAN_SECTIONS` supplies labels/headings/descriptions. `/teach` defaults to Dashboard; existing panels remain mounted and use search parameters instead of local tab state.

- [x] Add failing tests for default Dashboard, direct booking/application URLs, malformed search fallback, Back/Forward, preserved form input, and correct session/admin return links. Update existing integration navigation from tabs to route-backed links without weakening business assertions.
- [x] Run `npm test -- src/test/role-workspaces.test.tsx src/test/artisan-booking.test.tsx`; expect missing dashboard/search navigation failures.
- [x] Implement validated views, overview cards, existing mounted panels, a collapsible Demo controls section, and management return links. Keep the demo store unchanged.
- [x] Run `npm test`; expect all tests to pass before shell work.

### Task 2: Distinct workspace shells

**Files:** Modify `src/components/kg/SiteChrome.tsx`, `src/components/kg/Logo.tsx`, `src/routes/__root.tsx`, `src/test/render-demo.tsx`; extend `src/test/role-workspaces.test.tsx`.

**Interfaces:** Shared chrome exports `WorkspaceLayout({ children: ReactNode })`. Existing `SiteHeader`, `BottomNav`, `SiteFooter` remain owned here. `Logo` accepts an optional home destination; default remains `/`. Test helper can render the real root component without CSS resource head loading.

- [x] Add failing tests for learner-only menus, artisan sidebar/four-item mobile menus, active view/session links, workspace-local brand destinations, admin separation, role switching with saved bookings, and direct-link rendering.
- [x] Run focused tests; expect old shared-menu behavior to fail.
- [x] Implement route-derived shells, explicit role-switch links, contextual brand link, and root layout wrapper. Do not add role state or authentication.
- [x] Run `npm test`; expect new navigation tests and all previous flows to pass.

### Task 3: Review and verification

- [x] Run TypeScript, changed-file ESLint, all tests, production build, and `git diff --check`.
- [x] Test real Chrome desktop, 375px mobile, and landscape: role switches, URL-linked artisan views, current navigation, form preservation, and absence of overflow/runtime exceptions.
- [x] Self-review against the spec and Review Focus (no subagent tool is available); give important findings a failing regression test before fixing.
- [x] Record proof and leave changes uncommitted, with no edits to unrelated prior work.

## Execution record

- Baseline: 10 test files, 58 tests passed. Existing artisan-booking and unrelated changes are present and must be preserved.
- Task 1 complete: seven new view/history/return-link tests failed before implementation; the full suite then passed 65/65. TanStack merges raw search keys, so the validator explicitly supplies a safe Dashboard default and clears invalid workshop IDs rather than omitting known keys.
- Task 2 complete: nine shell/role-switch tests failed against the old shared menus; the full suite then passed 74/74. Learner/artisan switching preserves the existing booking store; the store schema was not changed.
- Final review: self-review (no subagent tool). Read all changed production files and checked the five Review Focus cases; no unresolved important findings.
- Final fix: `/admin/` was incorrectly classified as learner UI. Added trailing-slash admin/session cases, observed the admin test fail, normalized trailing slashes in workspace detection, then passed 76/76.
- Proof: TypeScript, changed-file ESLint, `git diff --check`, and production build passed. Build emits a non-blocking `inlineDynamicImports`/`codeSplitting` bundler warning.
- Real Chrome proof: separate desktop/mobile menus and role switches, active view after reload, Back preserving the same form input node/value, 375px mobile and 812px landscape without horizontal overflow, enlarged text, `/admin/` separation, malformed-array view fallback, reduced-motion emulation, and no runtime exceptions. Screenshots inspected for desktop artisan, mobile artisan, and mobile learner views.
- Browser harness note: waiting for the native input value before the next click removed a timing race in the smoke script; production form preservation needed no change.
- Scope held: no auth/permissions, new dependencies/routes, schema changes, or edits to generated files. Shared branding/footer and learner content remain. Work is uncommitted and unpushed.
- Inline execution in the existing checkout, as requested; no extra design/implementation questions or subagent dispatches.
- Pre-flight: shell links and Teach view selection share `validateArtisanSearch` and `ArtisanView`; keep the optional search contract identical in both tasks. Route-derived roles deliberately do not modify the demo-store schema.
