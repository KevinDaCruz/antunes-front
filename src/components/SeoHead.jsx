import { useEffect } from "react";
import { prerenderedHead } from "../utils/prerenderedHead";

const SITE_NAME = "Antunes";
const STRUCTURED_DATA_ID = "seo-structured-data";

// Met à jour les balises déjà présentes dans index.html au lieu d'en ajouter
// de nouvelles : une page ne doit contenir qu'un seul <title> et une seule
// meta description (sinon le HTML n'est plus valide au sens du W3C).
function setMetaContent(name, content) {
  let meta = document.head.querySelector(`meta[name="${name}"]`);

  if (!meta) {
    meta = document.createElement("meta");
    meta.setAttribute("name", name);
    document.head.appendChild(meta);
  }

  meta.setAttribute("content", content);
}

// URL de référence de la page, sans paramètres de filtre ni de suivi :
// évite que plusieurs adresses soient vues comme du contenu dupliqué.
function setCanonicalUrl() {
  let link = document.head.querySelector('link[rel="canonical"]');

  if (!link) {
    link = document.createElement("link");
    link.setAttribute("rel", "canonical");
    document.head.appendChild(link);
  }

  link.setAttribute("href", window.location.origin + window.location.pathname);
}

function setStructuredData(json) {
  document.getElementById(STRUCTURED_DATA_ID)?.remove();

  if (!json) {
    return;
  }

  const script = document.createElement("script");
  script.id = STRUCTURED_DATA_ID;
  script.type = "application/ld+json";
  script.textContent = json;
  document.head.appendChild(script);
}

function SeoHead({ title, description, noIndex = false, structuredData }) {
  // Comparé sous forme de texte : la page recrée l'objet à chaque rendu.
  const structuredDataJson = structuredData
    ? JSON.stringify(structuredData)
    : null;

  if (typeof document === "undefined") {
    Object.assign(prerenderedHead, {
      title: `${title} | ${SITE_NAME}`,
      description,
      noIndex,
      structuredDataJson,
    });
  }

  useEffect(() => {
    document.title = `${title} | ${SITE_NAME}`;
    setMetaContent("description", description);
    setCanonicalUrl();

    if (noIndex) {
      setMetaContent("robots", "noindex, nofollow");
    } else {
      document.head.querySelector('meta[name="robots"]')?.remove();
    }
  }, [title, description, noIndex]);

  useEffect(() => {
    setStructuredData(structuredDataJson);
    return () => setStructuredData(null);
  }, [structuredDataJson]);

  return null;
}

export default SeoHead;
