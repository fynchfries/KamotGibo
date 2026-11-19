import { render } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { LogoMark } from "./Logo";

describe("Shared logo mark", () => {
  it("uses the supplied image decoratively and preserves caller sizing", () => {
    const { container } = render(<LogoMark className="size-14" />);
    const image = container.querySelector("img");
    expect(image).toHaveAttribute("src", expect.stringContaining("kamotgibo-logo.png"));
    expect(image).toHaveAttribute("alt", "");
    expect(image).toHaveAttribute("aria-hidden", "true");
    expect(image).toHaveClass("size-14", "object-contain");
  });
});
