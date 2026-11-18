import {
  createMemoryHistory,
  createRootRoute,
  createRouter,
  RouterProvider,
} from "@tanstack/react-router";
import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { WORKSHOPS, type Workshop } from "@/data/sample";
import { WorkshopCard } from "./WorkshopCard";

async function renderCard(workshop: Workshop, variant: "default" | "catalog") {
  const root = createRootRoute({
    component: () => <WorkshopCard workshop={workshop} variant={variant} />,
  });
  const router = createRouter({
    routeTree: root,
    history: createMemoryHistory({ initialEntries: ["/"] }),
  });
  await router.load();
  render(<RouterProvider router={router} />);
  return screen.findByRole("link");
}

describe.each(["default", "catalog"] as const)("WorkshopCard (%s)", (variant) => {
  it("lets learners compare the instructor, schedule, fee and availability before opening details", async () => {
    const link = await renderCard(WORKSHOPS[0]!, variant);

    expect(
      screen.getByText(variant === "catalog" ? "Nanay Rosa (sample)" : "With Nanay Rosa (sample)"),
    ).toBeInTheDocument();
    expect(screen.getByText(/Gubat/)).toBeInTheDocument();
    expect(screen.getByText(/Beginner/)).toBeInTheDocument();
    expect(screen.getByText(/9:00 AM – 12:00 PM/)).toBeInTheDocument();
    expect(screen.getByRole("heading", { name: /Shell Jewelry Basics/ })).toBeInTheDocument();
    expect(screen.getByText("PHP 300")).toBeInTheDocument();
    expect(screen.getByText(/Sat, Nov 21/)).toBeInTheDocument();
    expect(screen.getByText("4 of 10 seats left")).toBeInTheDocument();
    expect(link).toHaveAttribute("href", "/workshops/shell-jewelry-basics");
  });

  it("keeps free and full workshops clearly distinguished", async () => {
    await renderCard({ ...WORKSHOPS[3]!, fee: 0 }, variant);

    expect(screen.getByText("Free")).toBeInTheDocument();
    expect(screen.getByText("Full")).toBeInTheDocument();
    expect(screen.queryByText(/seats left/)).not.toBeInTheDocument();
  });
});
