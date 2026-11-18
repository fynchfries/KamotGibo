import { useState } from "react";
import { fireEvent, render, screen } from "@testing-library/react";
import { expect, it } from "vitest";
import { FilterChips } from "./FilterChips";

it("selects one filter and clears it when pressed again", () => {
  function Filters() {
    const [value, setValue] = useState<string>();
    return (
      <FilterChips
        label="Craft"
        options={[
          { value: "Shellcraft", label: "Shellcraft" },
          { value: "Pottery", label: "Pottery" },
        ]}
        value={value}
        onChange={setValue}
      />
    );
  }

  render(<Filters />);
  const shellcraft = screen.getByRole("button", { name: "Shellcraft" });
  const pottery = screen.getByRole("button", { name: "Pottery" });

  fireEvent.click(shellcraft);
  expect(shellcraft).toHaveAttribute("aria-pressed", "true");
  fireEvent.click(pottery);
  expect(shellcraft).toHaveAttribute("aria-pressed", "false");
  expect(pottery).toHaveAttribute("aria-pressed", "true");
  fireEvent.click(pottery);
  expect(pottery).toHaveAttribute("aria-pressed", "false");
});
