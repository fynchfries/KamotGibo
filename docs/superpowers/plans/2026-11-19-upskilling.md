# Upskilling Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add the approved separate Upskilling learner pages without redesigning the portal or inventing certification progress.

**Architecture:** Shared learner navigation gains a fourth item. Data-driven qualification/competency/curriculum records resolve against existing published workshop selectors, while pure helpers summarize existing evidence. Nested TanStack pages reuse the current profile/avatar, card primitives, and catalogue WorkshopCard.

**Tech Stack:** Existing React, TanStack Router, Tailwind/shadcn, Lucide, browser demo store, Vitest/Testing Library.

**Spec:** `docs/superpowers/specs/2026-11-19-upskilling-design.md`

## Global Constraints

- Frontend only: no backend, authentication, dependencies, database/migrations, or official certification integration.
- Preserve Dashboard, Discover, My learning, artisan/admin pages, all current URLs, saved profile, and demo-store schema/actions.
- No commits or pushes; preserve unrelated dirty/untracked work.
- Generate `src/routeTree.gen.ts` only through Vite tooling.

## Review Focus

1. Workshop IDs/outcomes may disappear or change; omit invalid mappings, deduplicate recommendations, and show honest empty states.
2. Attendance, bookings, passed skill checks, and official qualification competence are distinct; do not invent module completion or count the unrelated Shellcraft badge.
3. Arbitrary/unknown pathway IDs and a second qualification must render safely without weaving-specific route logic.
4. Sidebar/mobile selection, browser Back/reloads, editable learner identity, neutral Home, and artisan menus must remain correct.
5. Four mobile links and long titles must fit at 375px/landscape/enlarged text; references must identify external destinations and certification limits.

### Task 1: Relationships and evidence

**Files:** Modify `src/data/sample.ts`; create `src/lib/upskilling.ts`, `src/lib/upskilling.test.ts`.

**Interfaces:** Define `Qualification`, `QualificationCompetency`, `CurriculumActivity`, `LearningReference`, `QUALIFICATIONS`, `CURRICULUM_ACTIVITIES`, and `UPSKILLING_COPY` in sample data. Export `getRelatedActivities(competency, workshops)`, `getRelatedWorkshops(qualification, workshops)`, and `getRelatedLearning(competency, workshops, progress)` from the helper. Activity matches require a present catalogue workshop and exact matching learning outcome. Related evidence returns attended/passed/notYet/booked counts, with each workshop counted once.

- [x] Write tests for existing-workshop relationships/deduplication, missing/stale outcomes and IDs, generic qualifications, past attendance without passes, unrelated badges, booked-only workshops, live pass/not-yet marks, and no store mutations.
- [x] Run `npm test -- src/lib/upskilling.test.ts`; observe RED, then implement the minimal data and helpers.
- [x] Repeat focused tests and whole suite; expect all pass once navigation expectations are implemented in Task 2 (record any deliberately RED navigation tests).

### Task 2: Navigation and pages

**Files:** Modify `src/components/kg/SiteChrome.tsx`, `src/test/role-workspaces.test.tsx`, `src/test/render-demo.tsx`; create `src/components/kg/Upskilling.tsx`, `src/routes/learner.upskilling.tsx`, `src/routes/learner.upskilling.index.tsx`, `src/routes/learner.upskilling.$id.tsx`, and `src/test/upskilling.test.tsx`. Generate route tree using the existing build tool.

**Interfaces:** Consume Task 1 data/helpers and existing `useLearnerProfile`, `LearnerAvatar`, `useDemoProgress`, `getWorkshops`, and `WorkshopCard`. Export `UpskillingPage` and `CertificationNote` for the two pages. Loader resolves qualification by ID and throws `notFound()` for unknown IDs.

