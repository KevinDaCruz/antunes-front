// Même règle que l'API (antunes-back, src/utils/pricing.js) : 5 % du prix
// + 0,70 €, calculés en centimes. Sert uniquement à l'aperçu pendant la
// saisie d'une annonce : le montant facturé est toujours calculé par l'API.
const SERVICE_FEE_RATE = 0.05;
const SERVICE_FEE_FIXED_CENTS = 70;

export function computeBuyerTotal(price) {
  const priceCents = Math.round(price * 100);
  const feeCents =
    Math.round(priceCents * SERVICE_FEE_RATE) + SERVICE_FEE_FIXED_CENTS;
  return (priceCents + feeCents) / 100;
}
