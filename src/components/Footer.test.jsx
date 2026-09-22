import { describe, expect, it } from "vitest";
import { render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import Footer from "./Footer";

describe("Footer", () => {
  it("renders the quick links and the current year", () => {
    render(
      <MemoryRouter>
        <Footer />
      </MemoryRouter>,
    );

    expect(screen.getByRole("link", { name: "Catalogue" })).toBeInTheDocument();
    expect(screen.getByRole("link", { name: "Favoris" })).toBeInTheDocument();
    expect(
      screen.getByText(new RegExp(`${new Date().getFullYear()} Antunes`)),
    ).toBeInTheDocument();
  });
});
