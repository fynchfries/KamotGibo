import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { ArrowLeft, ArrowRight, ExternalLink } from "lucide-react";
import { QUALIFICATIONS } from "@/data/sample";
import { getWorkshops, useDemoProgress } from "@/lib/demo-store";
import { getRelatedActivities, getRelatedLearning, getRelatedWorkshops } from "@/lib/upskilling";
import { CertificationNote, UpskillingPage } from "@/components/kg/Upskilling";
import { WorkshopCard } from "@/components/kg/WorkshopCard";
import { Button } from "@/components/ui/button";

export const Route = createFileRoute("/learner/upskilling/$id")({
  loader: ({ params }) => {
    const qualification = QUALIFICATIONS.find((item) => item.id === params.id);
    if (!qualification) throw notFound();
    return { qualification };
  },
  head: ({ loaderData }) => ({
    meta: [
      { title: `${loaderData?.qualification.title ?? "Pathway not found"} · KamotGibo` },
      {
        name: "description",
        content: loaderData?.qualification.description ?? "Explore learning pathways on KamotGibo.",
      },
    ],
  }),
  notFoundComponent: () => (
    <div className="mx-auto max-w-xl px-4 py-16 sm:px-6">
      <h1 className="text-3xl font-semibold">Pathway not found</h1>
      <p className="mt-3 text-muted-foreground">
        This qualification reference is not available. Explore the current pathways instead.
      </p>
      <Button asChild variant="outline-sea" className="mt-5">
        <Link to="/learner/upskilling">Back to Upskilling</Link>
      </Button>
    </div>
  ),
  component: PathwayDetail,
});

