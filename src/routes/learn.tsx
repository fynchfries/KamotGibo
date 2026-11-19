import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowRight, BadgeCheck, CalendarDays, CheckCircle2, Circle, Ticket } from "lucide-react";
import { PortalPage } from "@/components/kg/PortalPage";
import { BadgeMedal } from "@/components/kg/BadgeMedal";
import { Button } from "@/components/ui/button";
import { BADGE, LEARNER_DASHBOARD_COPY, milestones } from "@/data/sample";
import { getWorkshops, useDemoProgress } from "@/lib/demo-store";
import { useLearnerProfile } from "@/lib/learner-profile";

export const Route = createFileRoute("/learn")({
  head: () => ({
    meta: [
      { title: "Learner dashboard · KamotGibo" },
      { name: "description", content: LEARNER_DASHBOARD_COPY.description },
      { name: "robots", content: "noindex" },
    ],
  }),
  component: LearnerDashboard,
});

function LearnerDashboard() {
  const progress = useDemoProgress();
  const profile = useLearnerProfile();
  const upcoming = getWorkshops(progress).filter((w) => progress.booked.includes(w.id));
  const steps = milestones(progress);
  const completed = steps.filter((step) => step.done).length;
  return (
    <PortalPage
      eyebrow="Learner portal"
      title={LEARNER_DASHBOARD_COPY.title}
      description={LEARNER_DASHBOARD_COPY.description}
      identity={`${profile.fullName} · Learner demo`}
    >
      <section aria-label="Your learning overview" className="mt-5 grid grid-cols-3 gap-2 sm:gap-4">
        {[
          { label: "Bookings", count: upcoming.length, Icon: Ticket },
          { label: "Badges", count: progress.badgeIssued ? 1 : 0, Icon: BadgeCheck },
          { label: "Milestones", count: `${completed}/${steps.length}`, Icon: CheckCircle2 },
        ].map(({ label, count, Icon }) => (
          <div key={label} className="rounded-2xl border bg-card p-3 sm:p-5">
            <Icon aria-hidden="true" className="mb-2 size-5 text-sea" />
            <p className="text-2xl font-bold">{count}</p>
            <p className="mt-1 text-xs font-semibold text-muted-foreground sm:text-sm">{label}</p>
          </div>
        ))}
      </section>
      <div className="mt-5 grid gap-5 lg:grid-cols-[minmax(0,1.5fr)_minmax(0,1fr)]">
        <section
          aria-labelledby="learner-bookings-heading"
          className="rounded-2xl border bg-card p-5 sm:p-6"
        >
          <div className="flex flex-wrap items-center justify-between gap-3">
            <h2 id="learner-bookings-heading" className="text-xl font-bold">
              Your next workshops
            </h2>
            <Button asChild variant="outline-sea">
              <Link to="/discover">
                Discover workshops <ArrowRight aria-hidden="true" />
              </Link>
            </Button>
          </div>
          {upcoming.length === 0 ? (
            <div className="mt-4 rounded-xl border-2 border-dashed p-5 text-center">
              <p className="font-bold">No upcoming bookings yet</p>
              <p className="mt-2 text-sm text-muted-foreground">
                Choose a craft and learn alongside a local artisan.
              </p>
              <Button asChild variant="hero" className="mt-4">
                <Link to="/discover">
                  Find a workshop <ArrowRight aria-hidden="true" />
                </Link>
              </Button>
            </div>
          ) : (
            <ul className="mt-4 divide-y">
              {upcoming.map((w) => (
                <li key={w.id} className="py-4 first:pt-0 last:pb-0">
                  <h3 className="font-bold leading-snug">{w.title}</h3>
                  <p className="mt-2 flex items-start gap-2 text-sm text-muted-foreground">
                    <CalendarDays aria-hidden="true" className="mt-0.5 size-4 shrink-0" />
                    {w.nextDate} · {w.time}
                  </p>
                  <p className="mt-1 text-sm text-muted-foreground">{w.venue}</p>
                  <Link
                    to="/book/$id"
                    params={{ id: w.id }}
                    className="mt-3 inline-flex min-h-11 items-center gap-2 rounded-lg text-sm font-bold text-sea underline-offset-4 hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                  >
                    View booking <ArrowRight aria-hidden="true" className="size-4" />
                  </Link>
                </li>
              ))}
            </ul>
          )}
        </section>
        <section
          aria-labelledby="learner-progress-heading"
          className="rounded-2xl border bg-card p-5 sm:p-6"
        >
          <BadgeMedal locked={!progress.badgeIssued} className="size-20" />
          <h2 id="learner-progress-heading" className="mt-4 text-xl font-bold">
            Your learning journey
          </h2>
          <p className="mt-3 text-sm font-bold">
            {progress.badgeIssued ? "Your badge is ready" : "Your next badge"}
          </p>
          <p className="mt-1 text-sm text-muted-foreground">{BADGE.title}</p>
          {progress.badgeIssued && (
            <Link
              to="/badges/$code"
              params={{ code: BADGE.code }}
              className="mt-2 inline-flex min-h-11 items-center gap-2 rounded-lg text-sm font-bold text-sea underline-offset-4 hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
            >
              View badge <ArrowRight aria-hidden="true" className="size-4" />
            </Link>
          )}
          <p className="mt-4 text-xs font-semibold text-muted-foreground">
            {completed} of {steps.length} milestones reached
          </p>
          <ul className="mt-3 space-y-3">
            {steps.map((step) => (
              <li key={step.label} className="flex items-start gap-2 text-sm">
                {step.done ? (
                  <CheckCircle2
                    aria-hidden="true"
                    className="mt-0.5 size-4 shrink-0 text-success"
                  />
                ) : (
                  <Circle
                    aria-hidden="true"
                    className="mt-0.5 size-4 shrink-0 text-muted-foreground"
                  />
                )}
                <span className={step.done ? "font-semibold" : "text-muted-foreground"}>
                  {step.label}
                </span>
              </li>
            ))}
          </ul>
          <Button asChild variant="outline-sea" className="mt-5">
            <Link to="/learning">
              Open My learning <ArrowRight aria-hidden="true" />
            </Link>
          </Button>
        </section>
      </div>
    </PortalPage>
  );
}
