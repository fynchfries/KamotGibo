import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { ArrowRight, Ticket } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { ArtisanPage } from "@/components/kg/ArtisanPortal";
import { ARTISAN_SECTIONS } from "@/data/sample";
import { useArtisanPortal } from "@/lib/artisan-portal";
import { validateBookingSearch } from "@/lib/artisan-workspace";
import { getProviderWorkshops, getRoster, getRosterMark } from "@/lib/demo-store";

export const Route = createFileRoute("/teach/bookings")({
  validateSearch: validateBookingSearch,
  head: () => ({
    meta: [
      { title: "Bookings & attendance · KamotGibo" },
      { name: "description", content: ARTISAN_SECTIONS.bookings.description },
      { name: "robots", content: "noindex" },
    ],
  }),
  component: ArtisanBookings,
});

function ArtisanBookings() {
  const { workshopId } = Route.useSearch();
  const navigate = useNavigate({ from: "/teach/bookings" });
  const { progress, provider } = useArtisanPortal();
  const published = getProviderWorkshops(progress, provider.id).filter((w) => w.published);
  const session = published.find((w) => w.id === workshopId) ?? published[0];
  const roster = session ? getRoster(progress, session.id) : [];
  return (
    <ArtisanPage section="bookings">
      <section className="mt-5 rounded-2xl border bg-card p-5 sm:p-6">
        <h2 className="text-2xl font-semibold">Workshop bookings</h2>
        <p className="mt-1 text-sm text-muted-foreground">
          Reservations made in this browser appear here. Only first names and booking references are
          shown.
        </p>
        {session ? (
          <>
            <div className="mt-5 max-w-xl space-y-2">
              <Label htmlFor="booking-session">Workshop session</Label>
              <Select
                value={session.id}
                onValueChange={(id) =>
                  void navigate({ search: { workshopId: id }, resetScroll: false })
                }
              >
                <SelectTrigger id="booking-session" className="h-11">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {published.map((w) => (
                    <SelectItem key={w.id} value={w.id}>
                      {w.title}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="mt-4 flex flex-wrap items-center justify-between gap-3 rounded-xl bg-sea-soft/50 p-4">
              <div>
                <p className="font-bold">
                  {session.capacity - session.seatsLeft} of {session.capacity} seats booked
                </p>
                <p className="mt-1 text-sm text-muted-foreground">
                  {session.nextDate} · {session.time}
                </p>
              </div>
              <Button asChild variant="sea">
                <Link to="/teach/session" search={{ workshopId: session.id }}>
                  Open session roster <ArrowRight aria-hidden="true" />
                </Link>
              </Button>
            </div>
            {roster.length === 0 ? (
              <p className="mt-4 rounded-xl border-2 border-dashed p-6 text-sm text-muted-foreground">
                No bookings yet. Reservations from the learner portal will appear here.
              </p>
            ) : (
              <ul aria-label="Workshop reservations" className="mt-4 divide-y rounded-xl border">
                {roster.map((r) => {
                  const mark = getRosterMark(progress, session.id, r.id);
                  return (
                    <li
                      key={r.id}
                      className="flex flex-wrap items-center justify-between gap-3 p-4"
                    >
                      <div>
                        <p className="font-bold">{r.name}</p>
                        <p className="mt-1 flex items-center gap-1.5 font-mono text-xs text-muted-foreground">
                          <Ticket aria-hidden="true" className="size-3.5" />
                          {r.ref}
                        </p>
                      </div>
                      <Badge variant={mark.present ? "success" : "sand"}>
                        {mark.issued
                          ? "Badge issued"
                          : mark.skill === "pass"
                            ? "Skill passed"
                            : mark.present
                              ? "Present"
                              : "Booked"}
                      </Badge>
                    </li>
                  );
                })}
              </ul>
            )}
          </>
        ) : (
          <p className="mt-5 rounded-xl border-2 border-dashed p-6 text-sm text-muted-foreground">
            Publish a workshop first. Its bookings will appear here.
          </p>
        )}
      </section>
    </ArtisanPage>
  );
}
