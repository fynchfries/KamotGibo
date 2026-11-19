import { act, cleanup, fireEvent, screen, waitFor, within } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

const KEY = "kamotgibo-learner-profile-v1";
const PNG =
  "iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mP8/x8AAwMCAO+jJ1cAAAAASUVORK5CYII=";

beforeEach(() => {
  cleanup();
  vi.restoreAllMocks();
  localStorage.clear();
  vi.resetModules();
  // jsdom lacks the resize observer used by Radix checkbox inputs.
  vi.stubGlobal(
    "ResizeObserver",
    class {
      observe() {}
      unobserve() {}
      disconnect() {}
    },
  );
});
afterEach(() => vi.unstubAllGlobals());

async function openProfile(path = "/learn") {
  const { renderDemo } = await import("./render-demo");
  const router = await renderDemo(path, true);
  const trigger = await screen.findByRole("button", { name: "Edit learner profile" });
  fireEvent.click(trigger);
  const dialog = await screen.findByRole("dialog", { name: "Edit profile" });
  return { router, trigger, dialog };
}

async function saveProfile() {
  fireEvent.click(screen.getByRole("button", { name: "Save changes" }));
  await waitFor(() => expect(screen.queryByRole("dialog")).not.toBeInTheDocument());
}

describe("learner header profile editor", () => {
  it("opens from the header and cancels edits without saving", async () => {
    const { trigger, dialog } = await openProfile();
    expect(trigger.closest("header")).not.toBeNull();
    expect(within(dialog).getByLabelText(/^Full name/)).toHaveValue("Mika Dela Cruz");
    expect(within(dialog).getByText(/fictional details only/i)).toBeInTheDocument();
    fireEvent.change(screen.getByLabelText(/^Full name/), { target: { value: "Unsaved Name" } });
    fireEvent.click(screen.getByRole("button", { name: "Cancel" }));
    await waitFor(() => expect(screen.queryByRole("dialog")).not.toBeInTheDocument());
    expect(localStorage.getItem(KEY)).toBeNull();
    expect(trigger).toHaveFocus();
    fireEvent.click(trigger);
    expect(screen.getByLabelText(/^Full name/)).toHaveValue("Mika Dela Cruz");
  });

  it.each(["/", "/teach", "/admin", "/badges/KG-4F7A-21"])(
    "does not offer the learner editor on %s",
    async (path) => {
      const { renderDemo } = await import("./render-demo");
      await renderDemo(path, true);
      expect(
        screen.queryByRole("button", { name: "Edit learner profile" }),
      ).not.toBeInTheDocument();
    },
  );

  it("saves edits into the learner identity and restores them after reload", async () => {
    localStorage.setItem("kamotgibo-demo-v1", '{"booked":["shell-jewelry-basics"]}');
    const { router } = await openProfile();
    fireEvent.change(screen.getByLabelText(/^Full name/), { target: { value: "  Alex Sample  " } });
    fireEvent.change(screen.getByLabelText("Short bio"), {
      target: { value: "Learning to weave baskets." },
    });
    fireEvent.click(screen.getByRole("checkbox", { name: "Basketry" }));
    await saveProfile();
    expect(screen.getByText("Alex Sample · Learner demo")).toBeInTheDocument();
    expect(localStorage.getItem("kamotgibo-demo-v1")).toBe('{"booked":["shell-jewelry-basics"]}');
    await act(async () => {
      await router.navigate({ to: "/learning" });
    });
    expect(screen.getByRole("heading", { name: "Kumusta, Alex Sample!" })).toBeInTheDocument();
    expect(screen.getByText("Learning to weave baskets.")).toBeInTheDocument();
    expect(within(screen.getByRole("main")).getByText("Basketry")).toBeInTheDocument();
    expect(screen.queryByText(/Only you can see this page/)).not.toBeInTheDocument();
    cleanup();
    vi.resetModules();
    const { renderDemo } = await import("./render-demo");
    await renderDemo("/learning", true);
    expect(screen.getByRole("heading", { name: "Kumusta, Alex Sample!" })).toBeInTheDocument();
  });

  it("focuses the invalid name and keeps the form open without saving", async () => {
    await openProfile();
    fireEvent.change(screen.getByLabelText(/^Full name/), { target: { value: "   " } });
    fireEvent.click(screen.getByRole("button", { name: "Save changes" }));
    await waitFor(() =>
      expect(screen.getByLabelText(/^Full name/)).toHaveAttribute("aria-invalid", "true"),
    );
    expect(screen.getByLabelText(/^Full name/)).toHaveFocus();
    expect(localStorage.getItem(KEY)).toBeNull();
  });

  it("uploads and removes a profile photo", async () => {
    const { trigger } = await openProfile();
    const image = new File(
      [Uint8Array.from(atob(PNG), (char) => char.charCodeAt(0))],
      "photo.png",
      { type: "image/png" },
    );
    fireEvent.change(screen.getByLabelText("Profile photo"), { target: { files: [image] } });
    await waitFor(() =>
      expect(screen.getByRole("img", { name: "Profile photo preview" })).toHaveAttribute(
        "src",
        `data:image/png;base64,${PNG}`,
      ),
    );
    await saveProfile();
    expect(JSON.parse(localStorage.getItem(KEY)!).photo).toBe(`data:image/png;base64,${PNG}`);
    fireEvent.click(trigger);
    fireEvent.click(screen.getByRole("button", { name: "Remove photo" }));
    await saveProfile();
    expect(JSON.parse(localStorage.getItem(KEY)!).photo).toBeNull();
  });

  it.each([
    { name: "picture.svg", type: "image/svg+xml", size: 8, message: /Choose a JPEG, PNG or WebP/ },
    { name: "large.png", type: "image/png", size: 1_048_577, message: /1 MB or smaller/ },
    { name: "empty.png", type: "image/png", size: 0, message: /could not read/i },
  ])("rejects $name without dropping other edits", async ({ name, type, size, message }) => {
    await openProfile();
    fireEvent.change(screen.getByLabelText("Short bio"), { target: { value: "Keep this draft." } });
    fireEvent.change(screen.getByLabelText("Profile photo"), {
      target: { files: [new File([new Uint8Array(size)], name, { type })] },
    });
    expect(await screen.findByRole("alert")).toHaveTextContent(message);
    expect(screen.getByLabelText("Short bio")).toHaveValue("Keep this draft.");
    expect(localStorage.getItem(KEY)).toBeNull();
  });

  it("keeps edits open and reports an unsuccessful browser save", async () => {
    await openProfile();
    fireEvent.change(screen.getByLabelText(/^Full name/), { target: { value: "Unsaved Name" } });
    vi.spyOn(Storage.prototype, "setItem").mockImplementation(() => {
      throw new DOMException("Storage full", "QuotaExceededError");
    });
    fireEvent.click(screen.getByRole("button", { name: "Save changes" }));
    expect(await screen.findByRole("alert")).toHaveTextContent(/could not save/i);
    expect(screen.getByLabelText(/^Full name/)).toHaveValue("Unsaved Name");
    expect(screen.getByRole("dialog", { name: "Edit profile" })).toBeInTheDocument();
    expect(localStorage.getItem(KEY)).toBeNull();
  });

  it("never publishes the edited full name to the badge page", async () => {
    const { router } = await openProfile();
    fireEvent.change(screen.getByLabelText(/^Full name/), { target: { value: "Alex Sample" } });
    await saveProfile();
    await act(async () => {
      await router.navigate({ to: "/badges/$code", params: { code: "KG-4F7A-21" } });
    });
    expect(
      screen.getByRole("heading", { name: "Shellcraft: Basic Stringing" }),
    ).toBeInTheDocument();
    expect(screen.queryByText(/Alex Sample/)).not.toBeInTheDocument();
    expect(screen.queryByRole("button", { name: "Edit learner profile" })).not.toBeInTheDocument();
  });
});
