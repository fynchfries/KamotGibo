import { redirect } from "@tanstack/react-router";
import { ARTISAN_SECTIONS } from "@/data/sample";

export type ArtisanView = keyof typeof ARTISAN_SECTIONS;
export const ARTISAN_PATHS = {
  dashboard: "/teach",
  workshops: "/teach/workshops",
  bookings: "/teach/bookings",
  application: "/teach/application",
} as const;
export interface ArtisanSearch {
  view?: ArtisanView | undefined;
  workshopId?: string | undefined;
}

export function validateArtisanSearch(search: Record<string, unknown>): ArtisanSearch {
  const view = search["view"];
  const workshopId = search["workshopId"];
  return {
    view:
      typeof view === "string" && Object.hasOwn(ARTISAN_SECTIONS, view)
        ? (view as ArtisanView)
        : undefined,
    workshopId: typeof workshopId === "string" && workshopId.trim() ? workshopId.trim() : undefined,
  };
}

export function redirectLegacyArtisanView(search: ArtisanSearch) {
  if (search.view && search.view !== "dashboard")
    throw redirect({
      to: ARTISAN_PATHS[search.view],
      search: search.view === "bookings" ? { workshopId: search.workshopId } : {},
      replace: true,
    });
}

export function validateBookingSearch(search: Record<string, unknown>): {
  workshopId?: string | undefined;
} {
  const id = search["workshopId"];
  return { workshopId: typeof id === "string" && id.trim() ? id.trim() : undefined };
}
