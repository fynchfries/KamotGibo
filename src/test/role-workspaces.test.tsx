import { act, cleanup, fireEvent, renderHook, screen, within } from "@testing-library/react";
import { beforeEach, describe, expect, it } from "vitest";
import { demoActions, useDemoProgress } from "@/lib/demo-store";
import { renderDemo } from "./render-demo";

beforeEach(() => {
  cleanup();
  demoActions.reset();
});

function menu(name: string) {
  return screen.getByRole("navigation", { name });
}
function expectArtisanMenu(name: string, active: string) {
  const nav = menu(name);
  expect(
    within(nav)
      .getAllByRole("link")
      .map((link) => [link.textContent?.trim(), link.getAttribute("href")]),
  ).toEqual([
    ["Dashboard", "/teach"],
    ["My workshops", "/teach/workshops"],
    ["Bookings", "/teach/bookings"],
    ["Application", "/teach/application"],
  ]);
  expect(nav.querySelectorAll('[aria-current="page"]')).toHaveLength(1);
  expect(within(nav).getByRole("link", { name: active })).toHaveAttribute("aria-current", "page");
}

describe("separate connected portals", () => {
  it("keeps the public landing outside both portals", async () => {
    await renderDemo("/", true);
    expect(
      screen.queryByRole("navigation", {
        name: /(?:Learner|Artisan) (?:desktop|mobile) navigation/,
      }),
    ).not.toBeInTheDocument();
    const header = screen.getByRole("banner");
    expect(within(header).queryByText(/Learner portal|Artisan portal/)).not.toBeInTheDocument();
    expect(within(header).getByRole("link", { name: "KamotGibo home" })).toHaveAttribute(
      "href",
      "/",
    );
    expect(screen.getByRole("article", { name: "For learners" })).toBeInTheDocument();
    expect(screen.getByRole("article", { name: "For artisans" })).toBeInTheDocument();
  });

  it.each([
    ["I'm a learner", "/learn", "Learner dashboard"],
    ["I'm an artisan", "/teach", "Artisan dashboard"],
  ])("opens the correct portal from Home using %s", async (label, pathname, heading) => {
    const router = await renderDemo("/", true);
    const entrances = screen.getByRole("group", { name: "Choose your path" });
    fireEvent.click(within(entrances).getByRole("link", { name: label }));
    await screen.findByRole("heading", { level: 1, name: heading });
    expect(router.state.location.pathname).toBe(pathname);
    expect(
      menu(pathname === "/teach" ? "Artisan mobile navigation" : "Learner mobile navigation"),
    ).toBeInTheDocument();
  });

  it.each([
    ["/learn", "Dashboard"],
    ["/discover", "Discover"],
    ["/workshops/shell-jewelry-basics", "Discover"],
    ["/book/shell-jewelry-basics", "Discover"],
    ["/learning", "My learning"],
    ["/badges/KG-4F7A-21", "My learning"],
    ["/learner/upskilling", "Upskilling"],
    ["/learner/upskilling/artisanal-weaving-level-ii", "Upskilling"],
  ])("uses the artisan-style sidebar/mobile shell for learner page %s", async (url, active) => {
    await renderDemo(url, true);
    for (const label of ["Learner desktop navigation", "Learner mobile navigation"]) {
      const nav = menu(label);
      expect(
        within(nav)
          .getAllByRole("link")
          .map((link) => [link.textContent?.trim(), link.getAttribute("href")]),
      ).toEqual([
        ["Dashboard", "/learn"],
        ["Discover", "/discover"],
        ["My learning", "/learning"],
        ["Upskilling", "/learner/upskilling"],
      ]);
      expect(nav.querySelectorAll('[aria-current="page"]')).toHaveLength(1);
      expect(within(nav).getByRole("link", { name: active })).toHaveAttribute(
        "aria-current",
        "page",
      );
    }
    expect(menu("Learner desktop navigation").closest("aside")).toBeInTheDocument();
    expect(screen.getByRole("link", { name: "KamotGibo learner dashboard" })).toHaveAttribute(
      "href",
      "/learn",
    );
    expect(
      screen.queryByRole("navigation", { name: "Artisan desktop navigation" }),
    ).not.toBeInTheDocument();
  });

  it("restores neutral Home when returning from either portal", async () => {
    const router = await renderDemo("/", true);
    fireEvent.click(screen.getByRole("link", { name: "I'm an artisan" }));
    await screen.findByRole("heading", { level: 1, name: "Artisan dashboard" });
    await act(async () => {
      router.history.back();
    });
    await screen.findByRole("heading", {
      level: 1,
      name: "For the hands that teach. For the hands that learn.",
    });
    expect(
      screen.queryByRole("navigation", {
        name: /(?:Learner|Artisan) (?:desktop|mobile) navigation/,
      }),
    ).not.toBeInTheDocument();
    fireEvent.click(screen.getByRole("link", { name: "I'm a learner" }));
    await screen.findByRole("heading", { level: 1, name: "Learner dashboard" });
    fireEvent.click(
      within(screen.getByRole("contentinfo")).getByRole("link", { name: "Platform home" }),
    );
    await screen.findByRole("heading", {
      level: 1,
      name: "For the hands that teach. For the hands that learn.",
    });
    expect(
      screen.queryByRole("navigation", {
        name: /(?:Learner|Artisan) (?:desktop|mobile) navigation/,
      }),
    ).not.toBeInTheDocument();
  });

  it.each([
    ["/teach", "Dashboard", "Artisan dashboard"],
    ["/teach/workshops", "My workshops", "My workshops"],
    ["/teach/bookings", "Bookings", "Bookings & attendance"],
    ["/teach/application", "Application", "Your application"],
  ])("renders an actual artisan page at %s", async (url, active, heading) => {
    await renderDemo(url, true);
    expect(screen.getByRole("heading", { level: 1, name: heading })).toBeInTheDocument();
    expectArtisanMenu("Artisan desktop navigation", active);
    expectArtisanMenu("Artisan mobile navigation", active);
    expect(
      screen.queryByRole("link", { name: /^(Learner view|Artisan view)$/ }),
    ).not.toBeInTheDocument();
    expect(
      screen.queryByRole("navigation", { name: "Learner mobile navigation" }),
    ).not.toBeInTheDocument();
    expect(screen.getByRole("link", { name: "KamotGibo artisan dashboard" })).toHaveAttribute(
      "href",
      "/teach",
    );
    if (active !== "Application")
      expect(document.querySelector('form[aria-label="Artisan application"]')).toBeNull();
  });

  it.each([
    ["workshops", "/teach/workshops", "My workshops"],
    ["application", "/teach/application", "Your application"],
    ["bookings", "/teach/bookings", "Bookings & attendance"],
  ])("redirects the old %s panel URL to its own page", async (view, pathname, heading) => {
    const router = await renderDemo(`/teach?view=${view}&workshopId=shell-jewelry-basics`);
    expect(router.state.location.pathname).toBe(pathname);
    expect(screen.getByRole("heading", { level: 1, name: heading })).toBeInTheDocument();
    expect(router.state.location.search).not.toHaveProperty("view");
    if (view === "bookings")
      expect(router.state.location.search).toMatchObject({ workshopId: "shell-jewelry-basics" });
  });

  it.each(["bogus", "__proto__", '["bookings"]'])(
    "keeps malformed legacy views safe: %s",
    async (view) => {
      await renderDemo(`/teach?view=${encodeURIComponent(view)}`);
      expect(
        screen.getByRole("heading", { level: 1, name: "Artisan dashboard" }),
      ).toBeInTheDocument();
    },
  );

  it("preserves application input across real page changes and Back/Forward", async () => {
    const router = await renderDemo("/teach/application", true);
    fireEvent.change(screen.getByLabelText("Provider name"), {
      target: { value: "Unsubmitted artisan" },
    });
    fireEvent.click(
      within(menu("Artisan desktop navigation")).getByRole("link", { name: "Bookings" }),
    );
    await screen.findByRole("heading", { level: 1, name: "Bookings & attendance" });
    expect(document.querySelector('form[aria-label="Artisan application"]')).toBeNull();
    await act(async () => {
      router.history.back();
    });
    await screen.findByRole("heading", { level: 1, name: "Your application" });
    expect(screen.getByLabelText("Provider name")).toHaveValue("Unsubmitted artisan");
    await act(async () => {
      router.history.forward();
    });
    await screen.findByRole("heading", { level: 1, name: "Bookings & attendance" });
  });

  it("preserves an entered workshop form when returning from another artisan page", async () => {
    const router = await renderDemo("/teach/workshops", true);
    fireEvent.click(screen.getByRole("button", { name: "Create workshop" }));
    fireEvent.change(screen.getByLabelText("Workshop title"), {
      target: { value: "Unfinished shell workshop" },
    });
    fireEvent.click(
      within(menu("Artisan desktop navigation")).getByRole("link", { name: "Application" }),
    );
    await screen.findByRole("heading", { level: 1, name: "Your application" });
    expect(document.querySelector('form[aria-label="Create workshop"]')).toBeNull();
    await act(async () => {
      router.history.back();
    });
    await screen.findByRole("heading", { level: 1, name: "My workshops" });
    expect(screen.getByLabelText("Workshop title")).toHaveValue("Unfinished shell workshop");
    fireEvent.click(screen.getByRole("button", { name: "Cancel" }));
    await act(async () => {
      await router.navigate({ to: "/teach/application" });
    });
    await act(async () => {
      await router.navigate({ to: "/teach/workshops" });
    });
    expect(screen.queryByRole("form", { name: "Create workshop" })).not.toBeInTheDocument();
    fireEvent.click(screen.getByRole("button", { name: "Create workshop" }));
    expect(screen.getByLabelText("Workshop title")).toHaveValue(
      "Shell Jewelry Basics: Make Your First Buskay Bracelet",
    );
  });

  it("keeps published listing previews separate from the artisan's current page", async () => {
    await renderDemo("/teach/workshops");
    expect(screen.getByRole("link", { name: "Preview listing" })).toHaveAttribute(
      "target",
      "_blank",
    );
  });

  it.each(["/teach/session", "/teach/session/"])(
    "returns from %s to the selected booking page without learner shortcuts",
    async (path) => {
      demoActions.book("shell-jewelry-basics");
      const router = await renderDemo(`${path}?workshopId=shell-jewelry-basics`, true);
      expect(
        within(menu("Artisan desktop navigation")).getByRole("link", { name: "Bookings" }),
      ).toHaveAttribute("aria-current", "page");
      expect(screen.queryByRole("link", { name: /Switch to.*view/i })).not.toBeInTheDocument();
      fireEvent.click(screen.getByRole("link", { name: "Back to bookings" }));
      await screen.findByRole("heading", { level: 1, name: "Bookings & attendance" });
      expect(router.state.location.pathname).toBe("/teach/bookings");
      expect(router.state.location.search).toMatchObject({ workshopId: "shell-jewelry-basics" });
      expect(screen.getByRole("list", { name: "Workshop reservations" })).toHaveTextContent("Mika");
    },
  );

  it("keeps booking confirmation in the learner portal while updating artisan data", async () => {
    await renderDemo("/book/shell-jewelry-basics", true);
    const main = screen.getByRole("main");
    expect(within(main).getByRole("link", { name: /Go to My learning/ })).toBeInTheDocument();
    expect(
      within(main).queryByRole("link", { name: /instructor|Artisan view|switch/i }),
    ).not.toBeInTheDocument();
    expect(renderHook(useDemoProgress).result.current.booked).toEqual(["shell-jewelry-basics"]);
  });

  it.each(["/admin", "/admin/"])(
    "keeps %s separate and returns approval work to the workshop page",
    async (path) => {
      await renderDemo(path, true);
      expect(screen.getByText("Admin demo", { exact: true })).toBeInTheDocument();
      expect(
        screen.queryByRole("navigation", {
          name: /(?:Learner|Artisan) (?:desktop|mobile) navigation/,
        }),
      ).not.toBeInTheDocument();
      expect(
        screen.queryByRole("link", { name: /^(Learner view|Artisan view)$/ }),
      ).not.toBeInTheDocument();
      expect(screen.getByRole("link", { name: "Back to artisan workspace" })).toHaveAttribute(
        "href",
        "/teach/workshops",
      );
    },
  );
});
