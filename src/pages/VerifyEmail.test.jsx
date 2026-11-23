import { beforeEach, describe, expect, it, vi } from "vitest";
import { renderWithProviders, screen } from "../test/test-utils";
import VerifyEmail from "./VerifyEmail";
import { createApiMock } from "../test/mockApi";

const listProductsRoute = {
  method: "GET",
  pattern: /^\/products$/,
  handler: () => ({ status: 200, json: { products: [] } }),
};

describe("VerifyEmail", () => {
  beforeEach(() => {
    window.localStorage.clear();
  });

  it("confirms the address with the token from the link, only once", async () => {
    const verifyHandler = vi.fn(() => ({
      status: 200,
      json: { success: true },
    }));
    globalThis.fetch = createApiMock([
      listProductsRoute,
      { method: "POST", pattern: /^\/auth\/verify-email$/, handler: verifyHandler },
    ]);

    renderWithProviders(<VerifyEmail />, {
      route: "/verify-email?token=abc123",
    });

    expect(
      await screen.findByText(/Ton adresse e-mail est confirmée/),
    ).toBeInTheDocument();
    expect(verifyHandler).toHaveBeenCalledOnce();
    expect(verifyHandler).toHaveBeenCalledWith(
      expect.objectContaining({ body: { token: "abc123" } }),
    );
  });

  it("explains what to do when the link has expired", async () => {
    globalThis.fetch = createApiMock([
      listProductsRoute,
      {
        method: "POST",
        pattern: /^\/auth\/verify-email$/,
        handler: () => ({
          status: 400,
          json: { error: { message: "Lien de confirmation invalide ou expiré." } },
        }),
      },
    ]);

    renderWithProviders(<VerifyEmail />, {
      route: "/verify-email?token=expired",
    });

    expect(
      await screen.findByText("Lien de confirmation invalide ou expiré."),
    ).toBeInTheDocument();
    expect(screen.getByRole("link", { name: "ton compte" })).toBeInTheDocument();
  });

  it("rejects a link without token without calling the API", () => {
    globalThis.fetch = createApiMock([listProductsRoute]);

    renderWithProviders(<VerifyEmail />, { route: "/verify-email" });

    expect(
      screen.getByText("Ce lien de confirmation est incomplet."),
    ).toBeInTheDocument();
  });
});
