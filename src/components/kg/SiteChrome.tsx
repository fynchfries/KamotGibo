import { lazy, Suspense, type ReactNode } from "react";
import { Link, useRouterState } from "@tanstack/react-router";
import {
  Award,
  CalendarDays,
  Compass,
  FileText,
  GraduationCap,
  HandHeart,
  LayoutDashboard,
  Users,
  type LucideIcon,
} from "lucide-react";
import { ARTISAN_SECTIONS, LEARNER_DASHBOARD_COPY } from "@/data/sample";
import { ARTISAN_PATHS, type ArtisanView } from "@/lib/artisan-workspace";
import { cn } from "@/lib/utils";
import { Logo } from "./Logo";

const LearnerProfileButton = lazy(() =>
  import("./LearnerProfileButton").then((module) => ({ default: module.LearnerProfileButton })),
);

const LEARNER_NAV = [
  { to: "/learn", label: "Dashboard", Icon: LayoutDashboard },
  { to: "/discover", label: "Discover", Icon: Compass },
  { to: "/learning", label: "My learning", Icon: GraduationCap },
  { to: "/learner/upskilling", label: "Upskilling", Icon: Award },
] as const;
const ARTISAN_ICONS: Record<ArtisanView, LucideIcon> = {
  dashboard: LayoutDashboard,
  workshops: CalendarDays,
  bookings: Users,
  application: FileText,
};

function useWorkspace() {
  return useRouterState({
    select: ({ location }) => {
      const pathname = location.pathname.replace(/\/+$/, "");
      if (!pathname) return "public";
      if (pathname === "/teach" || pathname.startsWith("/teach/")) return "artisan";
      return pathname === "/admin" ? "admin" : "learner";
    },
  });
}

function portalLinkClass(mobile: boolean, active: boolean) {
  return cn(
    "flex items-center gap-2 font-semibold transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
    mobile
      ? "min-h-16 flex-col justify-center gap-1 border-t-2 text-xs"
      : "min-h-12 rounded-xl px-4 text-sm",
    active
      ? mobile
        ? "border-sea text-sea"
        : "bg-sea text-sea-foreground"
      : "border-transparent text-muted-foreground hover:bg-sea-soft hover:text-sea",
  );
}

function LearnerLinks({ mobile = false }: { mobile?: boolean }) {
  const pathname = useRouterState({
    select: (state) => state.location.pathname.replace(/\/+$/, ""),
  });
  const current =
    pathname === "/learn"
      ? "/learn"
      : pathname === "/learner/upskilling" || pathname.startsWith("/learner/upskilling/")
        ? "/learner/upskilling"
        : pathname === "/learning" || pathname.startsWith("/badges/")
          ? "/learning"
          : "/discover";
  return LEARNER_NAV.map(({ to, label, Icon }) => (
    <li key={to}>
      <Link
        to={to}
        search={{}}
        activeOptions={{ exact: true, includeSearch: false }}
        aria-current={current === to ? "page" : undefined}
        className={portalLinkClass(mobile, current === to)}
      >
        <Icon aria-hidden="true" className="size-5 shrink-0" strokeWidth={1.75} />
        {label}
      </Link>
    </li>
  ));
}

function ArtisanLinks({ mobile = false }: { mobile?: boolean }) {
  const pathname = useRouterState({
    select: (state) => state.location.pathname.replace(/\/+$/, ""),
  });
  const current =
    pathname === "/teach/session"
      ? "bookings"
      : ((Object.keys(ARTISAN_PATHS) as ArtisanView[]).find(
          (view) => ARTISAN_PATHS[view] === pathname,
        ) ?? "dashboard");
  return (Object.keys(ARTISAN_SECTIONS) as ArtisanView[]).map((view) => {
    const Icon = ARTISAN_ICONS[view];
    return (
      <li key={view}>
        <Link
          to={ARTISAN_PATHS[view]}
          search={{}}
          activeOptions={{ exact: true, includeSearch: false }}
          aria-current={current === view ? "page" : undefined}
          className={portalLinkClass(mobile, current === view)}
        >
          <Icon aria-hidden="true" className="size-5 shrink-0" strokeWidth={1.75} />
          {ARTISAN_SECTIONS[view].label}
        </Link>
      </li>
    );
  });
}

