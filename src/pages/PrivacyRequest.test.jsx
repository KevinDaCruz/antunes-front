import { beforeEach, describe, expect, it, vi } from "vitest";
import userEvent from "@testing-library/user-event";
import { renderWithProviders, screen } from "../test/test-utils";
import PrivacyRequest from "./PrivacyRequest";
import { createApiMock } from "../test/mockApi";

const listProductsRoute = {
  method: "GET",
  pattern: /^\/products$/,
  handler: () => ({ status: 200, json: { products: [] } }),
};

describe("PrivacyRequest", () => {
  beforeEach(() => {
    window.localStorage.clear();
  });

  it("sends the request and shows its reference", async () => {
    const requestHandler = vi.fn(() => ({
      status: 201,
      json: {
        reference: "ref-123",
        message: "Ta demande a bien été enregistrée.",
      },
    }));
    globalThis.fetch = createApiMock([
      listProductsRoute,
      {
        method: "POST",
        pattern: /^\/privacy-requests$/,
        handler: requestHandler,
      },
    ]);
    const user = userEvent.setup();

    renderWithProviders(<PrivacyRequest />);

    await user.type(
      screen.getByLabelText("Adresse e-mail concernée"),
      "client@example.com",
    );
    await user.selectOptions(
      screen.getByLabelText("Ta demande"),
      "Supprimer mes données",
    );
    await user.click(
      screen.getByRole("button", { name: "Envoyer ma demande" }),
    );

    expect(
      await screen.findByText("Ta demande a bien été enregistrée."),
    ).toBeInTheDocument();
    expect(screen.getByText("Référence : ref-123")).toBeInTheDocument();
    expect(requestHandler).toHaveBeenCalledWith(
      expect.objectContaining({
        body: { email: "client@example.com", type: "erasure", message: "" },
      }),
    );
  });

  it("shows the error returned by the API", async () => {
    globalThis.fetch = createApiMock([
      listProductsRoute,
      {
        method: "POST",
        pattern: /^\/privacy-requests$/,
        handler: () => ({
          status: 429,
          json: { error: { message: "Trop de demandes, réessaie plus tard." } },
        }),
      },
    ]);
    const user = userEvent.setup();

    renderWithProviders(<PrivacyRequest />);

    await user.type(
      screen.getByLabelText("Adresse e-mail concernée"),
      "client@example.com",
    );
    await user.click(
      screen.getByRole("button", { name: "Envoyer ma demande" }),
    );

    expect(
      await screen.findByText("Trop de demandes, réessaie plus tard."),
    ).toBeInTheDocument();
  });
});
