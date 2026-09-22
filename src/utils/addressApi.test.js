import { afterEach, describe, expect, it, vi } from "vitest";
import { searchAddress } from "./addressApi";

describe("searchAddress", () => {
  afterEach(() => {
    vi.restoreAllMocks();
  });

  it("returns an empty array for a query shorter than 3 characters", async () => {
    const results = await searchAddress("Pa");

    expect(results).toEqual([]);
  });

  it("maps the API response to a simplified shape", async () => {
    globalThis.fetch = vi.fn().mockResolvedValue({
      ok: true,
      json: async () => ({
        features: [
          {
            properties: { id: "1", label: "1 Rue de Paris 75001 Paris" },
          },
        ],
      }),
    });

    const results = await searchAddress("1 rue de Paris");

    expect(globalThis.fetch).toHaveBeenCalledOnce();
    expect(results).toEqual([
      { id: "1", label: "1 Rue de Paris 75001 Paris" },
    ]);
  });

  it("throws when the API responds with an error status", async () => {
    globalThis.fetch = vi.fn().mockResolvedValue({ ok: false });

    await expect(searchAddress("1 rue de Paris")).rejects.toThrow();
  });
});
