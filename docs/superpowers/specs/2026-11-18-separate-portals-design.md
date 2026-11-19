# Separate connected portals

## Approved change

The user approved two clearly separate portal experiences in the same app: normal learner screens must not expose artisan/learner switches, and artisan management sections must be genuine pages rather than query-selected panels. Data remains connected.

## Approach and boundaries

Use nested artisan routes under `/teach`, reusing existing components and the existing demo store. Separate applications/domains would add deployments and would not share the browser's localStorage, conflicting with the frontend-only prototype. Authentication and permissions are not part of this change.

- Learners keep `/`, `/discover`, `/workshops/$id`, `/book/$id`, `/learning`, and badge pages.
- Artisans use `/teach` (dashboard), `/teach/workshops`, `/teach/bookings`, `/teach/application`, and the existing `/teach/session`.
- Shared chrome still lives in `SiteChrome.tsx`; remove header role-switch controls from all interfaces. Learners have only learner navigation; artisans have only management navigation.
- Remove the booking confirmation's instructor-demo shortcut and the roster's learner-demo shortcut. Badge issuance still updates the learner's saved data.
- Remove the prominent Teach hero button from the learner homepage. A small `For artisans` footer entrance is sufficient; it is not a role toggle.
- Keep admin review separate. Artisan demo controls can still open it to exercise approval; admin returns to the real My workshops page.
- Public listing previews from the artisan manager are explicitly labelled previews and open in another tab, leaving the management page in place.

## Ownership

A `/teach` layout owns the selected provider and transient, in-memory form draft snapshots. Child pages own their own content and local feedback; inactive page forms are not hidden in the DOM. Form snapshots preserve entered values when navigating between artisan pages, but do not add autosave or a backend. Saved workshops, approvals, reservations, attendance, and badges continue using the existing store without a schema change.

The old `/teach?view=...` URLs redirect to the new pages, preserving the selected booking workshop where applicable. Invalid legacy views fall back to Dashboard. Existing learner and session links continue resolving.

## Constraints

- No backend, authentication, authorization, database, new dependencies, or real reservations.
- Preserve existing validation, publishing gates, capacity/idempotency checks, demo storage, Discover filters, and badge rules.
- Generate route-tree changes using existing tooling only; never edit generated files manually.
- Preserve unrelated/prior changes; do not commit or push.

## Acceptance

Tests prove separate menus, absence of normal-flow role-switch links, working real artisan pages, legacy redirects, correct admin/session returns, in-progress form retention, and application → approval → publish → Discover → book → artisan roster → badge → learner data continuity. Run the full suite, TypeScript, changed-file lint, production build, and Chrome desktop/mobile/direct-link reload checks.
