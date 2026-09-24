import { beforeEach, describe, expect, it } from "vitest";
import userEvent from "@testing-library/user-event";
import { render, screen } from "@testing-library/react";
import { createMemoryRouter, RouterProvider } from "react-router-dom";
import { HelmetProvider } from "react-helmet-async";
import { AuthProvider } from "../context/AuthContext";
import { ProductsProvider } from "../context/ProductsContext";
import ResetPassword from "./ResetPassword";
import { createApiMock } from "../test/mockApi";

const listProductsRoute = {
  method: "GET",
  pattern: /^\/products$/,
  handler: () => ({ status: 200, json: { products: [] } }),
};

function renderResetPassword(path) {
  const router = createMemoryRouter(
    [
      { path: "/reset-password", element: <ResetPassword /> },
      { path: "/login", element: <div>Connexion</div> },
    ],
    { initialEntries: [path] },
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

describe("ResetPassword", () => {
  beforeEach(() => {
    window.localStorage.clear();
    globalThis.fetch = createApiMock([listProductsRoute]);
  });

  it("shows an invalid link message when there is no token", () => {
    renderResetPassword("/reset-password");

    expect(
      screen.getByText(/Ce lien de réinitialisation est invalide/),
    ).toBeInTheDocument();
  });

  it("rejects mismatched passwords", async () => {
    const user = userEvent.setup();
    renderResetPassword("/reset-password?token=abc123");

    await user.type(
      screen.getByLabelText("Nouveau mot de passe"),
      "newpassword456",
    );
    await user.type(
      screen.getByLabelText("Confirmer le mot de passe"),
      "different",
    );
    await user.click(
      screen.getByRole("button", { name: "Réinitialiser le mot de passe" }),
    );

    expect(
      screen.getByText("Les mots de passe ne correspondent pas."),
    ).toBeInTheDocument();
  });

  it("resets the password and redirects to /login", async () => {
    globalThis.fetch = createApiMock([
      listProductsRoute,
      {
        method: "POST",
        pattern: /^\/auth\/reset-password$/,
        handler: () => ({ status: 200, json: { success: true } }),
      },
    ]);
    const user = userEvent.setup();
    renderResetPassword("/reset-password?token=abc123");

    await user.type(
      screen.getByLabelText("Nouveau mot de passe"),
      "newpassword456",
    );
    await user.type(
      screen.getByLabelText("Confirmer le mot de passe"),
      "newpassword456",
    );
    await user.click(
      screen.getByRole("button", { name: "Réinitialiser le mot de passe" }),
    );

    expect(await screen.findByText("Connexion")).toBeInTheDocument();
  });

  it("shows the backend error for an expired or invalid token", async () => {
    globalThis.fetch = createApiMock([
      listProductsRoute,
      {
        method: "POST",
        pattern: /^\/auth\/reset-password$/,
        handler: () => ({
          status: 400,
          json: { error: { message: "Lien invalide ou expiré." } },
        }),
      },
    ]);
    const user = userEvent.setup();
    renderResetPassword("/reset-password?token=expired");

    await user.type(
      screen.getByLabelText("Nouveau mot de passe"),
      "newpassword456",
    );
    await user.type(
      screen.getByLabelText("Confirmer le mot de passe"),
      "newpassword456",
    );
    await user.click(
      screen.getByRole("button", { name: "Réinitialiser le mot de passe" }),
    );

    expect(
      await screen.findByText("Lien invalide ou expiré."),
    ).toBeInTheDocument();
  });
});
