import { useRef, type ReactNode } from "react";
import { Link, Outlet } from "@tanstack/react-router";
import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { ARTISAN_SECTIONS, INSTRUCTOR } from "@/data/sample";
import { ArtisanPortalContext, useArtisanPortal, type ArtisanDrafts } from "@/lib/artisan-portal";
import { demoActions, getProviders, useDemoProgress } from "@/lib/demo-store";
import type { ArtisanView } from "@/lib/artisan-workspace";
import { PortalPage } from "./PortalPage";

export function ArtisanPortal() {
  const progress = useDemoProgress();
  const providers = getProviders(progress);
  const provider =
    providers.find((p) => p.id === progress.activeProviderId) ??
    providers.find((p) => p.id === INSTRUCTOR.providerId)!;
  // Unsaved inputs survive child-page navigation, not a reload or leaving this portal.
  const drafts = useRef<ArtisanDrafts>({ workshops: {} });
  return (
    <ArtisanPortalContext.Provider value={{ progress, provider, drafts }}>
      <Outlet />
      <div className="mx-auto max-w-6xl px-4 pb-16 sm:px-6">
        <details className="rounded-2xl border bg-card p-5">
          <summary className="min-h-11 cursor-pointer rounded-lg py-2.5 text-sm font-bold text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring">
            Demo controls
          </summary>
          <div className="mt-3 flex flex-col gap-4 border-t pt-4 sm:flex-row sm:items-end sm:justify-between">
            <div className="w-full max-w-sm space-y-2">
              <Label htmlFor="demo-artisan">Preview artisan profile</Label>
              <Select value={provider.id} onValueChange={demoActions.selectProvider}>
                <SelectTrigger id="demo-artisan" className="h-11">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {providers.map((p) => (
                    <SelectItem key={p.id} value={p.id}>
                      {p.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <p className="text-xs text-muted-foreground">
                Sample profiles only. This is not a login or a permission check.
              </p>
            </div>
            <Button asChild variant="outline-sea">
              <Link to="/admin">
                Open admin review <ArrowRight aria-hidden="true" />
              </Link>
            </Button>
          </div>
        </details>
        <p className="mt-6 text-center text-xs leading-relaxed text-muted-foreground">
          Browser-only demo · Workshops, bookings and badges are saved on this device only. No real
          reservations are made.
        </p>
      </div>
    </ArtisanPortalContext.Provider>
  );
}

export function ArtisanPage({ section, children }: { section: ArtisanView; children: ReactNode }) {
  const { provider } = useArtisanPortal();
  const copy = ARTISAN_SECTIONS[section];
  return (
    <PortalPage
      eyebrow="Artisan portal"
      title={copy.title}
      description={copy.description}
      identity={`${provider.name} · ${provider.status}`}
    >
      {children}
    </PortalPage>
  );
}
