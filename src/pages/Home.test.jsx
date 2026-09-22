import { beforeEach, describe, expect, it } from "vitest";
import { renderWithProviders, screen } from "../test/test-utils";
import Home from "./Home";
import { createApiMock } from "../test/mockApi";
import { DEMO_PRODUCTS } from "../test/fixtures";

describe("Home", () => {
  beforeEach(() => {
    window.localStorage.clear();
    globalThis.fetch = createApiMock([
      {
        method: "GET",
        pattern: /^\/products$/,
        handler: () => ({ status: 200, json: { products: DEMO_PRODUCTS } }),
      },
    ]);
  });

  it("renders the hero and the latest products", async () => {
    renderWithProviders(<Home />);

    expect(
      screen.getByRole("heading", { name: /vente tech nouvelle génération/i }),
    ).toBeInTheDocument();
    expect(
      (await screen.findAllByAltText("iPhone 15 Pro")).length,
    ).toBeGreaterThan(0);
  });
});
