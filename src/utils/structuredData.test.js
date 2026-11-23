import { describe, expect, it } from "vitest";
import { buildProductStructuredData } from "./structuredData";

const PRODUCT = {
  name: "iPhone 15 Pro",
  brand: "Apple",
  category: "Smartphones",
  condition: "Reconditionné",
  price: 950,
  status: "available",
};

describe("buildProductStructuredData", () => {
  it("describes the offer with its price, condition and availability", () => {
    const data = buildProductStructuredData(
      PRODUCT,
      "https://antunes.test/p/1",
    );

    expect(data["@type"]).toBe("Product");
    expect(data.brand.name).toBe("Apple");
    expect(data.offers).toMatchObject({
      price: 950,
      priceCurrency: "EUR",
      itemCondition: "https://schema.org/RefurbishedCondition",
      availability: "https://schema.org/InStock",
    });
  });

  it("marks a sold item as sold out and a second-hand item as used", () => {
    const data = buildProductStructuredData(
      { ...PRODUCT, condition: "Bon état", status: "sold" },
      "https://antunes.test/p/1",
    );

    expect(data.offers.availability).toBe("https://schema.org/SoldOut");
    expect(data.offers.itemCondition).toBe("https://schema.org/UsedCondition");
  });
});
