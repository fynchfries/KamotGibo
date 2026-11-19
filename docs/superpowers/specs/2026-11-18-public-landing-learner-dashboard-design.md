# Public landing and matching learner portal

## Approved intent

The user confirmed that Home must be a neutral public introduction and role chooser, not a learner page. Introduce artisans and learners with equal visual weight. After choosing a role, both portals should use the artisan interface's layout, with role-specific tools and content.

## Approach

Reuse one shared portal shell and shared page banner rather than copying the artisan implementation. Add an explicit public workspace for `/` and a learner dashboard at `/learn`; preserve existing learner detail/catalog/learning URLs and artisan routes. A separate app or persisted role flag would duplicate work or disagree with direct links and browser history.

## Public landing `/`

- Branding and a balanced platform introduction, with no portal label, learner/artisan sidebar, user tabs, or mobile bottom menu.
- Two equally sized, equally prominent cards: For learners and For artisans. Both have descriptions and full-weight entrance buttons.
- Learner entrance opens `/learn`; artisan entrance opens `/teach`.
- Craft examples and the platform story explain both teaching and learning. Craft examples are informational, not learner-task links that bypass role selection.
- Common platform steps acknowledge artisans publishing, learners booking, and both making together.

## Shared portal layout

- Both roles use the existing artisan-style desktop sidebar, top branding bar, dashboard banner, summary cards, content-card grid, and mobile menu.
- Learner menu: Dashboard (`/learn`), Discover (`/discover`), My learning (`/learning`). Workshop/booking pages keep Discover current; badge pages keep My learning current.
- Artisan menu and routes remain unchanged. Admin remains separate.
- Portal logos stay within their own dashboards. Public logo returns to `/`. A small Platform home footer link returns either role to the neutral landing page; no in-portal role switch is added.
- Public/admin pages do not reserve bottom-menu padding; learner/artisan pages retain safe mobile menu clearance.

## Learner dashboard `/learn`

Reuse current progress and hardcoded sample data. Show booking, badge, and completed-milestone totals; next workshop bookings (or an empty state with a Discover action); and the sample badge/learning progress with a My learning action. It must not display artisan creation, publication, provider approval, or roster-management tools. Unknown stale booking IDs are ignored using existing workshop selectors.

Extract the existing artisan banner/wrapper into a small shared `PortalPage` presentation component. Keep `ArtisanPage`'s interface and provider/draft ownership intact.

## Constraints

- Frontend only; no authentication, authorization, database, server functions, new dependencies, or real reservations.
- Seed content remains in `src/data/sample.ts`; existing demo-store schema and saved progress remain unchanged.
- Shared header/navigation/footer stay in `SiteChrome.tsx` and wrap routes from `__root.tsx`.
- Preserve Discover search filters, legacy artisan redirects, forms, attendance, bookings, and badges.
- Generate route-tree changes with existing tooling only; never edit generated files manually.
- Leave unrelated/prior work intact and changes uncommitted/unpushed.

## Acceptance

Prove no role navigation or role label on Home; balanced role regions and correct entrance URLs; matching sidebar/mobile navigation in both portals; active destination on learner details and badges; learner dashboard empty/populated/stale-data states; correct role-local logo and public return navigation; and preserved artisan/booking/badge regressions. Run all tests, TypeScript, changed-file lint, production build, and Chrome desktop/mobile/landscape checks for public and both portal layouts.
