import { act, cleanup, fireEvent, screen, within } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it } from "vitest";
import { QUALIFICATIONS } from "@/data/sample";
import { demoActions } from "@/lib/demo-store";
import { renderDemo } from "./render-demo";

const PATH = "/learner/upskilling";
const DETAIL = `${PATH}/artisanal-weaving-level-ii`;
const qualificationCount = QUALIFICATIONS.length;
beforeEach(() => {
  cleanup();
  demoActions.reset();
});
afterEach(() => QUALIFICATIONS.splice(qualificationCount));

function expectActive() {
  for (const name of ["Learner desktop navigation", "Learner mobile navigation"]) {
    const nav = screen.getByRole("navigation", { name });
    expect(within(nav).getByRole("link", { name: "Upskilling" })).toHaveAttribute(
      "aria-current",
      "page",
    );
    expect(nav.querySelectorAll('[aria-current="page"]')).toHaveLength(1);
  }
}

describe("Upskilling learner journey", () => {
  it("opens a separate pathway from learner navigation and returns with Back", async () => {
    const router = await renderDemo("/learn", true);
    fireEvent.click(
      within(screen.getByRole("navigation", { name: "Learner desktop navigation" })).getByRole(
        "link",
        { name: "Upskilling" },
      ),
    );
    await screen.findByRole("heading", { name: "Take your craft skills further", level: 1 });
    expectActive();
    expect(
      screen.getByRole("heading", { name: "Microcredentials & Qualifications" }),
    ).toBeInTheDocument();
    expect(screen.getByRole("article", { name: "Artisanal Weaving Level II" })).toHaveTextContent(
      "Qualification Reference",
    );
    fireEvent.click(screen.getByRole("link", { name: "View pathway" }));
    await screen.findByRole("heading", { name: "Artisanal Weaving Level II", level: 1 });
    expect(router.state.location.pathname).toBe(DETAIL);
    expectActive();
    await act(async () => {
      router.history.back();
    });
    await screen.findByRole("heading", { name: "Take your craft skills further", level: 1 });
    expectActive();
  });

  it("links the related-workshop shortcut to the actual recommendation section", async () => {
    const router = await renderDemo(PATH, true);
    expect(screen.getByRole("link", { name: "Find related workshops" })).toHaveAttribute(
      "href",
      `${DETAIL}#recommended`,
    );
    fireEvent.click(screen.getByRole("link", { name: "Find related workshops" }));
    await screen.findByRole("heading", { name: "Recommended for this pathway" });
    expect(router.state.location.hash).toBe("recommended");
    expect(document.getElementById("recommended")).toBeInTheDocument();
  });

  it("shows competency relationships and recommends only existing mapped catalogue records", async () => {
    await renderDemo(DETAIL, true);
    expectActive();
    const core = screen.getByRole("region", { name: "Core Competencies" });
    for (const title of [
      "Conduct Pre-Weaving Activities",
      "Perform Artisanal Weaving",
      "Conduct Post-Weaving Activities",
    ]) {
      expect(within(core).getByRole("heading", { name: title })).toBeInTheDocument();
    }
    expect(within(core).getByText("Prepare abaca fiber")).toBeInTheDocument();
    expect(within(core).getByText("Finish a coaster set")).toBeInTheDocument();
    const recommended = screen.getByRole("region", { name: "Recommended for this pathway" });
    const links = within(recommended).getAllByRole("link");
    expect(links.map((link) => link.getAttribute("href"))).toEqual([
      "/workshops/abaca-weaving-101",
      "/workshops/rattan-basketry",
    ]);
    expect(recommended).toHaveTextContent("Sample catalogue workshops");
    expect(within(recommended).queryByText(/Shell Jewelry|Clay Pottery/)).not.toBeInTheDocument();
  });

  it("shows recorded attendance, not invented module or official NC II completion", async () => {
    await renderDemo(DETAIL, true);
    const learning = screen.getByRole("region", { name: "Your related learning" });
    expect(learning).toHaveTextContent("KamotGibo related learning progress");
    const weaving = within(learning).getByRole("article", { name: "Perform Artisanal Weaving" });
    expect(weaving).toHaveTextContent("Workshop attendance1");
    expect(weaving).toHaveTextContent("Passed skill checks0");
    expect(weaving).toHaveTextContent("Skill checks not yet passed1");
    expect(learning).toHaveTextContent(/Activity-level completion is not recorded/);
    expect(screen.queryByRole("progressbar")).not.toBeInTheDocument();
    expect(screen.queryByText(/\d+%.*NC II|NC II.*\d+%/)).not.toBeInTheDocument();
  });

  it("reflects a related instructor skill check without overwriting stored progress", async () => {
    demoActions.book("rattan-basketry");
    demoActions.markLearner("rattan-basketry", "mika", { present: true, skill: "pass" });
    const before = localStorage.getItem("kamotgibo-demo-v1");
    await renderDemo(DETAIL, true);
    const weaving = within(screen.getByRole("region", { name: "Your related learning" })).getByRole(
      "article",
      { name: "Perform Artisanal Weaving" },
    );
    expect(weaving).toHaveTextContent("Workshop attendance2");
    expect(weaving).toHaveTextContent("Passed skill checks1");
    expect(localStorage.getItem("kamotgibo-demo-v1")).toBe(before);
  });

  it("clearly identifies external references and separates platform badges from certification", async () => {
    await renderDemo(DETAIL, true);
    const references = screen.getByRole("region", { name: "Learning references" });
    expect(within(references).getAllByRole("link")).toHaveLength(4);
    for (const link of within(references).getAllByRole("link")) {
      expect(link).toHaveAttribute("target", "_blank");
      expect(link).toHaveAttribute("rel", "noopener noreferrer");
      expect(link.getAttribute("href")).toMatch(/^https:\/\/www\.tesda\.gov\.ph\//);
      expect(link).toHaveTextContent("External PDF");
    }
    expect(screen.getByRole("heading", { name: "About certification" })).toBeInTheDocument();
    expect(
      screen.getByText(/does not automatically grant TESDA NC II certification/),
    ).toBeInTheDocument();
    expect(screen.getByText(/KamotGibo badges are not TESDA certificates/)).toBeInTheDocument();
  });

  it("renders a second qualification and honest empty states without weaving-specific routing", async () => {
    QUALIFICATIONS.push({
      ...QUALIFICATIONS[0]!,
      id: "another-programme",
      title: "Another skills programme",
      organization: "Sample learning organization",
      level: "Programme reference",
      about: "Another programme's reference information.",
      competencies: [
        {
          id: "another-competency",
          title: "Another skill",
          description: "Explore a different skill.",
          activityIds: ["missing-activity"],
        },
      ],
      references: [],
    });
    const router = await renderDemo(PATH, true);
    const card = screen.getByRole("article", { name: "Another skills programme" });
    fireEvent.click(within(card).getByRole("link", { name: "View pathway" }));
    await screen.findByRole("heading", { name: "Another skills programme", level: 1 });
    expect(router.state.location.pathname).toBe(`${PATH}/another-programme`);
    expect(screen.getByText("Another programme's reference information.")).toBeInTheDocument();
    expect(screen.getByText("No related workshops available yet.")).toBeInTheDocument();
    expect(screen.getByText("No external learning references added yet.")).toBeInTheDocument();
    expect(screen.getByText("No mapped workshop outcomes available yet.")).toBeInTheDocument();
  });

  it("handles an unknown qualification without a crash and offers a route back", async () => {
    await renderDemo(`${PATH}/unknown-qualification`, true);
    expect(
      screen.getByRole("heading", { name: "Pathway not found", level: 1 }),
    ).toBeInTheDocument();
    expect(screen.getByRole("link", { name: "Back to Upskilling" })).toHaveAttribute("href", PATH);
    expectActive();
  });

  it("preserves My learning content and identity when returning from Upskilling", async () => {
    demoActions.book("shell-jewelry-basics");
    const before = localStorage.getItem("kamotgibo-demo-v1");
    const router = await renderDemo("/learning", true);
    const identity = screen.getByRole("heading", { level: 1 }).textContent;
    fireEvent.click(
      within(screen.getByRole("navigation", { name: "Learner mobile navigation" })).getByRole(
        "link",
        { name: "Upskilling" },
      ),
    );
    await screen.findByRole("heading", { name: "Take your craft skills further", level: 1 });
    await act(async () => {
      router.history.back();
    });
    await screen.findByRole("heading", { level: 1, name: identity! });
    for (const heading of [/Upcoming bookings/, /Attendance/, /Badges/, /Milestones/]) {
      expect(screen.getByRole("heading", { name: heading })).toBeInTheDocument();
    }
    expect(screen.getByText("Skill check:")).toBeInTheDocument();
    expect(screen.getByText("Shellcraft", { exact: true })).toBeInTheDocument();
    expect(localStorage.getItem("kamotgibo-demo-v1")).toBe(before);
  });
});
