import { beforeEach, describe, expect, it } from "vitest";
import userEvent from "@testing-library/user-event";
import { render, screen } from "@testing-library/react";
import { createMemoryRouter, RouterProvider } from "react-router-dom";
import { HelmetProvider } from "react-helmet-async";
import { AuthProvider } from "../context/AuthContext";
import { ProductsProvider } from "../context/ProductsContext";
import Signup from "./Signup";
import { createApiMock } from "../test/mockApi";
import { DEMO_USER, FAKE_TOKEN } from "../test/fixtures";

const listProductsRoute = {
  method: "GET",
  pattern: /^\/products$/,
  handler: () => ({ status: 200, json: { products: [] } }),
};

function renderSignupRouter() {
  const router = createMemoryRouter(
    [
      { path: "/signup", element: <Signup /> },
      { path: "/account", element: <div>Espace compte</div> },
    ],
    { initialEntries: ["/signup"] },
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

async function fillValidForm(user, { password = "azerty123" } = {}) {
  await user.type(screen.getByLabelText("Prénom"), "Kevin");
  await user.type(screen.getByLabelText("Nom"), "Da Cruz");
  await user.type(screen.getByLabelText("Pseudo"), "kevintech");
  await user.type(screen.getByLabelText("Adresse e-mail"), "kevin@example.com");
  await user.type(screen.getByLabelText("Mot de passe"), password);
  await user.type(
    screen.getByLabelText("Confirmer le mot de passe"),
    password,
  );
}

describe("Signup", () => {
  beforeEach(() => {
    window.localStorage.clear();
    globalThis.fetch = createApiMock([listProductsRoute]);
  });

  it("requires accepting the terms before submitting", async () => {
    const user = userEvent.setup();
    renderSignupRouter();

    await fillValidForm(user);
    await user.click(screen.getByRole("button", { name: "Créer un compte" }));

    expect(
      screen.getByText(
        "Merci d'accepter les conditions d'utilisation pour continuer.",
      ),
    ).toBeInTheDocument();
  });

  it("rejects mismatched passwords", async () => {
    const user = userEvent.setup();
    renderSignupRouter();

    await fillValidForm(user, { password: "azerty123" });
    await user.clear(screen.getByLabelText("Confirmer le mot de passe"));
    await user.type(
      screen.getByLabelText("Confirmer le mot de passe"),
      "different",
    );
    await user.click(screen.getByLabelText(/j'accepte les conditions/i));
    await user.click(screen.getByRole("button", { name: "Créer un compte" }));

    expect(
      screen.getByText("Les mots de passe ne correspondent pas."),
    ).toBeInTheDocument();
  });

  it("creates the account and redirects to /account", async () => {
    globalThis.fetch = createApiMock([
      listProductsRoute,
      {
        method: "POST",
        pattern: /^\/auth\/signup$/,
        handler: () => ({
          status: 201,
          json: { user: DEMO_USER, token: FAKE_TOKEN },
        }),
      },
    ]);
    const user = userEvent.setup();
    renderSignupRouter();

    await fillValidForm(user);
    await user.click(screen.getByLabelText(/j'accepte les conditions/i));
    await user.click(screen.getByRole("button", { name: "Créer un compte" }));

    expect(await screen.findByText("Espace compte")).toBeInTheDocument();
  });
});
