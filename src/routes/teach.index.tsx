import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowRight, CalendarDays, ClipboardCheck, ShieldCheck, Users } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ArtisanPage } from "@/components/kg/ArtisanPortal";
import { ARTISAN_SECTIONS } from "@/data/sample";
import { useArtisanPortal } from "@/lib/artisan-portal";
import { getProviderWorkshops } from "@/lib/demo-store";
import { redirectLegacyArtisanView, validateArtisanSearch } from "@/lib/artisan-workspace";

export const Route = createFileRoute("/teach/")({
  validateSearch: validateArtisanSearch,
  beforeLoad: ({ search }) => redirectLegacyArtisanView(search),
  head: () => ({
    meta: [
      { title: "Artisan dashboard · KamotGibo" },
      { name: "description", content: ARTISAN_SECTIONS.dashboard.description },
      { name: "robots", content: "noindex" },
    ],
  }),
  component: ArtisanDashboard,
});

function ArtisanDashboard() {
  const { progress, provider } = useArtisanPortal();
  const workshops = getProviderWorkshops(progress, provider.id);
  const published = workshops.filter((w) => w.published);
  const approved = provider.status === "Approved";
  return (
    <ArtisanPage section="dashboard">
      <div className="mt-5 grid grid-cols-3 gap-2 sm:gap-4">
        {[
          { label: "Published", count: published.length, Icon: CalendarDays },
          { label: "Drafts", count: workshops.length - published.length, Icon: ClipboardCheck },
          {
            label: "Seats booked",
            count: published.reduce((sum, w) => sum + w.capacity - w.seatsLeft, 0),
            Icon: Users,
          },
        ].map(({ label, count, Icon }) => (
          <div key={label} className="rounded-2xl border bg-card p-3 sm:p-5">
            <Icon aria-hidden="true" className="mb-2 size-5 text-sea" />
            <p className="text-2xl font-bold">{count}</p>
            <p className="mt-1 text-xs font-semibold text-muted-foreground sm:text-sm">{label}</p>
          </div>
        ))}
      </div>
      <div className="mt-5 grid gap-5 lg:grid-cols-[minmax(0,1.5fr)_minmax(0,1fr)]">
        <section
          aria-labelledby="artisan-sessions-heading"
          className="rounded-2xl border bg-card p-5 sm:p-6"
        >
          <div className="flex flex-wrap items-center justify-between gap-3">
            <h2 id="artisan-sessions-heading" className="text-xl font-bold">
              Your sessions
            </h2>
            <Button asChild variant="outline-sea">
              <Link to="/teach/workshops">
                My workshops <ArrowRight aria-hidden="true" />
              </Link>
            </Button>
          </div>
          {published.length === 0 ? (
            <p className="mt-4 text-sm text-muted-foreground">
              No published sessions yet. Create a draft in My workshops to get started.
            </p>
          ) : (
            <ul className="mt-4 divide-y">
              {published.map((w) => (
                <li key={w.id} className="py-4 first:pt-0 last:pb-0">
                  <h3 className="font-bold leading-snug">{w.title}</h3>
                  <p className="mt-2 text-sm text-muted-foreground">
                    {w.nextDate} · {w.time}
                  </p>
                  <p className="mt-1 text-sm text-muted-foreground">
                    {w.capacity - w.seatsLeft} of {w.capacity} seats booked
                  </p>
                  <Link
                    to="/teach/bookings"
                    search={{ workshopId: w.id }}
                    className="mt-3 inline-flex min-h-11 items-center gap-2 rounded-lg text-sm font-bold text-sea underline-offset-4 hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                  >
                    Manage bookings <ArrowRight aria-hidden="true" className="size-4" />
                  </Link>
                </li>
              ))}
            </ul>
          )}
        </section>
        <section
          aria-labelledby="artisan-status-heading"
          className="rounded-2xl border bg-card p-5 sm:p-6"
        >
          <ShieldCheck aria-hidden="true" className="size-8 text-sea" />
          <h2 id="artisan-status-heading" className="mt-4 text-xl font-bold">
            Your provider status
          </h2>
          <Badge className="mt-3" variant={approved ? "success" : "warning"}>
            {provider.status}
          </Badge>
          <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
            {approved
              ? "You are ready to share your craft. Publish a workshop and welcome your next learners."
              : "You can prepare workshop drafts while your application is reviewed. Approval is needed to publish."}
          </p>
          <Button asChild variant="outline-sea" className="mt-4">
            <Link to="/teach/application">
              View application <ArrowRight aria-hidden="true" />
            </Link>
          </Button>
        </section>
      </div>
    </ArtisanPage>
  );
}
