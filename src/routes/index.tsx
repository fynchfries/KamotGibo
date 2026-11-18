import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowRight } from "lucide-react";
import { CraftArt } from "@/components/kg/CraftArt";
import { Button } from "@/components/ui/button";
import { CRAFTS, HOME_COPY } from "@/data/sample";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "KamotGibo · Sorsogon crafts, learned in person" },
      {
        name: "description",
        content: "Discover Sorsogon's local crafts and learn by making alongside local artisans.",
      },
      { property: "og:title", content: "KamotGibo · Sorsogon crafts, learned in person" },
      {
        property: "og:description",
        content: "Explore local crafts, then find a hands-on workshop in Sorsogon.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Home,
});

function Home() {
  return (
    <div className="mx-auto max-w-6xl px-4 pb-16 sm:px-6">
      <section
        aria-labelledby="home-title"
        className="mt-6 grid items-center gap-8 rounded-3xl bg-sand p-6 sm:p-8 md:grid-cols-[1.1fr_.9fr] md:p-10"
      >
        <div>
          <p className="text-sm font-bold text-primary">{HOME_COPY.eyebrow}</p>
          <h1
            id="home-title"
            className="mt-3 max-w-2xl text-4xl font-extrabold leading-tight tracking-tight sm:text-5xl"
          >
            {HOME_COPY.title}
          </h1>
          <p className="mt-4 max-w-xl text-base leading-relaxed text-muted-foreground">
            {HOME_COPY.description}
          </p>
          <div className="mt-6 flex flex-wrap gap-3">
            <Button asChild>
              <Link to="/discover">
                {HOME_COPY.primaryCta} <ArrowRight aria-hidden="true" />
              </Link>
            </Button>
            <Button asChild variant="outline" className="bg-card">
              <Link to="/teach">{HOME_COPY.secondaryCta}</Link>
            </Button>
          </div>
        </div>
        <div className="relative mx-auto w-full max-w-sm md:my-2">
          <CraftArt craft="Shellcraft" className="aspect-[4/3] rounded-2xl shadow-card" />
          <div className="absolute -bottom-4 left-4 rounded-xl border bg-card px-4 py-3 shadow-card">
            <p className="text-sm font-bold text-primary">Sorsogon, by hand</p>
            <p className="mt-1 text-xs text-muted-foreground">A place to learn by making.</p>
          </div>
        </div>
      </section>

      <section aria-labelledby="crafts-heading" className="mt-14 sm:mt-16">
        <div className="mb-5 flex flex-wrap items-end justify-between gap-3">
          <div>
            <p className="text-sm font-semibold text-primary">Made in Sorsogon</p>
            <h2 id="crafts-heading" className="mt-1 text-2xl font-extrabold sm:text-3xl">
              {HOME_COPY.craftsHeading}
            </h2>
          </div>
          <Link
            to="/discover"
            className="inline-flex items-center gap-1 text-sm font-bold text-sea underline-offset-4 hover:underline focus-visible:rounded focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
          >
            Browse all workshops <ArrowRight className="size-4" aria-hidden="true" />
          </Link>
        </div>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {CRAFTS.map((craft) => (
            <Link
              key={craft.name}
              to="/discover"
              search={{ craft: craft.name }}
              className="group overflow-hidden rounded-2xl border bg-card transition-[border-color,box-shadow] duration-200 hover:border-primary hover:shadow-lift focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring motion-reduce:transition-none"
            >
              <CraftArt
                craft={craft.name}
                className="h-36 w-full transition-transform duration-200 group-hover:scale-[1.02] motion-reduce:transition-none"
              />
              <div className="p-4">
                <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                  {craft.local}
                </p>
                <h3 className="mt-1 text-lg font-bold group-hover:text-primary">{craft.name}</h3>
                <p className="mt-1 text-sm text-muted-foreground">{craft.blurb}</p>
              </div>
            </Link>
          ))}
        </div>
      </section>

      <section
        aria-labelledby="story-heading"
        className="mt-14 grid gap-3 border-y py-8 sm:mt-16 sm:grid-cols-[minmax(0,.8fr)_minmax(0,1.2fr)] sm:gap-8 sm:py-10"
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

      <section aria-labelledby="steps-heading" className="mt-14 sm:mt-16">
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
