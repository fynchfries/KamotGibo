import { createFileRoute } from "@tanstack/react-router";
import { NextStage } from "@/components/kg/NextStage";

export const Route = createFileRoute("/workshops/$id")({
  head: () => ({
    meta: [
      { title: "Workshop details · KamotGibo" },
      { name: "description", content: "Schedule, venue, instructor and tools & materials for a KamotGibo workshop." },
      { property: "og:title", content: "Workshop details · KamotGibo" },
      { property: "og:description", content: "Schedule, venue, instructor and tools & materials." },
    ],
  }),
  component: () => (
    <NextStage stage={2} title="Workshop details" note="Instructor, schedule, venue, a Tools & materials box and the Book a seat button arrive in the next stage." />
  ),
});
