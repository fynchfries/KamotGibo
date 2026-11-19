import { useEffect, useRef, useState } from "react";
import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowUpRight, CalendarDays, Copy, MapPin, Plus, ShieldCheck } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ArtisanPage } from "@/components/kg/ArtisanPortal";
import { ArtisanWorkshopForm } from "@/components/kg/ArtisanWorkshopForm";
import { WorkshopShare } from "@/components/kg/WorkshopShare";
import { getPublicWorkshop } from "@/lib/workshop-sharing";
import { ARTISAN_SECTIONS, formatFee } from "@/data/sample";
import { useArtisanPortal } from "@/lib/artisan-portal";
import { demoActions, getProviderWorkshops } from "@/lib/demo-store";

export const Route = createFileRoute("/teach/workshops")({
  head: () => ({
    meta: [
      { title: "My workshops · KamotGibo" },
      { name: "description", content: ARTISAN_SECTIONS.workshops.description },
      { name: "robots", content: "noindex" },
    ],
  }),
  component: ArtisanWorkshops,
});

function ArtisanWorkshops() {
  const { progress, provider, drafts } = useArtisanPortal();
  const workshops = getProviderWorkshops(progress, provider.id);
  const approved = provider.status === "Approved";
  const [showForm, setShowForm] = useState(() => !!drafts.current.workshops[provider.id]);
  const [notice, setNotice] = useState("");
  const [publishedId, setPublishedId] = useState("");
  const published = workshops.find((workshop) => workshop.id === publishedId && workshop.published);
  const publicationTitle = useRef<HTMLHeadingElement>(null);
  useEffect(() => {
    if (publishedId) publicationTitle.current?.focus();
  }, [publishedId]);
  const createButton = useRef<HTMLButtonElement>(null);
  const closeForm = () => {
    delete drafts.current.workshops[provider.id];
    setShowForm(false);
    createButton.current?.focus();
  };
  return (
    <ArtisanPage section="workshops">
      {notice && (
        <p
          role="status"
          className="mt-5 rounded-xl border border-success/30 bg-success-soft px-4 py-3 text-sm font-semibold"
        >
          {notice}
        </p>
      )}
      {published && (
        <section
          aria-label="Publication status"
          aria-live="polite"
          className="mt-5 rounded-2xl border border-success/30 bg-success-soft p-5"
        >
          <h2 ref={publicationTitle} tabIndex={-1} className="text-lg font-semibold">
            Your workshop is live in this demo browser.
          </h2>
          <p className="mt-2 text-sm">
            This listing is stored only in this browser. Other people cannot open it from a public
            link yet.
          </p>
          <div className="mt-4 flex flex-wrap gap-2">
            <Button asChild variant="outline-sea">
              <Link
                to="/workshops/$id"
                params={{ id: published.id }}
                target="_blank"
                rel="noopener noreferrer"
              >
                View workshop <ArrowUpRight aria-hidden="true" />
              </Link>
            </Button>
            <WorkshopShare workshop={published} label="Share workshop" />
            <Button variant="outline" disabled>
              <Copy aria-hidden="true" /> Copy link
            </Button>
          </div>
        </section>
      )}
      <section className="mt-5 rounded-2xl border bg-card p-5 sm:p-6">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <h2 className="text-2xl font-semibold">Workshop listings</h2>
            <p className="mt-1 text-sm text-muted-foreground">
              Your venue, your fee, your way of teaching.
            </p>
          </div>
          <Button
            ref={createButton}
            variant="hero"
            onClick={() => {
              setShowForm(true);
              setNotice("");
              setPublishedId("");
            }}
          >
            <Plus aria-hidden="true" /> Create workshop
          </Button>
        </div>
        {!approved && (
          <p className="mt-4 rounded-xl bg-warning-soft p-4 text-sm">
            Your profile is {provider.status.toLowerCase()}. Save a draft, then use Demo controls to
            open admin review before publishing.
          </p>
        )}
        {showForm && (
          <ArtisanWorkshopForm
            key={provider.id}
            provider={provider}
            onSaved={() => {
              closeForm();
              setNotice("Workshop saved as draft.");
            }}
            onCancel={closeForm}
          />
        )}
        {workshops.length === 0 ? (
          <p className="mt-5 rounded-xl border-2 border-dashed p-6 text-center text-sm text-muted-foreground">
            No workshops yet. Create your first draft to get started.
          </p>
        ) : (
          <ul className="mt-5 grid gap-4 md:grid-cols-2">
            {workshops.map((w) => (
              <li key={w.id} className="min-w-0 rounded-2xl border bg-background p-5">
                <div className="flex flex-wrap items-center gap-2">
                  <Badge variant={w.published ? "success" : "sand"}>
                    {w.published
                      ? getPublicWorkshop(w.id)
                        ? "Published"
                        : "Published locally"
                      : "Draft"}
                  </Badge>
                  <span className="text-xs text-muted-foreground">
                    {w.craft} · {w.level}
                  </span>
                </div>
                <h3 className="mt-3 text-lg font-bold leading-snug">{w.title}</h3>
                <p className="mt-3 flex items-start gap-2 text-sm text-muted-foreground">
                  <CalendarDays aria-hidden="true" className="mt-0.5 size-4 shrink-0" />
                  {w.nextDate} · {w.time}
                </p>
                <p className="mt-2 flex items-start gap-2 text-sm text-muted-foreground">
                  <MapPin aria-hidden="true" className="mt-0.5 size-4 shrink-0" />
                  {w.venue}
                </p>
                <p className="mt-3 text-sm font-bold">
                  {formatFee(w.fee)} · {w.capacity - w.seatsLeft} of {w.capacity} seats booked
                </p>
                {w.published ? (
                  <div className="mt-4 flex flex-wrap gap-2">
                    <Button asChild variant="outline-sea">
                      <Link
                        to="/workshops/$id"
                        params={{ id: w.id }}
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        Preview listing <ArrowUpRight aria-hidden="true" />
                      </Link>
                    </Button>
                    <WorkshopShare workshop={w} label="Share workshop" />
                    <Button asChild variant="ghost">
                      <Link to="/teach/bookings" search={{ workshopId: w.id }}>
                        View bookings
                      </Link>
                    </Button>
                  </div>
                ) : (
                  <Button
                    className="mt-4"
                    variant="sea"
                    disabled={!approved}
                    onClick={() => {
                      if (demoActions.publishWorkshop(w.id)) {
                        setPublishedId(w.id);
                        setNotice("");
                      } else {
                        setNotice("Admin approval is required before publishing.");
                      }
                    }}
                  >
                    <ShieldCheck aria-hidden="true" /> Publish workshop
                  </Button>
                )}
                {w.published && !getPublicWorkshop(w.id) && (
                  <p className="mt-3 text-xs text-muted-foreground">
                    Browser-only listing. Public sharing is unavailable until shared publishing is
                    enabled.
                  </p>
                )}
              </li>
            ))}
          </ul>
        )}
      </section>
    </ArtisanPage>
  );
}
