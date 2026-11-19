# kamotgibo — MVP demo

## Production status

**Prompt prepared. Not submitted. No new video rendered.**

Higgsfield MCP video tools are not exposed in this session. Model availability, input schemas, supported duration, cost and account access have not been verified. Do not submit a generation merely to test access, invent media identifiers, or silently substitute a local renderer.

- Intended output: `kamotgibo.mp4`.
- Proposed delivery: 60 seconds, 1920×1080, 16:9, 30 fps, H.264 MP4. These are delivery targets, not verified native model capabilities.
- Audio: silent; no audio track, narration, music or effects. This preserves the previous demo brief.
- Text: application text only; no added captions, subtitles or title cards. The filename is lowercase `kamotgibo`; preserve the app's existing KamotGibo branding.
- Intended route: one complete-film Higgsfield request, preferring a suitable accessible Seedance model after inspecting its actual schema. If 60 seconds or source-media preservation is unsupported, explain the constraint and agree on a different route rather than silently splitting the film into jobs.
- Submission/job ID, actual settings, attachment identifiers, cost and result: none.

## Viewer takeaway and scope

KamotGibo connects learners with Sorsogon artisans: find a local workshop, reserve a seat, have attendance and practical skills checked by the artisan, and see a sample platform badge in My learning.

Follow one coherent fictional journey: Mika books Nanay Rosa's Shell Jewelry Basics workshop in Gubat. Show the action and its visible consequence at every step. Prioritize this end-to-end MVP over an inventory of every page. Upskilling is a short secondary glimpse; omit full profile editing, provider application forms, admin approval and workshop creation from this cut rather than rush the main story.

This is a frontend-only prototype with browser-local state and sample people/workshops. Do not invent authentication, private accounts, server persistence, real reservations, in-app payments or formal qualifications. Demonstrating the session controls is not evidence that an in-person workshop has actually happened. Badge issuance is demonstrated only for Shell Jewelry Basics.

## Existing sources and asset plan

Verified against:

- `src/data/sample.ts`: sample workshops, people, booking reference, badge and eligibility rule.
- `src/lib/demo-store.ts`: browser-local booking, roster and badge state.
- `src/routes/index.tsx`, `learn.tsx`, `discover.tsx`, `workshops.$id.tsx`, `book.$id.tsx`, `learning.tsx`, `teach.session.tsx`, `badges.$code.tsx`, `learner.upskilling.index.tsx`.
- `src/components/kg/SiteChrome.tsx` and `src/styles.css`: portal navigation and brand system.
- `docs/superpowers/specs/2026-11-19-silent-video-demo-design.md` and `2026-11-19-cinematic-video-demo-design.md`: inherited silence, one-minute duration and restrained motion treatment.

Existing asset candidates:

- `kamotgibo-demo-cinematic.mp4`: existing walkthrough, available as a candidate product-content reference; not played or inspected in this session. This is not an instruction to preserve its sequence or timing.
- `src/assets/kamotgibo-logo.png`: existing product identity.
- `src/assets/hero-craft-table.jpg`: existing craft imagery, only if needed by the selected endpoint.

No new generated images are needed. Inspect the available footage and the chosen endpoint's reference roles before selecting the minimum actual UI references. Prefer source-media preservation where supported. A model-conditioned recreation is not an untouched screen recording and must not be described as one. Exact UI text and geometry are not guaranteed by conditioning alone.

These local paths are an asset plan, not remote attachments. No asset has been uploaded or bound. Production must use the supported upload mechanism and record real returned identifiers. Never submit unresolved reference placeholders.

## Complete creative prompt

