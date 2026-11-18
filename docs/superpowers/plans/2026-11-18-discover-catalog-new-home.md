# Move Catalog to Discover and Create a Story-Led Home — Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Move the current compact workshop-catalog UI to `/discover` and give `/` a distinct story-led welcome page.

**Architecture:** Keep route ownership in the existing TanStack file routes. Discover will reuse URL validation, workshop filtering and catalog cards; Home will use sample copy and craft data, with links into Discover and Teach. Keep the shared chrome and all non-discovery flows unchanged.

**Tech Stack:** React 19, TanStack Router/Start, Tailwind v4, existing Radix/shadcn components, Vitest and Testing Library.

**Spec:** `docs/superpowers/specs/2026-11-18-discover-catalog-new-home-design.md`

## Global Constraints
- Frontend-only prototype; all content remains hardcoded in `src/data/sample.ts`.
- No backend, auth, database, dependency, schema or generated-file changes.
- Keep shared header, mobile nav and footer in `SiteChrome.tsx`.
- Make one local commit on `main` after final checks; do not push or rewrite history.
- Leave the untracked `package-lock.json` and unrelated `.gitignore` change out of the commit.
- Do not change booking, learner, instructor, admin or badge behavior.

## Review Focus
- Search combined with craft, town, level, schedule and cost still filters the intended workshop — Task 1 integration test.
- Invalid or repeated filter values are ignored rather than crashing or yielding unintended selections — Task 1 route test plus existing `workshop-search.test.ts`.
- Clearing filters after a zero-result query restores all four workshops — Task 1 integration test.
- Workshop cards retain free/full labels and valid detail destinations — Task 1 card assertions.
- Home links into discovery without duplicating the workshop catalog; craft links carry the selected craft — Task 2 route tests.

---

### Task 1: Move the catalog experience to Discover

**Files:**
- Modify: `src/routes/discover.tsx`, `src/data/sample.ts`
- Test: `src/test/discover.test.tsx`
- Reuse: `src/components/kg/WorkshopCard.tsx`, `src/components/kg/FilterChips.tsx`, `src/lib/workshop-search.ts`

**Interfaces:** Keep `validateWorkshopSearch` and `filterWorkshops` as the URL-validation/filtering boundary. Use `WorkshopCard` with `variant="catalog"`; preserve all six search fields: `q`, `town`, `craft`, `level`, `when`, and `cost`. Add `DISCOVER_COPY` for the compact catalog copy and temporarily retain `HOME_COPY` as its alias until Task 2.

- [x] Add a failing route test for the compact hero, search field, craft controls, 4 workshop cards, free/full states, result count and short three-step row.
- [x] Add failing interaction tests for a combined search/filter URL, selection persistence when filters close, clear-after-empty recovery, and correct workshop detail link.
- [x] Run `npm test -- src/test/discover.test.tsx`; confirm the new catalog assertions fail before changing the route.
- [x] In `sample.ts`, add `DISCOVER_COPY` and keep `HOME_COPY = DISCOVER_COPY` temporarily so the current Home remains buildable.
- [x] Replace Discover’s current presentation with the Home catalog layout. Keep craft chips visible; put town, skill level, schedule and cost in the filter disclosure/popover. Reuse the existing validator and filtering function; retain `replace: true` URL updates and clear behavior.
- [x] Run `npm test -- src/test/discover.test.tsx src/lib/workshop-search.test.ts src/components/kg/WorkshopCard.test.tsx`; expect all to pass.

### Task 2: Make Home a separate welcome page

**Files:**
- Modify: `src/routes/index.tsx`, `src/data/sample.ts`
- Test: `src/test/home.test.tsx`
- Reuse: `src/components/kg/CraftArt.tsx`, `src/components/ui/button.tsx`, existing TanStack `Link`

**Interfaces:** Rename the current compact `HOME_COPY` export to `DISCOVER_COPY`; define the story-led `HOME_COPY` in `sample.ts`. Keep craft category data sourced from `CRAFTS` and link category cards to `/discover` with the selected craft.

- [x] Replace catalog-specific Home tests with failing tests for a story-led hero, craft categories, the how-it-works steps, a primary `/discover` CTA, a secondary `/teach` CTA, and no workshop-card list on Home.
- [x] Run `npm test -- src/test/home.test.tsx`; confirm the new page expectations fail before implementation.
- [x] Replace the catalog on `/` with the story-led welcome content using sample copy. Remove the temporary `HOME_COPY` alias and define story-led `HOME_COPY` in `sample.ts`. Do not render workshop cards there. Update page metadata and preserve accessible headings and internal links.
- [x] Run `npm test -- src/test/home.test.tsx src/test/discover.test.tsx`; expect Home and discovery flows to pass. The old Home tests currently contain unsupported Testing Library `exact` options; remove or correct them while replacing those tests.

### Task 3: Verify the combined routes

**Files:** No additional files; review the scoped diff.

- [x] Run `npm test`; expect all tests to pass (baseline currently has 2 failing Home tests).
- [x] Run `npx tsc --noEmit`; expect no TypeScript errors.
- [x] Run `npm run build`; expect client, SSR and Cloudflare output to build successfully.
- [x] Run `git diff --check`; expect no whitespace errors.
- [x] Browser-based width/reduced-motion inspection unavailable; SSR smoke returned HTTP 200 for Home and both Discover URLs, and keyboard filter dismissal is covered by route tests. Report visual inspection as unavailable.
- [x] Confirm shared-chrome and root styling in the staged diff are the earlier approved visual work; no generated route-tree, booking or demo-store changes are staged.
- [x] Stage the approved Home/Discover feature files plus this split's spec and plan; review the staged diff. Exclude `.gitignore`, `package-lock.json`, and the earlier untracked Home design docs.
- [ ] Commit locally on `main` with `feat: separate landing and workshop discovery`. Do not push.
