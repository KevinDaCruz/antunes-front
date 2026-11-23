import { useEffect } from "react";

const SITE_NAME = "Antunes";

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

function SeoHead({ title, description, noIndex = false }) {
  useEffect(() => {
    document.title = `${title} | ${SITE_NAME}`;
    setMetaContent("description", description);

    if (noIndex) {
      setMetaContent("robots", "noindex, nofollow");
      return undefined;
    }

    document.head.querySelector('meta[name="robots"]')?.remove();
    return undefined;
  }, [title, description, noIndex]);

  return null;
}

export default SeoHead;
