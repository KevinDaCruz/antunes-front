const wholeFormatter = new Intl.NumberFormat("fr-FR", {
  style: "currency",
  currency: "EUR",
  maximumFractionDigits: 0,
});
const centsFormatter = new Intl.NumberFormat("fr-FR", {
  style: "currency",
  currency: "EUR",
});

// 950 → "950 €", 48.2 → "48,20 €" (espace insécable avant le symbole,
// comme en français). Les centimes ne s'affichent que s'il y en a.
export function formatPrice(amount) {
  return Number.isInteger(amount)
    ? wholeFormatter.format(amount)
    : centsFormatter.format(amount);
}
