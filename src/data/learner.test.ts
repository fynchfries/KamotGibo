import { describe, expect, it } from "vitest";
import { BADGE, WORKSHOPS, bookingRef, milestones, prepNotes } from "./sample";

const shell = WORKSHOPS.find((w) => w.id === "shell-jewelry-basics")!;
const abaca = WORKSHOPS.find((w) => w.id === "abaca-weaving-101")!;

describe("booking confirmation", () => {
  it("paid workshops say Pay at the venue", () => {
    expect(prepNotes(shell)).toContain("Bring PHP 300 in cash. Pay at the venue.");
  });

  it("free workshops never ask for payment", () => {
    expect(prepNotes(abaca).some((n) => n.includes("Pay at the venue"))).toBe(false);
  });

  it("prep notes tell the learner to bring their own apron", () => {
    expect(prepNotes(shell)).toContain("Bring your own apron.");
  });

  it("shell workshop has its own booking reference", () => {
    expect(bookingRef(shell)).toBe("BK-GUB-1121");
  });
});

describe("Mika's badge", () => {
  it("uses the brief's verification code and issuer", () => {
    expect(BADGE.code).toBe("KG-4F7A-21");
    expect(BADGE.issuedBy).toBe("Nanay Rosa (sample)");
  });

  it("skill-check milestone stays open until the badge is issued", () => {
    const before = milestones({ booked: ["shell-jewelry-basics"], badgeIssued: false });
    const after = milestones({ booked: ["shell-jewelry-basics"], badgeIssued: true });
    expect(before.find((m) => m.label === "Passed your first skill check")!.done).toBe(false);
    expect(after.find((m) => m.label === "Passed your first skill check")!.done).toBe(true);
  });
});
