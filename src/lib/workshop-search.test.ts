import { describe, expect, it } from "vitest";
import { validateWorkshopSearch } from "./workshop-search";

const empty = {
  q: undefined,
  town: undefined,
  craft: undefined,
  level: undefined,
  when: undefined,
  cost: undefined,
};

describe("validateWorkshopSearch", () => {
  it("keeps supported filters and ignores unrelated query parameters", () => {
    expect(
      validateWorkshopSearch({
        q: "shell",
        town: "Gubat",
        craft: "Shellcraft",
        level: "Beginner",
        when: "weekend",
        cost: "free",
        unrelated: "ignored",
      }),
    ).toEqual({
      q: "shell",
      town: "Gubat",
      craft: "Shellcraft",
      level: "Beginner",
      when: "weekend",
      cost: "free",
    });
  });

  it("rejects invalid enum values rather than hiding every workshop", () => {
    expect(
      validateWorkshopSearch({
        town: "Manila",
        craft: "Painting",
        level: "Expert",
        when: "tomorrow",
        cost: "cheap",
      }),
    ).toEqual(empty);
  });

  it.each([undefined, "", 12, false, ["shell", "clay"], { value: "shell" }])(
    "ignores empty or non-string queries: %j",
    (q) => {
      expect(validateWorkshopSearch({ q })).toEqual(empty);
    },
  );

  it("rejects repeated filter values represented as arrays", () => {
    expect(
      validateWorkshopSearch({
        town: ["Gubat", "Bulan"],
        craft: ["Pottery"],
        level: ["Beginner"],
        when: ["weekday"],
        cost: ["paid"],
      }),
    ).toEqual(empty);
  });

  it("preserves Discover's query and weekday/paid semantics", () => {
    expect(validateWorkshopSearch({ q: "  clay  ", when: "weekday", cost: "paid" })).toEqual({
      ...empty,
      q: "  clay  ",
      when: "weekday",
      cost: "paid",
    });
  });
});
