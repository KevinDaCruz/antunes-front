import { beforeEach, describe, expect, it } from "vitest";
import userEvent from "@testing-library/user-event";
import { renderWithProviders, screen } from "../test/test-utils";
import Catalog from "./Catalog";
import { createApiMock } from "../test/mockApi";
import { DEMO_PRODUCTS } from "../test/fixtures";

const listProductsRoute = {
  method: "GET",
  pattern: /^\/products$/,
  handler: () => ({ status: 200, json: { products: DEMO_PRODUCTS } }),
};

describe("Catalog", () => {
  beforeEach(() => {
    window.localStorage.clear();
    globalThis.fetch = createApiMock([listProductsRoute]);
  });

  it("shows every product by default", async () => {
    renderWithProviders(<Catalog />);

    expect(await screen.findByText(/4 annonces/i)).toBeInTheDocument();
  });

  it("filters by category when a category tag is clicked", async () => {
    const user = userEvent.setup();
    renderWithProviders(<Catalog />);
    await screen.findByText(/4 annonces/i);

    const categoryButtons = screen.getAllByRole("button", {
      name: "Consoles",
    });
    await user.click(categoryButtons[0]);

    expect(await screen.findByText(/1 annonce\b/i)).toBeInTheDocument();
    expect(screen.getByAltText("Console Sony PS5 Slim")).toBeInTheDocument();
  });

  it("prefills the category filter from the URL search params", async () => {
    renderWithProviders(<Catalog />, {
      route: "/catalog?category=Smartphones",
    });

    expect(await screen.findByText(/1 annonce\b/i)).toBeInTheDocument();
    expect(screen.getByAltText("iPhone 15 Pro")).toBeInTheDocument();
  });

  it("shows an empty state when no product matches", async () => {
    const user = userEvent.setup();
    renderWithProviders(<Catalog />);
    await screen.findByText(/4 annonces/i);

    const conditionSelect = screen.getByLabelText("État");
    await user.selectOptions(conditionSelect, "Occasion");

    expect(
      screen.getByText("Aucune annonce ne correspond"),
    ).toBeInTheDocument();
  });

  it("resets every filter when clicking Réinitialiser", async () => {
    const user = userEvent.setup();
    renderWithProviders(<Catalog />, { route: "/catalog?category=Consoles" });

    expect(await screen.findByText(/1 annonce\b/i)).toBeInTheDocument();

    await user.click(screen.getByRole("button", { name: "Réinitialiser" }));

    expect(await screen.findByText(/4 annonces/i)).toBeInTheDocument();
  });
});
