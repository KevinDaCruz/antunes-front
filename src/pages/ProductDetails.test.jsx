import { afterEach, beforeEach, describe, expect, it } from "vitest";
import userEvent from "@testing-library/user-event";
import { render, screen } from "@testing-library/react";
import { createMemoryRouter, RouterProvider } from "react-router-dom";
import { HelmetProvider } from "react-helmet-async";
import { AuthProvider } from "../context/AuthContext";
import { ProductsProvider } from "../context/ProductsContext";
import ProductDetails from "./ProductDetails";
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

function renderProductDetails(productId) {
  const router = createMemoryRouter(
    [
      { path: "/product/:id", element: <ProductDetails /> },
      { path: "/messages", element: <div>Messagerie</div> },
      { path: "/login", element: <div>Connexion</div> },
      { path: "/", element: <div>Accueil</div> },
    ],
    { initialEntries: [`/product/${productId}`] },
  );

  return render(
    <HelmetProvider>
      <AuthProvider>
        <ProductsProvider>
          <RouterProvider router={router} />
        </ProductsProvider>
      </AuthProvider>
    </HelmetProvider>,
  );
}

describe("ProductDetails", () => {
  beforeEach(() => {
    window.localStorage.clear();
  });

  it("shows a not-found message for an unknown id", async () => {
    globalThis.fetch = createApiMock([listProductsRoute]);
    renderProductDetails("unknown-id");

    expect(await screen.findByText("Produit non trouvé")).toBeInTheDocument();
  });

  it("displays the product's information", async () => {
    globalThis.fetch = createApiMock([listProductsRoute]);
    renderProductDetails("product-1");

    expect(
      await screen.findByRole("heading", { name: "iPhone 15 Pro" }),
    ).toBeInTheDocument();
    expect(screen.getByText("950€")).toBeInTheDocument();
    expect(screen.getByText("TechHunter75")).toBeInTheDocument();
  });

  it("redirects a logged-out visitor to /login when contacting the seller", async () => {
    globalThis.fetch = createApiMock([listProductsRoute]);
    const user = userEvent.setup();
    renderProductDetails("product-1");

    await user.click(
      await screen.findByRole("button", { name: "Contacter le vendeur" }),
    );

    expect(await screen.findByText("Connexion")).toBeInTheDocument();
  });

  it("starts a conversation and navigates to /messages for a logged-in user", async () => {
    seedAuthenticatedSession();
    globalThis.fetch = createApiMock([
      listProductsRoute,
      meRoute,
      {
        method: "POST",
        pattern: /^\/conversations$/,
        handler: () => ({
          status: 201,
          json: { conversation: { _id: "conversation-1" } },
        }),
      },
    ]);
    const user = userEvent.setup();
    renderProductDetails("product-1");

    await user.click(
      await screen.findByRole("button", { name: "Contacter le vendeur" }),
    );

    expect(await screen.findByText("Messagerie")).toBeInTheDocument();
  });

  it("redirects a logged-out visitor to /login when buying", async () => {
    globalThis.fetch = createApiMock([listProductsRoute]);
    const user = userEvent.setup();
    renderProductDetails("product-1");

    await user.click(
      await screen.findByRole("button", { name: "Acheter maintenant" }),
    );

    expect(await screen.findByText("Connexion")).toBeInTheDocument();
  });

  describe("buying while logged in", () => {
    const originalLocation = window.location;

    beforeEach(() => {
      delete window.location;
      window.location = {
        href: "",
        assign(url) {
          this.href = url;
        },
      };
    });

    afterEach(() => {
      window.location = originalLocation;
    });

    it("creates a checkout session and redirects to Stripe", async () => {
      seedAuthenticatedSession();
      globalThis.fetch = createApiMock([
        listProductsRoute,
        meRoute,
        {
          method: "POST",
          pattern: /^\/payments\/checkout-session$/,
          handler: () => ({
            status: 201,
            json: { url: "https://checkout.stripe.com/pay/cs_test_123" },
          }),
        },
      ]);
      const user = userEvent.setup();
      renderProductDetails("product-1");

      await user.click(
        await screen.findByRole("button", { name: "Acheter maintenant" }),
      );

      await screen.findByText("Redirection vers le paiement...");
      expect(window.location.href).toBe(
        "https://checkout.stripe.com/pay/cs_test_123",
      );
    });

    it("shows an error when the checkout session cannot be created", async () => {
      seedAuthenticatedSession();
      globalThis.fetch = createApiMock([
        listProductsRoute,
        meRoute,
        {
          method: "POST",
          pattern: /^\/payments\/checkout-session$/,
          handler: () => ({
            status: 400,
            json: { error: { message: "Tu ne peux pas acheter ta propre annonce." } },
          }),
        },
      ]);
      const user = userEvent.setup();
      renderProductDetails("product-1");

      await user.click(
        await screen.findByRole("button", { name: "Acheter maintenant" }),
      );

      expect(
        await screen.findByText("Tu ne peux pas acheter ta propre annonce."),
      ).toBeInTheDocument();
    });
  });
});
