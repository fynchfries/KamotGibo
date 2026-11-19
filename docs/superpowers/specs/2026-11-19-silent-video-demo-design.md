# Silent one-minute MVP demo

## Intent and constraints
Create `kamotgibo-demo.mp4` in the project root: a 60-second, 1920×1080 walkthrough of the current KamotGibo prototype. The user specified no captions or voice audio; use no audio tracks, music, title cards, added labels, or subtitles. Existing application text remains visible. Do not modify application code, dependencies, the user's browser state, or existing uncommitted work.

## Approach
Record actual browser interactions with an isolated Chrome profile; encode locally to a standard H.264 MP4 using available macOS tools. Prefer screen footage to a slide montage because the request is a functional walkthrough. Narrated/captioned presentation was ruled out by the user. A small pointer is acceptable interaction guidance, not a caption.

## Sequence
- Introduce the landing page and learner portal.
- Discover/filter workshops; view a workshop, share options, and reserve a seat.
- Show the booking and learner progress.
- Show the artisan dashboard, application review and local workshop publishing.
- Mark learner attendance, pass the skill check, issue the sample badge.
- Show the earned badge and upskilling pathway; finish on the platform home.

## Acceptance
Exactly 60 seconds (within one output frame), 1920×1080, H.264 MP4, no audio or subtitle tracks, readable real UI, no error screens, original app files unchanged. Use fictional sample data and do not imply real bookings or formal qualifications. Verify metadata, decode representative frames, and visually inspect them.
