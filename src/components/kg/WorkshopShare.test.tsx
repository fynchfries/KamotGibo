import { cleanup, fireEvent, render, screen, waitFor } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { WORKSHOPS } from "@/data/sample";
import { getShareCounts } from "@/lib/share-analytics";
import { WorkshopShare } from "./WorkshopShare";

const ORIGIN = "https://kamotgibo.lovable.app";
const URL = `${ORIGIN}/workshops/shell-jewelry-basics`;
function api(name: string, value: unknown) {
  Object.defineProperty(navigator, name, { configurable: true, value });
}
async function open(origin = ORIGIN) {
  render(<WorkshopShare workshop={WORKSHOPS[0]!} origin={origin} />);
  fireEvent.click(screen.getByRole("button", { name: "Share workshop" }));
  return screen.findByRole("dialog", { name: "Share workshop" });
}
beforeEach(() => {
  cleanup();
  localStorage.clear();
  vi.stubGlobal("isSecureContext", true);
  vi.stubGlobal(
    "ResizeObserver",
    class {
      observe() {}
      unobserve() {}
      disconnect() {}
    },
  );
  api("share", undefined);
  api("canShare", undefined);
  api("clipboard", undefined);
});
afterEach(() => {
  for (const name of ["share", "canShare", "clipboard"]) Reflect.deleteProperty(navigator, name);
  vi.restoreAllMocks();
  vi.unstubAllGlobals();
});

