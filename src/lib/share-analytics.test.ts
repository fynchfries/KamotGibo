import { beforeEach, describe, expect, it, vi } from "vitest";
import { getShareCounts, recordShareAction } from "./share-analytics";

const KEY = "kamotgibo-share-counts-v1";
beforeEach(() => {
  vi.restoreAllMocks();
  localStorage.clear();
});

describe("browser-local share action counts", () => {
  it("counts action types by public workshop without personal data or conversion claims", () => {
    recordShareAction("shell-jewelry-basics", "share_opened");
    recordShareAction("shell-jewelry-basics", "share_opened");
    recordShareAction("shell-jewelry-basics", "link_copied");
    recordShareAction("abaca-weaving-101", "facebook_selected");
    expect(getShareCounts()["shell-jewelry-basics"]).toEqual({
      share_opened: 2,
      facebook_selected: 0,
      native_share_used: 0,
      link_copied: 1,
    });
    expect(getShareCounts()["abaca-weaving-101"]?.facebook_selected).toBe(1);
    expect(localStorage.getItem(KEY)).not.toMatch(/email|userId|timestamp|posted|booking/i);
  });

  it("does not count private/browser-only IDs", () => {
    recordShareAction("workshop-local-only", "share_opened");
    expect(localStorage.getItem(KEY)).toBeNull();
  });

  it("does not alter saved bookings or profiles", () => {
    localStorage.setItem("kamotgibo-demo-v1", '{"booked":["abaca-weaving-101"]}');
    localStorage.setItem("kamotgibo-learner-profile-v1", '{"fullName":"Alex Sample"}');
    recordShareAction("abaca-weaving-101", "native_share_used");
    expect(localStorage.getItem("kamotgibo-demo-v1")).toBe('{"booked":["abaca-weaving-101"]}');
    expect(localStorage.getItem("kamotgibo-learner-profile-v1")).toBe('{"fullName":"Alex Sample"}');
  });

  it("recovers from corrupt storage and drops unknown/private fields", () => {
    localStorage.setItem(KEY, "{broken");
    expect(getShareCounts()).toEqual({});
    localStorage.setItem(
      KEY,
      JSON.stringify({
        "shell-jewelry-basics": {
          share_opened: -1,
          link_copied: "bad",
          email: "private@example.test",
        },
        "workshop-local": { share_opened: 9 },
      }),
    );
    recordShareAction("shell-jewelry-basics", "link_copied");
    expect(getShareCounts()["shell-jewelry-basics"]?.link_copied).toBe(1);
    expect(localStorage.getItem(KEY)).not.toContain("email");
    expect(localStorage.getItem(KEY)).not.toContain("workshop-local");
  });

  it("never interrupts sharing when storage is blocked or full", () => {
    vi.spyOn(Storage.prototype, "getItem").mockImplementation(() => {
      throw new DOMException("Blocked", "SecurityError");
    });
    vi.spyOn(Storage.prototype, "setItem").mockImplementation(() => {
      throw new DOMException("Full", "QuotaExceededError");
    });
    expect(() => recordShareAction("abaca-weaving-101", "share_opened")).not.toThrow();
  });

  it("keeps counters finite at the safe-integer boundary", () => {
    localStorage.setItem(
      KEY,
      JSON.stringify({ "shell-jewelry-basics": { share_opened: Number.MAX_SAFE_INTEGER } }),
    );
    recordShareAction("shell-jewelry-basics", "share_opened");
    expect(getShareCounts()["shell-jewelry-basics"]?.share_opened).toBe(Number.MAX_SAFE_INTEGER);
  });
});
