import { describe, expect, it } from "vitest";
import { renderWithProviders, screen } from "../test/test-utils";
import NotFound from "./NotFound";

describe("NotFound", () => {
  it("explains the page is missing and links back to the catalog", () => {
    renderWithProviders(<NotFound />);

    expect(
      screen.getByRole("heading", { name: "Page introuvable" }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole("link", { name: "Voir le catalogue" }),
    ).toHaveAttribute("href", "/catalog");
  });
});
