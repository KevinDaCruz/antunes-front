// Données structurées schema.org d'une annonce, lues par les moteurs de
// recherche pour afficher le prix et la disponibilité dans les résultats.
const CONDITIONS = {
  Neuf: "https://schema.org/NewCondition",
  Reconditionné: "https://schema.org/RefurbishedCondition",
};

export function buildProductStructuredData(product, url) {
  return {
    "@context": "https://schema.org",
    "@type": "Product",
    name: product.name,
    brand: { "@type": "Brand", name: product.brand },
    category: product.category,
    description: product.description,
    image: product.imageUrl,
    offers: {
      "@type": "Offer",
      url,
      price: product.price,
      priceCurrency: "EUR",
      itemCondition:
        CONDITIONS[product.condition] ?? "https://schema.org/UsedCondition",
      availability:
        product.status === "sold"
          ? "https://schema.org/SoldOut"
          : "https://schema.org/InStock",
    },
  };
}
