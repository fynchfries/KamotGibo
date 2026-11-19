import { useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { ArtisanPage } from "@/components/kg/ArtisanPortal";
import { ArtisanApplicationForm } from "@/components/kg/ArtisanApplicationForm";
import { ARTISAN_SECTIONS } from "@/data/sample";
import { useArtisanPortal } from "@/lib/artisan-portal";

export const Route = createFileRoute("/teach/application")({
  head: () => ({
    meta: [
      { title: "Your application · KamotGibo" },
      { name: "description", content: ARTISAN_SECTIONS.application.description },
      { name: "robots", content: "noindex" },
    ],
  }),
  component: ArtisanApplication,
});

function ArtisanApplication() {
  const { provider } = useArtisanPortal();
  const [submitted, setSubmitted] = useState(false);
  return (
    <ArtisanPage section="application">
      {submitted && (
        <p
          role="status"
          className="mt-5 rounded-xl border border-success/30 bg-success-soft px-4 py-3 text-sm font-semibold"
        >
          Application submitted for review.
        </p>
      )}
      <section className="mt-5 rounded-2xl border bg-card p-5 sm:p-6">
        <h2 className="text-2xl font-semibold">Apply to teach a craft</h2>
        <p className="mt-2 text-sm text-muted-foreground">
          Artisans, cooperatives and learning centers are welcome. Submit a new application below,
          then use Demo controls to try admin review.
        </p>
        <div className="mt-4 rounded-xl bg-secondary p-4 text-sm">
          <p className="font-bold">
            {provider.name} · {provider.status}
          </p>
          <p className="mt-1 text-muted-foreground">
            {provider.status === "Approved"
              ? "You can publish workshops. Each session has its own schedule, fee and roster."
              : "You can save drafts now. Admin approval is needed before publishing."}
          </p>
          {provider.adminNote && <p className="mt-2">Changes requested: {provider.adminNote}</p>}
        </div>
        <ArtisanApplicationForm onSubmitted={() => setSubmitted(true)} />
      </section>
    </ArtisanPage>
  );
}
