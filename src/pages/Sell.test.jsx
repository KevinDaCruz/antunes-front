import { beforeEach, describe, expect, it } from "vitest";
import userEvent from "@testing-library/user-event";
import { render, screen } from "@testing-library/react";
import { createMemoryRouter, RouterProvider } from "react-router-dom";
import { HelmetProvider } from "react-helmet-async";
import { AuthProvider } from "../context/AuthContext";
import { ProductsProvider } from "../context/ProductsContext";
import Sell from "./Sell";
import { createApiMock } from "../test/mockApi";

const listProductsRoute = {
  method: "GET",
  pattern: /^\/products$/,
  handler: () => ({ status: 200, json: { products: [] } }),
};

function renderSellRouter() {
  const router = createMemoryRouter(
    [
      { path: "/sell", element: <Sell /> },
      { path: "/product/:id", element: <div>Fiche produit</div> },
    ],
    { initialEntries: ["/sell"] },
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

describe("Sell", () => {
  beforeEach(() => {
    window.localStorage.clear();
    globalThis.fetch = createApiMock([listProductsRoute]);
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
});
