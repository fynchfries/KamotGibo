import { createFileRoute } from "@tanstack/react-router";
import { NextStage } from "@/components/kg/NextStage";

export const Route = createFileRoute("/teach")({
  head: () => ({
    meta: [
      { title: "Teach with us · KamotGibo" },
      { name: "description", content: "Artisans, cooperatives and learning centers can list in-person workshops after an admin review." },
      { property: "og:title", content: "Teach with us · KamotGibo" },
      { property: "og:description", content: "List in-person craft workshops after an admin review." },
    ],
  }),
  component: () => (
    <NextStage stage={4} title="Teach with us" note="The instructor view and admin review arrive in Stage 4." />
  ),
});
