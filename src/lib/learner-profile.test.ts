import { act, cleanup, renderHook } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";

const KEY = "kamotgibo-learner-profile-v1";
const profile = {
  fullName: "Alex Sample",
  municipality: "Bulan" as const,
  bio: "Practicing basketry.",
  interests: ["Basketry" as const],
  photo: null,
};

beforeEach(() => {
  cleanup();
  vi.restoreAllMocks();
  localStorage.clear();
  vi.resetModules();
});

describe("browser-local learner profile", () => {
  it("normalizes profile text and saves without changing demo progress", async () => {
    const { saveLearnerProfile, useLearnerProfile } = await import("./learner-profile");
    localStorage.setItem("kamotgibo-demo-v1", '{"booked":["shell-jewelry-basics"]}');
    const { result } = renderHook(useLearnerProfile);
    act(() =>
      saveLearnerProfile({
        ...profile,
        fullName: "  Alex Sample  ",
        bio: "  Practicing basketry.  ",
      }),
    );
    expect(result.current.fullName).toBe("Alex Sample");
    expect(result.current.bio).toBe("Practicing basketry.");
    expect(JSON.parse(localStorage.getItem(KEY)!)).toEqual(profile);
    expect(localStorage.getItem("kamotgibo-demo-v1")).toBe('{"booked":["shell-jewelry-basics"]}');
  });

  it("restores saved profile data after a reload", async () => {
    localStorage.setItem(KEY, JSON.stringify(profile));
    const { useLearnerProfile } = await import("./learner-profile");
    expect(renderHook(useLearnerProfile).result.current).toEqual(profile);
  });

  it.each([
    { fullName: "   " },
    { fullName: "a".repeat(81) },
    { municipality: "Unknown town" },
    { interests: ["Unknown craft"] },
    { bio: "a".repeat(301) },
    { photo: "https://example.com/tracking-photo.jpg" },
    { photo: "data:image/svg+xml;base64,PHN2Zz4=" },
  ])("rejects invalid profile fields without overwriting saved data: %j", async (invalid) => {
    localStorage.setItem(KEY, JSON.stringify(profile));
    const { saveLearnerProfile } = await import("./learner-profile");
    expect(() => saveLearnerProfile({ ...profile, ...invalid } as typeof profile)).toThrow();
    expect(JSON.parse(localStorage.getItem(KEY)!)).toEqual(profile);
  });

  it.each(["{broken", JSON.stringify({ ...profile, municipality: "Unknown town" })])(
    "falls back safely from malformed stored data: %s",
    async (raw) => {
      localStorage.setItem(KEY, raw);
      const { useLearnerProfile } = await import("./learner-profile");
      const current = renderHook(useLearnerProfile).result.current;
      expect(current.fullName).toBe("Mika Dela Cruz");
      expect(current.municipality).toBe("Gubat");
      expect(localStorage.getItem(KEY)).toBe(raw);
    },
  );

  it("does not publish unsaved edits when browser storage fails", async () => {
    localStorage.setItem(KEY, JSON.stringify(profile));
    const { saveLearnerProfile, useLearnerProfile } = await import("./learner-profile");
    const { result } = renderHook(useLearnerProfile);
    vi.spyOn(Storage.prototype, "setItem").mockImplementation(() => {
      throw new DOMException("Storage full", "QuotaExceededError");
    });
    expect(() => saveLearnerProfile({ ...profile, fullName: "Unsaved Name" })).toThrow();
    expect(result.current.fullName).toBe("Alex Sample");
    expect(JSON.parse(localStorage.getItem(KEY)!)).toEqual(profile);
  });
});
