import {
  act,
  cleanup,
  fireEvent,
  renderHook,
  screen,
  waitFor,
  within,
} from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { demoActions, useDemoProgress } from "@/lib/demo-store";
import { renderDemo } from "./render-demo";

const workshop = {
  title: "Shell Keychains",
  craft: "Shellcraft" as const,
  town: "Gubat" as const,
  level: "Beginner" as const,
  venue: "Demo craft studio",
  venueNote: "Blue gate",
  date: "2026-11-28",
  startTime: "09:00",
  endTime: "12:00",
  capacity: 1,
  fee: 150,
  learn: "Choose shells\nString a keychain",
  providedMaterials: "Shells",
  bringMaterials: "Apron",
};
function createWorkshop(published = true) {
  const id = demoActions.createWorkshop("nanay-rosa", workshop);
  if (published) demoActions.publishWorkshop(id);
  return id;
}

beforeEach(() => {
  cleanup();
  demoActions.reset();
});

async function openView(
  router: Awaited<ReturnType<typeof renderDemo>>,
  view: "application" | "workshops" | "bookings",
) {
  await act(async () => {
    const paths = {
      application: "/teach/application",
      workshops: "/teach/workshops",
      bookings: "/teach/bookings",
    } as const;
    await router.navigate({ to: paths[view] });
  });
}
function fill(label: string, value: string) {
  fireEvent.change(screen.getByLabelText(label), { target: { value } });
}

describe("artisan teaching space", () => {
  it("shows accessible application errors without submitting empty details", async () => {
    const router = await renderDemo("/teach");
    await openView(router, "application");
    fireEvent.submit(screen.getByRole("form", { name: "Artisan application" }));
    await waitFor(() =>
      expect(screen.getByLabelText("Provider name")).toHaveAttribute("aria-invalid", "true"),
    );
    expect(screen.getByLabelText("Provider name")).toHaveFocus();
    expect(renderHook(useDemoProgress).result.current.applications).toHaveLength(0);
  });

  it("connects application, approval, publishing, booking, and persisted session checks", async () => {
    const router = await renderDemo("/teach");
    await openView(router, "application");
    fill("Provider name", "Aling May (demo)");
    fill("Venue", "Demo craft studio");
    fill("First workshop", "Shell Keychains");
    fireEvent.click(screen.getByRole("button", { name: "Submit application" }));
    expect(await screen.findByText("Application submitted for review.")).toBeInTheDocument();

    await openView(router, "workshops");
    fireEvent.click(screen.getByRole("button", { name: /Create workshop/ }));
    fill("Workshop title", "Shell Keychains");
    fill("Session date", "2026-11-28");
    fill("Seats", "1");
    fill("Fee (PHP)", "150");
    fill("What learners will learn (one per line)", "Choose shells\nString a keychain");
    fill("Materials provided (one per line)", "Shells");
    fireEvent.click(screen.getByRole("button", { name: "Save draft" }));
    expect(await screen.findByText("Workshop saved as draft.")).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Publish workshop" })).toBeDisabled();

    fireEvent.click(screen.getByText("Demo controls", { exact: true }));
    fireEvent.click(screen.getByRole("link", { name: "Open admin review" }));
    const applicationCard = (
      await screen.findByRole("heading", { name: "Aling May (demo)" })
    ).closest("li")!;
    fireEvent.click(within(applicationCard).getByRole("button", { name: "Approve" }));
    expect(within(applicationCard).getByText("Approved", { exact: true })).toBeInTheDocument();
    fireEvent.click(screen.getByRole("link", { name: "Back to artisan workspace" }));
    expect(
      await screen.findByRole("heading", { level: 1, name: "My workshops" }),
    ).toBeInTheDocument();
    fireEvent.click(screen.getByRole("button", { name: "Publish workshop" }));
    const id = renderHook(useDemoProgress).result.current.workshops[0]!.id;
    await act(async () => {
      await router.navigate({ to: "/discover", search: { q: "keychains" } });
    });
    fireEvent.click(await screen.findByRole("link", { name: /View workshop/ }));
    const bookButtons = await screen.findAllByRole("link", { name: "Book a seat" });
    fireEvent.click(bookButtons[0]!);
    expect(
      await screen.findByRole("heading", { name: "Your seat is reserved" }),
    ).toBeInTheDocument();

    await openView(router, "bookings");
    expect(screen.getByText("Mika")).toBeInTheDocument();
    expect(
      screen.getByRole("heading", { name: "Workshop bookings" }).parentElement,
    ).toHaveTextContent("1 of 1 seats booked");
    fireEvent.click(screen.getByRole("link", { name: /Open session roster/ }));
    const sessionLearners = await screen.findByRole("list", { name: "Session learners" });
    const roster = within(sessionLearners).getByText("Mika").closest("li")!;
    fireEvent.click(within(roster).getByRole("button", { name: "Mark present" }));
    fireEvent.click(within(roster).getByRole("radio", { name: "Pass" }));
    expect(within(roster).getByRole("radio", { name: "Pass" })).toHaveAttribute(
      "aria-checked",
      "true",
    );
    expect(screen.queryByRole("button", { name: /Issue badge/ })).not.toBeInTheDocument();
    await act(async () => {
      await router.navigate({ to: "/learning" });
    });
    await act(async () => {
      await router.navigate({ to: "/teach/session", search: { workshopId: id } });
    });
    const restored = (await screen.findByText("Mika")).closest("li")!;
    expect(within(restored).getByRole("button", { name: "Present" })).toHaveAttribute(
      "aria-pressed",
      "true",
    );
    expect(within(restored).getByRole("radio", { name: "Pass" })).toHaveAttribute(
      "aria-checked",
      "true",
    );
  });
});

