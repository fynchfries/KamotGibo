import { createFileRoute } from "@tanstack/react-router";
import { QUALIFICATIONS, UPSKILLING_COPY } from "@/data/sample";
import { CertificationNote, QualificationCard, UpskillingPage } from "@/components/kg/Upskilling";

export const Route = createFileRoute("/learner/upskilling/")({
  head: () => ({
    meta: [
      { title: "Upskilling · KamotGibo" },
      { name: "description", content: UPSKILLING_COPY.description },
    ],
  }),
  component: Upskilling,
});

function Upskilling() {
  return (
    <UpskillingPage title={UPSKILLING_COPY.title} description={UPSKILLING_COPY.description}>
      <section
        aria-labelledby="microcredentials-title"
        className="rounded-3xl border bg-card p-5 shadow-card sm:p-6"
      >
        <h2 id="microcredentials-title" className="text-xl font-semibold">
          {UPSKILLING_COPY.sectionTitle}
        </h2>
        <p className="mt-3 text-sm text-muted-foreground">{UPSKILLING_COPY.sectionDescription}</p>
        <div className="mt-5 grid gap-4">
          {QUALIFICATIONS.map((qualification) => (
            <QualificationCard key={qualification.id} qualification={qualification} />
          ))}
        </div>
      </section>
      <CertificationNote />
    </UpskillingPage>
  );
}
