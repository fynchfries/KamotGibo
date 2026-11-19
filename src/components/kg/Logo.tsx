import { Link } from "@tanstack/react-router";
import logoImage from "@/assets/kamotgibo-logo.png";
import { cn } from "@/lib/utils";

export function LogoMark({ className }: { className?: string }) {
  return (
    <img
      src={logoImage}
      alt=""
      aria-hidden="true"
      width={256}
      height={256}
      className={cn("size-9 shrink-0 object-contain", className)}
    />
  );
}

export function Logo({
  className,
  to = "/",
}: {
  className?: string;
  to?: "/" | "/learn" | "/teach" | "/admin";
}) {
  return (
    <Link
      to={to}
      search={{}}
      className={cn("flex items-center gap-2.5", className)}
      aria-label={
        to === "/teach"
          ? "KamotGibo artisan dashboard"
          : to === "/learn"
            ? "KamotGibo learner dashboard"
            : to === "/admin"
              ? "KamotGibo admin review"
              : "KamotGibo home"
      }
    >
      <LogoMark />
      <span className="font-display text-xl font-extrabold tracking-tight text-foreground">
        Kamot<span className="text-primary">Gibo</span>
      </span>
    </Link>
  );
}
