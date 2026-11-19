import { act, cleanup, renderHook } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";

const application = {
  name: "Aling May (demo)",
  kind: "Artisan" as const,
  craft: "Shellcraft" as const,
  town: "Gubat" as const,
  venue: "Demo craft studio, Gubat",
  workshop: "Shell Keychains",
};
const workshop = {
  title: "Shell Keychains",
  craft: "Shellcraft" as const,
  town: "Gubat" as const,
  level: "Beginner" as const,
  venue: "Demo craft studio, Gubat",
  venueNote: "Blue gate",
  date: "2026-11-28",
  startTime: "09:00",
  endTime: "12:00",
  capacity: 1,
  fee: 150,
  learn: "Choose shells\nString a keychain",
  providedMaterials: "Shells\nThread",
  bringMaterials: "Apron",
};
let store: typeof import("./demo-store");

beforeEach(async () => {
  cleanup();
  localStorage.clear();
  vi.resetModules();
  store = await import("./demo-store");
});

function snapshot() {
  return renderHook(() => store.useDemoProgress()).result;
}
function publish() {
  let id = "";
  act(() => {
    id = store.demoActions.createWorkshop("nanay-rosa", workshop);
  });
  act(() => {
    store.demoActions.publishWorkshop(id);
  });
  return id;
}

