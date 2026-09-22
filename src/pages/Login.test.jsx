import { beforeEach, describe, expect, it } from "vitest";
import userEvent from "@testing-library/user-event";
import { render, screen } from "@testing-library/react";
import { createMemoryRouter, RouterProvider } from "react-router-dom";
import { HelmetProvider } from "react-helmet-async";
import { AuthProvider } from "../context/AuthContext";
import { ProductsProvider } from "../context/ProductsContext";
import Login from "./Login";
import { createApiMock } from "../test/mockApi";
import { DEMO_USER, FAKE_TOKEN } from "../test/fixtures";

const listProductsRoute = {
  method: "GET",
  pattern: /^\/products$/,
  handler: () => ({ status: 200, json: { products: [] } }),
};

function renderLoginRouter() {
  const router = createMemoryRouter(
    [
      { path: "/login", element: <Login /> },
      { path: "/account", element: <div>Espace compte</div> },
    ],
    { initialEntries: ["/login"] },
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

describe("Login", () => {
  beforeEach(() => {
    window.localStorage.clear();
  });

  it("shows the backend's error when the credentials are refused", async () => {
    globalThis.fetch = createApiMock([
      listProductsRoute,
      {
        method: "POST",
        pattern: /^\/auth\/login$/,
        handler: () => ({
          status: 401,
          json: { error: { message: "Identifiants invalides." } },
        }),
      },
    ]);
    const user = userEvent.setup();
    renderLoginRouter();

    await user.type(
      screen.getByLabelText("Adresse e-mail"),
      "kevin@example.com",
    );
    await user.type(screen.getByLabelText("Mot de passe"), "wrong-password");
    await user.click(screen.getByRole("button", { name: "Se connecter" }));

    expect(
      await screen.findByText("Identifiants invalides."),
    ).toBeInTheDocument();
  });

  it("redirects to /account after a successful login", async () => {
    globalThis.fetch = createApiMock([
      listProductsRoute,
      {
        method: "POST",
        pattern: /^\/auth\/login$/,
        handler: () => ({
          status: 200,
          json: { user: DEMO_USER, token: FAKE_TOKEN },
        }),
      },
    ]);
    const user = userEvent.setup();
    renderLoginRouter();

    await user.type(
      screen.getByLabelText("Adresse e-mail"),
      "kevin@example.com",
    );
    await user.type(screen.getByLabelText("Mot de passe"), "azerty123");
    await user.click(screen.getByRole("button", { name: "Se connecter" }));

    expect(await screen.findByText("Espace compte")).toBeInTheDocument();
  });
});
