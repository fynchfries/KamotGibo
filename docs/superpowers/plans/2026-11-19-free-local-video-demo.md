# Free Local KamotGibo Demo Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:executing-plans inline. Steps use checkbox syntax for tracking.

**Goal:** Deliver a free, silent, one-minute real-UI demo with the existing cinematic motion and new animated typography.

**Architecture:** Reuse the existing MP4; decode it with AVFoundation, uniformly frame it above a native-rendered chapter strip, and encode one new MP4. No application changes or new dependencies.

**Tech Stack:** Installed Swift, AVFoundation, Core Image/Metal, Core Text and Vision OCR.

**Spec:** `docs/video/kamotgibo-free-demo/brief.md`

## Global Constraints
- Exactly 60 seconds, 1920×1080, 30 fps, H.264 MP4; one video track, no audio/subtitles.
- Preserve the original source and real interactions; no paid calls, trial, purchases, app edits or dependency installs.
- New typography must stay below, not cover, the UI; all final-frame elements freeze at 58 seconds.
- Native artifact-only execution in a dedicated temporary directory; no app worktree, commits or pushes.

## Review Focus
- Wrong duration/fps/tracks: existing native export verifier and full 1,800-frame decode audit.
- Missing/misspelled chapter typography: independent Vision OCR against decoded bottom-strip frames.
- Titles cover controls: assert nonintersecting UI/strip geometry and inspect previews.
- Moving or incorrect ending: compare decoded frames at 58, 58.5, 59 and 59.9667 seconds.
- Source/app damage: compare source SHA-256 and unchanged product-file git diff.

### Task 1: Verify reusable source and prove the typography check
**Files:** Create production brief, chapter cues and typography checker under `docs/video/kamotgibo-free-demo/`.
**Interfaces:** Existing source MP4 → export proof and actual-frame chapter-copy check.
- [x] Run the existing verifier and full decode audit on the source; expect 60s / 1080p / 30fps / H.264 / silent / 1,800 decoded frames.
- [x] Run the independent typography check against the original source; RED confirmed: missing “Craft connects us” at 1.4s in the absent title strip.

### Task 2: Render and verify the smallest typography pass
**Files:** Create `docs/video/kamotgibo-free-demo/render.swift`, scratch render under `/private/tmp/kamotgibo-free-demo/`, and final `kamotgibo-demo-free.mp4`.
**Interfaces:** Verified source + actual-time cues → one new silent MP4 → decoded export/copy/hold proof.
- [x] Implement the native render with geometry/easing/timeline self-checks and no-overwrite guard.
- [x] Render and inspect representative entry, result and role-heading previews; separate bottom strip does not cover the UI.
- [x] Encode all 1,800 frames and freeze the final two seconds on the clean homepage.
- [x] Run the existing export verifier, all-frame audit and independent typography/hold check; all pass, including 9/9 OCR titles and measured entry animation.
- [x] Compare the source hash and product-file diff, then copy the verified result to its final, previously absent path; hashes match and app files are unchanged.
- [x] Save production metadata and a self-review stating that no independent full-motion human review occurred.