```text
Create a 60-second, 16:9 silent product-demo film for KamotGibo, a frontend-only prototype connecting learners with local Sorsogon craft artisans. Tell one clear story through the existing app interface: Mika finds Nanay Rosa's shellcraft workshop, reserves a seat, and receives a sample platform badge only after the artisan records attendance and a skill pass. The film should make the MVP understandable through visible actions and results, not decorative software panels.

design world:
Use the application's Clay Studio identity: warm porcelain #FAF7F2 as the main surface, deep ink #193847 for text and the restrained studio surround, clay #AD4B34 for primary actions, and teal #1D6D72 for navigation and the badge. Use the existing Manrope typography, craft artwork, logo, rounded cards and portal layout. Keep the application recognizable and readable. Do not redesign it, invent controls or add floating marketing dashboards. Present the app in a lightly elevated rounded window with a quiet, soft-lit surround. Preserve the actual interface's sample/demo labels and qualification caveats.

motion rules:
All movement serves an interaction. Establish the page before moving toward a control. Use smooth, gently eased push-ins no larger than needed for reading; settle the camera before important text appears. Follow one small pointer and use a single restrained click pulse. Clicks must land on visible controls and cause the correct result. At route changes, use a short, controlled directional transition, then stop moving for the result hold. Do not morph one page's text into another, orbit the interface, skew readable panels, obscure state changes with motion blur, or use perpetual zooms. The same fictional learner, workshop, booking reference and badge must remain consistent throughout.

00:00–00:04 — Establish the product and enter as a learner.
Open on the real landing-page composition with its existing KamotGibo logo, craft imagery and learner/artisan choices. Begin nearly still. Move the pointer to “I'm a learner” and activate it. Land briefly on the learner dashboard so the role choice has a visible consequence. Do not add an opening title card.

00:04–00:13 — Find a relevant local workshop.
Activate “Discover” in the learner navigation. Show “Learn a local craft.” and the upcoming workshop cards. Select the “Shellcraft” craft filter. Open “Filters”, choose “Gubat”, and close the popover. Keep the active filter and matching result readable before opening “Shell Jewelry Basics: Make Your First Buskay Bracelet”. Use the filter-to-result change as the visual connection; do not substitute a generic search animation.

00:13–00:23 — Understand the workshop and reserve a seat.
Show the actual workshop details: Nanay Rosa (sample), Gubat, Beginner, PHP 300, and the materials/preparation information. Keep the fee with its pay-at-the-venue context; never show a checkout or online payment. Guide the eye to “Book a seat” and activate it. The confirmation must clearly say “Your seat is reserved” and display booking reference “BK-GUB-1121” for Mika. Hold the confirmation and reference fully readable for at least the final three seconds of this phase. Do not invent a booking form that the prototype does not have.

00:23–00:28 — Show the learner-side result.
Activate “Go to My learning”. Show the new workshop under “Upcoming bookings” with the same reference. Briefly establish that the shellcraft badge is still locked or unearned: booking alone must not award it. Retain the visible browser-local demo notice. Make this a calm result hold, not a rapid tour of unrelated cards.

00:28–00:34 — Hand off to the artisan's workspace.
Make a clear editorial cut to the existing artisan portal for Nanay Rosa; this is a role-switching demo, not a login sequence. Show “Bookings & attendance” and open the booked shellcraft session. Establish “Instructor view”, the same workshop, and Mika's roster entry. Keep enough portal context visible that the viewer understands whose controls these are. Do not invent a learner-to-artisan navigation button.

00:34–00:44 — Demonstrate the MVP's practical verification rule.
Focus on Mika's roster row. First show that “Issue badge” is disabled. Activate “Mark present”; the row changes to “Present”. Select “Pass” for the practical skill check. Only then show “Issue badge” becoming available and activate it. Hold the resulting “Badge issued to Mika” confirmation for two seconds. Keep the sequence causal and unambiguous: attendance, then skill pass, then issuance. Do not show the badge being earned by payment, booking alone or an automated online test.

00:44–00:53 — Resolve the learner's story with the earned badge.
Cut back to the learner's “My learning” page in the same browser-local demo state. Show the unlocked badge and open it. Settle into a readable close view of “Shellcraft: Basic Stringing”, “Platform skill-verified”, “Issued to Mika”, and verification code “KG-4F7A-21”. Show Nanay Rosa as the sample issuer. Preserve the actual page's explanation that this is a KamotGibo platform badge, not a formal qualification. Give the badge a steady reading hold; no confetti, invented accreditation marks or success claims.

00:53–00:57 — Glimpse the next learning step.
Briefly show the existing “Upskilling” page as a secondary next step, preserving its qualification-reference and certification limitations. Do not invent a new course, external enrollment, certification award, job placement or guaranteed progression. Avoid introducing another detailed workflow in this short interval.

00:57–01:00 — Finish on the product.
Return to the actual public landing page through a clean editorial cut. Gently settle to the established full app window with the existing logo and craft imagery. Freeze the final two seconds for a deliberate, readable ending. No new headline, URL, title card, watermark, end slate or extra text. Finish exactly at 60 seconds.

overall_soundscape:
Complete silence. No narration, speech, interface sounds, ambient sound or sound effects. No audio track in the final delivery.

non_diegetic_music:
None.

content integrity:
Keep the app's existing English and local-language copy intact. All people, bookings, dates and codes shown are fictional sample data from the prototype. Preserve sample labels. No backend, authentication, private-account protection, in-app payments or formal qualification is being demonstrated. Do not show source code, loading failures, browser errors or inaccessible screens. The output is a new demo film, not merely the old video renamed.
```

## Exact-copy inventory

Use these spellings where each appears; do not add them as separate captions:

- KamotGibo
- I'm a learner
- Discover
- Learn a local craft.
- Shellcraft
- Filters
- Gubat
- Shell Jewelry Basics: Make Your First Buskay Bracelet
- Nanay Rosa (sample)
- Beginner
- PHP 300
- Book a seat
- Your seat is reserved
- BK-GUB-1121
- Go to My learning
- My learning
- Upcoming bookings
- Bookings & attendance
- Instructor view
- Mika
- Mark present
- Present
- Pass
- Issue badge
- Badge issued to Mika
- Shellcraft: Basic Stringing
- Platform skill-verified
- Issued to Mika
- KG-4F7A-21
- Upskilling

## Review and remaining work

- [x] Establish the MVP takeaway and a single action-to-result story.
- [x] Verify critical labels, sample data, badge prerequisites and prototype limits in source.
- [x] Prepare one continuous 60-second prompt and exact-copy inventory.
- [x] Preserve the prior silence/no-added-captions brief and existing video.
- [ ] Connect Higgsfield and inspect the actual model schema, access and estimate.
- [ ] Inspect source footage; select and bind only supported, necessary references.
- [ ] Submit one complete-film job and save the exact request, settings and job record.
- [ ] Watch the full result; separately verify communication, temporal continuity and motion.
- [ ] Verify every important text hold, prerequisite transition and prototype disclaimer.
- [ ] Verify duration, dimensions, fps, codec, silence and final hold on the actual export.
- [ ] If needed, make at most one authorized full-film correction or supported targeted edit, retaining the first result.
- [ ] Deliver the inspected new `kamotgibo.mp4`, or report the remaining limitation.

No generation cost has been incurred. No result can be marked reviewed or passing before a real film exists.
