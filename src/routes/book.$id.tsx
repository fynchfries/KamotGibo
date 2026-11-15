import { createFileRoute } from "@tanstack/react-router";
import { NextStage } from "@/components/kg/NextStage";

export const Route = createFileRoute("/book/$id")({
  head: () => ({
    meta: [
      { title: "Booking confirmed · KamotGibo" },
      { name: "description", content: "Your KamotGibo workshop booking: reference, venue, schedule and preparation notes." },
      { property: "og:title", content: "Booking confirmed · KamotGibo" },
      { property: "og:description", content: "Your workshop booking reference and venue." },
    ],
  }),
  component: () => (
    <NextStage stage={3} title="Booking confirmation" note="Booking reference, venue, instructor, fee and preparation notes arrive in Stage 3." />
  ),
});
