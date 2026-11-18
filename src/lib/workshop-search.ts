import {
  CRAFTS,
  LEVELS,
  TOWNS,
  type CostFilter,
  type Craft,
  type Level,
  type ScheduleFilter,
  type Town,
  type WorkshopFilters,
} from "@/data/sample";

function pick<T extends string>(value: unknown, allowed: readonly T[]): T | undefined {
  return typeof value === "string" && (allowed as readonly string[]).includes(value)
    ? (value as T)
    : undefined;
}

export function validateWorkshopSearch(search: Record<string, unknown>): WorkshopFilters {
  return {
    q: typeof search["q"] === "string" && search["q"] ? search["q"] : undefined,
    town: pick<Town>(search["town"], TOWNS),
    craft: pick<Craft>(
      search["craft"],
      CRAFTS.map((craft) => craft.name),
    ),
    level: pick<Level>(search["level"], LEVELS),
    when: pick<ScheduleFilter>(search["when"], ["weekend", "weekday"]),
    cost: pick<CostFilter>(search["cost"], ["free", "paid"]),
  };
}
