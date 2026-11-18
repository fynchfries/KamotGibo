import {
  createMemoryHistory,
  createRootRoute,
  createRoute,
  createRouter,
  RouterProvider,
} from "@tanstack/react-router";
import { fireEvent, render, screen, waitFor, within } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { Route as DiscoverRoute } from "@/routes/discover";

async function renderDiscover(initialEntry = "/discover") {
  const root = createRootRoute();
  const discover = createRoute({
    getParentRoute: () => root,
    path: "/discover",
    component: DiscoverRoute.options.component!,
    validateSearch: DiscoverRoute.options.validateSearch!,
  });
  const router = createRouter({
    routeTree: root.addChildren([discover]),
    history: createMemoryHistory({ initialEntries: [initialEntry] }),
  });
  await router.load();
  render(<RouterProvider router={router} />);
  await screen.findByRole("heading", { level: 1 });
  return router;
}

async function chooseFilter(label: string, option: string) {
  const group = screen.getByRole("group", { name: label });
  fireEvent.click(within(group).getByRole("button", { name: option }));
}

describe("Discover catalog", () => {
  it("uses the compact landing catalog layout and shows all four workshops", async () => {
    await renderDiscover();

    expect(screen.getByRole("heading", { level: 1 })).toHaveTextContent("Learn a local craft.");
    expect(screen.getByRole("searchbox", { name: "Search workshops" })).toBeInTheDocument();
    expect(screen.getByText("4 workshops")).toBeInTheDocument();
    expect(screen.getAllByRole("link", { name: /View workshop/ })).toHaveLength(4);
    expect(screen.getByText("Free")).toBeInTheDocument();
    expect(screen.getByText("Full")).toBeInTheDocument();
    expect(
      within(screen.getByRole("list", { name: "How it works" })).getAllByRole("listitem"),
    ).toHaveLength(3);
  });

  it("applies all supported search filters from a shareable URL", async () => {
    const router = await renderDiscover(
      "/discover?q=Bulan&craft=Basketry&town=Bulan&level=Intermediate&when=weekday&cost=paid",
    );

    expect(await screen.findByText("1 workshop")).toBeInTheDocument();
    expect(router.state.location.search).toMatchObject({
      q: "Bulan",
      craft: "Basketry",
      town: "Bulan",
      level: "Intermediate",
      when: "weekday",
      cost: "paid",
    });
    expect(screen.getByRole("link", { name: /View workshop/ })).toHaveAttribute(
      "href",
      "/workshops/rattan-basketry",
    );
  });

  it("keeps a selected town after closing and reopening the filter popover", async () => {
    const router = await renderDiscover();
    const trigger = screen.getByRole("button", { name: /Filters/ });
    fireEvent.click(trigger);
    const dialog = await screen.findByRole("dialog", { name: "Workshop filters" });

    await chooseFilter("Town", "Bulan");
    await waitFor(() => expect(router.state.location.search).toMatchObject({ town: "Bulan" }));
    fireEvent.keyDown(dialog, { key: "Escape" });
    await waitFor(() => expect(screen.queryByRole("dialog")).not.toBeInTheDocument());
    fireEvent.click(trigger);

    const town = await screen.findByRole("group", { name: "Town" });
    expect(within(town).getByRole("button", { name: "Bulan" })).toHaveAttribute(
      "aria-pressed",
      "true",
    );
  });

  it("clears a no-results search and restores all workshops", async () => {
    await renderDiscover("/discover?q=clay&craft=Pottery&town=Gubat");

    expect(await screen.findByText("0 workshops")).toBeInTheDocument();
    const emptyState = screen.getByRole("heading", {
      name: "No matching workshops",
    }).parentElement!;
    fireEvent.click(within(emptyState).getByRole("button", { name: "Clear search and filters" }));
    await waitFor(() => expect(screen.getByText("4 workshops")).toBeInTheDocument());
  });
});
