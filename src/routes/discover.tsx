import { useRef, useState } from "react";
import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { ChevronDown, Search, SearchX, SlidersHorizontal } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { FilterChips } from "@/components/kg/FilterChips";
import { WorkshopCard } from "@/components/kg/WorkshopCard";
import heroImage from "@/assets/hero-craft-table.jpg";
import potteryImage from "@/assets/pottery-workbench-textured.svg";
import {
  CRAFTS,
  DISCOVER_COPY,
  LEVELS,
  TOWNS,
  filterWorkshops,
  type WorkshopFilters,
} from "@/data/sample";
import { validateWorkshopSearch } from "@/lib/workshop-search";
import { getWorkshops, useDemoProgress } from "@/lib/demo-store";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/discover")({
  validateSearch: validateWorkshopSearch,
  head: () => ({
    meta: [
      { title: "Discover workshops · KamotGibo" },
      {
        name: "description",
        content:
          "Browse hands-on craft workshops across Sorsogon by town, craft, level, schedule and fee.",
      },
      { property: "og:title", content: "Discover workshops · KamotGibo" },
      { property: "og:description", content: "Browse hands-on craft workshops across Sorsogon." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Discover,
});

function Discover() {
  const filters = Route.useSearch();
  const navigate = useNavigate({ from: "/discover" });
  const searchInput = useRef<HTMLInputElement>(null);
  const [filtersOpen, setFiltersOpen] = useState(false);
  const progress = useDemoProgress();
  const results = filterWorkshops(getWorkshops(progress), filters);
  const active = Object.values(filters).some(Boolean);

  const set = (patch: Partial<WorkshopFilters>) =>
    navigate({
      search: (previous) => ({ ...previous, ...patch }),
      replace: true,
      resetScroll: false,
    });

  const clear = () => {
    setFiltersOpen(false);
    void navigate({ search: {}, replace: true, resetScroll: false });
    searchInput.current?.focus();
  };

  return (
    <div className="mx-auto max-w-6xl px-4 pb-3 sm:px-6">
      <section
        aria-labelledby="discover-title"
        className="mt-6 grid grid-cols-[minmax(0,1fr)_252px] items-center gap-6 rounded-2xl bg-sand px-8 py-[26px] max-[1050px]:grid-cols-[minmax(0,1fr)_200px] max-[700px]:mt-4 max-[700px]:block max-[700px]:px-5 max-[700px]:py-6"
      >
        <div>
          <h1
            id="discover-title"
            className="text-[clamp(30px,3.5vw,42px)] font-extrabold leading-[1.15] tracking-[-0.035em] max-[700px]:text-3xl"
          >
            {DISCOVER_COPY.title}
          </h1>
          <p className="mt-2.5 text-[15px] text-muted-foreground max-[700px]:text-sm">
            {DISCOVER_COPY.description}
          </p>
          <form
            role="search"
            onSubmit={(event) => {
              event.preventDefault();
              void set({ q: searchInput.current?.value || undefined });
            }}
            className="mt-5 flex min-h-14 w-full items-center gap-3 rounded-[10px] border border-input bg-card p-1.5 focus-within:ring-2 focus-within:ring-ring focus-within:ring-offset-2 max-[700px]:gap-1.5"
          >
            <Search
              className="ml-2 size-5 shrink-0 text-muted-foreground max-[700px]:hidden"
              aria-hidden="true"
            />
            <Input
              ref={searchInput}
              type="search"
              name="q"
              aria-label="Search workshops"
              placeholder="Search workshops"
              value={filters.q ?? ""}
              onChange={(event) => void set({ q: event.target.value || undefined })}
              className="h-11 min-w-0 flex-1 rounded-none border-0 bg-transparent px-0 text-base shadow-none focus-visible:ring-0 max-[700px]:px-2 md:text-base"
            />
            <Button
              type="submit"
              className="shrink-0 rounded-lg duration-200 motion-reduce:transition-none max-[700px]:px-3"
            >
              Search
            </Button>
          </form>
        </div>
        <div className="relative isolate h-[180px] w-[252px] max-[1050px]:h-[168px] max-[1050px]:w-[200px] max-[700px]:hidden">
          <div className="absolute right-0 top-0 h-[154px] w-[216px] rotate-[5deg] overflow-hidden rounded-xl shadow-lift max-[1050px]:h-[134px] max-[1050px]:w-[170px]">
            <img
              src={potteryImage}
              width={800}
              height={600}
              alt=""
              className="h-full w-full object-cover"
            />
          </div>
          <div className="absolute bottom-0 left-0 h-[154px] w-[216px] -rotate-3 overflow-hidden rounded-xl shadow-lift max-[1050px]:h-[134px] max-[1050px]:w-[170px]">
            <img
              src={heroImage}
              width={1280}
              height={1024}
              alt="Illustration of hands making shell jewelry beside abaca fiber"
              fetchPriority="high"
              className="h-full w-full object-cover"
            />
          </div>
        </div>
      </section>

      <section aria-labelledby="workshop-heading" className="mt-8 max-[700px]:mt-6">
        <div className="flex items-baseline justify-between gap-3">
          <h2 id="workshop-heading" className="text-2xl font-extrabold max-[700px]:text-xl">
            Upcoming workshops
          </h2>
          <p
            role="status"
            aria-atomic="true"
            className="whitespace-nowrap text-xs text-muted-foreground"
          >
            {results.length} {results.length === 1 ? "workshop" : "workshops"}
          </p>
        </div>
        <div className="mb-5 mt-4 flex flex-wrap items-start justify-between gap-3 max-[700px]:block">
          <div role="group" aria-label="Filter by craft" className="flex flex-wrap gap-2">
            {[
              { name: "All crafts", value: undefined },
              ...CRAFTS.map(({ name }) => ({ name, value: name })),
            ].map(({ name, value }) => (
              <Button
                key={name}
                type="button"
                variant={filters.craft === value ? "default" : "outline"}
                aria-pressed={filters.craft === value}
                onClick={() => void set({ craft: value })}
                className={cn(
                  "h-11 rounded-lg px-4 shadow-none duration-200 motion-reduce:transition-none max-[700px]:px-3 max-[700px]:text-xs",
                  filters.craft !== value && "bg-card",
                )}
              >
                {name}
              </Button>
            ))}
          </div>
          <div className="max-[700px]:mt-3">
            <Popover open={filtersOpen} onOpenChange={setFiltersOpen}>
              <PopoverTrigger asChild>
                <Button
                  type="button"
                  variant="outline"
                  className="group gap-2 rounded-lg bg-card px-4 shadow-none duration-200 motion-reduce:transition-none"
                >
                  <SlidersHorizontal aria-hidden="true" /> Filters
                  <ChevronDown
                    className="transition-transform duration-200 group-data-[state=open]:rotate-180 motion-reduce:transition-none"
                    aria-hidden="true"
                  />
                </Button>
              </PopoverTrigger>
              <PopoverContent
                align="end"
                sideOffset={8}
                aria-label="Workshop filters"
                className="grid w-[calc(100vw-2rem)] gap-x-6 gap-y-4 rounded-xl sm:w-[34rem] sm:grid-cols-2"
              >
                <FilterChips
                  label="Town"
                  options={TOWNS.map((town) => ({ value: town, label: town }))}
                  value={filters.town}
                  onChange={(town) => void set({ town })}
                />
                <FilterChips
                  label="Skill level"
                  options={LEVELS.map((level) => ({ value: level, label: level }))}
                  value={filters.level}
                  onChange={(level) => void set({ level })}
                />
                <FilterChips
                  label="Schedule"
                  options={[
                    { value: "weekend", label: "Weekends" },
                    { value: "weekday", label: "Weekdays" },
                  ]}
                  value={filters.when}
                  onChange={(when) => void set({ when })}
                />
                <FilterChips
                  label="Cost"
                  options={[
                    { value: "free", label: "Free" },
                    { value: "paid", label: "Paid" },
                  ]}
                  value={filters.cost}
                  onChange={(cost) => void set({ cost })}
                />
              </PopoverContent>
            </Popover>
          </div>
        </div>

        {results.length ? (
          <div className="grid grid-cols-1 gap-[18px] min-[541px]:grid-cols-2 min-[1051px]:grid-cols-4">
            {results.map((workshop) => (
              <WorkshopCard key={workshop.id} workshop={workshop} variant="catalog" />
            ))}
          </div>
        ) : (
          <div className="rounded-xl border bg-card px-5 py-12 text-center">
            <SearchX className="mx-auto mb-3 size-7 text-muted-foreground" aria-hidden="true" />
            <h3 className="text-xl font-bold">No matching workshops</h3>
            <p className="mt-2 text-muted-foreground">Try another craft or town.</p>
            <Button type="button" variant="link" onClick={clear} className="mt-2 text-sea">
              Clear search and filters
            </Button>
          </div>
        )}
        {active && results.length > 0 && (
          <div className="mt-3 flex justify-end">
            <Button type="button" variant="link" onClick={clear} className="text-sea">
              Clear search and filters
            </Button>
          </div>
        )}
      </section>

      <ol
        aria-label="How it works"
        className="mt-4 flex flex-wrap justify-center gap-x-7 gap-y-3 py-6 text-sm text-muted-foreground max-[700px]:justify-start max-[700px]:text-xs"
      >
        {DISCOVER_COPY.steps.map((step, index) => (
          <li key={step} className="flex items-center gap-2">
            <span aria-hidden="true" className="font-bold text-sea">
              {index + 1}.
            </span>
            {step}
          </li>
        ))}
      </ol>
    </div>
  );
}
