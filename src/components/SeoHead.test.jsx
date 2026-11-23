import { afterEach, describe, expect, it } from "vitest";
import { render } from "@testing-library/react";
import SeoHead from "./SeoHead";

describe("SeoHead", () => {
  afterEach(() => {
    document.head.innerHTML = "";
  });

  it("updates the existing description instead of adding a second one", () => {
    document.head.innerHTML =
      '<meta name="description" content="Par défaut" />';

    render(<SeoHead title="Catalogue" description="Toutes les annonces" />);

    expect(document.title).toBe("Catalogue | Antunes");
    const descriptions = document.head.querySelectorAll(
      'meta[name="description"]',
    );
    expect(descriptions).toHaveLength(1);
    expect(descriptions[0]).toHaveAttribute("content", "Toutes les annonces");
  });

  it("asks search engines to skip private pages", () => {
    const { rerender } = render(
      <SeoHead title="Mon compte" description="Espace membre" noIndex />,
    );

    expect(document.head.querySelector('meta[name="robots"]')).toHaveAttribute(
      "content",
      "noindex, nofollow",
    );

    rerender(<SeoHead title="Catalogue" description="Toutes les annonces" />);

    expect(document.head.querySelector('meta[name="robots"]')).toBeNull();
  });

  it("declares the canonical URL and the structured data of the page", () => {
    const { unmount } = render(
      <SeoHead
        title="iPhone"
        description="Fiche"
        structuredData={{ "@type": "Product", name: "iPhone" }}
      />,
    );

    expect(
      document.head.querySelector('link[rel="canonical"]'),
    ).toHaveAttribute(
      "href",
      window.location.origin + window.location.pathname,
    );
    const script = document.head.querySelector(
      'script[type="application/ld+json"]',
    );
    expect(JSON.parse(script.textContent).name).toBe("iPhone");

    unmount();

    expect(
      document.head.querySelector('script[type="application/ld+json"]'),
    ).toBeNull();
  });
});
