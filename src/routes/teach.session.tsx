import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowLeft, BadgeCheck, CalendarDays, Check, MapPin, Users } from "lucide-react";
import { Button } from "@/components/ui/button";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { BadgeMedal } from "@/components/kg/BadgeMedal";
import {
  demoActions,
  getWorkshops,
  getRoster,
  getRosterMark,
  useDemoProgress,
} from "@/lib/demo-store";
import { cn } from "@/lib/utils";
import { BADGE, INSTRUCTOR, canIssueBadge, type SkillResult } from "@/data/sample";

export const Route = createFileRoute("/teach/session")({
  validateSearch: (search: Record<string, unknown>): { workshopId?: string } =>
    typeof search["workshopId"] === "string" && search["workshopId"]
      ? { workshopId: search["workshopId"] }
      : {},
  head: () => ({
    meta: [
      { title: "Instructor view: session roster · KamotGibo" },
      { name: "robots", content: "noindex" },
      {
        name: "description",
        content: "Mark attendance, check skills in person and try the sample skill-verified badge.",
      },
      { property: "og:title", content: "Instructor view · KamotGibo" },
      {
        property: "og:description",
        content: "Mark attendance, check skills and issue the sample badge.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
  component: InstructorView,
});

function InstructorView() {
  const { workshopId = INSTRUCTOR.workshopId } = Route.useSearch();
  const progress = useDemoProgress();
  const w = getWorkshops(progress).find((workshop) => workshop.id === workshopId);
  if (!w)
    return (
      <div className="mx-auto max-w-4xl px-6 py-12">
        <h1 className="text-3xl font-semibold">Session not found</h1>
        <Button asChild variant="outline-sea" className="mt-4">
          <Link to="/teach">Back to Teach with us</Link>
        </Button>
      </div>
    );
  const roster = getRoster(progress, w.id);
  const badgeSupported = w.id === INSTRUCTOR.workshopId;
  const markOf = (id: string) => getRosterMark(progress, w.id, id);
  const all = roster.map((r) => markOf(r.id));
  const present = all.filter((m) => m.present).length;
  const passed = all.filter((m) => m.skill === "pass").length;
  const issued = all.filter((m) => m.issued).length;
  const instructor = w.instructor.replace(" (sample)", "");

  return (
    <div className="mx-auto max-w-4xl px-4 pb-16 pt-6 sm:px-6">
      <Link
        to="/teach/bookings"
        search={{ workshopId: w.id }}
        onClick={() => demoActions.selectProvider(w.providerId)}
        className="inline-flex min-h-11 items-center gap-1.5 text-sm font-bold text-sea hover:underline"
      >
        <ArrowLeft aria-hidden="true" className="size-4" /> Back to bookings
      </Link>
      <p className="mt-2 text-sm font-bold uppercase tracking-widest text-primary">
        Instructor view
      </p>
      <h1 className="mt-1 text-3xl font-semibold sm:text-4xl">Marhay na aga, {instructor}!</h1>
      <p className="mt-2 text-sm text-muted-foreground">Good morning · Demo session management</p>

      <section className="mt-5 rounded-3xl border bg-card p-5 shadow-card sm:p-6">
        <p className="text-xs font-extrabold uppercase tracking-widest text-muted-foreground">
          Workshop session
        </p>
        <h2 className="mt-1 text-xl font-semibold leading-snug">{w.title}</h2>
        <p className="mt-2 flex flex-wrap gap-x-4 gap-y-2 text-sm text-muted-foreground">
          <span className="flex items-center gap-1.5">
            <CalendarDays aria-hidden="true" className="size-4 text-sea" />
            {w.nextDate} · {w.time}
          </span>
          <span className="flex items-center gap-1.5">
            <MapPin aria-hidden="true" className="size-4 text-sea" />
            {w.venue}
          </span>
          <span className="flex items-center gap-1.5">
            <Users aria-hidden="true" className="size-4 text-sea" />
            {roster.length} of {w.capacity} seats booked
          </span>
        </p>
        <div className="mt-4 flex items-center gap-4 rounded-2xl bg-sea-soft/50 p-4">
          {badgeSupported && <BadgeMedal className="size-16" />}
          <div>
            <p className="text-xs font-extrabold uppercase tracking-widest text-sea">
              Skills to check
            </p>
            <p className="font-bold">{badgeSupported ? BADGE.title : w.craft}</p>
            <p className="mt-1 text-sm text-muted-foreground">
              {(badgeSupported ? BADGE.skills : w.learn).join(" · ")}
            </p>
          </div>
        </div>
      </section>

      <ol
        className={cn(
          "mt-6 grid gap-2 text-center text-sm",
          badgeSupported ? "grid-cols-3" : "grid-cols-2",
        )}
      >
        {[
          { n: present, label: "Present" },
          { n: passed, label: "Passed" },
          ...(badgeSupported ? [{ n: issued, label: "Badges issued" }] : []),
        ].map((s, i) => (
          <li key={s.label} className="rounded-2xl border bg-card px-2 py-3">
            <p className="text-xs font-bold text-muted-foreground">Step {i + 1}</p>
            <p className="font-display text-2xl font-semibold text-sea">
              {s.n}
              <span className="text-base text-muted-foreground">/{roster.length}</span>
            </p>
            <p className="font-bold">{s.label}</p>
          </li>
        ))}
      </ol>

      {progress.badgeIssued && badgeSupported && (
        <div className="mt-6 flex flex-col gap-3 rounded-3xl border-2 border-success/40 bg-success-soft p-5 sm:flex-row sm:items-center">
          <BadgeCheck aria-hidden="true" className="size-8 shrink-0 text-success" />
          <div className="flex-1">
            <p className="font-bold">Badge issued to Mika</p>
            <p className="text-sm text-muted-foreground">
              {BADGE.title} · verification code <strong className="font-mono">{BADGE.code}</strong>
            </p>
          </div>
          <p className="text-sm text-muted-foreground">Saved to the learner's My learning page.</p>
        </div>
      )}

      <section className="mt-6">
        <h2 className="text-xl font-semibold">Session roster</h2>
        <p className="mt-1 text-sm text-muted-foreground">
          Mark who came. Then check each skill as Pass or Not yet. Changes are saved in this
          browser.
        </p>
        <ul aria-label="Session learners" className="mt-4 flex flex-col gap-3">
          {roster.map((r) => {
            const m = markOf(r.id);
            return (
              <li
                key={r.id}
                className={cn(
                  "rounded-3xl border bg-card p-4 shadow-card",
                  m.issued && "border-success/50",
                  r.id === "mika" && !m.issued && "border-primary/40",
                )}
              >
                <div className="flex items-center gap-3">
                  <span
                    aria-hidden="true"
                    className="grid size-11 shrink-0 place-items-center rounded-full bg-secondary font-display text-lg font-semibold"
                  >
                    {r.name[0]}
                  </span>
                  <div className="min-w-0 flex-1">
                    <p className="font-bold">{r.name}</p>
                    <p className="text-xs font-bold text-muted-foreground">{r.ref}</p>
                  </div>
                  {m.issued && (
                    <span className="inline-flex items-center gap-1 rounded-full bg-success-soft px-2.5 py-1 text-xs font-bold text-success">
                      <BadgeCheck aria-hidden="true" className="size-4" />
                      Badge issued
                    </span>
                  )}
                </div>
                {!m.issued && (
                  <div
                    className={cn(
                      "mt-3 grid gap-2 sm:items-center",
                      badgeSupported ? "sm:grid-cols-[auto_1fr_auto]" : "sm:grid-cols-[auto_1fr]",
                    )}
                  >
                    <Button
                      type="button"
                      variant={m.present ? "sea" : "outline-sea"}
                      aria-pressed={m.present}
                      onClick={() => demoActions.markLearner(w.id, r.id, { present: !m.present })}
                    >
                      {m.present && <Check aria-hidden="true" />}
                      {m.present ? "Present" : "Mark present"}
                    </Button>
                    <RadioGroup
                      aria-label={`Skill check for ${r.name}`}
                      value={m.skill ?? ""}
                      disabled={!m.present}
                      onValueChange={(value) =>
                        demoActions.markLearner(w.id, r.id, { skill: value as SkillResult })
                      }
                      className={cn(
                        "grid grid-cols-2 gap-1 rounded-full bg-secondary p-1",
                        !m.present && "opacity-50",
                      )}
                    >
                      {(["pass", "not-yet"] as const).map((value) => (
                        <label
                          key={value}
                          htmlFor={`${w.id}-${r.id}-${value}`}
                          className={cn(
                            "flex min-h-11 cursor-pointer items-center justify-center rounded-full px-3 text-sm font-bold transition-colors focus-within:ring-2 focus-within:ring-ring",
                            m.skill === value
                              ? value === "pass"
                                ? "bg-success text-sea-foreground"
                                : "bg-warning text-sea-foreground"
                              : "text-muted-foreground hover:bg-card",
                          )}
                        >
                          <RadioGroupItem
                            id={`${w.id}-${r.id}-${value}`}
                            value={value}
                            className="sr-only"
                          />
                          {value === "pass" ? "Pass" : "Not yet"}
                        </label>
                      ))}
                    </RadioGroup>
                    {badgeSupported && (
                      <Button
                        variant="hero"
                        disabled={!canIssueBadge(m)}
                        onClick={() => demoActions.issueBadge(w.id, r.id)}
                      >
                        <BadgeCheck aria-hidden="true" />
                        Issue badge
                      </Button>
                    )}
                  </div>
                )}
                {!m.issued && m.skill === "not-yet" && (
                  <p className="mt-2 text-sm text-muted-foreground">
                    {r.name.replace(" (sample)", "")} can practise and try the skill check again.
                  </p>
                )}
              </li>
            );
          })}
        </ul>
        {roster.length === 0 && (
          <p className="mt-4 rounded-2xl border-2 border-dashed p-6 text-sm text-muted-foreground">
            No learners booked yet. Reserve a seat as Mika to try the session controls.
          </p>
        )}
        <p className="mt-4 rounded-2xl bg-muted px-4 py-3 text-sm text-muted-foreground">
          {badgeSupported
            ? "Badges require attendance and an in-person skill pass."
            : "Attendance and skill checks are saved. Badge issuance in this prototype is demonstrated only in Shell Jewelry Basics."}{" "}
          This is a role-switching demo, not a private instructor account. Use fictional learner
          details only.
        </p>
      </section>
    </div>
  );
}
