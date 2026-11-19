import {
  createMemoryHistory,
  createRootRoute,
  createRoute,
  createRouter,
  RouterProvider,
} from "@tanstack/react-router";
import { render, screen, within } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { Route as HomeRoute } from "@/routes/index";

async function renderHome() {
  const root = createRootRoute();
  const home = createRoute({
    getParentRoute: () => root,
    path: "/",
    component: HomeRoute.options.component!,
  });
  const router = createRouter({
    routeTree: root.addChildren([home]),
    history: createMemoryHistory({ initialEntries: ["/"] }),
  });
  await router.load();
  render(<RouterProvider router={router} />);
  await screen.findByRole("heading", { level: 1 });
}

describe("Public landing page", () => {
  it("introduces teaching and learning rather than a learner account", async () => {
    await renderHome();
    expect(screen.getByRole("heading", { level: 1 })).toHaveTextContent(
      "For the hands that teach. For the hands that learn.",
    );
    expect(screen.getByText(/KamotGibo brings artisans and learners together/)).toBeInTheDocument();
    expect(screen.queryByRole("searchbox")).not.toBeInTheDocument();
    expect(screen.queryByRole("heading", { name: "Upcoming bookings" })).not.toBeInTheDocument();
  });

  it("gives both audiences their own clearly labelled entrance", async () => {
    await renderHome();
    const learner = screen.getByRole("article", { name: "For learners" });
    const artisan = screen.getByRole("article", { name: "For artisans" });
    expect(within(learner).getByRole("link", { name: "I'm a learner" })).toHaveAttribute(
      "href",
      "/learn",
    );
    expect(within(artisan).getByRole("link", { name: "I'm an artisan" })).toHaveAttribute(
      "href",
      "/teach",
    );
    expect(screen.getAllByRole("link")).toHaveLength(2);
  });

  it("shows craft examples as platform information, not learner navigation", async () => {
    await renderHome();
    const crafts = screen.getByRole("list", { name: "Local crafts" });
    expect(within(crafts).getAllByRole("listitem")).toHaveLength(4);
    for (const craft of ["Shellcraft", "Abaca weaving", "Basketry", "Pottery"]) {
      expect(within(crafts).getByRole("heading", { name: craft })).toBeInTheDocument();
    }
    expect(within(crafts).queryByRole("link")).not.toBeInTheDocument();
    expect(screen.queryByRole("link", { name: "Browse all workshops" })).not.toBeInTheDocument();
  });

  it("explains the platform's shared teaching and learning flow", async () => {
    await renderHome();
    const steps = screen.getByRole("list", { name: "How KamotGibo works" });
    expect(within(steps).getAllByRole("listitem")).toHaveLength(3);
    expect(within(steps).getByText("Artisans share their craft")).toBeInTheDocument();
    expect(within(steps).getByText("Learners find a workshop")).toBeInTheDocument();
    expect(within(steps).getByText("Learn and create together")).toBeInTheDocument();
  });
});
