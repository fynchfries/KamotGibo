import { cleanup, fireEvent, renderHook, screen, within } from "@testing-library/react";
import { beforeEach, describe, expect, it } from "vitest";
import { demoActions, useDemoProgress } from "@/lib/demo-store";
import { renderDemo } from "./render-demo";

beforeEach(() => {
  cleanup();
  demoActions.reset();
});

describe("demo-safe workshop sharing placement", () => {
  it("offers sharing on a workshop detail before any booking", async () => {
    await renderDemo("/workshops/abaca-weaving-101", true);
    expect(screen.getAllByRole("button", { name: "Share workshop" })).toHaveLength(2);
    expect(renderHook(useDemoProgress).result.current.booked).toEqual([]);
  });

  it("offers artisans sharing for the existing public catalogue", async () => {
    await renderDemo("/teach/workshops", true);
    const listing = screen
      .getByRole("heading", { name: "Shell Jewelry Basics: Make Your First Buskay Bracelet" })
      .closest("li")!;
    expect(within(listing).getByRole("button", { name: "Share workshop" })).toBeEnabled();
  });

  it("does not advertise a newly published browser listing as publicly shareable", async () => {
    demoActions.createWorkshop("nanay-rosa", {
      title: "Browser-only shell keychains",
      craft: "Shellcraft",
      town: "Gubat",
      level: "Beginner",
      venue: "Demo studio",
      venueNote: "",
      date: "2026-11-28",
      startTime: "09:00",
      endTime: "12:00",
      capacity: 5,
      fee: 0,
      learn: "Choose shells",
      providedMaterials: "Shells",
      bringMaterials: "",
    });
    await renderDemo("/teach/workshops", true);
    fireEvent.click(screen.getByRole("button", { name: "Publish workshop" }));
    expect(
      await screen.findByText("Your workshop is live in this demo browser."),
    ).toBeInTheDocument();
    const notice = screen.getByRole("region", { name: "Publication status" });
    expect(within(notice).getByRole("link", { name: "View workshop" })).toBeInTheDocument();
    expect(within(notice).getByRole("button", { name: "Share workshop" })).toBeDisabled();
    expect(within(notice).getByRole("button", { name: "Copy link" })).toBeDisabled();
    expect(notice).toHaveTextContent(/other people cannot open/i);
  });
});
