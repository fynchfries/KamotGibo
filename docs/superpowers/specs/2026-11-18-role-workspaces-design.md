# Separate learner and artisan interfaces

## Approved intent

The user approved separate learner and artisan interfaces in the existing application. Learners browse, book, and learn; artisans manage workshops and learners. Shared branding and demo progress remain, but the main menus and landing views must be different. Admin review remains a separate demo interface.

## Approach

Use route-derived workspaces in the same app (chosen), not separate apps or a persisted role flag. `/teach` and `/teach/session` use the artisan shell, `/admin` uses a small admin shell, and existing public/learner routes keep the learner shell. A role flag could disagree with direct links and browser history; separate apps would duplicate the existing flows.

## Interface

- Learner: Home, Discover, My learning. Existing homepage, catalog, booking confirmations, and badges are unchanged. A labelled `Artisan view` control opens the artisan dashboard on desktop and mobile.
- Artisan: desktop sidebar and four-item mobile navigation — Dashboard, My workshops, Bookings, Application. A labelled `Learner view` control returns to the learner homepage. The brand link stays within the current workspace.
- `/teach` defaults to an artisan dashboard showing the selected provider, publication/draft/booking totals, session-management shortcuts, and application status. It does not show the learner catalog or learning menu.
- Existing workshop, bookings, and application panels become URL-selected views (`/teach?view=workshops`, `bookings`, or `application`), with a validated optional `workshopId` for the selected booking session. Invalid values fall back to Dashboard. Reload/back/forward must keep the selected view.
- Preserve mounted form panels while moving between artisan views so in-progress inputs are not lost. Existing actions, validations, publishing gates, and localStorage state remain unchanged.
- The sample-provider selector and admin-review link move into an explicitly labelled, collapsible `Demo controls` area rather than the artisan's primary menu. Admin header is clearly labelled `Admin demo` and has links back to the two user workspaces, not either user's navigation.
- Session roster return links open Bookings for the corresponding workshop. Admin return links open My workshops so publishing can continue after approval.

## Constraints and non-goals

- Frontend only; no database, server functions, authentication, authorization, payments, or dependencies.
- Shared header, navigation, and footer remain in `src/components/kg/SiteChrome.tsx` and wrap pages from `__root.tsx`.
- Keep existing routes and generated files intact. Preserve Discover filters and all saved demo progress.
- Reuse current components, colors, typography, and icons. Use semantic links, visible active state, keyboard focus, and mobile-safe layout.
- Leave unrelated and prior work intact; do not commit or push.

No new accounts, permissions, onboarding screens, chat, analytics, or profile-editing features. UI separation is not an access-control boundary.

## Proof

Test each role's desktop/mobile menus, role switching, active navigation on direct links and session pages, malformed search values, view/back/reload behavior, session return links, and existing application → approval → publishing → booking → badge flows. Run all tests, TypeScript, changed-file lint, production build, and real Chrome desktop/mobile/landscape smoke checks.
