import { afterEach, describe, expect, it, vi } from "vitest";
import userEvent from "@testing-library/user-event";
import { render, screen } from "@testing-library/react";
import AddressAutocomplete from "./AddressAutocomplete";

describe("AddressAutocomplete", () => {
  afterEach(() => {
    vi.restoreAllMocks();
    vi.useRealTimers();
  });

  it("does not query the API for a short input", async () => {
    globalThis.fetch = vi.fn();
    const user = userEvent.setup();
    render(<AddressAutocomplete onSelect={() => {}} />);

    await user.type(screen.getByRole("combobox"), "Pa");

    expect(globalThis.fetch).not.toHaveBeenCalled();
  });

  it("shows suggestions returned by the API and selects one", async () => {
    globalThis.fetch = vi.fn().mockResolvedValue({
      ok: true,
      json: async () => ({
        features: [
          { properties: { id: "1", label: "1 Rue de Paris 75001 Paris" } },
        ],
      }),
    });

    const handleSelect = vi.fn();
    const user = userEvent.setup();
    render(<AddressAutocomplete onSelect={handleSelect} />);

    await user.type(screen.getByRole("combobox"), "1 rue de Paris");

    const suggestion = await screen.findByText("1 Rue de Paris 75001 Paris");
    await user.click(suggestion);

    expect(handleSelect).toHaveBeenCalledWith("1 Rue de Paris 75001 Paris");
    expect(screen.getByRole("combobox")).toHaveValue(
      "1 Rue de Paris 75001 Paris",
    );
  });

  it("shows an error message when the API call fails", async () => {
    globalThis.fetch = vi.fn().mockRejectedValue(new Error("network error"));
    const user = userEvent.setup();
    render(<AddressAutocomplete onSelect={() => {}} />);

    await user.type(screen.getByRole("combobox"), "1 rue de Paris");

    expect(
      await screen.findByText("Recherche d'adresse indisponible pour le moment."),
    ).toBeInTheDocument();
  });
});
