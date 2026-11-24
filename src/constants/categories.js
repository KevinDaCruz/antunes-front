// Chaque catégorie a une couleur de fond et une illustration, reprises sur
// les cartes d'annonces, les tuiles de l'accueil et la messagerie.
export const CATEGORY_STYLES = {
  Smartphones: { slug: "smartphones", tint: "bg-yellow" },
  "PC portables": { slug: "pc-portables", tint: "bg-sky" },
  "PC fixes": { slug: "pc-fixes", tint: "bg-mint" },
  Composants: { slug: "composants", tint: "bg-lilac" },
  "Cartes graphiques": { slug: "cartes-graphiques", tint: "bg-peach" },
  Consoles: { slug: "consoles", tint: "bg-mint" },
  "Jeux vidéo": { slug: "jeux-video", tint: "bg-sky" },
  Manettes: { slug: "manettes", tint: "bg-yellow" },
  "SSD & stockage": { slug: "ssd-stockage", tint: "bg-lilac" },
  "Réseau & Wi-Fi": { slug: "reseau-wifi", tint: "bg-peach" },
  Audio: { slug: "audio", tint: "bg-pink-light" },
  Accessoires: { slug: "accessoires", tint: "bg-mint" },
};

const DEFAULT_STYLE = { slug: "accessoires", tint: "bg-cream-deep" };

export function getCategoryStyle(category) {
  return CATEGORY_STYLES[category] ?? DEFAULT_STYLE;
}

export function getCategoryIllustration(category) {
  return `/illustrations/${getCategoryStyle(category).slug}.svg`;
}

// Couleur du badge selon l'état de l'appareil.
export const CONDITION_STYLES = {
  Neuf: "bg-mint",
  Reconditionné: "bg-sky",
  "Bon état": "bg-yellow",
  Occasion: "bg-white",
};