describe("connected workshop bookings", () => {
  it("preserves the booked learner to instructor to sample badge flow", async () => {
    demoActions.book("shell-jewelry-basics");
    const router = await renderDemo("/teach/session");
    const learners = screen.getByRole("list", { name: "Session learners" });
    const mika = within(learners).getByText("Mika").closest("li")!;
    expect(within(mika).getByRole("button", { name: "Issue badge" })).toBeDisabled();
    fireEvent.click(within(mika).getByRole("button", { name: "Mark present" }));
    fireEvent.click(within(mika).getByRole("radio", { name: "Pass" }));
    fireEvent.click(within(mika).getByRole("button", { name: "Issue badge" }));
    expect(screen.getByText("Badge issued to Mika")).toBeInTheDocument();
    expect(screen.queryByRole("link", { name: /Switch to Mika's view/ })).not.toBeInTheDocument();
    await act(async () => {
      await router.navigate({ to: "/learning" });
    });
    expect(
      await screen.findByRole("link", { name: /Shellcraft: Basic Stringing/ }),
    ).toBeInTheDocument();
  });

  it("discovers a published artisan workshop and opens its detail page", async () => {
    const id = createWorkshop();
    await renderDemo("/discover?q=keychains");
    expect(await screen.findByText("1 workshop")).toBeInTheDocument();
    fireEvent.click(screen.getByRole("link", { name: /View workshop/ }));
    expect(
      await screen.findByRole("heading", { level: 1, name: "Shell Keychains" }),
    ).toBeInTheDocument();
    expect(screen.getAllByText("1 of 1 seats left")).toHaveLength(2);
    expect(screen.getByText(/Badge issuance in this prototype/)).toBeInTheDocument();
    expect(screen.getAllByRole("link", { name: "Book a seat" })[0]).toHaveAttribute(
      "href",
      `/book/${id}`,
    );
  });

  it("confirms the last seat, keeps it confirmed on revisits, and shows it in My learning", async () => {
    const id = createWorkshop();
    const router = await renderDemo(`/book/${id}`);
    expect(
      await screen.findByRole("heading", { name: "Your seat is reserved" }),
    ).toBeInTheDocument();
    fireEvent.click(screen.getByRole("link", { name: /Go to My learning/ }));
    expect(await screen.findByRole("link", { name: /Shell Keychains/ })).toBeInTheDocument();
    fireEvent.click(screen.getByRole("link", { name: /Shell Keychains/ }));
    expect(
      await screen.findByRole("heading", { name: "Your seat is reserved" }),
    ).toBeInTheDocument();
    await act(async () => {
      await router.navigate({ to: "/workshops/$id", params: { id } });
    });
    expect(await screen.findByRole("heading", { name: "Shell Keychains" })).toBeInTheDocument();
    expect(screen.getAllByRole("link", { name: /You're booked/ })).toHaveLength(2);
    const state = renderHook(useDemoProgress).result.current;
    expect(state.booked).toEqual([id]);
  });

  it("does not reserve unpublished workshop links", async () => {
    const id = createWorkshop(false);
    await renderDemo(`/book/${id}`);
    expect(screen.getByRole("heading", { name: "Booking not found" })).toBeInTheDocument();
    expect(renderHook(useDemoProgress).result.current.booked).toEqual([]);
  });

  it("ignores stale booking IDs instead of crashing My learning", async () => {
    localStorage.setItem("kamotgibo-demo-v1", JSON.stringify({ booked: ["removed-workshop"] }));
    vi.resetModules();
    const { renderDemo: renderReloaded } = await import("./render-demo");
    await renderReloaded("/learning");
    expect(screen.getByText("No upcoming bookings yet")).toBeInTheDocument();
  });
});
