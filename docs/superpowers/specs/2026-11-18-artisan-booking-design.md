# Artisan booking demo

## Intent and scope

Complete the missing artisan side of the frontend prototype, approved by the user with “go ahead” and no further design discussion. An artisan can submit an application, receive demo admin approval, create and publish workshops, and see learner bookings and session progress.

## Constraints

- Frontend only: no server functions, database, authentication, payments, or dependencies.
- Seed content remains in `src/data/sample.ts`; form submissions and progress stay in the existing browser-local demo store.
- Preserve the shared chrome, Discover URL filters, existing routes, learner progress, and single sample shellcraft badge.
- Do not edit generated files or unrelated work. Leave changes uncommitted; do not push.

## Approaches

Extend the existing Teach hub and demo store (chosen): reuses navigation, admin review, catalog, and session views and keeps one source of booking truth. A separate artisan dashboard would duplicate these entry points. A real multi-user service conflicts with the frontend-only brief.

## UI and flow

`Teach with us → Application | My workshops | Bookings`

- A clearly labelled demo-artisan selector switches between sample providers and locally submitted applications; it is not authentication.
- Application collects provider name, kind, craft, town, venue, and first workshop. Submitted applications appear in Admin review immediately and remain pending until approved there.
- My workshops lists the selected provider's published sessions and drafts. A validated form captures title, craft, town, level, date, start/end times, venue/directions, capacity, fee, learning outcomes, provided materials, and materials to bring. Drafts can be saved before approval; only approved providers can publish.
- Published workshops appear in Discover and work through workshop detail, booking confirmation, and My learning, including after reload in the same browser. Drafts are neither discoverable nor bookable.
- Bookings shows a provider's session roster and live seats, with a link to the existing session view. A new Mika booking adds one roster entry and consumes exactly one seat, even after repeated navigation.
- The session view accepts a workshop search parameter, persists attendance/skill checks per workshop and learner, and retains guarded issuance of the existing shellcraft badge. New-workshop badge generation is outside scope and labelled accordingly.

## Invariants and compatibility

- Central store actions validate inputs, reject unknown/full/unpublished bookings, enforce approval on publishing, prevent duplicate reservations, and enforce attendance before a skill pass or badge.
- Seeded rosters exclude Mika until booked; legacy booked IDs, provider approvals, and the issued badge survive storage loading. An old issued shellcraft badge implies its booking.
- Stored JSON is untrusted: malformed fields fall back safely; stale booking IDs cannot crash My learning. Storage denial keeps the demo usable in memory.
- Browser-created workshops cannot be resolved from server storage; their routes resolve from the client store rather than a static-only loader returning 404.
- Forms use existing UI primitives, visible labels and inline errors, keyboard-accessible tabs, and mobile layouts. No private contact details are requested.

## Acceptance and non-goals

Prove application → approval → draft → publish → Discover → booking → artisan roster → attendance/skill check with integration tests. Prove final-seat/idempotency guards, persisted reload, legacy/malformed storage, and badge restrictions with focused tests. Run the full suite, TypeScript, targeted lint, and production build.

No cancellations, editing/deleting published sessions, recurring schedules, notifications, exports, new badge definitions, cross-device synchronization, or real reservations. Do not redesign unrelated pages.
