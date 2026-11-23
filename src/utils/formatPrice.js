const priceFormatter = new Intl.NumberFormat("fr-FR", {
  style: "currency",
  currency: "EUR",
});

// 48.2 → "48,20 €" (espace insécable avant le symbole, comme en français).
export function formatPrice(amount) {
  return priceFormatter.format(amount);
}
