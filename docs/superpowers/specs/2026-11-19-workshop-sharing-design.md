# Demo-safe workshop sharing

## Approved scope

The user chose demo-safe sharing after verification showed that browser-created workshops have no shared public storage. Add real browser/platform sharing for the existing public sample catalogue; do not imply that newly created local listings work for other recipients. Preserve the current UI and booking/provider rules.

## Approach

Reuse house buttons, Lucide Share2/Copy icons, Radix popover on desktop and the existing Vaul drawer below 768px. A separate social SDK/feed, invented Messenger deep link, automatic posting, and a backend are excluded. Messenger is available only as a target offered by the device's own share menu; KamotGibo cannot detect or count the chosen native target.

- Desktop: secondary outline Share immediately below the primary booking button.
- Mobile: a 44px share-icon control beside the booking action, retaining the booking button's dominance and readable layout.
- Published artisan catalogue rows: Share workshop beside Preview listing.
- After creating/publishing a local workshop: truthful “live in this demo browser” notice, local preview, disabled public-share/copy actions, and a visible explanation. Drafts must not gain usable sharing links.

## Public-link boundary

Only IDs in the server-renderable `WORKSHOPS` catalogue are shareable. Resolve share text from that public record, not from caller-provided browser data. Canonical links contain only origin and `/workshops/<id>`—never profile data, bookings, query parameters, fragments, or serialized local workshop records.

Detect development/private origins and warn that their links may work only locally. Copying a development catalogue link is allowed with that warning; Facebook/native promotion is disabled until the app is served from a public site. Host checks are structural safeguards, not a guarantee of external reachability.

## Share interaction

- Facebook: open its URL-sharing page with the encoded canonical URL in a new tab. Record selection intent only; do not claim a post was published.
- Copy link: use Clipboard.writeText; announce “Workshop link copied” only after success. If unavailable/denied, keep the menu open, show an error and a selectable read-only link. Do not fake clipboard success.
- Device sharing: feature-detect secure context, navigator.share and optional navigator.canShare. Invoke directly from the user's click, with title, short description and canonical URL. Busy state prevents duplicate requests. Cancellation is quiet and not counted; non-cancel errors expose manual alternatives. Resolution records a native share action, not an actual social post.
- Messenger: a concise hint tells users to choose it in the native device menu if available, otherwise copy the link. No standalone Messenger integration or Messenger-specific analytics.
- Menus support labels, keyboard dismissal/focus restoration, visible focus, 44px targets, mobile scrolling, and small inline status/error messages.

## Preview metadata

Generate workshop-scoped OG/Twitter tags and canonical link from the public workshop record during SSR. Include title, artisan, location, date/time when available, fee and KamotGibo branding. Compute request origin using the framework's isomorphic request/browser utilities; no new RPC/server function or API endpoint.

Add optional `imageUrl` to the Workshop type only (no demo-store schema/form changes). Prefer a structurally valid public HTTP(S) raster image URL; otherwise use a new branded 1200×630 PNG under `public/social/`, composed from the existing craft-table photo, shell mark, Manrope and existing palette. Never use profile uploads or browser-only image URLs. No root-level image metadata: other pages must not inherit workshop previews. Browser-only IDs retain generic/noindex metadata.

## Lightweight local analytics

Use `kamotgibo-share-counts-v1`, separate from all progress/profile storage. Count only public catalogue IDs and four actions: share_opened, facebook_selected, native_share_used, link_copied. Sanitize malformed storage, tolerate blocked/quota-full storage without interrupting sharing, and bound numeric counters. No names, account IDs, contacts, IPs, timestamps, fingerprints, external telemetry, posting/conversion claims, or new admin dashboard.

## Constraints and non-goals

Frontend-only prototype; no authentication, database/migrations, dependencies, Meta app credentials, social permissions, feed, automatic posting, official public origin invented in source, or central analytics. Preserve existing URLs, saved browser progress, provider approval rules, demo-store schema and unrelated dirty work. No commits/pushes; generated files remain tooling-owned.

Live Facebook rendering, social-account posting, and OS-level target delivery cannot be guaranteed from a local headless test. Verify emitted SSR HTML, actual assets/links, real local copy behavior and UI, and simulate browser-API boundaries for success/error/cancel tests.