function PathwayDetail() {
  const { qualification: q } = Route.useLoaderData();
  const progress = useDemoProgress();
  const workshops = getWorkshops(progress);
  const recommended = getRelatedWorkshops(q, workshops);
  return (
    <UpskillingPage title={q.title} description={`${q.organization} · ${q.level} · ${q.sector}`}>
      <Link
        to="/learner/upskilling"
        className="inline-flex min-h-11 items-center gap-2 rounded-lg text-sm font-bold text-sea underline-offset-4 hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
      >
        <ArrowLeft aria-hidden="true" className="size-4" /> Back to Upskilling
      </Link>
      <section
        aria-labelledby="pathway-about-title"
        className="rounded-3xl border bg-card p-5 shadow-card sm:p-6"
      >
        <h2 id="pathway-about-title" className="text-xl font-semibold">
          About this pathway
        </h2>
        <p className="mt-3 text-sm leading-relaxed">{q.about}</p>
        <p className="mt-3 text-sm text-muted-foreground">{q.referenceNote}</p>
      </section>
      <section
        aria-labelledby="core-competencies-title"
        className="rounded-3xl border bg-card p-5 shadow-card sm:p-6"
      >
        <h2 id="core-competencies-title" className="text-xl font-semibold">
          Core Competencies
        </h2>
        <p className="mt-3 text-sm text-muted-foreground">
          Related workshop curriculum outcomes, not standalone online modules or official competency
          assessments.
        </p>
        <div className="mt-5 grid gap-4 xl:grid-cols-3">
          {q.competencies.map((competency) => {
            const activities = getRelatedActivities(competency, workshops);
            return (
              <article
                key={competency.id}
                aria-labelledby={`core-${competency.id}`}
                className="min-w-0 rounded-2xl border bg-background p-4"
              >
                <h3 id={`core-${competency.id}`} className="text-lg font-semibold">
                  {competency.title}
                </h3>
                {competency.code && (
                  <p className="mt-2 break-words font-mono text-xs text-muted-foreground">
                    {competency.code}
                  </p>
                )}
                <p className="mt-3 text-sm text-muted-foreground">{competency.description}</p>
                {activities.length ? (
                  <ul className="mt-4 space-y-3">
                    {activities.map(({ activity, workshop }) => (
                      <li key={activity.id}>
                        <Link
                          to="/workshops/$id"
                          params={{ id: workshop.id }}
                          className="block min-h-11 rounded-lg text-sm font-semibold text-sea underline-offset-4 hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                        >
                          {activity.outcome}
                          <span className="mt-1 block text-xs font-normal text-muted-foreground">
                            {workshop.title}
                          </span>
                        </Link>
                      </li>
                    ))}
                  </ul>
                ) : (
                  <p className="mt-4 text-sm text-muted-foreground">
                    No mapped workshop outcomes available yet.
                  </p>
                )}
              </article>
            );
          })}
        </div>
      </section>
      <section
        aria-labelledby="related-learning-title"
        className="rounded-3xl border bg-card p-5 shadow-card sm:p-6"
      >
        <h2 id="related-learning-title" className="text-xl font-semibold">
          Your related learning
        </h2>
        <p className="mt-3 text-sm font-bold text-sea">KamotGibo related learning progress</p>
        <p className="mt-2 text-sm text-muted-foreground">
          Recorded workshop evidence only. Activity-level completion is not recorded in this demo;
          attendance is not a passed skill check or an official qualification.
        </p>
        <div className="mt-5 grid gap-4 xl:grid-cols-3">
          {q.competencies.map((competency) => {
            const evidence = getRelatedLearning(competency, workshops, progress);
            return (
              <article
                key={competency.id}
                aria-labelledby={`learning-${competency.id}`}
                className="min-w-0 rounded-2xl border bg-background p-4"
              >
                <h3 id={`learning-${competency.id}`} className="text-lg font-semibold">
                  {competency.title}
                </h3>
                <dl className="mt-4 space-y-3 text-sm">
                  {[
                    ["Workshop attendance", evidence.attended],
                    ["Passed skill checks", evidence.passed],
                    ["Skill checks not yet passed", evidence.notYet],
                    ["Booked, not yet attended", evidence.booked],
                  ].map(([label, value]) => (
                    <div key={label} className="flex items-start justify-between gap-3">
                      <dt className="text-muted-foreground">{label}</dt>
                      <dd className="font-bold tabular-nums">{value}</dd>
                    </div>
                  ))}
                </dl>
              </article>
            );
          })}
        </div>
      </section>
      <section
        id="recommended"
        aria-labelledby="recommended-title"
        className="scroll-mt-24 rounded-3xl border bg-card p-5 shadow-card sm:p-6"
      >
        <h2 id="recommended-title" className="text-xl font-semibold">
          Recommended for this pathway
        </h2>
        <p className="mt-3 text-sm text-muted-foreground">
          Sample catalogue workshops linked through their curriculum outcomes. These are demo
          listings, not verified real-world training offers.
        </p>
        {recommended.length ? (
          <div className="mt-5 grid gap-4 lg:grid-cols-2">
            {recommended.map((workshop) => (
              <WorkshopCard key={workshop.id} workshop={workshop} variant="catalog" />
            ))}
          </div>
        ) : (
          <div className="mt-5 rounded-2xl border-2 border-dashed p-5">
            <p className="font-bold">No related workshops available yet.</p>
            <Button asChild variant="link" className="mt-2 px-0">
              <Link to="/discover">
                Explore Discover <ArrowRight aria-hidden="true" />
              </Link>
            </Button>
          </div>
        )}
      </section>
      <section
        aria-labelledby="learning-references-title"
        className="rounded-3xl border bg-card p-5 shadow-card sm:p-6"
      >
        <h2 id="learning-references-title" className="text-xl font-semibold">
          Learning references
        </h2>
        <p className="mt-3 text-sm text-muted-foreground">
          External sources for further reading. Follow the source's own training and assessment
          guidance.
        </p>
        {q.references.length ? (
          <ul className="mt-5 grid gap-3 lg:grid-cols-2">
            {q.references.map((reference) => (
              <li key={reference.url} className="min-w-0">
                <a
                  href={reference.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="block h-full rounded-2xl border bg-background p-4 transition-colors hover:border-sea/50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                >
                  <span className="flex items-start justify-between gap-3 font-bold text-sea">
                    {reference.title}
                    <ExternalLink aria-hidden="true" className="size-4 shrink-0" />
                  </span>
                  <span className="mt-2 block text-xs font-bold text-muted-foreground">
                    {reference.source} · External PDF · Opens in a new tab
                  </span>
                  <span className="mt-2 block text-sm text-muted-foreground">
                    {reference.description}
                  </span>
                </a>
              </li>
            ))}
          </ul>
        ) : (
          <p className="mt-5 text-sm text-muted-foreground">
            No external learning references added yet.
          </p>
        )}
      </section>
      <CertificationNote />
    </UpskillingPage>
  );
}
