import { createFileRoute } from "@tanstack/react-router";
import { NextStage } from "@/components/kg/NextStage";

export const Route = createFileRoute("/learning")({
  head: () => ({
    meta: [
      { title: "My learning · KamotGibo" },
      { name: "description", content: "Your bookings, attendance, milestones and platform skill-verified badges." },
      { property: "og:title", content: "My learning · KamotGibo" },
      { property: "og:description", content: "Your bookings, attendance and badges." },
    ],
  }),
  component: () => (
    <NextStage stage={3} title="My learning" note="Mika's bookings, attendance, milestones and badges arrive in Stage 3." />
  ),
});
