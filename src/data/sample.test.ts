import { describe, expect, it } from "vitest";
import { WORKSHOPS, formatFee, seatsLabel } from "./sample";

describe("sample workshops", () => {
  it("shows the pottery session as Full", () => {
    const pottery = WORKSHOPS.find((w) => w.craft === "Pottery")!;
    expect(seatsLabel(pottery)).toBe("Full");
  });

  it("shows the shell jewelry workshop with 4 of 10 seats left", () => {
    const shell = WORKSHOPS.find((w) => w.id === "shell-jewelry-basics")!;
    expect(seatsLabel(shell)).toBe("4 of 10 seats left");
    expect(formatFee(shell.fee)).toBe("PHP 300");
  });

  it("shows the sponsored abaca workshop as Free", () => {
    const abaca = WORKSHOPS.find((w) => w.craft === "Abaca weaving")!;
    expect(formatFee(abaca.fee)).toBe("Free");
  });
});
