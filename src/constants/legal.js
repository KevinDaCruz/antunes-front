// Informations légales affichées dans les mentions légales et la politique
// de confidentialité. Un seul endroit à modifier si elles évoluent.
export const PUBLISHER = {
  name: "Kevin Da Cruz",
  context:
    "Projet réalisé dans le cadre de la certification Développeur Web Full Stack (RNCP 38606), Cloud Campus.",
  // Renseignée sur Vercel ; sans elle, on renvoie vers le formulaire RGPD.
  contactEmail: import.meta.env.VITE_CONTACT_EMAIL,
};

export const HOSTS = [
  {
    role: "Hébergement du site (front-end)",
    name: "Vercel Inc.",
    address: "440 N Barranca Ave #4133, Covina, CA 91723, États-Unis",
    website: "https://vercel.com",
  },
  {
    role: "Hébergement de l'API (back-end)",
    name: "Render Services, Inc.",
    address: "525 Brannan Street, Suite 300, San Francisco, CA 94107, États-Unis",
    website: "https://render.com",
  },
  {
    role: "Hébergement de la base de données",
    name: "MongoDB, Inc. (MongoDB Atlas)",
    address: "1633 Broadway, 38th Floor, New York, NY 10019, États-Unis",
    website: "https://www.mongodb.com",
  },
];

export const PRIVACY_REQUEST_TYPES = [
  { value: "access", label: "Accéder à mes données" },
  { value: "rectification", label: "Corriger mes données" },
  { value: "erasure", label: "Supprimer mes données" },
  { value: "portability", label: "Récupérer mes données (portabilité)" },
  { value: "opposition", label: "M'opposer à un traitement" },
];
