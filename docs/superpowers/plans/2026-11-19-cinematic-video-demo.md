# Cinematic Demo Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Export a cinematic revision of the same silent one-minute walkthrough as `kamotgibo-demo-cinematic.mp4`.

**Architecture:** Reuse the original timestamped full-HD captures without retiming or reordering. Render eased camera moves, rounded-window composition and short route transitions with Core Image, then encode with AVFoundation. Keep temporary scripts/renders in `/tmp/kamotgibo-cinematic-demo/`.

**Tech Stack:** Existing Swift, Core Image/Metal and AVFoundation; no dependency installs or application edits.

**Spec:** `docs/superpowers/specs/2026-11-19-cinematic-video-demo-design.md`

## Global Constraints
- Exactly 60 seconds, 1920×1080, 30 fps, H.264 MP4.
- Preserve the existing 38-action sequence, source timing, and ordering.
- No captions, voiceover, music, audio/subtitle tracks, or added text.
- Retain the original `kamotgibo-demo.mp4`; do not change app files or commit/push.

## Review Focus
- Excessive or offscreen zoom: bound geometry and inspect enlarged controls/results.
- Abrupt motion: use continuous easing and inspect transition samples.
- Lost steps: assert all 38 original actions remain ordered and the source time is unchanged.
- Wrong export properties: reuse the native acceptance verifier for duration, dimensions, codec, fps and track count.
- Unrelated changes: compare fresh app/original-video hashes before delivery.

### Task 1: Design and preview the motion pass
**Files:** Temporary motion timeline, renderer and preview images in `/tmp/kamotgibo-cinematic-demo/`.
**Interfaces:** Original capture manifest → validated camera keyframes/route transitions → composited preview frames.
- [x] Verify the original captures, action order and preservation baseline.
- [x] Run the output acceptance check before the new file exists (expected failure: missing video).
- [x] Build the motion timeline and assert interpolation, bounds and source-time continuity.
- [x] Render and visually inspect key click/transition/result frames; adjust any obscured focal areas.

### Task 2: Export and verify
**Files:** Create `kamotgibo-demo-cinematic.mp4`; preserve the original MP4.
**Interfaces:** Validated motion timeline + original captures → 1,800-frame cinematic MP4.
- [x] Render all frames at 30 fps with no audio/subtitles.
- [x] Verify the finished file and inspect decoded frames, including transitions and the final frame.
- [x] Verify all original app/video hashes; record the self-review and final artifact details.

## Execution notes
Artifact-only native execution: no application worktree, browser session, dependency installation, commit or independent subagent is required. The user's requested visual revision delegates the motion treatment; preserve the approved walkthrough and silence rather than introducing another concept or reshooting.

## Completion evidence
- Output: `kamotgibo-demo-cinematic.mp4`, 72,243,327 bytes (72.2 MB).
- Verified: exactly 60.0 seconds, 1920×1080, H.264, 30 fps, one video track, zero audio/subtitle tracks.
- Decoded all 1,800 output frames; verified exact timestamps/dimensions and no detected blank/black frames.
- Motion: 67 eased camera keys, 15 route transitions; bounded geometry checked at all 1,801 timeline samples.
- All 38 original actions, order and timing preserved; original source manifest hash verified.
- Self-reviewed close-up/result/transition previews and decoded output frames, including the last frame. Reduced non-transition blur and improved the badge-result framing/read hold after preview review.
- All 132 baseline app/original-video hashes unchanged; original MP4 retained. No application tests rerun, dependencies installed, commits or pushes made.

