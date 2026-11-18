import {
  createMemoryHistory,
  createRootRoute,
  createRoute,
  createRouter,
  RouterProvider,
} from "@tanstack/react-router";
import { render, screen, within } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { CRAFTS } from "@/data/sample";
import { Route as HomeRoute } from "@/routes/index";

async function renderHome() {
  const root = createRootRoute();
  const home = createRoute({
    getParentRoute: () => root,
    path: "/",
    component: HomeRoute.options.component!,
  });
  const discover = createRoute({
    getParentRoute: () => root,
    path: "/discover",
    component: () => <h1>Discover</h1>,
  });
  const teach = createRoute({
    getParentRoute: () => root,
    path: "/teach",
    component: () => <h1>Teach</h1>,
  });
  const router = createRouter({
    routeTree: root.addChildren([home, discover, teach]),
    history: createMemoryHistory({ initialEntries: ["/"] }),
  });
  await router.load();
  render(<RouterProvider router={router} />);
  await screen.findByRole("heading", { level: 1 });
  return router;
}

describe("Home welcome page", () => {
  it("introduces the local craft experience", async () => {
    await renderHome();

    expect(screen.getByRole("heading", { level: 1 })).toHaveTextContent(
      "Learn a living craft from the hands that keep it alive.",
    );
    expect(screen.getByText(/Sorsogon crafts/i)).toBeInTheDocument();
  });

  it("links every craft category to its filtered Discover results", async () => {
    await renderHome();

    expect(screen.getByRole("heading", { name: "Explore local crafts" })).toBeInTheDocument();
    for (const craft of CRAFTS) {
      const link = screen.getByRole("link", { name: new RegExp(craft.name, "i") });
      expect(
        new URL(link.getAttribute("href")!, "http://localhost").searchParams.get("craft"),
      ).toBe(craft.name);
    }
  });

  it("explains how workshops work and links to Discover and Teach", async () => {
    await renderHome();

    expect(screen.getByRole("heading", { name: "How it works" })).toBeInTheDocument();
    expect(
      within(screen.getByRole("list", { name: "How it works" })).getAllByRole("listitem"),
    ).toHaveLength(3);
    expect(screen.getByRole("link", { name: "Explore workshops" })).toHaveAttribute(
      "href",
      "/discover",
    );
    expect(screen.getByRole("link", { name: "Teach a craft" })).toHaveAttribute("href", "/teach");
  });

  it("does not duplicate the workshop catalog", async () => {
    await renderHome();

    expect(screen.queryByRole("heading", { name: "Upcoming workshops" })).not.toBeInTheDocument();
    expect(screen.queryByRole("link", { name: /View workshop/ })).not.toBeInTheDocument();
  });
});
