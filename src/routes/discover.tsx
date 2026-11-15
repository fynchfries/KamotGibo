import { createFileRoute } from "@tanstack/react-router";
import { NextStage } from "@/components/kg/NextStage";

export const Route = createFileRoute("/discover")({
  head: () => ({
    meta: [
      { title: "Discover workshops · KamotGibo" },
      { name: "description", content: "Browse hands-on craft workshops across Sorsogon by town, craft, level and fee." },
      { property: "og:title", content: "Discover workshops · KamotGibo" },
      { property: "og:description", content: "Browse hands-on craft workshops across Sorsogon." },
    ],
  }),
  component: () => (
    <NextStage stage={2} title="Discover workshops" note="Search and filters by town, craft, level, schedule and fee arrive in the next stage." />
  ),
});
