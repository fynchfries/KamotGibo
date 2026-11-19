# Silent Video Demo Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Save a silent, one-minute functional walkthrough as `kamotgibo-demo.mp4` in the project root.

**Architecture:** Capture the existing local app in a fresh headless Chrome profile using CDP. Keep production scripts and intermediate frames outside the repository, then encode the captured frames with native AVFoundation.

**Tech Stack:** Existing Chrome, Node.js built-in WebSocket, Swift/AVFoundation; no added dependencies.

**Spec:** `docs/superpowers/specs/2026-11-19-silent-video-demo-design.md`

## Global Constraints
- Output: `kamotgibo-demo.mp4`, 60 seconds, 1920×1080, H.264 MP4.
- No captions, voiceover, music, added text, audio tracks, or subtitles.
- Preserve application source, dependencies, existing edits, and personal browser storage.
- Temporary production work belongs in `/tmp/kamotgibo-silent-demo/`.

## Review Focus
- Wrong duration: assert duration differs from 60 seconds by at most 1/30 second.
- Unintended sound/subtitles: assert one video track and zero audio/subtitle tracks.
- Capture errors: assert loaded page headings, booking, attendance, badge and publishing results during recording.
- Unreadable or corrupt frames: decode and inspect beginning, middle and ending frames.
- Source/storage damage: compare app hashes; use a new disposable browser profile.

### Task 1: Capture the real walkthrough

**Files:** Create temporary capture script and JPEG frame manifest under `/tmp/kamotgibo-silent-demo/`; no app modifications.

**Interfaces:** Consumes the current local app; produces a timestamped JPEG frame manifest and action assertions.

- [x] Check local app, isolate Chrome, and save source hashes.
- [x] Rehearse interaction selectors and assert expected UI states.
- [x] Capture the walkthrough, preserving natural UI and a visible pointer.
- [x] Assert the manifest spans the walkthrough and each required flow succeeded.

### Task 2: Encode and verify the deliverable

**Files:** Create temporary native encoder/verifier; create `kamotgibo-demo.mp4`.

**Interfaces:** Consumes Task 1's manifest; produces the verified MP4.

- [x] Write and run artifact acceptance checks before the output exists (expected failure: file missing).
- [x] Encode exactly 1,800 frames at 30 fps, without audio/subtitles.
- [x] Run acceptance checks and decode representative frames for visual inspection.
- [x] Compare app hashes and git changes; terminate only the disposable recording browser.

## Execution notes
- Native execution: no subagent tool is available.
- Artifact-only task: use temporary isolated capture files, not a clean git worktree, because the requested demo must show the user's current uncommitted application.
- Do not commit or push: this request is for a local video deliverable, not a code change.

## Completion evidence
- Final file: `kamotgibo-demo.mp4`, 16,929,085 bytes.
- Native AVFoundation verification: 60.0 seconds, 1920×1080, 30 fps, H.264 MP4, exactly one video track; zero audio/subtitle tracks.
- Recording: 810 full-HD UI captures and 38 asserted walkthrough actions; no runtime exceptions.
- Decoded and visually self-reviewed 14 representative output frames (no independent reviewer available).
- All 131 baseline application source/assets hashes are unchanged. No dependencies installed, commits made, or app test suite rerun.
- Disposable recording browser closed; existing application servers and personal browser storage left untouched.
- Recording implementation: native-resolution screenshots were used because Chrome screencast output ignored device pixel ratio. DOM activation of real controls avoided screenshot-induced CDP coordinate scaling; actual application state changes were asserted.

