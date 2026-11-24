import { describe, expect, it } from "vitest";
import { formatPrice } from "./formatPrice";

describe("formatPrice", () => {
  it("formats an amount in euros the French way", () => {
    // Intl insère des espaces insécables : on les normalise pour comparer.
    expect(formatPrice(48.2).replace(/\s/g, " ")).toBe("48,20 €");
    expect(formatPrice(1250.5).replace(/\s/g, " ")).toBe("1 250,50 €");
  });

  it("drops the cents for a round price", () => {
    expect(formatPrice(950).replace(/\s/g, " ")).toBe("950 €");
  });
});
