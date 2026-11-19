import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowRight, GraduationCap, HandHeart } from "lucide-react";
import { CraftArt } from "@/components/kg/CraftArt";
import { Button } from "@/components/ui/button";
import { CRAFTS, HOME_COPY } from "@/data/sample";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "KamotGibo · Craft connects us" },
      { name: "description", content: HOME_COPY.description },
      { property: "og:title", content: "KamotGibo · Craft connects us" },
      { property: "og:description", content: HOME_COPY.description },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Home,
});

function Home() {
  return (
    <div className="mx-auto max-w-6xl px-4 pb-16 sm:px-6">
      <section aria-labelledby="home-title" className="mt-6 rounded-3xl bg-sand p-6 sm:p-8 md:p-10">
        <div className="mx-auto max-w-3xl text-center">
          <p className="text-sm font-bold text-primary">{HOME_COPY.eyebrow}</p>
          <h1
            id="home-title"
            className="mt-3 text-3xl font-extrabold leading-tight tracking-tight sm:text-5xl"
          >
            {HOME_COPY.title}
          </h1>
          <p className="mx-auto mt-4 max-w-2xl text-base leading-relaxed text-muted-foreground">
            {HOME_COPY.description}
          </p>
        </div>
        <div role="group" aria-labelledby="home-role-heading" className="mt-7 sm:mt-8">
          <h2 id="home-role-heading" className="text-center text-xl font-bold">
            {HOME_COPY.rolePrompt}
          </h2>
          <div className="mt-4 grid gap-4 sm:grid-cols-2">
            {(
              [
                {
                  key: "learner",
                  copy: HOME_COPY.learner,
                  to: "/learn",
                  Icon: GraduationCap,
                  variant: "hero",
                  accent: "bg-coral-soft text-primary",
                },
                {
                  key: "artisan",
                  copy: HOME_COPY.artisan,
                  to: "/teach",
                  Icon: HandHeart,
                  variant: "sea",
                  accent: "bg-sea-soft text-sea",
                },
              ] as const
            ).map(({ key, copy, to, Icon, variant, accent }) => (
              <article
                key={key}
                aria-labelledby={`home-${key}-title`}
                className="flex min-w-0 flex-col rounded-2xl border bg-card p-5 shadow-card sm:p-6"
              >
                <div className="flex items-center gap-3">
                  <span className={`grid size-11 shrink-0 place-items-center rounded-xl ${accent}`}>
                    <Icon aria-hidden="true" className="size-6" />
                  </span>
                  <h3 id={`home-${key}-title`} className="text-xl font-bold">
                    {copy.title}
                  </h3>
                </div>
                <p className="mb-5 mt-3 flex-1 text-sm leading-relaxed text-muted-foreground">
                  {copy.description}
                </p>
                <Button asChild variant={variant} size="lg" className="w-full">
                  <Link to={to} search={{}}>
                    {copy.cta} <ArrowRight aria-hidden="true" />
                  </Link>
                </Button>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section aria-labelledby="crafts-heading" className="mt-12 sm:mt-16">
        <p className="text-sm font-semibold text-primary">Made in Sorsogon</p>
        <h2 id="crafts-heading" className="mt-1 text-2xl font-extrabold sm:text-3xl">
          {HOME_COPY.craftsHeading}
        </h2>
        <ul aria-label="Local crafts" className="mt-5 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {CRAFTS.map((craft) => (
            <li key={craft.name} className="overflow-hidden rounded-2xl border bg-card">
              <CraftArt craft={craft.name} className="h-32 w-full" />
              <div className="p-4">
                <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                  {craft.local}
                </p>
                <h3 className="mt-1 text-lg font-bold">{craft.name}</h3>
                <p className="mt-1 text-sm text-muted-foreground">{craft.blurb}</p>
              </div>
            </li>
          ))}
        </ul>
      </section>

      <section
        aria-labelledby="story-heading"
        className="mt-12 grid gap-3 border-y py-8 sm:mt-16 sm:grid-cols-[minmax(0,.8fr)_minmax(0,1.2fr)] sm:gap-8 sm:py-10"
      >
        <div>
          <p className="text-sm font-semibold text-primary">{HOME_COPY.storyEyebrow}</p>
          <h2 id="story-heading" className="mt-2 text-2xl font-extrabold sm:text-3xl">
            {HOME_COPY.storyTitle}
          </h2>
        </div>
        <p className="max-w-2xl text-base leading-relaxed text-muted-foreground">
          {HOME_COPY.storyDescription}
        </p>
      </section>

      <section aria-labelledby="steps-heading" className="mt-12 sm:mt-16">
        <h2 id="steps-heading" className="text-2xl font-extrabold sm:text-3xl">
          {HOME_COPY.stepsHeading}
        </h2>
        <ol
          aria-label={HOME_COPY.stepsHeading}
          className="mt-5 grid gap-4 sm:grid-cols-2 lg:grid-cols-3"
        >
          {HOME_COPY.steps.map((step, index) => (
            <li key={step.title} className="rounded-2xl border bg-card p-5 sm:p-6">
              <span aria-hidden="true" className="text-sm font-bold text-sea">
                {String(index + 1).padStart(2, "0")}
              </span>
              <h3 className="mt-3 text-lg font-bold">{step.title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                {step.description}
              </p>
            </li>
          ))}
        </ol>
      </section>
    </div>
  );
}