describe("artisan lifecycle", () => {
  it("keeps an application pending and its draft private until admin approval", () => {
    const state = snapshot();
    let provider = "",
      id = "";
    act(() => {
      provider = store.demoActions.submitApplication(application);
      id = store.demoActions.createWorkshop(provider, workshop);
    });
    expect(store.getProviders(state.current).find((p) => p.id === provider)?.status).toBe(
      "Pending",
    );
    expect(store.demoActions.publishWorkshop(id)).toBe(false);
    expect(store.getWorkshops(state.current).some((w) => w.id === id)).toBe(false);
    act(() => {
      store.demoActions.approveProvider(provider);
    });
    act(() => {
      expect(store.demoActions.publishWorkshop(id)).toBe(true);
    });
    expect(store.getWorkshops(state.current).find((w) => w.id === id)).toMatchObject({
      title: "Shell Keychains",
      seatsLeft: 1,
      capacity: 1,
      instructor: "Aling May (demo)",
      day: "Sat",
      time: "9:00 AM – 12:00 PM",
      materials: [
        { item: "Shells", status: "Provided" },
        { item: "Thread", status: "Provided" },
        { item: "Apron", status: "Bring your own" },
      ],
    });
  });

  it("rejects missing provider details and invalid workshop boundaries", () => {
    expect(() => store.demoActions.submitApplication({ ...application, name: "   " })).toThrow();
    for (const patch of [
      { capacity: 0 },
      { capacity: 1.5 },
      { fee: -1 },
      { fee: Infinity },
      { date: "2026-02-30" },
      { endTime: "08:00" },
      { title: "   " },
      { learn: "\n " },
    ]) {
      expect(() =>
        store.demoActions.createWorkshop("nanay-rosa", { ...workshop, ...patch }),
      ).toThrow();
    }
    expect(() => store.demoActions.createWorkshop("missing", workshop)).toThrow();
  });

  it("books the final seat exactly once and rejects unknown, full, and draft sessions", () => {
    const state = snapshot();
    let draft = "";
    act(() => {
      draft = store.demoActions.createWorkshop("nanay-rosa", workshop);
    });
    expect(store.demoActions.book(draft)).toBe(false);
    expect(store.demoActions.book("missing")).toBe(false);
    expect(store.demoActions.book("clay-pottery-starter")).toBe(false);
    const id = publish();
    act(() => {
      expect(store.demoActions.book(id)).toBe(true);
    });
    act(() => {
      expect(store.demoActions.book(id)).toBe(true);
    });
    expect(state.current.booked).toEqual([id]);
    expect(store.getWorkshops(state.current).find((w) => w.id === id)?.seatsLeft).toBe(0);
    expect(store.getRoster(state.current, id)).toEqual([
      expect.objectContaining({ id: "mika", name: "Mika" }),
    ]);
  });

  it("adds Mika to the seed roster only when booked and never mutates seed seats", () => {
    const state = snapshot();
    expect(store.getRoster(state.current, "shell-jewelry-basics")).toHaveLength(6);
    expect(
      store.getRoster(state.current, "shell-jewelry-basics").some((r) => r.id === "mika"),
    ).toBe(false);
    act(() => {
      store.demoActions.book("shell-jewelry-basics");
    });
    expect(store.getRoster(state.current, "shell-jewelry-basics")).toHaveLength(7);
    expect(
      store.getWorkshops(state.current).find((w) => w.id === "shell-jewelry-basics")?.seatsLeft,
    ).toBe(3);
    act(() => {
      store.demoActions.reset();
    });
    expect(
      store.getWorkshops(state.current).find((w) => w.id === "shell-jewelry-basics")?.seatsLeft,
    ).toBe(4);
  });

  it("scopes attendance and skills to a session and prevents passing an absent learner", () => {
    const state = snapshot();
    const id = publish();
    act(() => {
      store.demoActions.book(id);
      store.demoActions.book("shell-jewelry-basics");
    });
    act(() => {
      store.demoActions.markLearner(id, "mika", { skill: "pass" });
    });
    expect(store.getRosterMark(state.current, id, "mika").skill).toBeNull();
    act(() => {
      store.demoActions.markLearner(id, "mika", { present: true });
    });
    act(() => {
      store.demoActions.markLearner(id, "mika", { skill: "pass" });
    });
    expect(store.getRosterMark(state.current, id, "mika")).toMatchObject({
      present: true,
      skill: "pass",
    });
    expect(store.getRosterMark(state.current, "shell-jewelry-basics", "mika").present).toBe(false);
    act(() => {
      store.demoActions.markLearner(id, "mika", { present: false });
    });
    expect(store.getRosterMark(state.current, id, "mika").skill).toBeNull();
  });

  it("only issues the sample badge after a booked shellcraft learner attends and passes", () => {
    const state = snapshot();
    act(() => {
      store.demoActions.issueBadge();
    });
    expect(state.current.badgeIssued).toBe(false);
    act(() => {
      store.demoActions.book("shell-jewelry-basics");
    });
    act(() => {
      store.demoActions.markLearner("shell-jewelry-basics", "mika", { present: true });
    });
    act(() => {
      store.demoActions.issueBadge();
    });
    expect(state.current.badgeIssued).toBe(false);
    act(() => {
      store.demoActions.markLearner("shell-jewelry-basics", "mika", { skill: "pass" });
    });
    act(() => {
      store.demoActions.issueBadge();
    });
    expect(state.current.badgeIssued).toBe(true);
    expect(store.getRosterMark(state.current, "shell-jewelry-basics", "mika").issued).toBe(true);
    const id = publish();
    act(() => {
      store.demoActions.book(id);
    });
    act(() => {
      store.demoActions.markLearner(id, "mika", { present: true, skill: "pass" });
    });
    act(() => {
      expect(store.demoActions.issueBadge(id, "mika")).toBe(false);
    });
  });

  it("restores published workshops, bookings, and marks after reloading the module", async () => {
    const id = publish();
    act(() => {
      store.demoActions.book(id);
    });
    act(() => {
      store.demoActions.markLearner(id, "mika", { present: true, skill: "pass" });
    });
    cleanup();
    vi.resetModules();
    store = await import("./demo-store");
    const state = snapshot();
    expect(store.getWorkshops(state.current).find((w) => w.id === id)?.seatsLeft).toBe(0);
    expect(store.getRosterMark(state.current, id, "mika")).toMatchObject({
      present: true,
      skill: "pass",
    });
  });

  it("preserves legacy progress and normalizes malformed optional storage fields", () => {
    localStorage.setItem(
      "kamotgibo-demo-v1",
      JSON.stringify({
        booked: ["abaca-weaving-101"],
        badgeIssued: true,
        approvedProviders: ["bulan-shell-collective"],
        applications: "broken",
        workshops: [{}],
        marks: null,
      }),
    );
    const state = snapshot();
    expect(state.current.booked).toContain("abaca-weaving-101");
    expect(state.current.booked).toContain("shell-jewelry-basics");
    expect(state.current.badgeIssued).toBe(true);
    expect(state.current.approvedProviders).toEqual(["bulan-shell-collective"]);
    expect(store.getWorkshops(state.current)).toHaveLength(4);
    expect(store.getRosterMark(state.current, "shell-jewelry-basics", "mika").issued).toBe(true);
  });

  it.each(["not JSON", "null", '{"booked":42,"approvedProviders":{},"badgeIssued":"yes"}'])(
    "recovers safely from invalid stored state: %s",
    (raw) => {
      localStorage.setItem("kamotgibo-demo-v1", raw);
      const state = snapshot();
      expect(state.current.booked).toEqual([]);
      expect(state.current.badgeIssued).toBe(false);
      expect(store.getWorkshops(state.current)).toHaveLength(4);
    },
  );
});
