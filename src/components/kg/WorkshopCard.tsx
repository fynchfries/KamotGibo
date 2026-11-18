import { Link } from "@tanstack/react-router";
import { ArrowRight, CalendarDays, Clock, MapPin } from "lucide-react";
import { CraftIcon } from "./CraftArt";
import { formatFee, seatsLabel, type Craft, type Workshop } from "@/data/sample";
import { cn } from "@/lib/utils";

const CATALOG_ART: Record<Craft, string> = {
  Shellcraft: "bg-sea-soft text-sea",
  "Abaca weaving": "bg-sand bg-weave text-foreground",
  Basketry: "bg-coral-soft text-primary",
  Pottery: "bg-sand text-foreground",
};

export function WorkshopCard({
  workshop: w,
  className,
  variant = "default",
}: {
  workshop: Workshop;
  className?: string;
  variant?: "default" | "catalog";
}) {
  const full = w.seatsLeft === 0;
  const low = !full && w.seatsLeft <= 2;
  const catalog = variant === "catalog";
  return (
    <Link
      to="/workshops/$id"
      params={{ id: w.id }}
      className={cn(
        "group flex flex-col border bg-card shadow-card hover:border-primary focus-visible:border-primary",
        catalog
          ? "overflow-hidden rounded-xl transition-[border-color,box-shadow] duration-200 hover:shadow-lift motion-reduce:transition-none"
          : "rounded-2xl p-5 transition-colors",
        className,
      )}
    >
      {catalog ? (
        <div className={cn("relative grid h-26 shrink-0 place-items-center", CATALOG_ART[w.craft])}>
          <span className="absolute left-4 top-3.5 text-xs font-extrabold">{w.craft}</span>
          <span aria-hidden="true">
            <CraftIcon
              craft={w.craft}
              className={cn(
                "ml-24 size-16 [stroke-width:1.2]",
                w.craft === "Pottery" && "text-primary",
              )}
            />
          </span>
        </div>
      ) : (
        <div className="flex flex-wrap items-center justify-between gap-3">
          <span className="flex items-center gap-2 text-sm font-semibold text-primary">
            <span className="grid size-9 place-items-center rounded-lg bg-secondary">
              <CraftIcon craft={w.craft} className="size-5" />
            </span>
            {w.craft}
          </span>
          <span className="text-xs font-medium text-muted-foreground">{w.level}</span>
        </div>
      )}
      <div className={catalog ? "flex flex-1 flex-col p-4" : "contents"}>
        {catalog && <p className="text-xs text-muted-foreground">{w.instructor}</p>}
        <h3
          className={cn(
            "font-bold tracking-tight transition-colors group-hover:text-primary group-focus-visible:text-primary",
            catalog
              ? "mb-3 mt-1.5 text-[17px] leading-[1.4] duration-200 min-[541px]:min-h-[4.2em] motion-reduce:transition-none"
              : "mt-4 text-lg leading-snug",
          )}
        >
          {w.title}
        </h3>
        {!catalog && <p className="mt-2 text-sm text-muted-foreground">With {w.instructor}</p>}
        <div className={cn("mt-auto", catalog ? "pt-1" : "pt-5")}>
          <div
            className={cn(
              "text-muted-foreground",
              catalog ? "space-y-1.5 text-xs" : "space-y-2 text-sm",
            )}
          >
            <p className="flex items-center gap-2">
              <MapPin className="size-4 shrink-0" aria-hidden="true" />
              {w.town}
              {catalog && ` · ${w.level}`}
            </p>
            <p className="flex items-center gap-2">
              <CalendarDays className="size-4 shrink-0" aria-hidden="true" /> {w.nextDate}
            </p>
            <p className="flex items-center gap-2">
              <Clock className="size-4 shrink-0" aria-hidden="true" /> {w.time}
            </p>
          </div>
          <div
            className={cn(
              "flex gap-3 border-t",
              catalog ? "mt-4 flex-col pt-3" : "mt-5 flex-wrap items-end justify-between pt-4",
            )}
          >
            <div
              className={catalog ? "flex flex-wrap items-center justify-between gap-2" : undefined}
            >
              <p className="text-xl font-bold tabular-nums">{formatFee(w.fee)}</p>
              <p
                className={cn(
                  "text-xs font-medium",
                  !catalog && "mt-1",
                  full ? "text-muted-foreground" : low ? "font-bold text-coral" : "text-sea",
                  catalog && full && "rounded bg-sand px-2 py-0.5 text-foreground",
                )}
              >
                {seatsLabel(w)}
              </p>
            </div>
            <span className="flex items-center gap-1.5 text-xs font-bold text-primary">
              View workshop <ArrowRight className="size-4" aria-hidden="true" />
            </span>
          </div>
        </div>
      </div>
    </Link>
  );
}
