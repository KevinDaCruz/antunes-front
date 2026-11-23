// Mémorise le choix de l'utilisateur concernant les cookies de mesure
// d'audience. La CNIL recommande de redemander le consentement au bout
// de 6 mois : un choix plus ancien est considéré comme absent.
const CONSENT_STORAGE_KEY = "antunes-cookie-consent";
const CONSENT_LIFETIME_MS = 6 * 30 * 24 * 60 * 60 * 1000;

export function readConsent() {
  const rawValue = window.localStorage.getItem(CONSENT_STORAGE_KEY);

  if (!rawValue) {
    return null;
  }

  try {
    const consent = JSON.parse(rawValue);
    const age = Date.now() - new Date(consent.decidedAt).getTime();

    return age < CONSENT_LIFETIME_MS ? consent : null;
  } catch {
    return null;
  }
}

export function saveConsent({ analytics }) {
  const consent = { analytics, decidedAt: new Date().toISOString() };
  window.localStorage.setItem(CONSENT_STORAGE_KEY, JSON.stringify(consent));
  return consent;
}
