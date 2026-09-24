import { beforeEach, describe, expect, it } from "vitest";
import userEvent from "@testing-library/user-event";
import { renderWithProviders, screen } from "../test/test-utils";
import ForgotPassword from "./ForgotPassword";
import { createApiMock } from "../test/mockApi";

const listProductsRoute = {
  method: "GET",
  pattern: /^\/products$/,
  handler: () => ({ status: 200, json: { products: [] } }),
};

describe("ForgotPassword", () => {
  beforeEach(() => {
    window.localStorage.clear();
  });

  it("shows the generic confirmation message on success", async () => {
    globalThis.fetch = createApiMock([
      listProductsRoute,
      {
        method: "POST",
        pattern: /^\/auth\/forgot-password$/,
        handler: () => ({
          status: 200,
          json: {
            message:
              "Si un compte existe avec cet e-mail, un lien de réinitialisation vient d'être envoyé.",
          },
        }),
      },
    ]);
    const user = userEvent.setup();
    renderWithProviders(<ForgotPassword />);

    await user.type(screen.getByLabelText("Adresse e-mail"), "kevin@example.com");
    await user.click(screen.getByRole("button", { name: "Envoyer le lien" }));

    expect(
      await screen.findByText(/Si un compte existe/),
    ).toBeInTheDocument();
  });
});
