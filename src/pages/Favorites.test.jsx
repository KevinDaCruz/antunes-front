import { beforeEach, describe, expect, it } from "vitest";
import { renderWithProviders, screen } from "../test/test-utils";
import Favorites from "./Favorites";
import { createApiMock } from "../test/mockApi";
import { DEMO_PRODUCTS, DEMO_USER, FAKE_TOKEN } from "../test/fixtures";

const listProductsRoute = {
  method: "GET",
  pattern: /^\/products$/,
  handler: () => ({ status: 200, json: { products: DEMO_PRODUCTS } }),
};

const meRoute = {
  method: "GET",
  pattern: /^\/auth\/me$/,
  handler: () => ({ status: 200, json: { user: DEMO_USER } }),
};

function seedAuthenticatedSession() {
  window.localStorage.setItem(
    "antunes-auth",
    JSON.stringify({ token: FAKE_TOKEN, user: DEMO_USER }),
  );
}

describe("Favorites", () => {
  beforeEach(() => {
    window.localStorage.clear();
  });

  it("shows an empty state when nothing is favorited", async () => {
    globalThis.fetch = createApiMock([listProductsRoute]);
    renderWithProviders(<Favorites />);

    expect(
      await screen.findByText("Aucun favori pour le moment"),
    ).toBeInTheDocument();
  });

  it("lists products that were marked as favorite", async () => {
    seedAuthenticatedSession();
    globalThis.fetch = createApiMock([
      meRoute,
      listProductsRoute,
      {
        method: "GET",
        pattern: /^\/favorites$/,
        handler: () => ({
          status: 200,
          json: { products: [DEMO_PRODUCTS[0]] },
        }),
      },
    ]);

    renderWithProviders(<Favorites />);

    expect(await screen.findByAltText("iPhone 15 Pro")).toBeInTheDocument();
    expect(
      screen.queryByText("Aucun favori pour le moment"),
    ).not.toBeInTheDocument();
  });
});
