# Demo-safe Workshop Sharing Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add truthful public-catalogue sharing, social previews and local action counts without changing the portal design or implying local workshop publication is global.

**Architecture:** Pure helpers own public-record eligibility, canonical URLs, share data and metadata. A shared responsive share control uses existing popover/drawer components and browser APIs; a separate local count module never touches demo progress. Existing detail/management routes host the controls and truthful publication notice.

**Tech Stack:** Existing React/TanStack Start, shadcn/Radix/Vaul, Lucide, browser share/clipboard/localStorage, Vitest and Chrome CDP.

**Spec:** `docs/superpowers/specs/2026-11-19-workshop-sharing-design.md`

## Global Constraints

- Frontend-only prototype; no authentication, database/migrations, dependencies, Meta app credentials, social permissions, feed, automatic posting, or central analytics.
- Preserve existing URLs, saved browser progress, provider approval rules, demo-store schema and unrelated dirty work.
- No commits/pushes; generated files remain tooling-owned.
- Browser-created workshop data must never be advertised as a working public link.

## Review Focus

1. Private/browser-created IDs, caller-overridden data and URL query/hash/profile details must never enter public shares or preview metadata.
2. Clipboard failures, native cancellation/policy rejection, unsupported APIs and storage failures must be honest and leave manual alternatives usable.
3. Server HTML must contain absolute canonical/OG/Twitter metadata and a real crawler-readable fallback PNG, without root image inheritance.
4. Publishing remains approval-guarded and browser-local; its new notice/actions must not claim global availability or mutate progress/rosters.
5. Booking and share controls, popup/drawer, keyboard focus and mobile bottom navigation must fit 375px, landscape and enlarged text without overlay/overflow regressions.

### Task 1: Public share data, metadata and counts

**Files:** Create `src/lib/workshop-sharing.ts`, `src/lib/share-origin.ts`, `src/lib/share-analytics.ts`, `src/lib/workshop-sharing.test.ts`, `src/lib/share-analytics.test.ts`; modify only the Workshop type in `src/data/sample.ts`; create `public/social/kamotgibo-workshop.png`.

**Interfaces:** Export `getPublicWorkshop(id)`, `getWorkshopShareData(id, origin)`, `isPublicShareOrigin(origin)`, `getWorkshopMetadata(id, origin)`, and `getShareOrigin()`; export `recordShareAction(id, action)` and `getShareCounts()` with four closed action names. No existing store changes.

- [x] Write failing URL/eligibility/metadata/image and counter tests: canonical payloads, unknown IDs, caller data isolation, private origins, valid/invalid image URLs, fallback dimensions, corrupted/blocked storage and no progress mutation.
- [x] Run the new focused tests (RED), then implement helpers and generate the brand-consistent fallback asset from existing resources.
- [x] Repeat focused tests; expect green. Verify SSR-origin helper uses no RPC or credential.

### Task 2: Shared control and route integration

**Files:** Create `src/components/kg/WorkshopShare.tsx`, `src/components/kg/WorkshopShare.test.tsx`, `src/test/workshop-sharing.test.tsx`; modify `src/routes/workshops.$id.tsx` and `src/routes/teach.workshops.tsx`.

**Interfaces:** Consume Task 1 helpers. `WorkshopShare` accepts workshop, optional origin/label/iconOnly/className and renders an outline trigger, desktop popover or mobile drawer. It exposes no public link for non-catalogue records. Detail loader returns request origin for SSR metadata; caller pages use the existing live workshop selectors unchanged.

- [x] First assert the new public-page Share controls and browser-local publication guard; observe RED on missing UI.
- [x] Write component tests for public Facebook URL, native support/success/cancel/error/busy, real feedback and local counts, clipboard unavailable/failure/manual selection, private-origin warning, unknown/local IDs, and keyboard close/focus.
- [x] Implement the shared control and placements, metadata integration and honest post-publication notice/actions. Keep primary booking visually dominant and existing routes/data intact.
- [x] Run focused and whole-suite tests; typecheck/lint. Resolve actual failures at their owning layer.

### Task 3: Native proof and final review

- [x] Check actual HTTP/SSR metadata for each seed workshop, unknown/browser-only IDs, canonical URLs and fallback asset response/dimensions.
- [x] Chrome at 375/768/812-landscape/1440: detail/management placements, copy with real clipboard, local counters, popup/drawer accessibility and cancellation, local publishing guard, existing booking/full/booked states, enlarged text/reduced motion, no overflow/runtime exceptions or unrelated storage changes.
- [x] Self-review against the spec and five Review Focus cases (no subagent tool).
- [x] Run full tests, TypeScript, changed-file ESLint, production build and whitespace checks sequentially; record exact results/limitations, stop only test-owned processes, and leave work uncommitted/unpushed.

