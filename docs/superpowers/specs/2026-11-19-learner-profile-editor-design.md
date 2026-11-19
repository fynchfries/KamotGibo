# Learner header profile editor

## Intent and scope

The user requested a circle in the upper-right corner from which a learner can edit their profile. This is a focused follow-up, not implementation of the separate complete learning-profile specification.

## Approach

Reuse the shared learner header and existing Radix/shadcn dialog, avatar, and form controls. Clicking a circular avatar with a pencil indicator opens Edit profile directly. A dropdown or new route adds unnecessary steps. Public Home, artisan/admin tools, and public badge pages do not receive this learner editor.

## Behavior

- A 44px-or-larger circular button sits at the right of the learner header on desktop and mobile, with an accessible Edit learner profile label and visible keyboard focus.
- The dialog edits profile photo, full name, municipality, short bio, and craft interests, using the existing town/craft choices.
- Full name is required and limited to 80 characters; bio is limited to 300. Photo uploads accept JPEG/PNG/WebP up to 1 MiB; no external photo URLs or SVG uploads.
- Save validates and writes a separate browser-local profile. Cancel, Escape, and closing discard unsaved changes. Failed storage retains the editor and draft and reports an error.
- Saved name/photo appear in the header, learner dashboard identity, and My learning profile; municipality, bio, and interests appear in My learning. Reopening and reloading preserve saved values.
- Existing bookings, attendance, assessments, badge eligibility, and demo-store schema remain unchanged. Existing public badge recipient/metadata are never replaced with editable profile fields.

## Privacy and constraints

- Frontend only: no server, authentication, backend, dependencies, or real privacy guarantee.
- Use fictional defaults from `src/data/sample.ts`. The editor explicitly warns against entering sensitive real information.
- Remove the unsupported Only you can see this page assertion from My learning.
- Preserve existing URLs, unrelated work, generated files, and neutral public landing. No commits or pushes.

## Non-goals

The larger profile expansion, learning modules, new statistics, portfolios, authentication, and artisan profile editing are not part of this small request.
