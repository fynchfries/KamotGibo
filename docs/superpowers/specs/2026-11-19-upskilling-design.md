# Upskilling — approved frontend scope

## Intent

Add a separate next-skills destination to the existing learner portal. My learning remains the current-activity view; Upskilling introduces qualification references, related curriculum, existing workshop recommendations, and recorded KamotGibo learning evidence. The user approved direct implementation of this frontend-only scope after verification.

## Approach and constraints

Extend the existing shared shell, not a redesigned portal. Reuse its spacing, colors, type, rounded cards, Lucide icons, editable header avatar, and `WorkshopCard`. A separate application or merged My learning page would violate the request. A database/admin publishing system is excluded by the current prototype brief; model reusable records and ID relationships in `src/data/sample.ts` instead.

- Frontend only: no backend, authentication, dependencies, database/migrations, or official certification integration.
- Preserve Dashboard, Discover, My learning, artisan/admin pages, all current URLs, saved profile, and demo-store schema/actions.
- No commits or pushes; preserve unrelated dirty/untracked work.
- Generate `src/routeTree.gen.ts` only through Vite tooling.

## Navigation and routes

Learner desktop/mobile order: Dashboard, Discover, My learning, Upskilling. Use the existing Lucide Award icon style and four mobile columns. Both new routes highlight Upskilling; existing workshop/book/badge active states remain unchanged. Public Home and artisan/admin menus remain separate.

Routes: `/learner/upskilling` and `/learner/upskilling/$id`, with a parent Outlet and separate landing/detail components. Invalid IDs show a useful pathway-not-found state linking back.

## Landing page

Reuse the My learning page's outer spacing and avatar/profile-interest treatment without editing My learning. Eyebrow UPSKILLING; heading “Take your craft skills further”; description “Explore skill pathways, microcredentials, and recognized qualifications related to the crafts you are learning.”

Section “Microcredentials & Qualifications”: “Explore recognized skills pathways that can help you continue developing your craft skills.” Render a data-driven qualification card for Artisanal Weaving Level II, TESDA, Creative Sector, Qualification Reference, three core competencies, and the requested short description. View pathway opens the detail; Find related workshops opens that detail's recommended-workshops section.

## Reference terminology

Use “Level II” and Qualification Reference rather than advertising a confirmed NC II training/assessment offering. TESDA's registry lists a Level II competency standard; the PDF cover uses “Level NC II.” Include a note to verify current assessment/certification requirements with TESDA. The detail identifies all three core competencies but does not imply those alone exhaust the qualification's basic/common/core requirements.

Verified official sources (19 November 2026):
- https://www.tesda.gov.ph/Downloadables/CS/CS-Artisanal%20Weaving%20Level%20II.pdf — April 2025 standard, qualification/core list PDF page 5; preparation page 72; safety page 29; glossary page 86.
- https://www.tesda.gov.ph/Download/Competency_Standards/1000?page=2

## Reusable relationships and recommendations

Qualification records contain competency records referencing curriculum-activity IDs. Curriculum activities link to an existing workshop ID and an exact existing learning outcome. Resolve only against `getWorkshops(progress)`, so unpublished/unapproved/stale/missing data is not invented or exposed. Return each matching workshop once and reuse `WorkshopCard variant="catalog"`.

Map existing Abaca Weaving and Rattan Basketry preparation/weaving/finishing outcomes. Rattan is explicitly included in the official standard's glossary. Do not create new workshop records. Keep sample/demo labels visible; these are catalogue records in a prototype, not verified real-world course offerings. Empty/missing/changed mappings show honest empty states.

## Detail page

Header: qualification title, TESDA · Level II · Creative Sector, existing profile/avatar styling. Back link to Upskilling.

Sections:
1. About this pathway: preparation, practical weaving, product quality, finishing, and a pointer to the full basic/common/core standard.
2. Core Competencies: Conduct Pre-Weaving Activities; Perform Artisanal Weaving; Conduct Post-Weaving Activities. Show exact related workshop outcomes and links. These are existing workshop curriculum outcomes, not invented standalone modules.
3. Your related learning, subtitled KamotGibo related learning progress: derive related workshop attendance, passed skill checks, not-yet checks, and bookings from existing past-session evidence and browser demo marks. Never invent per-module completions or declare official qualification competency/progress. An unrelated Shellcraft badge must not count toward weaving.
4. Recommended for this pathway: existing related catalogue cards, or an empty state.
5. Learning references: official standard, glossary, preparation/materials, and safety, all clearly labeled external TESDA PDFs and opened safely in a new tab.
6. About certification: “KamotGibo helps learners discover and prepare for recognized skills pathways. Completion of KamotGibo workshops does not automatically grant TESDA NC II certification.” KamotGibo badges are not TESDA certificates.

## Acceptance and non-goals

Demonstrate navigation/back/direct reload, stable active links in both menus, preserved existing pages/storage, generic second-qualification rendering, missing IDs/mappings, truthful related progress, safe source links, and responsive layouts at phone/tablet/landscape/desktop with enlarged text and reduced motion.

Do not add admin CRUD, a database, an online module player, editable qualification progress, new workshops, or a portal redesign.
