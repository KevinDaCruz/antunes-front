import { beforeEach, describe, expect, it } from "vitest";
import userEvent from "@testing-library/user-event";
import { render, screen } from "@testing-library/react";
import { createMemoryRouter, RouterProvider } from "react-router-dom";
import { AuthProvider } from "../context/AuthContext";
import { ProductsProvider } from "../context/ProductsContext";
import Sell from "./Sell";
import { createApiMock } from "../test/mockApi";
import { DEMO_USER, FAKE_TOKEN } from "../test/fixtures";

const listProductsRoute = {
  method: "GET",
  pattern: /^\/products$/,
  handler: () => ({ status: 200, json: { products: [] } }),
};

function meRouteFor(user) {
  return {
    method: "GET",
    pattern: /^\/auth\/me$/,
    handler: () => ({ status: 200, json: { user } }),
  };
}

// La page est protégée par RequireAuth dans l'application : on simule
// donc toujours une session ouverte.
function seedSession(user) {
  window.localStorage.setItem(
    "antunes-auth",
    JSON.stringify({ token: FAKE_TOKEN, user }),
  );
}

function renderSellRouter(initialPath = "/sell") {
  const router = createMemoryRouter(
    [
      { path: "/sell", element: <Sell /> },
      { path: "/sell/:id", element: <Sell /> },
      { path: "/product/:id", element: <div>Fiche produit</div> },
    ],
    { initialEntries: [initialPath] },
  );

  return render(
    <AuthProvider>
      <ProductsProvider>
        <RouterProvider router={router} />
      </ProductsProvider>
    </AuthProvider>,
  );
}

describe("Sell", () => {
  beforeEach(() => {
    window.localStorage.clear();
    seedSession(DEMO_USER);
    globalThis.fetch = createApiMock([
      listProductsRoute,
      meRouteFor(DEMO_USER),
    ]);
  });

  it("blocks publishing until the email address is confirmed", async () => {
    const unverifiedUser = { ...DEMO_USER, emailVerified: false };
    seedSession(unverifiedUser);
    globalThis.fetch = createApiMock([
      listProductsRoute,
      meRouteFor(unverifiedUser),
    ]);
    renderSellRouter();

    expect(
      await screen.findByText("Confirme ton adresse e-mail."),
    ).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: "Publier l'annonce" }),
    ).toBeDisabled();
  });

  it("shows an error when required fields are missing", async () => {
    const user = userEvent.setup();
    renderSellRouter();

    await user.click(screen.getByRole("button", { name: "Publier l'annonce" }));

    expect(
      screen.getByText("Merci de remplir tous les champs obligatoires."),
    ).toBeInTheDocument();
  });

  it("creates the listing and redirects to its product page", async () => {
    globalThis.fetch = createApiMock([
      listProductsRoute,
      meRouteFor(DEMO_USER),
      {
        method: "POST",
        pattern: /^\/products$/,
        handler: ({ body }) => ({
          status: 201,
          json: { product: { _id: "new-product-id", ...body } },
        }),
      },
    ]);
    const user = userEvent.setup();
    renderSellRouter();

    await user.type(screen.getByLabelText("Nom du produit"), "Manette Xbox");
    await user.type(screen.getByLabelText("Marque"), "Microsoft");
    await user.selectOptions(screen.getByLabelText("État"), "Neuf");
    await user.selectOptions(screen.getByLabelText("Catégorie"), "Manettes");
    await user.type(screen.getByLabelText("Prix"), "40");

    await user.click(screen.getByRole("button", { name: "Publier l'annonce" }));

    expect(await screen.findByText("Fiche produit")).toBeInTheDocument();
  });

  describe("editing an existing listing", () => {
    const existingProduct = {
      _id: "product-9",
      name: "Manette Xbox",
      brand: "Microsoft",
      category: "Manettes",
      condition: "Bon état",
      price: 40,
      description: "Avec câble.",
      status: "available",
      seller: { _id: DEMO_USER.id, pseudo: DEMO_USER.pseudo },
    };

    function productRoute(product) {
      return {
        method: "GET",
        pattern: /^\/products\/product-9$/,
        handler: () => ({ status: 200, json: { product } }),
      };
    }

    it("prefills the form and saves the changes", async () => {
      globalThis.fetch = createApiMock([
        listProductsRoute,
        meRouteFor(DEMO_USER),
        productRoute(existingProduct),
        {
          method: "PATCH",
          pattern: /^\/products\/product-9$/,
          handler: ({ body }) => ({
            status: 200,
            json: { product: { ...existingProduct, ...body } },
          }),
        },
      ]);
      const user = userEvent.setup();
      renderSellRouter("/sell/product-9");

      const priceField = await screen.findByLabelText("Prix");
      expect(screen.getByLabelText("Nom du produit")).toHaveValue(
        "Manette Xbox",
      );
      await user.clear(priceField);
      await user.type(priceField, "35");
      await user.click(
        screen.getByRole("button", { name: "Enregistrer les modifications" }),
      );

      expect(await screen.findByText("Fiche produit")).toBeInTheDocument();
      expect(globalThis.fetch).toHaveBeenCalledWith(
        expect.stringMatching(/\/products\/product-9$/),
        expect.objectContaining({ method: "PATCH" }),
      );
    });

    it("refuses to edit another member's listing", async () => {
      globalThis.fetch = createApiMock([
        listProductsRoute,
        meRouteFor(DEMO_USER),
        productRoute({ ...existingProduct, seller: { _id: "someone-else" } }),
      ]);
      renderSellRouter("/sell/product-9");

      expect(
        await screen.findByText(
          "Tu ne peux modifier que tes propres annonces.",
        ),
      ).toBeInTheDocument();
      expect(screen.queryByLabelText("Prix")).not.toBeInTheDocument();
    });
  });
});
