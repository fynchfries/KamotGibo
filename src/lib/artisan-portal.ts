import { createContext, useContext, type RefObject } from "react";
import type { Provider } from "@/data/sample";
import type { DemoState } from "./demo-store";
import type { ApplicationInput, WorkshopInput } from "./artisan-forms";

export interface ArtisanDrafts {
  application?: ApplicationInput;
  workshops: Record<string, WorkshopInput>;
}
export const ArtisanPortalContext = createContext<{
  progress: DemoState;
  provider: Provider;
  drafts: RefObject<ArtisanDrafts>;
} | null>(null);

export function useArtisanPortal() {
  const portal = useContext(ArtisanPortalContext);
  if (!portal) throw new Error("Artisan pages must render inside the artisan portal.");
  return portal;
}
