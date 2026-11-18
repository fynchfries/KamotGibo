import { Link } from "@tanstack/react-router";
import { Compass, GraduationCap, HandHeart, House } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Logo } from "./Logo";

const NAV = [
  { to: "/", label: "Home", Icon: House },
  { to: "/discover", label: "Discover", Icon: Compass },
  { to: "/learning", label: "My learning", Icon: GraduationCap },
  { to: "/teach", label: "Teach", Icon: HandHeart },
] as const;

export function SiteHeader() {
  return (
    <header className="sticky top-0 z-40 border-b bg-card">
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-4 sm:px-6 md:h-18">
        <Logo />
        <nav className="hidden items-center gap-2 md:flex" aria-label="Main">
          {NAV.slice(1, 3).map(({ to, label }) => (
            <Link
              key={to}
              to={to}
              className="inline-flex min-h-11 items-center rounded-lg px-4 text-sm font-semibold text-muted-foreground transition-colors hover:bg-secondary hover:text-primary aria-[current=page]:bg-secondary aria-[current=page]:text-primary"
            >
              {label}
            </Link>
          ))}
          <Button asChild variant="outline-sea" className="ml-2">
            <Link to="/teach">Teach with us</Link>
          </Button>
        </nav>
      </div>
    </header>
  );
}

export function BottomNav() {
  return (
    <nav
      aria-label="Main"
      className="fixed inset-x-0 bottom-0 z-50 border-t bg-card pb-[env(safe-area-inset-bottom)] md:hidden"
    >
      <ul className="grid grid-cols-4">
        {NAV.map(({ to, label, Icon }) => (
          <li key={to}>
            <Link
              to={to}
              activeOptions={{ exact: to === "/" }}
              className="flex min-h-16 flex-col items-center justify-center gap-1 border-t-2 border-transparent text-xs font-medium text-muted-foreground transition-colors hover:text-foreground aria-[current=page]:border-primary aria-[current=page]:text-primary"
            >
              <Icon className="size-5" strokeWidth={1.75} aria-hidden="true" />
              {label}
            </Link>
          </li>
        ))}
      </ul>
    </nav>
  );
}

export function SiteFooter() {
  return (
    <footer className="border-t">
      <div className="mx-auto flex max-w-6xl flex-col gap-3 px-4 py-6 text-xs text-muted-foreground sm:flex-row sm:justify-between sm:px-6">
        <div>
          <p>
            <strong>KamotGibo</strong> · Sorsogon
          </p>
          <p className="mt-1">PotatoDevs · Enterprise MSME &amp; Agri-Business</p>
        </div>
        <p>Demo prototype · Sample data · No real bookings</p>
      </div>
    </footer>
  );
}
