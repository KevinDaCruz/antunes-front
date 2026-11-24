import { beforeEach, describe, expect, it, vi } from "vitest";
import userEvent from "@testing-library/user-event";
import { renderWithProviders, screen } from "../test/test-utils";
import Account from "./Account";
import { createApiMock } from "../test/mockApi";
import { DEMO_USER, FAKE_TOKEN } from "../test/fixtures";

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

const myProductsRoute = {
  method: "GET",
  pattern: /^\/products\/mine$/,
  handler: () => ({ status: 200, json: { products: [] } }),
};

const favoritesRoute = {
  method: "GET",
  pattern: /^\/favorites$/,
  handler: () => ({ status: 200, json: { products: [] } }),
};

const ordersRoute = {
  method: "GET",
  pattern: /^\/payments\/orders$/,
  handler: () => ({ status: 200, json: { orders: [] } }),
};

function seedAuthenticatedSession() {
  window.localStorage.setItem(
    "antunes-auth",
    JSON.stringify({ token: FAKE_TOKEN, user: DEMO_USER }),
  );
}

describe("Account", () => {
  beforeEach(() => {
    window.localStorage.clear();
    globalThis.fetch = createApiMock([listProductsRoute]);
  });

  it("invites the visitor to log in when not authenticated", () => {
    renderWithProviders(<Account />);

    expect(
      screen.getByText("Connecte-toi pour accéder à ton espace vendeur."),
    ).toBeInTheDocument();
  });

  it("shows the profile and an empty listings state for a new user", async () => {
    seedAuthenticatedSession();
    globalThis.fetch = createApiMock([
      listProductsRoute,
      meRoute,
      myProductsRoute,
      favoritesRoute,
      ordersRoute,
    ]);

    renderWithProviders(<Account />);

    expect(await screen.findByLabelText("Pseudo")).toHaveValue("kevintech");
    expect(screen.getByLabelText("Email")).toHaveValue("kevin@example.com");
    expect(
      screen.getByText(/n'as encore publié aucune annonce/),
    ).toBeInTheDocument();
  });

  it("saves profile changes through the API", async () => {
    seedAuthenticatedSession();
    globalThis.fetch = createApiMock([
      listProductsRoute,
      meRoute,
      myProductsRoute,
      favoritesRoute,
      ordersRoute,
      {
        method: "PATCH",
        pattern: /^\/users\/me$/,
        handler: ({ body }) => ({
          status: 200,
          json: { user: { ...DEMO_USER, ...body } },
        }),
      },
    ]);
    const user = userEvent.setup();
    renderWithProviders(<Account />);

    const pseudoInput = await screen.findByLabelText("Pseudo");
    await user.clear(pseudoInput);
    await user.type(pseudoInput, "nouveaupseudo");
    await user.click(screen.getByRole("button", { name: "Enregistrer" }));

    expect(
      await screen.findByText("Modifications enregistrées."),
    ).toBeInTheDocument();
  });

  it("logs out when clicking Se déconnecter", async () => {
    seedAuthenticatedSession();
    globalThis.fetch = createApiMock([
      listProductsRoute,
      meRoute,
      myProductsRoute,
      favoritesRoute,
      ordersRoute,
    ]);
    const user = userEvent.setup();
    renderWithProviders(<Account />);

    await user.click(
      await screen.findByRole("button", { name: "Se déconnecter" }),
    );

    expect(window.localStorage.getItem("antunes-auth")).toBeNull();
  });

  it("shows an empty state for purchases when there are none", async () => {
    seedAuthenticatedSession();
    globalThis.fetch = createApiMock([
      listProductsRoute,
      meRoute,
      myProductsRoute,
      favoritesRoute,
      ordersRoute,
    ]);

    renderWithProviders(<Account />);

    expect(
      await screen.findByText(/n'as encore rien acheté/),
    ).toBeInTheDocument();
  });

  it("lists real purchases with their status", async () => {
    seedAuthenticatedSession();
    globalThis.fetch = createApiMock([
      listProductsRoute,
      meRoute,
      myProductsRoute,
      favoritesRoute,
      {
        method: "GET",
        pattern: /^\/payments\/orders$/,
        handler: () => ({
          status: 200,
          json: {
            orders: [
              {
                _id: "order-1",
                product: { name: "iPhone 15 Pro" },
                seller: { pseudo: "DemoSeller" },
                amountTotal: 950,
                status: "paid",
              },
            ],
          },
        }),
      },
    ]);

    renderWithProviders(<Account />);

    expect(await screen.findByText("iPhone 15 Pro")).toBeInTheDocument();
    expect(screen.getByText("Payée")).toBeInTheDocument();
  });

  it("changes the password through the form", async () => {
    seedAuthenticatedSession();
    globalThis.fetch = createApiMock([
      listProductsRoute,
      meRoute,
      myProductsRoute,
      favoritesRoute,
      ordersRoute,
      {
        method: "PATCH",
        pattern: /^\/users\/me\/password$/,
        handler: () => ({ status: 200, json: { success: true } }),
      },
    ]);
    const user = userEvent.setup();
    renderWithProviders(<Account />);

    await user.type(
      await screen.findByLabelText("Mot de passe actuel"),
      "Azerty-2026!x",
    );
    await user.type(
      screen.getByLabelText("Nouveau mot de passe"),
      "NouveauMdp-456!",
    );
    await user.type(
      screen.getByLabelText("Confirmer le nouveau mot de passe"),
      "NouveauMdp-456!",
    );
    await user.click(
      screen.getByRole("button", { name: "Changer le mot de passe" }),
    );

    expect(
      await screen.findByText("Mot de passe mis à jour."),
    ).toBeInTheDocument();
  });

  it("rejects mismatched new passwords without calling the API", async () => {
    seedAuthenticatedSession();
    globalThis.fetch = createApiMock([
      listProductsRoute,
      meRoute,
      myProductsRoute,
      favoritesRoute,
      ordersRoute,
    ]);
    const user = userEvent.setup();
    renderWithProviders(<Account />);

    await user.type(
      await screen.findByLabelText("Mot de passe actuel"),
      "Azerty-2026!x",
    );
    await user.type(
      screen.getByLabelText("Nouveau mot de passe"),
      "NouveauMdp-456!",
    );
    await user.type(
      screen.getByLabelText("Confirmer le nouveau mot de passe"),
      "different",
    );
    await user.click(
      screen.getByRole("button", { name: "Changer le mot de passe" }),
    );

    expect(
      screen.getByText("Les nouveaux mots de passe ne correspondent pas."),
    ).toBeInTheDocument();
  });

  it("lists my listings, including sold ones", async () => {
    seedAuthenticatedSession();
    globalThis.fetch = createApiMock([
      listProductsRoute,
      meRoute,
      favoritesRoute,
      ordersRoute,
      {
        method: "GET",
        pattern: /^\/products\/mine$/,
        handler: () => ({
          status: 200,
          json: {
            products: [
              {
                _id: "p1",
                name: "PS5 Slim",
                condition: "Bon état",
                price: 400,
                status: "sold",
              },
              {
                _id: "p2",
                name: "Raspberry Pi 4",
                condition: "Neuf",
                price: 65,
                status: "available",
              },
            ],
          },
        }),
      },
    ]);

    renderWithProviders(<Account />);

    expect(await screen.findByText("PS5 Slim")).toBeInTheDocument();
    expect(screen.getByText("Vendu")).toBeInTheDocument();
    expect(screen.getByText("En ligne")).toBeInTheDocument();
  });

  it("asks to confirm the email address when it is not confirmed yet", async () => {
    const unverifiedUser = { ...DEMO_USER, emailVerified: false };
    window.localStorage.setItem(
      "antunes-auth",
      JSON.stringify({ token: FAKE_TOKEN, user: unverifiedUser }),
    );
    const resendHandler = vi.fn(() => ({
      status: 200,
      json: { message: "Un nouveau lien de confirmation vient d'être envoyé." },
    }));
    globalThis.fetch = createApiMock([
      listProductsRoute,
      {
        method: "GET",
        pattern: /^\/auth\/me$/,
        handler: () => ({ status: 200, json: { user: unverifiedUser } }),
      },
      myProductsRoute,
      favoritesRoute,
      ordersRoute,
      {
        method: "POST",
        pattern: /^\/auth\/resend-verification$/,
        handler: resendHandler,
      },
    ]);
    const user = userEvent.setup();

    renderWithProviders(<Account />);

    await user.click(
      await screen.findByRole("button", { name: "Renvoyer le lien" }),
    );

    expect(
      await screen.findByText(
        "Un nouveau lien de confirmation vient d'être envoyé.",
      ),
    ).toBeInTheDocument();
    expect(resendHandler).toHaveBeenCalledOnce();
  });

  it("downloads the personal data export", async () => {
    seedAuthenticatedSession();
    const exportHandler = vi.fn(() => ({
      status: 200,
      json: { profile: { email: DEMO_USER.email } },
    }));
    globalThis.fetch = createApiMock([
      listProductsRoute,
      meRoute,
      myProductsRoute,
      favoritesRoute,
      ordersRoute,
      {
        method: "GET",
        pattern: /^\/users\/me\/export$/,
        handler: exportHandler,
      },
    ]);
    URL.createObjectURL = vi.fn(() => "blob:antunes-export");
    URL.revokeObjectURL = vi.fn();
    const clickSpy = vi
      .spyOn(HTMLAnchorElement.prototype, "click")
      .mockImplementation(() => {});
    const user = userEvent.setup();

    renderWithProviders(<Account />);

    await user.click(
      await screen.findByRole("button", { name: "Télécharger mes données" }),
    );

    expect(exportHandler).toHaveBeenCalledOnce();
    expect(clickSpy).toHaveBeenCalledOnce();
    clickSpy.mockRestore();
  });

  it("deletes the account after password confirmation", async () => {
    seedAuthenticatedSession();
    const deleteHandler = vi.fn(() => ({ status: 204 }));
    globalThis.fetch = createApiMock([
      listProductsRoute,
      meRoute,
      myProductsRoute,
      favoritesRoute,
      ordersRoute,
      { method: "DELETE", pattern: /^\/users\/me$/, handler: deleteHandler },
    ]);
    const user = userEvent.setup();

    renderWithProviders(<Account />);

    await user.type(
      await screen.findByLabelText("Confirme avec ton mot de passe"),
      "Azerty-2026!x",
    );
    await user.click(
      screen.getByRole("button", {
        name: "Supprimer définitivement mon compte",
      }),
    );

    expect(deleteHandler).toHaveBeenCalledWith(
      expect.objectContaining({ body: { password: "Azerty-2026!x" } }),
    );
    expect(window.localStorage.getItem("antunes-auth")).toBeNull();
  });
});
