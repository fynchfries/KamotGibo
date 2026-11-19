import type { ReactNode } from "react";
import { Link } from "@tanstack/react-router";
import { ArrowRight, Award, Info, MapPin } from "lucide-react";
import { UPSKILLING_COPY, type Qualification } from "@/data/sample";
import { useLearnerProfile } from "@/lib/learner-profile";
import { LearnerAvatar } from "./LearnerProfileButton";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

export function UpskillingPage({
  title,
  description,
  children,
}: {
  title: string;
  description: string;
  children: ReactNode;
}) {
  const profile = useLearnerProfile();
  return (
    <div className="mx-auto max-w-6xl px-4 pb-16 pt-8 sm:px-6">
      <div className="flex items-start gap-4">
        <LearnerAvatar profile={profile} className="size-16 shrink-0 text-2xl" />
        <div className="min-w-0 flex-1">
          <p className="text-sm font-bold uppercase tracking-widest text-primary">UPSKILLING</p>
          <h1 className="break-words text-3xl font-semibold sm:text-4xl">{title}</h1>
          <p className="mt-3 text-sm text-muted-foreground">{description}</p>
          <p className="mt-3 break-words text-sm text-muted-foreground">
            <MapPin aria-hidden="true" className="inline size-3.5" /> {profile.fullName} ·{" "}
            {profile.municipality}
          </p>
          <div className="mt-3 flex flex-wrap gap-2">
            {profile.interests.map((craft) => (
              <Badge key={craft} variant="secondary">
                {craft}
              </Badge>
            ))}
          </div>
        </div>
      </div>
      <div className="mt-8 space-y-6">{children}</div>
    </div>
  );
}

export function QualificationCard({ qualification: q }: { qualification: Qualification }) {
  return (
    <article
      aria-labelledby={`qualification-${q.id}`}
      className="rounded-2xl border bg-background p-5 sm:p-6"
    >
      <div className="flex flex-wrap items-start justify-between gap-3">
        <Award aria-hidden="true" className="size-7 text-sea" strokeWidth={1.75} />
        <Badge variant="secondary">Qualification Reference</Badge>
      </div>
      <h3 id={`qualification-${q.id}`} className="mt-4 text-xl font-semibold">
        {q.title}
      </h3>
      <p className="mt-1 text-sm font-bold text-sea">
        {q.organization} · {q.level}
      </p>
      <p className="mt-1 text-sm text-muted-foreground">{q.sector}</p>
      <p className="mt-4 text-sm">{q.description}</p>
      <p className="mt-4 text-sm font-bold">
        {q.competencies.length} Core {q.competencies.length === 1 ? "Competency" : "Competencies"}
      </p>
      <ol className="mt-3 list-decimal space-y-2 pl-5 text-sm text-muted-foreground">
        {q.competencies.map((competency) => (
          <li key={competency.id}>{competency.title}</li>
        ))}
      </ol>
      <div className="mt-5 flex flex-wrap gap-3">
        <Button asChild variant="hero">
          <Link to="/learner/upskilling/$id" params={{ id: q.id }}>
            View pathway <ArrowRight aria-hidden="true" />
          </Link>
        </Button>
        <Button asChild variant="outline-sea">
          <Link to="/learner/upskilling/$id" params={{ id: q.id }} hash="recommended">
            Find related workshops
          </Link>
        </Button>
      </div>
    </article>
  );
}

export function CertificationNote() {
  return (
    <aside
      aria-labelledby="certification-title"
      className="rounded-3xl border bg-sea-soft/50 p-5 sm:p-6"
    >
      <h2 id="certification-title" className="flex items-center gap-2 text-lg font-semibold">
        <Info aria-hidden="true" className="size-5 shrink-0 text-sea" /> About certification
      </h2>
      <p className="mt-3 text-sm text-muted-foreground">{UPSKILLING_COPY.certification}</p>
      <p className="mt-2 text-sm font-semibold">KamotGibo badges are not TESDA certificates.</p>
    </aside>
  );
}