- [x] First update learner-menu expectations to four items and observe the missing Upskilling link fail on existing pages.
- [x] Write integration tests for the landing/detail journey, active menu on both pages, related-workshop hash target, truthful recorded progress, generic second qualification, unknown ID, empty recommendations, safe references/disclaimer, and untouched My learning/storage.
- [x] Implement nested routes/components and the shared navigation change, keeping public/other-role menus unchanged. Extend the existing real-route test helper.
- [x] Run feature/navigation tests, regenerate routes with `npm run build`, and run the whole suite; expect green.

### Task 3: Verification and review

- [x] Run full tests, TypeScript, changed-file ESLint, production build, and diff whitespace checks sequentially to avoid CPU-contention timeouts.
- [x] Native Chrome: 375px, 768px, 812px landscape, 1440px; route/back/direct reload; four mobile targets; profile editor; recommendation → existing workshop; recorded evidence; external links; enlarged text/reduced motion; no overflow/runtime exceptions.
- [x] Self-review against the spec and all five Review Focus cases (no subagent tool available).
- [x] Record proof and limitations, stop only test-owned processes, and leave changes uncommitted/unpushed.

## Execution record

- Approved scope: user said “go ahead” after the explicit frontend-only proposal; proceed without further design/implementation-method questions.
- Continue in the existing checkout so all prior uncommitted work remains available in the connected prototype; no branch/history operations or dependency installs. Inline execution, no subagent tool.
- Baseline: 14 test files / 115 tests pass before changes.
- Interface pre-flight: Task 2 consumes Task 1's qualification/activity records and three selector helpers; existing Workshop/DemoState types are reused unchanged. No conflicting interfaces.
- Task 1: new helper module initially missing (RED). Added official-reference records, six explicit existing-outcome mappings, and three pure selectors; 14 focused tests pass. No workshops, completions, or demo-store fields/actions added.
- Task 2: six existing-page menu tests and the new navigation-to-pathway journey failed on the missing Upskilling item (RED). After implementation, 53 feature/navigation tests pass, then the full suite passes (16 files / 140 tests). Route tree generated by the build.
- Typecheck caught unchecked test-fixture array access and the nested test route's bound file-route parent type. Added non-null assertions to known seed fixtures and used TanStack's AnyRoute type only for that mirrored test parent; production loader types remain unchanged. TypeScript, changed-file ESLint, and whitespace checks now pass.
- Final review: self-review (no subagent tool). Reviewed the data/helpers, nested routes, UI, navigation, tests, and all five Review Focus cases; no unresolved important findings. No edits to Dashboard, Discover, My learning, profile-store, demo-store, branding, styles, or existing business actions were needed.
- Final automated proof: `npm test` passes 16 files / 140 tests; `npx tsc --noEmit`, ESLint on all eleven touched source/test files, `npm run build`, and `git diff --check` pass. The generated route tree includes the new parent/index/detail routes. Main client entry is 425.50 kB; no >500 kB chunk warning.
- Native Chrome proof: `/tmp/kamotgibo-upskilling-check.mjs` passes 375px, 768px, 812px landscape, and 1440px checks across the old learner pages and both new pages. Tested View pathway, related-workshop hash navigation, recommendation → existing workshop → Back, direct reloads, four correctly selected menu items, related attendance/skill-check counts, safe external PDF references, disclaimer, profile editor, unknown ID, enlarged text, reduced motion, and public/artisan/admin separation. No horizontal overflow or runtime exceptions. Saved demo/profile storage remains byte-for-byte unchanged.
- Inspected desktop/mobile landing screenshots, detail page, and related-learning/recommendation sections. Full-page phone captures place the fixed bottom menu at the original viewport bottom; native scrolling/viewport checks confirm the normal fixed-nav behavior.
- Known existing non-blocking diagnostics remain: the inlineDynamicImports/codeSplitting build warning and the unchanged BadgeMedal floating-point SVG hydration warning on existing learning pages. No unrelated warning cleanup.
- Delivered the approved reference-only frontend scope. Level II terminology and sample-workshop labels remain explicit; no automatic NC II progress/certification, invented modules/completions, database, admin qualification editor, authentication, or new dependencies. All changes remain uncommitted/unpushed and prior work remains intact.
