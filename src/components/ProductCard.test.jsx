import { beforeEach, describe, expect, it } from "vitest";
import userEvent from "@testing-library/user-event";
import { renderWithProviders, screen, waitFor } from "../test/test-utils";
import ProductCard from "./ProductCard";
import { createApiMock } from "../test/mockApi";
import { DEMO_USER, FAKE_TOKEN } from "../test/fixtures";

const product = {
  _id: "product-1",
  name: "iPhone 15 Pro",
  brand: "Apple",
  condition: "Reconditionné",
  price: 950,
  imageUrl: "https://placehold.co/600x600.png?text=iPhone",
};

const listProductsRoute = {
  method: "GET",
  pattern: /^\/products$/,
  handler: () => ({ status: 200, json: { products: [] } }),
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

describe("ProductCard", () => {
  beforeEach(() => {
    window.localStorage.clear();
  });

  it("is not marked as favorite by default", () => {
    globalThis.fetch = createApiMock([listProductsRoute]);
    renderWithProviders(<ProductCard product={product} />);

    expect(
      screen.getByRole("button", { name: "Ajouter l'article aux favoris" }),
    ).toHaveAttribute("aria-pressed", "false");
  });

  it("redirects a logged-out visitor to /login instead of toggling", async () => {
    globalThis.fetch = createApiMock([listProductsRoute]);
    const user = userEvent.setup();
    renderWithProviders(<ProductCard product={product} />);

    await user.click(
      screen.getByRole("button", { name: "Ajouter l'article aux favoris" }),
    );

    expect(globalThis.fetch).not.toHaveBeenCalledWith(
      expect.stringContaining("/favorites"),
      expect.anything(),
    );
  });

  it("toggles favorite state for an authenticated user", async () => {
    seedAuthenticatedSession();
    let isFavorited = false;
    globalThis.fetch = createApiMock([
      meRoute,
      listProductsRoute,
      {
        method: "GET",
        pattern: /^\/favorites$/,
        handler: () => ({
          status: 200,
          json: { products: isFavorited ? [product] : [] },
        }),
      },
      {
        method: "POST",
        pattern: /^\/favorites\/product-1$/,
        handler: () => {
          isFavorited = true;
          return { status: 204 };
        },
      },
    ]);
    const user = userEvent.setup();
    renderWithProviders(<ProductCard product={product} />);

    await waitFor(() =>
      expect(
        screen.getByRole("button", { name: "Ajouter l'article aux favoris" }),
      ).toBeInTheDocument(),
    );

    await user.click(
      screen.getByRole("button", { name: "Ajouter l'article aux favoris" }),
    );

    expect(
      await screen.findByRole("button", { name: "Retirer des favoris" }),
    ).toHaveAttribute("aria-pressed", "true");
  });
});
