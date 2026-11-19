import { beforeEach, describe, expect, it } from "vitest";
import { QUALIFICATIONS, WORKSHOPS } from "@/data/sample";
import { DEFAULT_PROGRESS, getWorkshops, type DemoState } from "./demo-store";
import { getRelatedActivities, getRelatedLearning, getRelatedWorkshops } from "./upskilling";

beforeEach(() => localStorage.clear());
const qualification = () => QUALIFICATIONS[0]!;
const competency = () => qualification().competencies[1]!;
const catalogue = () => getWorkshops(DEFAULT_PROGRESS);

function progress(marks: DemoState["marks"] = {}, booked: string[] = []): DemoState {
  return { ...DEFAULT_PROGRESS, marks, booked };
}

describe("upskilling curriculum relationships", () => {
  it("resolves existing workshop outcomes and deduplicates workshops across competencies", () => {
    expect(getRelatedWorkshops(qualification(), catalogue()).map((w) => w.id)).toEqual([
      "abaca-weaving-101",
      "rattan-basketry",
    ]);
    expect(
      getRelatedActivities(competency(), catalogue()).map(({ activity }) => activity.outcome),
    ).toEqual(["Plain weave on a small frame", "Build a sturdy base", "Weave and finish the rim"]);
  });

  it("does not recommend an unmapped workshop just because its craft matches", () => {
    const workshops = [
      ...catalogue(),
      { ...WORKSHOPS[1]!, id: "unmapped-weaving", title: "Another weaving workshop" },
    ];
    expect(getRelatedWorkshops(qualification(), workshops).map((w) => w.id)).toEqual([
      "abaca-weaving-101",
      "rattan-basketry",
    ]);
  });

  it("omits missing workshops instead of fabricating recommendations", () => {
    expect(getRelatedWorkshops(qualification(), [WORKSHOPS[1]!]).map((w) => w.id)).toEqual([
      "abaca-weaving-101",
    ]);
    expect(getRelatedWorkshops(qualification(), [])).toEqual([]);
  });

  it("stops mapping a workshop outcome that has changed", () => {
    const changed = catalogue().map((w) =>
      w.id === "abaca-weaving-101" ? { ...w, learn: ["Unrelated outcome"] } : w,
    );
    expect(getRelatedWorkshops(qualification(), changed).map((w) => w.id)).toEqual([
      "rattan-basketry",
    ]);
  });

  it("handles missing curriculum IDs safely", () => {
    expect(
      getRelatedActivities({ ...competency(), activityIds: ["removed-activity"] }, catalogue()),
    ).toEqual([]);
  });

  it("supports a second qualification without hard-coded qualification IDs", () => {
    const second = {
      ...qualification(),
      id: "another-pathway",
      title: "Another qualification",
      competencies: [qualification().competencies[2]!],
    };
    expect(getRelatedWorkshops(second, catalogue()).map((w) => w.id)).toEqual([
      "abaca-weaving-101",
      "rattan-basketry",
    ]);
  });
});

describe("related KamotGibo evidence", () => {
  it("reports past attendance and a not-yet check without inventing completion", () => {
    expect(getRelatedLearning(competency(), catalogue(), progress())).toEqual({
      attended: 1,
      passed: 0,
      notYet: 1,
      booked: 0,
    });
  });

  it("does not treat an unrelated Shellcraft badge as weaving evidence", () => {
    const state = { ...progress({}, ["shell-jewelry-basics"]), badgeIssued: true };
    expect(getRelatedLearning(competency(), catalogue(), state)).toEqual({
      attended: 1,
      passed: 0,
      notYet: 1,
      booked: 0,
    });
  });

  it("keeps a reservation separate from attendance and a passed skill check", () => {
    expect(
      getRelatedLearning(competency(), catalogue(), progress({}, ["rattan-basketry"])),
    ).toEqual({
      attended: 1,
      passed: 0,
      notYet: 1,
      booked: 1,
    });
  });

  it("counts a passed workshop once even when several mapped activities use it", () => {
    const state = progress(
      { "rattan-basketry": { mika: { present: true, skill: "pass", issued: false } } },
      ["rattan-basketry"],
    );
    expect(getRelatedLearning(competency(), catalogue(), state)).toEqual({
      attended: 2,
      passed: 1,
      notYet: 1,
      booked: 0,
    });
  });

  it("reports a recorded not-yet assessment without calling it a pass", () => {
    const state = progress({
      "rattan-basketry": { mika: { present: true, skill: "not-yet", issued: false } },
    });
    expect(getRelatedLearning(competency(), catalogue(), state)).toEqual({
      attended: 2,
      passed: 0,
      notYet: 2,
      booked: 0,
    });
  });

  it("does not erase past attendance when a later session is marked absent", () => {
    const state = progress({
      "abaca-weaving-101": { mika: { present: false, skill: null, issued: false } },
    });
    expect(getRelatedLearning(competency(), catalogue(), state)).toEqual({
      attended: 1,
      passed: 0,
      notYet: 1,
      booked: 0,
    });
  });

  it("shows no evidence for missing relationships and ignores stale bookings", () => {
    expect(
      getRelatedLearning(
        { ...competency(), activityIds: ["removed"] },
        catalogue(),
        progress({}, ["missing-workshop"]),
      ),
    ).toEqual({
      attended: 0,
      passed: 0,
      notYet: 0,
      booked: 0,
    });
  });

  it("does not mutate progress or browser storage when deriving relationships", () => {
    const state = progress({}, ["rattan-basketry"]);
    const before = JSON.stringify(state);
    localStorage.setItem("kamotgibo-demo-v1", before);
    getRelatedLearning(competency(), catalogue(), state);
    expect(JSON.stringify(state)).toBe(before);
    expect(localStorage.getItem("kamotgibo-demo-v1")).toBe(before);
  });
});
