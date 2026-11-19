# Discovery-first Home — approved design

## Intent and approval
Apply the v4 Home mockup to the actual application. The user approved the compact catalog layout, Clay Studio palette, wider search field, borderless overlapping images, and the warmer textured pottery illustration behind the existing shellcraft illustration.

Reference: `.superpowers/brainstorm/70206-1794957444/content/discovery-first-home-textured.html`.
Rear artwork: the adjacent `pottery-workbench-textured.svg`.

## Approaches considered
- Lightly shorten the previous editorial Home: smallest change, but retains the large hero and long path to workshops.
- Discovery-first Home: compact hero, search, craft controls and workshop cards. Selected and refined through four mockups.
- Copy Coursera wholesale: rejected; unrelated promotions, branding and online-course features do not fit local workshops.

## Approved visual/content requirements
- Keep Manrope and the existing Clay Studio tokens: clay `#AD4B34`, ink `#193847`, porcelain `#FAF7F2`, teal `#1D6D72`, sand `#EDE3D9`, white cards.
- Hero: “Learn a local craft.” / “In-person workshops with Sorsogon artisans.” / “Search workshops” / “Search”.
- Search fills its column; approximately 24px separates it from the layered artwork.
- Two distinct craft scenes, rounded clipped edges, subtle shadows, no white frames. Keep artwork hidden at 700px and below, as in the approved mockup.
- “Upcoming workshops”: all four sample workshops, four columns on wide desktop, two on tablet, one on small phones. Compact craft artwork and readable title, instructor, town, level, complete date/time, fee and availability; one workshop-detail link.
- All-crafts and individual-craft controls; a Filters popup for town and skill level; count, clear action and useful empty state.
- Replace long marketing/story sections with “Find a workshop”, “Reserve a seat”, “Learn in person”.
- Trim shared header/footer copy and spacing to the preview while retaining navigation destinations, mobile navigation, project credit and the demo/sample-data notice.
- Subtle 150–200ms color/shadow/disclosure feedback; no autoplay, scroll choreography or layout-shifting hover effects. Respect reduced motion and visible keyboard focus.

## Implementation calls
- Keep Home filtering in place, as in the mockup, but store its query/craft/town/level in validated URL search parameters. Reuse `filterWorkshops`; Home ignores Discover-only schedule/cost parameters.
- Extract Discover's existing search validation for reuse without changing its semantics or presentation.
- Add a catalog presentation to the existing `WorkshopCard`; keep its default Discover presentation intact. Reuse existing craft icons and fee/availability helpers rather than duplicate workshop facts.
- Use existing form/popover components; normal internal links stay in the current tab. Mockup review controls, localhost links and preview notices are not shipped.

## Constraints and non-goals
- Frontend-only prototype: all content comes from hardcoded sample data in `src/data/sample.ts`; no server functions, database or auth, because the brief forbids a backend.
- No new dependencies, paid assets, schema changes, generated-file edits, or changes to demo-store/localStorage behavior.
- Do not redesign Discover, booking, instructor, admin or badge screens. Only shared header/footer cosmetics may carry across screens.
- Preserve the existing dirty working tree and untracked lockfile. No commit or push is planned.

## Acceptance
The actual Home matches the approved direction; search/filter/clear/back navigation works; free/full states and workshop links remain accurate; Discover and booking retain existing behavior; responsive, keyboard and reduced-motion checks pass alongside tests, TypeScript and production build.