## Execution record

- User explicitly selected the demo-safe scope; proceed inline without another approval/method question. Existing dirty checkout is retained, with no history/dependency changes.
- Baseline: 16 files / 140 tests pass before sharing changes.
- Pre-flight: the control and route integration consume the pure public-data/canonical/metadata helpers and local action recorder. No backend, published-data model, profile or demo-store changes are necessary.
- Task 1: observed missing-module RED for new helpers; implemented public-record/canonical/metadata checks and local-only counters. Generated the 1200×630 PNG (550,491 bytes) using existing craft-table photo, shell mark, Manrope and palette. Asset test initially used import.meta.url, rewritten to HTTP by jsdom/Vite; changed the test's filesystem lookup to the repository-relative asset path. All 29 data/metadata/count tests pass.
- Task 2: observed all three route integration tests fail on missing controls/publication notice, then the new control tests fail on the missing component. After implementation all 45 sharing tests pass, and the full suite passes 20 files / 185 tests. TypeScript and initial production build pass; client entry remains under 500 kB (413.19 kB).
- Native regressions: waited for Vaul's slide animation to settle before checking geometry. Chrome then caught missing mobile focus; reproduced with a failing component test and enabled this drawer's autoFocus. Chrome also caught a landscape popover at y=-20: its viewport-only 343px cap exceeded the 323px available above the trigger. Capped the menu by Radix's available-height variable with 8px collision padding; the same native assertions then passed. Used the native DOM contains() assertion in the focus test to respect activeElement's Element type without a cast.
- Final automated gates: 20 test files / 186 tests pass; TypeScript, ESLint on all eleven sharing-touched source/test files, production build and git diff --check pass. Client entry: 413.19 kB (131.86 kB gzip), no >500 kB warning. Existing inlineDynamicImports/codeSplitting diagnostic remains non-blocking.
- Native proof: /tmp/kamotgibo-sharing-check.mjs and /tmp/kamotgibo-sharing-browser.log. Anonymous development-server HTTP HTML has workshop-scoped OG/Twitter/canonical tags for all four catalogue IDs, clean query-free canonical URLs, and an HTTP-200 image/png fallback with 1200×630 dimensions. Home and browser-only IDs do not inherit workshop images; unknown/local server metadata remains noindex. Chrome passed 375/768/812-landscape/1440, real clipboard/counters, Escape/focus restoration, mobile-sheet focus, full/booked/available controls, enlarged text/reduced motion, artisan controls, and the local-publication notice/disabled actions. Progress and profile storage remained byte-for-byte unchanged during sharing-only checks; no runtime exceptions or horizontal overflow.
- Screenshots: /tmp/kamotgibo-sharing-desktop-menu.png, /tmp/kamotgibo-sharing-mobile-sheet.png, /tmp/kamotgibo-sharing-landscape-menu.png and /tmp/kamotgibo-sharing-local-publication.png. Fallback: public/social/kamotgibo-workshop.png.
- Self-review: checked all five Review Focus cases against implementation, tests and native evidence. Public payloads resolve only from catalogue IDs; failures/cancellation do not fake success; preview image metadata is workshop-scoped; approval/store APIs remain unchanged; responsive surfaces and focus regressions are fixed. No unresolved important sharing-specific findings. Review is inline, not independent, because no subagent tool is available.
- Extra production-runtime probe: npm run preview returns HTTP 500 before loading the application because TanStack's preview plugin looks for dist/server/server.js while this project's unchanged Nitro/Cloudflare build emits .output/server/index.mjs. Nitro's Cloudflare preview would invoke Wrangler, which is not installed; did not install dependencies or change unrelated build configuration. Production build passes, but production-runtime SSR/live-platform rendering was not verified. Details: /tmp/kamotgibo-sharing-preview.log.
- Limits remain intentional: browser-created listings cannot be shared publicly, counts are browser-local, host/image checks are structural, and live Facebook preview/posting or OS-level Messenger/other-target delivery is not proven by local/headless tests. Facebook intent and native success/error/cancel/busy branches are component simulations, not live-account posting tests. No deployment, backend, new dependency, commit or push.
- Cleanup: verified process command/ownership before stopping only the sharing-check Vite servers on 4184/4185 and Chrome on 9234. All three test ports are closed; artifacts remain under /tmp for review. Unrelated working-tree changes are preserved.
