import { createFileRoute, Outlet } from "@tanstack/react-router";

export const Route = createFileRoute("/learner/upskilling")({
  head: () => ({ meta: [{ name: "robots", content: "noindex" }] }),
  component: Outlet,
});
