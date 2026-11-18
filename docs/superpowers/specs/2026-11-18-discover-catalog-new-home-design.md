# Discover Catalog and New Home — Design

## Intent
Move the current compact workshop catalog experience from `/` to `/discover`, and give `/` a separate landing page. This keeps workshop discovery in Discover and preserves a distinct welcome page.

## Selected approach
- **Selected:** Move the catalog layout to `/discover` and make `/` a story-led introduction. This matches the requested separation between discovery and landing.
- **Alternative:** Keep the current Home and only restyle Discover. Rejected because the user chose to move the current layout and create a different Home.

## Design
- `/discover` gets the compact hero, search, craft controls, filter panel, result count, empty state, catalog cards and short three-step row now on Home. Preserve Discover’s existing URL filters, including town, craft, level, schedule and cost, and keep workshop detail links.
- `/` becomes a story-led welcome page using the earlier Home content as a starting point: introduce local crafts, show craft categories, explain how workshops work, and link prominently to `/discover` (with a secondary `/teach` link). Do not duplicate the workshop catalog there.
- Keep the shared header, mobile navigation and footer. Keep all content hardcoded in `src/data/sample.ts` and reuse existing card, filtering and UI components.

## Constraints and non-goals
No backend, auth, database, new dependency, schema change, or changes to booking, learner, instructor, admin or badge flows. Commit the feature locally on `main`; do not push or rewrite history. Preserve unrelated working-tree files.

## Acceptance
Home has a distinct welcome purpose and a clear route to Discover. Discover has the moved catalog design and retains all existing search/filter behavior, URL state, result counts, empty state and workshop links. Existing tests pass, with focused route tests for Home-to-Discover navigation and Discover filtering.

## Approval
Approved by the user on 2026-11-18.
