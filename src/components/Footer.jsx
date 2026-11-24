import { Link } from "react-router-dom";
import { LockKeyhole } from "lucide-react";
import Logo from "./Logo";

const COLUMNS = [
  {
    title: "Acheter",
    links: [
      { to: "/catalog", label: "Catalogue" },
      { to: "/catalog?category=Smartphones", label: "Smartphones" },
      { to: "/catalog?category=PC%20portables", label: "PC portables" },
      { to: "/favorites", label: "Favoris" },
    ],
  },
  {
    title: "Vendre",
    links: [
      { to: "/sell", label: "Déposer une annonce" },
      { to: "/account", label: "Mon compte" },
      { to: "/messages", label: "Messagerie" },
      { to: "/signup", label: "Inscription" },
    ],
  },
];

const LEGAL_LINKS = [
  { to: "/mentions-legales", label: "Mentions légales" },
  { to: "/confidentialite", label: "Politique de confidentialité" },
  { to: "/mes-donnees", label: "Mes données personnelles" },
];

const LINK = "font-semibold hover:text-pink hover:underline";

// onManageCookies n'est fourni que si un outil de mesure d'audience est
// actif : c'est lui qui rouvre le bandeau de consentement.
function Footer({ onManageCookies }) {
  const year = new Date().getFullYear();

  return (
    <footer className="mt-24 border-t-3 border-ink bg-ink text-cream">
      <div className="mx-auto grid max-w-7xl gap-12 px-6 py-16 md:grid-cols-[1.4fr_1fr_1fr_1fr]">
        <div>
          <Logo onDark />
          <p className="mt-5 max-w-xs text-[15px] leading-relaxed text-cream/80">
            La place de marché de la tech d&apos;occasion entre particuliers.
            Des prix transparents, un paiement sécurisé, et des appareils qui
            servent plus longtemps.
          </p>
        </div>

        {COLUMNS.map((column) => (
          <nav key={column.title} aria-label={column.title}>
            <p className="text-sm font-black tracking-wide text-yellow uppercase">
              {column.title}
            </p>
            <ul className="mt-4 space-y-2.5 text-[15px]">
              {column.links.map((link) => (
                <li key={link.to}>
                  <Link to={link.to} className={LINK}>
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>
        ))}

        <nav aria-label="Informations légales">
          <p className="text-sm font-black tracking-wide text-yellow uppercase">
            Aide et légal
          </p>
          <ul className="mt-4 space-y-2.5 text-[15px]">
            {LEGAL_LINKS.map((link) => (
              <li key={link.to}>
                <Link to={link.to} className={LINK}>
                  {link.label}
                </Link>
              </li>
            ))}
            {onManageCookies ? (
              <li>
                <button
                  type="button"
                  className={`${LINK} text-left`}
                  onClick={onManageCookies}
                >
                  Gérer les cookies
                </button>
              </li>
            ) : null}
          </ul>
        </nav>
      </div>

      <div className="border-t-2 border-cream/20">
        <div className="mx-auto flex max-w-7xl flex-col gap-2 px-6 py-6 text-sm text-cream/70 sm:flex-row sm:justify-between">
          <p>
            © {year} Antunes. Projet de mémoire de Kevin Da Cruz, titre RNCP
            Développeur Full Stack.
          </p>
          <p className="flex items-center gap-1.5">
            <LockKeyhole className="size-4" aria-hidden="true" />
            Paiements traités par Stripe, aucune donnée bancaire stockée.
          </p>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
