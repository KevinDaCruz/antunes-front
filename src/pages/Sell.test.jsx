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

function renderSellRouter() {
  const router = createMemoryRouter(
    [
      { path: "/sell", element: <Sell /> },
      { path: "/product/:id", element: <div>Fiche produit</div> },
    ],
    { initialEntries: ["/sell"] },
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
});