export function SiteHeader() {
  const workspace = useWorkspace();
  const badgePage = useRouterState({
    select: (state) => state.location.pathname.startsWith("/badges/"),
  });
  const portal = workspace === "learner" || workspace === "artisan";
  return (
    <header className={cn("sticky top-0 z-40 border-b bg-card", portal && "border-sea/20")}>
      <div
        className={cn(
          "mx-auto flex min-h-16 flex-wrap items-center justify-between gap-3 px-4 py-3 sm:px-6",
          portal ? "max-w-7xl" : "max-w-6xl",
        )}
      >
        <div className="flex min-w-0 items-center gap-3">
          <Logo
            to={
              workspace === "artisan"
                ? "/teach"
                : workspace === "learner"
                  ? "/learn"
                  : workspace === "admin"
                    ? "/admin"
                    : "/"
            }
            className="shrink-0"
          />
          {workspace !== "public" && (
            <span
              className={cn(
                "rounded-full px-2.5 py-1 text-xs font-bold",
                portal
                  ? "hidden bg-sea-soft text-sea sm:inline-flex"
                  : "bg-secondary text-muted-foreground",
              )}
            >
              {workspace === "artisan"
                ? "Artisan portal"
                : workspace === "admin"
                  ? "Admin demo"
                  : "Learner portal"}
            </span>
          )}
        </div>
        {workspace === "learner" && !badgePage && (
          <Suspense
            fallback={<span aria-hidden="true" className="size-11 rounded-full bg-sea-soft" />}
          >
            <LearnerProfileButton />
          </Suspense>
        )}
      </div>
    </header>
  );
}

export function WorkspaceLayout({ children }: { children: ReactNode }) {
  const workspace = useWorkspace();
  if (workspace !== "artisan" && workspace !== "learner") return <>{children}</>;
  const artisan = workspace === "artisan";
  const Icon = artisan ? HandHeart : GraduationCap;
  return (
    <div className="mx-auto grid max-w-7xl md:grid-cols-[220px_minmax(0,1fr)] lg:grid-cols-[240px_minmax(0,1fr)]">
      <aside className="hidden border-r border-sea/15 bg-card/50 p-4 md:block">
        <div className="sticky top-24">
          <p className="px-4 pb-3 pt-2 text-xs font-extrabold uppercase tracking-widest text-muted-foreground">
            {artisan ? "Manage your craft" : LEARNER_DASHBOARD_COPY.sidebarHeading}
          </p>
          <nav aria-label={artisan ? "Artisan desktop navigation" : "Learner desktop navigation"}>
            <ul className="space-y-1.5">{artisan ? <ArtisanLinks /> : <LearnerLinks />}</ul>
          </nav>
          <div className="mt-8 rounded-2xl bg-sea-soft/60 p-4">
            <Icon aria-hidden="true" className="size-7 text-sea" />
            <p className="mt-3 text-sm font-bold text-sea">
              {artisan ? "Kamot sa kamot" : LEARNER_DASHBOARD_COPY.sidebarTitle}
            </p>
            <p className="mt-1 text-sm leading-relaxed text-muted-foreground">
              {artisan
                ? "Keep local skills alive, one workshop at a time."
                : LEARNER_DASHBOARD_COPY.sidebarDescription}
            </p>
          </div>
        </div>
      </aside>
      <div className="min-w-0">{children}</div>
    </div>
  );
}

export function BottomNav() {
  const workspace = useWorkspace();
  if (workspace === "public" || workspace === "admin") return null;
  const artisan = workspace === "artisan";
  return (
    <nav
      aria-label={artisan ? "Artisan mobile navigation" : "Learner mobile navigation"}
      className="fixed inset-x-0 bottom-0 z-50 border-t bg-card pb-[env(safe-area-inset-bottom)] md:hidden"
    >
      <ul className="grid grid-cols-4">
        {artisan ? <ArtisanLinks mobile /> : <LearnerLinks mobile />}
      </ul>
    </nav>
  );
}

export function SiteFooter() {
  const workspace = useWorkspace();
  return (
    <footer className="border-t">
      <div className="mx-auto flex max-w-6xl flex-col gap-3 px-4 py-6 text-xs text-muted-foreground sm:flex-row sm:justify-between sm:px-6">
        <div>
          <p>
            <strong>KamotGibo</strong> · Sorsogon
          </p>
          <p className="mt-1">PotatoDevs · Enterprise MSME &amp; Agri-Business</p>
        </div>
        <div className="flex flex-wrap items-center gap-x-5 gap-y-3">
          {(workspace === "learner" || workspace === "artisan") && (
            <Link
              to="/"
              search={{}}
              className="inline-flex min-h-11 items-center rounded text-sm font-semibold text-sea underline-offset-4 hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
            >
              Platform home
            </Link>
          )}
          <p>Demo prototype · Sample data · No real bookings</p>
        </div>
      </div>
    </footer>
  );
}

export function SiteFrame({ children }: { children: ReactNode }) {
  const workspace = useWorkspace();
  const portal = workspace === "learner" || workspace === "artisan";
  return (
    <>
      <div className={cn("flex min-h-screen flex-col", portal && "pb-safe-nav md:pb-0")}>
        <SiteHeader />
        <main className="flex-1">
          <WorkspaceLayout>{children}</WorkspaceLayout>
        </main>
        <SiteFooter />
      </div>
      <BottomNav />
    </>
  );
}
