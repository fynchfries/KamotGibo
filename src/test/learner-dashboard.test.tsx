import { cleanup, screen, within } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { demoActions } from "@/lib/demo-store";
import { renderDemo } from "./render-demo";

beforeEach(() => {
  cleanup();
  demoActions.reset();
});

describe("Learner dashboard", () => {
  it("shows the learner's overview and a useful empty booking state", async () => {
    await renderDemo("/learn", true);
    expect(
      screen.getByRole("heading", { level: 1, name: "Learner dashboard" }),
    ).toBeInTheDocument();
    const overview = screen.getByRole("region", { name: "Your learning overview" });
    expect(within(overview).getByText("Bookings").parentElement).toHaveTextContent("0");
    expect(within(overview).getByText("Badges").parentElement).toHaveTextContent("0");
    const next = screen.getByRole("region", { name: "Your next workshops" });
    expect(within(next).getByText("No upcoming bookings yet")).toBeInTheDocument();
    expect(within(next).getByRole("link", { name: "Find a workshop" })).toHaveAttribute(
      "href",
      "/discover",
    );
    expect(screen.queryByRole("button", { name: "Create workshop" })).not.toBeInTheDocument();
  });

  it("shows a saved reservation and links back to its booking", async () => {
    demoActions.book("shell-jewelry-basics");
    await renderDemo("/learn");
    const overview = screen.getByRole("region", { name: "Your learning overview" });
    expect(within(overview).getByText("Bookings").parentElement).toHaveTextContent("1");
    const next = screen.getByRole("region", { name: "Your next workshops" });
    expect(
      within(next).getByText("Shell Jewelry Basics: Make Your First Buskay Bracelet"),
    ).toBeInTheDocument();
    expect(within(next).getByRole("link", { name: "View booking" })).toHaveAttribute(
      "href",
      "/book/shell-jewelry-basics",
    );
  });

  it("reflects a badge issued from the artisan portal", async () => {
    demoActions.book("shell-jewelry-basics");
    demoActions.markLearner("shell-jewelry-basics", "mika", { present: true, skill: "pass" });
    demoActions.issueBadge();
    await renderDemo("/learn");
    const overview = screen.getByRole("region", { name: "Your learning overview" });
    expect(within(overview).getByText("Badges").parentElement).toHaveTextContent("1");
    expect(within(overview).getByText("Milestones").parentElement).toHaveTextContent("4/4");
    expect(screen.getByRole("link", { name: "View badge" })).toHaveAttribute(
      "href",
      "/badges/KG-4F7A-21",
    );
    expect(screen.getByRole("link", { name: "Open My learning" })).toHaveAttribute(
      "href",
      "/learning",
    );
  });

  it("ignores stale booking IDs rather than crashing the dashboard", async () => {
    localStorage.setItem("kamotgibo-demo-v1", JSON.stringify({ booked: ["removed-workshop"] }));
    vi.resetModules();
    const { renderDemo: renderReloaded } = await import("./render-demo");
    await renderReloaded("/learn");
    expect(screen.getByText("No upcoming bookings yet")).toBeInTheDocument();
    expect(
      within(screen.getByRole("region", { name: "Your learning overview" })).getByText("Bookings")
        .parentElement,
    ).toHaveTextContent("0");
  });
});
