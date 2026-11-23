import { beforeEach, describe, expect, it } from "vitest";
import { renderWithProviders, screen } from "../test/test-utils";
import LegalNotice from "./LegalNotice";
import PrivacyPolicy from "./PrivacyPolicy";
import { createApiMock } from "../test/mockApi";

describe("Legal pages", () => {
  beforeEach(() => {
    globalThis.fetch = createApiMock([
      {
        method: "GET",
        pattern: /^\/products$/,
        handler: () => ({ status: 200, json: { products: [] } }),
      },
    ]);
  });

  it("names the publisher and the hosts in the legal notice", () => {
    renderWithProviders(<LegalNotice />);

    expect(
      screen.getByRole("heading", { name: "Mentions légales" }),
    ).toBeInTheDocument();
    expect(screen.getByText(/Vercel Inc\./)).toBeInTheDocument();
    expect(screen.getByText(/Render Services, Inc\./)).toBeInTheDocument();
  });

  it("lists each processing with its legal basis and retention period", () => {
    renderWithProviders(<PrivacyPolicy />);

    expect(
      screen.getByRole("rowheader", { name: "Mesure d'audience" }),
    ).toBeInTheDocument();
    expect(screen.getByText("Consentement (bandeau cookies)")).toBeInTheDocument();
    expect(
      screen.getByText("10 ans (article L123-22 du Code de commerce)"),
    ).toBeInTheDocument();
  });

  it("explains how to exercise one's rights", () => {
    renderWithProviders(<PrivacyPolicy />);

    expect(
      screen.getByRole("link", { name: "formulaire de demande" }),
    ).toHaveAttribute("href", "/mes-donnees");
  });
});
