# Discovery-first Home Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Apply the approved v4 catalog-first Home, including the coordinated borderless artwork and working filters, to the actual app.

**Architecture:** Reuse sample data, URL filtering, existing UI primitives and the shared WorkshopCard. Keep Home's new card presentation opt-in so Discover does not get an unrequested redesign. Shared navigation remains owned by SiteChrome.

**Tech Stack:** React 19, TanStack Router/Start, Tailwind v4, existing shadcn/Radix components, Vitest/Testing Library.

**Spec:** `docs/superpowers/specs/2026-11-18-discovery-first-home-design.md`

## Global Constraints
- Frontend-only prototype: all content comes from hardcoded sample data in `src/data/sample.ts`; no server functions, database or auth, because the brief forbids a backend.
- No new dependencies, paid assets, schema changes, generated-file edits, or changes to demo-store/localStorage behavior.
- Keep the existing Clay Studio OKLCH tokens and Manrope; preserve workshop facts and URLs.
- Preserve the existing dirty working tree and untracked lockfile. No commit or push is planned.

## Review Focus
- Invalid/repeated URL values must not select nonexistent filters or crash rendering — Task 1.
- Free and full workshops must remain distinguishable and link to their original details — Task 2.
- Search combined with craft/town/level must survive closing controls and returning from details; clearing must recover an empty list — Task 3.
- At mobile/breakpoint widths, artwork must not crowd search, controls must fit, and navigation must not cover the final content — Task 3 browser checks.
- Keyboard popup dismissal/focus return and reduced-motion preferences must work without interfering with search — Task 3.

## Task 1 — Reuse search validation
**Files:** create `src/lib/workshop-search.ts` and `src/lib/workshop-search.test.ts`; modify `src/routes/discover.tsx` and `src/data/sample.ts`.
**Interfaces:** export `validateWorkshopSearch(search: Record<string, unknown>): WorkshopFilters`; export the existing `LEVELS: Level[]` from sample data. Preserve `filterWorkshops` and all workshop records.

- [ ] Add tests for valid query/craft/town/level/weekend/free inputs, invalid enum values, arrays/non-string query values, and empty query normalization. Assert the current Discover validator's exact outputs, including undefined fields.
- [ ] Run `npm test -- src/lib/workshop-search.test.ts`; confirm failure because the module is not implemented.
- [ ] Move Discover's `pick`/validation unchanged to the shared module; import the validator and LEVELS in Discover.
- [ ] Run the validator, Discover and sample-data tests; all pass without changing Discover's filtering semantics.

## Task 2 — Add the Home catalog-card presentation
**Files:** modify `src/components/kg/WorkshopCard.tsx` and its existing test file. Reuse `CraftIcon`, `formatFee`, and `seatsLabel`.
**Interfaces:** add optional `variant?: "default" | "catalog"` to WorkshopCard; default retains existing Discover markup/behavior. Catalog adds the approved craft-art band and compact metadata layout.

- [ ] Parameterize existing card assertions over both variants: instructor/title, full schedule, fee, availability and `/workshops/shell-jewelry-basics` remain present. In the catalog case, assert `screen.getByText("Nanay Rosa (sample)")` (the mockup's exact instructor label, without the default card's “With” prefix) so the current implementation fails. Add explicit catalog free/full cases.
- [ ] Run `npm test -- src/components/kg/WorkshopCard.test.tsx`; confirm the new variant contract fails before implementation.
- [ ] Implement the catalog presentation in the shared card, preserving data/formatting ownership and default appearance. Match the mockup's craft-color bands using existing OKLCH tokens and icons; keep nonessential art decorative.
- [ ] Rerun card tests; both presentations pass, including Free/Full and detail destinations.

## Task 3 — Apply the approved Home and shared chrome
**Files:** modify `src/routes/index.tsx`, `src/components/kg/SiteChrome.tsx`, `src/data/sample.ts`; create `src/assets/pottery-workbench-textured.svg` and `src/test/home.test.tsx`. Only add targeted rules in `src/styles.css` if existing Tailwind utilities cannot express the approved motion/layout.
**Interfaces:** Home uses the Task 1 validator for q/craft/town/level only and calls `filterWorkshops(WORKSHOPS, filters)`; renders Task 2's catalog cards. Add `HOME_COPY` in sample data for the spec's short hero and three step labels.

- [ ] Add router-backed Home tests for: four sample cards initially; short hero copy and distinct artwork sources; search/form submit plus combined craft/town/level URL state; selection retained after popup closes; zero-result recovery via clear; incoming invalid filters and Discover-only schedule/cost ignored; returning from a detail route restores the filtered list.
- [ ] Run `npm test -- src/test/home.test.tsx`; confirm the missing Home controls/behavior fail before implementation.
- [ ] Copy the approved SVG from the companion into assets. Replace Home's editorial sections with the approved hero/search/catalog/short steps. Use the existing Input/Button/Popover/Select primitives, with visible labels, focus return and reduced-motion overrides on the popup. Preserve internal TanStack links, rather than mockup localhost URLs or new-tab behavior.
- [ ] Trim SiteChrome's repeated text/footer spacing and use its existing outlined Teach button. Preserve all destinations, project credit, sample-data notice and mobile safe-area navigation.
- [ ] Run `npm test`, `npx tsc --noEmit`, focused ESLint/Prettier checks, `npm run build`, and `git diff --check`; record pre-existing warnings separately. Baseline before this work: 21 tests across 6 files pass.
- [ ] Check actual app in Chrome at 375/700/701/768/1024/1440px: no overflow; two distinct borderless layers above 700px; search fills its column; keyboard filter/clear flow; reduced motion; card free/full states; detail/back behavior; unchanged Discover filters and booking persistence. Compare the desktop screenshot against v4 and inspect mobile.
- [ ] Review the scoped diff against the spec, mark this plan complete, and stop. Report actual preview URL and remaining cross-browser limits; do not commit or push.

## Execution
Recommended: native execution in the current session, after plan approval. No subagent tool is available, and this small sequential change is cheapest to implement and verify directly. Inspect the existing worktree before execution; preserve all prior work rather than switching the user's live preview to an unrelated clean checkout.