describe("workshop share control", () => {
  it("offers a correctly encoded Facebook intent and counts selection, not a completed post", async () => {
    await open();
    const facebook = screen.getByRole("link", { name: "Share to Facebook" });
    expect(new globalThis.URL(facebook.getAttribute("href")!).searchParams.get("u")).toBe(URL);
    expect(facebook).toHaveAttribute("target", "_blank");
    expect(facebook).toHaveAttribute("rel", "noopener noreferrer");
    facebook.addEventListener("click", (event) => event.preventDefault());
    fireEvent.click(facebook);
    expect(getShareCounts()["shell-jewelry-basics"]?.facebook_selected).toBe(1);
    expect(screen.queryByText(/successfully posted|shared on Facebook/i)).not.toBeInTheDocument();
  });

  it("reports copy success only after the browser writes the canonical link", async () => {
    const writeText = vi.fn().mockResolvedValue(undefined);
    api("clipboard", { writeText });
    await open();
    fireEvent.click(screen.getByRole("button", { name: "Copy link" }));
    expect(await screen.findByRole("status")).toHaveTextContent("Workshop link copied");
    expect(writeText).toHaveBeenCalledWith(URL);
    expect(getShareCounts()["shell-jewelry-basics"]?.link_copied).toBe(1);
  });

  it("keeps a selectable link and does not fake success when clipboard access is denied", async () => {
    api("clipboard", {
      writeText: vi.fn().mockRejectedValue(new DOMException("Denied", "NotAllowedError")),
    });
    await open();
    fireEvent.click(screen.getByRole("button", { name: "Copy link" }));
    expect(await screen.findByRole("alert")).toHaveTextContent(/could not copy/i);
    expect(screen.getByRole("textbox", { name: "Workshop link" })).toHaveValue(URL);
    expect(screen.queryByText("Workshop link copied")).not.toBeInTheDocument();
    expect(getShareCounts()["shell-jewelry-basics"]?.link_copied).toBe(0);
  });

  it("provides manual selection if Clipboard API is unavailable", async () => {
    await open();
    fireEvent.click(screen.getByRole("button", { name: "Copy link" }));
    expect(await screen.findByRole("alert")).toHaveTextContent(/select.*link/i);
    expect(screen.getByRole("textbox", { name: "Workshop link" })).toHaveFocus();
  });

  it("shares native title/text/URL directly and records only a completed API handoff", async () => {
    const share = vi.fn().mockResolvedValue(undefined);
    api("share", share);
    api("canShare", () => true);
    await open();
    fireEvent.click(screen.getByRole("button", { name: "Native device share" }));
    await waitFor(() => expect(screen.queryByRole("dialog")).not.toBeInTheDocument());
    expect(share).toHaveBeenCalledWith({
      title: "Shell Jewelry Basics: Make Your First Buskay Bracelet · KamotGibo",
      text: "Learn shellcraft with Nanay Rosa (sample) in Gubat. Sat, Nov 21, 9:00 AM – 12:00 PM. PHP 300.",
      url: URL,
    });
    expect(getShareCounts()["shell-jewelry-basics"]?.native_share_used).toBe(1);
  });

  it("treats native cancellation quietly and does not count it as sharing", async () => {
    api("share", vi.fn().mockRejectedValue(new DOMException("Cancelled", "AbortError")));
    await open();
    fireEvent.click(screen.getByRole("button", { name: "Native device share" }));
    await waitFor(() =>
      expect(screen.getByRole("button", { name: "Native device share" })).toBeEnabled(),
    );
    expect(screen.queryByRole("alert")).not.toBeInTheDocument();
    expect(getShareCounts()["shell-jewelry-basics"]?.native_share_used).toBe(0);
  });

  it("shows manual alternatives after a native permissions/policy failure", async () => {
    api("share", vi.fn().mockRejectedValue(new DOMException("Blocked", "NotAllowedError")));
    await open();
    fireEvent.click(screen.getByRole("button", { name: "Native device share" }));
    expect(await screen.findByRole("alert")).toHaveTextContent(/device sharing.*unavailable/i);
    expect(screen.getByRole("button", { name: "Copy link" })).toBeEnabled();
    expect(screen.getByRole("link", { name: "Share to Facebook" })).toBeInTheDocument();
  });

  it("prevents duplicate native requests while a share is pending", async () => {
    let finish!: () => void;
    api(
      "share",
      vi.fn(
        () =>
          new Promise<void>((resolve) => {
            finish = resolve;
          }),
      ),
    );
    await open();
    const native = screen.getByRole("button", { name: "Native device share" });
    fireEvent.click(native);
    await waitFor(() => expect(native).toBeDisabled());
    expect(getShareCounts()["shell-jewelry-basics"]?.native_share_used).toBe(0);
    finish();
    await waitFor(() => expect(screen.queryByRole("dialog")).not.toBeInTheDocument());
    expect(getShareCounts()["shell-jewelry-basics"]?.native_share_used).toBe(1);
  });

  it("does not invent a Messenger integration or unavailable device capability", async () => {
    await open();
    expect(screen.getByRole("button", { name: "Native device share" })).toBeDisabled();
    expect(screen.getByText(/Messenger/)).toHaveTextContent(/device.*share menu/i);
    expect(screen.queryByRole("link", { name: /Messenger/ })).not.toBeInTheDocument();
  });

  it("respects canShare returning false", async () => {
    api("share", vi.fn());
    api("canShare", () => false);
    await open();
    expect(screen.getByRole("button", { name: "Native device share" })).toBeDisabled();
  });

  it("warns about development links rather than promoting them publicly", async () => {
    api("share", vi.fn());
    await open("http://localhost:4184");
    expect(screen.getByText(/Development link/)).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Share to Facebook" })).toBeDisabled();
    expect(screen.getByRole("button", { name: "Native device share" })).toBeDisabled();
    expect(screen.getByRole("textbox", { name: "Workshop link" })).toHaveValue(
      "http://localhost:4184/workshops/shell-jewelry-basics",
    );
  });

  it("disables browser-only listings without exposing a broken public URL", () => {
    render(
      <WorkshopShare workshop={{ ...WORKSHOPS[0]!, id: "workshop-local-only" }} origin={ORIGIN} />,
    );
    expect(screen.getByRole("button", { name: "Share workshop" })).toBeDisabled();
    expect(screen.queryByRole("textbox")).not.toBeInTheDocument();
    expect(localStorage.getItem("kamotgibo-share-counts-v1")).toBeNull();
  });

  it("moves keyboard focus into the mobile share sheet", async () => {
    const width = window.innerWidth;
    Object.defineProperty(window, "innerWidth", { configurable: true, value: 375 });
    try {
      const dialog = await open();
      await waitFor(() => expect(dialog.contains(document.activeElement)).toBe(true));
    } finally {
      Object.defineProperty(window, "innerWidth", { configurable: true, value: width });
    }
  });

  it("dismisses with Escape, restores focus and counts an opening once", async () => {
    await open();
    fireEvent.keyDown(document.activeElement ?? document.body, { key: "Escape" });
    await waitFor(() => expect(screen.queryByRole("dialog")).not.toBeInTheDocument());
    expect(screen.getByRole("button", { name: "Share workshop" })).toHaveFocus();
    expect(getShareCounts()["shell-jewelry-basics"]?.share_opened).toBe(1);
  });
});
