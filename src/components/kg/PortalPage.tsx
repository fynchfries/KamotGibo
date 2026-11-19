import type { ReactNode } from "react";

export function PortalPage({
  eyebrow,
  title,
  description,
  identity,
  children,
}: {
  eyebrow: string;
  title: string;
  description: string;
  identity: string;
  children: ReactNode;
}) {
  return (
    <div className="mx-auto max-w-6xl px-4 pb-8 pt-6 sm:px-6">
      <section className="relative overflow-hidden rounded-3xl bg-sea p-6 text-sea-foreground sm:p-9">
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 bg-scallop opacity-15"
        />
        <div className="relative max-w-2xl">
          <p className="text-sm font-bold uppercase tracking-widest text-sea-foreground/80">
            {eyebrow}
          </p>
          <h1 className="mt-2 text-3xl font-semibold sm:text-4xl">{title}</h1>
          <p className="mt-3 text-lg text-sea-foreground/90">{description}</p>
          <p className="mt-4 break-words text-sm font-semibold text-sea-foreground/90">
            {identity}
          </p>
        </div>
      </section>
      {children}
    </div>
  );
}
